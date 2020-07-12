<!-- 回显主页 -->
<template>
  <div class='launch-platform-box cursorPointer selectNone'>
    <flyKey :limit="keyLimit" :data="keyData" :isEncrypt="isEncrypt"/>
    <div class="tool-bar">
      <span class="iconfont icon-jiami tool-bar-item tool-password" @click="isEncrypt = !isEncrypt"></span>
      <span class="iconfont icon-colors tool-bar-item tool-color" @click="openColorInput"></span>
      <input class="tool-color-input" type="color" @change="changeColor" ref="changeColorEl">
    </div>
    <transition name="launcher-fade">
      <div v-if="keyFlyVisible" class="iconfont icon-icon_msg launcher"></div>
    </transition>
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
      keyData: [],
      keyLimit: 7,
      keyFlyVisible: true,
      isEncrypt: false
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
        })
      }
    },
    handleMouseUp (e) {
      this.dragging = false
      if (this.screenX === e.screenX && this.screenY === e.screenY) {
        if (e.button === 0) { // left mouse
          // this.openKeyShowWindow()
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
    },
    openColorInput () {
      this.$refs.changeColorEl.click()
    },
    changeColor (e) {
      localStorage.setItem('background', e.target.value)
      this.init()
    },
    init () {
      if (localStorage.getItem('background')) {
        document.documentElement.style.setProperty('--bg', localStorage.getItem('background'))
      }
    }
  },
  mounted () {
    window.addEventListener('mousedown', this.handleMouseDown, false)
    window.addEventListener('mousemove', this.handleMouseMove, false)
    window.addEventListener('mouseup', this.handleMouseUp, false)
    this.buildMenu()
    ipcRenderer.on('keyboard-change', (event, data) => {
      this.keyFlyVisible = false
      this.$nextTick(() => {
        this.keyFlyVisible = true
      })
      if (this.keyData.length >= this.keyLimit) {
        this.keyData.shift(data)
      }
      this.keyData.push(data)
    })
    // init style
    this.init()
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
  box-sizing: border-box;
  border-radius: 10px;
  .launcher{
    font-size: 3rem;
    text-align: center;
    line-height: 64px;
    width: 60px;
    display: block;
    color: var(--bg);
    position: absolute;
    bottom: 0;
    box-shadow: 0px 0px 10px 2px inset var(--primary);
    border-radius: 50%;
  }
  .tool-bar{
    width: 64px;
    position: absolute;
    bottom: 64px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .tool-bar-item{
      font-size: 35px;
      text-align: center;
      display: inline-block;
      margin: 5px auto;
      transition: all 1s;
      box-shadow: 0px 0px 10px 2px inset var(--primary);
      border-radius: 50%;
    }
    .tool-password{
      color:var(--bg);
    }
    .tool-color{
      color:var(--bg);
    }
    .tool-color-input{
      display: none;
    }
  }
}


.launcher-fade-enter-active, .launcher-fade-leave-active {
  transition: all 1s;
}
.launcher-fade-enter, .launcher-fade-leave-to  {
  transform: translateZ(20px) translateY(-10px) translateX(10px) scaleX(1.3);
}
</style>