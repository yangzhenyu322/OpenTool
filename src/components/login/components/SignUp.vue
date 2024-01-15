<template>
    <div class="container a-container" id="a-container">
        <form class="form" id="a-form" @submit.prevent="register">
          <h2 class="form_title title">Create Account</h2>
          <div class="form_icons">
             <img class="form_icon" src=" ">
             <img class="form_icon" src=" ">
             <img class="form_icon" src=" ">
          </div>
          <span class="form_span">or use phone number for registration</span>
          <input class="form_input" type="text" placeholder="Name" v-model="registerForm.username">
          <input class="form_input" type="password" placeholder="Password" v-model="registerForm.password">
          <input class="form_input" type="text" placeholder="Phone" v-model="registerForm.phone">
          <button type="submit" class="form_button button submit">SIGN UP</button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import useEmitter from '@/hooks/useEmitter';
import axios from 'axios';
import { message } from 'ant-design-vue';

const registerForm = reactive({
    username: '',
    password: '',
    phone: ''
})

const emitter = useEmitter()
emitter.on('switchLoginWithRegister', () => {
    let aContainer = document.querySelector("#a-container")
    // 左右移动
    aContainer.classList.toggle("is-txl")
})

// 用户注册
const register = () => {
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
            // 注册成功，切换到登录界面
            message.success(response.msg, 2)
            // emitter.emit('registerSuccess', true)
        } else {
            message.error(response.msg, 2)
        }
    }).catch(err => {
        console.log('err:', err)
    })
}
</script>

<style scoped>
@import './css/login.css';
/* 将源码中的css样式单独存放,在各组件中导入就可以。*/
</style>