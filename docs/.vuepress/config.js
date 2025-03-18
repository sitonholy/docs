const nav = require('./config/nav.js');

module.exports = {
  title: "软件产品帮助中心",
  description: '',
  base: '/', // '/<github仓库名>/'， 默认'/' 
  head: [ // 注入到页面<head> 中的标签，格式[tagName, { attrName: attrValue }, innerHTML?]
    ['link', { rel: 'icon', href: '/img/favicon.ico' }], //favicons，资源放在public文件夹
    ['meta', { name: 'keywords', content: 'vuepress,theme,blog,vdoing' }],
    ['meta', { name: 'theme-color', content: '#11a8cd' }], // 移动浏览器主题颜色
    ['link', { rel: 'stylesheet', href: '/styles/font_3114978_qe0b39no76.css' }],


    // 以下是vuepress-plugin-demo-block插件所需依赖
    // ['script', { src: 'https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js' }], // 此文件会影响导航router-link-active样式的切换，改为在enhanceApp.js中把Vue构造函数绑定到window上
    // ['script', { src: 'https://cdn.jsdelivr.net/npm/@babel/standalone/babel.min.js' }],
  ],
  markdown: {
    lineNumbers: true // 代码行号
  },
  theme: 'vdoing', // 使用依赖包主题
  // theme: require.resolve('../../theme-vdoing'), // 使用本地主题
  themeConfig: { // 主题配置
    nav,
    sidebarDepth: 2, // 侧边栏显示深度，默认1，最大2（显示到h3标题）
    logo: '/img/sitonholy-logo.png', // 导航栏logo
    repo: 'sitonholy/docs', // 导航栏右侧生成Github链接
    searchMaxSuggestions: 10, // 搜索结果显示最大数
    lastUpdated: '上次更新', // 更新的时间，及前缀文字   string | boolean (取值为git提交时间)

    docsDir: 'docs', // 编辑的文件夹
    editLinks: false, // 编辑链接
    editLinkText: '编辑',



    // 以下配置是Vdoing主题改动的和新增的配置
    sidebar: { mode: 'structuring', collapsable: false }, // 侧边栏  'structuring' | { mode: 'structuring', collapsable: Boolean} | 'auto' | 自定义    温馨提示：目录页数据依赖于结构化的侧边栏数据，如果你不设置为'structuring',将无法使用目录页

    // sidebarOpen: false, // 初始状态是否打开侧边栏，默认true
    updateBar: { // 最近更新栏
      showToArticle: false, // 显示到文章页底部，默认true
      // moreArticle: '/archives' // “更多文章”跳转的页面，默认'/archives'
    },
    // titleBadge: false, // 文章标题前的图标是否显示，默认true
    // titleBadgeIcons: [ // 文章标题前图标的地址，默认主题内置图标
    //   '图标地址1',
    //   '图标地址2'
    // ],
    bodyBgImg: [
      // '/img/38.jpg',
      '/img/scm.jpg',
      '/img/sitoncloud.jpg',
    ], // body背景大图，默认无。 单张图片 String || 多张图片 Array, 多张图片时每隔15秒换一张。

    bodyBgImgOpacity: 1, // body 背景图透明度，选值 0 ~ 1.0, 默认0.5

    category: false, // 是否打开分类功能，默认true。 如打开，会做的事情有：1. 自动生成的frontmatter包含分类字段 2.页面中显示与分类相关的信息和模块 3.自动生成分类页面（在@pages文件夹）。如关闭，则反之。
    tag: false, // 是否打开标签功能，默认true。 如打开，会做的事情有：1. 自动生成的frontmatter包含标签字段 2.页面中显示与标签相关的信息和模块 3.自动生成标签页面（在@pages文件夹）。如关闭，则反之。
    // archive: false, // 是否打开归档功能，默认true。 如打开，会做的事情有：1.自动生成归档页面（在@pages文件夹）。如关闭，则反之。

    author: { // 文章默认的作者信息，可在md文件中单独配置此信息 String | {name: String, href: String}
      name: '思腾合力', // 必需
      href: 'https://aiserver.cn' // 可选的
    },
    footer: { // 页脚信息
      createYear: 2019, // 博客创建年份
      copyrightInfo: '<a href="https://aiserver.cn" target="_blank" data-v-15b741c1="">思腾合力（天津）科技有限公司</a>  <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" data-v-15b741c1="">津ICP备19000271号-1</a>', // 博客版权信息，支持a标签
    }
  },

  // 插件
  plugins: [
    [require('./plugins/love-me'), { // 鼠标点击爱心特效
      // color: '#11a8cd', // 爱心颜色，默认随机色
      excludeClassName: 'theme-vdoing-content' // 要排除元素的class, 默认空''
    }],

    [
      {
        name: 'custom-plugins',
        globalUIComponents: ["IndexBigImg", "PageInfo", "BlockToggle", "GlobalTip", "Twikoo"]
      }
    ],

    // [
    //   'vuepress-plugin-baidu-tongji', // 百度统计
    //   {
    //     hm: '01293bffa6c3962016c08ba685c79d78'
    //   }
    // ],

    ['one-click-copy', { // 代码块复制按钮
      copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'], // String or Array
      copyMessage: '复制成功', // default is 'Copy successfully and then paste it for use.'
      duration: 1000, // prompt message display time.
      showInMobile: false // whether to display on the mobile side, default: false.
    }],
    [
      'vuepress-plugin-zooming', // 放大图片
      {
        selector: '.theme-vdoing-content img:not(.no-zoom)',
        options: {
          bgColor: 'rgba(0,0,0,0.6)'
        },
      },
    ],
    [
      '@vuepress/last-updated', // "上次更新"时间格式
      {
        transformer: (timestamp, lang) => {
          const moment = require('moment') // https://momentjs.com/
          return moment(timestamp).format('YYYY/MM/DD, H:MM:SS');
        }
      }
    ],
    // 顶部阅读进度插件
    [
      'reading-progress'
    ],
    [
      'dynamic-title',
      {
        showIcon: '/favicon.ico',
        showText: 'ヾ(≧▽≦*)o欢迎回来！',
        hideIcon: '/failure.ico',
        hideText: 'ಥ_ಥ不要走呀！',
        recoverTime: 2000,   //  持续时间
      },
    ],
    // vuepress-plugin-tabs。官网：https://github.com/pskordilakis/vuepress-plugin-tabs
    ['tabs'],
  ],

}
