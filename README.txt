Run "npm start run" through terminal in the chapterupdater-extension directory to run the app
Or add it as a local extension through Firefox debugger and run
  To do this, need to first run command "npm run build" throgh terminal to set up build environment
  Then "load temporary add-on" at about:debugging#/runtime/this-firefox and select ./chapupdater-extension\build\index.html file
Also need to open nodejs-backend directory and run server through terminal command "npm run start"
