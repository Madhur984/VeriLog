#!/usr/bin/env python3
"""
GitHub repository loader module built on LangChain's GitLoader.

Clones (or opens) a GitHub repository and returns its source files as
LangChain ``Document`` objects, skipping build/vendor/cache directories
via a configurable ignore list.

Configuration lives in ``config/rag_config.py``:
    * ``GITHUB_DEFAULT_REPO_URL``  — repository cloned when none is given.
    * ``GITHUB_DEFAULT_BRANCH``    — branch checked out by default.
    * ``GITHUB_IGNORE_DIRS``       — directory/file names to skip.
    * ``GITHUB_FILE_EXTENSIONS``   — file types to index.

Usage:
    from rag.github_loader import load_github_repo

    docs = load_github_repo()                       # default repo from config
    docs = load_github_repo("https://github.com/user/repo", branch="dev")

CLI (standalone):
    python rag/github_loader.py --repo https://github.com/Madhur984/VeriLog --branch main
"""

import argparse
import logging
import shutil
import sys
import tempfile
from pathlib import Path
from typing import Callable, List, Optional, Sequence

from langchain_community.document_loaders import GitLoader
from langchain_core.documents import Document

# Allow standalone execution (python rag/github_loader.py) by putting the
# ai_services package root on sys.path, mirroring index_repo.py / index_routes.py.
if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

try:
    from ..config.rag_config import (
        GITHUB_DEFAULT_BRANCH,
        GITHUB_DEFAULT_REPO_URL,
        GITHUB_FILE_EXTENSIONS,
        GITHUB_IGNORE_DIRS,
    )
except ImportError:  # standalone execution with ai_services/ on sys.path
    from config.rag_config import (
        GITHUB_DEFAULT_BRANCH,
        GITHUB_DEFAULT_REPO_URL,
        GITHUB_FILE_EXTENSIONS,
        GITHUB_IGNORE_DIRS,
    )

logger = logging.getLogger(__name__)


def _path_parts(file_path: str) -> List[str]:
    """Split a file path into normalized (lowercased) components."""
    return [part.lower() for part in Path(file_path).parts]


def should_ignore(file_path: str, ignore_dirs: Sequence[str] = GITHUB_IGNORE_DIRS) -> bool:
    """
    Return True if any component of ``file_path`` matches an ignored name.

    Matching is done on individual path segments, so ``node_modules`` is
    skipped wherever it appears in the tree (e.g. ``app/node_modules/x.js``
    or ``backend/node_modules/y.js``).
    """
    ignored = {name.lower() for name in ignore_dirs}
    return any(part in ignored for part in _path_parts(file_path))


def _make_file_filter(
    ignore_dirs: Sequence[str],
    file_extensions: Optional[Sequence[str]],
) -> Callable[[str], bool]:
    """Build the GitLoader ``file_filter`` combining ignore + extension rules."""
    ignore_set = {name.lower() for name in ignore_dirs}
    ext_set = {ext.lower() for ext in file_extensions} if file_extensions else None

    def file_filter(file_path: str) -> bool:
        # Skip any file whose path passes through an ignored directory.
        if any(part in ignore_set for part in _path_parts(file_path)):
            return False
        # Optionally restrict to whitelisted source extensions.
        if ext_set is not None and Path(file_path).suffix.lower() not in ext_set:
            return False
        return True

    return file_filter


def load_github_repo(
    clone_url: str = GITHUB_DEFAULT_REPO_URL,
    branch: str = GITHUB_DEFAULT_BRANCH,
    ignore_dirs: Optional[Sequence[str]] = None,
    file_extensions: Optional[Sequence[str]] = None,
    repo_path: Optional[str] = None,
) -> List[Document]:
    """
    Load a GitHub repository's source files as LangChain Documents.

    Args:
        clone_url: Git clone URL. Defaults to ``GITHUB_DEFAULT_REPO_URL``
            from ``config/rag_config.py``.
        branch: Branch to check out. Defaults to ``GITHUB_DEFAULT_BRANCH``.
        ignore_dirs: Directory/file names to skip at any nesting level.
            Defaults to ``GITHUB_IGNORE_DIRS`` from config.
        file_extensions: Only load files with these suffixes (e.g. ``.py``).
            Defaults to ``GITHUB_FILE_EXTENSIONS`` from config. Pass an empty
            list to load every non-ignored file.
        repo_path: Existing local checkout to load instead of cloning. Useful
            for tests or when the repo is already on disk.

    Returns:
        List of ``Document`` objects; each carries ``file_path``, ``file_name``
        and ``file_type`` metadata populated by GitLoader.

    Raises:
        Exception: propagates clone/load failures from GitLoader.
    """
    if ignore_dirs is None:
        ignore_dirs = GITHUB_IGNORE_DIRS
    if file_extensions is None:
        file_extensions = GITHUB_FILE_EXTENSIONS

    file_filter = _make_file_filter(ignore_dirs, file_extensions)

    # Load an existing checkout without cloning.
    if repo_path is not None:
        loader = GitLoader(repo_path=repo_path, branch=branch, file_filter=file_filter)
        return loader.load()

    # Clone into a throwaway temp dir and clean up afterwards.
    temp_dir = tempfile.mkdtemp(prefix="github_repo_")
    try:
        logger.info("Cloning '%s' (branch: %s)...", clone_url, branch)
        loader = GitLoader(
            repo_path=temp_dir,
            clone_url=clone_url,
            branch=branch,
            file_filter=file_filter,
        )
        docs = loader.load()
        logger.info("Loaded %d documents from %s (branch: %s)", len(docs), clone_url, branch)
        return docs
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Load a GitHub repository into LangChain documents (no embedding)."
    )
    parser.add_argument(
        "--repo",
        default=GITHUB_DEFAULT_REPO_URL,
        help="GitHub clone URL (default: from config/rag_config.py)",
    )
    parser.add_argument(
        "--branch",
        default=GITHUB_DEFAULT_BRANCH,
        help=f"Git branch (default: {GITHUB_DEFAULT_BRANCH})",
    )
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")

    docs = load_github_repo(clone_url=args.repo, branch=args.branch)
    print(f"\nLoaded {len(docs)} documents from {args.repo} (branch: {args.branch})")
    for doc in docs[:5]:
        print("  -", doc.metadata.get("file_path", "?"))


if __name__ == "__main__":
    main()
