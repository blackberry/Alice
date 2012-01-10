@echo off
cls

cd ..\js\src\
copy /B alice.core.js + alice.plugins.slide.js ..\alice.js

rem cd ..
rem cscript //Nologo ../../jslint.js < alice.js

cd ..\..\build\

pause
