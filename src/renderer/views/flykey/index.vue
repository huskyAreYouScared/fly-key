<!--  -->
<template>
  <div class='animateWrap'>
    <p 
      v-for="(item,index) in data" 
      :class="{'hidden': data.length >= limit && index === 0}" 
      ref="keyFlyItem"
      class="animate key-fly-skin" 
      :key="index"
    >
      {{item|keyFlyFilter(isEncrypt, connectedMap)}}
    </p>
  </div>
</template>

<script>
import { keyMap } from '@/config/keyMap.js'
import os from 'os'
export default {
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    limit: {
      type: Number,
      default: 5
    },
    isEncrypt: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    keyFlyFilter (data, isEncrypt, connectedMap) {
      let platform = os.platform
      if (!isEncrypt) {
        if (data.type === 'keydown') {
          return `${data.shiftKey && ![42, 54].includes(data.keycode) ? connectedMap[platform]['shiftKey'] + ' +' : ''}
          ${data.ctrlKey && ![29, 3613].includes(data.keycode) ? connectedMap[platform]['ctrlKey'] + ' +' : ''}
          ${data.altKey && ![56, 3640].includes(data.keycode) ? connectedMap[platform]['altKey'] + ' +' : ''}
          ${data.metaKey && ![3675, 3676].includes(data.keycode) ? connectedMap[platform]['metaKey'] + ' +' : ''}
          ${keyMap[platform]['keydown-' + data.keycode]}`
        } else {
          return keyMap[platform]['mousedown-' + data.button]
        }
      } else {
        return '****'
      }
    }
  },
  data () {
    return {
      currentTimeout: null,
      connectedMap: {
        darwin: {
          shiftKey: 'Shift',
          altKey: 'Option',
          ctrlKey: 'Ctrl',
          metaKey: 'Command'
        },
        win32: {
          shiftKey: 'Shift',
          altKey: 'Alt',
          ctrlKey: 'Ctrl',
          metaKey: '*'
        }
      }
    }
  },
  mounted () {
    console.log(os.platform)
  },
  watch: {
    data: {
      handler: function () {
        if (this.data.length >= this.limit && !this.currentTimeout) {
          this.$nextTick(() => {
            this.$refs.keyFlyItem[0].classList.remove('hidden')
            this.$refs.keyFlyItem[this.limit - 1].classList.remove('animate')
            this.currentTimeout = setTimeout(() => {
              this.$refs.keyFlyItem[0].classList.add('hidden')
              this.$refs.keyFlyItem[this.limit - 1].classList.add('animate')
              this.currentTimeout = null
            }, 0)
          })
        }
      },
      deep: true
    }
  }
}
</script>
<style lang='scss' scoped>
.animateWrap {
  position: absolute;
  bottom: 3%;
  left: var(--left-offset);
  .animate {
    animation: moveIn 1.2s;
  }
  .hidden {
    opacity: 0;
    animation: moveOut 1.2s;
  }
  @keyframes moveIn {
    0% {
      transform: translateX(calc(-100% - var(--left-offset)));
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes moveOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}
.key-fly-skin{
  transition: all 1s;
  margin-bottom: 10px;
  display: block;
  text-align: var(--key-fly-text-align);
  min-width: var(--key-fly-min-width);
  font-size: var(--key-fly-font-size);
  color: var(--primary);
  background: var(--bg);
  border-radius: var(--key-fly-border-radius);
  font-weight: bold;
  box-shadow: 0px 0px 10px 2px inset var(--primary);
}

.key-fly-skin:hover{
  perspective: 600;
  transform: rotateY(360deg);
}
</style>