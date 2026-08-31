# optimize-images.ps1 — simple ImageMagick-based image optimizer
# Usage: Open PowerShell in this folder and run: .\optimize-images.ps1
# Requires ImageMagick (magick) installed and on PATH. Creates an 'optimized' folder.

$ErrorActionPreference = 'Stop'
$optimizedDir = Join-Path -Path (Get-Location) -ChildPath 'optimized'
if (!(Get-Command magick -ErrorAction SilentlyContinue)) {
  Write-Host "ImageMagick 'magick' not found on PATH. Please install ImageMagick or use an alternative tool." -ForegroundColor Yellow
  Exit 1
}
if (!(Test-Path $optimizedDir)) { New-Item -ItemType Directory -Path $optimizedDir | Out-Null }

$exts = '*.png', '*.jpg', '*.jpeg', '*.webp'
Get-ChildItem -Path . -Include $exts -File -Recurse | ForEach-Object {
  $src = $_.FullName
  $dest = Join-Path $optimizedDir $_.Name
  Write-Host "Optimizing: $($_.Name) -> optimized/$($_.Name)"
  magick `"$src`" -strip -interlace Plane -quality 82 -resize 1600x1600\> `"$dest`"
}

Write-Host "Optimization complete. Check the 'optimized' folder." -ForegroundColor Green
