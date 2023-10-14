<template>
    <div class="center-content" style="background-color: white;">
        <a-skeleton active :loading="isPreLoading">
            <div>
                <h1>1111</h1>
                <h2>2222</h2>
            </div>
        </a-skeleton>
        <a-button  @click="showSkeleton">show skeleton</a-button>
    </div>
</template>

<script setup>
import { ref } from "vue";

const isPreLoading = ref(false) // 预加载动画

const showSkeleton = () => {
    isPreLoading.value = !isPreLoading.value
}

</script>