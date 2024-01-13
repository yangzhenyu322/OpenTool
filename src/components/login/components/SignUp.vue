<template>
    <div class="container a-container" id="a-container">
        <form class="form" id="a-form" method="" action="">
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
          <button class="form_button button submit" @click="signUp">SIGN UP</button>
        </form>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import useEmitter from '@/hooks/useEmitter';

const registerForm = reactive({
    usernmae: '',
    password: '',
    phone: ''
})

const signUp = () => {
    const formData = new FormData
    formData.append('username', registerForm.username)
    formData.append('password', registerForm.password)
    formData.append('phone', registerForm.phone)

    console.log('sign up:', registerForm.username)

    // axios.post(`/login`, formData, {headers:{
    //     'Content-Type': 'application/x-www-form-urlencoded;'
    // }}).then(res => {
    //     let response = res.data
    //     console.log('code:', response.code)
    //     console.log('msg:', response.msg)
    // }).catch(err => {
    //     console.log('err:', err)
    // })
}

const emitter = useEmitter()
onMounted(() => {
    emitter.on('change', () => {
        let aContainer = document.querySelector("#a-container")
        // 左右移动
        aContainer.classList.toggle("is-txl")
    })
})

</script>

<style scoped>
@import './css/login.css';
/* 将源码中的css样式单独存放,在各组件中导入就可以。*/
</style>