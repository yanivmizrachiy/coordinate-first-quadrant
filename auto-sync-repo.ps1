$ErrorActionPreference = 'Continue'
Set-StrictMode -Version Latest

$ProjectRoot = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'coordinate-first-quadrant'
$ExpectedRepo = 'yanivmizrachiy/coordinate-first-quadrant'
$AllowedRemotes = @(
  'https://github.com/yanivmizrachiy/coordinate-first-quadrant.git',
  'git@github.com:yanivmizrachiy/coordinate-first-quadrant.git'
)
$StateRoot = Join-Path $env:LOCALAPPDATA 'CoordinateFirstQuadrant'
$Log = Join-Path $StateRoot 'auto-sync.log'
$PidFile = Join-Path $StateRoot 'auto-sync.pid'
New-Item -ItemType Directory -Force -Path $StateRoot | Out-Null

function Write-Log([string]$Message) {
  Add-Content -LiteralPath $Log -Value ("{0:u} {1}" -f (Get-Date), $Message) -Encoding UTF8
}
function Assert-SafeRepository {
  if (-not (Test-Path -LiteralPath $ProjectRoot)) { throw "Project folder missing: $ProjectRoot" }
  if ($ProjectRoot -match 'parabula-next') { throw 'Protected repository path detected.' }
  $Top = (& git -C $ProjectRoot rev-parse --show-toplevel 2>$null).Trim()
  if (-not $Top) { throw 'The project is not a Git repository.' }
  if ([IO.Path]::GetFullPath($Top).TrimEnd('\') -ne [IO.Path]::GetFullPath($ProjectRoot).TrimEnd('\')) {
    throw "Unexpected Git root: $Top"
  }
  $Remote = (& git -C $ProjectRoot remote get-url origin 2>$null).Trim()
  if ($AllowedRemotes -notcontains $Remote) { throw "Unsafe origin remote: $Remote" }
}
function Sync-Project {
  Assert-SafeRepository
  & pwsh -NoProfile -ExecutionPolicy Bypass -File (Join-Path $ProjectRoot 'validate-project.ps1')
  if ($LASTEXITCODE -ne 0) {
    Write-Log 'Validation failed; no commit or push was performed.'
    return
  }

  & git -C $ProjectRoot add -A
  & git -C $ProjectRoot diff --cached --quiet
  if ($LASTEXITCODE -ne 0) {
    $Stamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    & git -C $ProjectRoot commit -m "Auto update workbook $Stamp"
    if ($LASTEXITCODE -ne 0) { Write-Log 'Commit failed.'; return }
    Write-Log "Created commit at $Stamp"
  }

  # Push is attempted each cycle so a temporary network failure is retried.
  & git -C $ProjectRoot push origin main 2>&1 | ForEach-Object { Write-Log $_ }
}

if (Test-Path -LiteralPath $PidFile) {
  $OldPid = Get-Content -LiteralPath $PidFile -ErrorAction SilentlyContinue
  if ($OldPid -and (Get-Process -Id $OldPid -ErrorAction SilentlyContinue)) { exit 0 }
}
Set-Content -LiteralPath $PidFile -Value $PID -Encoding ASCII
Write-Log "Auto-sync started. PID=$PID"

try {
  while ($true) {
    try { Sync-Project } catch { Write-Log ("ERROR: " + $_.Exception.Message) }
    Start-Sleep -Seconds 12
  }
} finally {
  Remove-Item -LiteralPath $PidFile -Force -ErrorAction SilentlyContinue
}
