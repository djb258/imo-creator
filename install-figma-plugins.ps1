Write-Host "Opening Figma plugin pages..." -ForegroundColor Green

$urls = @(
    "https://www.figma.com/community/plugin/791989050714641598/Convertify",
    "https://www.figma.com/community/plugin/748533339900865323/Pitchdeck-Presentation-Studio",
    "https://www.figma.com/community/plugin/742664219575395510/PDF-Exporter",
    "https://www.figma.com/community/plugin/739208226250893725/Chart",
    "https://www.figma.com/community/plugin/747985633931346548/Google-Sheets-Sync",
    "https://www.figma.com/community/plugin/801195587259091012/Design-Lint",
    "https://www.figma.com/community/plugin/742992099192946233/Accessibility-Contrast-Checker",
    "https://www.figma.com/community/plugin/823434922318019462/Annotation-Kit",
    "https://www.figma.com/community/plugin/826246267167433514/Content-Reel",
    "https://www.figma.com/community/plugin/842267112908563912/3D-Mockups",
    "https://www.figma.com/community/plugin/835195113074019300/Flowchart-Kit"
)

foreach ($url in $urls) {
    Write-Host "Opening: $url" -ForegroundColor Yellow
    Start-Process $url
    Start-Sleep -Seconds 1
}

Write-Host "`nAll plugin pages should now be opening in your browser." -ForegroundColor Green
Write-Host "Click 'Install' on each Figma page to add them to your account." -ForegroundColor Cyan
Read-Host "`nPress Enter to continue..."