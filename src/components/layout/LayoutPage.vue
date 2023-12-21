<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible :theme="theme" :key="theme">
      <!-- 侧边栏菜单 -->
      <div class="logo" :style="{color:logoFontColor, height: '40px'}">
        <img class="logo-img" src="@/assets/images/logo/logo.png" />
        <span class="name">{{ titleText }}</span>
      </div>
      <el-scrollbar style="height: calc(100vh - 40px);">
        <a-menu 
        :theme="theme" 
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys" 
        mode="inline"
        style="text-align: left;"
        >
        <!-- 侧边导航 -->
        <a-sub-menu key="dashboard">
          <template #title>
            <span>
              <AppstoreOutlined />
              <span>{{  $t('menu.dashboard.val') }}</span>
            </span>
          </template>
          <a-menu-item key="dashboard.data">{{ $t('menu.dashboard.data.val')}}</a-menu-item>
          <a-menu-item key="dashboard.workbench">{{ $t('menu.dashboard.workbench.val')}}</a-menu-item>
          <a-sub-menu key="dashboard.form_design">
            <template #title>
              <span>{{ $t('menu.dashboard.form_design.val') }}</span>
            </template>
            <a-menu-item key="dashboard.form_design.basic_forms">{{ $t('menu.dashboard.form_design.basic_forms.val')}}</a-menu-item>
            <a-menu-item key="dashboard.form_design.step_forms">{{ $t('menu.dashboard.form_design.step_forms.val')}}</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="dashboard.echarts">
            <template #title>
              <span>{{ $t('menu.dashboard.echarts.val') }}</span>
            </template>
            <a-menu-item key="dashboard.echarts.line_chart">{{ $t('menu.dashboard.echarts.line_chart.val')}}</a-menu-item>
            <a-menu-item key="dashboard.echarts.bar_chart">{{ $t('menu.dashboard.echarts.bar_chart.val')}}</a-menu-item>
            <a-menu-item key="dashboard.echarts.pie_chart">{{ $t('menu.dashboard.echarts.pie_chart.val')}}</a-menu-item>
          </a-sub-menu>
        </a-sub-menu>
        <a-sub-menu key="general_tool">
          <template #title>
            <span>
              <ToolOutlined />
              <span>{{  $t('menu.general_tool.val') }}</span>
            </span>
          </template>
          <a-sub-menu key="general_tool.editor">
            <template #title>
              <span>{{ $t('menu.general_tool.editor.val') }}</span>
            </template>
            <a-menu-item key="general_tool.editor.markdown">{{ $t('menu.general_tool.editor.markdown.val')}}</a-menu-item>
            <a-menu-item key="general_tool.editor.rich_text_editor">{{ $t('menu.general_tool.editor.rich_text_editor.val')}}</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="general_tool.image_tool">
            <template #title>
              <span>{{ $t('menu.general_tool.image_tool.val') }}</span>
            </template>
            <a-menu-item key="general_tool.image_tool.format_converter">{{ $t('menu.general_tool.image_tool.format_converter.val')}}</a-menu-item>
            <a-menu-item key="general_tool.image_tool.image_matting">{{ $t('menu.general_tool.image_tool.image_matting.val')}}</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="general_tool.json_tool">{{ $t('menu.general_tool.json_tool.val')}}</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="ai_tool">
          <template #title>
            <span>
              <RobotOutlined />
              <span>{{  $t('menu.ai_tool.val') }}</span>
            </span>
          </template>
          <a-menu-item key="ai_tool.chatgpt">{{ $t('menu.ai_tool.chatgpt.val')}}</a-menu-item>
          <a-menu-item key="ai_tool.text_to_Speech">{{ $t('menu.ai_tool.text_to_Speech.val') }}</a-menu-item>
          <a-menu-item key="ai_tool.speech_recognition">{{ $t('menu.ai_tool.speech_recognition.val') }}</a-menu-item>
          <a-menu-item key="ai_tool.face_recognition">{{ $t('menu.ai_tool.face_recognition.val')}}</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="api_open_platform">
          <template #title>
            <span>
              <BranchesOutlined />
              <span>{{  $t('menu.api_open_platform.val') }}</span>
            </span>
          </template>
          <a-menu-item key="api_open_platform.weather">{{ $t('menu.api_open_platform.weather.val')}}</a-menu-item>
          <a-menu-item key="api_open_platform.map">{{ $t('menu.api_open_platform.map.val')}}</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="low_code_design_platform">
          <template #title>
            <span>
              <CodeOutlined />
              <span>{{  $t('menu.low_code_design_platform.val') }}</span>
            </span>
          </template>
          <a-menu-item key="low_code_design_platform.low_code_generator">{{ $t('menu.low_code_design_platform.low_code_generator.val')}}</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="authority">
          <template #title>
            <span>
              <team-outlined />
              <span>{{  $t('menu.authority.val') }}</span>
            </span>
          </template>
          <a-menu-item key="authority.administrator">{{ $t('menu.authority.administrator.val')}}</a-menu-item>
          <a-menu-item key="authority.common">{{ $t('menu.authority.common.val')}}</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="about">
          <template #title>
            <span>
              <GitlabOutlined />
              <span>{{  $t('menu.about.val') }}</span>
            </span>
          </template>
          <a-menu-item key="about.information">{{ $t('menu.about.information.val')}}</a-menu-item>
          <a-menu-item key="about.document">{{ $t('menu.about.document.val')}}</a-menu-item>
          <a-menu-item key="about.contribution">{{ $t('menu.about.contribution.val')}}</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </el-scrollbar>
    </a-layout-sider>

    <a-layout>
    <a-affix :offset-Top="0" >
      <a-layout-header style="height: 50px;background-color: white;padding: 0;display: flex;align-items: center;" :theme="theme">
        <!-- 控制侧边栏展开组件 -->
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="toggleCollapsed"
        />
        <menu-fold-outlined v-else class="trigger" @click="toggleCollapsed" />
        <!-- 显示当前路径 -->
        <a-breadcrumb>
          <a-breadcrumb-item v-for="path in pathNames" :key="path">{{ path }}</a-breadcrumb-item>
        </a-breadcrumb>

        <a-row type="flex" :gutter="[8,8]" style="margin-left: auto;margin-right: 15px;">
          <!-- 头像 -->
          <a-col class="user-img">
              <a-avatar :src="avatarUrl"></a-avatar>
              <span id="userName">{{ userName }}</span>
          </a-col>
          <!-- 选择主题 -->
          <a-col>
            <a-switch
              :checked="theme === 'dark'"
              checked-children="Dark"
              un-checked-children="Light"
              @change="changeTheme"
            />
          </a-col>
          <!-- 选择语言 -->
          <a-col>
            <a-radio-group v-model:value="locale" size="small">
              <a-radio-button value="zh_CN">中文</a-radio-button>
              <a-radio-button value="en_US">English</a-radio-button>
            </a-radio-group>
          </a-col>
        </a-row>
      </a-layout-header>
      <!-- 标签页 -->
      <div style="height: 40px;overflow: hidden;background-color: white;margin-top: 1px;">
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
          </el-tab-pane>
        </el-tabs>
      </div>
    </a-affix>

    <el-scrollbar ref="scrollbarRef" style="height:calc(100vh - 90px)" @scroll="scroll">
      <a-layout-content>
          <!-- 中心主体内容：通过router切换组件 -->
          <router-view></router-view>
      </a-layout-content>
    </el-scrollbar>
    </a-layout>
  </a-layout>

  <!-- 回到顶部 -->
  <a-float-button v-if="isBackTopBtnShow" @click="scrollBackTop">
    <template #icon>
        <VerticalAlignTopOutlined />
    </template>
  </a-float-button>
</template>

<script>
  import { defineComponent, ref, reactive, toRefs, watch, getCurrentInstance, onMounted} from 'vue';
  import { useRouter} from 'vue-router';
  import avatarUrl from '@/assets/images/avatar/avatar.png';


  export default defineComponent({
    name: "LayoutPage",
    components: {
    },
    setup() {
      const state = reactive({
        titleText: 'Open Tool',
        collapsed: false,
        theme: 'dark',
        openKeys: ['dashboard'],
        preOpenKeys: ['dashboard'],
        selectedSubMenuKey: 'dashboard',
        selectedKeys: ['dashboard.data'],
        pathNames: [],
        avatarUrl: avatarUrl,
        userName: 'Admin',
        locale: 'zh_CN',
      })

      // tabs标签页控制
      const tabsState = reactive({
        tabIndex: 2, // 递增ID，为new tab提供非重复的ID
        editableTabsValue: '2', // 当前选中tab的name
        editableTabs: [
          {
            title: '数据分析', // curTab对应的名字
            name: '1', // curTab对应的id
            router: 'dashboard.data',  // curTab对应的内容
          },
        ]
      })

      // logo标题字体颜色样式
      const logoFontColor = ref('White')

      const router = useRouter()
      const { ctx } = getCurrentInstance();

      // 在组件挂载时尝试加载数据
      onMounted(()=>{
        updatePath(localStorage.getItem('curPath'))
        updateRouter(localStorage.getItem('curRouter'))
        state.selectedKeys = [localStorage.getItem('curSelectedKey')]
      })

      const toggleCollapsed = () => {
        state.collapsed = !state.collapsed;
        state.titleText = state.titleText=='Open Tool'?'':'Open Tool';
      };

      const changeTheme = (checked)=> {
        state.theme = checked ? 'dark' : 'light'
        logoFontColor.value = checked ? 'White' : 'rgb(9,96,189)'
      }

      // 更新路径
      const updatePath = (key) => {
        // 将路径保存到localStorage中
        localStorage.setItem('curPath', key)

        const pathArr = key.toString().split('.')
        state.pathNames = []
        var curPath = ''
        for(var i = 0; i < pathArr.length; i++){
          curPath += pathArr[i] + '.'
            state.pathNames.push(ctx.$t('menu.'+ curPath + 'val'))
        }
      }

      // 更新路由
      const updateRouter = (key) => {
        // key: 例'dashboard.echarts.line_chart'
        // 将路由保存到localStorage中
        localStorage.setItem('curRouter', key)

        var routerStr = key.toString().replaceAll('_', '-')
        var router_path = routerStr.split('.')
        // 路由拼接
        var pageRoute = ''
        for(let path of router_path){
          pageRoute += '/' + path
        }
        // 路由切换
        router.push({ path:pageRoute })
      }

      // 国际化语言切换监听
      watch(()=> state.locale,(value) => {
        ctx.$i18n.locale = value
        updatePath(state.selectedKeys)
      })

      // sub-menu监听
      watch(()=> state.openKeys,(val,oldVal)=>{
        state.preOpenKeys = oldVal
      })

      // 菜单项切换事件监听
      watch(()=> state.selectedKeys, (key)=>{
        // key[0]: 'dashboard.echarts.line_chart'
        // 保存key到localStorage
        localStorage.setItem('curSelectedKey', state.selectedKeys)

        // 更新tabs
        const tabs = tabsState.editableTabs
        var isExisted = false
        var curTab = ''
        tabs.forEach((tab) => {
            if(tab.router == key[0]){
              isExisted = true
              curTab = tab.name
            }
          })
        // 判断当前菜单项是否存在tabs中，若存在则选中，否则新增
        if(isExisted){
          tabsState.editableTabsValue = curTab
        }else{
          addTab(ctx.$t('menu.'+ key[0] + '.val'), key[0])
        }
      })

      // tab切换事件监听
      watch(()=> tabsState.editableTabsValue, (name)=>{
        // 更新路由
        var router = ''
        tabsState.editableTabs.forEach((tab)=>{
          if(tab.name == name){
            router = tab.router
          }
        })
        // 更新路由
        updateRouter(router)
        // 更新路径显示
        updatePath(router)
        // 更新菜单项
        state.selectedKeys = [router]
      })

      // 新增tab
      const addTab = (title, router) => {
        tabsState.tabIndex++;
        const newTabName = tabsState.tabIndex
        tabsState.editableTabs.push({
          title: title,
          name: newTabName,
          router: router,
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

      // 控制滚动条
      const scrollbarRef = ref()
      const isBackTopBtnShow = ref(false)
      const scrollTopValue = ref(0)
      // 滑轮滚动时获取当前位置值
      const scroll = (scrollTop ) => {
        scrollTopValue.value = scrollTop

        // 到达一定高度才显示
        if (scrollTopValue.value.scrollTop < 1000) {
          isBackTopBtnShow.value = false
        } else {
          isBackTopBtnShow.value = true
        }
      }

      // 平滑回到顶部
      const scrollBackTop = () => {
        const startScrollTop = scrollTopValue.value.scrollTop;

        // 定义滚动动画函数
        function animateScrollTop(timestamp) {
          const scrollStep = startScrollTop / 50; // 控制滚动的速度
          let targetTopValue = scrollTopValue.value.scrollTop - scrollStep

          if (targetTopValue > 0) {
            scrollbarRef.value.setScrollTop(targetTopValue)
            requestAnimationFrame(animateScrollTop)
          } else {
            scrollbarRef.value.setScrollTop(0) // 确保最终回到顶部
          }
        }

        // 启动滚动动画
        requestAnimationFrame(animateScrollTop)
      }

      return {
          ...toRefs(state),
          ...toRefs(tabsState),
          scrollbarRef,
          isBackTopBtnShow,
          logoFontColor,
          toggleCollapsed,
          changeTheme,
          addTab,
          removeTab,
          scrollBackTop,
          scroll
        }
    },
  });
</script>

<style>
.logo{
  display: flex;
  align-items: center;
  justify-content: left;
  height: 40px;
  margin-top: 4px;
  margin-left: 20px;
}

.logo-img {
  width: 40px;
  height: 40px;
}

.name{
  font-weight: bold; /* 加粗 */
  font-size: 1.2em; /* 变大，这里设置为当前字体大小的1.2倍 */
  margin-left: 10px;
  line-height: 40px;
  white-space: nowrap; /* 不可换行 */
  overflow: hidden;  /* 超出部分隐藏 */
}

.user-img:hover{
  background-color: rgba(0, 0, 0, 0.1);
}

#userName{
  margin-left:10px
}

.trigger{
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover{
  color: #1890ff;
}

.site-layout .site-layout-background {
  background: #fff;
}
[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}

.ant-menu, .ant-menu-item, .el-tabs__item {
  user-select: none;
}
/* 中心-头部内容样式 */
.header-content{
    margin-top: 3px;
    padding-top: 5px;
    text-align: left;
    font-size: 14px;height: 90px;
}

/* 中心展示div样式 */
.center-content{
    margin: 15px 15px auto 15px;
    padding: 15px;
    padding-bottom: auto;
}

/* 纵向排列子元素垂直居中 */
.vertical-center{
    display: flex;
    flex-direction: column; /* 垂直排列子元素 */
    justify-content: center; /* 垂直居中 */
    align-items: center; /* 水平居中 */
}

  /* 横向排列子元素垂直居中 */
.horizontal-center{
    display: flex;
    justify-content: center; /* 垂直居中 */
    align-items: center; /* 水平居中 */
}
</style>
  