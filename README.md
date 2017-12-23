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

## TODO
补充其他说明
