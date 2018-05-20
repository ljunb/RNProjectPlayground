## 目录
- [概览](#概览)
- [导航功能](#导航功能)
- [Demo目录](#demo目录)
  - [类朋友圈查看图片](#类朋友圈查看图片)
  - [新手引导装饰器](#新手引导装饰器)
  - [浮动文本动画输入框](#浮动文本动画输入框)
  - [类Path菜单动画](#类path菜单动画)
  - [常见支付密码输入框](#常见支付密码输入框)
  - [类WhatsApp转场动画](#类whatsapp转场动画)
  - [带索引SectionList](#带索引sectionlist)
- [组件](#组件)
  - [PullRefreshListView](#pullrefreshlistview)
- [HOC应用（网络占位图处理）](#关于hoc应用)
  - [代码概览](#代码概览)
  - [代码梳理](#代码梳理)
  - [使用方式](#使用方式)
  - [其他思考](#其他思考)

## 概览
这是一个自己随意玩耍的仓库，主要涉及的东西有以下几部分：
* 基于 [MobX](https://github.com/mobxjs/mobx) 和 [MST](https://github.com/mobxjs/mobx-state-tree) 重新实现了 React Native 版食物派的个别页面
* 通过 UINavigationController 和 Activity ，实现导航功能：push、pop、popTo、popToRoot。每个页面，React Native 都只作为 View 的角色存在
* 收集一些自己的练习 Demo、组件，或是项目实践中的想法

## 导航功能
口袋蜜蜂（[AppStore](https://itunes.apple.com/cn/app/%E5%8F%A3%E8%A2%8B%E8%9C%9C%E8%9C%82/id1268533784?mt=8) | [小米应用商店](http://app.mi.com/details?id=cn.com.pcauto.pocket)）是混编 App，在项目启动的前期，跟同事一起尝试了原生与 React Native 页面之间的各种导航场景，在此过程中也尝试了不同的几个 React Native 导航组件，略去其中细节，一番尝试后，回过头来想：既然是原生为主导，为何不就地取材，直接用原生的导航功能？React Native 本来就应该只承担 `View` 层的角色，数据的流转，实际仍是在原生层面。

因此，每次跳转的起始或最终界面，不管是原生，还是 React Native 页面，实际上都是原生到原生的导航。React Native 可通过注册多个 `Component` 的形式来加载多个页面，而口袋在几个版本的迭代下来之后，我们总结了较为推荐的方式是：

> * 共同：只注册一个 `Component`，不同页面在初始参数中添加标识位区分
> * iOS：采用单例 `RCTBridge`，并通过 `- initWithBridge: moduleName: initialProperties:` 的方式来创建 `RCTRootView`，然后在 `initialProperties` 这个初始化参数字典中，传入页面标识位和其他必要数据。
> * Android：通过一个 [ReactActivityManager](https://github.com/ljunb/RNProjectPlayground/blob/master/android/app/src/main/java/com/rnprojectplayground/ReactActivityManager.java) 来模拟 Activity 栈的管理，可以实现与 iOS 一样的 `popTo` 功能。在传递 `Bundle` 数据的时候，需注意的是 `Map` 到 `Bundle` 的转换处理。因为在 React Native 端调用 `push(pageName, params)` 时，带参情况传入的 `params` 为字典，映射到原生端的 `Map`，`Bundle` 对象存入数据时需按对应类型来进行获取。

在这个模式中，不同 React Native 页面之间的通知事件可正常使用，也可以按需在项目中集成 Redux 或是 MobX。口袋中集成了 MobX，类似代码在 [App.js](https://github.com/ljunb/RNProjectPlayground/blob/master/App.js) 文件中：
```javascript
// App.js
import { Provider } from 'mobx-react';
import Router from './src/routers';
import stores from './src/stores';

export default (props) => {
  const { pageName: routerKey } = props;
  const Page = Router[routerKey].default;
  return (
    <Provider {...stores}>
      <Page {...props} />
    </Provider>
  );
};
```

`store` 的注入与普通的纯 React Native 项目一致，在相关页面通过 `inject` 按需检出子树即可。`Router` 是路由配置，页面标识位和页面文件路径是字典中 `key` 和 `value` 的关系：
```javascript
// routers.js

export default {
  'main_tab': require('./pages'),
  'home': require('./pages/home'),
  'search': require('./pages/home/Search'),
  ...
}
```
所以只要在 [routers](https://github.com/ljunb/RNProjectPlayground/blob/master/src/routers.js) 中配置好关系，通过 `props` 的 `pageName`，即可匹配到不同的 React Native 页面。

[↑ 返回顶部](#目录)

## Demo目录
这里主要是一些平时在有意无意中看到一些效果时，而做的 Demo 实践。没有一一罗列，更多的 Demo 可 `clone` 项目到本地查看。
### 类朋友圈查看图片
[该效果](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/gallery/index.js) 
 是类朋友圈查看图片效果的尝试，不过页码切换有所不一样，支持设置形变动画。运行示例：
![demo](https://github.com/ljunb/screenshots/blob/master/gallery.gif)

### 新手引导装饰器
该 [Demo](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/guidance/NewGuidePage.js) 
是 `Decorator` 的简易应用，主要是实现一个快速为 React Native App 添加新手引导遮盖的需求，方便快捷易使用，[相应组件地址](https://github.com/ljunb/rn-beginner-guidance-decorator)。

### 浮动文本动画输入框
该 [效果]((https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/animation/textinput.js)) 其实是属于 Google 的 Material 系列中的交互效果，上周有简单玩了下 [Flutter](https://github.com/flutter/flutter) ，发现里面的输入框组件，就是默认这种交互效果。而 React Native 相关的，其实网上也有类似组件，这里是自己看到效果后，做个简易版实现。运行示例：

![demo](https://github.com/ljunb/screenshots/blob/master/floating.gif)

### 类Path菜单动画
该 [Demo](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/animation/path.js) 是仿 Path 的菜单动画效果：

![demo](https://github.com/ljunb/screenshots/blob/master/path.gif)

### 常见支付密码输入框
该 [Demo](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/pay/PasswordInput.js) 是与支付宝类似的密码输入框：

![demo](https://github.com/ljunb/screenshots/blob/master/password_input.gif)

### 类WhatsApp转场动画
该 [Demo](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/animation/uimovements/index.js) 是自己在偶然之中，发现一位国外开发者的 [仓库](https://github.com/kiok46/ReactNative-Animation-Challenges)，里面是参考 [UI Movement](https://uimovement.com/) 上的动画而做的 React Native 实现，自己看完也是跃跃欲试，所以写了这个动画 Demo。运行示例：

![demo](https://github.com/ljunb/screenshots/blob/master/uimovement.gif)

[↑ 返回顶部](#目录)

### 带索引SectionList
口袋项目中有一个选择汽车的分组列表，在指压并滑动索引时会有动画，项目启动时评估过 React Native 实现的性能问题，最终还是选择了原生实现。恰巧早上写完了家居的业务功能，想着用纯 React Native 来实现这个列表：

![demo](https://github.com/ljunb/screenshots/blob/master/atoz.gif)

iOS 在模拟器上的效果如上所示，JavaScript 线程掉帧还是挺严重的，UI FPS 看起来倒是正常，实际滑动起来表现并不卡。Android 端在模拟器上表现一般般，没有在真机中测试，并且还需要处理 `overflow` 的问题，所以到时布局还需根据平台做适配处理。

其实之前用官方自带的 SectionList 实现过这个模块，但是效果挺差的，分组跨度较大时，点击索引滚动时会出现白屏（只在 iOS 模拟器下调试，Android 没做进一步尝试）。当前 [Demo](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/largelist/index.js) 基于 [react-native-largelist](https://github.com/bolan9999/react-native-largelist) 实现（自己只在该示例中使用了该组件，并未集成到商业项目中）。

[↑ 返回顶部](#目录)

## 组件
### PullRefreshListView
[PullRefreshListView](https://github.com/ljunb/RNProjectPlayground/blob/master/src/components/PullRefreshListView.js)
是对 [react-native-smart-pull-to-refresh-listview](https://github.com/react-native-component/react-native-smart-pull-to-refresh-listview) 
的二次封装，可自定义下拉刷新、上拖加载更多的样式，也添加了空列表、数据加载出错时（分有数据和无数据）的样式定制，更适用于商业项目使用。简单使用示例：
```javascript

import PullRefreshListView from './PullRefreshListView';

export default class MsgList extends Component {
  pageNo = 1;
  msgList = [];

  componentDidMount() {
    this.listView && this.listView.beginRefresh();
  }
  
  fetchMsgList = async() => {
    try {
      const responseData = await fetch(url).then(res => res.json());
      
      const result = this.pageNo === 1 ? [...responseData.list] : [...this.msgList, ...responseData.list];
      this.msgList = result;
      const isLoadAll = this.msgList.length >= responseData.total;
      this.listView && this.listView.setData(result, this.pageNo, isLoadAll);
    } catch (e) { 
      this.listView && this.listView.setError();
      // and log error message
    }
  };
  
  handleRefresh = () => {
    this.pageNo = 1;
    this.fetchMsgList();
  };
  
  handleLoadMore = () => {
    this.pageNo++;
    this.fetchMsgList();
  };
  
  /**
   *  setError 调用时触发，情况为：
   *  1 第一次进入列表出错时，pageNo 从 1 减至为 0，重置为 1
   *  2 加载更多时出错，此时页码已经加了 1 ，需要减 1，确保再次加载更多时的页码正确
   */
  handleLoadError = () => {
    this.pageNo--;
    if (this.pageNo < 1) {
      this.pageNo = 1;
    }
  };

  render() {
    return (
      <PullRefreshListView
        ref={r => this.listView = r}
        onRefresh={this.handleRefresh}
        onLoadMore={this.handleLoadMore}
        onSetError={this.handleLoadError}
      />
    );
  }
}
```

[↑ 返回顶部](#目录)

## 关于HOC应用
基本上，每个页面都会存在首屏渲染和网络出错的占位图，大部分情况下，我们会发现其中的实现逻辑大同小异，所以看到这些页面，自己经常觉得代码很冗余，一直想着有没一些优化的方法。

较早之前写过一个关于新手引导的 [组件](https://github.com/ljunb/rn-beginner-guidance-decorator)，是对 HOC 的简单应用，大抵是抽取公用的代码逻辑做为上一层的封装，新手引导内容则由具体组件去负责。基于这种思路，尝试对网络请求的通用业务需求做一次解耦简化，期望是通过一次编写 HOC ，然后不再涉及首屏渲染，或是网络出错这些状态处理的编写逻辑，并支持动态配置不同的占位组件。

于是，有了这个 [尝试](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/decorators/index.js) 。

### 代码概览
罗列的代码中，将省略部分不必要内容：
```javascript
// HOCUtils.js

const enhanceFetch = (WrappedComponent, options) => class extends Component {
  static propTypes = {
    requestQueues: PropTypes.array.isRequired, // A.1
  }
  
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isLoadError: false,
      data: null,
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = async () => {
    try {
      const { requestQueues } = this.props
      const requestHandlers = []

      requestQueues.map(request => requestHandlers.push(this.convertHandler(request)))
      const requestResults = await Promise.all(requestHandlers) // A.2
      this.setState({
        isLoading: false,
        data: requestResults.length === 1 ? requestResults[0] : requestResults,
      })
    } catch (e) {
      this.setState({
        isLoading: false,
        isLoadError: true,
      })
    }
  }

  convertHandler = ({url, options = {}}) => {
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(res => res.json())
        // TODO：实际上这里还应有接口响应 code 的判断，eg：code === 1 → success
        // 具体跟接口同事协商即可
        .then(responseData => resolve(responseData))
        .catch(err => reject(err))
    })
  }

  handleReload = () => this.setState({ isLoading: true, isLoadError: false }, this.fetchData)

  handleUpdateData = data => this.setState({ data })

  render() {
    const { style, ...rest } = this.props
    const { isLoadError, isLoading, data } = this.state
    const isShowContent = !isLoading && !isLoadError
    const ShowedLoading = options && options.loading || DefaultLoading
    const ShowedNetError = options && options.error || DefaultNetError

    return (
      <View style={[styles.root, style]}>
        {isLoading && <ShowedLoading />}
        {isLoadError && <ShowedNetError onReload={this.handleReload} />}
        {isShowContent &&
          <WrappedComponent
            {...rest}
            data={data}
            fetchData={this.fetchData}
            updateData={this.handleUpdateData}
          />
        }
      </View>
    )
  }
}

export { enhanceFetch }
```
### 代码梳理
* HOC 负责 `isLoading`、`isLoadError` 的管理，完成不同占位图的渲染
* 暴露 `enhanceFetch(component: ReactComponent, options: object)` 的接口，根据需要在 `options` 中配置 `loading` 和 `error`。如无设置，则使用默认的占位图

关于 `props`：
* `A.x` → `requestQueues`：这里主要是接收多个请求的配置及其接口响应处理。每个请求将保持 `{url: ‘’, options: {}}` 的格式，触发请求之前会进行 `Promise` 化，然后基于 `Promise.all()` 进行并发。单请求将返回一个结果，并发请求将返回一个结果数组，与传入的请求参数顺序一一对应

关于 `WrappedComponent` 的 `props`：
* `data`：接口响应的数据
* `fetchData`：如果页面需要重新请求数据，通过 `this.props.fetchData()` 的方式触发
* `updateData`：单纯的进行本地数据更新，可采用 `this.props.updateData(newData)` 的方式，`newData` 为最新数据，格式应与旧数据保持一致

### 使用方式：
```javascript
import { enhanceFetch } from './HOCUtils'

class TargetList extends PureComponent {

  handleUpdateData = () => this.props.updateData && this.props.updateData([0, 1, 2, 3])

  handleFetchData = () => this.props.fetchData && this.props.fetchData()

  renderContent = (item, index) => {
    return (
      <View key={`Content_${index}`} style={styles.item}>
        {item.keywords && <Text>热搜词：{item.keywords}</Text>}
        {item.group_count && <Text>分组数量：{item.group_count}</Text>}
        {Number.isInteger(item) && <Text>Reload data: {item}</Text>}
      </View>
    )
  }

  render() {
    const { data = null } = this.props

    return (
      <View style={styles.root}>
        <View>
          {data && data.map(this.renderContent)}
        </View>
        <View style={styles.btnWrapper}>
          <TouchableOpacity onPress={this.handleUpdateData}>
            <Text>Update Data</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.handleFetchData}>
            <Text>Fetch Data</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const CustomerLoading = () => {
  return (
    <Text>Customer Loading...</Text>
  )
}

// 进行修饰
const FinalList = enhanceFetch(TargetList, { loading: CustomerLoading })

export default () => {
  const requestQueues = [
    {url: 'http://food.boohee.com/fb/v1/keywords', options: {}},
    {url: 'http://food.boohee.com/fb/v1/categories/list', options: {}}
  ]
  return <FinalList requestQueues={requestQueues} />
}
```
很明显，其实 `FinalList` 就是智能组件，用于进行占位图、网络请求的配置，或者还有其他配置；而 `TargetList` 则是木偶组件，无须感知与 UI 无关的其他东西。到这一步，假如要新建业务页面，那么需要做的工作，就是做好接口和占位图的按需配置，然后直接进行 UI 的编码工作即可，无须再处理首屏渲染和网络出错逻辑。

### 其他思考
* 列表下拉刷新、加载更多支持？
> 1. 为 `WrappedComponent` 增加 `enableRefresh`、`enableLoadMore` 的 `props`，来开启或忽略这些功能。但是页码的参数名？page？亦或pageNo？
> 2. 目前项目中的列表基于 [react-native-smart-pull-to-refresh-listview](https://github.com/react-native-component/react-native-smart-pull-to-refresh-listview) 做了二次封装，满足通用的首屏渲染和网络出错的处理，不过该组件目前仍然未采用 `FlatList` 实现

* 其他暂未想到

[↑ 返回顶部](#目录)
