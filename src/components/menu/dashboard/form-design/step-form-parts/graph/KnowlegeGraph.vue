<template>
    <div>
      <div id="knowChart" :style="{ width: '100%', height: '700px' }"></div>
    </div>
</template>

<script>
  import { defineComponent, toRefs, reactive, onMounted } from 'vue'
  import * as echarts from 'echarts'
  import TestJson from '@/assets/json/les-miserables.json'
  
  export default defineComponent({
    setup() {
      const state = reactive({
        option: {},
        graph: TestJson
      })

      var myChart

    
      const initeCharts = () => {
        myChart = echarts.init(document.getElementById('knowChart'))
        // 绘制图表
        state.option = {
            tooltip: {},
            legend: [
            {
                data: state.graph.categories.map((a) =>{
                    return a.name;
                })
            }
            ],
            series: [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'none',
                data: state.graph.nodes,
                links: state.graph.links,
                categories: state.graph.categories,
                roam: true,
                label: {
                show: true,
                position: 'right',
                formatter: '{b}'
                },
                labelLayout: {
                hideOverlap: true
                },
                scaleLimit: {
                min: 0.4,
                max: 2
                },
                lineStyle: {
                color: 'source',
                curveness: 0.3
                }
            }
            ]
        };

        myChart.setOption(state.option);
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
      }
    },
  })
</script>
