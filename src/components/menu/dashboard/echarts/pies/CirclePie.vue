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
    { value: 1048, name: '教育' },
    { value: 735, name: '体育' },
    { value: 580, name: '国防' },
    { value: 484, name: '科技' },
    { value: 300, name: '民生' }
  ],
})

const getOption = state => {
  var option = {
    title: {
        text: '国家财政支出',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        bottom: '0%',
        left: 'center'
    },
    series: [
        {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
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
            fontSize: 40,
            fontWeight: 'bold'
            }
        },
        labelLine: {
            show: false
        },
        data: state.data
        }
    ]}

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