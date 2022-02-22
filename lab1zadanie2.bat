@echo off
cd / && cd Users\%USERNAME% || (echo Директории не существует & pause & exit /b)
cd ..
"C:\Program Files\WinRAR\Rar.exe" a "%USERNAME%.rar" "%USERNAME%"
echo OK
pause
exit /b