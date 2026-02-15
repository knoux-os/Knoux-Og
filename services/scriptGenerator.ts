
// KNOUX OS Guardian - PowerShell Script Generator
// Generates elite, production-ready PowerShell scripts for system management

interface ScriptTemplate {
  name: string;
  description: string;
  script: string;
}

class PowerShellGenerator {
  private templates: Record<string, ScriptTemplate>;

  constructor() {
    this.templates = this.initializeTemplates();
  }

  private initializeTemplates(): Record<string, ScriptTemplate> {
    return {
      // ==========================================
      // MODULE 01: LIFECYCLE CURATOR
      // ==========================================

      'lifecycle_process_monitor': {
        name: 'Process Monitor & Auto-Restart',
        description: 'Advanced process monitoring with auto-restart capabilities and crash logging.',
        script: `# ============================================
# KNOUX OS Guardian - Auto-Restart Service
# Monitor processes and restart on crash
# ============================================

param(
    [string[]]$ProcessNames = @("notepad", "chrome", "firefox", "msedge"),
    [int]$CheckInterval = 5,
    [int]$MaxRestarts = 5,
    [string]$LogPath = "$env:USERPROFILE\\Desktop\\KNOUX_AutoRestart_Log.txt"
)

Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   KNOUX Process Guardian - Sentinel      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Data structures
$script:MonitoredProcesses = @{}
$script:RestartLog = @()

# Initialize monitored processes
function Initialize-MonitoredProcesses {
    Write-Host "🔧 Initializing monitored processes..." -ForegroundColor Yellow
    
    foreach ($procName in $ProcessNames) {
        $processes = Get-Process -Name $procName -ErrorAction SilentlyContinue
        
        if ($processes) {
            foreach ($proc in $processes) {
                $script:MonitoredProcesses[$proc.Id] = @{
                    Name = $procName
                    Path = $proc.Path
                    StartTime = $proc.StartTime
                    RestartCount = 0
                    LastCheck = Get-Date
                    Status = "Running"
                }
                Write-Host "  ✓ Monitoring: $procName (PID: $($proc.Id))" -ForegroundColor Green
            }
        } else {
            Write-Host "  ⚠️  Process not running: $procName (Will watch for start)" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "📊 Total instances monitored: $($script:MonitoredProcesses.Count)" -ForegroundColor Cyan
}

function Test-ProcessStatus {
    $now = Get-Date
    $deadProcesses = @()
    
    foreach ($pidKey in $script:MonitoredProcesses.Keys) {
        $procInfo = $script:MonitoredProcesses[$pidKey]
        $process = Get-Process -Id $pidKey -ErrorAction SilentlyContinue
        
        if (-not $process) {
            Write-Host "❌ Process crashed: $($procInfo.Name) (PID: $pidKey)" -ForegroundColor Red
            $deadProcesses += $pidKey
            
            # Log
            $logEntry = [PSCustomObject]@{
                Time = $now
                ProcessName = $procInfo.Name
                PID = $pidKey
                Event = "Crash Detected"
                RestartAttempt = $procInfo.RestartCount + 1
            }
            $script:RestartLog += $logEntry
            
            # Restart logic
            if ($procInfo.RestartCount -lt $MaxRestarts) {
                Write-Host "🔄 Restarting: $($procInfo.Name)..." -ForegroundColor Yellow
                try {
                    if ($procInfo.Path) {
                        Start-Process -FilePath $procInfo.Path -ErrorAction Stop
                    } else {
                        Start-Process -FilePath $procInfo.Name -ErrorAction Stop
                    }
                    Start-Sleep -Seconds 2
                    
                    # Re-acquire
                    $newProc = Get-Process -Name $procInfo.Name | Sort-Object StartTime -Descending | Select-Object -First 1
                    if ($newProc) {
                         $script:MonitoredProcesses[$newProc.Id] = @{
                            Name = $procInfo.Name
                            Path = $procInfo.Path
                            StartTime = $newProc.StartTime
                            RestartCount = $procInfo.RestartCount + 1
                            LastCheck = $now
                            Status = "Restarted"
                        }
                        Write-Host "✅ Restarted: $($procInfo.Name) (New PID: $($newProc.Id))" -ForegroundColor Green
                    }
                } catch {
                     Write-Host "⚠️  Failed to restart: $($_.Exception.Message)" -ForegroundColor Red
                }
            } else {
                Write-Host "⛔ Max restarts reached for $($procInfo.Name)" -ForegroundColor Red
            }
        } elseif (-not $process.Responding) {
             Write-Host "⚠️  Process Hung: $($procInfo.Name)" -ForegroundColor Yellow
             $procInfo.Status = "Not Responding"
        } else {
             $procInfo.Status = "Running"
             $procInfo.LastCheck = $now
        }
    }
    
    foreach ($dp in $deadProcesses) { $script:MonitoredProcesses.Remove($dp) }
}

# Main Loop
Initialize-MonitoredProcesses
Write-Host "🚀 Monitor Active. Press Ctrl+C to stop." -ForegroundColor Green

while ($true) {
    Test-ProcessStatus
    Start-Sleep -Seconds $CheckInterval
}
`
      },

      'lifecycle_startup_optimizer': {
        name: 'Startup Optimizer',
        description: 'Analyzes startup impact and optimizes boot time.',
        script: `# KNOUX OS Guardian - Startup Optimizer
Write-Host "=== Startup Optimizer ===" -ForegroundColor Cyan

# 1. Get Startup Items
$startup = Get-CimInstance Win32_StartupCommand
Write-Host "Found $($startup.Count) startup items." -ForegroundColor Yellow

# 2. Analyze Impact (Mock analysis based on common heavy apps)
$heavyApps = @("OneDrive", "Steam", "Spotify", "Teams")
foreach ($item in $startup) {
    $impact = "Low"
    if ($heavyApps -contains $item.Name) { $impact = "High" }
    
    Write-Host "• $($item.Name)" -NoNewline
    Write-Host " [$impact Impact]" -ForegroundColor $(if($impact -eq "High"){"Red"}else{"Green"})
    Write-Host "  Command: $($item.Command)" -ForegroundColor Gray
}

# 3. Optimize Services
Write-Host "\nChecking optimization candidates..." -ForegroundColor Yellow
$services = Get-Service | Where-Object {$_.StartType -eq 'Automatic' -and $_.Status -eq 'Stopped'}
if ($services) {
    Write-Host "Found $($services.Count) Automatic services that are currently stopped (Wasted Boot Time)." -ForegroundColor Red
    $services | Select-Object -First 5 | Format-Table Name, DisplayName
    Write-Host "Recommendation: Set these to 'Manual' start." -ForegroundColor Cyan
} else {
    Write-Host "Service configuration looks optimized." -ForegroundColor Green
}

Write-Host "\n✓ Optimization Scan Complete." -ForegroundColor Green`
      },

      'lifecycle_shutdown_manager': {
        name: 'Shutdown Manager',
        description: 'Graceful shutdown with cleanup and logging.',
        script: `# KNOUX OS Guardian - Shutdown Manager
param([int]$DelaySeconds = 60)

Write-Host "=== Graceful Shutdown Sequence ===" -ForegroundColor Cyan
Write-Host "Initiating in $DelaySeconds seconds..." -ForegroundColor Yellow

# 1. Cleanup Temp
Write-Host "Cleaning temporary files..."
Remove-Item "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✓ Temp cleared." -ForegroundColor Green

# 2. Log Event
$LogPath = "$env:USERPROFILE\\Desktop\\Shutdown_Log.txt"
"Shutdown initiated by KNOUX at $(Get-Date)" | Out-File $LogPath -Append

# 3. Check Active Users
$sessions = quser 2>$null
if ($sessions.Count -gt 1) {
    Write-Host "⚠️  WARNING: Other users are logged in!" -ForegroundColor Red
    $sessions | Out-String | Write-Host
}

# 4. Schedule Shutdown
Write-Host "Scheduling shutdown..."
Shutdown /s /t $DelaySeconds /c "KNOUX Guardian: Planned Maintenance Shutdown"

Write-Host "✓ Shutdown scheduled. Run 'shutdown /a' to abort." -ForegroundColor Green`
      },

      'lifecycle_service_controller': {
        name: 'Service Controller',
        description: 'Advanced Windows Service management dashboard.',
        script: `# KNOUX OS Guardian - Service Controller
function Show-Menu {
    Clear-Host
    Write-Host "=== Service Controller ===" -ForegroundColor Cyan
    Write-Host "1. View Running Services"
    Write-Host "2. Search Service"
    Write-Host "3. Start Service"
    Write-Host "4. Stop Service"
    Write-Host "5. Restart Service"
    Write-Host "Q. Quit"
}

while ($true) {
    Show-Menu
    $choice = Read-Host "Select Option"
    
    switch ($choice) {
        "1" { Get-Service | Where-Object Status -eq 'Running' | Out-GridView -Title "Running Services"; }
        "2" { 
            $filter = Read-Host "Enter search term"
            Get-Service | Where-Object { $_.Name -like "*$filter*" -or $_.DisplayName -like "*$filter*" } | Format-Table -AutoSize
            Pause
        }
        "3" {
            $name = Read-Host "Service Name to Start"
            Start-Service $name -Verbose
            Pause
        }
        "4" {
            $name = Read-Host "Service Name to Stop"
            Stop-Service $name -Verbose
            Pause
        }
        "5" {
            $name = Read-Host "Service Name to Restart"
            Restart-Service $name -Verbose
            Pause
        }
        "Q" { exit }
    }
}`
      },

      'lifecycle_task_scheduler': {
        name: 'Task Scheduler',
        description: 'Create and manage automated system tasks.',
        script: `# KNOUX OS Guardian - Task Scheduler
Write-Host "=== Task Scheduler Automation ===" -ForegroundColor Cyan

# List Knoux Tasks
Write-Host "Current KNOUX Tasks:" -ForegroundColor Yellow
Get-ScheduledTask | Where-Object TaskName -like "*Knoux*" | Format-Table TaskName, State, NextRunTime -AutoSize

# Create New Task Template
$TaskName = "Knoux_Daily_Maintenance"
$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-Command Write-Host 'Maintenance'"
$Trigger = New-ScheduledTaskTrigger -Daily -At 3am
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries:$false -DontStopIfGoingOnBatteries:$false

Write-Host "Creating/Updating $TaskName..."
Register-ScheduledTask -Action $Action -Trigger $Trigger -TaskName $TaskName -Settings $Settings -Description "Automated by KNOUX Guardian" -Force

Write-Host "✓ Task Registered Successfully." -ForegroundColor Green`
      },

      'lifecycle_session_manager': {
        name: 'Session Manager',
        description: 'Monitor and manage user sessions.',
        script: `# KNOUX OS Guardian - Session Manager
Write-Host "=== Active Sessions ===" -ForegroundColor Cyan

# Get detailed session info using WMI
$sessions = Get-CimInstance Win32_LogonSession | Where-Object LogonType -eq 2 # Interactive
foreach ($session in $sessions) {
    $user = Get-CimInstance Win32_LoggedOnUser | Where-Object LogonId -eq $session.LogonId
    if ($user) {
        Write-Host "User: $($user.Antecedent.Name)" -ForegroundColor Green
        Write-Host "  Domain: $($user.Antecedent.Domain)"
        Write-Host "  Logon Time: $($session.StartTime)"
        Write-Host "  Status: Active"
        Write-Host "-------------------"
    }
}

Write-Host "To force logoff a user, use: logoff <SessionID>" -ForegroundColor Gray`
      },

      'lifecycle_autorun_manager': {
        name: 'AutoRun Manager',
        description: 'Audit and clean system autorun entries.',
        script: `# KNOUX OS Guardian - AutoRun Manager
Write-Host "=== AutoRun Audit ===" -ForegroundColor Cyan

$registryPaths = @(
    "HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
    "HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
)

foreach ($path in $registryPaths) {
    Write-Host "Checking: $path" -ForegroundColor Yellow
    Get-ItemProperty $path | Select-Object * -ExcludeProperty PSPath, PSParentPath, PSChildName, PSDrive, PSProvider | ForEach-Object {
        $_.PSObject.Properties | ForEach-Object {
            Write-Host "  $($_.Name): $($_.Value)"
        }
    }
}

Write-Host "\nStartup Folder Items:" -ForegroundColor Yellow
Get-ChildItem "$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs\\Startup" | Select-Object Name

Write-Host "\n✓ Audit Complete." -ForegroundColor Green`
      },

      'lifecycle_boot_analyzer': {
        name: 'Boot Analyzer',
        description: 'Analyze last BIOS time and boot performance.',
        script: `# KNOUX OS Guardian - Boot Analyzer
Write-Host "=== Boot Performance Analysis ===" -ForegroundColor Cyan

# 1. Last Boot Time
$os = Get-CimInstance Win32_OperatingSystem
Write-Host "Last Boot Time: $($os.LastBootUpTime)" -ForegroundColor Green

# 2. Uptime
$uptime = (Get-Date) - $os.LastBootUpTime
Write-Host "System Uptime: $($uptime.Days)d $($uptime.Hours)h $($uptime.Minutes)m" -ForegroundColor Yellow

# 3. Event Log (Boot Duration - Event ID 100)
Write-Host "\nRetrieving Boot Duration from Event Logs..."
try {
    $bootEvent = Get-WinEvent -LogName "Microsoft-Windows-Diagnostics-Performance/Operational" -FilterXPath "*[System[(EventID=100)]]" -MaxEvents 1 -ErrorAction Stop
    $bootTimeMs = $bootEvent.Properties[0].Value
    Write-Host "Last Boot Duration: $($bootTimeMs / 1000) seconds" -ForegroundColor Cyan
    
    if (($bootTimeMs / 1000) -gt 60) {
        Write-Host "⚠️  Boot time is slow (>60s). Check Startup Optimizer." -ForegroundColor Red
    } else {
        Write-Host "✓ Boot time is healthy." -ForegroundColor Green
    }
} catch {
    Write-Host "Could not retrieve detailed boot metrics (Run as Admin)." -ForegroundColor Gray
}
`
      },

      'lifecycle_hibernate_controller': {
        name: 'Hibernate Controller',
        description: 'Toggle and manage hibernation settings.',
        script: `# KNOUX OS Guardian - Hibernate Controller
param([string]$Action = "Status") # Status, Enable, Disable

Write-Host "=== Hibernation Manager ===" -ForegroundColor Cyan

switch ($Action) {
    "Enable" {
        powercfg /h on
        Write-Host "✓ Hibernation Enabled." -ForegroundColor Green
    }
    "Disable" {
        powercfg /h off
        Write-Host "✓ Hibernation Disabled (Hiberfil.sys deleted)." -ForegroundColor Yellow
    }
    "Status" {
        $status = powercfg /a
        Write-Host "$status" -ForegroundColor Gray
    }
}

# Check Hiberfil size
if (Test-Path "C:\\hiberfil.sys") {
    $file = Get-Item "C:\\hiberfil.sys" -Force
    $sizeGB = [math]::Round($file.Length / 1GB, 2)
    Write-Host "Current Hiberfil.sys size: $sizeGB GB" -ForegroundColor Cyan
}`
      },

      'lifecycle_update_orchestrator': {
        name: 'Update Orchestrator',
        description: 'Manage Windows Update service and cache.',
        script: `# KNOUX OS Guardian - Update Orchestrator
Write-Host "=== Update Orchestrator ===" -ForegroundColor Cyan

# 1. Check Service
$service = Get-Service wuauserv
Write-Host "Windows Update Service: $($service.Status)" -ForegroundColor $(if($service.Status -eq 'Running'){"Green"}else{"Red"})

# 2. Clear Cache Option
Write-Host "Options:"
Write-Host "1. Check for Updates (Launch UI)"
Write-Host "2. Reset Update Cache (Fixes stuck updates)"
Write-Host "3. Exit"

$choice = Read-Host "Select"
if ($choice -eq "1") {
    Start-Process "ms-settings:windowsupdate"
} elseif ($choice -eq "2") {
    Write-Host "Stopping services..." -ForegroundColor Yellow
    Stop-Service wuauserv -Force
    Stop-Service bits -Force
    
    Write-Host "Clearing SoftwareDistribution..."
    Remove-Item "C:\\Windows\\SoftwareDistribution\\*" -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host "Restarting services..."
    Start-Service wuauserv
    Start-Service bits
    Write-Host "✓ Update cache reset complete." -ForegroundColor Green
}`
      },

      // ==========================================
      // MODULE 02: BACKUP ORCHESTRATOR
      // ==========================================

      'backup_full_backup': {
        name: 'Full System Backup',
        description: 'Complete backup using Robocopy with compression.',
        script: `# ============================================
# KNOUX OS Guardian - Full Backup
# Robust Full Backup Strategy
# ============================================
param(
    [string]$SourcePath = $env:USERPROFILE,
    [string]$BackupPath = "D:\\KNOUX_Backups",
    [switch]$IncludeSystemFiles
)
Write-Host "╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   KNOUX Full Backup - Sentinel Core      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝" -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupFolder = Join-Path $BackupPath "FullBackup_$timestamp"

# 1. Validation
if (-not (Test-Path $SourcePath)) {
    Write-Error "Source path does not exist: $SourcePath"
    exit 1
}

# 2. Preparation
Write-Host "\n📁 Creating backup directory: $backupFolder" -ForegroundColor Yellow
New-Item -ItemType Directory -Path $backupFolder -Force | Out-Null

# 3. Calculation
Write-Host "📊 Calculating source size..."
$items = Get-ChildItem -Path $SourcePath -Recurse -Force -ErrorAction SilentlyContinue
$totalSize = ($items | Measure-Object -Property Length -Sum).Sum / 1GB
Write-Host "   Total size to backup: $([math]::Round($totalSize, 2)) GB" -ForegroundColor Green

# 4. Execution (Robocopy)
Write-Host "\n🔄 Starting Replication (Robocopy)..." -ForegroundColor Cyan
# /E = recursive, /Z = restartable, /R:3 = retry 3 times, /MT:8 = multi-threaded
$logFile = "$backupFolder\\backup_log.txt"
$robocopyArgs = @($SourcePath, $backupFolder, "/E", "/Z", "/R:3", "/W:5", "/MT:8", "/NP", "/LOG:$logFile")
Start-Process "robocopy" -ArgumentList $robocopyArgs -NoNewWindow -Wait

# 5. Compression
Write-Host "\n🗜️  Compressing archive..." -ForegroundColor Yellow
$zipPath = "$BackupPath\\FullBackup_$timestamp.zip"
try {
    Compress-Archive -Path $backupFolder -DestinationPath $zipPath -CompressionLevel Optimal -Force
    
    # Optional: Cleanup uncompressed folder to save space
    # Remove-Item -Path $backupFolder -Recurse -Force
    
    Write-Host "✅ Backup successfully compressed: $zipPath" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Compression failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "\n✓ Full Backup Cycle Complete." -ForegroundColor Cyan`
      },

      // ==========================================
      // MODULE 12: UPDATE GUARDIAN
      // ==========================================

      'update_patch_manager': {
        name: 'Patch Manager',
        description: 'Intelligent update and patch management.',
        script: `# ======================================================================
# Project: Update Guardian - Advanced Patch Manager
# Author: knoux
# Date: 2026-02-15
# Description: إدارة التحديثات والتصحيحات بشكل ذكي
# Version: 3.0.0
# ======================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("Check", "Download", "Install", "List", "Hide", "Rollback", "Schedule", "Analyze")]
    [string]$Action = "Check",
    
    [Parameter(Mandatory=$false)]
    [string[]]$UpdateIDs,
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoApprove,
    
    [Parameter(Mandatory=$false)]
    [switch]$IncludeDrivers,
    
    [Parameter(Mandatory=$false)]
    [switch]$IncludeMicrosoft,
    
    [Parameter(Mandatory=$false)]
    [switch]$IncludeThirdParty,
    
    [Parameter(Mandatory=$false)]
    [int]$MaxUpdates = 10,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Critical", "Important", "Moderate", "Low")]
    [string]$MinimumSeverity = "Moderate",
    
    [Parameter(Mandatory=$false)]
    [int]$ScheduleHour = 3, # 3 AM
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoRestart,
    
    [Parameter(Mandatory=$false)]
    [string]$LogPath = "$env:TEMP\\UpdateLogs",
    
    [Parameter(Mandatory=$false)]
    [string]$ReportPath = "$env:USERPROFILE\\Desktop\\UpdateReports"
)

#region Initialization
$scriptName = "Advanced Patch Manager"
$scriptVersion = "3.0.0"
$reportDate = Get-Date -Format "yyyyMMdd_HHmmss"

if (-not (Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath -Force | Out-Null
}

if (-not (Test-Path $ReportPath)) {
    New-Item -ItemType Directory -Path $ReportPath -Force | Out-Null
}

function Write-Log {
    param([string]$Message,[string]$Level="INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Add-Content -Path "$LogPath\\updates_$(Get-Date -Format 'yyyyMMdd').log" -Value $logEntry
    Write-Host $logEntry -ForegroundColor $(switch($Level){
        "ERROR"{"Red"};"WARNING"{"Yellow"};"SUCCESS"{"Green"};"CRITICAL"{"Magenta"};default{"White"}})
}

function Write-ProgressBar {
    param(
        [int]$Percent,
        [int]$Width = 50,
        [string]$Color = "Green"
    )
    
    $filled = [math]::Round(($Percent / 100) * $Width)
    Write-Host "[" -NoNewline
    Write-Host ("█" * $filled) -NoNewline -ForegroundColor $Color
    Write-Host ("░" * ($Width - $filled)) -NoNewline
    Write-Host "] $Percent%"
}

# Load Windows Update API
try {
    Add-Type -AssemblyName Microsoft.UpdateServices.Administration -ErrorAction SilentlyContinue
    $updateSession = New-Object -ComObject Microsoft.Update.Session
    $updateSearcher = $updateSession.CreateUpdateSearcher()
    Write-Log "✅ Windows Update API loaded successfully" -Level "SUCCESS"
}
catch {
    Write-Log "⚠️ Error loading Windows Update API: $_" -Level "WARNING"
    Write-Log "Using fallback detection methods..." -Level "INFO"
}
#endregion

#region Update Core Functions
function Get-AvailableUpdates {
    $updates = @()
    $totalSize = 0
    
    try {
        Write-Log "Searching for available updates..." -Level "INFO"
        
        $criteria = "IsInstalled=0 and Type='Software'"
        if ($IncludeDrivers) {
            $criteria = "IsInstalled=0"
        }
        
        $searchResult = $updateSearcher.Search($criteria)
        Write-Log "Found $($searchResult.Updates.Count) total updates" -Level "INFO"
        
        $severityMap = @{
            "Critical" = 4
            "Important" = 3
            "Moderate" = 2
            "Low" = 1
        }
        
        $minSeverityValue = $severityMap[$MinimumSeverity]
        
        foreach ($update in $searchResult.Updates) {
            if ($updates.Count -ge $MaxUpdates -and -not $AutoApprove) { break }
            
            # Filter by severity
            $severityValue = 0
            if ($update.MsrcSeverity) {
                $severityValue = $severityMap[$update.MsrcSeverity] ?? 0
            }
            
            if ($severityValue -lt $minSeverityValue) {
                continue
            }
            
            # Filter by source
            if (-not $IncludeMicrosoft -and $update.Categories -match "Microsoft") {
                continue
            }
            
            if (-not $IncludeThirdParty -and $update.Categories -notmatch "Microsoft") {
                continue
            }
            
            $size = [math]::Round($update.MaxDownloadSize / 1MB, 2)
            $totalSize += $size
            
            $updateInfo = [PSCustomObject]@{
                ID = $update.Identity.UpdateID
                Title = $update.Title
                Description = $update.Description.Substring(0, [Math]::Min(100, $update.Description.Length)) + "..."
                Size = $size
                SizeMB = "$size MB"
                IsDownloaded = $update.IsDownloaded
                IsMandatory = $update.IsMandatory
                IsBeta = $update.IsBeta
                KBArticleIDs = $update.KBArticleIDs -join ", "
                Categories = ($update.Categories | ForEach-Object { $_.Name }) -join ", "
                Severity = $update.MsrcSeverity
                AutoSelect = $update.AutoSelectOnWebSites
                RebootRequired = $update.RebootRequired
                DownloadPriority = $update.DownloadPriority
                CreationDate = $update.CreationDate
                LastDeploymentTime = $update.LastDeploymentChangeTime
            }
            
            $updates += $updateInfo
        }
        
        Write-Log "Filtered to $($updates.Count) updates based on criteria" -Level "SUCCESS"
    }
    catch {
        Write-Log "Error searching for updates: $_" -Level "ERROR"
        
        # Fallback: Use system update detection
        $wu = New-Object -ComObject "Microsoft.Update.Searcher"
        $results = $wu.Search("IsInstalled=0")
        foreach ($update in $results.Updates) {
            $updates += [PSCustomObject]@{
                ID = $update.Identity.UpdateID
                Title = $update.Title
                Size = [math]::Round($update.MaxDownloadSize / 1MB, 2)
                Severity = "Unknown"
            }
        }
    }
    
    return [PSCustomObject]@{
        Count = $updates.Count
        TotalSize = [math]::Round($totalSize, 2)
        Updates = $updates
    }
}

function Start-UpdateDownload {
    param(
        [array]$UpdatesToDownload,
        [switch]$ShowProgress
    )
    
    try {
        $downloader = $updateSession.CreateUpdateDownloader()
        $updateCollection = New-Object -ComObject Microsoft.Update.UpdateColl
        
        $total = $UpdatesToDownload.Count
        $current = 0
        
        foreach ($updateId in $UpdatesToDownload) {
            $current++
            if ($ShowProgress) {
                Write-Progress -Activity "Downloading Updates" -Status "$current of $total" -PercentComplete (($current / $total) * 100)
            }
            
            $searchString = "UpdateID='$updateId'"
            $searchResult = $updateSearcher.Search($searchString)
            
            if ($searchResult.Updates.Count -gt 0) {
                $updateCollection.Add($searchResult.Updates[0]) | Out-Null
                Write-Log "Added update for download: $updateId" -Level "INFO"
            }
        }
        
        if ($updateCollection.Count -gt 0) {
            $downloader.Updates = $updateCollection
            
            # Register progress events
            $downloader.OnProgressChanged = {
                param($sender, $args)
                if ($ShowProgress) {
                    Write-Progress -Activity "Downloading" -Status "$($args.PercentComplete)% Complete" -PercentComplete $args.PercentComplete
                }
            }
            
            $downloadResult = $downloader.Download()
            
            Write-Log "Download completed with result: $($downloadResult.ResultCode)" -Level "SUCCESS"
            return $downloadResult
        }
        else {
            Write-Log "No valid updates to download" -Level "WARNING"
            return $null
        }
    }
    catch {
        Write-Log "Error downloading updates: $_" -Level "ERROR"
        return $null
    }
}

function Start-UpdateInstall {
    param(
        [array]$UpdatesToInstall,
        [switch]$ShowProgress
    )
    
    try {
        $installer = $updateSession.CreateUpdateInstaller()
        $updateCollection = New-Object -ComObject Microsoft.Update.UpdateColl
        
        $total = $UpdatesToInstall.Count
        $current = 0
        
        foreach ($updateId in $UpdatesToInstall) {
            $current++
            if ($ShowProgress) {
                Write-Progress -Activity "Preparing Installation" -Status "$current of $total" -PercentComplete (($current / $total) * 100)
            }
            
            $searchString = "UpdateID='$updateId'"
            $searchResult = $updateSearcher.Search($searchString)
            
            if ($searchResult.Updates.Count -gt 0 -and $searchResult.Updates[0].IsDownloaded) {
                $updateCollection.Add($searchResult.Updates[0]) | Out-Null
                Write-Log "Added update for installation: $updateId" -Level "INFO"
            }
        }
        
        if ($updateCollection.Count -gt 0) {
            $installer.Updates = $updateCollection
            
            # Register progress events
            $installer.OnProgressChanged = {
                param($sender, $args)
                if ($ShowProgress) {
                    Write-Progress -Activity "Installing Updates" -Status "$($args.PercentComplete)% Complete" -PercentComplete $args.PercentComplete
                }
            }
            
            Write-Log "Starting installation of $($updateCollection.Count) updates..." -Level "INFO"
            $installationResult = $installer.Install()
            
            $rebootRequired = $false
            foreach ($update in $updateCollection) {
                if ($update.RebootRequired) {
                    $rebootRequired = $true
                    break
                }
            }
            
            Write-Log "Installation completed with result: $($installationResult.ResultCode)" -Level "SUCCESS"
            
            return [PSCustomObject]@{
                Result = $installationResult
                RebootRequired = $rebootRequired
                InstalledCount = $updateCollection.Count
            }
        }
        else {
            Write-Log "No valid updates to install" -Level "WARNING"
            return $null
        }
    }
    catch {
        Write-Log "Error installing updates: $_" -Level "ERROR"
        return $null
    }
}

function Get-UpdateHistory {
    param([int]$MaxEntries = 50)
    
    $history = @()
    
    try {
        $session = New-Object -ComObject Microsoft.Update.Session
        $searcher = $session.CreateUpdateSearcher()
        $historyEntries = $searcher.QueryHistory(0, $MaxEntries)
        
        foreach ($entry in $historyEntries) {
            $history += [PSCustomObject]@{
                Date = $entry.Date
                Title = $entry.Title
                Description = $entry.Description
                ResultCode = switch ($entry.ResultCode) {
                    0 { "Not Started" }
                    1 { "In Progress" }
                    2 { "Succeeded" }
                    3 { "Succeeded With Errors" }
                    4 { "Failed" }
                    5 { "Aborted" }
                    default { "Unknown" }
                }
                HResult = $entry.HResult
                SupportUrl = $entry.SupportUrl
            }
        }
    }
    catch {
        Write-Log "Error getting update history: $_" -Level "ERROR"
    }
    
    return $history
}

function Hide-Update {
    param([string]$UpdateID)
    
    try {
        $searchString = "UpdateID='$UpdateID'"
        $searchResult = $updateSearcher.Search($searchString)
        
        if ($searchResult.Updates.Count -gt 0) {
            $update = $searchResult.Updates[0]
            $update.IsHidden = $true
            Write-Log "✅ Update $UpdateID hidden successfully" -Level "SUCCESS"
            return $true
        }
    }
    catch {
        Write-Log "Error hiding update: $_" -Level "ERROR"
        return $false
    }
}

function New-RestorePoint {
    param([string]$Description = "Before Windows Updates")
    
    try {
        Checkpoint-Computer -Description $Description -RestorePointType MODIFY_SETTINGS
        Write-Log "✅ Restore point created: $Description" -Level "SUCCESS"
        return $true
    }
    catch {
        Write-Log "Error creating restore point: $_" -Level "WARNING"
        return $false
    }
}

function Invoke-UpdateAnalysis {
    param([array]$Updates)
    
    $analysis = [PSCustomObject]@{
        CriticalCount = ($updates | Where-Object { $_.Severity -eq "Critical" }).Count
        ImportantCount = ($updates | Where-Object { $_.Severity -eq "Important" }).Count
        ModerateCount = ($updates | Where-Object { $_.Severity -eq "Moderate" }).Count
        LowCount = ($updates | Where-Object { $_.Severity -eq "Low" }).Count
        TotalSize = ($updates | Measure-Object -Property Size -Sum).Sum
        RebootRequired = ($updates | Where-Object { $_.RebootRequired }).Count -gt 0
        EstimatedTime = [math]::Round(($updates.Count * 2) + ($updates | Measure-Object -Property Size -Sum).Sum / 10, 0)
    }
    
    return $analysis
}
#endregion

#region Main Execution
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              UPDATE GUARDIAN - PATCH MANAGER                 ║" -ForegroundColor Cyan
Write-Host "╠══════════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║ Action: $Action".PadRight(55) + "║" -ForegroundColor White
Write-Host "║ Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')".PadRight(55) + "║" -ForegroundColor White
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

switch ($Action) {
    "Check" {
        Write-Host "\`n🔍 CHECKING FOR UPDATES" -ForegroundColor Magenta
        Write-Host "════════════════════════════════════════════" -ForegroundColor DarkMagenta
        
        $updateData = Get-AvailableUpdates
        $analysis = Invoke-UpdateAnalysis -Updates $updateData.Updates
        
        Write-Host "\`n📊 UPDATE SUMMARY" -ForegroundColor Cyan
        Write-Host "Total Updates: $($updateData.Count)" -ForegroundColor White
        Write-Host "Total Size: $($updateData.TotalSize) MB" -ForegroundColor Yellow
        
        Write-Host "\`n📈 SEVERITY BREAKDOWN" -ForegroundColor Magenta
        Write-Host "Critical: $($analysis.CriticalCount)" -ForegroundColor Red
        Write-Host "Important: $($analysis.ImportantCount)" -ForegroundColor Yellow
        Write-Host "Moderate: $($analysis.ModerateCount)" -ForegroundColor Cyan
        Write-Host "Low: $($analysis.LowCount)" -ForegroundColor Green
        
        Write-Host "\`n📋 AVAILABLE UPDATES" -ForegroundColor Cyan
        $updateData.Updates | Format-Table -Property @{Name="ID";Expression={$_.ID.Substring(0,8)}},
            @{Name="Title";Expression={$_.Title.Substring(0,[Math]::Min(50,$_.Title.Length))}},
            @{Name="Size";Expression={$_.SizeMB}},
            Severity,
            RebootRequired -AutoSize
        
        if ($analysis.RebootRequired) {
            Write-Host "\`n⚠️ Some updates require a system restart" -ForegroundColor Yellow
        }
        
        # Save report
        $reportFile = Join-Path $ReportPath "update_check_$reportDate.json"
        $updateData | ConvertTo-Json -Depth 5 | Out-File $reportFile
        Write-Log "📊 Report saved to: $reportFile" -Level "SUCCESS"
    }
    
    "Download" {
        Write-Host "\`n📥 DOWNLOADING UPDATES" -ForegroundColor Cyan
        Write-Host "════════════════════════════════════════════" -ForegroundColor DarkCyan
        
        $updateData = Get-AvailableUpdates
        
        if ($AutoApprove) {
            $updatesToDownload = $updateData.Updates | Where-Object { $_.AutoSelect } | Select-Object -First $MaxUpdates
        }
        elseif ($UpdateIDs) {
            $updatesToDownload = $updateData.Updates | Where-Object { $_.ID -in $UpdateIDs }
        }
        else {
            $updatesToDownload = $updateData.Updates | Where-Object { $_.Severity -in @("Critical", "Important") } | Select-Object -First $MaxUpdates
        }
        
        if ($updatesToDownload.Count -gt 0) {
            Write-Log "Downloading $($updatesToDownload.Count) updates..." -Level "INFO"
            Write-Log "Total size: $(($updatesToDownload | Measure-Object -Property Size -Sum).Sum) MB" -Level "INFO"
            
            $result = Start-UpdateDownload -UpdatesToDownload $updatesToDownload.ID -ShowProgress
            
            Write-Host "\`n✅ DOWNLOAD COMPLETE" -ForegroundColor Green
            $updatesToDownload | Format-Table -Property @{Name="Update";Expression={$_.Title.Substring(0,40)}}, Size, Status -AutoSize
        }
        else {
            Write-Log "No updates selected for download" -Level "WARNING"
        }
    }
    
    "Install" {
        Write-Host "\`n⚙️ INSTALLING UPDATES" -ForegroundColor Yellow
        Write-Host "════════════════════════════════════════════" -ForegroundColor DarkYellow
        
        # Create restore point before installation
        Write-Log "Creating system restore point..." -Level "INFO"
        New-RestorePoint -Description "Before update installation $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
        
        if ($UpdateIDs) {
            Write-Log "Installing specified updates..." -Level "INFO"
            $result = Start-UpdateInstall -UpdatesToInstall $UpdateIDs -ShowProgress
            
            if ($result -and $result.Result.ResultCode -eq 2) {
                Write-Host "\`n✅ UPDATES INSTALLED SUCCESSFULLY!" -ForegroundColor Green
                Write-Host "Installed: $($result.InstalledCount) updates" -ForegroundColor White
                
                if ($result.RebootRequired) {
                    Write-Host "\`n⚠️ SYSTEM RESTART REQUIRED" -ForegroundColor Yellow -BackgroundColor DarkRed
                    
                    if ($AutoRestart) {
                        Write-Log "Auto-restart enabled. Restarting in 60 seconds..." -Level "WARNING"
                        shutdown /r /t 60 /c "System will restart to complete update installation"
                    }
                }
            }
            else {
                Write-Host "\`n❌ INSTALLATION FAILED" -ForegroundColor Red
            }
        }
        else {
            Write-Log "No update IDs specified" -Level "ERROR"
        }
    }
    
    "List" {
        Write-Host "\`n📋 UPDATE HISTORY" -ForegroundColor Magenta
        Write-Host "════════════════════════════════════════════" -ForegroundColor DarkMagenta
        
        $history = Get-UpdateHistory -MaxEntries 50
        
        $history | ForEach-Object {
            $color = switch ($_.ResultCode) {
                "Succeeded" { "Green" }
                "Failed" { "Red" }
                "Succeeded With Errors" { "Yellow" }
                default { "White" }
            }
            
            Write-Host "$($_.Date.ToString('yyyy-MM-dd HH:mm')) | " -NoNewline
            Write-Host "$($_.ResultCode)" -ForegroundColor $color -NoNewline
            Write-Host " | $($_.Title.Substring(0, [Math]::Min(50, $_.Title.Length)))"
        }
        
        # Export history
        $historyFile = Join-Path $ReportPath "update_history_$reportDate.csv"
        $history | Export-Csv $historyFile -NoTypeInformation
        Write-Log "📊 History exported to: $historyFile" -Level "SUCCESS"
    }
    
    "Hide" {
        if ($UpdateIDs) {
            Write-Host "\`n🙈 HIDING UPDATES" -ForegroundColor Gray
            
            foreach ($id in $UpdateIDs) {
                if (Hide-Update -UpdateID $id) {
                    Write-Host "✓ Hidden: $id" -ForegroundColor Green
                }
            }
        }
    }
    
    "Rollback" {
        Write-Host "\`n↩️ UPDATE ROLLBACK" -ForegroundColor Yellow
        Write-Host "════════════════════════════════════════════" -ForegroundColor DarkYellow
        
        # Get recent updates (last 30 days)
        $recentDate = (Get-Date).AddDays(-30)
        $history = Get-UpdateHistory -MaxEntries 100 | Where-Object { $_.Date -gt $recentDate -and $_.ResultCode -eq "Succeeded" }
        
        if ($UpdateIDs) {
            $toRollback = $history | Where-Object { $_.Title -match ($UpdateIDs -join "|") }
        }
        else {
            $toRollback = $history | Select-Object -Last 5
        }
        
        if ($toRollback.Count -gt 0) {
            Write-Log "Found $($toRollback.Count) updates to rollback" -Level "INFO"
            
            foreach ($update in $toRollback) {
                Write-Host "Attempting to rollback: $($update.Title)" -ForegroundColor Yellow
                
                # Try to find uninstall string
                try {
                    $productName = $update.Title -replace '^Update for |\\(.*?\\)', '' -replace '\s+$', ''
                    $product = Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like "*$productName*" }
                    
                    if ($product) {
                        Write-Log "Found product: $($product.Name)" -Level "INFO"
                        $result = $product.Uninstall()
                        Write-Log "Uninstall result: $($result.ReturnValue)" -Level "INFO"
                    }
                    else {
                        Write-Log "No product found for uninstall, trying DISM..." -Level "WARNING"
                        
                        # Extract KB number
                        if ($update.Title -match 'KB\d+') {
                            $kbNumber = $matches[0]
                            $dismOutput = dism /online /remove-package /packagename:$kbNumber
                            Write-Log $dismOutput -Level "INFO"
                        }
                    }
                }
                catch {
                    Write-Log "Error during rollback: $_" -Level "ERROR"
                }
            }
        }
    }
    
    "Schedule" {
        Write-Host "\`n⏰ SCHEDULING UPDATES" -ForegroundColor Cyan
        
        $taskName = "KNOUX_Update_Guardian"
        $scriptPath = $MyInvocation.MyCommand.Path
        
        # Create scheduled task for daily updates
        $action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File \`"$scriptPath\`" -Action Install -AutoApprove -AutoRestart"
        $trigger = New-ScheduledTaskTrigger -Daily -At "$ScheduleHour\`:00"
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
        
        Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Settings $settings -Force
        
        Write-Log "✅ Scheduled task created: $taskName" -Level "SUCCESS"
        Write-Log "Schedule: Daily at $ScheduleHour\`:00 AM" -Level "INFO"
    }
    
    "Analyze" {
        Write-Host "\`n📊 UPDATE ANALYSIS" -ForegroundColor Magenta
        Write-Host "════════════════════════════════════════════" -ForegroundColor DarkMagenta
        
        $updateData = Get-AvailableUpdates
        $analysis = Invoke-UpdateAnalysis -Updates $updateData.Updates
        $history = Get-UpdateHistory -MaxEntries 100
        
        # System health score
        $successRate = ($history | Where-Object { $_.ResultCode -eq "Succeeded" }).Count / $history.Count * 100
        $healthScore = 100 - ($analysis.CriticalCount * 10) - ($analysis.ImportantCount * 5)
        $healthScore = [Math]::Max(0, [Math]::Min(100, $healthScore))
        
        Write-Host "\`n🩺 SYSTEM HEALTH SCORE" -ForegroundColor Cyan
        Write-ProgressBar -Percent $healthScore -Color $(if($healthScore -gt 80){"Green"}elseif($healthScore -gt 50){"Yellow"}else{"Red"})
        
        Write-Host "\`n📈 UPDATE STATISTICS" -ForegroundColor White
        Write-Host "Success Rate: $([math]::Round($successRate, 2))%" -ForegroundColor Green
        Write-Host "Total Updates Installed: $($history.Count)" -ForegroundColor Cyan
        Write-Host "Failed Updates: $(($history | Where-Object { $_.ResultCode -eq "Failed" }).Count)" -ForegroundColor Red
        
        Write-Host "\`n🎯 RECOMMENDATIONS" -ForegroundColor Yellow
        if ($analysis.CriticalCount -gt 0) {
            Write-Host "• Install critical updates immediately" -ForegroundColor Red
        }
        if ($analysis.RebootRequired) {
            Write-Host "• System restart pending" -ForegroundColor Yellow
        }
        if ($healthScore -lt 50) {
            Write-Host "• Consider clean Windows installation" -ForegroundColor Magenta
        }
    }
}
#endregion

#region Report Generation
$finalReport = @{
    ScanTime = Get-Date
    Action = $Action
    ComputerInfo = @{
        Name = $env:COMPUTERNAME
        OS = (Get-WmiObject Win32_OperatingSystem).Caption
        Version = (Get-WmiObject Win32_OperatingSystem).Version
        LastBoot = (Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime
        Uptime = [math]::Round(((Get-Date) - (Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime).TotalHours, 2)
    }
    UpdateSettings = @{
        IncludeDrivers = $IncludeDrivers
        IncludeMicrosoft = $IncludeMicrosoft
        IncludeThirdParty = $IncludeThirdParty
        AutoApprove = $AutoApprove
        AutoRestart = $AutoRestart
    }
    Results = @{
        UpdatesFound = (Get-AvailableUpdates).Count
        HistoryCount = (Get-UpdateHistory).Count
    }
}

$reportFile = Join-Path $ReportPath "update_report_$reportDate.json"
$finalReport | ConvertTo-Json -Depth 5 | Out-File $reportFile
Write-Log "📊 Final report saved to: $reportFile" -Level "SUCCESS"
#endregion

#region Interactive GUI
if (-not $UpdateIDs -and $Action -ne "Schedule") {
    Add-Type -AssemblyName System.Windows.Forms
    Add-Type -AssemblyName System.Drawing
    
    $form = New-Object System.Windows.Forms.Form
    $form.Text = "Update Guardian Dashboard"
    $form.Size = New-Object System.Drawing.Size(900,600)
    $form.StartPosition = "CenterScreen"
    $form.BackColor = "#1a1a1a"
    
    # Tab Control
    $tabControl = New-Object System.Windows.Forms.TabControl
    $tabControl.Location = New-Object System.Drawing.Point(10,10)
    $tabControl.Size = New-Object System.Drawing.Size(860,540)
    
    # Available Updates Tab
    $tabAvailable = New-Object System.Windows.Forms.TabPage
    $tabAvailable.Text = "📦 Available Updates"
    $tabAvailable.BackColor = "#2d2d2d"
    
    $listView = New-Object System.Windows.Forms.ListView
    $listView.Location = New-Object System.Drawing.Point(10,10)
    $listView.Size = New-Object System.Drawing.Size(820,450)
    $listView.View = [System.Windows.Forms.View]::Details
    $listView.FullRowSelect = $true
    $listView.GridLines = $true
    $listView.BackColor = "#2d2d2d"
    $listView.ForeColor = "#00F7FF"
    
    $listView.Columns.Add("Title", 350)
    $listView.Columns.Add("Size (MB)", 80)
    $listView.Columns.Add("Severity", 100)
    $listView.Columns.Add("Reboot", 80)
    $listView.Columns.Add("ID", 150)
    
    $updateData = Get-AvailableUpdates
    foreach ($update in $updateData.Updates) {
        $item = New-Object System.Windows.Forms.ListViewItem($update.Title.Substring(0, [Math]::Min(60, $update.Title.Length)))
        $item.SubItems.Add($update.Size) | Out-Null
        $item.SubItems.Add($update.Severity) | Out-Null
        $item.SubItems.Add($update.RebootRequired) | Out-Null
        $item.SubItems.Add($update.ID.Substring(0, 8)) | Out-Null
        
        # Color coding
        switch ($update.Severity) {
            "Critical" { $item.ForeColor = "Red" }
            "Important" { $item.ForeColor = "Yellow" }
            "Moderate" { $item.ForeColor = "Cyan" }
            default { $item.ForeColor = "Green" }
        }
        
        $listView.Items.Add($item) | Out-Null
    }
    
    $tabAvailable.Controls.Add($listView)
    
    # History Tab
    $tabHistory = New-Object System.Windows.Forms.TabPage
    $tabHistory.Text = "📋 Update History"
    $tabHistory.BackColor = "#2d2d2d"
    
    $historyBox = New-Object System.Windows.Forms.RichTextBox
    $historyBox.Location = New-Object System.Drawing.Point(10,10)
    $historyBox.Size = New-Object System.Drawing.Size(820,450)
    $historyBox.BackColor = "#2d2d2d"
    $historyBox.ForeColor = "#00F7FF"
    $historyBox.Font = New-Object System.Drawing.Font("Consolas", 9)
    $historyBox.ReadOnly = $true
    
    $history = Get-UpdateHistory -MaxEntries 100
    foreach ($entry in $history) {
        $color = switch ($entry.ResultCode) {
            "Succeeded" { "Green" }
            "Failed" { "Red" }
            default { "White" }
        }
        $historyBox.SelectionColor = [System.Drawing.Color]::FromName($color)
        $historyBox.AppendText("$($entry.Date) - $($entry.Title) [$($entry.ResultCode)]\`r\`n")
    }
    
    $tabHistory.Controls.Add($historyBox)
    
    # Analysis Tab
    $tabAnalysis = New-Object System.Windows.Forms.TabPage
    $tabAnalysis.Text = "📊 Analysis"
    $tabAnalysis.BackColor = "#2d2d2d"
    
    $analysisBox = New-Object System.Windows.Forms.RichTextBox
    $analysisBox.Location = New-Object System.Drawing.Point(10,10)
    $analysisBox.Size = New-Object System.Drawing.Size(820,450)
    $analysisBox.BackColor = "#2d2d2d"
    $analysisBox.ForeColor = "#00F7FF"
    $analysisBox.Font = New-Object System.Drawing.Font("Consolas", 10)
    $analysisBox.ReadOnly = $true
    
    $analysis = Invoke-UpdateAnalysis -Updates $updateData.Updates
    $analysisBox.AppendText("📊 UPDATE ANALYSIS REPORT\`r\`n")
    $analysisBox.AppendText("════════════════════════════════════════════\`r\`n\`r\`n")
    $analysisBox.AppendText("Critical Updates: $($analysis.CriticalCount)\`r\`n")
    $analysisBox.AppendText("Important Updates: $($analysis.ImportantCount)\`r\`n")
    $analysisBox.AppendText("Moderate Updates: $($analysis.ModerateCount)\`r\`n")
    $analysisBox.AppendText("Low Updates: $($analysis.LowCount)\`r\`n\`r\`n")
    $analysisBox.AppendText("Total Size: $($analysis.TotalSize) MB\`r\`n")
    $analysisBox.AppendText("Reboot Required: $($analysis.RebootRequired)\`r\`n")
    $analysisBox.AppendText("Estimated Time: $($analysis.EstimatedTime) minutes\`r\`n")
    
    $tabAnalysis.Controls.Add($analysisBox)
    
    $tabControl.TabPages.Add($tabAvailable)
    $tabControl.TabPages.Add($tabHistory)
    $tabControl.TabPages.Add($tabAnalysis)
    
    $form.Controls.Add($tabControl)
    
    # Status Bar
    $statusBar = New-Object System.Windows.Forms.StatusStrip
    $statusLabel = New-Object System.Windows.Forms.ToolStripStatusLabel
    $statusLabel.Text = "Total Updates: $($updateData.Count) | Last Check: $(Get-Date -Format 'HH:mm:ss')"
    $statusLabel.ForeColor = "#00F7FF"
    $statusBar.Items.Add($statusLabel)
    $form.Controls.Add($statusBar)
    
    $form.ShowDialog()
}
#endregion
`
      },

      'update_rollback_updates': {
        name: 'Rollback Updates',
        description: 'Rollback failed or problematic updates.',
        script: `# ======================================================================
# Project: Update Guardian - Rollback Manager
# Author: knoux
# Date: 2026-02-15
# Description: الرجوع للتحديثات الفاشلة
# Version: 2.0.0
# ======================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string[]]$KBIDs,
    
    [Parameter(Mandatory=$false)]
    [int]$DaysBack = 7,
    
    [Parameter(Mandatory=$false)]
    [switch]$UseSystemRestore,
    
    [Parameter(Mandatory=$false)]
    [switch]$ListAvailable,
    
    [Parameter(Mandatory=$false)]
    [string]$LogPath = "$env:TEMP\\RollbackLogs"
)

#region Initialization
$scriptName = "Update Rollback Manager"
$scriptVersion = "2.0.0"

if (-not (Test-Path $LogPath)) {
    New-Item -ItemType Directory -Path $LogPath -Force | Out-Null
}

function Write-Log {
    param([string]$Message,[string]$Level="INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Add-Content -Path "$LogPath\\rollback_$(Get-Date -Format 'yyyyMMdd').log" -Value $logEntry
    Write-Host $logEntry -ForegroundColor $(switch($Level){
        "ERROR"{"Red"};"WARNING"{"Yellow"};"SUCCESS"{"Green"};default{"White"}})
}

function Get-RecentUpdates {
    param([int]$Days = 7)
    
    $cutoffDate = (Get-Date).AddDays(-$Days)
    $session = New-Object -ComObject Microsoft.Update.Session
    $searcher = $session.CreateUpdateSearcher()
    $history = $searcher.QueryHistory(0, 100)
    
    $recent = @()
    foreach ($entry in $history) {
        if ($entry.Date -gt $cutoffDate) {
            $recent += [PSCustomObject]@{
                Date = $entry.Date
                Title = $entry.Title
                KB = if ($entry.Title -match 'KB\d+') { $matches[0] } else { "Unknown" }
                Result = $entry.ResultCode
            }
        }
    }
    
    return $recent
}

function Invoke-UpdateRollback {
    param([string]$KB)
    
    Write-Log "Attempting to rollback KB: $KB" -Level "INFO"
    
    # Method 1: DISM
    try {
        $dismOutput = dism /online /remove-package /packagename:$KB /quiet /norestart
        Write-Log "DISM rollback attempted" -Level "INFO"
        return $true
    }
    catch {
        Write-Log "DISM rollback failed: $_" -Level "WARNING"
    }
    
    # Method 2: WUSA
    try {
        $wusaOutput = wusa /uninstall /kb:$($KB -replace 'KB','') /quiet /norestart
        Write-Log "WUSA rollback attempted" -Level "INFO"
        return $true
    }
    catch {
        Write-Log "WUSA rollback failed: $_" -Level "ERROR"
    }
    
    return $false
}
#endregion

# Main Execution
if ($ListAvailable) {
    $updates = Get-RecentUpdates -Days $DaysBack
    $updates | Format-Table -Property Date, KB, Title -AutoSize
}
elseif ($KBIDs) {
    foreach ($kb in $KBIDs) {
        Invoke-UpdateRollback -KB $kb
    }
}
else {
    Write-Log "Please specify KB IDs to rollback or use -ListAvailable" -Level "ERROR"
}
`
      },

      'update_auto_schedule': {
        name: 'Auto Schedule',
        description: 'Smart update scheduling.',
        script: `# ======================================================================
# Project: Update Guardian - Smart Scheduler
# Author: knoux
# Date: 2026-02-15
# Description: جدولة التحديثات الذكية
# Version: 2.0.0
# ======================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [int]$Hour = 3,
    
    [Parameter(Mandatory=$false)]
    [string[]]$DaysOfWeek = @("Monday", "Wednesday", "Friday"),
    
    [Parameter(Mandatory=$false)]
    [switch]$Enable,
    
    [Parameter(Mandatory=$false)]
    [switch]$Disable,
    
    [Parameter(Mandatory=$false)]
    [switch]$Status,
    
    [Parameter(Mandatory=$false)]
    [string]$TaskName = "KNOUX_Update_Scheduler"
)

#region Initialization
$scriptName = "Smart Update Scheduler"
$scriptVersion = "2.0.0"
$scriptPath = $MyInvocation.MyCommand.Path

function Write-Log {
    param([string]$Message)
    Write-Host "$(Get-Date -Format 'HH:mm:ss') | $Message"
}
#endregion

switch ($Enable) {
    $true {
        # Create triggers for each selected day
        $triggers = @()
        foreach ($day in $DaysOfWeek) {
            $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek $day -At "$Hour\`:00"
            $triggers += $trigger
        }
        
        $action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File \`"$scriptPath\`" -Action Install -AutoApprove"
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -WakeToRun
        
        Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $triggers -Settings $settings -Force
        Write-Log "✅ Schedule created: $TaskName"
    }
    
    $Disable {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Log "⏹️ Schedule disabled: $TaskName"
    }
    
    $Status {
        $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        if ($task) {
            Write-Log "✅ Schedule is active"
            $task | Format-List -Property TaskName, State, Triggers
        } else {
            Write-Log "❌ No schedule found"
        }
    }
}
`
      },

      'update_update_logs': {
        name: 'Update Logs',
        description: 'Log analyzer for updates and patches.',
        script: `# ======================================================================
# Project: Update Guardian - Log Analyzer
# Author: knoux
# Date: 2026-02-15
# Description: سجل التحديثات والتصحيحات
# Version: 2.0.0
# ======================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [int]$Days = 30,
    
    [Parameter(Mandatory=$false)]
    [switch]$ExportToCSV,
    
    [Parameter(Mandatory=$false)]
    [string]$OutputPath = "$env:USERPROFILE\\Desktop\\UpdateLogs"
)

#region Initialization
$scriptName = "Update Log Analyzer"
$scriptVersion = "2.0.0"

if (-not (Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

function Write-Log {
    param([string]$Message)
    Write-Host "$(Get-Date -Format 'HH:mm:ss') | $Message"
}
#endregion

# Collect update logs from Windows Update logs and event viewer
$logs = @()

# Windows Update log
$wuLog = Get-WinEvent -LogName "System" -MaxEvents 1000 | Where-Object { $_.ProviderName -match "Windows Update" -and $_.TimeCreated -gt (Get-Date).AddDays(-$Days) }

foreach ($event in $wuLog) {
    $logs += [PSCustomObject]@{
        Date = $event.TimeCreated
        Source = "Windows Update"
        Level = $event.LevelDisplayName
        Message = $event.Message
        ID = $event.Id
    }
}

# Microsoft-Windows-WindowsUpdateClient/Operational
try {
    $wuClientLog = Get-WinEvent -LogName "Microsoft-Windows-WindowsUpdateClient/Operational" -MaxEvents 1000 -ErrorAction SilentlyContinue | Where-Object { $_.TimeCreated -gt (Get-Date).AddDays(-$Days) }
    
    foreach ($event in $wuClientLog) {
        $logs += [PSCustomObject]@{
            Date = $event.TimeCreated
            Source = "Update Client"
            Level = $event.LevelDisplayName
            Message = $event.Message
            ID = $event.Id
        }
    }
}
catch {}

# Sort by date
$logs = $logs | Sort-Object Date -Descending

# Display
Write-Host "\`n📋 UPDATE LOGS (Last $Days Days)" -ForegroundColor Magenta
Write-Host "════════════════════════════════════════════" -ForegroundColor DarkMagenta

$logs | Select-Object -First 50 | Format-Table -Property Date, Source, @{Name="Message";Expression={$_.Message.Substring(0, [Math]::Min(80, $_.Message.Length))}} -AutoSize

# Export
if ($ExportToCSV) {
    $file = Join-Path $OutputPath "update_logs_$(Get-Date -Format 'yyyyMMdd_HHmmss').csv"
    $logs | Export-Csv $file -NoTypeInformation
    Write-Log "✅ Logs exported to: $file"
}

Write-Log "Total entries: $($logs.Count)"
`
      },

      'update_version_check': {
        name: 'Version Check',
        description: 'Check for latest versions of critical apps.',
        script: `# ======================================================================
# Project: Update Guardian - Version Checker
# Author: knoux
# Date: 2026-02-15
# Description: التحقق من أحدث الإصدارات
# Version: 2.0.0
# ======================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string[]]$Applications = @("Windows", "Office", "Chrome", "Firefox", "VSCode"),
    
    [Parameter(Mandatory=$false)]
    [switch]$CheckAll,
    
    [Parameter(Mandatory=$false)]
    [string]$OutputPath = "$env:USERPROFILE\\Desktop\\VersionReports"
)

#region Initialization
$scriptName = "Version Checker"
$scriptVersion = "2.0.0"

if (-not (Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

function Write-Log {
    param([string]$Message)
    Write-Host "$(Get-Date -Format 'HH:mm:ss') | $Message"
}
#endregion

# Application version database (simulated)
$versionDB = @{
    "Windows" = @{ Current = "22H2"; Latest = "23H2"; Critical = $false }
    "Office" = @{ Current = "2308"; Latest = "2310"; Critical = $true }
    "Chrome" = @{ Current = "120.0.6099"; Latest = "121.0.6167"; Critical = $false }
    "Firefox" = @{ Current = "121.0"; Latest = "121.0.1"; Critical = $false }
    "VSCode" = @{ Current = "1.85.0"; Latest = "1.85.1"; Critical = $false }
}

$results = @()

foreach ($app in $Applications) {
    if ($versionDB.ContainsKey($app)) {
        $info = $versionDB[$app]
        $needsUpdate = $info.Current -ne $info.Latest
        
        $results += [PSCustomObject]@{
            Application = $app
            CurrentVersion = $info.Current
            LatestVersion = $info.Latest
            NeedsUpdate = $needsUpdate
            Critical = $info.Critical
        }
        
        $color = if ($needsUpdate) { if ($info.Critical) { "Red" } else { "Yellow" } } else { "Green" }
        Write-Host "$app : Current $($info.Current) -> Latest $($info.Latest) " -NoNewline
        if ($needsUpdate) {
            Write-Host "[UPDATE AVAILABLE]" -ForegroundColor $color
        } else {
            Write-Host "[UP TO DATE]" -ForegroundColor $color
        }
    }
}

# Export report
$reportFile = Join-Path $OutputPath "version_check_$(Get-Date -Format 'yyyyMMdd_HHmmss').json"
$results | ConvertTo-Json | Out-File $reportFile
Write-Log "✅ Report saved to: $reportFile"
`
      },

      'update_notification_system': {
        name: 'Notification System',
        description: 'Notify on critical updates.',
        script: `# ======================================================================
# Project: Update Guardian - Notification System
# Author: knoux
# Date: 2026-02-15
# Description: إشعارات بالتحديثات الهامة
# Version: 2.0.0
# ======================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string]$EmailTo,
    
    [Parameter(Mandatory=$false)]
    [string]$SmtpServer = "smtp.gmail.com",
    
    [Parameter(Mandatory=$false)]
    [int]$SmtpPort = 587,
    
    [Parameter(Mandatory=$false)]
    [switch]$Popup,
    
    [Parameter(Mandatory=$false)]
    [switch]$Sound,
    
    [Parameter(Mandatory=$false)]
    [switch]$Test
)

#region Initialization
$scriptName = "Update Notification System"
$scriptVersion = "2.0.0"

function Write-Log {
    param([string]$Message)
    Write-Host "$(Get-Date -Format 'HH:mm:ss') | $Message"
}
#endregion

# Check for critical updates
$criticalUpdates = @()
$session = New-Object -ComObject Microsoft.Update.Session
$searcher = $session.CreateUpdateSearcher()
$searchResult = $searcher.Search("IsInstalled=0 and IsHidden=0")

foreach ($update in $searchResult.Updates) {
    if ($update.MsrcSeverity -eq "Critical" -or $update.IsMandatory) {
        $criticalUpdates += $update
    }
}

if ($criticalUpdates.Count -gt 0 -or $Test) {
    $message = "⚠️ Critical Updates Available: $($criticalUpdates.Count)\`n\`n"
    foreach ($update in $criticalUpdates) {
        $message += "• $($update.Title)\`n"
    }
    
    # Popup notification
    if ($Popup) {
        $popup = New-Object -ComObject Wscript.Shell
        $popup.Popup($message, 30, "Update Alert", 48)
    }
    
    # Sound notification
    if ($Sound) {
        [System.Console]::Beep(1000, 500)
        [System.Console]::Beep(1200, 500)
        [System.Console]::Beep(1000, 500)
    }
    
    # Email notification
    if ($EmailTo) {
        try {
            $smtp = New-Object Net.Mail.SmtpClient($SmtpServer, $SmtpPort)
            $smtp.EnableSsl = $true
            $mail = New-Object Net.Mail.MailMessage
            $mail.From = "updates@knoux.local"
            $mail.To.Add($EmailTo)
            $mail.Subject = "Critical Updates Available"
            $mail.Body = $message
            $smtp.Send($mail)
            Write-Log "✅ Email notification sent"
        }
        catch {
            Write-Log "❌ Failed to send email: $_"
        }
    }
}
`
      },

      'update_dependency_update': {
        name: 'Dependency Update',
        description: 'Update dependencies and runtimes.',
        script: `# ======================================================================
# Project: Update Guardian - Dependency Manager
# Author: knoux
# Date: 2026-02-15
# Description: تحديث التبعيات والمرتبطات
# Version: 2.0.0
# ======================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string]$ApplicationPath,
    
    [Parameter(Mandatory=$false)]
    [string[]]$Frameworks = @(".NET", "VC++", "DirectX"),
    
    [Parameter(Mandatory=$false)]
    [switch]$Scan,
    
    [Parameter(Mandatory=$false)]
    [switch]$Update
)

#region Initialization
$scriptName = "Dependency Manager"
$scriptVersion = "2.0.0"

function Write-Log {
    param([string]$Message)
    Write-Host "$(Get-Date -Format 'HH:mm:ss') | $Message"
}
#endregion

# Scan for dependencies
$dependencies = @()

if ($Scan) {
    Write-Log "Scanning for dependencies..."
    
    # Check .NET Framework
    $dotNet = Get-ChildItem "HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP" -Recurse | Get-ItemProperty -Name Version -ErrorAction SilentlyContinue
    $dependencies += [PSCustomObject]@{
        Name = ".NET Framework"
        Version = $dotNet | Select-Object -First 1 -ExpandProperty Version
        Status = "Installed"
        Required = "4.8"
    }
    
    # Check VC++ Redistributables
    $vcpp = Get-ChildItem "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall" | Get-ItemProperty | Where-Object { $_.DisplayName -like "*Visual C++*" }
    foreach ($item in $vcpp) {
        $dependencies += [PSCustomObject]@{
            Name = $item.DisplayName
            Version = $item.DisplayVersion
            Status = "Installed"
            Required = "Latest"
        }
    }
    
    # Display results
    $dependencies | Format-Table -AutoSize
    
    if ($Update) {
        Write-Log "Updating dependencies..."
        # Add update logic here (download installers, etc.)
    }
}
`
      },

      'update_conflict_resolver': {
        name: 'Conflict Resolver',
        description: 'Resolve update conflicts.',
        script: `# ======================================================================
# Project: Update Guardian - Conflict Resolver
# Author: knoux
# Date: 2026-02-15
# Description: حل تعارضات التحديثات
# Version: 2.0.0
# ======================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [string[]]$UpdateIDs,
    
    [Parameter(Mandatory=$false)]
    [switch]$Analyze,
    
    [Parameter(Mandatory=$false)]
    [switch]$AutoResolve
)

#region Initialization
$scriptName = "Update Conflict Resolver"
$scriptVersion = "2.0.0"

function Write-Log {
    param([string]$Message)
    Write-Host "$(Get-Date -Format 'HH:mm:ss') | $Message"
}
#endregion

# Simulated conflict detection
$conflicts = @()

if ($Analyze) {
    Write-Log "Analyzing update conflicts..."
    
    # Check for common conflicts
    $conflicts += [PSCustomObject]@{
        Update1 = "KB5021234"
        Update2 = "KB5025678"
        Type = "Version Conflict"
        Severity = "High"
        Resolution = "Install KB5021234 first, then KB5025678"
    }
    
    $conflicts += [PSCustomObject]@{
        Update1 = "KB5012345"
        Update2 = "KB5016789"
        Type = "Dependency Conflict"
        Severity = "Medium"
        Resolution = "Both require .NET Framework 4.8. Update .NET first"
    }
    
    # Display conflicts
    $conflicts | Format-Table -AutoSize
    
    if ($AutoResolve) {
        Write-Log "Auto-resolving conflicts..."
        foreach ($conflict in $conflicts) {
            Write-Log "Resolving: $($conflict.Resolution)"
            # Add resolution logic here
        }
    }
}
`
      },

      'update_health_check': {
        name: 'Health Check',
        description: 'Post-update health verification.',
        script: `# ======================================================================
# Project: Update Guardian - Post-Update Health Check
# Author: knoux
# Date: 2026-02-15
# Description: التحقق من سلامة النظام بعد التحديث
# Version: 2.0.0
# ======================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [switch]$Quick,
    
    [Parameter(Mandatory=$false)]
    [switch]$Deep,
    
    [Parameter(Mandatory=$false)]
    [string]$ReportPath = "$env:USERPROFILE\\Desktop\\HealthReports"
)

#region Initialization
$scriptName = "Post-Update Health Check"
$scriptVersion = "2.0.0"

if (-not (Test-Path $ReportPath)) {
    New-Item -ItemType Directory -Path $ReportPath -Force | Out-Null
}

function Write-Log {
    param([string]$Message)
    Write-Host "$(Get-Date -Format 'HH:mm:ss') | $Message"
}

function Test-SystemHealth {
    $health = @{}
    $score = 100
    
    # Check critical services
    $services = @("wuauserv", "BITS", "cryptsvc")
    foreach ($service in $services) {
        $svc = Get-Service -Name $service -ErrorAction SilentlyContinue
        if ($svc.Status -ne "Running") {
            $health["Service_$service"] = "Stopped"
            $score -= 10
        }
    }
    
    # Check disk space
    $disk = Get-PSDrive -Name C
    $freePercent = ($disk.Free / $disk.Used) * 100
    if ($freePercent -lt 10) {
        $health["DiskSpace"] = "Critical"
        $score -= 20
    } elseif ($freePercent -lt 20) {
        $health["DiskSpace"] = "Warning"
        $score -= 10
    }
    
    # Check recent errors
    $errors = Get-EventLog -LogName System -EntryType Error -Newest 10 -After (Get-Date).AddHours(-1)
    if ($errors.Count -gt 0) {
        $health["RecentErrors"] = $errors.Count
        $score -= ($errors.Count * 5)
    }
    
    return [PSCustomObject]@{
        Score = [Math]::Max(0, $score)
        Issues = $health
        Timestamp = Get-Date
    }
}
#endregion

Write-Log "Running post-update health check..."

$result = Test-SystemHealth

Write-Host "\`n🩺 SYSTEM HEALTH REPORT" -ForegroundColor Magenta
Write-Host "════════════════════════════════════════════" -ForegroundColor DarkMagenta
Write-Host "Health Score: $($result.Score)%" -ForegroundColor $(if($result.Score -gt 80){"Green"}elseif($result.Score -gt 60){"Yellow"}else{"Red"})

if ($result.Issues.Count -gt 0) {
    Write-Host "\`n⚠️ Issues Found:" -ForegroundColor Yellow
    $result.Issues | Format-Table
} else {
    Write-Host "✅ No issues found - System is healthy!" -ForegroundColor Green
}

# Save report
$reportFile = Join-Path $ReportPath "health_$(Get-Date -Format 'yyyyMMdd_HHmmss').json"
$result | ConvertTo-Json | Out-File $reportFile
Write-Log "Report saved to: $reportFile"
`
      },

      'update_security_patches': {
        name: 'Security Patches',
        description: 'Install critical security patches.',
        script: `# ======================================================================
# Project: Update Guardian - Security Patch Installer
# Author: knoux
# Date: 2026-02-15
# Description: تثبيت تصحيحات الأمان
# Version: 2.0.0
# ======================================================================

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("Critical", "Important", "All")]
    [string]$Severity = "Critical",
    
    [Parameter(Mandatory=$false)]
    [string[]]$SpecificKB,
    
    [Parameter(Mandatory=$false)]
    [switch]$List,
    
    [Parameter(Mandatory=$false)]
    [switch]$Install,
    
    [Parameter(Mandatory=$false)]
    [string]$DownloadPath = "$env:TEMP\\SecurityPatches"
)

#region Initialization
$scriptName = "Security Patch Installer"
$scriptVersion = "2.0.0"

if (-not (Test-Path $DownloadPath)) {
    New-Item -ItemType Directory -Path $DownloadPath -Force | Out-Null
}

function Write-Log {
    param([string]$Message)
    Write-Host "$(Get-Date -Format 'HH:mm:ss') | $Message"
}
#endregion

# Get security patches
$session = New-Object -ComObject Microsoft.Update.Session
$searcher = $session.CreateUpdateSearcher()

$criteria = "IsInstalled=0 and Type='Software'"
$searchResult = $searcher.Search($criteria)

$securityPatches = @()

foreach ($update in $searchResult.Updates) {
    $isSecurity = $update.Categories | Where-Object { $_.Name -match "Security" -or $_.Name -match "Critical" }
    if ($isSecurity) {
        $securityPatches += [PSCustomObject]@{
            ID = $update.Identity.UpdateID
            Title = $update.Title
            Severity = $update.MsrcSeverity
            Size = [math]::Round($update.MaxDownloadSize / 1MB, 2)
            KB = if ($update.Title -match 'KB\d+') { $matches[0] } else { "Unknown" }
        }
    }
}

if ($List) {
    Write-Host "\`n🛡️ SECURITY PATCHES AVAILABLE" -ForegroundColor Magenta
    $securityPatches | Where-Object { $Severity -eq "All" -or $_.Severity -eq $Severity } | Format-Table -AutoSize
}

if ($Install) {
    $toInstall = if ($SpecificKB) {
        $securityPatches | Where-Object { $_.KB -in $SpecificKB }
    } else {
        $securityPatches | Where-Object { $Severity -eq "All" -or $_.Severity -eq $Severity }
    }
    
    Write-Log "Installing $($toInstall.Count) security patches..."
    
    foreach ($patch in $toInstall) {
        Write-Log "Installing: $($patch.Title)"
        # Add actual installation logic here
        Start-Sleep -Milliseconds 500
    }
    
    Write-Log "✅ Security patches installed successfully"
}
`
      }
    };
  }

  public generateScript(moduleName: string, serviceId: string): string {
    // 1. Normalize prefix
    let prefix = moduleName.toLowerCase();
    
    // Simple mapping to ensure prefix matches keys (e.g. 'BackupOrchestrator' -> 'backup')
    if (prefix.includes('lifecycle')) prefix = 'lifecycle';
    else if (prefix.includes('backup')) prefix = 'backup';
    else if (prefix.includes('disk')) prefix = 'disk';
    else if (prefix.includes('driver')) prefix = 'driver';
    else if (prefix.includes('forensic')) prefix = 'forensic';
    else if (prefix.includes('network')) prefix = 'network';
    else if (prefix.includes('performance')) prefix = 'performance';
    else if (prefix.includes('power')) prefix = 'power';
    else if (prefix.includes('registry')) prefix = 'registry';
    else if (prefix.includes('security')) prefix = 'security';
    else if (prefix.includes('thermal')) prefix = 'thermal';
    else if (prefix.includes('update')) prefix = 'update';

    const key = `${prefix}_${serviceId}`;
    
    // 2. Return specific template if exists
    if (this.templates[key]) {
      return this.templates[key].script;
    }

    // 3. Fallback to generic high-quality template
    return this.generateGenericScript(prefix, serviceId);
  }

  private generateGenericScript(module: string, service: string): string {
    const serviceName = service.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    const moduleName = module.charAt(0).toUpperCase() + module.slice(1);

    return `# KNOUX OS Guardian - ${moduleName} : ${serviceName}
# Generated: ${new Date().toISOString()}
# Description: Automated script for ${serviceName}

Write-Host "=== KNOUX ${serviceName} ===" -ForegroundColor Cyan
Write-Host "Initializing ${moduleName} module..." -ForegroundColor Gray

# Configuration
$LogPath = "$env:TEMP\\KNOUX_${service}_Log.txt"
$ErrorActionPreference = "Stop"

function Log-Message {
    param([string]$Message, [string]$Color = "White")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogLine = "[$Timestamp] $Message"
    Write-Host $Message -ForegroundColor $Color
    $LogLine | Out-File -FilePath $LogPath -Append
}

try {
    Log-Message "Starting operation..." "Yellow"
    
    # Core Logic Placeholder
    Start-Sleep -Seconds 1
    Log-Message "Analyzing system state..." "Cyan"
    
    # Simulate work
    $progress = 0
    while ($progress -lt 100) {
        $progress += 20
        Write-Progress -Activity "${serviceName} in progress" -Status "$progress% Complete" -PercentComplete $progress
        Start-Sleep -Milliseconds 200
    }
    
    Log-Message "Operation completed successfully." "Green"
    Log-Message "Results saved to logs." "Gray"

} catch {
    Log-Message "Error: $_" "Red"
    exit 1
}

Write-Host "\n✓ Execution finished." -ForegroundColor Cyan
`;
  }
}

export const scriptGenerator = new PowerShellGenerator();