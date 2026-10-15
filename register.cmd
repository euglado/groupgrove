@echo off
pushd "%~dp0"
call npm run register
if errorlevel 1 goto failed
popd
pause
exit /b 0
:failed
echo Registration failed. See README / Kayit basarisiz. README dosyasina bakin.
popd
pause
exit /b 1
