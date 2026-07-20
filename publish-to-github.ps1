$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoName = 'coordinate-first-quadrant'
$Description = '34-page Hebrew workbook: Coordinate System — First Quadrant'
Write-Host 'יוצר ריפו חדש ונפרד. parabula-next לא ייפתח ולא ישתנה.' -ForegroundColor Cyan
Set-Location -LiteralPath $ProjectRoot
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) { throw 'Git ו-winget אינם זמינים.' }
  winget install --id Git.Git -e --source winget --accept-package-agreements --accept-source-agreements
}
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  if (-not (Get-Command winget -ErrorAction SilentlyContinue)) { throw 'GitHub CLI ו-winget אינם זמינים.' }
  winget install --id GitHub.cli -e --source winget --accept-package-agreements --accept-source-agreements
  $MachinePath = [Environment]::GetEnvironmentVariable('Path','Machine')
  $UserPath = [Environment]::GetEnvironmentVariable('Path','User')
  $env:Path = $MachinePath + ';' + $UserPath
}
& gh auth status 2>$null
if ($LASTEXITCODE -ne 0) { & gh auth login --hostname github.com --web --git-protocol https }
$Owner = (& gh api user --jq .login).Trim()
if (-not $Owner) { throw 'לא הצלחתי לזהות את חשבון GitHub.' }
& gh repo view "$Owner/$RepoName" 1>$null 2>$null
if ($LASTEXITCODE -eq 0) { throw "הריפו $Owner/$RepoName כבר קיים. נעצרתי כדי לא לדרוס דבר." }
if (Test-Path -LiteralPath (Join-Path $ProjectRoot '.git')) { Remove-Item -LiteralPath (Join-Path $ProjectRoot '.git') -Recurse -Force }
& git init -b main
& git config user.name $Owner
$Email = (& gh api user --jq .email 2>$null).Trim()
if (-not $Email) { $Email = "$Owner@users.noreply.github.com" }
& git config user.email $Email
& git add -A
& git commit -m 'Initial 34-page first-quadrant workbook'
& gh repo create "$Owner/$RepoName" --public --description $Description --source $ProjectRoot --remote origin --push
$PagesCreated = $true
& gh api --method POST "repos/$Owner/$RepoName/pages" -f 'source[branch]=main' -f 'source[path]=/' 1>$null 2>$null
if ($LASTEXITCODE -ne 0) {
  $PagesCreated = $false
  & gh api --method PUT "repos/$Owner/$RepoName/pages" -f 'source[branch]=main' -f 'source[path]=/' 1>$null 2>$null
  if ($LASTEXITCODE -eq 0) { $PagesCreated = $true }
}
$RepoUrl = "https://github.com/$Owner/$RepoName"
$PagesUrl = "https://$Owner.github.io/$RepoName/"
Write-Host "הריפו נוצר: $RepoUrl" -ForegroundColor Green
if ($PagesCreated) { Write-Host "GitHub Pages הוגדר: $PagesUrl" -ForegroundColor Green } else { Write-Warning 'הריפו נוצר, אך הפעלת Pages דורשת בדיקה ידנית ב-Settings > Pages.' }
try {
  & (Join-Path $ProjectRoot 'scripts\build-pdf.ps1')
  & git add downloads\coordinate-first-quadrant-34-pages.pdf
  & git commit -m 'Add downloadable 34-page PDF'
  & git push origin main
} catch { Write-Warning ("הריפו והאתר נוצרו, אך ה-PDF לא נוצר כעת: " + $_.Exception.Message) }
$ChromeCandidates = @(
  (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
  (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe'),
  (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
)
$Chrome = $ChromeCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($Chrome) { Start-Process -FilePath $Chrome -ArgumentList @($RepoUrl,$PagesUrl) }
Write-Host 'בוצע. לא בוצע שום שינוי ב-parabula-next.' -ForegroundColor Green
