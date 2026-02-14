for ($i = 1; $i -le 16; $i++) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $randomStr = [Guid]::NewGuid().ToString().Substring(0, 8)
    $content = "Activity log entry ${i} (Batch 2): ${timestamp} - ${randomStr}"
    Add-Content -Path "activity_log.txt" -Value $content
    
    git add activity_log.txt
    git commit -m "Random commit ${i} (Batch 2): Automated activity update [${randomStr}]"
    Write-Host "Created commit ${i}/16"
}
