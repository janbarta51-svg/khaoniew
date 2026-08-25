@echo off
title Khaoniew Thai Bistro - lokalni nahled
where node >nul 2>nul
if errorlevel 1 (
  echo Pro spusteni webu je potreba nainstalovat Node.js z https://nodejs.org/
  pause
  exit /b 1
)
if not exist node_modules (
  echo Pripravuji web pri prvnim spusteni...
  call npm install
)
start "" cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:5173"
echo Web se otevre v prohlizeci. Toto okno nechejte spustene.
call npm run dev
