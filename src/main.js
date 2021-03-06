// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

const { subParser } = require('./utils/sub-parser');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 430,
    height: 445,
    resizable: false
  });

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html');
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  // require('devtron').install();
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  mainWindow.webContents.on('will-navigate', ev => {
    ev.preventDefault();
  });
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

const getFileFromUserSelection = (exports.getFileFromUserSelection = targetWindow => {
  const files = dialog.showOpenDialog(targetWindow, {
    properties: ['openFile'],
    filters: [
      { name: 'Subtitle Files', extensions: ['srt', 'subrip'] }
    ]
  });
  if (!files) return;
  return files[0];
});

const openFile = (exports.openFile = (targetWindow, filePath) => {
  const file = filePath || getFileFromUserSelection(targetWindow);
  targetWindow.webContents.send('file-opened', file, content);
});
