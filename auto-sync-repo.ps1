$ErrorActionPreference = 'Continue'
Set-StrictMode -Version Latest

$Owner = 'yanivmizrachiy'
$RepoName = 'coordinate-first-quadrant'
$ExpectedHttps = "https://github.com/$Owner/$RepoName.git"
$ExpectedHttpsNoGit = "https://github.com/$Owner/$RepoName"
$ExpectedSsh = "git@github.com:$Owner/$RepoName.git"

$Root = Join-Path ([Environment]::GetFolderPath('MyDocuments')) $RepoName
$StateRoot = Join-Path $env:LOCALAPPDATA 'CoordinateFirstQuadrant'
$LogFile = Join-Path $StateRoot 'auto-sync.log'
$PidFile = Join-Path $StateRoot 'auto-sync.pid'

New-Item -ItemType Directory -Force -Path $StateRoot | Out-Null

function Write-SyncLog {
    param([string]$Message)

    Add-Content `
        -LiteralPath $LogFile `
        -Value ("{0:u} {1}" -f (Get-Date), $Message) `
        -Encoding utf8
}

function Confirm-SafeRepository {
    if (-not (Test-Path -LiteralPath $Root)) {
        throw "Project folder missing: $Root"
    }

    if ($Root -match 'parabula-next') {
        throw 'Protected repository path detected.'
    }

    $Top = (& git -C $Root rev-parse --show-toplevel 2>$null).Trim()

    if (-not $Top) {
        throw 'The folder is not a Git repository.'
    }

    if (
        [IO.Path]::GetFullPath($Top).TrimEnd('\') -ne
        [IO.Path]::GetFullPath($Root).TrimEnd('\')
    ) {
        throw "Unexpected Git root: $Top"
    }

    $Remote = (& git -C $Root remote get-url origin 2>$null).Trim()

    if (
        $Remote -ne $ExpectedHttps -and
        $Remote -ne $ExpectedHttpsNoGit -and
        $Remote -ne $ExpectedSsh
    ) {
        throw "Unsafe origin remote: $Remote"
    }
}

function Invoke-SafeSync {
    Confirm-SafeRepository

    $Validation = Join-Path $Root 'validate-project.ps1'

    & pwsh `
        -NoProfile `
        -ExecutionPolicy Bypass `
        -File $Validation

    if ($LASTEXITCODE -ne 0) {
        Write-SyncLog 'Validation failed. No commit or push was performed.'
        return
    }

    & git -C $Root add -A

    & git -C $Root diff --cached --quiet

    if ($LASTEXITCODE -ne 0) {
        $Stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'

        & git -C $Root commit -m "Auto update workbook $Stamp"

        if ($LASTEXITCODE -ne 0) {
            Write-SyncLog 'Commit failed.'
            return
        }

        Write-SyncLog "Created automatic commit: $Stamp"
    }

    # גם אם הרשת נכשלה קודם, הפעולה תנסה שוב במחזור הבא.
    & git -C $Root push origin main 2>&1 |
        ForEach-Object {
            Write-SyncLog $_
        }
}

if (Test-Path -LiteralPath $PidFile) {
    $OldPid = Get-Content -LiteralPath $PidFile -ErrorAction SilentlyContinue

    if (
        $OldPid -and
        (Get-Process -Id $OldPid -ErrorAction SilentlyContinue)
    ) {
        exit 0
    }
}

Set-Content -LiteralPath $PidFile -Value $PID -Encoding ascii
Write-SyncLog "Automatic synchronization started. PID=$PID"

try {
    while ($true) {
        try {
            Invoke-SafeSync
        }
        catch {
            Write-SyncLog ("ERROR: " + $_.Exception.Message)
        }

        Start-Sleep -Seconds 12
    }
}
finally {
    Remove-Item -LiteralPath $PidFile -Force -ErrorAction SilentlyContinue
}
