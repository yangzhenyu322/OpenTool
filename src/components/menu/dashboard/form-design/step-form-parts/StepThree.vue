<template>
        <DAG style="margin:10px" :efficiencies="efficiencies" :results="results" />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import DAG from './graph/DAG.vue'

export default defineComponent({
    components:{
        DAG,
    },
    props:{
        efficiencies:Array
    },
    setup(props){
        const state = reactive({
            efficiencies:props.efficiencies,
            results:new Map([
                ['count',[0,3,1,1,0]],
                ['windowAvg',[1,32,0,0,1]],
                ['windowMax',[1,2,0,1,1]],
                ['windowMin',[0, 2, 1, 0, 1]],
                ['respTimeAvg',[0, 17, 0, 1, 1]],
                ['timelinessAvg',[1, 19, 0, 1, 0]],
                ['closeLoopTimeAvg',[1, 5, 1, 1, 1]]
            ])
        })
        return{
            ...toRefs(state)
        }
    }
})

</script>

