@echo off
cls

cd ..\js\src\
copy /B alice.core.js + alice.plugins.cheshire.js ..\alice.js

rem cd ..
rem cscript //Nologo ../../jslint.js < alice.js

cd ..\..\build\

pause
