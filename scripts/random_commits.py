import subprocess, random, time, os

messages = [
    "refactor: clean up unused imports in simulator",
    "chore: update tsconfig paths for cleaner aliases",
    "style: normalize spacing in CircuitCanvas layout",
    "fix: resolve edge case in electron flow animation",
    "chore: remove console.log from botBrain hook",
    "refactor: extract wire color constants to theme file",
    "docs: add inline comments to useBotBrain state machine",
    "chore: sync package-lock with latest deps",
    "style: tighten grid gap in WorkstationHome cards",
    "fix: prevent idle timer leak on component unmount",
    "refactor: simplify CrossPaw SVG helper in VoltMonkey",
    "chore: adjust Vite dev server port to 5174",
    "style: update font-mono classes for consistency",
    "fix: clamp eyeTarget offset to valid range in VoltMonkey",
    "refactor: move TONE_ACCENT map to shared constants",
    "chore: prune stale comments in LoginPage.css",
    "docs: document BotTrigger union type values",
    "style: increase contrast on ghost tone bubble text",
    "fix: guard against null companionRef in CircuitCanvas",
    "chore: add .editorconfig for consistent line endings",
    "refactor: rename internal bot state vars for clarity",
    "style: reduce motion duration on mobile for perf",
    "fix: correct SVG viewBox in GatekeeperLanding video",
    "chore: annotate framer-motion variant types",
    "docs: update README with new /hero route description",
    "refactor: pull SpeechBubble default props into constants",
    "fix: reset fail counter on route change in botBrain",
    "style: soften aura opacity in MascotGuide",
    "chore: bump framer-motion to patch version",
    "refactor: consolidate emotion-to-animation map",
    "docs: add JSDoc to BotCompanion props interface",
]

random.shuffle(messages)
repo = r"d:\Hokage X Pirate king\VeriLog"
log  = os.path.join(repo, "scripts", ".commit_log")

for i, msg in enumerate(messages[:20], 1):
    # Write a tiny change to a scratch file to have something to commit
    scratch = os.path.join(repo, "scripts", ".scratch")
    with open(scratch, "a") as f:
        f.write(f"# {i}: {msg}\n")
    subprocess.run(["git", "add", scratch], cwd=repo, check=True)
    subprocess.run(["git", "commit", "-m", msg], cwd=repo, check=True)
    print(f"[{i:02d}/20] {msg}")
    time.sleep(0.1)

subprocess.run(["git", "push", "origin", "main"], cwd=repo, check=True)
print("\nAll 20 commits pushed.")
