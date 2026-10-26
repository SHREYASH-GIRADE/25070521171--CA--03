@echo off
title ShopSphere Launcher
echo ===================================================
echo           Starting ShopSphere Full-Stack App
echo ===================================================
echo.

echo 1. Starting Backend Server on port 5000...
start "ShopSphere Backend (Port 5000)" cmd /k "cd /d %~dp0server && node server.js"

echo 2. Starting Frontend Client on port 5173...
start "ShopSphere Frontend (Port 5173)" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Waiting 3 seconds for servers to initialize...
timeout /t 3 /nobreak >nul

echo 3. Opening ShopSphere in your default browser...
start http://localhost:5173

echo.
echo ===================================================
echo  ShopSphere is LIVE! Keep the two windows open.
echo ===================================================
pause
