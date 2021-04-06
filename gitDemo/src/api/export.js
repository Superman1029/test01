import axios from 'axios'
import { downloadFile } from '@/api/common'

export function exportQToExcel(params, filename) {
  axios({
    method: 'post',
    url: '/UACheck/exportExcel?',
    data: { name: 'gq.qTreelist', params: JSON.stringify(params) },
    responseType: 'blob'
  }).then(data => {
    downloadFile(data.data, filename)
  }).catch(data => {
    console.log('导出失败')
  })
}
