<template>
      <div :id="props.id"></div>
</template>

<script setup>
import { reactive, onMounted, defineProps } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  id:String
})

const state = reactive({
  data: [
    ['product', '2018', '2019', '2020', '2021', '2022', '2023'],
    ['奶茶', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
    ['抹茶拿铁', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
    ['奶酪可可', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
    ['核桃布朗尼蛋糕', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
  ],
})

const getOption = state => {
  var option = {
      legend: {},
      tooltip: {
          trigger: 'axis',
          showContent: false
      },
      dataset: {
          source: state.data
      },
      xAxis: { type: 'category' },
      yAxis: { gridIndex: 0 },
      grid: { top: '55%' },
      series: [
      {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' }
      },
      {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' }
      },
      {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' }
      },
      {
          type: 'line',
          smooth: true,
          seriesLayoutBy: 'row',
          emphasis: { focus: 'series' }
      },
      {
          type: 'pie',
          id: 'pie',
          radius: '30%',
          center: ['50%', '25%'],
          emphasis: {
          focus: 'self'
          },
          label: {
          formatter: `{b}: {@${state.data[0][1]}} ({d}%)`
          },
          encode: {
          itemName: 'product',
          value: `${state.data[0][1]}`,
          tooltip: `${state.data[0][1]}`
          }
      }
      ]
  }

  return option
}

var myChart;

const initeCharts = () => {
  myChart = echarts.init(document.getElementById(props.id))
  myChart.on('updateAxisPointer', function (event) {
      const xAxisInfo = event.axesInfo[0];
      if (xAxisInfo) {
      const dimension = xAxisInfo.value + 1;
      myChart.setOption({
          series: {
          id: 'pie',
          label: {
              formatter: '{b}: {@[' + dimension + ']} ({d}%)'
          },
          encode: {
              value: dimension,
              tooltip: dimension
          }
          }
      });
      }
  })
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
</script>