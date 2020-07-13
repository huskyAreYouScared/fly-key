import ioHook from 'iohook'

let registerKeyUp = function (browserWindow) {
  ioHook.on('keydown', (event) => {
    browserWindow.webContents.send('keyboard-change', event)
  })
  ioHook.start()
}
let registerMouseUp = function (browserWindow) {
  ioHook.on('mousedown', (event) => {
    browserWindow.webContents.send('keyboard-change', event)
  })
  ioHook.start()
}
let destoryIoHook = function () {
  ioHook.stop()
}

export {
  registerKeyUp,
  registerMouseUp,
  destoryIoHook
}
