$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Index = Join-Path $Root 'index.html'
$Text = Get-Content -LiteralPath $Index -Raw -Encoding UTF8

$Errors = [System.Collections.Generic.List[string]]::new()

foreach ($Path in @(
  'CLAUDE.md','USER_MEMORY.md',
  'docs\CURRENT_REQUIREMENTS.md','docs\DECISION_LOG.md'
)) {
  if (-not (Test-Path -LiteralPath (Join-Path $Root $Path))) {
    $Errors.Add("Missing $Path")
  }
}

$UsesRuntimeLoader = $Text.Contains('id="runtime-workbook-loader"')

if ($UsesRuntimeLoader) {
  foreach ($Required in @(
    'a9087db7affc6c14b612b929c89d437fc130afcf',
    'trueFalseSets',
    'pattern: [true,false',
    'type="radio"',
    'tf-options',
    'toggleGrayscale',
    'printGrayscale',
    'grayscale-mode',
    'patchTrueFalseTables',
    'patchErrorGrid',
    '34 עמודים'
  )) {
    if (-not $Text.Contains($Required)) {
      $Errors.Add("Missing runtime-loader requirement: $Required")
    }
  }

  $TrueCount = ([regex]::Matches($Text, '(?<![A-Za-z])true(?![A-Za-z])')).Count
  $FalseCount = ([regex]::Matches($Text, '(?<![A-Za-z])false(?![A-Za-z])')).Count
  if ($TrueCount -lt 8 -or $FalseCount -lt 8) {
    $Errors.Add("Runtime true/false banks are incomplete: true=$TrueCount false=$FalseCount")
  }

  if ($Text.Contains('מתקדמים')) {
    $Errors.Add('Forbidden movement wording appears as visible text: מתקדמים')
  }
} else {
  foreach ($n in 1..34) {
    if ($Text -notmatch ('id="page-' + $n + '"')) {
      $Errors.Add("Missing page $n")
    }
  }

  foreach ($Forbidden in @(
    'ציר x','ציר y','שם התלמיד','תאריך:','ניתוח טענה',
    'שלב 3','שלב 4','מתקדמים'
  )) {
    if ($Text.Contains($Forbidden)) {
      $Errors.Add("Forbidden text: $Forbidden")
    }
  }

  foreach ($Required in @(
    'השלימו את המשפטים',
    'id="toggleGrayscale"',
    'id="printGrayscale"',
    'grayscale-mode',
    'class="tf-options"'
  )) {
    if (-not $Text.Contains($Required)) {
      $Errors.Add("Missing required content: $Required")
    }
  }

  $BalancedBlocks = [regex]::Matches(
    $Text,
    '<(?:table|div)[^>]*data-balanced="true"[^>]*>(.*?)</(?:table|div)>',
    [Text.RegularExpressions.RegexOptions]::Singleline
  )
  foreach ($Block in $BalancedBlocks) {
    $Inner = $Block.Groups[1].Value
    $TrueBlockCount = ([regex]::Matches($Inner, 'data-answer="true"')).Count
    $FalseBlockCount = ([regex]::Matches($Inner, 'data-answer="false"')).Count
    if ($TrueBlockCount -eq 0 -or $FalseBlockCount -eq 0) {
      $Errors.Add('A true/false block does not contain both answer types')
    }
    if ([math]::Abs($TrueBlockCount - $FalseBlockCount) -gt 1) {
      $Errors.Add("Unbalanced block: true=$TrueBlockCount false=$FalseBlockCount")
    }
  }
}

if ($Errors.Count -gt 0) {
  $Errors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  exit 1
}

Write-Host 'All workbook, memory, true-false, answer-box and grayscale checks passed.' -ForegroundColor Green
