@echo off
pushd "%~dp0"
call npm start
if errorlevel 1 goto failed
popd
pause
exit /b 0
:failed
echo Startup failed. See README / Baslatma basarisiz. README dosyasina bakin.
popd
pause
exit /b 1
