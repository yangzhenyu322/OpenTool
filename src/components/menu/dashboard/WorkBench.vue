<!-- <template>
    <a-page-header title="工作台" class="header-content">
        <a-avatar :src="avatarUrl"></a-avatar>
        <span>工作台</span>
    </a-page-header>

    <div class="center-content">
      工作台
    </div>
</template> -->

<template>
    <a-page-header
    style="padding: 1vh;"
    >
    <div style="display: flex;justify-content: space-between;">
        <div style="display: flex;">
            <a-avatar :src="avatarUrl" style="width: 100px;height: 100px;"></a-avatar>
            <div style="margin-left:10px;text-align: left;">
                <p style="font-size: 20px;font-weight: 500;line-height: 20px;"><span style="font-weight: bold">Admin</span>, 欢迎回来, 开始您愉快的一天吧！</p>
                <p style="font-size: 15px;margin-left: 0%;margin-right: auto;color: grey;line-height: 20px;">
                    <EnvironmentFilled style="color: cornflowerblue;" /> <span style="color:lightskyblue;">湖南省长沙市</span>
                    , 天气晴<FireFilled style="color:crimson;" />
                    , 20℃~32℃
                </p>
            </div>
        </div>
        <div style="width: 20vh;margin-right: 2vh;">
            <a-row type="flex" :gutter="[2]">
                <a-col :span="8">
                    <p class="header-text-right-sub1">待办</p>
                    <p class="header-text-right-sub2">2/10</p>
                </a-col>
                <a-col :span="8">
                    <p class="header-text-right-sub1">项目</p>
                    <p class="header-text-right-sub2">8</p>
                </a-col>
                <a-col :span="8">
                    <p class="header-text-right-sub1">团队</p>
                    <p class="header-text-right-sub2">156</p>
                </a-col>
            </a-row>
        </div>
    </div>
    </a-page-header>
    <div class="center-content">
        内容
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs } from 'vue';
import avatarUrl from '@/assets/images/head-photo/touxiang.png';

export default defineComponent({
setup() {
    const state = reactive({
    avatarUrl: avatarUrl
    })

    return {
    ...toRefs(state)
    };
},

});
</script>


<style scoped>
.header-text-right-sub1{
    font-size: 16px;
    line-height: 30px;
    color:darkgrey;
}
.header-text-right-sub2{
    font-size: 26px;
    line-height: 0px;
}
</style>
  