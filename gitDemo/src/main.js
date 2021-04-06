import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

ElementUI.Dialog.props.closeOnClickModal.default = false
ElementUI.Table.props.highlightCurrentRow.default = true
ElementUI.TableColumn.props.showOverflowTooltip.default = true

import '@/styles/index.scss' // global css

import App from '@/App'
import store from '@/store'
import router from '@/router'

import i18n from '@/lang' // internationalization
import '@/icons' // icon
import '@/permission' // permission control
import '@/directive/dragDialog.js'
import '@/directive/dbClick.js'

import { common } from '@/utils/common'
Vue.prototype.$common = common
// 注册Splitpane 组件
import Splitpane from '@/components/split-pane/index.vue'
Vue.component('split-pane', Splitpane)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
import defaultColor from '@/components/ThemePicker/defaultColor'
var root = document.documentElement
root.style.setProperty(defaultColor.defaultColor, '#409EFF')
root.style.setProperty(defaultColor.defaultColorRGB, '64,158,255')
import cssVars from 'css-vars-ponyfill'
cssVars({
  variables: {
    '--defaultColor': '#409EFF',
    '--defaultColorRGB': '64,158,255'
  }
})

const orignalSetItem = localStorage.setItem
localStorage.setItem = function(key, newValue) {
  const storage = new Event('storage')
  storage.key = key
  storage.newValue = newValue
  window.dispatchEvent(storage)
  orignalSetItem.apply(this, arguments)
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale, size: 'mini' })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
