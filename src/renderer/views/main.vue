<!-- 回显主页 -->
<template>
  <div class='launch-platform-box cursorPointer selectNone'>
    <i class="iconfont icon-icon_msg launcher"></i>
    <flyKey :data="keyData"/>
  </div>
</template>

<script>
import { remote, ipcRenderer } from 'electron'
import flyKey from '@/views/flykey'
export default {
  name: 'launch-platform',
  components: {
    flyKey
  },
  data () {
    return {
      dragging: false,
      wX: -1,
      wY: -1,
      screenX: -1,
      screenY: -1,
      keyData: []
    }
  },
  computed: {},
  watch: {},
  methods: {
    handleMouseDown (e) {
      this.dragging = true
      this.wX = e.pageX
      this.wY = e.pageY
      this.screenX = e.screenX
      this.screenY = e.screenY
    },
    handleMouseMove (e) {
      e.preventDefault()
      e.stopPropagation()
      if (this.dragging) {
        const xLoc = e.screenX - this.wX
        const yLoc = e.screenY - this.wY
        remote.BrowserWindow.getFocusedWindow().setBounds({
          x: xLoc,
          y: yLoc
          // width: 64,
          // height: 64
        })
      }
    },
    handleMouseUp (e) {
      this.dragging = false
      if (this.screenX === e.screenX && this.screenY === e.screenY) {
        if (e.button === 0) { // left mouse
          this.openKeyShowWindow()
        } else {
          this.openContextMenu()
        }
      }
    },
    openContextMenu () {
      this.menu.popup()
    },
    openKeyShowWindow () {
      ipcRenderer.send('fly-window', null)
    },
    buildMenu () {
      const template = [
        {
          label: '隐藏窗口',
          click () {
            remote.BrowserWindow.getFocusedWindow().hide()
          }
        },
        {
          label: '重启应用',
          click () {
            remote.app.relaunch()
            remote.app.exit(0)
          }
        },
        {
          role: 'quit',
          label: '退出'
        }
      ]
      this.menu = remote.Menu.buildFromTemplate(template)
    }
  },
  mounted () {
    window.addEventListener('mousedown', this.handleMouseDown, false)
    window.addEventListener('mousemove', this.handleMouseMove, false)
    window.addEventListener('mouseup', this.handleMouseUp, false)
    this.buildMenu()
    ipcRenderer.on('keyboard-change', (event, data) => {
      if (this.keyData.length > 10) {
        this.keyData.shift(data)
      }
      this.keyData.push(data)
    })
  },
  beforeDestroy () {
    window.removeEventListener('mousedown', this.handleMouseDown, false)
    window.removeEventListener('mousemove', this.handleMouseMove, false)
    window.removeEventListener('mouseup', this.handleMouseUp, false)
  }
}
</script>
<style lang='scss' scoped>
.launch-platform-box{
  width: 100vw;
  height: 100vh;
  .launcher{
    font-size: 3rem;
    text-align: center;
    line-height: 64px;
    color: var(--primary);
  }
}
</style>