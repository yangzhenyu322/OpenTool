<template>
    <div id="dateLineChart"></div>
</template>

<script>
import { defineComponent, toRefs, ref, reactive, onMounted } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  props:{
    startTime : String,
    times: Array
  },
  setup(props) {
    const times = ref(props.times)
    const state = reactive({
      option : {
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
            data: times
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
            data: [140, 232, 101, 264, 90, 340, 250]
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
            data: [120, 282, 111, 234, 220, 340, 310]
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
            data: [220, 402, 231, 134, 190, 230, 120]
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
            data: [220, 302, 181, 234, 210, 290, 150]
          }
        ]
      }
    })

    var myChart;

    const initeCharts = () => {
      myChart = echarts.init(document.getElementById('dateLineChart'))
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