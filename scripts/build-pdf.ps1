$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$PdfPath = Join-Path $ProjectRoot 'downloads\coordinate-first-quadrant-34-pages.pdf'
$ChromeCandidates = @(
  (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
  (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe'),
  (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
)
$Chrome = $ChromeCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $Chrome) { throw 'Google Chrome לא נמצא. התקן Chrome ונסה שוב.' }
$Owner = (& gh api user --jq .login).Trim()
$RepoName = 'coordinate-first-quadrant'
$Url = "https://$Owner.github.io/$RepoName/"
Write-Host "ממתין ל-GitHub Pages: $Url" -ForegroundColor Cyan
$Ready = $false
for ($i = 1; $i -le 30; $i++) {
  try {
    $Response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 15
    if ($Response.StatusCode -eq 200) { $Ready = $true; break }
  } catch {}
  Start-Sleep -Seconds 10
}
if (-not $Ready) { throw 'GitHub Pages עדיין לא זמין. המתן כמה דקות והריץ שוב את הסקריפט.' }
$Args = @('--headless=new','--disable-gpu','--no-pdf-header-footer','--virtual-time-budget=25000',"--print-to-pdf=$PdfPath",$Url)
& $Chrome $Args
if (-not (Test-Path -LiteralPath $PdfPath)) { throw 'יצירת ה-PDF נכשלה.' }
Write-Host "PDF נוצר: $PdfPath" -ForegroundColor Green
