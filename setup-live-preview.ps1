$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$StartScript = Join-Path $ProjectRoot 'start-live-preview.ps1'
if (-not (Test-Path -LiteralPath $StartScript)) {
  throw 'start-live-preview.ps1 אינו נמצא.'
}

$Desktop = [Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $Desktop 'תצוגה חיה - מערכת צירים.lnk'
$Shell = New-Object -ComObject WScript.Shell
$Shortcut = $Shell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = (Get-Command pwsh.exe -ErrorAction SilentlyContinue).Source
if (-not $Shortcut.TargetPath) {
  $Shortcut.TargetPath = (Get-Command powershell.exe -ErrorAction Stop).Source
}
$Shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$StartScript`""
$Shortcut.WorkingDirectory = $ProjectRoot
$Shortcut.Description = 'תצוגה חיה ומתעדכנת של חוברת מערכת צירים — הרביע הראשון'
$Shortcut.Save()

Write-Host "נוצר קיצור קבוע בשולחן העבודה: $ShortcutPath" -ForegroundColor Green
& $StartScript
