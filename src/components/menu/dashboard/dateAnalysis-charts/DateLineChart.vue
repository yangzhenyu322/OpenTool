<template>
    <div id="dateLineChart"></div>
</template>

<script>
import { defineComponent,  reactive, onMounted, watch } from 'vue'
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

    const getOption = (state)=> {
      var option = {
        color: ['rgba(142,241,207,1)', 'rgb(79,185,253,1)', 'rgba(183,53,171,1)', 'rgba(251,188,61,1)'],
        title: {
          text: '流量趋势',
          show: false
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: ['访问量', '用户数','收藏数', '贡献数']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
          show: true,
          backgroundColor: 'rgb(249,249,249)'
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: state.times
          }
        ],
        yAxis: [
          {
            type: 'value',
            // boundaryGap: [0,'30%']
          }
        ],
        series: [
          {
            name: '访问量',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(128, 255, 165,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(1, 191, 236,0.8)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: state.accessData[0]
          },
          {
            name: '用户数',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(0, 221, 255,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(77, 119, 255,0.8)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: state.accessData[1]
          },
          {
            name: '收藏数',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(255, 0, 135,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(135, 0, 157,0.8)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: state.accessData[2]
          },
          {
            name: '贡献数',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
              width: 0
            },
            showSymbol: false,
            label: {
              show: true,
              position: 'top'
            },
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(255, 191, 0,0.4)'
                },
                {
                  offset: 1,
                  color: 'rgba(224, 62, 76,0.8)'
                }
              ])
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
      myChart = echarts.init(document.getElementById('dateLineChart'))
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

    // 监听props.accessData的值，当其改变时更新myChart
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