<template>
    <!-- 麦克风音频录制 -->
    <div class="vertical-center">
        <!-- 麦克风 -->
        <div v-if="!isRecordering" class="horizontal-center" style="width:60px;height:60px;background-color:rgb(209,225,237);border-radius:50%;">
            <a-button @click.stop="openRecorder" type="primary" shape="circle" size="large" :loading="isOpening">
                <template #icon><AudioFilled /></template>
            </a-button>
        </div>
        <div v-else class="horizontal-center" style="width:60px;height:60px;background-color:rgb(237,208,208);border-radius:50%;">
            <a-button @click.stop="closeRecorder" type="primary" shape="circle" size="large" style="background-color:red;">
                <BorderOutlined style="background-color:white;" />
            </a-button>
        </div>
        <p>使用麦克风录制音频</p>
        <!-- 波形绘制区域 -->
        <div style="height: 50px; width: 150px;" ref="recwave"></div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Recorder from 'recorder-core'
// 引入mp3格式支持文件，如果需要多个格式支持，把这些格式的编码引擎js文件放到后面统统引入进来即可
import 'recorder-core/src/engine/mp3';
import 'recorder-core/src/engine/mp3-engine'
// 录制wav格式的引入这个文件就行
import 'recorder-core/src/engine/wav'
// 可选的插件支持项，这个是波形可视化插件
import 'recorder-core/src/extensions/waveview'
import axios from 'axios'
import { generateRandomStr } from '@/utils/common.js'

const props = defineProps({
    fileList: Array,
})

let rec
let wave
const recwave = ref(null)
const isOpening = ref(false)
const isRecordering = ref(false)
let recorderCount = 0
let recorderFileName = '录音'
let recorderFileType = 'mp3'
// 打开麦克风
const openRecorder = () => {
    isOpening.value = true
    // 创建录音对象
    rec = Recorder({
        type: recorderFileType, // 录音格式，可以换成wav等其它格式
        sampleRate: 16000, // 录音的采样率，越大细节越丰富越细腻
        bitRate: 16, // 录音的比特率，越大音质越好
        onProcess: (
            buffers,
            powerLevel,
            bufferDuration,
            bufferSampleRate,
        ) => {
            // 录音实时回调，大约1s调用12次本回调
            // 可实时绘制波形，实时上传（发送数据）
            if (wave) {
                wave.input(buffers[buffers.length - 1], powerLevel, bufferSampleRate)
            }
        },
    })
    if (!rec) {
        alert('当前浏览器不支持录音功能！')
        return;
    }
    // 打开录音，获得权限
    rec.open(
        () => {
            console.log('录音已打开')
            isOpening.value = false

            if (recwave.value) {  // recwave?
                // 创建音频可视化图像绘制对象
                wave = Recorder.WaveView({ elem: recwave.value })
            }
            // 开始录音
            if (!rec) {
                console.error('未打开录音')
                return
            }
            rec.start()
            console.log('已开始录音')
            isRecordering.value = true
        },
        (msg, isUserNotAllow) => {
            // 用户拒绝了录音权限，或者浏览器不支持录音
            console.log((isUserNotAllow ? 'UserNotAllow,' : ''), '无法录音：', msg)
            isOpening.value = false
        }
    )
}

// 关闭麦克风
const closeRecorder = () => {
    if (!rec) {
        console.error('未打开录音')
        return
    }
    rec.stop(
        (blob, duration) => {
            // blob就是我们要的录音对象，可以上传，或者本地播放
            // 简单利用URL生成本地文件地址，此地址只能本地使用，比如赋值给audio.src进行播放，赋值给a.href然后a.click()进行下载
            // const localUrl = (window.URL || window.webkitURL).createObjectURL(blob)
            // console.log('localUrl:', localUrl)
            console.log('录音成功: ', blob, '时长：', duration, 'ms')

            let fileName = recorderFileName + recorderCount + '.' + recorderFileType
            recorderCount++
            // 把blob文件上传到服务器
            const formData = new FormData()
            formData.append('file', blob, fileName)
            axios.post('/stt/upload', formData, {headers:{
                'Content-type': 'multipart/form-data',
                }
            }).then(res => {
                let fileName = recorderFileName + (recorderCount - 1) + '.' + recorderFileType
                // 将文件名和文件url传给父组件
                let file = {
                    uid: generateRandomStr(10),
                    name: fileName,
                    status: 'done',
                    url: res.data.data,
                    thumbUrl: res.data.data,
                    textTimeStamps: [],
                    textRoles: [],
                    transcribedContents: [],
                    transcribingContent: ''
                }
                console.log(`文件${fileName}上传成功:`, res.data.data)
                console.log('uid:' + file.uid)

                // eslint-disable-next-line vue/no-mutating-props
                props.fileList.push(file)
            }).catch(err => {
                console.log('上传失败', err)
            })
            // 关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
            rec.close() 
            rec = null
            isRecordering.value = false
        }
    )
}

</script>