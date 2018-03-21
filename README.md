## 概览
这是一个自己随意玩耍的仓库，主要涉及的东西有：
> * 采用原生 `UINavigationController` 实现导航功能：push、pop、popTo、popToRoot
> * React Native 实现UI和主要业务逻辑
> * 采用 MobX 和 MST 组织数据
> * 其他一些尝试实例

## 目录
- [开发相关](#开发相关)
  - [关于导航](#1、关于导航)
  - [关于页面](#2、关于页面)
  - [关于Demo目录](#3、关于Demo目录)
  - [关于组件](#4、关于组件)
  - [关于HOC应用](#5、关于HOC应用)

## 开发相关
### 1、关于导航
[CJNavigation](https://github.com/ljunb/RNProjectPlayground/blob/master/src/bridges/CJNavigation.js) 是封装原生 `UINavigationController` 的一个桥接模块，提供常见的导航入栈、出栈功能。每个 React Native 页面，都是通过新建 [RNPayloadViewController](https://github.com/ljunb/RNProjectPlayground/blob/master/ios/RNPayloadViewController.m) 实例来加载不同 `RCTRootView` 实现的，并添加一个 `pageName` 作为页面标识。

### 2、关于页面
每新建一个页面，都需要在 [routers](https://github.com/ljunb/RNProjectPlayground/blob/master/src/routers.js) 中配置：
```
// routers.js

export default {
  ...
  // key为页面特有的pageName，value为页面路径
  'search': require('./pages/home/Search'),
}
```
导航跳转或是返回时，`pageName` 将作为 `CJNavigation` 各方法的参数，如 `CJNavigation.push('search')` 或是 `CJNavigation.popTo('home')`。

### 3、关于Demo目录
* [gallery](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/gallery/index.js) 
是类朋友圈查看图片效果的尝试，不过页码切换有所不一样，支持设置形变动画。运行示例：
![demo](https://github.com/ljunb/screenshots/blob/master/gallery.gif)

* [guidance](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/guidance/NewGuidePage.js) 
是 `Decorator` 的简易应用，主要是实现一个快速为 React Native App 添加新手引导遮盖的需求，方便快捷易使用，[相应组件地址](https://github.com/ljunb/rn-beginner-guidance-decorator)。

* [animation/textinput](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/animation/textinput.js) 是 `placeholder` 有浮动动画效果的输入框，实现思路也很简单，如果网上的组件不满足业务需求，也完全可以自己来实现。运行示例：

![demo](https://github.com/ljunb/screenshots/blob/master/floating.gif)

* [animation/path](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/animation/path.js) 是仿 Path 的菜单动画效果，有空再继续完善吧：

![demo](https://github.com/ljunb/screenshots/blob/master/path.gif)

* [animation/pay](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/pay/PasswordInput.js) 是与支付宝类似的密码输入框：

![demo](https://github.com/ljunb/screenshots/blob/master/password_input.gif)

### 4、关于组件
* [PullRefreshListView](https://github.com/ljunb/RNProjectPlayground/blob/master/src/components/PullRefreshListView.js)
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

### 5、关于HOC应用
基本上，每个页面都会存在首屏渲染和网络出错的占位图，大部分情况下，我们会发现其中的实现逻辑大同小异，所以看到这些页面，自己经常觉得代码很冗余，一直想着有没一些优化的方法。

较早之前写过一个关于新手引导的[组件](https://github.com/ljunb/rn-beginner-guidance-decorator)，是对 HOC 的简单应用，大抵是抽取公用的代码逻辑做为上一层的封装，新手引导内容则由具体组件去负责。基于这种思路，尝试对网络请求的通用业务需求做一次解耦简化，期望是通过一次编写 HOC ，然后不再涉及首屏渲染，或是网络出错这些状态处理的编写逻辑，并支持动态配置不同的占位组件。

于是，有了这个[初始版](https://github.com/ljunb/RNProjectPlayground/blob/master/src/pages/demos/decorators/index.js) 。

#### 5.1、概览
罗列的代码酌情省略不必要内容：

```javascript
import DefaultLoading from './CommonLoading'
import DefaultNetError from './CommonNetError'

export default (WrappedComponent, LoadingComponent, NetErrorComponent) => class extends Component {
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

  fetchData = () => {
    setTimeout(() => {
      this.setState({
        isLoading: false,
        data: [0, 1, 2, 3, 4]
      })
    }, 1500)
  }

  handleReload = () => this.setState({isLoading: true, isLoadError: false}, this.fetchData)

  render() {
    const { style, ...rest } = this.props
    const { isLoadError, isLoading, data } = this.state
    const isShowContent = !isLoading && !isLoadError
    const ShowedLoading = LoadingComponent || DefaultLoading
    const ShowedNetError = NetErrorComponent || DefaultNetError

    return (
      <View style={[styles.root, style]}>
        {isLoading && <ShowedLoading />}
        {isLoadError && <ShowedNetError onReload={this.handleReload} />}
        {isShowContent &&
          <WrappedComponent
            {...rest}
            data={data}
          />
        }
      </View>
    )
  }
} 
```
简单解释为：
* HOC 负责 `isLoading`、`isLoadError` 的管理，完成不同占位图的渲染
* `LoadingComponent`、`NetErrorComponent` 用于配置占位组件，如果没有传入，则设置为默认的占位图，体现通用性和可配置性
* 目标组件 `WrappedComponent` 接收 `data` 作为 `props`，传递界面渲染所需数据

#### 5.2、使用方式
```javascript
import FetchDecorator from './FetchDecorator'
import TargetList from './TargetList'

const CustomerLoading = () => {
  return (
    <Text>Customer Loading...</Text>
  )
}

const FinalList = FetchDecorator(TargetList, CustomerLoading)

export default class extends PureComponent {
  render() {
    return (
      <View style={styles.root}>
        <FinalList />
      </View>
    )
  }
}
```

#### 5.3、初版修改
主要针对并发请求的修改，以及页面数据的更新处理：
```javascript
// FetchDecorator.js

const enhanceFetch = (WrappedComponent, LoadingComponent, NetErrorComponent) => class extends Component {
  static propTypes = {
    requestQueue: PropTypes.array.isRequired, // A.1
    fetchData: PropTypes.func, // B.1
    updateData: PropTypes.func, // C.1
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
      const { requestQueue } = this.props
      const requestHandlers = []

      requestQueue.map(request => requestHandlers.push(this.convertHandler(request)))
      const requestResults = await Promise.all(requestHandlers) // A.3
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

  handleUpdateData = data => this.setState({ data }) // C.2

  render() {
    const { style, ...rest } = this.props
    const { isLoadError, isLoading, data } = this.state
    const isShowContent = !isLoading && !isLoadError
    const ShowedLoading = LoadingComponent || DefaultLoading
    const ShowedNetError = NetErrorComponent || DefaultNetError

    return (
      <View style={[styles.root, style]}>
        {isLoading && <ShowedLoading />}
        {isLoadError && <ShowedNetError onReload={this.handleReload} />}
        {isShowContent &&
          <WrappedComponent
            {...rest}
            data={data}
            fetchData={this.fetchData} // B.2
            updateData={this.handleUpdateData} // C.3
          />
        }
      </View>
    )
  }
}

export { enhanceFetch }
```
简单梳理：
* `A.x` → `requestQueue`：这里主要是接收多个请求的配置及其接口响应处理。每个请求将保持 `{url: ‘’, options: {}}` 的格式，触发请求之前会进行 `Promise` 化，然后基于 `Promise.all()` 进行并发。单请求将返回一个结果，并发请求将返回一个结果数组，与传入的请求参数顺序一一对应
* `B.x` → `fetchData`：如果页面需要重新请求数据，通过 `this.props.fetchData()` 的方式触发
* `C.x` → `updateData`：单纯的进行本地数据更新，可采用 `this.props.updateData(newData)` 的方式，`newData` 为最新数据，格式应与旧数据保持一致

使用方式：
```javascript
import { enhanceFetch } from './FetchDecorator'

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
const FinalList = enhanceFetch(TargetList, CustomerLoading)

export default () => {
  const requestQueue = [
    {url: 'http://food.boohee.com/fb/v1/keywords', options: {}},
    {url: 'http://food.boohee.com/fb/v1/categories/list', options: {}}
  ]
  return <FinalList requestQueue={requestQueue} />
}
```
很明显，其实 `FinalList` 就是智能组件，用于进行占位图、网络请求的配置，或者还有其他配置；而 `TargetList` 则是木偶组件，无须感知与 UI 无关的其他东西。到这一步，假如要新建业务页面，那么需要做的工作，就是做好接口和占位图的按需配置，然后直接进行 UI 的编码工作即可，无须再处理首屏渲染和网络出错逻辑。

#### 5.4、其他思考
* 列表下拉刷新、加载更多支持？

> 为 `WrappedComponent` 增加 `enableRefresh`、`enableLoadMore` 的 `props`，来开启或忽略这些功能。但是页码的参数名？page？亦或pageNo？

* 其他暂未想到
