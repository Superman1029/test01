// 将这个文件引入到main.js之后就能全局用v-db-click的指令进行控制了，再也不用担心重复触发问题。
import Vue from 'vue'

Vue.directive('dbClick', {
  inserted(el, binding) {
    el.addEventListener('click', e => {
      if (!el.disabled) {
        el.disabled = true
        el.style.cursor = 'not-allowed'
        setTimeout(() => {
          el.style.cursor = 'pointer'
          el.disabled = false
        }, 1500)
      }
    })
  }
})
