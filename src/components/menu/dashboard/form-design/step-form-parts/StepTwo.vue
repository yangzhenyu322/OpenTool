<template>
    <div style="display: flex;justify-content: center;">
        <a-descriptions bordered title="作战效能关联分析">
            <a-descriptions-item label="仿真数据集">{{ formData.dataset }}</a-descriptions-item>
            <a-descriptions-item label="数据集数量">{{ formData.numbers }}</a-descriptions-item>
            <a-descriptions-item label="模型选择">{{ formData.modelName }}</a-descriptions-item>
            <!-- <a-descriptions-item label="Batch-size">{{ formData.batch }}</a-descriptions-item> -->
            <a-descriptions-item label="效能指标">
                <span v-for="(efficy,i) in formData.efficiencies" :key="efficy.dataset">
                    {{ efficy }}
                    <span v-if="i != formData.efficiencies.length - 1">
                        ,
                    </span>
                </span>
            </a-descriptions-item>
        </a-descriptions>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
    props: {
        formData:Object,
    },
    setup(props){
        const state = reactive({
            formData:props.formData
        })

        return {
            ...toRefs(state)
        }
    }
})
</script>