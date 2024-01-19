<template>
    <a-drawer
        title="找回密码"
        placement="right"
        v-model:open="openDrawer"
        @after-open-change="afterOpenChange"
        :get-container="false"
        width="600"
    >
        <!-- 步骤条 -->
        <a-steps 
            :current="current"
            size="small"
        >
            <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>

        <!-- 内容输入区 -->
        <div style="margin-top: 50px;">
            <a-form
                ref="changePasswordRef"
                :model="changePasswordForm"  
                :rules="changePasswordRules"
                class="vertical-center"  
            >
                <a-form-item v-if="current == 0" name="username">
                    <a-input class="input_item" placeholder="用户名" v-model:value="changePasswordForm.username">
                        <template #prefix>
                            <UserOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item v-if="current == 1" name="phone">
                    <a-input  class="input_item" placeholder="手机号码" v-model:value="changePasswordForm.phone">
                        <template #prefix>
                            <PhoneOutlined />
                        </template>
                    </a-input>
                </a-form-item>
            
                <a-form-item v-if="current == 1" name="code">
                    <a-input class="input_item" placeholder="短信验证码" v-model:value="changePasswordForm.code">
                        <template #suffix>
                            <a-button v-if="!isVerifing" :disabled="(changePasswordForm.phone == null) || (changePasswordForm.phone === '')" type="link" @click="sendVerifyCode">
                                发送验证码
                            </a-button>
                            <a-statistic-countdown
                                v-else
                                :value="countDownDeadline"
                                format="ss"
                                :valueStyle="{ 'font-size':'1.2em', }"
                            />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item v-if="current == 2" name="newPassword">
                    <a-input-password class="input_item" placeholder="新密码" v-model:value="changePasswordForm.newPassword">
                        <template #prefix>
                            <LockOutlined class="site-form-item-icon" />
                        </template>
                    </a-input-password>
                </a-form-item>

                <a-form-item v-if="current == 2" name="repeatNewPassword">
                    <a-input-password class="input_item" placeholder="重新输入密码" v-model:value="changePasswordForm.repeatNewPassword">
                        <template #prefix>
                            <LockOutlined class="site-form-item-icon" />
                        </template>
                    </a-input-password>
                </a-form-item>
            </a-form>
        </div>

        <!-- 前进/后退/完成 按钮 -->
        <div class="horizontal-center" style="margin-top: 50px;">
            <a-button v-if="current > 0 && current < 2" @click="prev" style="margin-right: 15px;">
                上一步
            </a-button>
            <a-button :disabled="(changePasswordForm.username.length < 5) || (current == 1 && changePasswordForm.phone.length != 11)"
                v-if="current < steps.length - 1" 
                type="primary" 
                @click="next">
                下一步
            </a-button>

            <a-button
                v-if="current == steps.length - 1"
                @click="cancelChange" 
                style="margin-right: 15px;"
            >
                取消修改
            </a-button>
            <a-button 
                v-if="current == steps.length - 1"
                type="primary"
                @click="changePassword"
            >
                确认修改
            </a-button>
        </div>
    </a-drawer>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { isNumeric } from '@/utils/string/stringUtils.js'
import axios from 'axios'

// 处理抽屉的打开与关闭
const props = defineProps({
    openDrawer: Boolean
})

const $emit = defineEmits(['update:openDrawer'])
 
const openDrawer = ref(props.openDrawer) // 是否打开忘记密码抽屉
watch(()=>props.openDrawer, (newVal) => {
    openDrawer.value = newVal
})

// 开关状态改变时处理事件-
const afterOpenChange = () => {
    $emit('update:openDrawer', openDrawer.value)
}

// 修改密码
const current = ref(0); // 当前步骤下标
const next = () => { // 下一步
    if (current.value == 1) {
        // 检测验证码请求ID与验证码是否一致
        checkPhoneCode()
    } else {
        current.value++
    }
}

const prev = () => { // 上一步
    current.value--
}

const steps = [
    {
        title: '填写账号',
    },
    {
        title: '手机号码验证',
    },
    {
        title: '完成密码修改',
    }
]

const changePasswordRef = ref()
const changePasswordForm = reactive({
    username: '',
    phone: '',
    code: '',
    codeRequestId:'',
    newPassword: '', // 新密码
    repeatNewPassword: '' // 重复新密码
})

const changePasswordRules = {
    username: [{
        required: true,
        message: '请填写您的用户名',
        trigger: 'change',
    }, {
        min: 5,
        max: 20,
        message: '名字为5-20个字符',
        trigger: 'blur',
    }],
    newPassword: [{
        required: true,
        message: '请填写您的密码',
        trigger: 'change',
    }, {
        min: 5,
        max: 20,
        message: '密码为5-20个字符'
    }],
    repeatNewPassword: [{
        required: true,
        message: '请填写您的密码',
        trigger: 'change',
    }, {
        min: 5,
        max: 20,
        message: '密码为5-20个字符'
    }],
    phone: [{
        required: true,
        message: '请填写您的手机号码',
        trigger: 'change',
    }, {
        min: 11,
        max: 11,
        message: '手机号为11位有效数字'
    }],
    code: [{
        required: true,
        message: '请填写您的验证码',
        trigger: 'change',
    }, {
        min: 4,
        max: 6,
        message: '验证码为4-6位有效数字'
    }],
}

// 手机验证
const countDownDeadline = ref(Date.now()) // 倒计时结束时间
const codeValidTime = ref(90) // 验证码有效时间（单位：秒）
const isVerifing = ref(false) // 是否正在验证中

const sendVerifyCode = () => {
    if (changePasswordForm.phone.length != 11 || isNumeric(changePasswordForm.phone)) {
        // 验证成功
            // 检测该手机号码是否与账户绑定不一致
            axios.get(`/user/check/username/${changePasswordForm.username}/phone/${changePasswordForm.phone}`)
                .then(res => {
                    const response = res.data
                    if (response.code === 200) {  // 两者不一致
                        // 发送手机验证码
                        axios.get(`/sms/code/${changePasswordForm.phone}/6/${codeValidTime.value}`)
                            .then(res => {
                                const response = res.data
                                if (response.code === 200) {
                                    // 发送手机验证码成功，开始输入验证码倒计时
                                    changePasswordForm.codeRequestId = response.data // 获取验证码请求Id

                                    const validTime = 1000 * codeValidTime.value
                                    countDownDeadline.value = Date.now() + validTime
                                    isVerifing.value = true

                                    setTimeout(() => {  // 倒计时结束
                                        isVerifing.value = false
                                    }, validTime)
                                } else {
                                    // 发送验证码失败
                                    message.error(response.msg, 3)
                                }
                            }).catch(err => {
                                console.log('error:', err)
                            })
                    } else {
                        // 两者不一致
                        message.error(response.msg, 3)
                    }
                })
    } else {
        message.warn('手机号格式有误，请检查')
    }
}

const checkPhoneCode = () => { // 检测验证码
    axios.get(`/sms/code/verification/${changePasswordForm.codeRequestId}/${changePasswordForm.code}`)
        .then(res => {
            let response = res.data
            if (response.code === 200) {
                current.value++
            } else {
                message.error(response.msg, 3)
            }
        }).catch(err => {
            console.log('err:', err)
        })
}

const changePassword = () => { // 修改密码
    axios.put(`/user/password`, {
        userName: changePasswordForm.username,
        phoneNumber: changePasswordForm.phone,
        password: changePasswordForm.newPassword,
        repeatPassword: changePasswordForm.repeatNewPassword,
        codeRequestId: changePasswordForm.codeRequestId,
        inputCode: changePasswordForm.codeRequestId
    }).then(res => {
        let response = res.data
        if (response.code == 200) {
            message.success('修改密码成功')
            changePasswordRef.value.resetFields();
            current.value = 0

            openDrawer.value = false
            $emit('update:openDrawer', openDrawer.value)
        } else {
            message.warn(response.msg)
        }
    }).catch(err => {
        console.log('error:', err)
    })
}

const cancelChange = () => { // 取消修改密码(重置表单)
    changePasswordRef.value.resetFields();
    current.value = 0
}
</script>

<style scoped>
.input_item {
    width: 300px;
    height: 40px;
    margin-bottom: 10px;
}

.input_item :where(.ant-input) {
    transition: background-color 5000s ease-in-out 0s;
}
</style>