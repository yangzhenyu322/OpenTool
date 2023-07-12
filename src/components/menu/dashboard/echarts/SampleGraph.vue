<template>
  <div class="center-content">
    <div id="sampleChart" :style="{ width: '100%', height: '78vh' }"></div>
  </div>
</template>

<script>
import { defineComponent, reactive, onMounted } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  setup() {
    const state = reactive({

    })

    const getOption = (state) => {
      var option = {
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
      }

      return option
    }


    var myChart;

    const initeCharts = () => {
      myChart = echarts.init(document.getElementById('sampleChart'))
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

    return {
    }
  },
})
</script>