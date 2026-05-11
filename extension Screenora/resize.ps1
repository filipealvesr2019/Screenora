Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("c:\Users\filipe\Documents\page viewer\extension Screenora\logo.png")
foreach ($size in @(16, 48, 128)) {
    $bmp = new-object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img, 0, 0, $size, $size)
    $bmp.Save("c:\Users\filipe\Documents\page viewer\extension Screenora\logo$size.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $g.Dispose()
}
$img.Dispose()
