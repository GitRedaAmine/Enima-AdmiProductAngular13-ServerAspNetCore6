
# Rename files with an increasing number
Get-ChildItem *.jpg | ForEach-Object -Begin { $count = 1 } -Process { Rename-Item $_ -NewName "img_$count.jpg"; $count++ }


 
 