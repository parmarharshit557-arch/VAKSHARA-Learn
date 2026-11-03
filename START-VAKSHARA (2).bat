@echo off
setlocal
cd /d "%~dp0vakshara_learn"
title VAKSHARA Learn - Teaching Rebuild
set VAK_PORT=8766
where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://127.0.0.1:%VAK_PORT%/"
  py -m http.server %VAK_PORT% --bind 127.0.0.1
) else (
  where python >nul 2>nul
  if %errorlevel%==0 (
    start "" "http://127.0.0.1:%VAK_PORT%/"
    python -m http.server %VAK_PORT% --bind 127.0.0.1
  ) else (
    echo Python was not found. Install Python or open this folder in Command Prompt.
    echo Then run: py -m http.server %VAK_PORT% --bind 127.0.0.1
    pause
  )
)
endlocal
