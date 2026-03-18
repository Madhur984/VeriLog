import sys
import json
import os
import subprocess

result = subprocess.run(['python', '.agent/skills/frontend-design/scripts/ux_audit.py', 'frontend/src/pages/ModuleOne.tsx', '--json'], capture_output=True, text=True)
try:
    data = json.loads(result.stdout)
    print("ISSUES:", data['issues'])
except Exception as e:
    print("Error:", e, "Output:", result.stdout)
