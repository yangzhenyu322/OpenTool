<template>
    <a-page-header
    style="padding-top: 0%;padding-bottom: 0%;"
    >
    <div style="width: 100%;display: flex;justify-content: space-between;">
        <div style="display: flex;">
            <a-avatar :src="avatarUrl" style="width: 100px;height: 100px;"></a-avatar>
            <div style="margin-left:10px;text-align: left;">
                <p style="font-size: 20px;font-weight: 500;line-height: 20px;margin-bottom: 0%;"><span style="font-weight: bold;">Admin</span>, 欢迎回来, 开始您愉快的一天吧！</p>
                <p style="font-size: 14px;color: grey;display: inline-flex;align-items: center;">
                    <el-link type="primary" :underline="false" ><EnvironmentFilled style="color: cornflowerblue;" />湖南省长沙市</el-link>
                    <span style="">&nbsp;&nbsp;天气晴<FireFilled style="color:crimson;" />, 20℃~32℃</span>
                </p>
            </div>
        </div>
        <div style="width: 20%;margin-right: 2%;">
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
    <div class="center-content" >
        <a-row :gutter="10">
            <a-col span="18">
                <a-tabs v-model:activeKy="activeKey" size="small" style="background-color: white;padding: 2%;">
                    <a-tab-pane key="1" tab="服务">服务</a-tab-pane>
                    <a-tab-pane key="2" tab="文章">文章</a-tab-pane>
                    <a-tab-pane key="3" tab="项目">项目</a-tab-pane>
                    <a-tab-pane key="4" tab="最新动态">最新动态</a-tab-pane>
                </a-tabs>
            </a-col>
            <a-col span="6">
                <div style="background-color: white;">
                    <a-card
                    title="个人成就"
                    style="text-align: left;"
                    >
                        <div style="font-size: 1.2em;">
                            <p><LikeTwoTone twoToneColor="rgb(228,92,92)"/> 获得 96 次点赞</p>
                            <p><MessageTwoTone twoToneColor="rgb(69,122,213)"/> 内容获得 42 次评论</p>
                            <p><StarTwoTone twoToneColor="rgb(241,178,38)"/> 获得 436 次收藏</p>
                            <p><RocketTwoTone twoToneColor="rgb(74,147,190)"/> 代码片获得 1,457 次分享</p>
                        </div>
                    </a-card>
                </div>
            </a-col>
        </a-row>
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