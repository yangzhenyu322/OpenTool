<template>
    <a-row type="flex" wrap="true" :gutter="[16,8]">
        <a-col :span="6" v-for="item in showReuslts" :key="item.key"><div class="DAGChart" style="width: 100%;height: 500px;"></div></a-col>
    </a-row>
</template>

<script>
  import { defineComponent, toRefs, reactive, onMounted } from 'vue'
  import * as echarts from 'echarts'
  
  export default defineComponent({
    props: {
        efficiencies:Array,
        results:Map
    },

    setup(props) {
      const state = reactive({
        efficiencies: props.efficiencies,
        results: props.results,
      })

      var myChart

      const showReuslts = new Map()
      for( let key of state.efficiencies){
          showReuslts.set(key,state.results.get(key))
      }
      
      const initeCharts = () => {
        const roseCharts = document.getElementsByClassName('DAGChart')
        var i = 0;
        for(let [key,value] of showReuslts){
            // 更新option配置 
            // 节点配置
            var data = [
                {
                name: 'day',
                x: 0,
                y: 0
                },
                {
                name: 'destID-'+value[1],
                x: 0,
                y: 100
                },
                {
                name: 'month',
                x: 0,
                y: 200
                },
                {
                name: 'target',
                x: 0,
                y: 300
                },
                {
                name: 'turns',
                x: 0,
                y: 400
                },
                {
                name: key,
                x: 250,
                y: 200
                },
            ]
            // 连线配置
            var links = []
            for(var j = 0; j < value.length; j++){
                if(value[j] > 0){
                    // 有关联
                    links.push({
                        source: j,
                        target: 5,
                        symbolSize: [5, 20],
                        lineStyle: {
                            width: 5,
                            curveness: 0.1,
                            color:"red"
                        }
                    })
                }else{
                    // 无关联
                    links.push({
                        source: j,
                        target: 5,
                        lineStyle: {
                            type:'dashed'
                        }
                    })
                }
            }
            var option = {
                title: {
                    text: key
                },
                tooltip: {},
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                series: [
                    {
                    type: 'graph',
                    layout: 'none',
                    symbolSize: 50,
                    roam: true,
                    label: {
                        show: true
                    },
                    edgeSymbol: ['circle', 'arrow'],
                    edgeSymbolSize: [4, 10],
                    edgeLabel: {
                        fontSize: 20
                    },
                    data: data,
                    links: links,
                    lineStyle: {
                        opacity: 0.9,
                        width: 2,
                        curveness: 0,
                        color: "black"
                    }
                    }
                ]
            }

            myChart = echarts.init(roseCharts[i]);
            // 绘制图表
            myChart.setOption(option)
            // 更新下标
            i++
        }
      }
      
      onMounted(() => {
        initeCharts()
      })

    // 窗口大小改变时重新设置图表大小
    window.addEventListener('resize', ()=>{
        myChart.resize()
    })

    return {
        ...toRefs(state),
        showReuslts
    }
    },
  })
</script>