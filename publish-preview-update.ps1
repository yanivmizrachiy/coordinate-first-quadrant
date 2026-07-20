$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $Root

if (-not (Test-Path -LiteralPath '.git')) {
  throw 'התיקייה עדיין אינה ריפו Git. הריצו תחילה publish-to-github.ps1.'
}
$remote = (& git remote get-url origin 2>$null)
if (-not $remote -or $remote -match 'parabula-next') {
  throw 'נעצר: ה-remote חסר או מצביע לריפו הראשי. אין לבצע פרסום.'
}
& git add -A
& git diff --cached --quiet
if ($LASTEXITCODE -eq 0) {
  Write-Host 'אין שינויים חדשים לפרסום.' -ForegroundColor Yellow
  exit 0
}
$stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
& git commit -m "Update live workbook preview $stamp"
& git push origin main
Write-Host 'השינוי פורסם לריפו הנפרד. GitHub Pages יתעדכן אוטומטית.' -ForegroundColor Green
