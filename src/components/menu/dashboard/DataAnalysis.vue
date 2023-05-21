<template>
  <div class="center-content" >
      <a-row :gutter="24">
        <a-col :span="6">
          <a-card>
            <template #title>
              <div class="card-title">
                <span style="font-size: 15px;">访问数</span>
                <a-tag color="cyan" class="title-logo">周</a-tag>
              </div>
            </template>
              <div class="show-item">
                <BankTwoTone class="show-logo"  twoToneColor="#00CED1" />
                <div style="line-height: 10px;">
                  <div class="show-text">总访问数</div>
                  <span class="show-num">112,700</span>
                </div>
              </div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <template #title>
              <div class="card-title">
                <span style="font-size: 15px;">用户</span>
                <a-tag color="green" class="title-logo">月</a-tag>
              </div>
            </template>
              <div class="show-item">
                <IdcardTwoTone class="show-logo" twoToneColor="#ADFF2F"/>
                <div style="line-height: 10px;">
                  <div class="show-text">总用户数</div>
                  <span class="show-num">201,617</span>
                </div>
              </div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <template #title>
              <div class="card-title">
                <span style="font-size: 15px;">收藏</span>
                <a-tag color="orange" class="title-logo">月</a-tag>
              </div>
            </template>
              <div class="show-item">
                <HeartTwoTone class="show-logo"  twoToneColor="#FFD700"/>
                <div style="line-height: 10px;">
                  <div class="show-text">总收藏数</div>
                  <span class="show-num">8,790</span>
                </div>
              </div>
          </a-card>
        </a-col>
        <a-col :span="6">
          <a-card>
            <template #title>
              <div class="card-title">
                <span style="font-size: 15px;">贡献</span>
                <a-tag color="purple" class="title-logo">年</a-tag>
              </div>
            </template>
              <div class="show-item">
                <CrownTwoTone class="show-logo" twoToneColor="#800080"/>
                <div style="line-height: 10px;">
                  <div class="show-text">总贡献数</div>
                  <span class="show-num">13,860</span>
                </div>
              </div>
          </a-card>
        </a-col>
      </a-row>
      <div style="background-color: white;margin-top: 20px;">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          :start-placeholder="startTime"
          :end-placeholder="endTime"
          style=" margin-right: 25%;"
        />
        <a-radio-group v-model:value="dataShow" style="margin-top: 20px;">
          <a-radio-button value="trendChart">趋势图</a-radio-button>
          <a-radio-button value="dataList">数据列表</a-radio-button>
        </a-radio-group>

        <DateLineChartVue v-if="dataShow == 'trendChart'" style="width:98%;height: 350px;margin-top: 10px;" :times="times" />
        <DateBarChart v-if="dataShow == 'dataList'" style="width:98%;height: 350px;margin-top: 10px;" :times="times" />
      </div>

      <a-row :gutter="20" style="margin-top: 15px;">
        <a-col :span="8">
          <a-card>
            <template #title>
              <div class="card-title">
                <span style="font-size: 15px;">流量分布</span>
              </div>
            </template>
            <DateRadarChartVue class="pie-chart"/>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card>
            <template #title>
              <div class="card-title">
                <span style="font-size: 15px;">访问来源</span>
              </div>
            </template>
              <DateCirclePie class="pie-chart"/>
          </a-card>
        </a-col>
        <a-col :span="8">
          <a-card>
            <template #title>
              <div class="card-title">
                <span style="font-size: 15px;">用户占比</span>
              </div>
            </template>
            <DateNightingaleChart class="pie-chart"/>
          </a-card>
        </a-col>
      </a-row>

  </div>
  
</template>

<script>
  import { defineComponent, reactive, toRefs } from 'vue'
  import DateLineChartVue from './dateAnalysis-charts/DateLineChart.vue';
  import DateBarChart from './dateAnalysis-charts/DateBarChart.vue';
  import DateRadarChartVue from './dateAnalysis-charts/DateRadarChart.vue';
  import DateCirclePie from './dateAnalysis-charts/DateCirclePie.vue';
  import DateNightingaleChart from './dateAnalysis-charts/DateNightingaleChart.vue';

  export default defineComponent({
    components:{
      DateLineChartVue,
      DateBarChart,
      DateRadarChartVue,
      DateCirclePie,
      DateNightingaleChart
    },
    setup() {
      const currentDate = new Date();
      const oneDayMillisseconds = 24 * 60 * 60 * 1000;
      const previousWeekDate = new Date(currentDate.getTime() - oneDayMillisseconds * 6)

      const preYear = previousWeekDate.getFullYear();
      const preMonth = String(previousWeekDate.getMonth() + 1).padStart(2, '0');
      const preDay = String(previousWeekDate.getDate()).padStart(2, '0');

      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');

      const state = reactive({
        dataShow : 'trendChart',
        dateValue : '',
        startTime : `${preYear}-${preMonth}-${preDay}`,
        endTime : `${year}-${month}-${day}`,
        times : [`${preMonth}-${preDay}`]
      })

      const timeLength = 7
      for(var i = 1; i < timeLength; i++){
        var tempDate = new Date(previousWeekDate.getTime() + i * oneDayMillisseconds)
        var tempYear = tempDate.getFullYear();
        var tempMonth = String(tempDate.getMonth() + 1).padStart(2, '0');
        var tempDay = String(tempDate.getDate()).padStart(2, '0')
        state.times.push(`${tempMonth}-${tempDay}`)
      }

      return{
        ...toRefs(state),
      }
    }
  })
</script>

<style scoped>
.card-title{
  display: flex;
  justify-content: space-between;
}
.title-logo{
  margin-left: auto;
  margin-right: 0;
}
.show-item{
  display: flex;
  justify-content: space-between;
  padding-left: 2%;
  padding-right: 2%;
}
.show-logo{
  font-size: 50px;
}
.show-text{
  color: rgba(0,0,0,.45);
  line-height: 18px;
  font-size: 16px;
  margin-bottom:12px;
}

.show-num{
  font-size: 22px;
  font-weight: 700;
  margin: 20px;
}

.pie-chart{
  width:100%;
  height: 350px;
}
</style>