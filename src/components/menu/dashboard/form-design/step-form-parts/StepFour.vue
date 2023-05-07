<template>
    <KnowlegeGraph />
    <div style="display: flex;justify-content: center;">
        <a-table :columns="columns" :data-source="data" style="margin-top: 20px;width: 90%;">
        <template #name="{ text }">
            <a>{{ text }}</a>
        </template>
        <template #customTitle>
            <span>
            <smile-outlined />
            效能指标
            </span>
        </template>
        <template #tags="{ text: tags }">
            <span>
            <a-tag
                v-for="tag in tags"
                :key="tag"
                :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
            >
                {{ tag.toUpperCase() }}
            </a-tag>
            </span>
        </template>
        <template #action="{ record }">
            <span>
            <a>增加</a>
            <a-divider type="vertical" />
            <a>删除</a>
            <a-divider type="vertical" />
            <a class="ant-dropdown-link">
                编辑
            </a>
            </span>
        </template>
        </a-table>
    </div>
  </template>

  <script>
  import { defineComponent, onMounted, reactive, toRefs } from 'vue';
  import KnowlegeGraph from './graph/KnowlegeGraph.vue';

  export default defineComponent({
    props:{
        efficiencies:Array
    },
    components: {
        KnowlegeGraph
    },
    setup(props) {
        const columns = [
            {
            dataIndex: 'name',
            key: 'name',
            slots: { title: 'customTitle', customRender: 'name' },
            },
            {
            title: '关联影响因子',
            dataIndex: 'effect',
            key: 'effect',
            },
            {
            title: '标签',
            key: 'tags',
            dataIndex: 'tags',
            slots: { customRender: 'tags' },
            },
            {
            title: '操作',
            key: 'action',
            slots: { customRender: 'action' },
            },
        ];

        const state = reactive({
            efficiencies: props.efficiencies,
            results:new Map([
                ['count',[0,3,1,1,0]],
                ['windowAvg',[1,32,0,0,1]],
                ['windowMax',[1,2,0,1,1]],
                ['windowMin',[0, 2, 1, 0, 1]],
                ['respTimeAvg',[0, 17, 0, 1, 1]],
                ['timelinessAvg',[1, 19, 0, 1, 0]],
                ['closeLoopTimeAvg',[1, 5, 1, 1, 1]]
            ]),
            effectMap: ['day', 'destID', 'month', 'target', 'turns'],
            data:[]
        })

        const initConfig = ()=> {
            var dataArr = [];
            for(var i = 1; i <= state.efficiencies.length; i++){
                var effect = state.results.get(state.efficiencies[i-1])
                var effectStr = ''
                for(var j = 0; j < effect.length; j++){
                    var str = (j == 1) ? state.effectMap[j] + '-' + effect[j] : state.effectMap[j]
                    if(effect[j] > 0){
                        effectStr += str + ', '
                    }
                }
                // 去除末尾','
                effectStr = effectStr.substring(0,effectStr.length - 2)

                dataArr.push({
                    key: ''+i,
                    name: state.efficiencies[i-1],
                    effect : effectStr,
                    tags: ['nice', 'developer']
                })
            }
            state.data = dataArr
            console.log(state.data.length)

        }

        onMounted(()=>{
            initConfig()
        })

        return {
            columns,
            ...toRefs(state)
        };
    },
  });
  </script>