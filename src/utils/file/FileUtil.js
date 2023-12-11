import axios from "axios"

export const uploadApi = ({file, route, onUploadProgress}) => {
  const formData = new FormData()
  formData.append('file', file)
  return axios.post(route, formData, {headers:{
      'Content-type': 'multipart/form-data',
    },
    onUploadProgress // 上传进度回调函数 onUploadProgress(ev))
  }) 
}

export const formatConvertApi = ({urlsStrList, targetFormat, convertConfig, route}) => {
  const formData = new FormData()
  formData.append('urlsStrList', urlsStrList)
  formData.append('targetFormat', targetFormat)
  formData.append('convertConfig', JSON.stringify(convertConfig))
  return axios.post(route, formData, {headers:{
  'Content-Type': 'application/x-www-form-urlencoded;'
  }})
}

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}