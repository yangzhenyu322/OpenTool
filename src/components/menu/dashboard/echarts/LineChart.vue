<template>
    <div class="center-content">
      <div id="lineChart" :style="{ width: '100%', height: '78vh' }"></div>
    </div>
</template>

<script>
  import { defineComponent, toRefs, reactive, onMounted } from 'vue'
  import * as echarts from 'echarts'
  import TestJson from '@/assets/json/aqi-beijing.json'
  
  export default defineComponent({
    setup() {
      const data = TestJson
      const state = reactive({
        option : {
          title: {
            text: '北京 空气质量指数',
            left: '1%'
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '5%',
            right: '15%',
            bottom: '10%'
          },
          xAxis: {
            data: data.map(function (item) {
              return item[0];
            })
          },
          yAxis: {},
          toolbox: {
            right: 10,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {},
              saveAsImage: {}
            }
          },
          dataZoom: [
            {
              startValue: '2014-06-01'
            },
            {
              type: 'inside'
            }
          ],
          visualMap: {
            top: 50,
            right: 10,
            pieces: [
              {
                gt: 0,
                lte: 50,
                color: '#93CE07'
              },
              {
                gt: 50,
                lte: 100,
                color: '#FBDB0F'
              },
              {
                gt: 100,
                lte: 150,
                color: '#FC7D02'
              },
              {
                gt: 150,
                lte: 200,
                color: '#FD0100'
              },
              {
                gt: 200,
                lte: 300,
                color: '#AA069F'
              },
              {
                gt: 300,
                color: '#AC3B2A'
              }
            ],
            outOfRange: {
              color: '#999'
            }
          },
          series: {
            name: 'Beijing AQI',
            type: 'line',
            data: data.map(function (item) {
              return item[1];
            }),
            markLine: {
              silent: true,
              lineStyle: {
                color: '#333'
              },
              data: [
                {
                  yAxis: 50
                },
                {
                  yAxis: 100
                },
                {
                  yAxis: 150
                },
                {
                  yAxis: 200
                },
                {
                  yAxis: 300
                }
              ]
            }
          }
        }
      })

      var myChart;

      const initeCharts = () => {
        myChart = echarts.init(document.getElementById('lineChart'))
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