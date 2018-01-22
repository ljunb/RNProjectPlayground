/**
 * Description : 通用上拖、下拉列表
 *
 * Author : cookiej
 * Date   : 2018/1/9
 * Time   : 17:06
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview';

const styles = StyleSheet.create({
  refreshHead: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#f0f1f5',
  },
  page_root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error_center: {
    alignItems: 'center',
    paddingBottom: 188,
  },
  error_center_img: {
    width: 100,
    height: 100,
  },
  error_center_text: {
    fontSize: 16,
    color: '#999',
    marginTop: 14,
    marginBottom: 40,
  },
  error_center_btn: {
    width: 160,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#4471e1',
    borderRadius: 18,
    borderWidth: 0.5,
  },
  error_center_btn_text: {
    fontSize: 12,
    color: '#4471e1',
  },
  root: {
    flex: 1,
    backgroundColor: '#f0f2f7',
  },
  loading: {
    width: 20,
    height: 20,
  },
  footer: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f7',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    backgroundColor: 'transparent',
  },
  emptyTitle: {
    color: '#999',
    fontSize: 16,
  },
  emptyImg: {
    width: 100,
    height: 100,
    marginBottom: 14,
  },
  emptyWrapper: {
    alignItems: 'center',
    paddingTop: 130,
    flex: 1,
    backgroundColor: '#f0f2f7',
  },
  gif: {
    width: 78,
    height: 64,
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 15,
    color: '#999',
  },
  animatedCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(1,1,1,0.3)',
  },
});

export const viewType = {
  scrollView: 0,
  listView: 1,
};
const ListStatus = {
  Refreshing: 'Refreshing',
  Normal: 'Normal',
  NetworkError: 'NetworkError',
  NoMoreData: 'NoMoreData',
};

export default class PullRefreshListView extends Component {

  static propTypes = {
    initialListSize: PropTypes.number,
    pullUpDistance: PropTypes.number,
    pullUpStayDistance: PropTypes.number,
    pullDownDistance: PropTypes.number,
    pullDownStayDistance: PropTypes.number,
    renderRow: PropTypes.func.isRequired,
    renderEmptyComponent: PropTypes.func,
    onRefresh: PropTypes.func.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    onSetError: PropTypes.func,
  };

  static defaultProps = {
    initialListSize: 10,
    pullUpDistance: 20,
    pullUpStayDistance: 50,
    pullDownDistance: 50,
    pullDownStayDistance: 50,
  };

  state = {
    dataSource: new ListView.DataSource({rowHasChanged: () => true}),
    status: ListStatus.Refreshing,
    isNoData: true,
    dataList: [],
  };
  isRefreshing = false;
  isLoadingMore = false;

  /**
   *  开始刷新
   */
  beginRefresh = (bounceDisabled = false) => {
    if (this.isRefreshing) return;
    this.isRefreshing = true;
    this.listView && this.listView.beginRefresh(bounceDisabled);
  };

  /*
   * 设置ListView数据集
   *
   * @param dataList      数据集。一般为数组，带分组时为对象（包含dataBlob、sectionIDs、rowIDs）。必传
   * @param page          当前加载的页面
   * @param isLoadAll     是否加载完所有。boolean，必传
   */
  setData = (dataList, page, isLoadAll) => {
    this.isRefreshing = false;
    this.isLoadingMore = false;
    const isFirstLoad = page === 1;

    if (isFirstLoad && dataList.length === 0) {
      // 空数据，显示一个cell，用来显示空列表视图
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows([0]),
        status: ListStatus.Normal,
        isNoData: true,
      });
    } else {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataList),
        status: isLoadAll ? ListStatus.NoMoreData : ListStatus.Normal,
        isNoData: dataList.length === 0,
        dataList,
      });
    }

    if (isFirstLoad) {
      this.listView && this.listView.endRefresh();
      isLoadAll && this.listView && this.listView.endLoadMore(true);
    } else {
      this.listView && this.listView.endLoadMore(isLoadAll);
    }
  };

  /**
   * 请求出错时调用
   */
  setError = () => {
    this.isRefreshing && this.listView && this.listView.endRefresh();
    this.isLoadingMore && this.listView && this.listView.endLoadMore(false);

    this.isRefreshing = false;
    this.isLoadingMore = false;
    this.setState({status: ListStatus.NetworkError}, () => {
      this.props.onSetError && this.props.onSetError();
    });
  };

  /**
   * 点击【重新加载】
   */
  handlePressReload = () => this.setState({status: ListStatus.Refreshing}, this.beginRefresh);

  /**
   * 刷新中
   */
  handleRefresh = () => {
    if (this.isRefreshing) return;
    this.isRefreshing = true;

    const {onRefresh} = this.props;
    onRefresh && onRefresh();
  };

  /**
   * 加载更多中
   */
  handleLoadMore = () => {
    if (this.isLoadingMore) return;

    this.isLoadingMore = true;
    const {status, isNoData} = this.state;
    const {onLoadMore} = this.props;
    // 网络失败时，先设置回加载中，触发回调
    if (status === ListStatus.NetworkError) {
      this.setState({status: ListStatus.Normal}, () => onLoadMore && onLoadMore());
    } else if (status === ListStatus.NoMoreData || isNoData) {
      // BugFix：首页就加载完毕时，拉到底部显示没有更多，此时无法进行下拉刷新，需要手动调用一次endLoadMore
      this.listView && this.listView.endLoadMore(true);
    } else if (status === ListStatus.Normal) {
      onLoadMore && onLoadMore();
    }
  };

  renderRow = (rowData, sectionId, rowId) => {
    const {renderRow} = this.props;
    const {status, isNoData, dataList} = this.state;
    // 正常加载，但是没有数据，显示空视图
    if (status === ListStatus.Normal && isNoData) return this.renderEmptyContent();
    const isLastItem = rowId == dataList.length - 1;

    // 首屏加载完毕时，footer没有出来？这里用最后一个row来显示底部样式
    // 但是 rowHasChanged 返回的一直是true，所以外部的 row 需要使用 PureComponent 组件或是自己做渲染优化
    return (
      <View>
        {renderRow(rowData, sectionId, rowId)}
        {isLastItem && this.renderFooter()}
      </View>
    );
  };

  /**
   * 空列表
   */
  renderEmptyContent = () => {
    const {renderEmptyComponent} = this.props;
    if (renderEmptyComponent) return renderEmptyComponent();

    return (
      <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: 'red'}}>
        <Text>空列表</Text>
      </View>
    );
  };

  /**
   * 头部视图
   */
  renderHeader = ({pullState}) => {
    const { refreshing } = PullToRefreshListView.constants.viewState;

    return (
      <View style={styles.refreshHead}>
        {pullState === refreshing ?
          <AnimatedCircle /> :
          <Image source={require('../resource/pc_refresh_arrow.png')} />
        }
      </View>
    );
  };

  /**
   * 脚部视图
   */
  renderFooter = () => {
    const {status} = this.state;
    if (status === ListStatus.Refreshing) return null;

    const footerTitle = status === ListStatus.NoMoreData ? '已经是最底部了~' : '网络不给力噢~';
    const showTitle = status === ListStatus.NoMoreData || status === ListStatus.NetworkError;

    // 显示标题的情况
    if (showTitle) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>{footerTitle}</Text>
        </View>
      );
    }

    return (
      <View style={styles.footer}>
        <ActivityIndicator />
      </View>
    );
  };

  /**
   * 网络出错视图
   */
  renderNetErrorView = () => {
    return (
      <View style={styles.page_root}>
        <View style={styles.error_center}>
          <Image style={styles.error_center_img} source={require('../resource/net_error.png')} />
          <Text style={styles.error_center_text}>啊哦，页面加载出问题了</Text>
          <TouchableOpacity
            activeOpacity={0.75}
            style={styles.error_center_btn}
            onPress={this.handlePressReload}
          >
            <Text style={styles.error_center_btn_text}>重新加载</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    const {
      pullDownDistance, pullDownStayDistance, pullUpDistance, pullUpStayDistance,
      initialListSize,
    } = this.props;
    const {status, isNoData} = this.state;
    // 无数据，且网络出错了
    if (status === ListStatus.NetworkError && isNoData) return this.renderNetErrorView();

    return (
      <View style={styles.root}>
        <PullToRefreshListView
          enableEmptySections
          autoLoadMore
          ref={o => this.listView = o}
          initialListSize={initialListSize}
          viewType={viewType.listView}
          dataSource={this.state.dataSource}
          style={[styles.root]}
          renderHeader={this.renderHeader}
          pullUpDistance={pullUpDistance}
          pullUpStayDistance={pullUpStayDistance}
          pullDownDistance={pullDownDistance}
          pullDownStayDistance={pullDownStayDistance}
          renderRow={this.renderRow}
          onRefresh={this.handleRefresh}
          onLoadMore={this.handleLoadMore}
        />
      </View>
    );
  }
}

// 动画小圆
class AnimatedCircle extends Component {
  animatedValue = new Animated.Value(0);

  componentDidMount() {
    this.startAnimation();
  }

  componentWillUnmount() {
    this.animation && this.animation.stopAnimation();
  }

  startAnimation = () => {
    this.animation = Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 1125 * 1000, // 转个1000圈
      easing: Easing.linear,
    }).start();
  };

  render() {
    const rotateY = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360000deg'],
    });
    return <Animated.View style={[styles.animatedCircle, {transform: [{rotateY}]}]} />;
  }
}