$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Index = Join-Path $Root 'index.html'
$Text = Get-Content -LiteralPath $Index -Raw -Encoding UTF8

$Errors = [System.Collections.Generic.List[string]]::new()
foreach ($n in 1..34) {
  if ($Text -notmatch ('id="page-' + $n + '"')) { $Errors.Add("Missing page $n") }
}
foreach ($Forbidden in @('ציר x','ציר y','שם התלמיד','תאריך:','ניתוח טענה','שלב 3','שלב 4')) {
  if ($Text.Contains($Forbidden)) { $Errors.Add("Forbidden text: $Forbidden") }
}
foreach ($Required in @('x</span> ציר','y</span> ציר','השלימו את המשפטים','USER_MEMORY.md')) {
  if ($Required -eq 'USER_MEMORY.md') {
    if (-not (Test-Path -LiteralPath (Join-Path $Root $Required))) { $Errors.Add("Missing $Required") }
  } elseif (-not $Text.Contains($Required)) {
    $Errors.Add("Missing required content: $Required")
  }
}
if ($Text -notmatch 'יניב רז - מדריך מחוזי חט"ב בעיר ירושלים') {
  $Errors.Add('Missing canonical footer')
}
if ($Errors.Count -gt 0) {
  $Errors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  exit 1
}
Write-Host 'All 34-page workbook checks passed.' -ForegroundColor Green
