/**
 * Description :
 *
 * Author : cookiej
 * Date   : 2017/12/22
 * Time   : 10:09
 */
import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';

const {height: screenH} = Dimensions.get('window');
const ListStatus = {
  'FirstLoad': 'FirstLoad',
  'Normal': 'Normal',
  'NetError': 'NetError',
  'NoMoreData': 'NoMoreData',
};

export default class LoadMoreList extends Component {

  static propTypes = {
    // ============== 以下为自定义的属性 ==============
    onLoadMore: PropTypes.func, // 加载更多触发回调
    onNetErrorRefresh: PropTypes.func, // 网络出错，重新加载回调

    ListLoadingComponent: PropTypes.func, // 首屏加载视图
    ListNetErrorRefreshView: PropTypes.func, // 网络出错，重新加载视图

    ListNormalFooter: PropTypes.func, // 正常加载更多footer
    ListNoMoreDataFooter: PropTypes.func, // 没有更多footer
    ListNetErrorFooter: PropTypes.func, // 列表存在数据，网络出错时的footer

    // ============== 以下同官方FlatList属性 ==============
    initialNumToRender: PropTypes.number,
    keyExtractor: PropTypes.func,
    renderItem: PropTypes.func,
    ListEmptyComponent: PropTypes.func,
    onEndReachedThreshold: PropTypes.number,
  };

  static defaultProps = {
    initialNumToRender: 12,
  };

  state = {
    status: ListStatus.FirstLoad,
    data: [],
  };

  reloadList = (data, isNoMore) => {
    this.setState({
      data,
      status: isNoMore ? ListStatus.NoMoreData : ListStatus.Normal,
    });
  };

  loadError = () => this.setState({status: ListStatus.NetError});

  keyExtractor = (item, index) => {
    const {keyExtractor} = this.props;
    if (keyExtractor) return keyExtractor(item, index);
    return `LoadMoreListItemKey_${index}`;
  };

  renderItem = item => {
    const {renderItem} = this.props;
    if (renderItem) return renderItem(item);

    return (
      <View style={styles.defaultItem}>
        <Text style={styles.footerText}>{JSON.stringify(item)}</Text>
      </View>
    );
  };

  renderFirstLoadView = () => {
    const {ListLoadingComponent} = this.props;
    if (ListLoadingComponent) return ListLoadingComponent();

    return (
      <View style={styles.container}>
        <ActivityIndicator/>
        <Text style={styles.loadingText}>正在加载中...</Text>
      </View>
    )
  };

  renderListEmptyComponent = () => {
    const {ListEmptyComponent} = this.props;
    if (ListEmptyComponent) return ListEmptyComponent();

    return (
      <View style={styles.emptyContainer}>
        <Text>Empty</Text>
      </View>
    );
  };

  renderListFooterComponent = () => {
    const {status} = this.state;
    if (status === ListStatus.Normal) return this.renderNormalFooter();
    if (status === ListStatus.NoMoreData) return this.renderNoMoreDataFooter();

    return this.renderNetErrorFooter();
  };

  renderNormalFooter = () => {
    const {ListNormalFooter} = this.props;
    if (ListNormalFooter) return ListNormalFooter();

    return (
      <View style={styles.footer}>
        <ActivityIndicator/>
        <Text style={styles.footerText}>正在加载更多数据…</Text>
      </View>
    );
  };

  renderNetErrorFooter = () => {
    const {ListNetErrorFooter} = this.props;
    if (ListNetErrorFooter) return ListNetErrorFooter();

    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>网络不给力</Text>
      </View>
    );
  };

  renderNoMoreDataFooter = () => {
    const {ListNoMoreDataFooter} = this.props;
    if (ListNoMoreDataFooter) return ListNoMoreDataFooter();

    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>- 已经没有更多了 -</Text>
      </View>
    );
  };

  renderNetErrorRefreshView = () => {
    const {ListNetErrorRefreshView} = this.props;
    if (ListNetErrorRefreshView) return ListNetErrorRefreshView();

    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.refreshBtn}
          onPress={this.handleRefresh}
        >
          <Text style={styles.refreshText}>重新加载</Text>
        </TouchableOpacity>
      </View>
    )
  };

  handleRefresh = () => {
    const {onNetErrorRefresh} = this.props;
    this.setState({status: ListStatus.FirstLoad}, () => onNetErrorRefresh && onNetErrorRefresh());
  };

  handleEndReached = () => {
    const {onLoadMore} = this.props;
    const {status} = this.state;
    if (status === ListStatus.NetError || status === ListStatus.Normal) {
      onLoadMore && onLoadMore();
    }
  };

  render() {
    const {onEndReachedThreshold, initialNumToRender} = this.props;
    const {status, data} = this.state;
    if (status === ListStatus.FirstLoad) return this.renderFirstLoadView();
    if (status === ListStatus.NetError && data.length === 0) {
      return this.renderNetErrorRefreshView();
    }

    return (
      <FlatList
        data={this.state.data}
        keyExtractor={this.keyExtractor}
        extraData={status}
        initialNumToRender={initialNumToRender}
        renderItem={this.renderItem}
        ListEmptyComponent={this.renderListEmptyComponent}
        ListFooterComponent={this.renderListFooterComponent}
        onEndReachedThreshold={onEndReachedThreshold || 0.2}
        onEndReached={this.handleEndReached}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    fontSize: 15,
    fontWeight: '100',
    marginTop: 10,
  },
  emptyContainer: {
    height: screenH - 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '100',
    marginLeft: 10,
  },
  refreshBtn: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderColor: '#ebebeb',
    borderWidth: 1,
    borderRadius: 4,
  },
  refreshText: {
    color: '#999',
    fontSize: 15,
    fontWeight: '100',
  },
  defaultItem: {
    height: 50,
    paddingLeft: 16,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
  }
});