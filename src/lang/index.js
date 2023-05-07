import { createI18n } from 'vue-i18n'  // 引入vue-i18n组件
import zh_CN from './zh_CN'
import en_US from './en_US'

// 注册i18n实例并引入语言文件
const i18n = createI18n({
    locale: 'zh_CN', //语言表示（缓存里没有就用中文）
    messages: {
      zh_CN,
      en_US
    }
  });

export default i18n;