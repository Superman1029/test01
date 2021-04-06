<template>
  <el-color-picker
    v-model="theme"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
    size="small"
    :predefine="predefineColors"
  />
</template>

<script>
const version = require('element-ui/package.json').version // element-ui version from node_modules
const ORIGINAL_THEME = '#409EFF' // 默认颜色
import defaultColor from '@/components/ThemePicker/defaultColor'
import cssVars from 'css-vars-ponyfill'
import { common } from '@/utils/common'

export default {
  name: 'ThemePicker',
  props: ['default'],
  data() {
    return {
      chalk: '', // content of theme-chalk css
      theme: ORIGINAL_THEME,
      predefineColors: ['#409EFF', '#3E3E3E', '#A4D302', '#99010C']
    }
  },
  watch: {
    theme(val, oldVal) {
      val = val || this.default
      var root = document.documentElement
      root.style.setProperty(defaultColor.defaultColor, val)
      root.style.setProperty(defaultColor.defaultColorRGB, this.colorRgb(val))
      cssVars({
        variables: {
          '--defaultColor': val,
          '--defaultColorRGB': this.colorRgb(val)
        }
      })
      if (common.IEVersion() !== -1) {
        window.localStorage['tremePackers'] = val
        if (val === '#3E3E3E') {
          window.localStorage['logoBgindex'] = '1'
        } else if (val === '#409EFF') {
          window.localStorage['logoBgindex'] = '2'
        } else if (val === '#A4D302') {
          window.localStorage['logoBgindex'] = '3'
        } else if (val === '#99010C') {
          window.localStorage['logoBgindex'] = '4'
        }
      } else {
        window.localStorage.setItem('tremePackers', val)
        if (val === '#3E3E3E') {
          window.localStorage.setItem('logoBgindex', '1')
        } else if (val === '#409EFF') {
          window.localStorage.setItem('logoBgindex', '2')
        } else if (val === '#A4D302') {
          window.localStorage.setItem('logoBgindex', '3')
        } else if (val === '#99010C') {
          window.localStorage.setItem('logoBgindex', '4')
        }
      }
      // this.$store.state.systemLayout.color = val // 把颜色存仓库
      if (typeof val !== 'string') return
      const themeCluster = this.getThemeCluster(val.replace('#', ''))
      const originalCluster = this.getThemeCluster(oldVal.replace('#', ''))
      const getHandler = (variable, id) => {
        return () => {
          const originalCluster = this.getThemeCluster(
            ORIGINAL_THEME.replace('#', '')
          )
          const newStyle = this.updateStyle(
            this[variable],
            originalCluster,
            themeCluster
          )
          let styleTag = document.getElementById(id)
          if (!styleTag) {
            styleTag = document.createElement('style')
            styleTag.setAttribute('id', id)
            document.head.appendChild(styleTag)
          }
          styleTag.innerText = newStyle
        }
      }
      const chalkHandler = getHandler('chalk', 'chalk-style')
      if (!this.chalk) {
        const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`
        this.getCSSString(url, chalkHandler, 'chalk')
      } else {
        chalkHandler()
      }
      const styles = [].slice
        .call(document.querySelectorAll('style'))
        .filter(style => {
          const text = style.innerText
          return (
            new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text)
          )
        })
      styles.forEach(style => {
        const { innerText } = style
        if (typeof innerText !== 'string') return
        style.innerText = this.updateStyle(
          innerText,
          originalCluster,
          themeCluster
        )
      })
      // // 响应外部操作
      // this.$emit('onThemeChange', val)
      // // 存入localStorage
    }
  },
  mounted() {
    if (this.default != null) {
      this.theme = this.default
      this.$emit('onThemeChange', this.theme)
    }
  },
  methods: {
    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index])
      })
      return newStyle
    },
    getCSSString(url, callback, variable) {
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '')
          callback()
        }
      }
      xhr.open('GET', url)
      xhr.send()
    },
    getThemeCluster(theme) {
      const tintColor = (color, tint) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)
        if (tint === 0) {
          // when primary color is in its rgb space
          return [red, green, blue].join(',')
        } else {
          red += Math.round(tint * (255 - red))
          green += Math.round(tint * (255 - green))
          blue += Math.round(tint * (255 - blue))
          red = red.toString(16)
          green = green.toString(16)
          blue = blue.toString(16)
          return `#${red}${green}${blue}`
        }
      }
      const shadeColor = (color, shade) => {
        let red = parseInt(color.slice(0, 2), 16)
        let green = parseInt(color.slice(2, 4), 16)
        let blue = parseInt(color.slice(4, 6), 16)
        red = Math.round((1 - shade) * red)
        green = Math.round((1 - shade) * green)
        blue = Math.round((1 - shade) * blue)
        red = red.toString(16)
        green = green.toString(16)
        blue = blue.toString(16)
        return `#${red}${green}${blue}`
      }
      const clusters = [theme]
      for (let i = 0; i <= 9; i++) {
        clusters.push(tintColor(theme, Number((i / 10).toFixed(2))))
      }
      clusters.push(shadeColor(theme, 0.1))
      return clusters
    },
    colorRgb(data) {
      var color = data.toLowerCase()
      var colorChange = []
      for (var i = 1; i < 7; i += 2) {
        colorChange.push(parseInt('0x' + color.slice(i, i + 2)))
      }
      return colorChange.join(',')
    }
  }
}
</script>
<style lang="scss">
  .theme-picker-dropdown .el-color-dropdown__link-btn {
    display: none;
  }
</style>
