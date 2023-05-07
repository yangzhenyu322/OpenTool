<template>
  <div style="margin-bottom: 20px">
    <el-button size="small" @click="addTab(editableTabsValue)">
      add tab
    </el-button>
  </div>

  <div style="height: 500px;background-color: beige;border-top: 1px solid;">
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      class="tabs"
      closable
      @tab-remove="removeTab"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <p>tite:{{ item.title }}</p>
        <p>name:{{ item.name }}</p>
        <p>router{{ item.router }}</p>  
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { toRefs, defineComponent, reactive } from 'vue'

  export default defineComponent({
    setup(){
      const tabsState = reactive({
        tabIndex: 2, // 递增ID，为new tab提供非重复的ID
        editableTabsValue: '2', // 当前选中tab的name
        editableTabs: [
          {
            title: 'basic_forms', // curTab对应的名字
            name: '1', // curTab对应的id
            router: 'dashboard.form_design.basic_forms',  // curTab对应的内容
          },
          {
            title: 'step_forms',
            name: '2',
            router: 'dashboard.form_design.step_forms',
          },
          {
            title: 'step_forms11',
            name: '3',
            router: 'dashboard.form_design.step_forms11',
          },
        ]
      })

      const addTab = (targetName) => {
        tabsState.tabIndex++;
        const newTabName = tabsState.tabIndex
        tabsState.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          router: targetName,
        })
        tabsState.editableTabsValue = newTabName
      }

      const removeTab = (targetName) => {
        // 选中被删除tab的邻居tab,转移curTab
        const tabs = tabsState.editableTabs
        let activeName = tabsState.editableTabsValue
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        tabsState.editableTabsValue = activeName
        // 去除已被删除的tab
        tabsState.editableTabs = tabs.filter((tab) => tab.name !== targetName)
      }

      return {
        ...toRefs(tabsState),
        addTab,
        removeTab
      }
    }
  })

</script>
