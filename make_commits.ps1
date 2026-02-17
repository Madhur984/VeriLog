for ($i = 1; $i -le 12; $i++) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $randomStr = [Guid]::NewGuid().ToString().Substring(0, 8)
    $content = "Activity log entry ${i} (Batch 5): ${timestamp} - ${randomStr}"
    Add-Content -Path "activity_log.txt" -Value $content
    
    git add activity_log.txt
    git commit -m "Random commit ${i} (Batch 5): Automated activity update [${randomStr}]"
    Write-Host "Created commit ${i}/12"
}
