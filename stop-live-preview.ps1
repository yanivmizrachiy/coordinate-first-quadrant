$ErrorActionPreference = 'SilentlyContinue'
$Port = 4173
$connections = Get-NetTCPConnection -LocalPort $Port -State Listen
foreach ($connection in $connections) {
  Stop-Process -Id $connection.OwningProcess -Force
}
Write-Host 'תצוגת מערכת הצירים נסגרה.' -ForegroundColor Green
