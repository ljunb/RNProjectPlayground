import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import { enhanceFetch } from './FetchDecorator'

const { width: screenW } = Dimensions.get('window')

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    height: 40,
    width: screenW,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  btn: {
    paddingHorizontal: 12,
    height: 30,
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 10,
  },
  prompt: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    justifyContent: 'center',
  }
})

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
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.btn}
            onPress={this.handleUpdateData}
          >
            <Text>Update Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.btn}
            onPress={this.handleFetchData}
          >
            <Text>Fetch Data</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.prompt}>
          <Text>并发请求示例</Text>
          <Text>{`1、updateData 更新本地数据\n2、fetchData 重新触发请求\n3、其他：decorator 已处理首屏渲染和网络出错状态`}</Text>
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