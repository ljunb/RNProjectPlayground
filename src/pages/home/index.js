/**
 * Description : 首页
 *
 * Author : cookiej
 * Date   : 2017/12/20
 * Time   : 16:56
 */
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Animated,
} from 'react-native';
import styles from './styles/Home';
import CJNavigation from '../../bridges/CJNavigation';
import Constant from '../../common/constants';
import HomeModel from './models/HomeModel';
import Loading from '../../components/Loading';

@observer
export default class Home extends Component<{}> {
  constructor(props) {
    super(props);
    this.homeModel = HomeModel.setup();

    this.scrollOffsetY = new Animated.Value(0);
    this.captureSearchAction = false;
    this.scrollListener = this.scrollOffsetY.addListener(({value}) => {
      // 透明度为1时才支持触发点击事件
      this.captureSearchAction = value >= 220 - 64;
    })
  }

  componentDidMount() {
    this.homeModel.fetchData();
  }

  componentWillUnmount() {
    this.scrollOffsetY.removeListener(this.scrollListener);
  }

  handleRefresh = () => this.homeModel.refresh();

  handleSearch = () => this.captureSearchAction && CJNavigation.push('search');

  /**
   * 饮食分析、搜索对比、扫码对比点击事件
   * @param {String} option 按钮名称
   */
  handlePressOption = option => alert(option);

  /**
   * 点击分组中具体条目
   * @param {String} foodKind 分组名称
   * @param {Object} food 食物数据对象
   */
  handlePressFood = (foodKind, food) => alert(JSON.stringify(food) + ':' + foodKind);

  renderFoodGroupView = (foodGroup, index) => {
    return <FoodGroupView key={`FoodGroup-${index}`} foodGroup={foodGroup} onPress={this.handlePressFood}/>
  };

  render() {
    const {foodList, isLoading, isLoadError} = this.homeModel;
    const showContent = !isLoading && !isLoadError;

    return (
      <View style={styles.container}>
        <AnimatedNavigationBar scrollOffsetY={this.scrollOffsetY} onPress={this.handleSearch}/>
        <AnimatedHeaderImage scrollOffsetY={this.scrollOffsetY}/>
        <ScrollView
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={{alignItems: 'center', backgroundColor: 'transparent', paddingBottom: 10}}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.scrollOffsetY}}}])}
          scrollEventThrottle={16}
        >
          <HeaderView
            searchAction={() => CJNavigation.push('search')}
            scrollValue={this.scrollOffsetY}
          />
          <FoodHandleView handleAction={this.handlePressOption}/>
          {showContent && <View>{foodList.map(this.renderFoodGroupView)}</View>}
          {isLoadError && <ReconnectView onPress={this.handleRefresh}/>}
        </ScrollView>
        <Loading isShow={isLoading}/>
      </View>
    );
  }
}

const AnimatedNavigationBar = ({scrollOffsetY, onPress}) => {
  const opacity = scrollOffsetY.interpolate({
    // 220 为HeaderView高度
    inputRange: [0, 64, 220 - 64],
    outputRange: [0, 0, 1],
  });
  return (
    <Animated.View style={[styles.animatedNav, {opacity}]}>
      <SearchInputView onPress={onPress} style={{height: 38}}/>
    </Animated.View>
  );
};

const AnimatedHeaderImage = ({scrollOffsetY}) => {
  // 图片宽、高、位移动画插值
  const width = scrollOffsetY.interpolate({
    inputRange: [-100, -80, 0, 10],
    outputRange: [Constant.screenW + 50, Constant.screenW, Constant.screenW, Constant.screenW]
  });
  const height = scrollOffsetY.interpolate({
    inputRange: [-30, 0, 10],
    outputRange: [250, 220, 220]
  });
  const translateX = scrollOffsetY.interpolate({
    inputRange: [-100, -80, 0, 10],
    outputRange: [-25, 0, 0, 0]
  });
  const translateY = scrollOffsetY.interpolate({
    inputRange: [-10, 0, 10],
    outputRange: [0, 0, -10],
  });

  return (
    <Animated.Image
      style={[styles.animatedBigImage, {width, height, transform: [{translateX}, {translateY}]}]}
      source={require('../../resource/img_home_bg.png')}
    />
  )
};

const SearchInputView = ({onPress, style}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={[styles.headerSearchContainer, style]}
      onPress={onPress}
    >
      <Image
        style={{width: 20, height: 20, marginHorizontal: 5}}
        source={require('../../resource/ic_home_search.png')}
      />
      <Text style={{color: 'rgba(222, 113, 56, 0.8)', fontSize: 15, fontWeight: '100'}}>请输入食物名称</Text>
    </TouchableOpacity>
  );
};

const ReconnectView = ({onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
      onPress={onPress}
    >
      <Text>网络出错，点击重试~</Text>
    </TouchableOpacity>
  )
};

const HeaderView = ({searchAction}) => {
  return (
    <View style={[styles.headerContainer]}>
      <ImageBackground
        style={styles.headerLogo}
        source={require('../../resource/ic_head_logo.png')}
        resizeMode="contain"
      />
      <View style={{alignItems: 'center'}}>
        <Text style={{color: 'white', marginBottom: 15, fontSize: 16, fontWeight: '100'}}>查 询 食 物 信 息</Text>
        <SearchInputView onPress={searchAction}/>
      </View>
    </View>
  )
};

const FoodHandleView = ({handleAction}) => {
  return (
    <View style={styles.foodHandleContainer}>
      <HandleItem
        title="饮食分析"
        imageName={require('../../resource/ic_home_analyse.png')}
        onPress={() => handleAction('饮食分析')}
      />
      <View style={styles.line}/>
      <HandleItem
        title="搜索对比"
        imageName={require('../../resource/ic_search_compare.png')}
        onPress={() => handleAction('搜索对比')}
      />
      <View style={styles.line}/>
      <HandleItem
        title="扫码对比"
        imageName={require('../../resource/ic_scan_compare.png')}
        onPress={() => handleAction('扫码对比')}
      />
    </View>
  )
};

const HandleItem = ({imageName, title, onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.handelItem}
      onPress={onPress}
    >
      <Image style={{width: 28, height: 28}} source={imageName}/>
      <Text style={{fontSize: 13, color: '#999', fontWeight: '100'}}>{title}</Text>
    </TouchableOpacity>
  )
};

const FoodGroupView = ({foodGroup, onPress}) => {

  let title = '食物分类';
  if (foodGroup.kind === 'brand') {
    title = '热门品牌';
  } else if (foodGroup.kind === 'restaurant') {
    title = '连锁餐饮';
  }

  return (
    <View style={{backgroundColor: 'white', marginTop: 10, overflow: 'hidden'}}>
      <View style={styles.groupHeader}>
        <Text style={{color: '#333', fontSize: 15, fontWeight: '100'}}>{title}</Text>
        <View style={{width: Constant.screenW - 16 * 2, height: 14, backgroundColor: '#f5f5f5'}}>
          <Image
            style={{width: Constant.screenW - 16 * 2, height: 14}}
            source={require('../../resource/img_home_list_bg.png')}
          />
        </View>
      </View>
      <View style={styles.categoryContainer}>
        {foodGroup.categories.map((Group, index) => {
          return (
            <TouchableOpacity
              key={`Category_${index}`}
              activeOpacity={0.75}
              style={styles.category}
              onPress={() => onPress(foodGroup.kind, Group)}
            >
              <Image
                style={styles.categoryIcon}
                source={{uri: Group.image_url}}
                resizeMode="contain"
              />
              <Text style={styles.categoryTitle}>{Group.name}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
};