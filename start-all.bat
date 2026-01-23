@echo off
echo Starting VeriQuest Backend and Frontend...
start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm run dev"
echo Servers started!
echo Frontend: http://localhost:5173 (or similar)
echo Backend:  http://localhost:3000
