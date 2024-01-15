<template>
    <div class="body">
        <div class="main">
            <SwitchComponent />
            <SignUp />
            <SignIn />
        </div>
    </div>
</template>

<script setup>
import SwitchComponent from './components/SwitchComponent.vue';
import SignIn from './components/SignIn.vue';
import SignUp from './components/SignUp.vue';

</script>

<style scoped>
@import './components/css/login.css';

</style>