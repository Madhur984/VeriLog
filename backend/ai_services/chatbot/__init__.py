"""VeriQuest Tutor — local RAG chatbot for B.Tech electronics.

Public surface used by FastAPI app:
- router  : FastAPI APIRouter mounted under /ai/chat
- ingest_all() : reindex project content into the local/Supabase vector store
"""

# --- Import-order workaround ----------------------------------------------
# On Python 3.14 + sentence-transformers 5.x, importing sentence_transformers
# in isolation segfaults. Initializing scipy/sklearn/huggingface_hub/transformers
# first orders their shared C extensions correctly and avoids the crash.
# Order matters; do not reshuffle.
import scipy  # noqa: F401
import sklearn  # noqa: F401
import huggingface_hub  # noqa: F401
import transformers  # noqa: F401
# --------------------------------------------------------------------------

from .router import router
from .ingest import ingest_all

__all__ = ["router", "ingest_all"]
