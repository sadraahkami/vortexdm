@echo off
set "GOCACHE=%~dp0.gocache"
set "GOPATH=%~dp0.gopath"
go test -v ./tests/...
