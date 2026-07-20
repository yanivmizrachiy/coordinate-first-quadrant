$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$PowerShellExe = (Get-Command pwsh.exe -ErrorAction SilentlyContinue).Source

if (-not $PowerShellExe) {
    $PowerShellExe = (Get-Command powershell.exe -ErrorAction Stop).Source
}

$AutoSync = Join-Path $Root 'auto-sync-repo.ps1'
$Preview = Join-Path $Root 'start-live-preview.ps1'

$PidFile = Join-Path $env:LOCALAPPDATA 'CoordinateFirstQuadrant\auto-sync.pid'
$SyncRunning = $false

if (Test-Path -LiteralPath $PidFile) {
    $OldPid = Get-Content -LiteralPath $PidFile -ErrorAction SilentlyContinue

    if (
        $OldPid -and
        (Get-Process -Id $OldPid -ErrorAction SilentlyContinue)
    ) {
        $SyncRunning = $true
    }
}

if (-not $SyncRunning) {
    Start-Process `
        -FilePath $PowerShellExe `
        -ArgumentList @(
            '-NoProfile',
            '-ExecutionPolicy',
            'Bypass',
            '-WindowStyle',
            'Hidden',
            '-File',
            "`"$AutoSync`""
        ) `
        -WorkingDirectory $Root `
        -WindowStyle Hidden
}

& $PowerShellExe `
    -NoProfile `
    -ExecutionPolicy Bypass `
    -File $Preview
