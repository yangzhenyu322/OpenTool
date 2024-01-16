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
                <form class="form" id="a-form" @submit.prevent="login">
                    <h2 class="form_title title">登录到OpenTool</h2>
                    <span class="form_span">用户名或手机号码登录</span>
                    <input class="form_input" type="text" placeholder="用户名" v-model="loginForm.username">
                    <input class="form_input" type="password" placeholder="密码" v-model.lazy="loginForm.password">
                    <!-- 验证码 -->
                    <Vcode :show="isVerificationCodeShow" @success="verificationCodeSuccess" @close="closeVericationCode" @fail="verificationCodeFail" :imgs="verificationCodeImgUrl"></Vcode>
                    <a>忘记密码</a>
                    <a-divider>其它登录方式</a-divider>
                    <div class="form_icons" style="font-size: 2em;">
                        <QqOutlined class="form_icon" />
                        <WechatOutlined class="form_icon" />
                        <GithubOutlined class="form_icon" />
                    </div>
                    <button :disabled="isLogining" type="submit" class="form_button button submit">登录&nbsp;&nbsp;<LoadingOutlined v-if="isLogining" /></button>
                </form>
            </div>

            <!-- 注册 -->
            <div class="container b-container" id="b-container">
                <!-- 需要设置action -->
                <form class="form" id="b-form" @submit.prevent="register">
                    <h2 class="form_title title">创建新的账户</h2>
                    <span class="form_span">使用邮箱或手机号注册</span>
                    <input class="form_input" type="text" placeholder="Name" v-model="registerForm.username">
                    <input class="form_input" type="password" placeholder="Password" v-model="registerForm.password">
                    <input class="form_input" type="text" placeholder="Phone" v-model="registerForm.phone">
                    <button :disabled="isRegistering" type="submit" class="form_button button submit">注册&nbsp;&nbsp;<LoadingOutlined v-if="isRegistering" /></button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios';
import { message } from 'ant-design-vue';
import qs from 'qs';
import { useRouter} from 'vue-router';
// import verificationCodeImgUrl from '@/assets/images/avatar/avatar.png';
// import ImageUrl from '@/assets/images/avatar/avatar.png';
import Vcode from 'vue3-puzzle-vcode';

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

// 用户注册
const isRegistering = ref(false) // 是否注册中

const registerForm = reactive({
    username: '',
    password: '',
    phone: ''
})

const register = () => {
    isRegistering.value = true
    axios.post('/user/register', JSON.stringify({
            userName: registerForm.username,
            password: registerForm.password,
            phoneNumber: registerForm.phone
        }), { 
            headers: {
                "Content-Type":"application/json"
            }
         })
    .then(res => {
        let response = res.data
        if (response.code === 200) {
            message.success(response.msg, 2)
            // 注册成功，切换到登录界面
            switchLoginWithRegister()
        } else {
            message.error(response.msg, 2)
        }
        isRegistering.value = false
    }).catch(err => {
        console.log('err:', err)
        isRegistering.value = false
    })
}

// 用户登录
const isLogining = ref(false) // 是否正在登录
const loginForm = reactive({  // 登录信息
    username: '',
    password: ''
})
const isVerificationCodeShow = ref(false) // 是否展示验证码图片

const login = () => {
    // 展现验证码模拟框
    isVerificationCodeShow.value = true
}

// 用户点击遮罩层，关闭模态框
const closeVericationCode = () => {
    isVerificationCodeShow.value = false
}

// 用户通过了验证
const verificationCodeSuccess = (msg) => {
    isVerificationCodeShow.value = false
    console.log('验证通过:', msg)

    isLogining.value = true
    axios.post('/login', qs.stringify({
            username: loginForm.username,
            password: loginForm.password
        }), { withCredentials: true })
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
        message.error(err.response.data.msg, 2)
        isLogining.value = false
        console.log('err:', err)
    })
}



// 用户验证失败
const verificationCodeFail = () => {
    console.log('验证失败')
}

</script>

<style scoped>
@import './login.css';
</style>