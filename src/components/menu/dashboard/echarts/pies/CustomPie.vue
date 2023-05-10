<template>
      <div id="customPieChart"></div>
  </template>
  
  <script>
  import { defineComponent, toRefs, reactive, onMounted } from 'vue'
  import * as echarts from 'echarts'
  
  export default defineComponent({
    name: 'CustomPie',
    setup() {
      const state = reactive({
        option: {
            title: {
                text: 'Referer of a Website',
                subtext: 'Fake Data',
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
                data: [
                    { value: 1048, name: 'Search Engine' },
                    { value: 735, name: 'Direct' },
                    { value: 580, name: 'Email' },
                    { value: 484, name: 'Union Ads' },
                    { value: 300, name: 'Video Ads' }
                ],
                emphasis: {
                    itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
                }
            ]
        },
      })
  
      var myChart;
  
      const initeCharts = () => {
        myChart = echarts.init(document.getElementById('customPieChart'))
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