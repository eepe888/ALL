param(
    [Parameter(Mandatory=$true)][string]$ImagePath
)
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile((Resolve-Path $ImagePath))
[System.Windows.Forms.Clipboard]::SetImage($img)
$img.Dispose()
Write-Output "画像をクリップボードにコピーしました: $ImagePath"
