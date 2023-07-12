<template>
    <div id="dateBarChart" :style="{ width: '100%', height: '78vh' }"></div>
</template>

<script>
import { defineComponent, reactive, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  props:{
    times: Array,
    accessData: Array
  },
  setup(props) {
    const state = reactive({
      times: props.times,
      accessData: props.accessData
    })

    const getOption = (state) => {
      var option = {
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
          data: state.times
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
            data: state.accessData[0]
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
            data: state.accessData[1]
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
            data: state.accessData[2]
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
            data: state.accessData[3]
          }
        ]
      }

      return option
    }

    var myChart;

    const initeCharts = () => {
      myChart = echarts.init(document.getElementById('dateBarChart'))
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

    // option参数更新时更新图表值
    watch(()=> props.accessData, () => {
      state.times = props.times
      state.accessData = props.accessData

      myChart.setOption(getOption(state))
    })

    return {
    }
  },
})
</script>