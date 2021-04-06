/**
 * modfiy by  on 16/11/18.
 */
const utils = {
  newGUID() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0; var v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  // return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  //     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  //     return v.toString(16);
  // });
  },
  isEmpty(obj) {
    return (typeof obj === 'undefined' || obj == null || obj === '')
  },
  /**
   * 格式化日期
   * @param {日期} date
   * @param {*} format
   */
  formatDate(date, format) {
    format = format || 'yyyy-MM-dd hh:mm:ss'
    var o = {
      'M+': date.getMonth() + 1, // month
      'd+': date.getDate(), // day
      'h+': date.getHours(), // hour
      'm+': date.getMinutes(), // minute
      's+': date.getSeconds(), // second
      'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
      'S': date.getMilliseconds() // millisecond
    }

    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      }
    }
    return format
  },
  /**
   * 获取当前 日期时间
   * format 格式 这里可以罗列些常用的
   */
  getNowDate(format) {
    const now = new Date()
    if (!format) {
      format = 'yyyy-MM-dd hh:mm:ss'
    } else if (format === 'date') {
      format = 'yyyy-MM-dd'
    } else if (format === 'time') {
      format = 'hh:mm:ss'
    }
    return this.formatDate(now, format)
  }
}

/**
 * 对日期的扩展不想修改原生 Date
 */
const date = {
  /**
   * 返回格式化后的日期，字符串
   * @param {日期，支持Object，String，number} d 
   * @param {*} format
   */
  format(d, format) {
    d = d || new Date()
    format = format || 'yyyy-MM-dd'
    if (typeof d !== 'object') {
      if (typeof d === 'string') {
        if ((/^[0-9]+$/.test(d))) {
          // support "1548221490638"
          d = parseInt(d)
        } else {
          // support safari
          // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
          d = d.replace(new RegExp(/-/gm), '/')
        }
      }
      if ((typeof time === 'number') && (d.toString().length === 10)) {
        d = d * 1000
      }
      d = new Date(d)
    }
    // 保证 d 为一个 Date
    var o = {
      'y+': d.getFullYear(), // year 年
      'M+': d.getMonth() + 1, // month 月
      'd+': d.getDate(), // day 日
      'h+': d.getHours(), // hour 时
      'm+': d.getMinutes(), // minute 分
      's+': d.getSeconds(), // second 秒
      'S': d.getMilliseconds(), // millisecond 毫秒
      'q+': Math.floor((d.getMonth() + 3) / 3) // quarter 季
      // 星期
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(format)) {
        // .slice
        // format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(-1 * ('' + o[k]).length))
      }
    }
    return format
  },
  today() {
    return this.format() // 默认
  },
  now() {
    return this.format(new Date(), 'yyyy-MM-dd hh:mm:ss')
  },
  time() {
    return this.format(new Date(), 'hh:mm:ss')
  }
}
export { utils, date }
/**
 * 获取当前 日期时间
 * @param {string} cFormat // 格式
 */
export function getNowTime(cFormat) {
  var now = new Date()
  var year = now.getFullYear() // 得到年份
  var month = now.getMonth() + 1 // 得到月份
  var date = now.getDate() // 得到日期
  var hour = ' 00:00:00' // 默认时分秒 如果传给后台的格式为年月日时分秒，就需要加这个，如若不需要，此行可忽略
  month = month.toString().padStart(2, '0')
  date = date.toString().padStart(2, '0')
  var defaultDate = `${year}-${month}-${date}${hour}`
  // console.log(defaultDate)
  return defaultDate
}

/**
 * 金额增加千分位
*/
export function comdify(n) {
  if (!n) return n
  if (typeof (n) === 'number') {
    return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  } else {
    const str = n.split('.')
    const re = /\d{1,3}(?=(\d{3})+$)/g
    const n1 = str[0].replace(re, '$&,')
    return str.length > 1 && str[1] ? '${n1}.${str[1]}' : '${n1}.00'
  }
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}
/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}
