<template>
    <a-page-header title="图像格式转换" class="header-content" style="margin-top: 2px;text-align: left;font-size: 14px;">
        <span>支持任意图像格式转换为指定格式图像</span>
    </a-page-header>

    <div class="center-content" style="background-color: white;">
        <a-row>
            <a-col :span="6">
                <div>
                    <span>
                        <ProfileTwoTone style="font-size: 40px; float: left; margin-right: 10px;"/>
                        <span style="font-size: 16px;">
                            1：选择本地图片或输入在线PNG文件的URL。 
                            2：选择目标图像格式并设置转换选项（可选）。 
                            3：点击“开始转换”按钮将原图像在线转换为目标格式图像。
                        </span>
                    </span>
                </div>
            </a-col>
            <a-divider type="vertical" class="file-divider"/>
            <a-col :span="6" >
                <div style="display: flex;justify-content: center;align-items: center;">
                    <div style="width: 80%;">
                        <div v-if="state.isFilePathInPuting" style="height: 70px;border: 1px solid rgb(24,144,255);border-radius: 5px;">
                            <a-upload-dragger
                                v-model:file-list="fileList"
                                name="file"
                                :multiple="true"
                                :showUploadList="false"
                                :before-upload="beforeUpload"
                                :customRequest="customUpload"
                                style="font-size: 20px;color: rgb(24,144,255);"
                            >
                            <!-- :directory="true" -->
                                <PlusSquareTwoTone style="font-size: 18px;" /> 选择文件
                            </a-upload-dragger>
                        </div>
                        <div v-else style=";height: 70px;border: 1px solid rgb(24,144,255);border-radius: 5px;">
                            <div style="display: flex;justify-content: left;font-size: 1em;margin: 2%;">URL:</div>
                            <div style="margin: 2% 5% 2% 5%;display: flex;justify-content: space-between;font-size: 1.2em;">
                                <a-input v-model:value="state.urlPath" placeholder="Basic usage" >
                                    <template #addonBefore>
                                        <a-select v-model:value="state.urlPrefix" style="width: 90px">
                                            <a-select-option value="Http://">Http://</a-select-option>
                                            <a-select-option value="Https://">Https://</a-select-option>
                                        </a-select>
                                    </template>
                                </a-input>
                            </div>
                        </div>
                        <p style="font-size: 18px;margin: 2%;">
                            <span v-if="state.isFilePathInPuting">选择文件</span>
                            <a @click="onInputURL" v-else>选择文件</a>
                            或
                            <a @click="onInputURL" v-if="state.isFilePathInPuting">输入远程文件URL</a>
                            <span v-else>输入远程文件URL</span>
                        </p>
                    </div>
                </div>
            </a-col>
            <a-divider type="vertical" class="file-divider"/>
            <a-col :span="6">
                <div style="display: flex;justify-content: center;align-items: center;">
                    <div style="width: 80%;">
                        <div style=";height: 70px;border: 1px solid rgb(24,144,255);border-radius: 5px;">
                            <div style="display: flex;justify-content: left;font-size: 1em;margin: 2%;">目标格式:</div>
                            <div style="margin: 2% 5% 2% 5%;display: flex;justify-content: space-between;font-size: 1.2em;">
                                <a-select  v-model:value="state.targetFormat" style="width: 95%;text-align: left;">
                                    <a-select-option value="JPG">JPG</a-select-option>
                                    <a-select-option value="JPEG">JPEG</a-select-option>
                                    <a-select-option value="PNG">PNG</a-select-option>
                                    <a-select-option value="GIF">GIF</a-select-option>
                                    <a-select-option value="SVG">BMP</a-select-option>
                                    <a-select-option value="SVG">WBMP</a-select-option>
                                </a-select>
                            </div>
                        </div>
                        <p style="font-size: 18px;margin: 2%;"><span style="color: rgb(24,144,255);">设置转换选项</span>（可选）</p>
                    </div>
                </div>
            </a-col>
            <a-divider type="vertical" class="file-divider"/>
            <a-col :span="5">
                <div style="display: flex;justify-content: center;align-items: center;">
                    <div style="width: 100%;">
                        <a-spin :spinning='state.isConverting'>
                            <a-button @click="convertFile" style="width: 80%;height: 70px;border-radius: 5px;font-size: 20px;color: white;background-color: rgb(84, 236, 142);">
                                <SyncOutlined style="font-size: 18px;" /> 
                                开始转换
                            </a-button>
                        </a-spin>
                        <p style="font-size: 18px;margin: 2%;">
                            <a-checkbox-group @change="protocalCheckChange">
                                <a-checkbox value="true" name="type">
                                    同意<span style="color: rgb(24,144,255);">使用条款</span>和<span style="color: rgb(24,144,255);">隐私政策</span>
                                </a-checkbox>
                            </a-checkbox-group>
                        </p>
                    </div>
                </div>
            </a-col>
        </a-row>
        <h3 style="text-align: left;">文件列表</h3>

        <a-divider/>
        <a-row style="font-size: 24px;font-weight: bold;">
            <a-col :span="6">文件</a-col>
            <a-col :span="6">文件大小</a-col>
            <a-col :span="7">文件状态</a-col>
            <a-col :span="5">下载</a-col>
        </a-row>
        <a-divider/>

        <a-row v-for="file in fileList" :key="file.uid" style="display: flex;align-items: center;">
            <a-col :span="6">
                <!-- 文件上传组件 -->
                <a-upload
                :file-list="[file]"
                list-type="picture"
                @remove="removeFile"
                >
                </a-upload>
            </a-col>
            <a-col :span="6">{{ formatFileSize(file.size) }}</a-col>
            <a-col :span="7">
                <span v-if="file.status == 'uploading'" style="color: dodgerblue;">正在上传中...</span>
                <span v-else-if="file.status == 'error'" style="color: red;">{{ file.error }}</span>
                <span v-else style="color: forestgreen;">上传成功</span>
            </a-col>
            <a-col :span="5">
                <a-button type="primary" v-if="file.convertUrl" @click="downloadFile(file.convertUrl, file.name)">
                    <template #icon>
                        <DownloadOutlined />
                    </template>
                    Download
                </a-button>
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { uploadApi, formatConvertApi } from '@/utils/file/FileUtil.js'
import { message } from 'ant-design-vue';

const state = reactive({
    targetFilePath: '',
    targetFormat: 'PNG',
    isFilePathInPuting: true, // 文件/URL路径选择控制Flag
    urlPrefix: 'Http://',  // URL前缀
    urlPath: '', // URL路径，URL = urlPrefix + urlPath
    isAgreeProtocal: false, // 用户是否同意协议Flag
    isConverting: false, // 是否正在转换
})

const fileList = ref([
    // {
    //     uid: '-1',  // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
    //     name: 'xxx.png', // 文件名
    //     status: 'done', // 状态有：uploading done error removed
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     "convertUrl": "http://xxxx/img.jpg" // 处理后的图像存储url
    //     response: '{"status": "success", }', // 服务端响应内容，存储响应码、响应信息
    // },
]);

const removeFile = (file) => {
    fileList.value = fileList.value.filter(item => item.uid != file.uid)
}

// 文件上传预处理
const beforeUpload = file => {
    // 这里可以进行文件类型、大小等校验，返回 false 可取消上传
    if(file.size > 10 * 1024 * 1024) {  // 最大文件支持10MB
        file.status = 'error'
        file['error'] = '文件超出最大限制10M'
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
        route: '/imageConvert/upload',
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

const formatFileSize = bytes => {
    if (bytes < 1024) {
        return bytes + ' Bytes';
    } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
    } else {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    }
}

// 自动拼接网络资源url
watch(()=>state.urlPath, ()=> {
    console.log("URL:" + state.urlPrefix + state.urlPath)
})

// 开启URL路径输入
const onInputURL = () => {
    state.isFilePathInPuting = !state.isFilePathInPuting
}

// 检测是否同意协议变化
const protocalCheckChange = () => {
    state.isAgreeProtocal = !state.isAgreeProtocal
}

// 开始文件格式转换
const convertFile = () => {
    state.isConverting = true
    if (state.isAgreeProtocal) { // 同意条款
        // 成功上传的文件列表
        let successFiles = fileList.value.filter(file => file.status == 'done')
        let urlsStrList = []
        successFiles.forEach(file => {
            urlsStrList.push(file.url)
        });
        // 格式转换
        formatConvertApi({
            urlsStrList: urlsStrList,
            targetFormat: state.targetFormat,
            route: '/imageConvert/conversion'
        }).then(res => {
            let urlsTargetPath = res.data.data
            urlsTargetPath.forEach((url, index) => {
                let successFile = successFiles[index]
                let file = fileList.value.filter(item => item.uid == successFile.uid)[0] 
                file.convertUrl = url  // 转换后图片保存的url路径
                state.isConverting = false
                console.log(`文件${file.name}格式转换成功：${file.convertUrl}`)
            })
            message.success("格式转换成功")
        })
    } else {
        message.error("请阅读并勾选使用条款")
    }
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

<style scoped>
.file-divider{
    height: 100px; 
    background-color: #8b8c8a;
}

/* tile uploaded pictures */
.upload-list-inline :deep(.ant-upload-list-item) {
  float: left;
  width: 200px;
  margin-right: 8px;
}
.upload-list-inline :deep(.ant-upload-animate-enter) {
  animation-name: uploadAnimateInlineIn;
}
.upload-list-inline :deep(.ant-upload-animate-leave) {
  animation-name: uploadAnimateInlineOut;
}
</style>