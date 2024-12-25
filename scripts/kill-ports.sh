#!/bin/bash

# List of ports to check and kill
ports=(3000 3001)

for port in "${ports[@]}"; do
  echo "Checking for processes on port $port..."
  pid=$(lsof -ti :$port) # Find the PID of the process using the port
  if [ -n "$pid" ]; then
    echo "Found process $pid on port $port. Killing it..."
    kill -9 $pid
    echo "Process $pid on port $port killed."
  else
    echo "No process found on port $port."
  fi
done
