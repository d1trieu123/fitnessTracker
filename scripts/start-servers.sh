#!/bin/bash

start_backend(){
    echo "Starting backend server"
    cd backend
    node server.js &
    cd ..
}

start_frontend(){
    echo "Starting frontend server"
    cd frontend
    npm start &
    cd ..
}

# Call the function
start_backend
start_frontend
