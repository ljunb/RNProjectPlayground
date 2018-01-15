## 概览
这是一个自己随意玩耍的仓库，主要涉及的东西有：
> * 采用原生 `UINavigationController` 实现导航功能：push、pop、popTo、popToRoot
> * React Native 实现UI和主要业务逻辑
> * 采用 MobX 和 MST 组织数据

## 开发相关
### 1、关于导航
`CJNavigation` 是封装原生 `UINavigationController` 的一个桥接模块，提供常见的导航入栈、出栈功能。每个 React Native 页面，都是通过新建 `RNPayloadViewController` 实例来加载不同 `RCTRootView` 实现的，并添加一个 `pageName` 作为页面标识。

### 2、关于页面
每新建一个页面，都需要在`routers.js`中配置：
```
// routers.js

export default {
  ...
  // key为页面特有的pageName，value为页面路径
  'search': require('./pages/home/Search'),
}
```
导航跳转或是返回时，`pageName` 将作为 `CJNavigation` 各方法的参数，如 `CJNavigation.push('search')` 或是 `CJNavigation.popTo('home')`。

### 3、关于 Demo 目录
[demos/gallery](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/gallery/index.js) 是类朋友圈查看图片效果的尝试，不过页码切换有所不一样，支持设置形变动画。运行示例：
![demo](https://github.com/ljunb/screenshots/blob/master/gallery.gif)

[demos/guidance](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/guidance/NewGuidePage.js) 是 `Decorator` 的简易应用，主要是实现一个快速为 React Native App 添加新手引导遮盖的需求，方便快捷易使用，[相应组件地址](https://github.com/ljunb/rn-beginner-guidance-decorator)。

### 4、关于组件
[PullRefreshListView](https://github.com/ljunb/RNProjectPlayground/blob/master/src/components/PullRefreshListView.js) 是对 [react-native-smart-pull-to-refresh-listview](https://github.com/react-native-component/react-native-smart-pull-to-refresh-listview) 的二次封装，可自定义下拉刷新、上拖加载更多的样式，也添加了空列表、数据加载出错时（分有数据和无数据）的样式定制，更适用于商业项目使用。
