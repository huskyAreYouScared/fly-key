import { app, BrowserWindow, ipcMain } from 'electron'
import { showBrowserWindow, hideBrowserWindow } from './shortcut'
import { registerKeyUp, registerMouseUp, destoryIoHook } from './iohook'

// const path = require('path')

// import ioHook from 'iohook'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let flyKeyWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 400,
    width: 300,
    show: true,
    frame: false,
    fullscreenable: false,
    skipTaskbar: true,
    resizable: false,
    transparent: process.platform !== 'linux',
    icon: `${__static}/logo.png`,
    webPreferences: {
      backgroundThrottling: false,
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.loadURL(winURL)
  mainWindow.setAlwaysOnTop(true, 'main-menu')

  mainWindow.on('closed', () => {
    mainWindow = null
    destoryIoHook()
  })

  // register shortcut
  showBrowserWindow(mainWindow)
  hideBrowserWindow(mainWindow)

  // register listen keyboard
  registerKeyUp(mainWindow)
  registerMouseUp(mainWindow)

  // register fly key window
  ipcMain.on('fly-window', function () {
    if (!flyKeyWindow) {
      flyKeyWindow = new BrowserWindow({
        height: 400,
        width: 300,
        show: true,
        frame: false,
        fullscreenable: false,
        skipTaskbar: true,
        resizable: false,
        transparent: process.platform !== 'linux',
        // icon: `${__static}/logo.png`,
        webPreferences: {
          backgroundThrottling: false,
          nodeIntegration: true,
          nodeIntegrationInWorker: true
        }
      })
      flyKeyWindow.loadURL(winURL)

      flyKeyWindow.show()

      flyKeyWindow.on('show', () => {
        flyKeyWindow.webContents.send('change-fly-key', 'basic')
      })
    }
  })
}

// app.allowRendererProcessReuse = false

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
