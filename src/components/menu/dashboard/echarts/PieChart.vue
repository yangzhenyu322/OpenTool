<template>
    <div class="center-content" style="background-color: rgb(245,245,245);">
        <a-row :gutter="10">
            <a-col :span="12">
                <a-card title="传统饼状图">
                    <CustomPie style="width: 100%;height: 50vh;" />
                </a-card>
            </a-col>
            <a-col :span="12">
                <a-card title="圆环饼状图">
                    <CirclePie style="width: 100%;height: 50vh;" />
                </a-card>
            </a-col>
        </a-row>
        <a-card title="数据共享饼状图">
            <DataSharedPie style="width: 100%;height: 70vh;" />
        </a-card>
    </div>
  </template>
  
  <script>
  import { defineComponent} from 'vue'
  import CustomPie from './pies/CustomPie.vue';
  import CirclePie from './pies/CirclePie.vue';
  import DataSharedPie from './pies/DataSharedPie.vue';

  export default defineComponent({
    components: {
        CustomPie,
        CirclePie,
        DataSharedPie
    },
    setup() {
      return {
      }
    },
  })
  </script>