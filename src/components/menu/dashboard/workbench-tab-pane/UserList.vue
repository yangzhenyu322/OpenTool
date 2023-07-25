<template>
  <a-table 
    :columns="columns"
    :data-source="dataSource" 
    :scroll="{ y: 500 }"
    :loading="loading"
    :pagination="paginationConfig"
    @change="handleTableChange"
  bordered>
    <!-- 1.操作列名 -->
    <template #headerCell="{ column }">
      <template v-if="column.dataIndex === 'userId'">
        <span>
          <caret-down-outlined />
          {{ column.title }}
        </span>
      </template>
    </template>

    <!-- 2.操作表数据 -->
    <template #bodyCell="{ column, record }" >
      <template v-if="column.dataIndex === 'userId'">
        <a>
          UID-{{ record.userId }}
        </a>
      </template>

      <!-- 2.1编辑 -->
      <template v-for="item in ['userName','nickName']" :key="item">
        <template v-if="column.dataIndex === item">
          <a-input
            v-if="editableData[record.key]"
            v-model:value="editableData[record.key][item]"
            style="margin: -5px 0"
          />
          <span v-else>
            {{ record[item] }}
          </span>
        </template>
      </template>
      
      <template v-if="column.dataIndex === 'role'">
        <a-select
          v-if="editableData[record.key]"
          v-model:value="editableData[record.key].role"
          style="margin: -5px 0"
        >
          <a-select-option value="超级管理员">超级管理员</a-select-option>
          <a-select-option value="VIP用户">VIP用户</a-select-option>
          <a-select-option value="普通用户">普通用户</a-select-option>
        </a-select>

        <span v-else>
          {{ record.role }}
        </span>
      </template>

      <!-- 2.2状态 -->
      <template v-if="column.dataIndex === 'status'">
        <span>
          <a-tag v-if="record.status === '正常'" color="green">
            {{ record.status }}
          </a-tag>
          <a-tag v-else-if="record.status === '停用'" color="#FFA54F">
            {{ record.status }}
          </a-tag>
          <a-tag v-else color="volcano">
            {{ record.status }}
          </a-tag>
        </span>
      </template>

      <!-- 3.操作 -->
      <template v-if="column.dataIndex === 'operation'">
          <!-- 3.1编辑 -->
          <span v-if="editableData[record.key]">
            <a @click="confirmSave(record.key)">保存</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确认取消?" @confirm="cancel(record.key)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="edit(record.key)">编辑</a>
            <!-- 3.2删除 -->
            <a-divider type="vertical" />
            <a-popconfirm title="确认删除？" @confirm="confirmDelete(record.key)">
              <a style="color: red;">删除</a>
            </a-popconfirm>
            <!-- 3.3停用 -->
            <a-divider type="vertical" />
            <a @click="confirmStart(record.key)" v-if="record.status === '停用'">
              <a style="color: green;">启用</a>
            </a>
            <a-popconfirm title="确认停用？" @confirm="confirmStop(record.key)" v-else>
              <a style="color: #DEB887;">停用</a>
            </a-popconfirm>
          </span>
      </template>
    </template>
  </a-table>
</template>

<script>
import { cloneDeep } from 'lodash-es';
import { defineComponent, reactive, ref } from 'vue';
import axios from 'axios';

const columns = [
  {
    title: '编号',  // 表头名
    dataIndex: 'userId',  // 列id  
    width: '10%', // 列宽度设置
  },
  {
    title: '账号',
    dataIndex: 'userName', 
    width: '15%',
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    width: '15%',
  },
  {
    title: '角色',
    dataIndex: 'role',
    width: '15%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '10%',
  },
  {
    title: '最近登录时间',
    dataIndex: 'loginDate',
    width: '18%',
  },
  {
    title: '操作',
    dataIndex: 'operation',
  },
];

export default defineComponent({
  setup() {
    const dataSource = ref([]);
    const editableData = reactive({});
    const loading = ref(false)

    // 分页设置
    const paginationConfig = ref({
      total: 0, // 总数据条数
      current: 1, // 当前页
      pageSize: 10, // 每页显示10条数据
      showQuickJumper: true, // 是否显示跳转页面 
      showSizeChanger: true, // 是否开启分页数据条数
      pageSizeOptions: ["5","10", "20", "50", "100"], //每页中显示的数据
      showTotal: total => `共有${total}条数据`
    })

    const handleTableChange = (pagination) => {
      let { current, pageSize } = pagination
      paginationConfig.value = Object.assign(paginationConfig.value, { current, pageSize}) 

      getUserPageList()
    }

    const getUserPageList = async () => {
      try {
        loading.value = true
        const page = paginationConfig.value.current
        const size = paginationConfig.value.pageSize

        const res = await axios.get(`/user/${page}/${size}`)
        const result = res.data
        paginationConfig.value.total = result.total

        const data = []
        result.userInfos.forEach((item, index) => {
          const keyIndex = (page - 1) * size + index // UUID:标识唯一行
          item['key'] = keyIndex.toString()
          data.push(item)
        })

        dataSource.value = data
        loading.value = false
      } catch (error) {
        console.error('请求失败:', error)
        loading.value = false
      }
    }

    getUserPageList()

    // CRUD操作
    // 编辑
    const edit = key => {
      editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);

    };
    const confirmSave = key => {
      // 更新数据源
      Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
      // 更新后台用户数据
      // 待：设置updateBy
      updateUser(dataSource.value.filter(item => item.key === key)[0])
      delete editableData[key];
    };
    const cancel = key => {
      delete editableData[key];
    };

    const updateUser = async (user) => {
      try {
        const res = await axios.put(`/user/`, user)
        console.log(res.data.msg)
      } catch (error) {
        console.error(error)
      }
    } 

    // 删除
    const confirmDelete = key => {
      // 删除后台用户数据
      deleteUser(dataSource.value.filter(item => item.key === key)[0].userId)
    }

    const deleteUser = async (id) => {
      try {
        // await 是用来等axios请求完成后执行try里面axios下面的语句，对于在外面函数的调用依然不是按顺序执行
        const res = await axios.delete(`/user/${id}`)
        console.log(`UID-${id}: ${res.data.msg}`)
        // 更新数据源
        getUserPageList()
      } catch (error) {
        console.error(error)
      }
    }

    // 启用
    const confirmStart = async key => {
      dataSource.value.filter(item => item.key === key)[0].status = '正常'
      // 更新后台用户数据
      updateUser(dataSource.value.filter(item => item.key === key)[0])
    }

    // 停用
    const confirmStop = async key => {
      dataSource.value.filter(item => item.key === key)[0].status = '停用'
      // 更新后台用户数据
      updateUser(dataSource.value.filter(item => item.key === key)[0])
    }

    return {
      dataSource,
      columns,
      loading,
      paginationConfig,
      editingKey: '',
      editableData,
      handleTableChange,
      edit,
      confirmSave,
      cancel,
      confirmDelete,
      confirmStart,
      confirmStop
    };
  },
});
</script>