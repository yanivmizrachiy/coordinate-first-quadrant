$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Port = 4173
$Url = "http://127.0.0.1:$Port/"

function Test-LocalPort {
    param([int]$Number)

    try {
        $Client = [Net.Sockets.TcpClient]::new()
        $Task = $Client.ConnectAsync('127.0.0.1', $Number)

        if (-not $Task.Wait(400)) {
            $Client.Dispose()
            return $false
        }

        $Connected = $Client.Connected
        $Client.Dispose()
        return $Connected
    }
    catch {
        return $false
    }
}

function Find-Chrome {
    $Candidates = @(
        (Join-Path $env:ProgramFiles 'Google\Chrome\Application\chrome.exe'),
        (Join-Path ${env:ProgramFiles(x86)} 'Google\Chrome\Application\chrome.exe'),
        (Join-Path $env:LOCALAPPDATA 'Google\Chrome\Application\chrome.exe')
    )

    return $Candidates |
        Where-Object {
            $_ -and (Test-Path -LiteralPath $_)
        } |
        Select-Object -First 1
}

if (-not (Test-LocalPort -Number $Port)) {
    $State = Join-Path $Root '.live-preview'
    New-Item -ItemType Directory -Force -Path $State | Out-Null

    $OutLog = Join-Path $State 'server.log'
    $ErrorLog = Join-Path $State 'server-error.log'

    $Npx = Get-Command npx.cmd -ErrorAction SilentlyContinue

    if (-not $Npx) {
        $Npx = Get-Command npx -ErrorAction Stop
    }

    Start-Process `
        -FilePath $Npx.Source `
        -ArgumentList @(
            '--yes',
            'live-server',
            '.',
            "--port=$Port",
            '--host=127.0.0.1',
            '--no-browser',
            '--wait=250',
            '--quiet'
        ) `
        -WorkingDirectory $Root `
        -WindowStyle Hidden `
        -RedirectStandardOutput $OutLog `
        -RedirectStandardError $ErrorLog

    $Ready = $false

    foreach ($Attempt in 1..50) {
        Start-Sleep -Milliseconds 250

        if (Test-LocalPort -Number $Port) {
            $Ready = $true
            break
        }
    }

    if (-not $Ready) {
        throw "שרת התצוגה לא הופעל. בדוק: $ErrorLog"
    }
}

$Chrome = Find-Chrome

if (-not $Chrome) {
    throw 'Google Chrome אינו נמצא.'
}

Start-Process `
    -FilePath $Chrome `
    -ArgumentList @(
        "--app=$Url",
        '--start-maximized'
    )
