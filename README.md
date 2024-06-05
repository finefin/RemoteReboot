This is a little helper to remotely shutdown or reboot our Hintpad-MiniPCs, but it can be generally used for that purpose and is not particularly bound to the Hintpad project. Just make sure your ports are blocked from outside your network or use a tunnel, as this approach isn't the most secure one.

## INSTALL

You need to have NodeJS installed!

- clone project to Hintpad-PC
- in command line cd into /RemoteReboot folder
- enter 'npm install'


## USE

Still in CMD, enter 'node network.js' to start the server.

On the game master pc's browser enter the Hintpad-IP + Port 3015:
'''
http://[HINTPAD-IP]:3015
'''

A small page with 2 buttons should show up that allow you to reboot/shutdown the Hintpad-PC.


## AUTOSTART

In order to automatically run the script on boot, you can copy the File 'shutdownHelper.bat' to the autostart folder:

- edit the BAT file and enter the path of the /RemoteReboot folder
- in Windows-search enter 'run' oder 'ausführen' 
- enter 'shell:startup' to open the startup folder in Explorer
- copy the BAT-file to that folder
