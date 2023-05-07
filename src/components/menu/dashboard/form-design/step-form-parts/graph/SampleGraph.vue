<template>
    <div>
      <div id="sampleChart" :style="{ width: '300px', height: '400px' }"></div>
    </div>
</template>

<script>
  import { defineComponent, toRefs, reactive, onMounted } from 'vue'
  import * as echarts from 'echarts'
  
  export default defineComponent({
    setup() {
      const state = reactive({
        option: {
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: ["芳草地国际","实验小学","白家庄小学","外国语小学","师范学校附属","望京东园"],
              axisTick: {
                alignWithLabel: true,
              },
              axisLabel: { interval: 0, rotate: 30 },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '学校',
              type: 'bar',
              barWidth: '40%',
              data: [260,680,360,460,150,320],
            },
          ],
        },
      })
      const initeCharts = () => {
        let myChart = echarts.init(document.getElementById('sampleChart'))
        // 绘制图表
        myChart.setOption(state.option)
      }
      
      onMounted(() => {
        initeCharts()
      })

      return {
        ...toRefs(state),
      }
    },
  })
</script>
