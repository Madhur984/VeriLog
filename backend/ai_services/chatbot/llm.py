"""In-process LLM via HuggingFace transformers.

No external daemon needed. The model auto-downloads from the Hugging Face Hub
on first use and is cached under ~/.cache/huggingface. Streaming is provided
by transformers.TextIteratorStreamer pumped from a background thread into the
async event loop via a queue.

If a LoRA adapter exists at chatbot/lora_adapter/ (produced by train_lora.py),
it is loaded on top of the base model automatically.
"""

from __future__ import annotations

import asyncio
import logging
import os
import threading
from functools import lru_cache
from pathlib import Path
from typing import AsyncIterator, Iterable, Optional

from .config import (
    HF_MODEL_ID,
    HF_MODEL_DTYPE,
    HF_MAX_NEW_TOKENS,
    HF_DEVICE_PREFERENCE,
    HF_DO_SAMPLE,
    HF_EAGER_LOAD,
    LORA_ADAPTER_DIR,
)

log = logging.getLogger(__name__)


class LLMUnavailable(RuntimeError):
    pass


# Keep the old name so other modules that import OllamaUnavailable still work.
OllamaUnavailable = LLMUnavailable


# --- Lazy model load -------------------------------------------------------

_load_lock = threading.Lock()
_load_state: dict = {"loading": False, "loaded": False, "error": None}


@lru_cache(maxsize=1)
def _load_model_and_tokenizer():
    """Heavy import. Cached for process lifetime. Raises LLMUnavailable on failure."""
    with _load_lock:
        _load_state["loading"] = True
        try:
            import torch
            from transformers import AutoModelForCausalLM, AutoTokenizer

            device = _select_device()
            dtype = _select_dtype(device)

            log.info("Loading model %s on %s (dtype=%s) …", HF_MODEL_ID, device, dtype)
            tokenizer = AutoTokenizer.from_pretrained(HF_MODEL_ID)
            model = AutoModelForCausalLM.from_pretrained(
                HF_MODEL_ID,
                torch_dtype=dtype,
                low_cpu_mem_usage=True,
            )
            model.to(device)
            model.eval()

            # Optional: attach LoRA adapter if present.
            adapter = Path(LORA_ADAPTER_DIR)
            if (adapter / "adapter_config.json").exists():
                try:
                    from peft import PeftModel
                    model = PeftModel.from_pretrained(model, str(adapter))
                    log.info("LoRA adapter attached from %s", adapter)
                except Exception as e:
                    log.warning("LoRA adapter present but failed to load: %s", e)

            if tokenizer.pad_token_id is None:
                tokenizer.pad_token_id = tokenizer.eos_token_id

            _load_state["loaded"] = True
            _load_state["loading"] = False
            return tokenizer, model, device
        except Exception as e:
            _load_state["error"] = str(e)
            _load_state["loading"] = False
            log.exception("Failed to load model")
            raise LLMUnavailable(f"Failed to load model {HF_MODEL_ID}: {e}") from e


def _select_device() -> str:
    import torch
    pref = (HF_DEVICE_PREFERENCE or "auto").lower()
    if pref == "cpu":
        return "cpu"
    if pref == "cuda":
        if not torch.cuda.is_available():
            raise LLMUnavailable("HF_DEVICE_PREFERENCE=cuda but no CUDA device found.")
        return "cuda"
    # auto
    if torch.cuda.is_available():
        return "cuda"
    return "cpu"


def _select_dtype(device: str):
    import torch
    pref = (HF_MODEL_DTYPE or "auto").lower()
    if pref == "fp32":
        return torch.float32
    if pref == "fp16":
        return torch.float16
    if pref == "bf16":
        return torch.bfloat16
    # auto: fp16 on GPU, fp32 on CPU (fp16 on CPU is slow + may upcast).
    return torch.float16 if device == "cuda" else torch.float32


# --- Chat formatting -------------------------------------------------------

def _format_chat(messages: list[dict], system: Optional[str], tokenizer) -> str:
    """Prepend system if provided, render via chat template."""
    msgs = list(messages)
    if system:
        msgs = [{"role": "system", "content": system}, *msgs]
    return tokenizer.apply_chat_template(
        msgs,
        tokenize=False,
        add_generation_prompt=True,
    )


# --- Streaming ------------------------------------------------------------

async def chat_stream(
    messages: Iterable[dict],
    *,
    model: Optional[str] = None,  # accepted for backwards compat; ignored
    system: Optional[str] = None,
    temperature: float = 0.3,
    max_new_tokens: Optional[int] = None,
) -> AsyncIterator[str]:
    """Yield assistant token deltas. Runs blocking generate() in a thread,
    pumps a TextIteratorStreamer into an asyncio.Queue.
    """
    try:
        tokenizer, mdl, device = await asyncio.to_thread(_load_model_and_tokenizer)
    except LLMUnavailable as e:
        raise e

    from transformers import TextIteratorStreamer

    prompt = _format_chat(list(messages), system, tokenizer)
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    streamer = TextIteratorStreamer(
        tokenizer,
        skip_prompt=True,
        skip_special_tokens=True,
    )

    # On CPU, greedy decoding is faster and more accurate for factual Q&A.
    # Sampling kicks in only if explicitly requested via HF_DO_SAMPLE=1.
    use_sampling = HF_DO_SAMPLE and temperature > 0
    gen_kwargs = dict(
        **inputs,
        streamer=streamer,
        max_new_tokens=max_new_tokens or HF_MAX_NEW_TOKENS,
        do_sample=use_sampling,
        pad_token_id=tokenizer.pad_token_id,
    )
    if use_sampling:
        gen_kwargs["temperature"] = max(temperature, 0.01)
        gen_kwargs["top_p"] = 0.9

    loop = asyncio.get_event_loop()
    queue: asyncio.Queue = asyncio.Queue()
    SENTINEL: object = object()

    def producer():
        try:
            mdl.generate(**gen_kwargs)
        except Exception as exc:
            asyncio.run_coroutine_threadsafe(queue.put(exc), loop)
        finally:
            asyncio.run_coroutine_threadsafe(queue.put(SENTINEL), loop)

    def pump():
        for token in streamer:
            asyncio.run_coroutine_threadsafe(queue.put(token), loop)

    threading.Thread(target=producer, daemon=True).start()
    threading.Thread(target=pump, daemon=True).start()

    while True:
        item = await queue.get()
        if item is SENTINEL:
            return
        if isinstance(item, Exception):
            raise LLMUnavailable(f"Generation failed: {item}") from item
        if item:
            yield item


# --- Non-streaming --------------------------------------------------------

async def chat_complete(
    messages: Iterable[dict],
    *,
    model: Optional[str] = None,
    system: Optional[str] = None,
    temperature: float = 0.3,
    json_only: bool = False,
    max_new_tokens: Optional[int] = None,
) -> str:
    """Collect the full assistant reply as one string. Used for storyboard JSON."""
    if json_only and not system:
        system = "You output ONLY a valid JSON object. No prose, no markdown fences."
    chunks: list[str] = []
    async for delta in chat_stream(
        messages,
        system=system,
        temperature=temperature,
        max_new_tokens=max_new_tokens,
    ):
        chunks.append(delta)
    return "".join(chunks).strip()


# --- Health ---------------------------------------------------------------

async def healthcheck() -> dict:
    """Reports current model status without forcing a load.

    Fields are intentionally Ollama-shaped so the existing frontend banner
    works unchanged: `ok`, `default_model`, `model_pulled`.
    """
    import os

    info: dict = {
        "engine": "transformers",
        "default_model": HF_MODEL_ID,
        "host": "in-process",
        "loaded": _load_state["loaded"],
        "loading": _load_state["loading"],
        "error": _load_state["error"],
    }
    try:
        import torch
        info["cuda_available"] = torch.cuda.is_available()
        if info["cuda_available"]:
            info["cuda_device"] = torch.cuda.get_device_name(0)
    except Exception:
        info["cuda_available"] = False

    # Compatibility fields the existing frontend reads:
    info["ok"] = info["loaded"] or info["loading"] or info["error"] is None
    info["model_pulled"] = _model_cached_on_disk()
    if not info["model_pulled"]:
        info["error"] = (info["error"]
                         or "Model files not downloaded yet. They auto-download on first chat.")
        info["ok"] = False
    return info


def _model_cached_on_disk() -> bool:
    """Heuristic: HF cache dir contains a complete snapshot for our model id."""
    cache = Path(os.environ.get("HF_HOME") or
                 Path.home() / ".cache" / "huggingface")
    safe_id = HF_MODEL_ID.replace("/", "--")
    target = cache / "hub" / f"models--{safe_id}"
    if not target.exists():
        return False
    # Look in snapshots/ for a finalized safetensors or pytorch bin file.
    snaps = target / "snapshots"
    if not snaps.exists():
        return False
    has_weights = any(snaps.rglob("*.safetensors")) or any(snaps.rglob("pytorch_model*.bin"))
    return has_weights
