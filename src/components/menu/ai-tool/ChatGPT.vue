<template>
    <div style="background-color: white;">
        <!-- 表头 -->
        <div class="item-center" style="height: 50px;border-bottom: 2px solid rgb(250,250,250)" >
            <span style="font-size: 1.3em;font-weight: 400;">Default(GPT-3.5-turbo)</span>
        </div>
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
                        <span :id="uid + '-' + index">{{ record.content }}</span>
                    </div>
                    <!-- 回答框 -->
                    <div v-else>
                        <ChatMarkDown :id="uid + '-' + index" :content="record.content"/>
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
        <!-- 表尾 -->
        <div style="height: 60vh;"></div>

        <!-- 底部输入框 -->
        <div class="fixed-bottom item-center">
            <a-textarea
            v-model:value="question"
            placeholder="Send a message"
            :auto-size="{ minRows: 1, maxRows: 9}"
            style="width: 60%;"
            allow-clear
            @keydown.enter="sendMessage"
            >
            </a-textarea>

            <a-button @click="sendMessage" :disabled="isChating || question == null || question == ''" style="margin-left: 2px;">
                <!-- <a-spin v-if="isChating" :indicator="loadIcon"/> -->
                <SyncOutlined v-if="isChating" spin style="color: rgb(24,144,255);" />
                <RocketFilled v-else />
            </a-button>
            <a-button v-if="isChating" @click="closeSse" danger style="margin-left: 2px;">
                Stop
            </a-button>
        </div>
    </div>
</template>

<script setup>
import { onBeforeUnmount, ref, h } from "vue";
import { LoadingOutlined } from '@ant-design/icons-vue'
import axios from "axios";
import ChatMarkDown from "./chatgpt-markdown/ChatMarkDown.vue";
import gptUrl from '@/assets/images/avatar/chatgpt.png'
import { copyDomText } from '@/utils//common.js'

// gpt头像
const gptAvatarUrl = ref(gptUrl)

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
])

// 随机生成字符串
const generateRandomStr = (length) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) { 
        result += characters.charAt(Math.floor(Math.random() * charactersLength)); 
    } 
    return result
}

// const uid = window.localStorage.getItem("uid")
let uid = 'zensheep-' + generateRandomStr(10) // 用户id
const question = ref('') // 问题文本
const sse = ref(null) // sse连接
const source = ref()
const isChating = ref(false) // 是否处于chating状态

// 发送信息
const sendMessage = () => {
    if (question.value == null || question.value == '') {
        console.log('问题不能为空')
        return
    }

    if (isChating.value) {
        console.log('已存在sse，不能重复创建')
        return
    }

    // 随机生成uid
    // uid = 'zensheep-' + generateRandomStr(10)
    // 新增问题框
    tableData.value.push({
        key: keyCount,
        avatar: '头像',
        content: question.value,
        operation: '操作区'
    })
    keyCount++
    // 清空消息文本
    question.value = ''

    // 新增回答框
    tableData.value.push({
        key: keyCount,
        avatar: '头像',
        content: '',
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
    source.value = new EventSource(`${axios.defaults.baseURL}/chat/createSse/${uid}`)
    // 连接一旦建立，就会触发open事件
    source.value.onopen = event => {
        console.log('建立SSE连接', event)
        sse.value = event.target

        let length = tableData.value.length // 对话列表长度

        // 向后端发送问题文本(等sse连接后再发送，否则会出异常)
        axios.post(`/chat/msg/${uid}`, {
            'msg': tableData.value[length - 2].content, // 当前问题文本
        }).then(res => {
            console.log('res:' + JSON.stringify(res))
            isChating.value = true
        }).catch(err => {
            console.log('chat失败:' + err)
        })
    }
    // 客户端收到服务器发来的数据
    source.value.onmessage = event => {
        console.log(event)
        console.log(event.data)
        console.log(event.lastEventId)
        if (event.lastEventId == "[TOKENS]") {
            console.log('tokens:' + JSON.parse(event.data).tokens)
            return;
        }
        if (event.lastEventId == "[DONE]") {
            if (sse.value) {
                // 关闭sse
                console.log('完成对话，关闭sse连接')
                sse.value.close()
                isChating.value = false
            }
            return;
        }
        let content = JSON.parse(event.data).content // 返回的文本内容
        if (content == null || content == 'null') {
            return
        }
        console.log('content:' + JSON.parse(event.data).content)
        // 更新答案框文本
        tableData.value[keyCount - 1].content += content
    }
    // 如果发生通信错误（比如连接中断，就会触发error事件）
    source.value.onerror = event => {
        console.log('通信失败:' + event)
        sse.value.close()
        isChating.value = false
    }
}

// 主动关闭sse连接(停止生成)
const closeSse = () => {
    axios.get(`/chat/closeSse/${uid}`)
        .then( res => {
            console.log('关闭sse连接：' + res)
            sse.value.close()
            isChating.value = false
        }).catch(err => {
            console.log('关闭sse连接失败:' + err)
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
    background-color: rgb(246, 246, 249)!important;
}

.ant-table-chatgpt :deep(.row-question):hover td {
    background-color: rgb(246, 246, 249)!important;
    border-radius: 0!important;
}

.ant-table-chatgpt :deep(.row-answer) td {
    background-color: white!important;
}

.ant-table-chatgpt :deep(.row-answer):hover td {
    background-color: white!important;
    border-radius: 0!important;
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
    bottom: 0;
    left: 0;
    width: 100%;
    display: flex;
    z-index: 10000;
}
</style>