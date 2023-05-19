<template>
    <a-page-header title="仿真数据关联分析" class="header-content" style="margin-top: 2px;text-align: left;font-size: 14px;">
        <span>基于贝叶斯网络的仿真数据关联性分析</span>
    </a-page-header>

    <div class="center-content" style="background-color: white;">
        <a-steps :current="current">
        <a-step v-for="item in steps" :key="item.title" :title="item.title" />
        </a-steps>
        <div class="steps-content" style="width: 100%;min-height: 300px;margin-top: 70px;">
            <StepOne  v-if="current == 0" @submit="onSubmit" />
            <StepTwo  v-if="current == 1" :formData="data" />
            <StepThree v-if="current == 2" :efficiencies="data.efficiencies" />
            <StepFour  v-if="current == 3" :efficiencies="data.efficiencies" />
        </div>
        <a-spin v-if="isLoad"  delay="1000" size="large" tip="正在分析中..."  style="position: absolute;z-index: 999;bottom:100px;"></a-spin>
        <div class="steps-action">
            <a-button v-if="current == 1 || current == 3" @click="prev" :disabled="disabled">上一步</a-button>
            <a-button v-if="current == 1" type="primary" @click="loading" style="margin-left: 10px" :disabled="disabled">开始分析</a-button>
            <a-button v-if="current == 2" @click="next" style="margin-left: 10px">下一步</a-button>
            <a-button
                v-if="current == steps.length - 1"
                type="primary"
                style="margin-left: 10px"
                @click="reset"
            >
                重新实验
            </a-button>
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive,toRefs} from 'vue'
import StepOne from './step-form-parts/StepOne.vue'
import StepTwo from './step-form-parts/StepTwo.vue'
import StepThree from './step-form-parts/StepThree.vue'
import StepFour from './step-form-parts/StepFour.vue'

export default defineComponent({
    components:{
        StepOne,
        StepTwo,
        StepThree,
        StepFour
    },
    setup(){
        const state = reactive({
            current : 0,
            steps: [
                {
                title: '选择效能指标',
                content: '选择需要分析的效能指标',
                },
                {
                title: '地质目标侦测效能关联分析',
                content: '正在分析中',
                },
                {
                title: '贝叶斯关联关系图',
                content: 'DAG图',
                },
                {
                title: '分析结果',
                content: '效能对应重要影响因素',
                },
            ],
            data: {},
            isLoad: false,
            disabled : false
        })

        const next = () => {
            state.current++;
        }

        // sleep模拟实验分析加载
        const sleep = time => {
            return new Promise(resolve => {
                setTimeout(resolve,time)
            })
        }

        const loading = () => {
            state.isLoad = true
            state.disabled = true
            sleep(10000).then(() => {
                state.isLoad = false
                state.disabled = false
                next()
            })
        }

        const prev = () => {
            state.current--;
        }

        const onSubmit = (obj) => {
            next()
            state.data = obj;
            // console.log(toRaw(state.data))
        }

        const reset = () => {
            state.current = 0
        }

        return {
            ...toRefs(state),
            next,
            prev,
            loading,
            onSubmit,
            reset,
            stepStyle: {
                marginBottom: '60px',
                boxShadow: '0px -1px 0 0 #e8e8e8 inset',
            }
        };
    }
})
</script>

<style>
    
</style>
