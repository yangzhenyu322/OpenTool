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
import { reactive, onMounted } from 'vue';
import useEmitter from '@/hooks/useEmitter';
import axios from 'axios';
import qs from 'qs';
import { useRouter} from 'vue-router';

const router = useRouter()
const loginForm = reactive({
    username: '',
    password: ''
})

const login = () => {
    axios.post('/login', qs.stringify({
            username: loginForm.username,
            password: loginForm.password
        }), { withCredentials: true })
    .then(res => {
        let response = res.data
        if (response.code === 200) {
            // 路由切换
            router.push({ path: '/index' })
            console.log("success")
        } else {
            console.log('账号密码有误：', response.msg)
        }
    })
    .catch(err => {
        console.log('err:', err)
    })
}

const emitter = useEmitter()
onMounted(() => {
    emitter.on('change', () => {
        let bContainer = document.querySelector("#b-container")
        // 左右移动
        bContainer.classList.toggle("is-txl")
        // 改变signIn容器的z-index
        bContainer.classList.toggle("is-z200")
    })
})

</script>

<style scoped>
@import './css/login.css';
/* 将源码中的css样式单独存放,在各组件中导入就可以。*/
</style>