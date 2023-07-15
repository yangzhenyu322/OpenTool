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
                  <span class="show-num" v-if="operationDate">{{ formatNumber(operationDate.accessNum) }}</span>
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
                  <span class="show-num" v-if="operationDate">{{ formatNumber(operationDate.userNum) }}</span>
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
                  <span class="show-num" v-if="operationDate">{{ formatNumber(operationDate.collectNum) }}</span>
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
                  <span class="show-num" v-if="operationDate">{{ formatNumber(operationDate.contributionNum) }}</span>
                </div>
              </div>
          </a-card>
        </a-col>
      </a-row>
      <div style="background-color: white;margin-top: 20px;">
        <el-date-picker
          v-model="dateValue"
          :format= "startTime + ' 至 ' + endTime"
          placeholder="选择周"
          type="week"
          @change="changeDate"
          style="margin-right: 25%;"
        />

        <a-radio-group v-model:value="dataShow" style="margin-top: 20px;">
          <a-radio-button value="trendChart">趋势图</a-radio-button>
          <a-radio-button value="dataList">数据列表</a-radio-button>
        </a-radio-group>

        <DateLineChartVue v-if="dataShow == 'trendChart'" style="width:98%;height: 350px;margin-top: 10px;" :times="times" :accessData="accessData" />
        <DateBarChart v-if="dataShow == 'dataList'" style="width:98%;height: 350px;margin-top: 10px;" :times="times" :accessData="accessData"/>
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
  import { defineComponent, ref, reactive, toRefs } from 'vue'
  import DateLineChartVue from './dateAnalysis-charts/DateLineChart.vue';
  import DateBarChart from './dateAnalysis-charts/DateBarChart.vue';
  import DateRadarChartVue from './dateAnalysis-charts/DateRadarChart.vue';
  import DateCirclePie from './dateAnalysis-charts/DateCirclePie.vue';
  import DateNightingaleChart from './dateAnalysis-charts/DateNightingaleChart.vue';
  import dayjs from 'dayjs'
  import axios from 'axios'

  export default defineComponent({
    components:{
      DateLineChartVue,
      DateBarChart,
      DateRadarChartVue,
      DateCirclePie,
      DateNightingaleChart,
    },
    setup() {
      // 1、网站运营数据统计
      const operationDate = ref(null)
      const getOperationDataAPI = () => {
        axios.get(`/dashboard/data-analysis/operation`)
          .then(res => {
              operationDate.value = res.data.data;
          })
          .catch(err => {
              console.error(err);
          })
      }
      getOperationDataAPI()

      // 数据格式转换，例：12344 => 12,344
      const formatNumber = (value) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };

      // 2、用户数据分析
      const state = reactive({
        dataShow : 'trendChart',
        dateValue : '',
        startTime : null,
        endTime : null,
        times : [],
        fullTimes : [],
        accessData: []
        // accessData: [[140, 232, 101, 264, 90, 340, 250], [120, 282, 111, 234, 220, 340, 310], [220, 402, 231, 134, 190, 230, 120], [220, 302, 181, 234, 210, 290, 150]]
      })


      // 获取一周时间范围内的数据
      const oneDayMillisseconds = 24 * 60 * 60 * 1000;
      const getLastWeekDate = (curDate = null) => {
        // 更新time和fullTimes数据
        state.times = []
        state.fullTimes = []

        // curDate为null则自动获取近一周日期，不为null则返回curData开始的一周
        const currentDate = curDate ? new Date(curDate) : new Date();
        const previousWeekDate = new Date(currentDate.getTime() - oneDayMillisseconds * 8)

        const timeLength = 7
        for(var i = 1; i <= timeLength; i++){
          var tempDate = new Date(previousWeekDate.getTime() + i * oneDayMillisseconds)
          var tempYear = String(tempDate.getFullYear())
          var tempMonth = String(tempDate.getMonth() + 1).padStart(2, '0');
          var tempDay = String(tempDate.getDate()).padStart(2, '0')
          state.times.push(`${tempMonth}-${tempDay}`)
          state.fullTimes.push(`${tempYear}-${tempMonth}-${tempDay}`)
        }
      }
      getLastWeekDate()

      // 从后台请求accessData数据
      const getDataByDateRangeAPI = (startTime, endTime)=> {
        axios.get(`/dashboard/data-analysis/date/${startTime}/${endTime}`)
          .then(res => {
              state.accessData = []
              const dataRes = []
              dataRes.push(res.data.data['accessData']);
              dataRes.push(res.data.data['userData']);
              dataRes.push(res.data.data['collectData']);
              dataRes.push(res.data.data['contributeData']);
              state.accessData = dataRes
          }).catch(err => {
              console.log(err)
          })
      }
      // 初始化accessData
      getDataByDateRangeAPI(state.fullTimes[0], state.fullTimes[state.fullTimes.length - 1])

      const changeDate = ()=> {
        state.startTime = dayjs(state.dateValue).startOf('week').format('YYYY-MM-DD')
        state.endTime = dayjs(state.dateValue).endOf('week').format('YYYY-MM-DD')
        getLastWeekDate(state.dateValue.getTime() + 7*oneDayMillisseconds )

        getDataByDateRangeAPI(state.startTime, state.endTime)

      }

      return{
        ...toRefs(state),
        operationDate,
        formatNumber,
        changeDate
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
  height: 300px;
}
</style>