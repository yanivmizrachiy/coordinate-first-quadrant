$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Remote = (& git -C $Root remote get-url origin 2>$null).Trim()
$Allowed = @(
  'https://github.com/yanivmizrachiy/coordinate-first-quadrant.git',
  'git@github.com:yanivmizrachiy/coordinate-first-quadrant.git'
)
if ($Allowed -notcontains $Remote) { throw "Unsafe remote. Stopped: $Remote" }
& pwsh -NoProfile -ExecutionPolicy Bypass -File (Join-Path $Root 'validate-project.ps1')
if ($LASTEXITCODE -ne 0) { throw 'Validation failed.' }
& git -C $Root add -A
& git -C $Root diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  & git -C $Root commit -m ("Manual sync " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
}
& git -C $Root push origin main
Write-Host 'Synced to the separate repository.' -ForegroundColor Green
