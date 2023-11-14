<template>
    <div style="background-color: white;padding: 1%;">
        <a-row :gutter="20" style="min-height:600px;border: 1px rgb(240,240,240) s solid;">
            <a-col :span="18">
                <a-row>
                    <a-col :span="24">
                        <a-textarea
                            v-model:value="textContent"
                            placeholder="请输入语音合成内容"
                            allow-clear
                            showCount
                            :maxlength="20000"
                            :auto-size="{ minRows: 8, maxRows: 8 }"
                        />
                    </a-col>
                </a-row>
                <br>

                <a-row style="font-size: 1.2em;font-weight: bold;">
                    <a-col :span="8">文件</a-col>
                    <a-col :span="16">播放</a-col>
                </a-row>

                <a-divider/>

                <a-row :gutter="10" v-for="voiceFile in syntheticVoiceList" :key="voiceFile.uid" style="display: flex;align-items: center;">
                    <a-col :span="8">
                        <a-upload
                        :file-list="[voiceFile]"
                        list-type="picture"
                        @remove="removeFile"
                        >
                        </a-upload>
                    </a-col>
                    <a-col :span="16">
                        <audio style="width: 80%;" :src="voiceFile.url" controls="controls"></audio>
                        <!-- <audio-player :audio-list="[voiceFile.url]" :before-play="handleBeforePlay" theme-color="grey" cocontinuation="false"  /> -->
                    </a-col>
                </a-row>
            </a-col>

            <a-col :span="6" style="text-align: left;border: 1px rgb(240,240,240) solid;">
                <p style="font-size: 1.2em;"><SettingFilled />&nbsp;&nbsp;语音合成设置</p>
                <a-divider/>
                <p>语言</p>
                <a-select v-model:value="language" style="width: 95%;text-align: left;">
                    <a-select-option v-for="languageItem in languageList" :value="languageItem" :key="languageItem">{{ languageItem }}</a-select-option>
                </a-select>

                <p>人物性别</p>
                <a-select v-model:value="gender" style="width: 95%;text-align: left;">
                    <a-select-option value="Male">男</a-select-option>
                    <a-select-option value="Female">女</a-select-option>
                </a-select>

                <p>语音角色</p>
                <a-select v-model:value="voiceRole" style="width: 95%;text-align: left;">
                    <a-select-option v-for="voiceRoleItem in voiceRoleList" :value="voiceRoleItem" :key="voiceRoleItem">{{ voiceRoleItem }}</a-select-option>
                </a-select>

                <a-button @click="synthesizeVoice" type="primary" style="margin-top: 5%;">开始转换</a-button>
            </a-col>
        </a-row>

        <!-- <a-row :gutter="20" style="border: 1px rgb(240,240,240) s solid;">
            <a-col :span="24">
                播放器
            </a-col>
        </a-row> -->
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { message } from 'ant-design-vue'; 
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

const textContent = ref('长沙的春天是一个鲜花盛开、绿意盎然的季节。随着冬天的离去，春天的阳光温暖而明媚，给人一种焕发生机的感觉。整个城市弥漫着樱花、桃花和杜鹃花的芬芳香气，街道两旁的树木披上嫩绿的新叶，湖泊和河流水面波光粼粼。人们纷纷走出家门，享受春日的美好。公园里，孩子们放飞风筝，家人们野餐聚会，年轻人们漫步在湖畔。长沙的春天是一个充满活力和希望的季节，让人心情愉悦，仿佛一切都充满了可能性。')  // 文本框内容（语音合成内容）
const languageList = ref([]) // 可选语言列表
const language = ref('中文（普通话，简体）') // 语言
const gender = ref('Male') // 角色性别
const voiceRole = ref('') // 语音角色
const voiceRoleList = ref([]) // 语音角色列表
const syntheticVoiceList = ref([]) // 合成语音列表 {uid、name、status、url、response}

// 获取语言列表
const getLanguagesApi = () => {
    axios.get(`/tts/languages`)
        .then(res => {
            languageList.value = res.data.data
        }).catch(err => {
            console.log('获取语言列表失败：' + err)
        })
}
getLanguagesApi()

// 通过语言和人物性别获取角色列表
const getVoiceRolesByLanguageApi = () => {
    axios.get(`/tts/roles/${language.value}/${gender.value}`)
        .then(res => {
            voiceRoleList.value = res.data.data
            voiceRole.value = voiceRoleList.value[0]
        }).catch(err => {
            console.log('获取角色列表失败：' + err)
        })
}
getVoiceRolesByLanguageApi()

// 更新角色列表
watch(language, () => {
    getVoiceRolesByLanguageApi()
})

watch(gender, () => {
    getVoiceRolesByLanguageApi()
})

// 合成语音
const synthesizeVoice = () => {
    // 检测文本内容是否为空
    if (textContent.value == '' || textContent.value == null) {
        message.info('文本内容不能为空',5)
        return
    }

    axios.post(`/tts/voice`, {
        'text': textContent.value,
        'voiceRole': voiceRole.value
    }).then(res => {
        // 获取合成语音的url地址
        let curFile = {
            uid: 'voice-' + uuidv4(),
            name: 'voice-' + uuidv4() + '.mp3',
            status: 'done',
            url: res.data.data,
            thumbUrl: res.data.data
        }
        syntheticVoiceList.value.push(curFile)
        console.log('合成语音url:' + res.data.data)
        console.log(syntheticVoiceList.value)
    }).catch(err => {
        console.log('合成语音失败:' + err)
    })
}

// 下载文件
const downloadFile = (url, name) => {
    const fileUrl = url; // 替换为实际的文件 URL

    // 创建一个隐藏的 <a> 元素用于下载
    const downloadLink = document.createElement('a');
    downloadLink.href = fileUrl;
    downloadLink.target = '_blank'; // 在新窗口/标签中打开下载链接
    downloadLink.download = name; // 设置下载的文件名

    // 将 <a> 元素添加到文档中
    document.body.appendChild(downloadLink);

    // 触发点击事件以开始下载
    downloadLink.click();

    // 下载完成后移除 <a> 元素
    document.body.removeChild(downloadLink);
}

// 移除语音
const removeFile = (file) => {
    syntheticVoiceList.value = syntheticVoiceList.value.filter(item => item.uid != file.uid)
}

// 音频播放前
const handleBeforePlay = (next) => {
    next()
}


</script>

<style>
/* .audio__play-prev {
    display: none !important;
}

.audio__play-next {
    display: none !important;
} */
</style>