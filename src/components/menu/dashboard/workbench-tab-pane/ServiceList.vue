<template>
  <!-- 新增功能请参考:https://next.antdv.com/components/table-cn，待完成功能：编辑、更多操作、接入后端数据 -->
  <div style="margin-bottom: 8px;display: flex;justify-content: space-between;">
    <a-row :gutter="[10]" style="width: 15%;">
      <a-col :span="12">
        <a-button class="add-btn" @click="handleAdd">新增</a-button>
      </a-col>
      <a-col :span="12">
        <a-button type="primary">编辑</a-button>
      </a-col>
    </a-row>
    <!-- 扩展内容 -->
    
    <!-- 扩展内容 -->
  </div>
  <a-table :columns="columns" :data-source="dataSource">
    <!-- 操作列名 -->
    <template #headerCell="{ column }">
      <template v-if="column.key === 'id'">
        <span>
          <caret-down-outlined />
          服务ID
        </span>
      </template>
    </template>

    <!-- 操作表数据 -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'id'">
        <a>
          ServiceID-{{ record.id }}
        </a>
      </template>
      
      <template v-else-if="column.key === 'state'">
        <span>
          <a-tag
            :color="record.state === '正常' ? 'green' : 'volcano'"
          >
            {{ record.state }}
          </a-tag>
        </span>
      </template>

      <template v-else-if="column.key === 'action'">
        <span>
          <a class="edit-text">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            v-if="dataSource.length"
            title="确定要删除？"
            @confirm="onDelete(record.id)"
          >
            <a class="delete-text">删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a class="more-action">
            更多操作
            <down-outlined />
          </a>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script>
import { defineComponent, reactive, toRefs, computed } from "vue";

export default defineComponent({
  setup() {
    const state =reactive({
      columns: [
      {
        title: '服务ID', // 列头显示文字
        key: 'id',  // key, 如果已经设置了唯一的 dataIndex，可以忽略这个属性
        dataIndex: 'id', //列数据在数据项中对应的路径，支持通过数组查询嵌套路径
      },
      {
        title: '服务名',  
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '描述',
        key: 'description',
        dataIndex: 'description',
      },
      {
        title: '服务状态',
        key: 'state',
        dataIndex: 'state',
      },
      {
        title: '创建时间',
        key: 'time',
        dataIndex: 'time',
      },
      {
        title: '操作',
        key: 'action',
        dataIndex: 'action'
      }],
      dataSource: [
      {
        id: '1',
        name: 'user-service',
        description: '用户服务',
        state: '正常',
        time: '2023/5/25',
      },
      {
        id: '2',
        name: 'dashboard-service',
        description: '仪表盘服务',
        state: '异常',
        time: '2023/5/25',
      },
      {
        id: '3',
        name: 'general-tool-service',
        description: '实用工具服务',
        state: '正常',
        time: '2023/5/25',
      },
      {
        id: '4',
        name: 'ai-tool-service',
        description: 'AI工具服务',
        state: '正常',
        time: '2023/5/25',
      },
      {
        id: '5',
        name: 'api-open-platform-service',
        description: 'API开放平台服务',
        state: '正常',
        time: '2023/5/25',
      }]
    })

    const count = computed(() => state.dataSource.length + 1);

    // 新增列
    const handleAdd = () => {
      const newData = {
        id: `${count.value}`,
        name: 'service-' + `${count.value}`,
        description: '服务' + `${count.value}`,
        state: '正常',
        time: '2023/5/25',
      };
      state.dataSource.push(newData);
    };

    // 删除列
    const onDelete = (id) => {
      state.dataSource = state.dataSource.filter(item => item.id !== id)
    }

    return {
      ...toRefs(state),
      handleAdd,
      onDelete
    }
  }
})
</script>

<style scoped>
.add-btn{
  background-color: rgb(25,195,125);
  color: white;
}
.add-btn:hover{
  background-color: rgba(25,195,125,0.8);
  color: white;
  border: 1px solid transparent;
}
.delete-text{
  color: rgb(252,85,49);
}
.delete-text:hover{
  color: rgba(248, 142, 118);
}
.more-action{
  color: rgb(241,178,38)
}
.more-action:hover{
  color: rgb(248, 211, 131)
}
.more-action:active{
  color: rgb(210, 146, 8)
}
</style>