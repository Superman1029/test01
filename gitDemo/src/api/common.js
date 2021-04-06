import request from '@/utils/request'
import { fileservice } from '@/utils/request'
/**
 * 用户登录接口
 * @param {用户 密码} data
 */
export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

/**
 * 用户认证  天职单点登录时使得
 */
export function auth() {
  return request({
    url: '/UACheck/auth',
    method: 'get'
  })
}
/**
 * 注销/退出
 */
export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}
/**
 * 获取api数据
 * @param {*} apiName
 * @param {*} params
 */
export function getApiData(apiName, params) {
  const data = {
    name: apiName,
    params: params
  }
  return request({
    url: '/api/getApiData',
    method: 'post',
    data
  })
}
/**
 * 更新表信息
 * @param {*} table
 * @param {*} keys
 * @param {*} rows
 */
export function updateTable(table, keys, rows) {
  const data = {
    table: table,
    keys: keys,
    rows: rows
  }
  return request({
    url: '/api/updateTable',
    method: 'post',
    data
  })
}
/**
 * 打开底稿 文件
 * @param {*} dginfo  底稿信息（）
 */
export function openDG(dginfo) {
  getApiData('pub.getViewDGinfo', dginfo).then(r => {
    var jsonData = r.data[0]
    jsonData.origin = window.location.origin + '/'
    var dginfostr = JSON.stringify(jsonData)
    location.href = 'cpas://ViewDG/?dginfo=' + encodeURI(dginfostr)
  })
}
/**
 * 下载文件调用
 * @param 接口返回数据 文件名
 */
export function downloadFile(res, fileName) {
  if (!res) {
    return
  }
  if (window.navigator.msSaveBlob) { // IE以及IE内核的浏览器
    try {
      window.navigator.msSaveBlob(res, fileName) // res为接口返回数据，这里请求的时候已经处理了，如果没处理需要在此之前自行处理var data = new Blob([res.data]) 注意这里需要是数组形式的,fileName就是下载之后的文件名
      // window.navigator.msSaveOrOpenBlob(res, fileName);  //此方法类似上面的方法，区别可自行百度
    } catch (e) {
      console.log(e)
    }
  } else {
    const url = window.URL.createObjectURL(new Blob([res]))
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)// 文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) // 下载完成移除元素
    window.URL.revokeObjectURL(url) // 释放掉blob对象
  }
}
/**
 * 下载底稿
 * @param {} dginfo
 */
export function downloadDG(dginfo) {
  getApiData('pub.getViewDGinfo', dginfo).then(r => {
    var jsonData = r.data[0]
    var index = jsonData.url.indexOf('/audit_papers')
    var url = jsonData.url.substring(index) // http://111.202.125.171/audit_papers
    var fileName = jsonData.dgmc + jsonData.dglx
    fileservice({
      method: 'get',
      url: url // 请求地址
    }).then((res) => {
      downloadFile(res, fileName)
    }).catch((error) => {
      console.log(error)
      this.$message.error({
        message: '下载失败'
      })
    })
  })
}
