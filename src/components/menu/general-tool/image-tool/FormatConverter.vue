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
                            1：选择本地图片或输入在线PNG文件的URL
                            2：选择目标图像格式并设置转换选项（可选）
                            3：点击“开始转换”按钮将原图像在线转换为目标格式图像
                        </span>
                    </span>
                </div>
            </a-col>
            <a-divider type="vertical" class="file-divider"/>
            <a-col :span="5" >
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
                        <p style="font-size: 18px;margin: 2%;">
                            <a-modal 
                            v-model:open="state.isSetModalShow" 
                            title="转换设置选项" @ok="handleSetModal" 
                            :cancel-button-props="{ style: { display: 'none' } }" 
                            width="50%">
                                <hr>
                                <!-- 水平居中 -->
                                <div style="display: flex;justify-content: center;align-items: center;height: 100%;">
                                    <a-form
                                    ref="formRef"
                                    :model="state.formState"
                                    :rules="state.rules"
                                    style="width: 100%;"
                                    >
                                        <p style="font-weight: bold;">图片质量：</p>
                                        <a-form-item name="quality">
                                            <a-input v-model:value="state.formState.quality" />
                                        </a-form-item>
                                        <p style="font-weight: bold;">图片尺寸：</p>
                                        <a-form-item name="sizeType">
                                            <a-select v-model:value="state.formState.sizeType" placeholder="please select your sex">
                                                <a-select-option value="NoChange">保持原始图片尺寸</a-select-option>
                                                <a-select-option value="Size">更改图片宽度和高度</a-select-option>
                                                <a-select-option value="Width">仅更改图片宽度</a-select-option>
                                                <a-select-option value="WidthKeepRatio">改变图片宽度保持长宽比</a-select-option>
                                                <a-select-option value="Height">仅改变图片高度</a-select-option>
                                                <a-select-option value="HeightKeepRatio">改变图片高度保持长宽比</a-select-option>
                                                <a-select-option value="Scale">保持长宽比缩放图片</a-select-option>
                                            </a-select>
                                        </a-form-item>
                                        <a-form-item label="宽度" name="width" v-if="['Size', 'Width', 'WidthKeepRatio'].includes(state.formState.sizeType)">
                                            <a-input v-model:value="state.formState.width" />
                                        </a-form-item>
                                        <a-form-item label="高度" name="height" v-if="['Size', 'Height', 'HeightKeepRatio'].includes(state.formState.sizeType)">
                                            <a-input v-model:value="state.formState.height" />
                                        </a-form-item>
                                        <a-form-item label="缩放比例" name="scale" v-if="['Scale'].includes(state.formState.sizeType)">
                                            <a-input v-model:value="state.formState.scale" />
                                        </a-form-item>
                                    </a-form>
                                </div>
                            </a-modal>
                            <a @click="openSetModal"><span style="color: rgb(24,144,255);">设置转换选项</span></a>
                            （可选）
                        </p>
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
                            <a-checkbox-group v-model:value="state.selectAgreeProtocal" @change="protocalCheckChange">
                                <a-checkbox value="true" name="type" >
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
            <a-col :span="1"><a-checkbox @click="selectAll"></a-checkbox></a-col>
            <a-col :span="6">文件</a-col>
            <a-col :span="6">文件大小</a-col>
            <a-col :span="6">文件状态</a-col>
            <a-col :span="5">下载</a-col>
        </a-row>
        <a-divider/>
        
        <el-scrollbar style="height:calc(100vh - 515px);">
            <a-checkbox-group v-model:value="selectedFiles" style="display: block;">
                <a-row v-for="file in fileList" :key="file.uid" style="display: flex;align-items: center;">
                    <a-col :span="1"><a-checkbox :value="file" :disabled="file.status != 'done'"></a-checkbox></a-col>
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
                    <a-col :span="6">
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
            </a-checkbox-group>
        </el-scrollbar>
        
    </div>
</template>

<script setup>
import { ref, reactive, watch, toRaw } from 'vue'
import { uploadApi, formatConvertApi } from '@/utils/file/FileUtil.js'
import { message } from 'ant-design-vue';                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               

const formRef = ref() // 表单ref
const state = reactive({
    targetFilePath: '',
    targetFormat: 'PNG',
    isFilePathInPuting: true, // 文件/URL路径选择控制Flag
    urlPrefix: 'Http://',  // URL前缀
    urlPath: '', // URL路径，URL = urlPrefix + urlPath
    url: '', // url完整路径
    isSetModalShow: false, // 是否显示转换设置弹窗
    // 表单数据
    formState: {
        quality: 1, // 图片质量
        // 尺寸更改类型：NoChange: 保持原始图片尺寸，Size: 更改图片尺寸和高度，Width: 仅更改图片宽度，WidthKeepRatio: 改变图片宽度保持长宽比
        //   Height: 仅改变图片高度, HeightKeepRatio: 改变图片高度保持长宽比, Scale：保持长宽比缩放图片
        sizeType: "NoChange", // 尺寸转换类型
        width: 0, // 宽度
        height: 0, // 高度
        scale: 1, // 缩放倍率
    },
    rules: {
        quality: [{
            type: 'float',
            required: true,
            validator: async (rule, value) => {
                if (value >= 0 && value <= 1) {
                    return Promise.resolve()
                }
                return Promise.reject('请输入0~1之间的小数')
            }
        }],
        sizeType: [{
            type: 'string',
            required: true,
            message: '请选择尺寸更改的类型'
        }],
        width: [{
            type: 'number',
            required: false,
            validator: async (rule, value) => {
                if (value >= 0 && value % 1 === 0) {
                    return Promise.resolve()
                }
                return Promise.reject('请输入大于0的整数')
            }
        }],
        height: [{
            type: 'number',
            required: false,
            validator: async (rule, value) => {
                if (value >= 0 && value % 1 === 0) {
                    return Promise.resolve()
                }
                return Promise.reject('请输入大于0的整数')
            }
        }],
        scale: [{
            type: 'number',
            required: false,
            validator: async (rule, value) => {
                if (value >= 0 && value <= 4) {
                    return Promise.resolve()
                }
                return Promise.reject('请输入0~4的数字')
            }
        }]
    },
    isAgreeProtocal: true, // 用户是否同意协议Flag
    selectAgreeProtocal: ['true'],
    isConverting: false, // 是否正在转换
})

const fileList = ref([
    // {
    //     uid: '-1',  // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
    //     name: 'xxx.png', // 文件名
    //     status: 'done', // 状态有：uploading done error removed
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     convertUrl: "http://xxxx/img.jpg" // 处理后的图像存储url
    //     response: '{"status": "success", }', // 服务端响应内容，存储响应码、响应信息
    //     error: "xxx", // 上传错误信息
    // },
]);

const selectedFiles = ref([]) // 被选中的文件

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
                console.log(`文件${curFile.name}上传成功:`, curFile.url)
                console.log('uid:' + curFile.uid)
            }
        })
        .catch(err => {
            let curFile = fileList.value.filter(item => item.uid == e.file.uid)[0]
            curFile.status = 'error'
            curFile['error'] = '文件传输失败'
            console.log('上传失败', err);
        })
}

// 计算文件大小
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
    state.url = state.urlPrefix + state.urlPath
    console.log("URL:" + state.url)
})

// 开启URL路径输入
const onInputURL = () => {
    state.isFilePathInPuting = !state.isFilePathInPuting
}

// 打开图像设置对话框
const openSetModal = () => {
    state.isSetModalShow = true
}

// 确认设置
const handleSetModal = () => {
    formRef.value.validate().then(() => {
        state.isSetModalShow = false
        console.log('values', state.formState, toRaw(state.formState));
        message.success('转换设置成功',3)
    }).catch(error => {
        console.log('error', error);
        message.error('设置信息有误，请检查后重新提交',5)
    });
}

// 是否全选
const isCheckAll = ref(false)
watch(isCheckAll, (newVal) => {
    if (newVal == true) {
        // 选中所有已成功上传的文件
        selectedFiles.value = fileList.value.filter(file => file.status == 'done')
    } else {
        // 取消全选
        selectedFiles.value = []
    }
})

const selectAll = () => {
    isCheckAll.value = !isCheckAll.value
}

// 检测是否同意协议变化
const protocalCheckChange = () => {
    state.isAgreeProtocal = !state.isAgreeProtocal
    state.selectAgreeProtocal = [`${state.isAgreeProtocal}`]
}

// 开始文件格式转换
const convertFile = () => {
    if (state.isAgreeProtocal) { // 同意条款
        // 成功上传且被选中的文件列表url
        let urlsStrList = []
        selectedFiles.value.forEach(file => {
            urlsStrList.push(file.url)
        });

        if (urlsStrList.length < 1) {
            message.info('至少选中一个文件')
            return
        }

        // 开始加载动画
        state.isConverting = true  
        // 格式转换
        formatConvertApi({
            urlsStrList: urlsStrList,
            targetFormat: state.targetFormat,
            convertConfig: state.formState, // 转换配置信息
            route: '/imageConvert/conversion'
        }).then(res => {
            let urlsTargetPath = res.data.data
            urlsTargetPath.forEach((url, index) => {
                let convertFile = selectedFiles.value[index]
                let file = fileList.value.filter(item => item.uid == convertFile.uid)[0] 
                file.convertUrl = url  // 转换后图片保存的url路径
                state.isConverting = false
                // console.log(`文件${file.name}格式转换成功：${file.convertUrl}`)
            })
            message.success("格式转换成功")
        }).catch(err => {
            message.error("转换失败，请稍后重试")
            console.log("转换失败：" + err)
            state.isConverting = false
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