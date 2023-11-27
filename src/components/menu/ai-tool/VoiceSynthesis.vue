<template>
    <div style="height: calc(100vh - 90px);background-color: white;padding: 1%;">
        <a-row :gutter="20" style="border: 1px rgb(240,240,240) s solid;">
            <a-col :span="18">
                <a-row>
                    <a-col :span="24">
                        <a-textarea
                            v-model:value="textContent"
                            placeholder="请输入语音合成内容"
                            allow-clear
                            showCount
                            size="large"
                            :maxlength="20000"
                            :auto-size="{ minRows: 14, maxRows: 14 }"
                        />
                    </a-col>
                </a-row>
                <br>

                <a-row style="font-size: 1.2em;font-weight: bold;">
                    <a-col :span="8">文件</a-col>
                    <a-col :span="14">播放</a-col>
                    <a-col :span="2">下载</a-col>
                </a-row>

                <a-divider/>

                <el-scrollbar style="height:calc(100vh - 600px);">
                    <a-row  v-for="voiceFile in syntheticVoiceList" :key="voiceFile.uid" style="display: flex;align-items: center;">
                        <a-col :span="8">
                            <a-upload
                            :file-list="[voiceFile]"
                            list-type="picture"
                            @remove="removeFile"
                            >
                            </a-upload>
                        </a-col>
                        <a-col :span="14">
                            <audio
                                preload="auto" 
                                :src="voiceFile.url" 
                                controls="controls" 
                                style="width: 80%;" 
                            ></audio>
                        </a-col>
                        <a-col :span="2">
                            <a-button type="link" size="large" shape="circle" @click="downloadMp3(voiceFile.url)">
                                <template #icon>
                                    <DownloadOutlined />
                                </template>
                            </a-button>
                        </a-col>
                    </a-row>
                </el-scrollbar>
            </a-col>

            <a-col :span="6" style="text-align: left;border: 1px rgb(240,240,240) solid;">
                <p style="font-size: 1.2em;"><SettingFilled />&nbsp;&nbsp;语音合成设置</p>
                <a-divider/>

                <a-collapse v-model:activeKey="styleActiveKey">
                    <a-collapse-panel key="1" header="必选配置">
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
                    </a-collapse-panel>

                    <a-collapse-panel key="2" header="可选配置">
                        <p>风格类型</p>
                        <a-select
                            v-model:value="voiceStyle" 
                            style="width: 95%;text-align: left;"
                        >
                            <a-select-option v-for="voiceStyleItem in voiceStyleList" :key="voiceStyleItem.styleId" :value="voiceStyleItem.name" :title="voiceStyleItem.description">
                                {{ voiceStyleItem.name }}【{{ voiceStyleItem.description }}】
                            </a-select-option>
                        </a-select>

                        <div v-if="voiceStyle != 'default'">
                            <p>风格类型强度（柔和->阳刚）</p>
                            <a-row :gutter="15">
                                <a-col :span="15">
                                    <a-slider v-model:value="voiceStyleDegree" :min="0.01" :max="2" :step="0.01" />
                                </a-col>
                                <a-col :span="4">
                                    <a-input-number
                                        v-model:value="voiceStyleDegree"
                                        :min="0.01"
                                        :max="2"
                                        :step="0.01"
                                    />
                                </a-col>
                            </a-row>

                            <p>风格角色（变声成其他类型角色）</p>
                            <a-select v-model:value="styleRole" style="width: 95%;text-align: left;">
                                <a-select-option v-for="styleRoleItem in styleRoleList" :key="styleRoleItem.styleId" :value="styleRoleItem.name" :title="styleRoleItem.description">
                                    <span>{{ styleRoleItem.name }}</span>
                                </a-select-option>
                            </a-select>
                        </div> 
                        
                        <p>音速（慢 -> 快）</p>
                        <a-row :gutter="15">
                            <a-col :span="15">
                                <a-slider v-model:value="voiceRate" :min="0.5" :max="2" :step="0.01" />
                            </a-col>
                            <a-col :span="4">
                                <a-input-number
                                    v-model:value="voiceRate"
                                    :min="0.5"
                                    :max="2"
                                    :step="0.01"
                                />
                            </a-col>
                        </a-row>

                        <p>音调（低 -> 高）</p>
                        <a-row :gutter="15">
                            <a-col :span="15">
                                <a-slider v-model:value="voicePitch" :min="0.5" :max="1.5" :step="0.01" />
                            </a-col>
                            <a-col :span="4">
                                <a-input-number
                                    v-model:value="voicePitch"
                                    :min="0.5"
                                    :max="1.5"
                                    :step="0.01"
                                />
                            </a-col>
                        </a-row>
                    </a-collapse-panel>
                    <a-collapse-panel key="3" header="文件配置">
                        <p>文件名(检查是否合法)</p>
                        <a-input v-model:value="audioFileName" placeholder="请输入文件名" style="width: 95%;" />

                        <p>音频文件类型</p>
                        <a-select
                            v-model:value="audioFileStyle" 
                            style="width: 95%;text-align: left;"
                        >
                            <a-select-option value="wav">wav</a-select-option>
                            <a-select-option value="mp3">mp3</a-select-option>
                        </a-select>
                    </a-collapse-panel>
                </a-collapse>

                <a-button @click="synthesizeVoice" type="primary"  :loading="isSynthesisLoading" style="margin-top: 5%;">
                    <span v-if="!isSynthesisLoading">开始转换</span>
                    <span v-else>正在转换中...</span>
                </a-button>
            </a-col>
        </a-row>
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
const styleActiveKey = ref(['1']) // 风格选择折叠面板
const voiceStyle = ref('default') // 风格类型
const voiceStyleList = ref([]) // 风格类型列表: [{styleId、name、description}]
const voiceStyleDegree = ref(1) // 风格强度
const styleRole = ref('Boy') // 风格角色
const styleRoleList = ref([]) // 风格角色列表
const voiceRate = ref(1) // 音速
const voicePitch = ref(1) // 音调
const syntheticVoiceList = ref([]) // 合成语音列表 {uid、name、status、url、response}
const isSynthesisLoading = ref(false) // 是否正在进行语音合成
const audioFileName = ref('audio') // 音频文件名
const audioFileStyle = ref('wav') // 音频文件类型

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

// 获取语音风格类型列表
const getStylesApi = () => {
    axios.get(`/tts/styles`)
        .then(res => {
            voiceStyleList.value = res.data.data
        }).catch(err => {
            console.log('获取风格列表失败：' + err)
        })
}
getStylesApi()

// 获取风格角色列表
const getStyleRolesApi = () => {
    axios.get(`/tts/style/roles`)
        .then(res => {
            styleRoleList.value = res.data.data
        }).catch(err => {
            console.log('获取风格角色列表失败：' + err)
        })
}
getStyleRolesApi()


// 合成语音
const synthesizeVoice = () => {
    // 检测文本内容是否为空
    if (textContent.value == '' || textContent.value == null) {
        message.info('文本内容不能为空',5)
        return
    }
    
    // 开始进行语音合成
    isSynthesisLoading.value = true

    axios.post(`/tts/voice`, {
        'text': textContent.value,
        'voiceRole': voiceRole.value,
        'style': voiceStyle.value,
        'styleDegree': voiceStyleDegree.value,
        'styleRole': styleRole.value,
        'rate': voiceRate.value,
        'pitch': voicePitch.value,
        'audioFileName': audioFileName.value,
        'audioFileStyle': audioFileStyle.value
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
        // 完成语音合成
        isSynthesisLoading.value = false 
    }).catch(err => {
        message.error('语音合成失败：' + err)
        isSynthesisLoading.value = false
    })
}


// 移除语音
const removeFile = (file) => {
    syntheticVoiceList.value = syntheticVoiceList.value.filter(item => item.uid != file.uid)
}

// 下载mp3
const downloadMp3 = (fileUrl) => {
    fetch(fileUrl).then(res => res.blob()).then(blob => {
        const a = document.createElement('a');
        document.body.appendChild(a)
        a.style.display = 'none'
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = `${audioFileName.value}.${audioFileStyle.value}`;
        a.click();
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url);
    });
}

</script>