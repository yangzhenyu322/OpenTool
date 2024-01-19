<template>
    <div class="body">
        <div class="main">
            <div class="switch" id="switch-cnt">
                <div class="switch_circle"></div>
                <div class="switch_circle switch_circle-t"></div>

                <div class="switch_container" id="switch-c1">
                    <h2 class="switch_title title">Hello Friend !</h2>
                    <p class="switch_description description">Enter your personal details and start journey with us</p>
                    <button :disabled="isSwitching || isLogining || isRegistering" class="switch-button button switch-btn"  @click="switchLoginWithRegister">注册</button>
                </div>

                <div class="switch_container is-hidden" id="switch-c2">
                    <h2 class="switch_title title">Welcome Back !</h2>
                    <p class="switch_description description">To keep connected with up please login with your personal info</p>
                    <button :disabled="isSwitching || isLogining || isRegistering" class="switch_button button switch-btn" @click="switchLoginWithRegister">登录</button>
                </div>
            </div>

            <!-- 登录 -->
            <div class="container a-container" id="a-container">
                <a-form
                    ref="loginFormRef"
                    :model="loginForm"
                    :rules="loginRules"
                    class="form"
                    id="a-form"
                >
                    <h2 class="form_title title">登录到OpenTool</h2>
                    <a-form-item name="username" style="margin-top: 20px;">
                        <a-input class="form_input" placeholder="用户名或手机号" v-model:value="loginForm.username" >
                            <template #prefix>
                                <UserOutlined class="site-form-item-icon" />
                            </template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="password">
                        <a-input-password class="form_input" placeholder="密码" v-model:value="loginForm.password" style="padding-right: 10px;">
                            <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>
                    <a-form-item>
                        <a-form-item name="remember" no-style>
                            <a-checkbox v-model:checked="loginForm.rememberMe">7天内免登录</a-checkbox>
                        </a-form-item>
                        <a style="margin-left: 100px;" @click="changeForgetPasswordDrawer">忘记密码</a>
                    </a-form-item>
                    <!-- 图片验证码 -->
                    <Vcode :show="isVerificationCodeShow" @success="verificationCodeSuccess" @close="closeVericationCode" @fail="verificationCodeFail" :imgs="verificationCodeImgUrl"></Vcode>
                    <a-divider>其它登录方式</a-divider>
                    <div class="form_icons" style="font-size: 2em;">
                        <QqOutlined class="form_icon" />
                        <WechatOutlined class="form_icon" />
                        <GithubOutlined class="form_icon" />
                    </div>
                    <button :disabled="isLogining"  class="form_button button submit" @click="login">登录&nbsp;&nbsp;<LoadingOutlined v-if="isLogining" /></button>
                </a-form>
            </div>

            <!-- 注册 -->
            <div class="container b-container" id="b-container">
                <a-form
                    ref="registerFormRef"
                    :model="registerForm"
                    :rules="registerRules"
                    class="form"
                    id="b-form"
                >
                    <h2 class="form_title title">创建新的账户</h2>
                    <a-form-item name="username">
                        <a-input class="form_input" placeholder="用户名" v-model:value="registerForm.username" >
                            <template #prefix>
                                <UserOutlined class="site-form-item-icon" />
                            </template>
                        </a-input>
                    </a-form-item>
                    <a-form-item name="password">
                        <a-input-password class="form_input" placeholder="密码" v-model:value="registerForm.password" style="padding-right: 10px;">
                            <template #prefix>
                                <LockOutlined class="site-form-item-icon" />
                            </template>
                        </a-input-password>
                    </a-form-item>
                    <a-form-item name="phone">
                        <a-input class="form_input" placeholder="手机号码" v-model:value="registerForm.phone">
                            <template #prefix>
                                <PhoneOutlined />
                            </template>
                        </a-input>  
                    </a-form-item>
                    <a-form-item name="code">
                        <a-input class="form_input" placeholder="短信验证码" v-model:value="registerForm.code" style="padding-right: 10px;">
                            <template #suffix>
                                <a-button v-if="!isVerifing" :disabled="(registerForm.phone == null) || (registerForm.phone === '')" type="link" @click="sendVerifyCode">发送验证码</a-button>
                                <a-statistic-countdown
                                    v-else
                                    :value="countDownDeadline"
                                    format="ss"
                                    :valueStyle="{ 'font-size':'1.2em', }"
                                />
                            </template>
                        </a-input>
                    </a-form-item>
                    <a-checkbox v-model:checked="isAgreeProtocal">
                        <span class="form_span">
                            我已阅读并同意
                            <span style="color: rgb(44, 141, 190);">服务协议</span>
                            和
                            <span style="color: rgb(44, 141, 190);">隐私保护指引</span>
                        </span>
                    </a-checkbox>
                    <button :disabled="isRegistering" class="form_button button submit" @click="register">注册&nbsp;&nbsp;<LoadingOutlined v-if="isRegistering" /></button>
                </a-form>
            </div>

            <!-- 忘记密码 -->
            <ForgetPassword v-model:openDrawer="openDrawer" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios';
import { message } from 'ant-design-vue';
import qs from 'qs';
import { useRouter} from 'vue-router';
import Vcode from 'vue3-puzzle-vcode';
import { isNumeric } from '@/utils/string/stringUtils.js'
import ForgetPassword from './components/ForgetPassword.vue';

const router = useRouter()
const isSwitching = ref(false)

// const verificationCodeImgUrl = ref(ImageUrl)
const imageList = import.meta.glob('@/assets/images/verificationCode/*.*', { eager:true })
const verificationCodeImgUrl = ref(Object.values(imageList).map(v => v.default))

const switchLoginWithRegister = () => {
    const switchC1 = document.querySelector("#switch-c1")
    const switchC2 = document.querySelector("#switch-c2")
    const switchCircle = document.querySelectorAll(".switch_circle")
    const switchCtn = document.querySelector("#switch-cnt")
    switchCtn.classList.add("is-gx")
    setTimeout(() => {
        switchCtn.classList.remove("is-gx")
    }, 1500)
    switchCtn.classList.toggle("is-txr")
    switchCircle[0].classList.toggle("is-txr")
    switchCircle[1].classList.toggle("is-txr")
    switchC1.classList.toggle("is-hidden")
    switchC2.classList.toggle("is-hidden")

    let aContainer = document.querySelector("#a-container")
    // 左右移动
    aContainer.classList.toggle("is-txl")

    let bContainer = document.querySelector("#b-container")
    // 左右移动
    bContainer.classList.toggle("is-txl")
    // 改变signIn容器的z-index
    bContainer.classList.toggle("is-z200")

    isSwitching.value = true
    setTimeout(() => {
        isSwitching.value =false
    }, 1250)
}

// 用户注册: 发送手机验证码 -> 表单本地验证 -> 进行用户注册
const registerFormRef = ref() // 表单引用
const registerForm = reactive({ // 注册信息
    username: '',
    password: '',
    phone: '',
    code: '',
    codeRequestId:'' // 验证码请求ID，用于检测验证码是否正确
})
const registerRules = { // 表单验证规则
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
    password: [{
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

const isAgreeProtocal = ref(true) // 是否同意协议
const isRegistering = ref(false) // 是否注册中
const countDownDeadline = ref(Date.now()) // 倒计时结束时间
const codeValidTime = ref(90) // 验证码有效时间（单位：秒）
const isVerifing = ref(false) // 是否正在验证中

const checkAgreeProtocal = () => { // 检测用户是否同意协议
    if (isAgreeProtocal.value) {
        return true
    }

    // 未同意协议
    message.warn('请勾选同意用户协议')
    return false
}

const sendVerifyCode = () => { // 发送手机验证码：是否同意协议->检验手机号格式->检查手机号是否注册过->发送验证码      
    if (checkAgreeProtocal()) {  // 是否同意了协议
        // 手机号码规则验证
        if (registerForm.phone.length != 11 || isNumeric(registerForm.phone)) {
            // 验证成功
                // 检测该手机号码是否注册过
                axios.get(`/user/check/phone/${registerForm.phone}`)
                    .then(res => {
                        const response = res.data
                        if (response.code === 200) {  // 用户未注册
                            // 发送手机验证码
                            axios.get(`/sms/code/${registerForm.phone}/6/${codeValidTime.value}`)
                                .then(res => {
                                    const response = res.data
                                    if (response.code === 200) {
                                        // 发送手机验证码成功，开始输入验证码倒计时
                                        registerForm.codeRequestId = response.data // 获取验证码请求Id

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
                            // 用户已注册
                            message.error('该手机号已注册过账户，不可重复注册', 3)
                        }
                    })
        } else {
            message.warn('手机号格式有误，请检查')
        }
    }
}

const register = () => { // 进行用户注册
    if (checkAgreeProtocal()) {
        // 表单规则验证
        registerFormRef.value.validate().then(() => {
            // 发送注册请求
            isRegistering.value = true
            axios.post(`/user/register/${registerForm.codeRequestId}/${registerForm.code}`, JSON.stringify({
                userName: registerForm.username,
                password: registerForm.password,
                phoneNumber: registerForm.phone
            }), { 
                headers: {
                    "Content-Type":"application/json"
                }
            }).then(res => {
                let response = res.data
                if (response.code === 200) {
                    message.success(response.msg, 2)
                    // 注册成功，设置用户登录信息为新用户，并切换到登录界面
                    loginForm.username = registerForm.username
                    loginForm.password = registerForm.password

                    switchLoginWithRegister()
                } else {
                    // 注册失败，展示失败原因
                    message.error(response.msg, 4)
                }
                isRegistering.value = false
            }).catch(err => {
                console.log('err:', err)
                isRegistering.value = false
            })
        }).catch(error => {
            message.error('表单信息有误，请检查后重新提交', 3)
        });
    }
}

// 用户登录
const loginFormRef = ref() // 表单引用
const loginForm = reactive({  // 登录信息
    username: '',
    password: '',
    rememberMe: true
})
const loginRules = { // 表单验证规则
    username: [{
        required: true,
        message: '请填写您的用户名',
        trigger: 'change',
    }, {
        min: 5,
        max: 12,
        message: '名字长度为5-12个字符',
        trigger: 'blur',
    }],
    password: [{
        required: true,
        message: '请填写您的密码',
        trigger: 'change',
    }, {
        min: 5,
        max: 16,
        message: '密码长度为5-16个字符'
    }],
}
const isVerificationCodeShow = ref(false) // 是否展示验证码图片
const isLogining = ref(false) // 是否正在登录

const login = () => {
    // 表单规则验证
    loginFormRef.value.validate().then(() => {
        // 验证成功，开始图片验证码验证
        // 展现验证码模拟框：成功->verificationCodeSuccess、失败->verificationCodeFail、取消->closeVericationCode
        isVerificationCodeShow.value = true  
    }).catch(err => {
        message.error('账号密码格式有误，请检查后重新提交', 3)
    })
}

// 用户点击遮罩层，关闭模态框
const closeVericationCode = () => {
    isVerificationCodeShow.value = false
}

// 用户通过了图片登录验证
const verificationCodeSuccess = (msg) => {
    isVerificationCodeShow.value = false
    console.log('验证通过:', msg)

    isLogining.value = true
    axios.post('/login', qs.stringify({
            username: loginForm.username,
            password: loginForm.password,
            rememberMe: loginForm.rememberMe
        }), {
            headers: {
                'REMEMBER_ME' : loginForm.rememberMe
            }
        })
    .then(res => {
        let response = res.data
        if (response.code === 200) {
            message.success(response.msg, 2)
            isLogining.value = false
            // 路由切换
            router.push({ path: '/index' })
        }
    })
    .catch(err => {
        // 登录失败时没有通过网关，因此被作为异常catch了
        message.error(err.response.data.msg, 4)
        isLogining.value = false
        console.log('err:', err)
    })
}

// 用户登录验证失败
const verificationCodeFail = () => {
    console.log('验证失败')
}


// 忘记密码
const openDrawer = ref(false)

// 打开或关闭忘记密码抽屉
const changeForgetPasswordDrawer = () => {
    openDrawer.value = !openDrawer.value
}

</script>

<style scoped>
@import './css/login.css';

.form_input :where(.ant-input) {
    letter-spacing: 0.15px;
    font-family: "Montserrat", sans-serif;
    background-color: transparent;
}

/* 去除input的自动填充背景色 */
/* input:-webkit-autofill, .form_input :where(.ant-input) {
    transition: background-color 5000s ease-in-out 0s;
} */

.form_input :where(.ant-input) {
    transition: background-color 5000s ease-in-out 0s;
}

/* 修改自动填充的字体颜色 */
/* input {
	-webkit-text-fill-color: #9cc5ec;  
} */

</style>