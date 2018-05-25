/*
 * @Description: 商城类App首页粘性tabbar
 * @Author: cookiej 
 * @Date: 2018-05-25 10:26:00 
 * @Last Modified by: cookiej
 * @Last Modified time: 2018-05-25 15:45:43
 */
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  UIManager,
  findNodeHandle,
  Animated,
  Easing
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  banner: {
    height: 240,
    backgroundColor: '#ccc'
  },
  menus: {
    height: 180,
    backgroundColor: '#fff'
  },
  tabBar: {
    height: 50,
    backgroundColor: '#ccc'
  },
  tabBarItem: {
    height: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  listTitle: {
    height: 30,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#eee'
  },
  listCell: {
    height: 80,
    paddingHorizontal: 15,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
  },
  indicatorLine: {
    height: 2,
    backgroundColor: 'red',
    borderRadius: 1,
    position: 'absolute',
    bottom: 8,
    width: 20,
  }
});

export default class extends PureComponent {
  tabBarItems = [
    '新闻', '广州', '娱乐', '今日头条', '直播间', '汽车', '社会', '视频', '图片', '吐槽'
  ];
  state = {
    tabBarObj: [],
  }
  tabBarOriginY = 0; // tabbar的位置y
  fullScreenContentHeight = 0; // 全屏可滚动内容高度
  tabBarContentSizeX = 0; // tabbar可水平滑动宽度
  tabBarItemRefs = []; // 每个tabbar item的实例引用
  sectionRefs = []; // 每个分组的实例引用
  sectionTitleOriginYs = []; // 每个区域的分组头部位置y
  selectedIndex = 0; // 当前选中的index
  indicatorOriginX = new Animated.Value(0); // 指示器的位置动画值

  componentDidMount() {
    this.setupMock();
  }

  setupMock = () => {
    const tabBarObj = [];
    let originY = 0;

    for (const tabBarItem of this.tabBarItems) {
      const random = parseInt(Math.random() * 5) + 1
      const arr = new Array(random);
      const list = [...arr.map(() => 0)]

      tabBarObj.push({
        list,
        title: tabBarItem,
      });

      // 保存每个分组的 originY
      this.sectionTitleOriginYs.push(originY)
      originY += 30 + list.length * 80;
    }
    this.setState({ tabBarObj });
  };

  /**
   * 记录粘性 tabbar 的位置y
   */
  handleTabBarLayout = evt => {
    const { y } = evt.nativeEvent.layout;
    if (y !== this.tabBarOriginY) {
      this.tabBarOriginY = y;
    }
  }

  /**
   * 点击 tabbar 选项
   */
  handlePressTabBar = selectedIndex => {
    const defaultY = this.tabBarOriginY;

    if (!this.sectionRefs[selectedIndex]) return;

    const sectionAnchor = findNodeHandle(this.sectionRefs[selectedIndex]);
    const scrollViewAnchor = findNodeHandle(this.scrollView);
    UIManager.measureLayout(sectionAnchor, scrollViewAnchor, () => { }, (x, y, width) => {
      // 不足一屏，滚动到尾部即可
      if (this.fullScreenContentHeight - y < SCREEN_HEIGHT) {
        this.scrollView && this.scrollView.scrollToEnd();
      } else {
        // 减去 tabbar 的高度
        this.scrollView && this.scrollView.scrollTo({ y: y - 50 });
      }
    });
    this.updateCurrentTabPosition(selectedIndex);
  };

  /**
   * tabbar 滚动至当前选中位置，屏幕中间
   */
  updateCurrentTabPosition = selectedIndex => {
    if (this.selectedIndex === selectedIndex) return;
    this.selectedIndex = selectedIndex;

    if (!this.tabBarItemRefs[selectedIndex]) return;

    // Android measure 无效，尝试后使用该方式
    const anchor = findNodeHandle(this.tabBarItemRefs[selectedIndex]);
    const tabBarAnchor = findNodeHandle(this.tabBar);
    UIManager.measureLayout(anchor, tabBarAnchor, () => { }, (x, y, width) => {
      // 红线动画
      const animatedX = (width - 20) / 2 + x;
      Animated.timing(this.indicatorOriginX, {
        toValue: animatedX,
        duration: 200,
        easing: Easing.linear
      }).start();

      let offsetX = x - SCREEN_WIDTH / 2;
      if (offsetX < 0) {
        offsetX = 0;
      } else if (this.tabBarContentSizeX - x - width / 2 < SCREEN_WIDTH / 2) {
        // 不足以滚动到中间，滚动到尾部即可
        this.tabBar && this.tabBar.scrollToEnd()
        return;
      } else {
        offsetX += width / 2;
      }
      this.tabBar && this.tabBar.scrollTo({ x: offsetX })
    });
  }

  /**
   * 父 scrollview 垂直可滚动内容高度
   */
  handleContentSizeChange = (_, contentHeight) => {
    if (contentHeight !== this.fullScreenContentHeight) {
      this.fullScreenContentHeight = contentHeight;
    }
  }

  /**
   * 粘性 tabbar 水平可滚动的内容宽度
   */
  handleTabBarContentSizeChange = (contentWidth, _) => {
    if (this.tabBarContentSizeX !== contentWidth) {
      this.tabBarContentSizeX = contentWidth;
    }
  }

  /**
   * 父 scrollview 滚动动画结束
   */
  handleScrollEnd = evt => {
    const { y } = evt.nativeEvent.contentOffset;
    const diffOffset = y - this.tabBarOriginY;
    const selectedIndex = this.findCurrentIndex(diffOffset);
    this.updateCurrentTabPosition(selectedIndex);
  };

  /**
   * 找到滚动停止时，所处于的index
   */
  findCurrentIndex = offsetY => {
    const largeSlice = this.sectionTitleOriginYs.filter(originY => originY >= offsetY);
    return this.sectionTitleOriginYs.indexOf(largeSlice[0]);
  };

  /**
   * 设置红线的初始位置
   */
  handleFirstTabItemLayout = evt => {
    const { width } = evt.nativeEvent.layout;
    const originX = (width - 20) / 2;
    this.indicatorOriginX.setValue(originX);
  }

  renderTabItems = (item, index) => {
    return (
      <TouchableOpacity
        ref={r => this.tabBarItemRefs[index] = r}
        key={`TabBarItem_${index}`}
        style={styles.tabBarItem}
        onPress={() => this.handlePressTabBar(index)}
        onLayout={this.handleFirstTabItemLayout}
      >
        <Text>{item}</Text>
      </TouchableOpacity>
    )
  };

  renderContentList = (tabObj, index) => {
    return (
      <View key={`Section_${index}`} ref={r => this.sectionRefs[index] = r}>
        <View style={styles.listTitle}>
          <Text>{tabObj.title}</Text>
        </View>
        <View>
          {tabObj.list.map((item, key) => {
            return (
              <View key={`SectionListCell_${key}`} style={styles.listCell}>
                <Text>{`${tabObj.title}_${key}`}</Text>
              </View>
            )
          })}
        </View>
      </View>
    )
  };

  render() {
    return (
      <ScrollView
        removeClippedSubviews
        ref={r => this.scrollView = r}
        stickyHeaderIndices={[2]}
        scrollEventThrottle={16}
        onContentSizeChange={this.handleContentSizeChange}
        onMomentumScrollEnd={this.handleScrollEnd}
      >
        <View style={styles.banner} />
        <View style={styles.menus} />
        <ScrollView
          horizontal
          ref={r => this.tabBar = r}
          showsHorizontalScrollIndicator={false}
          style={styles.tabBar}
          onLayout={this.handleTabBarLayout}
          onContentSizeChange={this.handleTabBarContentSizeChange}
        >
          {this.tabBarItems.map(this.renderTabItems)}
          <Animated.View style={[styles.indicatorLine, { left: this.indicatorOriginX }]} />
        </ScrollView>
        <View>
          {this.state.tabBarObj.map(this.renderContentList)}
        </View>
      </ScrollView>
    );
  }
}