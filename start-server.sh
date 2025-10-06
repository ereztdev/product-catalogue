#!/bin/bash

echo "Stopping any existing Node.js processes on port 3000..." 

# Kill any processes using port 3000
PIDS=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PIDS" ]; then
    echo "Killing processes on port 3000: $PIDS"
    kill -9 $PIDS 2>/dev/null
fi

# Kill any remaining Node.js processes
pkill -f "node.*server.js" 2>/dev/null

echo "Port 3000 is now free!"
echo "Starting server..."

cd backend
npm start
