let electron = require("electron");
let app = electron.app;
let BrowserWindow = electron.BrowserWindow;
let win = null;
app.on("ready", ()=>{
    win = new BrowserWindow({
        "webPreferences": {nodeIntegration: true},
        height: 900,
        width: 1600,
        minHeight: 900,
        minWidth: 1600,
        useContentSize: true
    });
    win.loadFile("index.html");
    win.on('close', ()=>{
        win=null;
    });
});
app.on('window-all-closed', ()=>{
    app.quit();
});