<template>
    <a-page-header title="图像编辑" class="header-content" style="margin-top: 2px;text-align: left;font-size: 14px;">
        <span>可以对人物、物品图像进行背景自动抠图</span>
    </a-page-header>

    <div class="center-content" style="background-color: white;min-height: 70vh;display: flex;justify-content: center;align-items: center;">
        <div class="upload-div" v-if="fileList.length == 0 || (fileList.length > 0 && fileList[fileList.length - 1].status != 'done')">
            <upload-outlined style="font-size: 2em;display: block;margin: 10px 0;"></upload-outlined>
            <a-upload
                v-model:file-list="fileList"
                name="file"
                :before-upload="beforeUpload"
                :customRequest="customUpload"
                :showUploadList="false"
                style="display: block;margin: 10px 0;"
            >
                <a-button type="primary">
                    Upload Image
                </a-button>
            </a-upload>
            <span>PNG or JPEG</span>
        </div>

        <div class="edit-div" style="width:100%;height: 100%;border: 10px double #FF9999;background-color: rgb(234, 233, 231);border-radius: 8px;padding-top: 10%;padding: 15px;" v-else>
            <a-row :gutter="10">
                <a-col :span="9">
                    <p style="font-size: 1.2em;font-weight: bold;">原始</p>
                    <a-image
                        :src="fileList[fileList.length - 1].url"
                        fallback="data:image/png;base64,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"
                        style="border-radius: 2%;"
                    />
                </a-col>
                <a-col :span="9">
                    <p style="font-size: 1.2em;font-weight: bold;">New</p>
                    <a-spin :spinning="loading">
                        <a-image
                            :src="fileList[fileList.length - 1].convertUrl"
                            fallback="data:image/png;base64,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"
                            style="border-radius: 2%;"
                        />
                    </a-spin>
                </a-col>
                <a-col :span="6" style="display: flex;flex-direction: column;justify-content: space-evenly;align-items: center;padding: 3% 0;">
                    <a-upload
                        v-model:file-list="fileList"
                        name="file"
                        :before-upload="beforeUpload"
                        :customRequest="reUpload"
                        :showUploadList="false"
                    >
                        <a-button type="primary">
                            重新上传
                        </a-button>
                    </a-upload>
                    <a-button 
                        type="primary" 
                        @click="removeBackgroud"
                        style="background-color: rgb(15,185,114);"
                    >
                        背景移除
                    </a-button>
                    <a-button 
                        @click="downloadFile(fileList[fileList.length - 1].convertUrl, fileList[fileList.length - 1].name)"                        
                    >
                        下载文件
                    </a-button>
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { uploadApi } from '@/utils/file/FileUtil.js'
import { message } from 'ant-design-vue';
import imglyRemoveBackgroud from '@imgly/background-removal'

const fileList = ref([
    // {
    //     uid: '-1',  // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
    //     name: 'xxx.png', // 文件名
    //     status: 'done', // 状态有：uploading done error removed
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     convertUrl: "http://xxxx/img.jpg" // 处理后的图像存储url
    //     response: '{"status": "success", }', // 服务端响应内容，存储响应码、响应信息
    // },
]);

// 文件上传预处理
const beforeUpload = file => {
    // 这里可以进行文件类型、大小等校验，返回 false 可取消上传
    if(file.size > 10 * 1024 * 1024) {  // 最大文件支持10MB
        file.status = 'error'
        file['error'] = '文件超出最大限制10M'
        message.error(file['error'])
        return false;
    }
    return true;
}

// 自定义文件上传公共函数
// e - 上传组件返回的上传实例，里面包括 file，和一些组件方法
// e.file - 上传的文件实例对象
const customUpload = e => {
    let curFile = fileList.value.filter(item => item.uid == e.file.uid)[0]
    curFile.status = 'uploading'
    uploadApi({
        file: e.file,
        route: '/imageEdit/upload',
        onUploadProgress: ev => {
            // ev - axios 上传进度实例，上传过程触发多次
            // ev.loaded 当前已上传内容的大小，ev.total - 本次上传请求内容总大小
            // console.log(ev);
            const percent = (ev.loaded / ev.total) * 100;
            // 计算出上传进度，调用组件进度条方法
            e.onProgress({ percent });
        }
    })
        .then(res => {
            let curFile = fileList.value.filter(item => item.uid == e.file.uid)[0]
            if(res.data.code == 400) {
                curFile.status = 'error'
                curFile['error'] = res.data.msg
                console.error(`文件${curFile.name}上传失败：${res.data.msg}`)
            } else {
                // 通知组件该文件上传成功
                curFile.status = 'done'
                curFile.url = res.data.data
                curFile.thumbUrl = res.data.data
                curFile.convertUrl = res.data.data
                console.log(`文件${curFile.name}上传成功:`, curFile.url);
            }
        })
        .catch(err => {
            let curFile = fileList.value.filter(item => item.uid == e.file.uid)[0]
            curFile.status = 'error'
            curFile['error'] = '文件传输失败'
            console.log('上传失败', err);
        })
}

// 重新上传图像
const reUpload = e => {
    let tempFile = fileList.value.filter(item => item.uid == e.file.uid)[0]
    fileList.value = [tempFile]
    customUpload(e)
}

// 自动抠图
const loading = ref(false)
let rmConfig = {
    publicPath: "/src/assets/removeBk/", // 将模型文件存入本地，直接从项目本地跑模型，省去了下载模型的时间
    fetchArgs: {
        mode: "no-cors", // 跨域问题
    },  
    progress: (key, current) => { // 进度回调，目前指挥返回加载模型的进度，处理图片的进度不会返回
        loading.value = !(key === 'compute:inference' && current === 1)
    },
    proxyToWorker: true, // 是否将计算代理给Web Worker进行处理。（默认为true）
    model: 'medium', // // 使用的模型。（默认为“medium” 80m大小） small 40m大小
}

// 抠图方法
const removeBackgroud = async () => {
    let curFile = fileList.value[fileList.value.length - 1]
    const response = await imglyRemoveBackgroud(curFile.url, rmConfig)
    curFile.convertUrl = URL.createObjectURL(response)
    message.success('背景移除成功')
    console.log('curFile.convertUrl:' + curFile.convertUrl)
}

// 下载文件
const downloadFile = (url, name) => {
    const fileUrl = url; // 替换为实际的文件 URL

    // 创建一个隐藏的 <a> 元素用于下载
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    // downloadLink.target = '_blank'; // 在新窗口/标签中打开下载链接
    downloadLink.download = name; // 设置下载的文件名

    // 将 <a> 元素添加到文档中
    document.body.appendChild(downloadLink);

    // 触发点击事件以开始下载
    downloadLink.click();

    // 下载完成后移除 <a> 元素
    document.body.removeChild(downloadLink);
}
</script>