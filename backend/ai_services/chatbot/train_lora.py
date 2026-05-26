"""LoRA fine-tuning script for the electronics tutor.

Consumes a JSONL dataset (output of chatbot.dataset) and produces a LoRA
adapter at chatbot/lora_adapter/. The next time the FastAPI server starts,
llm.py picks the adapter up automatically.

Usage:
    cd backend/ai_services

    # 1. Generate training data (one-time, can take a while)
    py -m chatbot.dataset --out training_data/electronics_qa.jsonl --limit 600

    # 2. Train (CPU works for tiny test runs; GPU strongly recommended)
    py -m chatbot.train_lora --data training_data/electronics_qa.jsonl

    # 3. Restart the FastAPI service. The adapter loads automatically.

Defaults are tuned for a 4 GB VRAM laptop and a 1.5B base model. Adjust via
flags if you have more headroom.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
from pathlib import Path

from .config import HF_MODEL_ID, LORA_ADAPTER_DIR

log = logging.getLogger(__name__)


def _load_jsonl(path: Path):
    from datasets import Dataset

    rows = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                rows.append(json.loads(line))
            except json.JSONDecodeError:
                continue
    if not rows:
        raise SystemExit(f"No usable rows in {path}")
    return Dataset.from_list(rows)


def _format_messages_to_text(example, tokenizer):
    """Render the chat conversation with the model's chat template."""
    return {
        "text": tokenizer.apply_chat_template(
            example["messages"],
            tokenize=False,
            add_generation_prompt=False,
        )
    }


def train(
    data_path: Path,
    *,
    output_dir: Path = LORA_ADAPTER_DIR,
    base_model: str = HF_MODEL_ID,
    epochs: float = 1.0,
    learning_rate: float = 2e-4,
    batch_size: int = 1,
    grad_accum: int = 16,
    lora_r: int = 16,
    lora_alpha: int = 32,
    max_seq_len: int = 1024,
    save_steps: int = 200,
) -> None:
    # Imports are inside so `--help` works even when peft/trl aren't installed.
    import torch
    from transformers import (
        AutoModelForCausalLM,
        AutoTokenizer,
        TrainingArguments,
        DataCollatorForLanguageModeling,
        Trainer,
    )
    from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

    log.info("Loading dataset from %s", data_path)
    ds = _load_jsonl(data_path)
    log.info("Dataset rows: %d", len(ds))

    log.info("Loading tokenizer + base model %s", base_model)
    tokenizer = AutoTokenizer.from_pretrained(base_model)
    if tokenizer.pad_token_id is None:
        tokenizer.pad_token = tokenizer.eos_token

    dtype = torch.float16 if torch.cuda.is_available() else torch.float32
    model = AutoModelForCausalLM.from_pretrained(
        base_model,
        torch_dtype=dtype,
        device_map="auto" if torch.cuda.is_available() else None,
    )
    model.config.use_cache = False
    try:
        model.gradient_checkpointing_enable()
    except Exception:
        pass

    # LoRA config — sane defaults for Qwen2.5-style architectures.
    lora_cfg = LoraConfig(
        r=lora_r,
        lora_alpha=lora_alpha,
        lora_dropout=0.05,
        bias="none",
        task_type="CAUSAL_LM",
        target_modules=[
            "q_proj", "k_proj", "v_proj", "o_proj",
            "gate_proj", "up_proj", "down_proj",
        ],
    )
    model = get_peft_model(model, lora_cfg)
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total = sum(p.numel() for p in model.parameters())
    log.info("Trainable params: %s / %s (%.4f%%)",
             f"{trainable:,}", f"{total:,}", 100 * trainable / total)

    ds = ds.map(lambda ex: _format_messages_to_text(ex, tokenizer), remove_columns=ds.column_names)

    def tokenize(batch):
        return tokenizer(
            batch["text"],
            truncation=True,
            max_length=max_seq_len,
            padding=False,
        )

    ds = ds.map(tokenize, batched=True, remove_columns=["text"])

    collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

    output_dir.mkdir(parents=True, exist_ok=True)
    args = TrainingArguments(
        output_dir=str(output_dir / "_checkpoints"),
        num_train_epochs=epochs,
        per_device_train_batch_size=batch_size,
        gradient_accumulation_steps=grad_accum,
        learning_rate=learning_rate,
        warmup_ratio=0.03,
        lr_scheduler_type="cosine",
        logging_steps=10,
        save_steps=save_steps,
        save_total_limit=2,
        report_to=[],
        bf16=False,
        fp16=torch.cuda.is_available(),
        optim="adamw_torch",
        remove_unused_columns=False,
    )

    trainer = Trainer(
        model=model,
        args=args,
        train_dataset=ds,
        data_collator=collator,
    )

    log.info("Starting training…")
    trainer.train()

    log.info("Saving LoRA adapter to %s", output_dir)
    model.save_pretrained(str(output_dir))
    tokenizer.save_pretrained(str(output_dir))
    log.info("Done. Restart the FastAPI service to use the new adapter.")


def _main():
    p = argparse.ArgumentParser(description="LoRA fine-tune the electronics tutor.")
    p.add_argument("--data", required=True, type=Path,
                   help="JSONL training file (output of `chatbot.dataset`).")
    p.add_argument("--out", type=Path, default=LORA_ADAPTER_DIR,
                   help="Where to save the adapter (default: chatbot/lora_adapter).")
    p.add_argument("--base-model", default=HF_MODEL_ID,
                   help="HF repo id of base model (default from config).")
    p.add_argument("--epochs", type=float, default=1.0)
    p.add_argument("--lr", type=float, default=2e-4)
    p.add_argument("--batch-size", type=int, default=1)
    p.add_argument("--grad-accum", type=int, default=16)
    p.add_argument("--lora-r", type=int, default=16)
    p.add_argument("--lora-alpha", type=int, default=32)
    p.add_argument("--max-seq-len", type=int, default=1024)
    args = p.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
    train(
        args.data,
        output_dir=args.out,
        base_model=args.base_model,
        epochs=args.epochs,
        learning_rate=args.lr,
        batch_size=args.batch_size,
        grad_accum=args.grad_accum,
        lora_r=args.lora_r,
        lora_alpha=args.lora_alpha,
        max_seq_len=args.max_seq_len,
    )


if __name__ == "__main__":
    _main()
