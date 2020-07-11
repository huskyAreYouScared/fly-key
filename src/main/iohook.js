import ioHook from 'iohook'

let registerKeyUp = function (browserWindow) {
  ioHook.on('keyup', (event) => {
    browserWindow.webContents.send('keyboard-change', event)
  })
  ioHook.start()
}
let registerMouseUp = function (browserWindow) {
  ioHook.on('mouseup', (event) => {
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
