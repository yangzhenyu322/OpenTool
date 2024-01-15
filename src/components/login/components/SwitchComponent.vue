<template>
    <div class="switch" id="switch-cnt">
        <div class="switch_circle"></div>
        <div class="switch_circle switch_circle-t"></div>

        <div class="switch_container" id="switch-c1">
            <h2 class="switch_title title">Welcome Back !</h2>
            <p class="switch_description description">To keep connected with up please login with your personal info</p>
            <button class="switch_button button switch-btn" @click="switchLoginWithRegister">SIGN IN</button>
        </div>

        <div class="switch_container is-hidden" id="switch-c2">
            <h2 class="switch_title title">Hello Friend !</h2>
            <p class="switch_description description">Enter your personal details and start journey with us</p>
            <button class="switch-button button switch-btn"  @click="switchLoginWithRegister">SIGN UP</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import useEmitter from '@/hooks/useEmitter.js'

const sidebarOpen = ref(true)
const emitter = useEmitter()

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

    sidebarOpen.value = !sidebarOpen.value
    emitter.emit('switchLoginWithRegister', sidebarOpen)
}

emitter.on('registerSuccess', () => {
    switchLoginWithRegister()
})

emitter.on('loginSuccess', () => {
    switchLoginWithRegister()
})

</script>

<style scoped>
@import './css/login.css';
</style>