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
    { value: 2700, name: '房租水电' },
    { value: 1500, name: '饮食' },
    { value: 1000, name: '公积金' },
    { value: 500, name: '日常用品' },
    { value: 1000, name: '社交娱乐' },
  ],
})

const getOption = state => {
  var option = {
      title: {
          text: '月消费支出',
          subtext: '收入支出',
          left: 'center'
      },
      tooltip: {
          trigger: 'item'
      },
      legend: {
          orient: 'vertical',
          left: 'left'
      },
      series: [
          {
          name: 'Access From',
          type: 'pie',
          radius: '50%',
          data: state.data,
          emphasis: {
              itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
          }
          }
      ]
  }
  return option
}

var myChart;

const initeCharts = () => {
  myChart = echarts.init(document.getElementById(props.id))
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