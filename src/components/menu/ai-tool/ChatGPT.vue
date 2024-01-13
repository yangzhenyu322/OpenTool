<template>
    <div style="min-height:calc(100vh - 90px);background-color: white;">
        <!-- 表头 -->
        <a-affix :offset-top="91">
            <div class="horizontal-center" style="height: 50px;background-color: white;" >
                <a-select 
                    v-model:value="selectedChatModel"
                    @change="handleChatModelChange"
                    :disabled="isChating"
                    style="width: 190px" 
                >
                    <a-select-opt-group>
                        <template #label>
                            <span>
                                <message-outlined />
                                GPT3.5
                            </span>
                        </template>
                        <a-select-option value="gpt-3.5-turbo-1106">GPT-3.5-turbo-1106</a-select-option>
                        <a-select-option value="gpt-3.5-turbo-16k">GPT-3.5-turbo-16k</a-select-option>
                    </a-select-opt-group>
                    <a-select-opt-group>
                        <template #label>   
                            <span>
                                <comment-outlined />
                                GPT4
                            </span>
                        </template>
                        <a-select-option value="gpt-4-1106-preview">GPT-4-1106-preview</a-select-option>
                        <a-select-option value="gpt-4-vision-preview">GPT-4-vision-preview</a-select-option>
                    </a-select-opt-group>
                    <a-select-opt-group>
                        <template #label>
                            <span>
                                <file-image-outlined />
                                DALL
                            </span>
                        </template>
                        <a-select-option value="dall-e-3">Dall-e-3</a-select-option>
                    </a-select-opt-group>
                </a-select>
                <!-- 重置窗口按钮 -->
                <a-popconfirm 
                    title="确认重置对话窗口？(这将清空对话记录)"
                    ok-text="确认" 
                    cancel-text="取消"
                    placement="bottomRight"
                    @confirm="resetChatWindow"
                >
                    <template #icon>
                        <question-circle-outlined style="color: red" />
                    </template>
                    <a-button danger size="small" style="margin-left: 10px;">
                        <RedoOutlined />
                    </a-button>
                </a-popconfirm>
            </div>
        </a-affix>
        
        <!-- 聊天对话 -->
        <a-skeleton :loading="isPreLoading" active>
            <a-table 
            class="ant-table-chatgpt"
            :columns="columns"
            :data-source="tableData"
            :showHeader="false"
            :pagination="false"
            :rowClassName="(record, index) => (index % 2 == 1 ? 'row-answer' : 'row-question')"
            >
                <template v-slot:bodyCell="{ column, record, index}">
                    <!-- 头像 -->
                    <template v-if="column.dataIndex == 'avatar'">
                        <a-avatar class="avatar" v-if="record.key % 2 == 0" size="large" style="background-color: #fde3cf;">
                            {{ uid.substring(0,2).toUpperCase() }}
                        </a-avatar>
                        <a-avatar class="avatar" v-else shape="square" size="large" style="background-color: rgb(191, 246, 208)" :src="gptAvatarUrl"></a-avatar>
                    </template>

                    <!-- 文本 -->  
                    <template v-if="column.dataIndex == 'content'">
                        <!-- 问题框 -->
                        <div v-if="record.key % 2 == 0">
                            <!-- 图片展示区 -->
                            <div v-if="record.imgList != null && record.imgList.length > 0" style="margin-bottom: 1%;">
                                <a-image-preview-group>
                                    <div v-for="(group, index) in groupedImages(record.imgList)" :key="index"> 
                                        <a-image :width="200" :height="200" v-for="(img, i) in group" :key="i" :src="img" style="object-fit: cover;margin-right: 1%;border-radius: 2%;" />
                                    </div>
                                </a-image-preview-group>
                            </div>
                            <!-- 文本展示区 -->
                            <div>
                                <span :id="uid + '-' + index" style="font-weight: bold;white-space: pre-wrap;">{{ record.content }}</span>
                            </div>
                        </div>
                        <!-- 回答框 -->
                        <div v-else>
                            <!-- 图片展示区 -->
                            <div v-if="record.imgList != null && record.imgList.length > 0" style="margin-bottom: 1%;">
                                <a-image-preview-group>
                                    <div v-for="(group, index) in groupedImages(record.imgList)" :key="index"> 
                                        <a-image :width="200" :height="200" v-for="(img, i) in group" :key="i" :src="img" style="object-fit: cover;margin-right: 1%;border-radius: 2%;" />
                                    </div>
                                </a-image-preview-group>
                            </div>
                            <!-- 文本展示区 -->
                            <ChatMarkDown :id="uid + '-' + index" :content="record.content" />
                        </div>
                    </template>

                    <!-- 操作区 -->
                    <template v-if="column.dataIndex == 'operation'">
                        <div class="operation">
                            <a-button 
                            shape="circle" 
                            size="small"
                            @click="copyDomText(uid + '-' + index)"
                            style="border: 0;background-color: transparent;box-shadow: none;"
                            >
                                <CopyFilled />
                            </a-button>
                        </div>
                    </template>
                </template>
            </a-table>
        </a-skeleton>
        
        <!-- 底部输入框 -->
        <div class="fixed-bottom">
            <!-- 图片展示区 -->
            <div class="horizontal-center" v-if="['gpt-4-vision-preview'].includes(selectedChatModel)">
                <a-upload
                    v-model:file-list="fileList"
                    list-type="picture-card"
                    :before-upload="beforeUpload"
                    :customRequest="customUpload"
                    @preview="uploadPreview"
                    style=""
                >
                    <div v-if="fileList.length < maxFileLength">
                        <plus-outlined />
                        <div style="margin-top: 8px;">Upload</div>
                    </div>
                </a-upload>
                <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="previewCancel">
                    <img alt="example" style="width: 100%" :src="previewImage" />
                </a-modal>
            </div>
            <!-- 问题输入区域 -->
            <div class="horizontal-center">
                <!-- 问题输入框 -->
                <a-textarea
                v-model:value="question"
                placeholder="Send a message"
                size="large"
                :auto-size="{ minRows: 1, maxRows: 9}"
                allow-clear
                @keydown.enter="sendMessage"
                style="width: 60%;"
                />
                <!-- 发送/中断 消息按钮 -->
                <a-button @click="sendMessage" :disabled="isChating || question == null || question == ''" style="margin-left: 2px;height: 2.5em;">
                    <SyncOutlined v-if="isChating" spin style="color: rgb(24,144,255);" />
                    <RocketFilled v-else />
                </a-button>
                <a-tooltip placement="top">
                    <template #title>
                        若等待时间过长，可中断对话
                    </template>
                    <a-button v-if="isChating" @click="closeSse" danger style="margin-left: 2px;">
                        Stop
                    </a-button>
                </a-tooltip>
            </div>
        </div>
        
        <div style="height: 300px;"></div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, ref } from "vue";
import { message } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue';
import axios from "axios";
import ChatMarkDown from "./chatgpt-markdown/ChatMarkDown.vue";
import gptUrl from '@/assets/images/avatar/chatgpt.png'
import { copyDomText } from '@/utils/common.js'
import { getBase64 } from '@/utils/file/FileUtil.js'
import { EventSourcePolyfill } from "event-source-polyfill"

const isPreLoading = ref(true) // 预加载动画
const selectedChatModel = ref('gpt-3.5-turbo-1106')
// gpt头像
const gptAvatarUrl = ref(gptUrl)
const uid = 'zensheep' + '-chatgpt' // 用户id
const wid = ref(selectedChatModel.value) // 窗口id
const question = ref('') // 问题文本
const fileList = ref([
    // {
    //     uid: '-1',  // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
    //     name: 'xxx.png', // 文件名
    //     status: 'done', // 状态有：uploading done error removed
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //     convertUrl: "http://xxxx/img.jpg" // 处理后的图像存储url
    // },
])
const maxFileLength = ref(9) // 允许上传最大图片数
const previewVisible = ref(false); // 预览图片是否展示
const previewImage = ref(''); // 当前预览图片
const previewTitle = ref(''); // 预览图片名
// 文件上传预处理
const beforeUpload = file => {
    // 这里可以进行文件类型、大小等校验，返回 false 可取消上传
    if(file.size > 20 * 1024 * 1024) {  // 最大文件支持20MB
        file.status = 'error'
        file['error'] = '文件超出最大限制20M'
        message.error(file['error'])
        return false;
    }
    return true;
}
// 自定义文件上传公共函数
const customUpload = e => {
    let curFile = fileList.value.filter(item => item.uid == e.file.uid)[0]
    curFile.status = 'uploading'
    const formData = new FormData()
    formData.append('file', e.file)
    formData.append('width', 512)
    formData.append('height', 512)
    axios.post('/chatgpt/upload', formData, {headers:{
            'Content-type': 'multipart/form-data',
        },
        onUploadProgress: ev => {
            // ev - axios 上传进度实例，上传过程触发多次
            const percent = (ev.loaded / ev.total) * 100;
            // 计算出上传进度，调用组件进度条方法
            e.onProgress({ percent });
        }
    })
        .then(res => {
            let curFile = fileList.value.filter(item => item.uid == e.file.uid)[0]
            let data = res.data
            if(res.data.code == 400) {
                curFile.status = 'error'
                curFile['error'] = data.msg
                console.error(`文件${curFile.name}上传失败：${data.msg}`)
            } else {
                // 通知组件该文件上传成功
                curFile.status = 'done'
                curFile.url = data.data.url  // 原始图片url
                curFile.thumbUrl = data.data.url // 略缩图片url
                // curFile.convertUrl = data.data.convertUrl // 处理后的图片url（传到openai的图片）
                console.log(`图片${curFile.name}上传成功:`, curFile.url, curFile.convertUrl)
            }
        })
        .catch(err => {
            let curFile = fileList.value.filter(item => item.uid == e.file.uid)[0]
            curFile.status = 'error'
            curFile['error'] = '文件传输失败'
            console.log('上传失败', err);
        })
}
// 取消预览
const previewCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
};
// 预览图片
const uploadPreview = async file => {
    if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj);
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
};
// 图像分组显示
const groupedImages = (imageList) => {
    if (imageList == null) {
        return null
    }

    let groupSize = 3 // 每组显示的图片数量
    let groups = []
    for (let i = 0; i < imageList.length; i += groupSize) {
        groups.push(imageList.slice(i, i + groupSize))
    }
    return groups
}


const sse = ref(null) // sse连接
const source = ref()
const isChating = ref(false) // 是否处于chating状态


// 表格列名对象数组
const columns = [
    {
        // 头像
        title: 'avatar',  // 列头显示文字
        className: 'avatar', // 类名
        dataIndex: 'avatar', // slot的代替
        width: 100 // 列宽
    },
    {
        // 对话文本
        title: 'content',  
        className: 'content',
        dataIndex: 'content',
        width: 800,
    },
    {
        title: 'operation',
        className: 'operation',
        dataIndex: 'operation',
        width: 100
    }
]
// 表格数据
let keyCount = 0 //列下标
const tableData = ref([
    // {
    //     key: keyCount, // 下标
    //     avatar: '头像', // 头像
    //     content: '', // 文本内容
    //     imgList: [], // 图像内容
    //     operation: '操作区', // 操作区
    // }
]) 

// 用户更换Chat模型
const handleChatModelChange = () => {
    wid.value = selectedChatModel.value
    // 清空消息文本
    question.value = ''
    fileList.value = []
    // 重新获取历史对话记录
    initTableData()
}

// 获取历史对话记录，初始化表格数据
const initTableData = () => {
    axios.get(`/chatgpt/history?uid=${uid}&wid=${wid.value}&model=${selectedChatModel.value}`)
        .then(res => {
            tableData.value = []
            keyCount = 0
            const historys = res.data.data
            console.log('获取历史记录成功：', historys)

            historys.forEach(history => {
                tableData.value.push({
                    key: keyCount,
                    avatar: '头像',
                    content: history.text,
                    imgList: history.imageUrlList,
                    operation: '操作区'
                })
                keyCount++
            });
            isPreLoading.value = false
        }).catch(err => {
            console.log('获取历史记录失败：' + err)
            isPreLoading.value = false
        })
}
initTableData()

// 发送信息
const sendMessage = () => {
    if (question.value == null || question.value == '') {
        message.error('问题不能为空')
        console.log('问题不能为空')
        return
    }

    if (isChating.value) {
        console.log('正在对话中，暂时无法发送新的对话')
        return
    }

    // 新增问题框
    let questionImgList = []
    fileList.value.forEach(file => questionImgList.push(file.url))
    console.log('questionImgList:', questionImgList)
    tableData.value.push({
        key: keyCount,
        avatar: '头像',
        content: question.value,
        imgList: questionImgList,
        operation: '操作区'
    })
    keyCount++

    // 清空消息文本
    question.value = ''
    fileList.value = []

    // 新增回答框
    tableData.value.push({
        key: keyCount,
        avatar: '头像',
        content: '',
        imgList: [],
        operation: '操作区'
    })
    keyCount++

    // chat
    connectSse()
}


// sse连接
const connectSse = () => {
    if (!window.EventSource) {
        console.log('浏览器不支持SSE')
        return
    }

    // 建立连接
    source.value = new EventSource(`${axios.defaults.baseURL}/chatgpt/createSse/${uid}`, { withCredentials: true })
    // source.value = new EventSourcePolyfill(`${axios.defaults.baseURL}/chatgpt/createSse/${uid}`, {
    //     headers: {
    //         Authorization: 'Bearer aaaAAAA'
    //     }
    // })
    isChating.value = true
    // 连接一旦建立，就会触发open事件
    source.value.onopen = event => {
        console.log('建立SSE连接:', event)
        sse.value = event.target
        let length = tableData.value.length // 对话列表长度

        // 向后端发送问题文本(等sse连接后再发送，否则会出异常)
        axios.post(`/chatgpt/question`, {
            'uid': uid,
            'wid': wid.value,
            'model': selectedChatModel.value,
            'question': tableData.value[length - 2].content, // 当前问题文本
            'imgList': tableData.value[length - 2].imgList, // 当前问题图片列表
        }).then(res => {
            console.log('成功发送请求，res:', res.data.data)
        }).catch(err => {
            console.log('chat失败:', err)
        })
    }
    // 客户端收到服务器发来的数据
    source.value.onmessage = event => {
        let eventData = JSON.parse(event.data)

        if (event.lastEventId == "[DONE]") {
            console.log('完成对话，关闭sse连接')
            sse.value.close()
            isChating.value = false

            return
        }
        
        if (event.lastEventId == "[IMAGES]") {
            // 更新答案框的图像
            let imageUrls = eventData.imageUrlList.substring(1, eventData.imageUrlList.length - 1).split(', ')
            tableData.value[keyCount - 1].imgList = imageUrls

            return
        }

        // 更新答案框的文本
        let content = eventData.content // 返回的文本内容
        // if (content == null || content == 'null') {
        //     return
        // }
        tableData.value[keyCount - 1].content += content
    }
    // 如果发生通信错误（比如连接中断，就会触发error事件）
    source.value.onerror = event => {
        console.log('通信失败:', event)
        console.log('SSE连接异常')
        sse.value.close()
    }
}

// 主动关闭sse连接(停止生成)
const closeSse = () => {
    axios.get(`/chatgpt/closeSse/${uid}`)
        .then(res => {
            console.log('主动关闭sse连接成功：' + res.data)
            sse.value.close()
            isChating.value = false
        }).catch(err => {
            console.log('主动关闭sse连接失败成功:', err)
        })
}

// 重置窗口：清空对话内容
const resetChatWindow = () => {
    if (sse.value) {
        closeSse()
    }

    axios.delete(`/chatgpt/reset?uid=${uid}&wid=${wid.value}&model=${selectedChatModel.value}`)
        .then(res => {
            console.log(res.data.data)
            tableData.value = []
            keyCount = 0
        }).catch(err => {
            console('重置窗口失败：' + err)
        })
}

onBeforeUnmount(() => {
    if (source.value) {
        source.value.close() // 卸载
    }
})
</script>

<style scoped>

.ant-table-chatgpt :deep(.row-question) td {
    /* background-color: rgb(248,250,251)!important; */
    background-color: white!important;
    border: 0!important;
}

.ant-table-chatgpt :deep(.row-question):hover td {
    /* background-color: rgb(248,250,251)!important; */
    background-color: white!important;
    border: 0!important;
}

.ant-table-chatgpt :deep(.row-answer) td {
    background-color: white!important;
    border: 0!important;
}

.ant-table-chatgpt :deep(.row-answer):hover td {
    background-color: white!important;
    border: 0!important;
}

.avatar{
    position: absolute;
    top: 10px;
    right: 2%;
    bottom: auto;
}

.operation{
    position: absolute;
    top: 15px;
    left: 5px;
    right: auto;
    bottom: auto;
}

.fixed-bottom{
    position: absolute;
    top: auto;
    bottom: 1%;
    width: 100%;
}
</style>