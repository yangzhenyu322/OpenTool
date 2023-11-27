<template>
    <div style="height: calc(100vh - 90px);background-color: white;padding: 1%;">
        <a-row :gutter="15">
            <a-col :span="8" style="text-align: left;">
                <p style="font-size: 1.2em;font-weight: bold;">选择音频文件</p>

                <a-upload-dragger
                    v-model:file-list="fileList"
                    name="file"
                    :showUploadList="false"
                    :before-upload="beforeUpload"
                    :customRequest="customUpload"
                    style="display:block;"
                >
                    <!-- a-upload-dragger自带上下padding一共32px -->
                    <div style="height:275px;" class="vertical-center">
                        <p><CloudUploadOutlined style="font-size: 1.4em;" />&nbsp;&nbsp;<span style="font-size: 1.2em;color: rgb(24,144,255);">浏览文件</span></p>
                        <p>或将音频文件拖放到此处</p>
                        <SpeechRecorderVue :fileList="fileList" />
                    </div>
                </a-upload-dragger>

                <div style="height: 500px;border: 1px solid gray;padding: 1%;border-radius: 5px;margin-top:20px">
                    <a-row style="font-size: 1.2em;font-weight: bold;">
                        <a-col :span="12" style="font-size: 1em;text-align: left;">
                            <span>音频文件</span>
                        </a-col>
                        <a-col :span="12" style="font-size: 1em;text-align: right;padding-right: 3%;">
                            <a-tooltip placement="top">
                                <template #title>
                                    清空列表
                                </template>
                                <a @click="deleteAllFile" style="color: rgb(236, 81, 81);"><ClearOutlined /></a>
                            </a-tooltip>
                        </a-col>
                    </a-row>

                    <a-divider style="margin-top: 2%;margin-bottom: 1%;" />

                    <el-scrollbar style="height: 460px;">
                        <a-menu
                            v-model:selectedKeys="itemKeys"
                            theme="light"
                            mode="inline"
                        >
                            <a-menu-item v-for="file in fileList" :key="file.uid">
                                <a-row v-if="file.status == 'done'" style="font-size: 1.3em;">
                                    <a-col :span="2" style="font-size: 1em;color: rgb(87,163,0);"><CheckCircleFilled /></a-col>
                                    <a-col :span="16" style="font-size: 1em;">
                                        <span>{{ file.name }}</span>
                                    </a-col>
                                    <a-col :span="2" style="font-size: 1em">
                                        <a-tooltip v-if="isStting && selectedFile.uid == file.uid"  placement="top">
                                            <template #title>
                                                正在识别中，切换音频会自动中断
                                            </template>
                                            <InfoCircleOutlined style="color:red" />
                                        </a-tooltip>
                                    </a-col>
                                    <a-col :span="2" style="font-size: 1em;">
                                        <div v-if="selectedFile.uid === file.uid">
                                            <a-tooltip v-if="!isStting" placement="top">
                                                <template #title>
                                                    识别
                                                </template>
                                                <a @click="speechRecognition()"><InteractionTwoTone /></a>
                                            </a-tooltip>
                                            <a-spin v-else />
                                        </div>
                                    </a-col>
                                    <a-col :span="2" style="font-size: 1em;">
                                        <a-tooltip placement="top">
                                            <template #title>
                                                删除
                                            </template>
                                            <a @click="deleteFile(file.uid)" style="color: rgb(237, 101, 101);"><RestOutlined /></a>
                                        </a-tooltip>
                                    </a-col>
                                </a-row>
                            </a-menu-item>
                        </a-menu>
                    </el-scrollbar>
                </div>
            </a-col>

            <a-col :span="16">
                <p style="font-size: 1.2em;font-weight: bold;text-align: left;">语音识别结果</p>
                <div style="height: 827px;border: 1px solid gray;">
                    <!-- 音频文件信息 -->
                    <div style="height:80px;text-align: left;font-size: 1.2em;padding:1%;">
                        <a-row style="font-size: 1em;">
                            <a-col :span="8" style="font-size: 1em;">
                                文件名：
                                <span v-if="selectedFile.uid" style="font-weight: 500;">{{ selectedFile.name }}</span>
                                <span v-else>--</span>
                            </a-col>
                            <a-col :span="10" style="font-size: 1em;">
                                语言：
                                <a-select
                                    v-if="selectedFile.uid"
                                    v-model:value="targetLanguage"
                                    size="small"
                                    style="width:220px;text-align: left;"
                                >
                                    <a-select-option v-for="supportedLanguage in supportedLanguageList" :key="supportedLanguage.language" :value="supportedLanguage.language">{{ supportedLanguage.language }}</a-select-option>
                                </a-select> 
                                <span v-else>--</span> 
                            </a-col>
                            <a-col :span="6" style="font-size: 1em;">
                                输出格式：
                                <span v-if="selectedFile.uid" style="font-weight: 500;">普通文本</span>
                                <span v-else>--</span>
                            </a-col>
                        </a-row>
                        <a-row style="font-size: 1em;">
                            <a-col :span="8" style="font-size: 1em;">
                                自定义终结点：
                                <span v-if="selectedFile.uid" style="font-weight: 500;">[无]</span>
                                <span v-else>--</span>
                            </a-col>
                            <a-col :span="8" style="font-size: 1em;">
                                短语列表：
                                <span v-if="selectedFile.uid" style="font-weight: 500;">关</span>
                                <span v-else>--</span>
                            </a-col>
                        </a-row>
                    </div>

                    <div>
                        <!-- 额外控件 -->
                        <a-select
                            v-if="isInitPlayer"
                            v-model:value="analyzeMode"
                            size="small"
                            style="width: 110px;text-align: left;display: block;margin-left: auto;margin-right: 1%;"
                        >
                            <a-select-option value="bars">bars</a-select-option>
                            <a-select-option value="waves">waves</a-select-option>
                            <a-select-option value="lightning">lightning</a-select-option>
                            <a-select-option value="vertLines">vertLines</a-select-option>
                            <a-select-option value="doubleLine">doubleLine</a-select-option>
                            <a-select-option value="doubleBars">doubleBars</a-select-option>
                        </a-select>

                        <!-- 音乐播放器 -->
                        <div id="music-player" style="height: 150px;">
                            <canvas id="music-canvas" style="width: 100%;height: 100%;"></canvas>
                        </div>
                    </div>

                    <a-tabs
                        v-model:activeKey="textTabKey"
                        style="height:597px;padding: 20px;"
                    >
                        <a-tab-pane key="1" tab="普通文本" style="text-align: left;white-space: pre-wrap;">
                            <a-textarea
                                v-model:value="commonTextContent"
                                placeholder="普通文本"
                                style="height:470px;font-size:1.2em;"
                            />
                        </a-tab-pane>
                        <a-tab-pane key="2" tab="详细文本" style="text-align: left;white-space: pre-wrap;">
                            <a-textarea
                                v-model:value="detailedTextContent"
                                placeholder="详细文本"
                                style="height:470px;font-size:1.2em;"
                            />
                        </a-tab-pane>
                        <a-tab-pane key="3" tab="对话文本" style="text-align: left;white-space: pre-wrap;">
                            <a-textarea
                                v-model:value="talkTextContent"
                                placeholder="对话文本"
                                style="height:470px;font-size:1.2em;"
                            />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { message } from 'ant-design-vue'
import { uploadApi } from '@/utils/file/FileUtil.js'
import Player from 'xgplayer'
import 'xgplayer/dist/index.min.css'
import 'xgplayer/dist/index.min.js'
import 'xgplayer-music/dist/index.min.js'
import  MusicPreset, { Analyze }  from 'xgplayer-music'
import axios from 'axios'
import SpeechRecorderVue from './recorder/SpeechRecorder.vue'

const fileList = ref([]) // {uid、name、status、url、thumbUrl、textTimeStamps(文本时间戳，数组)、textRoles(对话人，数组)、transcribedContents(语音识别文本内容，数组)、transcribingContent(正在识别的文本内容，String)、error}
const textTabKey = ref('1') // 文本tab激活key
const itemKeys = ref([]) // 菜单项激活keys
const selectedFile = ref({}) // 当前选中的file文件

// 文件上传预处理(后续补充处理)
const beforeUpload = file => {
    // 这里可以进行文件类型、大小等校验，返回 false 可取消上传
    if(file.size > 100 * 1024 * 1024) {  // 最大文件支持100MB
        file.status = 'error'
        file['error'] = '文件超出最大限制1000M'
        return false;
    }
    return true;
}

// 自定义文件上传公共函数
const customUpload = e => {
    let curFile = fileList.value.filter(item => item.uid == e.file.uid)[0]
    curFile.status = 'uploading'
    uploadApi({
        file: e.file,
        route: '/stt/upload',
        onUploadProgress: ev => {
            const percent = (ev.loaded / ev.total) * 100;
            e.onProgress({ percent })
        }
    }).then(res => {
        let curFile = fileList.value.filter(item => item.uid == e.file.uid)[0]
        if(res.data.code == 400) {
            curFile.status = 'error'
            curFile['error'] = res.data.message
            console.error(`文件${curFile.name}上传失败：${res.data.msg}`)
        } else {
            // 通知组件该文件上传成功
            curFile.status = 'done'
            curFile.url = res.data.data
            curFile.thumbUrl = res.data.data
            curFile.textTimeStamps = []
            curFile.textRoles = []
            curFile.transcribedContents = []
            curFile.transcribingContent = ''
            console.log(`文件${curFile.name}上传成功:`, curFile.url)
            console.log('uid:' + curFile.uid)
        }
    }).catch(err => {
        let curFile = fileList.value.filter(item => item.uid == e.file.uid)[0]
        curFile.status = 'error'
        curFile['error'] = '文件传输失败'
        console.log('上传失败', err);
    })
}

// 删除指定uid文件
const deleteFile = (uid) => {
    // 删除前检测是否在进行语音识别
    if (isStting.value) {
        // 主动关闭SSE连接，结束语音识别
        closeSse()
    }
    fileList.value = fileList.value.filter(item => item.uid != uid)

    if (fileList.value.length == 0) {
        selectedFile.value = {}
    } else {
        selectedFile.value = fileList.value[0]
    }
}

// 删除所有文件
const deleteAllFile = () => {
    // 删除前检测是否在进行语音识别
    if (isStting.value) {
        // 主动关闭SSE连接，结束语音识别
        closeSse()
    }
    fileList.value = []
    selectedFile.value = {}
}

// 监视菜单项选中的文件
watch(itemKeys, (newVal, oldVal)=>{
    // 切换前检测是否在进行语音识别
    if (isStting.value) {
        // 主动关闭SSE连接，结束语音识别
        closeSse()
    }

    selectedFile.value = fileList.value.filter(item => item.uid == newVal[0])[0]
    // 切换为当前文件的音频识别文本内容
    updateTempContents()

    console.log('selectedFile:')
    console.log(JSON.stringify(selectedFile.value))
    // 更新音乐播放清单
    if (oldVal.length == 0) {
        console.log('初始化音乐播放器')
        initMusicPlayer(selectedFile.value.url)
    } else {
        console.log('切歌')
        switchMusicUrl(selectedFile.value.url)
    }
})

// Music Player配置
let player = null
let musicPlayerConfig = null
let an = null
const analyzeMode = ref('bars')
const isInitPlayer = ref(false)
const initMusicPlayer = (urlPath) => {
    // 需要等url资源上传到oss传入到Player中
    musicPlayerConfig = {
        id: 'music-player',
        mediaType: 'audio',
        volume: 0.5,
        width: '100%',
        height: 150,
        // 音乐播放控制模块配置
        url: urlPath,
        autoplayMuted: false, // 自动静音播放
        autoplay: true, // 自动播放
        preset: ['default', MusicPreset], // 如果要同时使用默认preset，那么配置是['default', MusicPreset]
        // plugins: [Mp4Plugin],
        // 可用插件：https://h5player.bytedance.com/plugins/#%E6%B3%A8%E5%86%8C%E6%8F%92%E4%BB%B6
        ignores: ['start','poster', 'replay'], //'start', 'fullscreen', 'cssfullscreen'
        controls: {
            initShow: true,
            mode: 'flex'
        },
        marginControls: true,
        videoConfig: {
            crossOrigin: "anonymous"  // 允许跨域
        },
        // download: true, // 是否启用下载按钮
    }
    // 音乐播放器
    player = new Player(musicPlayerConfig)

    // 初始化频谱
    an = new Analyze(player, document.querySelector('#music-canvas'), {
        bgColor: 'rgba(0, 0, 0, 0.6)',
        mode: 'bars', // 可选：bars、waves、lightning、vertLines、doubleLine、doubleBars
        size: 256,
        stroke: 2
    })

    // 初始化完成
    isInitPlayer.value = true
}

// 切换播放url源头
const switchMusicUrl = (urlPath) => {
    player.switchURL(urlPath)
    player.start()
    player.play()
}

// 切换频谱样式
watch(analyzeMode, (newVal) => {
    if (an) {
        an.mode = newVal
        switch (newVal) {
            case 'bars':
                an.size = 256
                an.stroke = 2
                break
            case 'waves':
                an.size = 256
                an.stroke = 3
                break
            case 'lightning':
                an.size = 512
                an.stroke = 4
                break
            case 'vertLines':
                an.size = 256
                an.stroke = 2
                break
            case 'doubleLine':
                an.size = 256
                an.stroke = 2
                break
            case 'doubleBars':
                an.size = 256
                an.stroke = 2
                break
            default:
                break
        }
    }
})

// 音频识别（speech recognition）
const uid = 'zensheep' + '-sst' // 用户id
const sse = ref(null) // sse连接
const source = ref(null) // sse连接源
const commonTextContent = ref('') // 普通文本
const detailedTextContent = ref('') // 详细文本
const talkTextContent = ref('') // 对话文本
const isStting = ref(false) // 是否正在进行语音识别
// 音频识别配置
const targetLanguage = ref('中文（普通话，简体）');
const supportedLanguageList = ref([])

// 获取sst支持的语言列表
const getSttSupportedLanguages = () => {
    axios.get('/stt/languages')
        .then(res => {
            supportedLanguageList.value = res.data.data
        }).catch(err => {
            console.log('获取sst支持的语言列表失败', err)
        })
}
getSttSupportedLanguages()

// 普通文本
const computedCommenTextContent = () => {
    commonTextContent.value = ''
    // 已完成识别语句合并
    selectedFile.value.transcribedContents.forEach(content => {
        commonTextContent.value += content
    })
    // 加上正在识别的语句
    commonTextContent.value += selectedFile.value.transcribingContent
}

// 详细文本
const computedDetailedTextContent = () => {
    detailedTextContent.value = ''
    let length = selectedFile.value.textTimeStamps.length
    for (var i = 0; i < length; i++) {
        detailedTextContent.value += selectedFile.value.textTimeStamps[i] + ' ' + selectedFile.value.transcribedContents[i] + '\n'
    }
    detailedTextContent.value += selectedFile.value.transcribingContent
}

// 对话文本
const computedTalkTextContent = () => {
    talkTextContent.value = ''
    let length = selectedFile.value.textTimeStamps.length
    for (var i = 0; i < length; i++) {
        talkTextContent.value += selectedFile.value.textTimeStamps[i] + ' ' + selectedFile.value.textRoles[i] + ':' + selectedFile.value.transcribedContents[i] + '\n'
    }
    talkTextContent.value += selectedFile.value.transcribingContent
}

const updateTempContents = () => {
    computedCommenTextContent()
    computedDetailedTextContent()
    computedTalkTextContent()
}

// 音频识别
const speechRecognition = () => {
    // 检查是否要重新识别处理
    console.log('selectedFile.value:', selectedFile.value)
    console.log('selectedFile.value.textTimeStamps.length:', selectedFile.value.textTimeStamps.length)
    if ((selectedFile.value.textTimeStamps.length != 0) || (selectedFile.value.transcribingContent != '')) {
        // 清空已识别的文本
        selectedFile.value.textTimeStamps = []
        selectedFile.value.textRoles = []
        selectedFile.value.transcribedContents = []
        selectedFile.value.transcribingContent = ''
        // 更新临时变量文本
        updateTempContents()
    }
    
    // 判断目标文件是否为空
    if (Object.keys(selectedFile.value).length == 0) {
        message.error('目标文件不能为空')
        console.log('目标文件不能为空')
        return
    }

    connectSse()
}

// 创建SSE连接
const connectSse = () => {
    if (!window.EventSource) {
        console.log('浏览器不支持SSE')
        return
    }

    if (sse.value) {
        sse.value.close()
    }

    // 建立连接
    source.value = new EventSource(`${axios.defaults.baseURL}/stt/createSse/${uid}`)
    // 连接一旦建立，就会触发open时间
    source.value.onopen = event => {
        console.log('建立SSE连接:', event)
        sse.value = event.target
        isStting.value = true
        // 根据targetLanguage找到locate
        let locate = supportedLanguageList.value.filter(item => item.language == targetLanguage.value)[0].locate
        
        // 向后端发送问题文本
        axios.post(`/stt/speechRecognition`, {
            'uid': uid,
            'urlPath': selectedFile.value.url,
            'targetLanguage': locate,
        }).then(res => {
            console.log('成功发送请求，res:', res.data.data)
        }).catch(err => {
            console.log('发送请求失败:', err)
        })
    }
    // 客户端收到服务器发来的数据
    source.value.onmessage = event => {
        let eventData = JSON.parse(event.data)
        if (event.lastEventId === '[canceled]') {
            console.log('【canceled】：', eventData.canceled)
            console.log('完成对话，关闭sse连接')
            sse.value.close()
            isStting.value = false

            return
        }

        if (event.lastEventId === '[transcribing]') {
            // 正在识别的当前语句
            // console.log('[transcribing]:', eventData.textContent)
            selectedFile.value.transcribingContent = eventData.textContent
            // 更新临时文本内容
            updateTempContents()

            return
        }

        // 完成当前语句识别
        if (eventData.textContent) {
            let timestamp = eventData.timestamp
            let role = eventData.role
            let textContent = eventData.textContent
            console.log('【transcribed】当前语句:', timestamp, '-', role, ':', textContent)

            selectedFile.value.textTimeStamps.push(timestamp)
            selectedFile.value.textRoles.push(role)
            selectedFile.value.transcribedContents.push(textContent)
            // 更新临时文本内容：清空正在识别语句，更新common文本
            selectedFile.value.transcribingContent = ''
            updateTempContents()
            // 更新File对应的文本内容
            fileList
        }
    }

    // 如果发生通信错误
    source.value.onerror = event => {
        console.log('通信失败:', event)
        console.log('SSE连接异常')
        sse.value.close()
        isStting.value = false
    }
}

// 主动关闭SSE连接，结束语音识别
const closeSse = () => {
    axios.get(`/stt/closeSse/${uid}`)
        .then(res => {
            console.log('主动关闭sse连接成功：', res.data.data)
            sse.value.close()
            isStting.value = false
        }).catch(err => {
            console.log('主动关闭sse连接失败成功:', err)
        })
}

onBeforeUnmount(() => {
    if (source.value) {
        source.value.close() // 卸载
    }
})
</script>