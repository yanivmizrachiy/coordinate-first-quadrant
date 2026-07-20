$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Index = Join-Path $Root 'index.html'
$Text = Get-Content -LiteralPath $Index -Raw -Encoding UTF8

$Errors = [System.Collections.Generic.List[string]]::new()

foreach ($Page in 1..34) {
    if ($Text -notmatch ('id="page-' + $Page + '"')) {
        $Errors.Add("עמוד $Page אינו נמצא.")
    }
}

foreach ($File in @(
    'USER_MEMORY.md',
    'CLAUDE.md',
    'docs/CURRENT_REQUIREMENTS.md',
    'docs/DECISION_LOG.md'
)) {
    if (-not (Test-Path -LiteralPath (Join-Path $Root $File))) {
        $Errors.Add("קובץ חסר: $File")
    }
}

if ($Text.Contains('ציר x')) {
    $Errors.Add('נמצא ניסוח אסור: ציר x')
}

if ($Text.Contains('ציר y')) {
    $Errors.Add('נמצא ניסוח אסור: ציר y')
}

if ($Errors.Count -gt 0) {
    Write-Host 'בדיקת הפרויקט נכשלה:' -ForegroundColor Red
    $Errors | ForEach-Object {
        Write-Host " - $_" -ForegroundColor Red
    }
    exit 1
}

Write-Host 'בדיקת הפרויקט עברה בהצלחה.' -ForegroundColor Green
