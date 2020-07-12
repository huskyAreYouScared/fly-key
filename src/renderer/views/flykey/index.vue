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
      {{item|keyFlyFilter(isEncrypt)}}
    </p>
  </div>
</template>

<script>
import { keyMap } from '@/config/keyMap.js'
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
    keyFlyFilter (data, isEncrypt) {
      if (!isEncrypt) {
        if (data.type === 'keyup') {
          return keyMap['keyup-' + data.keycode]
        } else {
          return keyMap['mouseup-' + data.button]
        }
      } else {
        return '****'
      }
    }
  },
  data () {
    return {
      currentTimeout: null
    }
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
    animation-iteration-count: 1;
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
  display: inline-block;
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