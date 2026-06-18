@echo off
title HIFZA Dashboard Launcher
echo ===================================================
echo   Memulai Server Lokal HIFZA Akuntansi Syariah...
echo ===================================================
echo.

REM Cek apakah command 'node' tersedia di PATH
where node >nul 2>nul
if %errorlevel% equ 0 (
    set NODE_CMD=node
    goto start_server
)

REM Jika tidak ada di PATH, cek di folder default
if exist "C:\Program Files\nodejs\node.exe" (
    set PATH=%PATH%;C:\Program Files\nodejs\
    set NODE_CMD="C:\Program Files\nodejs\node.exe"
    goto start_server
)

echo ERROR: Node.js tidak ditemukan di sistem Anda.
echo Silakan unduh dan instal Node.js terlebih dahulu dari https://nodejs.org/
echo.
pause
exit

:start_server
REM Jalankan server di jendela baru
start "HIFZA Server" %NODE_CMD% "%~dp0src\server.js"
echo Menunggu server lokal siap...
ping 127.0.0.1 -n 3 > nul
start "" "http://127.0.0.1:3000"
exit

