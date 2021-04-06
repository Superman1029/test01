const common = {
  indexMethod(row) {
    return row < 9 ? '0' + (row + 1) : (row + 1)
  },
  stopProp(event) {
    event = event || window.event
    if (event && event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  },
  // 必须要有 id pid 字段
  // https://www.cnblogs.com/shb190802/p/13647203.html 有4种方法
  list2Tree(list, pid) {
    pid = pid || ''
    const listObj = {}
    list.forEach(item => {
      item.children = []
      listObj[item.id] = item
    })
    return list.filter(item => {
      if ((item.pid !== pid) && (item.pid !== null)) {
        if (listObj[item.pid]) {
          listObj[item.pid].children.push(item)
        } else { // 没有找到pid的
          console.log(item)
        }
        return false
      }
      return true
    })
  },
  IEVersion() {
    var userAgent = navigator.userAgent // 取得浏览器的userAgent字符串
    var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 // 判断是否IE<11浏览器
    var isEdge = userAgent.indexOf('Edge') > -1 && !isIE // 判断是否IE的Edge浏览器
    var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
    if (isIE) {
      var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
      reIE.test(userAgent)
      var fIEVersion = parseFloat(RegExp['$1'])
      if (fIEVersion == 7) {
        return 7
      } else if (fIEVersion == 8) {
        return 8
      } else if (fIEVersion == 9) {
        return 9
      } else if (fIEVersion == 10) {
        return 10
      } else {
        return 6 // IE版本<=7
      }
    } else if (isEdge) {
      return 'edge' // edge
    } else if (isIE11) {
      return 11 // IE11
    } else {
      return -1 // 不是ie浏览器
    }
  },
  // 获取底稿图标 dg 对象必须包含 ，dg.lx, dg.dglx
  dgIcon(dg) {
    if (dg.lx === 2) {
      return 'fj'
    } else if (dg.dglx.indexOf('xls') !== -1) {
      return 'excel'
    } else if (dg.dglx.indexOf('doc') !== -1) {
      return 'word'
    } else {
      return 'file'
    }
  },
  // 获取 组成部分状态
  getZcbfzt(zt) {
    return zt === 190 ? '未归档' : zt === 192 ? '已提交归档' : zt === 200 ? '已归档' : '未知'
  }
}

export { common }
