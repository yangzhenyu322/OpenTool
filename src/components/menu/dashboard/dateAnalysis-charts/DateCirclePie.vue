<template>
    <div id="dateCirclePieChart"></div>
</template>

<script>
import { defineComponent, toRefs, reactive, onMounted } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'CustomPie',
  setup() {
    const state = reactive({
      option: {
        tooltip: {
            trigger: 'item',
            textStyle: {
              fontSize: 14
            }
        },
        legend: {
            bottom: 0,
            left: 'center'
        },
        series: [
            {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%','40%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 1048, name: '直接访问' },
                { value: 735, name: '博客链接' },
                { value: 580, name: '搜索引擎' },
                { value: 484, name: '同类推荐' },
                { value: 300, name: '广告联盟' }
            ]
            }
        ]
        },
    })

    var myChart;

    const initeCharts = () => {
      myChart = echarts.init(document.getElementById('dateCirclePieChart'))
      // 绘制图表
      myChart.setOption(state.option)
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