@echo off
set "GOCACHE=%~dp0.gocache"
set "GOPATH=%~dp0.gopath"
echo ===================================================
echo     Compiling VortexDM to Standalone Binary
echo ===================================================
echo.
go build -ldflags="-s -w" -o "%~dp0VortexDM.exe" .
if errorlevel 1 (
    echo [Error] Build failed. Please check Go code.
    exit /b 1
)
echo.
echo [Success] VortexDM.exe built successfully!
