import request from '@/utils/request'
import { fileservice } from '@/utils/request'

export function mbManageApi(url, method, params) {
  return request({
    url: url,
    method: method,
    params: {
      params: params
    }
  })
}

/**
 * 下载底稿
 * @param {} fileName
 */
export function downloadTemplateDG(url, fileName, loadingInstance) {
  fileservice({
    method: 'get',
    url: url // 请求地址
  }).then((res) => {
    // downloadFile(res, fileName)
    if (window.navigator.msSaveBlob) { // IE以及IE内核的浏览器
      try {
        window.navigator.msSaveBlob(res, fileName) // res为接口返回数据，这里请求的时候已经处理了，如果没处理需要在此之前自行处理var data = new Blob([res.data]) 注意这里需要是数组形式的,fileName就是下载之后的文件名
        // window.navigator.msSaveOrOpenBlob(res, fileName);  //此方法类似上面的方法，区别可自行百度
        loadingInstance.close()
      } catch (e) {
        console.log(e)
        loadingInstance.close()
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
      loadingInstance.close()
    }
  }).catch((error) => {
    console.log(error)
    this.$message.error({
      message: '下载失败'
    })
    this.$nextTick(() => {
      loadingInstance.close()
    })
  })
}

/**
 * 执行
 * @param {} fileName
 */
export function auditPaperApi(url, callback) {
  fileservice({
    method: 'get',
    url: url // 请求地址
  }).then((res) => {
    callback(true)
  }).catch(() => {
    callback(false)
  })
}

/**
 * 打开底稿 文件
 * @param {*} dginfo  底稿信息（）
 */
export function openTemplateDG(url, filename) {
  // http://111.202.125.171/audit_papers/zssys/dgmb/%E6%B5%8B%E8%AF%95%E6%A8%A1%E6%9D%BF/Q%E4%BF%A1%E6%81%AF.xlsx
  // cpas://OpenFile/?url=" + encodeURI(url) + "&filename=" + encodeURI(filename) window.location.hostname + ':' + location.port
  let p = 'cpas://OpenFile/?url=http://111.202.125.171/audit_papers/zssys/dgmb/%E6%B5%8B%E8%AF%95%E6%A8%A1%E6%9D%BF/Q%E4%BF%A1%E6%81%AF.xlsx' // + encodeURI('http://111.202.125.171' + url)
  console.log(p)
  p += '&filename=' + encodeURI(filename)
  location.href = p
}

/**
 * 上传
 * @param {} fileName
 */
export function uploadTemplateFile(url, fd, subDir, callback) {
  fileservice({
    method: 'post',
    url: url,
    data: fd,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Basic dWZvc3l1c2VyOnp6aHhibQ==',
      // 'Audit-SubDir': encodeURI(subDir),
      'Audit-Version': '1',
      'Audit-IsNeedUnZip': '1'
    }
  }).then((res) => {
    callback(true)
  }).catch((error) => {
    callback(false)
  })
}

/**
 * 打包
 * @param {} fileName
 */
export function packTemplateFile(url, fd, subDir, mbfile, callback) {
  fileservice({
    method: 'post',
    url: url,
    data: fd,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic dWZvc3l1c2VyOnp6aHhibQ==',
      'Audit-SubDir': subDir,
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin',
      'Audit-Version': '1',
      'Audit-IsNeedUnZip': '1',
      'Audit-FileName': mbfile
    }
  }).then((res) => {
    callback(true)
  }).catch((error) => {
    callback(false)
  })
}

/**
 * 上传底稿
 * @param {} fileName
 */
export function uploadDgFile(url, fd, subDir, callback) {
  fileservice({
    method: 'post',
    url: url,
    data: fd,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Basic dWZvc3l1c2VyOnp6aHhibQ==',
      // 'Audit-SubDir': encodeURI(subDir),
      'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin',
      'Audit-Version': '1',
      'Audit-NoUTF8': '1'
    }
  }).then((res) => {
    callback(true)
  }).catch((error) => {
    callback(false)
  })
}
