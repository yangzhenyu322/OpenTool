<template>
    <div id="dateNightingalePieChart"></div>
</template>

<script>
import { defineComponent, toRefs, reactive, onMounted } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'CustomPie',
  setup() {
    const state = reactive({
      
    })

    const getOption = (state) => {
      var option = {
        legend: {
            bottom:0,
        },
        tooltip: {
            trigger: 'item'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        series: [
            {
            name: '用户占比',
            type: 'pie',
            radius: ['7%','60%'],
            center: ['50%', '40%'],
            roseType: 'radius',
            data: [
                { value: 36, name: '游客' },
                { value: 27, name: '普通用户' },
                { value: 17, name: 'VIP' },
                { value: 11, name: '管理员' },
                { value: 4, name: '超级管理员' },
            ]
            }
        ]}

      return option
    }

    var myChart;

    const initeCharts = () => {
      myChart = echarts.init(document.getElementById('dateNightingalePieChart'))
      // 绘制图表
      myChart.setOption(getOption(state))
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