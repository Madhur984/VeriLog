@echo off
echo Installing VeriQuest dependencies...
echo.

REM Install dependencies
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm install failed!
    echo Please check the error message above.
    pause
    exit /b 1
)

echo.
echo Installation complete!
echo.
echo Starting development server...
echo The app will open at http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start dev server
call npm run dev

pause
