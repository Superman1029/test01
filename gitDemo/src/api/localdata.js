// 本地数据请求 接口
import axios from 'axios'
// import { Message } from 'element-ui'
// import request from '@/utils/request'
// import { downloadFile } from '@/api/common'

// souFile 源文件 desFile 目标文件
export function downloadLocalFile(souFile, desFile, params) {
  params.t = new Date().getTime() // get方法加一个时间参数,解决ie下可能缓存问题.
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: '/CpasCloud/' + souFile, // 请求地址
      params, // 参数
      headers: {
        contentType: 'application/json;charset=UTF-8'
      },
      responseType: 'blob' // 表明返回服务器返回的数据类型
    }).then(
      response => {
        resolve(response.data)
        const blob = new Blob([response.data], { type: 'application/zip;charset=utf-8' })
        console.log(blob)
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, desFile)
        } else {
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = desFile
          link.click()
          window.URL.revokeObjectURL(link.href)
        }
      },
      err => {
        reject(err)
      }
    )
  })
  // const elink = document.createElement('a')
  // elink.style.display = 'none'
  // elink.href = '/tools/cloud.png'
  // elink.download = 'cloud.png'
  // // link.setAttribute('download', fileName)// 文件名
  // document.body.appendChild(elink)
  // elink.click()
  // document.body.removeChild(elink)
}

/**
 * 获取本地JSON文件数据
 * filename JSON文件名
 * dataname JSON 对象中的属性名称
 * 返回JSON文件中的对象
 */
export function getLocalData(filename, dataname) {
  const p = new Promise(function(resolve, reject) {
    axios.get('/config/json/' + filename + '.json').then(res => {
      resolve(dataname ? res.data[dataname] : res.data)
    }).catch(err => {
      reject(err)
    })
  })
  return p
}
/**
 * 获取本地数据词典的数据
 * @param {本地数据词典中的 名称} name
 */
export function getDict(name) {
  const p = new Promise(function(resolve, reject) {
    axios.get('./config/json/dict.json').then(res => {
      resolve(name ? res.data[name] : res.data)
    }).catch(err => {
      reject(err)
    })
  })
  return p
}
