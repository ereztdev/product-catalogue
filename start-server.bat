@echo off
echo Stopping any existing Node.js processes on port 3000...

REM Kill any processes using port 3000
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Killing process %%a
    taskkill /PID %%a /F >nul 2>&1
)

REM Kill any remaining Node.js processes
taskkill /IM node.exe /F >nul 2>&1

echo Port 3000 is now free!
echo Starting server...

cd backend
npm start
