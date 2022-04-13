
# Rename files with an increasing number
Get-ChildItem *.jpg | ForEach-Object -Begin { $count = 1 } -Process { Rename-Item $_ -NewName "picture_$count.jpg"; $count++ }


 
 