<template>
    <div id="dateBarChart" :style="{ width: '100%', height: '78vh' }"></div>
</template>

<script>
import { defineComponent, toRefs, ref, reactive, onMounted } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  props:{
    times: Array
  },
  setup(props) {
    const times = ref(props.times)

    const state = reactive({
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: times
        },
        series: [
          {
            name: '访问量',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '用户数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '收藏数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [150, 212, 201, 154, 190, 330, 410]
          },
          {
            name: '贡献数',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [820, 832, 901, 934, 1290, 1330, 1320]
          }
        ]
      },
    })

    var myChart;

    const initeCharts = () => {
      myChart = echarts.init(document.getElementById('dateBarChart'))
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