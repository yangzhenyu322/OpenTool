import axios from "axios"

const uploadApi = ({file, URL, onUploadProgress}) => {
    const formData = new FormData()
    formData.append('file', file)
    return axios.post(URL, formData, {headers:{
        'Content-type': 'multipart/form-data',
      },
      onUploadProgress // 上传进度回调函数 onUploadProgress(ev))
    }) 
}

export default uploadApi;