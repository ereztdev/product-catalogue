Write-Host "Stopping any existing Node.js processes on port 3000..." -ForegroundColor Yellow

# Kill any processes using port 3000
$processes = netstat -ano | Select-String ":3000" | ForEach-Object { ($_ -split '\s+')[4] } | Sort-Object -Unique
foreach ($pid in $processes) {
    if ($pid -and $pid -ne "0") {
        Write-Host "Killing process $pid" -ForegroundColor Red
        taskkill /PID $pid /F 2>$null
    }
}

# Kill any remaining Node.js processes
taskkill /IM node.exe /F 2>$null

Write-Host "Port 3000 is now free!" -ForegroundColor Green
Write-Host "Starting server..." -ForegroundColor Cyan

Set-Location backend
npm start
