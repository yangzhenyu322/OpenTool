<template>
    <div class="container b-container" id="b-container">
        <!-- 需要设置action -->
        <form class="form" id="b-form" @submit.prevent="login">
          <h2 class="form_title title">Sign in to Website</h2>
          <div class="form_icons">
            <!-- 第三方登录的图标 -->
            <img class="form_icon" src=" ">
            <img class="form_icon" src=" ">
            <img class="form_icon" src=" ">
          </div>
          <span class="form_span">or use your email account</span>
          <input class="form_input" type="text" placeholder="用户名" v-model="loginForm.username">
          <input class="form_input" type="password" placeholder="密码" v-model.lazy="loginForm.password">
          <a class="form_link">Forgot your password?</a>
          <button type="submit" class="form_button button submit">SIGN IN</button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import useEmitter from '@/hooks/useEmitter';
import axios from 'axios';
import qs from 'qs';
import { useRouter} from 'vue-router';
import { message } from 'ant-design-vue';

const router = useRouter()
const loginForm = reactive({
    username: '',
    password: ''
})

const emitter = useEmitter()
emitter.on('switchLoginWithRegister', () => {
    let bContainer = document.querySelector("#b-container")
    // 左右移动
    bContainer.classList.toggle("is-txl")
    // 改变signIn容器的z-index
    bContainer.classList.toggle("is-z200")
})

// 用户登录
const login = () => {
    axios.post('/login', qs.stringify({
            username: loginForm.username,
            password: loginForm.password
        }), { withCredentials: true })
    .then(res => {
        let response = res.data
        if (response.code === 200) {
            message.success(response.msg, 2)
            // 复位
            // emitter.emit('loginSuccess', true)
            // 路由切换
            router.push({ path: '/index' })
        }
    })
    .catch(err => {
        // 登录失败时没有通过网关，因此被作为异常catch了
        message.error(err.response.data.msg, 2)
        console.log('err:', err)
    })
}
</script>

<style scoped>
@import './css/login.css';
/* 将源码中的css样式单独存放,在各组件中导入就可以。*/
</style>