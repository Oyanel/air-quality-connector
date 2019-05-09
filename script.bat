@echo off

Rem delete all logs in the logs directory 30 days old

forfiles /p C:\Users\work.experience2\Documents\connector-airQuality\logs /m *.log /d -30 /c "cmd /c del @path"

set filename=%date:~-4,4%-%date:~-7,2%-%date:~-10,2%.log

Rem lunch the connector retrieval and log the output in the date.log file
node C:\Users\work.experience2\Documents\connector-airQuality\app.js >> C:\Users\work.experience2\Documents\connector-airQuality\logs\%filename% 2>&1