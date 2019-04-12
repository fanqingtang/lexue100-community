@REM  负责将。。。。

copy .\dist\index.html D:\wamp64\www\lexue3\template\default\mk\mk_xlsq.htm
copy .\dist\detail.html D:\wamp64\www\lexue3\template\default\mk\mk_article2.htm
copy .\dist\detailH5.html D:\wamp64\www\lexue3\template\default\mk\mk_article2mb.htm
xcopy /E /Y /I .\dist\public\pages\xlsq D:\wamp64\www\lexue3\public\pages\xlsq

del D:\wamp64\www\lexue3\public\pages\xlsq\js\*.js.map
