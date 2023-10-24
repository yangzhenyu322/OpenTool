<template>
    <a-page-header
    style="padding-top: 0;padding-bottom: 0;"
    >
    <div style="width: 100%;display: flex;justify-content: space-between;">
        <div style="display: flex;">
            <a-avatar :src="avatarUrl" style="width: 100px;height: 100px;"></a-avatar>
            <div style="margin-left:10px;text-align: left;">
                <p style="font-size: 20px;font-weight: 500;line-height: 20px;margin-bottom: 0;"><span style="font-weight: bold;">Admin</span>, 欢迎回来, 开始您愉快的一天吧！</p>
                <p style="font-size: 14px;color: grey;display: inline-flex;align-items: center;">
                    <el-link type="primary" :underline="false" ><EnvironmentFilled style="color: cornflowerblue;" />{{ location }}</el-link>
                    <span style="white-space: nowrap">&nbsp;&nbsp;{{ weather }}
                        <svg class="icon weather" v-if="weather == '晴'">
                            <use xlink:href="#icon-tianqi-qing"></use>
                        </svg>
                        <svg class="icon weather" v-if="weather == '阴'">
                            <use xlink:href="#icon-tianqi-yin"></use>
                        </svg>
                        <svg class="icon weather" v-if="weather == '多云'">
                            <use xlink:href="#icon-tianqi-duoyun"></use>
                        </svg>
                        <svg class="icon weather" v-if="weather == '小雨'">
                            <use xlink:href="#icon-tianqi-xiaoyu"></use>
                        </svg>
                        <svg class="icon weather" v-if="weather == '中雨'">
                            <use xlink:href="#icon-tianqi-zhongyu"></use>
                        </svg>
                        <svg class="icon weather" v-if="weather == '大雨'">
                            <use xlink:href="#icon-tianqi-dabaoyu"></use>
                        </svg>
                        <svg class="icon weather" v-if="weather == '雷阵雨'">
                            <use xlink:href="#icon-tianqi-leizhenyu"></use>
                        </svg>
                        &nbsp;&nbsp;<span v-if="temperature">{{ temperature }}℃</span>
                    </span>
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
                <a-tabs v-model:activeKey="activeKey" size="small" style="background-color: white;padding: 2%;">
                    <a-tab-pane key="1" tab="服务">
                        <ServiceListVue />
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="用户">
                        <UserListVue />
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="文章">
                        <PapaerList />
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="项目">项目</a-tab-pane>
                    <a-tab-pane key="5" tab="最新动态">最新动态</a-tab-pane>
                </a-tabs>
            </a-col>
            <a-col span="6">
                <a-card
                id="achievementCard"
                title="个人成就"
                style="text-align: left;"
                :bodyStyle="{'padding-bottom':'5px'}"
                >
                    <div class="achievement" style="font-size: 1.2em;">
                        <p><LikeTwoTone twoToneColor="rgb(228,92,92)"/> 获得 96 次点赞</p>
                        <p><MessageTwoTone twoToneColor="rgb(69,122,213)"/> 内容获得 42 次评论</p>
                        <p><StarTwoTone twoToneColor="rgb(241,178,38)"/> 获得 436 次收藏</p>
                        <p><RocketTwoTone twoToneColor="rgb(74,147,190)"/> 代码片获得 1,457 次分享</p>

                        <a-divider orientation="left"><ScheduleOutlined /> 创作经历</a-divider>
                        <div style="background-color: rgb(250,250,250);padding: 10px;">
                            <a-row :gutter="10">
                                <a-col :span="6">
                                    <p class="achievement-creation-numbers">7篇</p>
                                    <p class="achievement-creation-years">2023年</p>
                                </a-col>
                                <a-col :span="6">
                                    <p class="achievement-creation-numbers">3篇</p>
                                    <p class="achievement-creation-years">2022年</p>
                                </a-col>
                                <a-col :span="6">
                                    <p class="achievement-creation-numbers">40篇</p>
                                    <p class="achievement-creation-years">2021年</p>
                                </a-col>
                                <a-col :span="6">
                                    <p class="achievement-creation-numbers">1篇</p>
                                    <p class="achievement-creation-years">2020年</p>
                                </a-col>
                            </a-row>
                        </div>

                        <div id="expandableRightContent" style="display: none;">
                            <a-divider orientation="left"><GithubOutlined /> 开源项目</a-divider>
                            <div style="background-color: rgb(250,250,250);padding: 10px;">
                                <a-row :gutter="10">
                                    <a-col :span="6">
                                        <p class="achievement-creation-numbers">1个</p>
                                        <p class="achievement-creation-years">2023年</p>
                                    </a-col>
                                    <a-col :span="6">
                                        <p class="achievement-creation-numbers">3个</p>
                                        <p class="achievement-creation-years">2022年</p>
                                    </a-col>
                                    <a-col :span="6">
                                        <p class="achievement-creation-numbers">2个</p>
                                        <p class="achievement-creation-years">2021年</p>
                                    </a-col>
                                    <a-col :span="6">
                                        <p class="achievement-creation-numbers">1个</p>
                                        <p class="achievement-creation-years">2020年</p>
                                    </a-col>
                                </a-row>
                            </div>

                            <a-divider orientation="left"><SketchOutlined /> 成就勋章</a-divider>
                            <div style="font-size:34px;">
                                <svg class="icon">
                                    <use xlink:href="#icon-wode-gerenchengjiu"></use>
                                </svg>
                                <svg class="icon">
                                    <use xlink:href="#icon-lianxutianshu-pt-dianliang-xiao4"></use>
                                </svg>
                                <svg class="icon">
                                    <use xlink:href="#icon-ewairenwuchengjiutian"></use>
                                </svg>
                                <svg class="icon">
                                    <use xlink:href="#icon-caise-xiaoci"></use>
                                </svg>
                                <svg class="icon">
                                    <use xlink:href="#icon-caise-datubiao"></use>
                                </svg>
                                <svg class="icon">
                                    <use xlink:href="#icon-caisebeijing"></use>
                                </svg>
                                <svg class="icon">
                                    <use xlink:href="#icon-caisechengdu"></use>
                                </svg>
                                <svg class="icon">
                                    <use xlink:href="#icon-caisejinan"></use>
                                </svg>
                            </div>     
                        </div>

                        <div style="display: flex;justify-content:center;">
                            <button
                            style="border: none;width: 60px;display: flex;justify-content: center;border-radius: 10px;background-color: rgb(247,247,248);margin-top: 5px;"
                            @click="changeAchievement"
                            >
                                <DownOutlined v-if="isCollapsed" />
                                <UpOutlined v-else/>
                            </button>
                        </div>                     
                    </div>
                </a-card>

                <!-- 阿里图表动态库-工作动态图 -->
                <div style="background-color: white;margin-top: 15px;">
                    <div style="width: 100%;" ref="programmer">
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { defineComponent, reactive, toRefs, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import avatarUrl from '@/assets/images/avatar/avatar.png';
import lottie from 'lottie-web'
import json001 from '@/assets/json/programmer.json' // 引入下载的动效json
import ServiceListVue from './workbench-tab-pane/ServiceList.vue';
import UserListVue from './workbench-tab-pane/UserList.vue';
import PapaerList from './workbench-tab-pane/PapaerList.vue';
import axios from 'axios';

export default defineComponent({
components:{
    ServiceListVue,
    UserListVue,
    PapaerList
},
setup() {
    const state = reactive({
        activeKey: '1',
        avatarUrl: avatarUrl,
        isCollapsed: true,
        ip : '',
        city: '',
        location: '',
        temperature: '',
        weather: '',
        programmer: null
    })

    // 控制成就栏高度伸缩
    const changeAchievement = ()=> {
        state.isCollapsed = !state.isCollapsed;
        var expandableRightContent = document.getElementById("expandableRightContent");
        expandableRightContent.style.display = state.isCollapsed ? 'none': 'block'
    }

    onMounted(() => {
        // 获取用户ip地址
        const getUserIP = () => {
            axios.get(`http://ip-api.com/json/`)
                .then(res => {
                    // 成功获取国内用户IP
                    state.ip = res.data.query
                    getLocation()
                }).catch(err => {
                    console.log('获取用户IP失败:' + err)
                })
        }
        getUserIP()

        // 获取用户省市位置
        const getLocation = () => {
            axios.get(`/user/location/${state.ip}`)
                .then(res => {
                    var ad_info = res.data.result.ad_info
                    state.city = ad_info.city
                    state.location = ad_info.province  // 必填
                    if (ad_info.city != null && ad_info.city != ''){ // 非必填
                        state.location += ad_info.city
                    }
                    if (ad_info.district != null && ad_info.district != '') { // 非必填
                        state.location += ad_info.district
                    }
                    getWeatherByCity()
                }).catch(err => {
                    console.log(err)
                })
        }

        // 获取用户所在城市天气
        const getWeatherByCity = () => {
            axios.get(`/user/weather/${state.city}`)
                .then(res => {
                    state.temperature = res.data.lives[0].temperature
                    state.weather = res.data.lives[0].weather
                    message.success('获取用户IP定位成功', 1)
                }).catch(err => {
                    console.log(err)
                    state.location= undefined
                    message.error('获取国内用户IP定位失败', 2)
                })
        }

        // 控制动态图标库
        const animation =  lottie.loadAnimation({
            container: state.programmer, //选择渲染dom
            renderer: "svg", //渲染格式
            loop: true, //循环播放
            autoplay: true, // 是否自动播放
            animationData: json001, //渲染动效json
        })
        animation.setSpeed(0.5)
    })
    
    return {
        ...toRefs(state),
        changeAchievement
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
.weather {
    font-size: 20px;
}
.achievement p{
    margin-top: 0;
    margin-bottom: 10px;
}

.achievement-creation-numbers{
    font-size: 15px;
    font-weight: 500;
}
.achievement-creation-years{
    color: gray;
}
.icon{
    margin-left: 3%;
}
</style>