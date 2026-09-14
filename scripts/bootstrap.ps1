$ErrorActionPreference = "Stop"

Write-Host "MaskSim bootstrap"

Push-Location "$PSScriptRoot\..\backend"
if (!(Test-Path ".env")) { Copy-Item ".env.example" ".env" }
npm install
Pop-Location

Push-Location "$PSScriptRoot\..\frontend"
if (!(Test-Path ".env")) { Copy-Item ".env.example" ".env" }
npm install
Pop-Location

Write-Host ""
Write-Host "Node dependencies installed."
Write-Host "The ML service is intentionally separate and can be prepared later."
