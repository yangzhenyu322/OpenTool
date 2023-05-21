<template>
      <div id="dateRadarChart"></div>
  </template>
  
  <script>
  import { defineComponent, toRefs, reactive, onMounted } from 'vue'
  import * as echarts from 'echarts'
  
  export default defineComponent({
    setup() {
      const state = reactive({
        option: {
            color: ['#FFE434','#00F9D8'],
            legend: {
                data: ['访问', '用户'],
                bottom: 0
            },
            tooltip: {
                trigger: 'item'
            },
            radar: {
                shape: 'circle',
                center: ['48%','48%'],
                axisName: {
                    color: 'black'
                },
                indicator: [
                { name: '电脑'},
                { name: '手机'},
                { name: 'ipad'},
                { name: 'CSDN'},
                { name: 'Github'},
                { name: '哔哩哔哩'}
                ],
            },
            series: [
                {
                name: 'Budget vs spending',
                type: 'radar',
                data: [
                    {
                        value: [4200, 3000, 20000, 35000, 42000, 18000],
                        name: '访问',
                        areaStyle: {
                            color: 'rgba(255, 228, 52, 0.4)'
                        }
                    },
                    {
                        value: [5000, 14000, 13000, 26000, 30000, 21000],
                        name: '用户',
                        areaStyle:{
                            color: 'rgba(0,249,216,0.4)'
                        }
                    }
                ]
                }
            ]
        }
      })
  
      var myChart;
  
      const initeCharts = () => {
        myChart = echarts.init(document.getElementById('dateRadarChart'))
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