const routes = [
    { path:'/', redirect:'/dashboard/data' }, // 默认路径重定向至首页
    { path:'/dashboard/data', name:'data', component: () => import('@/components/menu/dashboard/DataAnalysis.vue') },
    { path:'/dashboard/workbench', name:'workbench', component: () => import('@/components/menu/dashboard/WorkBench.vue') },
    { path:'/dashboard/form-design/basic-forms', name:'basic-forms', component: () => import('@/components/menu/dashboard/form-design/BasicForms.vue') },
    { path:'/dashboard/form-design/step-forms', name:'step-forms', component: () => import('@/components/menu/dashboard/form-design/StepForms.vue') },
    { path:'/dashboard/echarts/line-chart', name:'line-chart', component: () => import('@/components/menu/dashboard/echarts/LineChart.vue') },
    { path:'/dashboard/echarts/bar-chart', name:'bar-chart', component: () => import('@/components/menu/dashboard/echarts/BarChart.vue') },
    { path:'/dashboard/echarts/pie-chart', name:'pie-chart', component: () => import('@/components/menu/dashboard/echarts/PieChart.vue') },
    { path:'/general-tool/editor/markdown', name:'markdown', component: () => import('@/components/menu/general-tool/editor/MarkDown.vue') },
    { path:'/general-tool/editor/rich-text-editor', name:'rich-text-editor', component: () => import('@/components/menu/general-tool/editor/RichTextEditor.vue') },
    { path:'/general-tool/image-tool/format-converter', name:'format-converter', component: () => import('@/components/menu/general-tool/image-tool/FormatConverter.vue') },
    { path:'/general-tool/image-tool/image-matting', name:'image-matting', component: () => import('@/components/menu/general-tool/image-tool/ImageMatting.vue') },
    { path:'/general-tool/json-tool', name:'json-tool', component: () => import('@/components/menu/general-tool/JsonTool.vue') },
    { path:'/ai-tool/chatgpt', name:'chatgpt', component: () => import('@/components/menu/ai-tool/ChatGPT.vue') },
    { path:'/ai-tool/text-to-speech', name:'text-to-speech', component: () => import('@/components/menu/ai-tool/TextToSpeech.vue') },
    { path:'/ai-tool/speech-recognition', name:'speech-recognition', component: () => import('@/components/menu/ai-tool/SpeechRecognition.vue') },
    { path:'/ai-tool/face-recognition', name:'face-recognition', component: () => import('@/components/menu/ai-tool/FaceRecognition.vue') },
    { path:'/api-open-platform/weather', name:'weather', component: () => import('@/components/menu/api-open-platform/WeaTher.vue') },
    { path:'/api-open-platform/map', name:'map', component: () => import('@/components/menu/api-open-platform/MapAPI.vue') },
    { path:'/low-code-design-platform/low-code-generator', name:'dlow-code-generatorata', component: () => import('@/components/menu/low-code-design-platform/LowCodeGenerator.vue') },
    { path:'/authority/administrator', name:'administrator', component: () => import('@/components/menu/authority/AdministratorUser.vue') },
    { path:'/authority/common', name:'common', component: () => import('@/components/menu/authority/CommonUser.vue') },
    { path:'/about/information', name:'information', component: () => import('@/components/menu/about/ProjectInformation.vue') },
    { path:'/about/document', name:'document', component: () => import('@/components/menu/about/ProjectDocument.vue') },
    { path:'/about/contribution', name:'contribution', component: () => import('@/components/menu/about/WelcomeContribution.vue') },
]

export default routes