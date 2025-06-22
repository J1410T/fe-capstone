# PowerShell script to resolve merge conflicts by accepting HEAD version
$conflictFiles = @(
    "src/pages/Council/Meetings/components/MeetingHeader.tsx",
    "src/pages/Council/Meetings/components/ProjectMeetingsTab.tsx", 
    "src/pages/Council/Meetings/components/UpcomingMeetingsTab.tsx",
    "src/pages/PrincipalInvestigator/Dashboard/index.tsx",
    "src/pages/PrincipalInvestigator/shared/utils.ts",
    "src/pages/ProjectDetail/components/MilestoneTab.tsx",
    "src/routes/config.tsx"
)

foreach ($file in $conflictFiles) {
    if (Test-Path $file) {
        Write-Host "Resolving conflicts in $file"
        
        # Read the file content
        $content = Get-Content $file -Raw
        
        # Remove conflict markers and keep HEAD version
        $content = $content -replace '<<<<<<< HEAD\r?\n', ''
        $content = $content -replace '=======\r?\n.*?>>>>>>> main-backup\r?\n', ''
        $content = $content -replace '=======\r?\n.*?>>>>>>> main-backup', ''
        
        # Write back the cleaned content
        Set-Content $file $content -NoNewline
        
        Write-Host "Resolved $file"
    }
}

# Also handle deleted files
$deletedFiles = @(
    "src/pages/Admin/Approvals/index.tsx",
    "src/pages/Admin/Users/components/UserTable.tsx"
)

foreach ($file in $deletedFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "Removed $file"
    }
}

Write-Host "All conflicts resolved!" 