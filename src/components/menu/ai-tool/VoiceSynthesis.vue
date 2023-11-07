<template>
    <!-- <a-layout>
        <a-layout style="background-color: white;">
            <a-layout-content>
                <a-row>
                    <a-col :span="24">
                        <a-textarea
                            v-model="textContent"
                            placeholder="请输入语音合成内容"
                            allow-clear
                            showCount
                            :maxlength="20000"
                            :auto-size="{ minRows: 10, maxRows: 12 }"
                        />
                    </a-col>
                </a-row>

                <a-divider/>

                <a-row style="font-size: 1.2em;font-weight: bold;">
                    <a-col :span="7">文件</a-col>
                    <a-col :span="6">文件大小</a-col>
                    <a-col :span="6">文件状态</a-col>
                    <a-col :span="5">下载</a-col>
                </a-row>

                <div style="height: 250px;"></div>
            </a-layout-content>

            <a-layout-sider style="background-color: white;">
                111
            </a-layout-sider>
        </a-layout>
        <a-layout-footer style="background-color: white;">
            播放器
        </a-layout-footer>
    </a-layout> -->

    <div style="background-color: white;padding: 1%;">
        <a-row :gutter="20" style="border: 1px rgb(240,240,240) s solid;">
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
                    <a-col :span="7">文件</a-col>
                    <a-col :span="6">文件大小</a-col>
                    <a-col :span="6">文件状态</a-col>
                    <a-col :span="5">下载</a-col>
                </a-row>

                <a-divider/>

                <div style="height: 40vh;">
                    合成语音文件
                </div>
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

        <a-row :gutter="20" style="border: 1px rgb(240,240,240) s solid;">
            <a-col :span="24">
                播放器
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { message } from 'ant-design-vue'; 
import axios from "axios";

const textContent = ref('')  // 文本框内容（语音合成内容）
const languageList = ref([]) // 可选语言列表
const language = ref('中文（普通话，简体）') // 语言
const gender = ref('Male') // 角色性别
const voiceRole = ref('') // 语音角色
const voiceRoleList = ref([]) // 语音角色列表
const syntheticVoiceList = ref([]) // 合成语音列表

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
        syntheticVoiceList.value.push(res.data.data)
        console.log('合成语音url:' + res.data.data)
    }).catch(err => {
        console.log('合成语音失败:' + err)
    })
}

</script>