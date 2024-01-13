<template>
    <div class="body">
        <div class="main">
            <SwithComponent />
            <SignUp />
            <SignIn />
        </div>
    </div>
</template>

<script setup>
import SwithComponent from './components/SwithComponent.vue';
import SignIn from './components/SignIn.vue';
import SignUp from './components/SignUp.vue';

</script>

<style scoped>
@import './components/css/login.css';

</style>