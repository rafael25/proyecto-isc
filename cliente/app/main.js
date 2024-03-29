var app = require('app');
var BrowserWindow = require('browser-window');

var mainWindow = null;

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 600
    });

    mainWindow.loadUrl('file://' + __dirname + '/main/index.html');
    mainWindow.setMenu(null);
    mainWindow.openDevTools();

    mainWindow.on('close', function () {
        mainWindow = null;
    });
});
