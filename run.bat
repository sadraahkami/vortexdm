@echo off
title VortexDM - Next-Gen Download Manager
set GOCACHE=%~dp0.gocache
set GOPATH=%~dp0.gopath
if not exist "%~dp0VortexDM.exe" (
    echo Compiling VortexDM...
    go build -ldflags="-s -w -H windowsgui" -o VortexDM.exe .
)
start "" "%~dp0VortexDM.exe"
