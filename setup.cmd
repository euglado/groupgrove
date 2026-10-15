@echo off
pushd "%~dp0"
call npm ci --ignore-scripts
if errorlevel 1 goto failed
call npm run setup
if errorlevel 1 goto failed
popd
pause
exit /b 0
:failed
echo Setup failed. See README / Kurulum basarisiz. README dosyasina bakin.
popd
pause
exit /b 1
