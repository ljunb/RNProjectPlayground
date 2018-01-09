/**
 * Description : 类朋友圈查看图片效果的尝试
 *
 * Author : cookiej
 * Date   : 2018/1/9
 * Time   : 09:46
 */
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Easing,
} from 'react-native';

const {width: screenW, height: screenH} = Dimensions.get('window');
const barHeight = StatusBar.currentHeight || 0;

export default class ImageViewPager extends Component {
  state = {
    show: false,
    operateIndex: 0,
    origin: {
      px: 0,
      py: 0,
      height: 0,
      width: 0,
    },
  };
  originImageRefs = []; // 所有原始布局的图片组件实例
  animatedImageRefs = []; // 画廊渲染的所有动画图片组件实例，用于执行关闭动画

  /**
   * 显示画廊
   *
   * @param operateIndex 点击的图片下标
   * @param origin 点击的图片layout属性{px, py, width, height}
   * @param originImageRefs 所有的图片组件实例
   */
  show = (operateIndex, origin, originImageRefs) => {
    this.originImageRefs = originImageRefs;

    this.setState({operateIndex, show: true, origin}, () => {
      this.scrollView && this.scrollView.scrollTo({x: operateIndex * screenW, animated: false});
    });
  };

  /**
   * 关闭时先测量取得当前图片的layout属性，再进行动画
   */
  close = () => {
    const {operateIndex} = this.state;
    const operateOriginRef = this.originImageRefs[operateIndex];
    operateOriginRef && operateOriginRef.measure((ox, oy, width, height, px, py) => {
      this.setState({
        origin: { px, py, width, height },
      }, () => {
        const operateAnimatedRef = this.animatedImageRefs[operateIndex];
        operateAnimatedRef && operateAnimatedRef.close(this.hideViewPager);
      });
    });
  };

  hideViewPager = () => this.setState({show: false});

  handleScrollEnd = evt => {
    const {contentOffset} = evt.nativeEvent;
    const operateIndex = contentOffset.x / screenW;
    this.setState({operateIndex});
  };

  render() {
    if (!this.state.show) return null;
    const {imageList} = this.props;
    const {operateIndex} = this.state;

    return (
      <View style={[StyleSheet.absoluteFill]}>
        <ScrollView
          horizontal
          pagingEnabled
          ref={r => this.scrollView = r}
          style={{flex: 1}}
          onMomentumScrollEnd={this.handleScrollEnd}
        >
          {imageList.map((image, index) => {
            return (
              <AnimatedImage
                ref={r => this.animatedImageRefs[index] = r}
                key={`ScrollImage_${index}`}
                animated={operateIndex === index}
                source={{uri: image}}
                origin={this.state.origin}
                onPress={this.close}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

class AnimatedImage extends Component {
  animatedValue = new Animated.Value(0);

  componentDidMount() {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
    }).start();
  }

  close = callback => {
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
    }).start(callback);
  };

  render() {
    const {origin} = this.props;
    const top = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.py, (screenH - barHeight - 300) / 2],
    });
    const left = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.px, 0],
    });
    const width = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.width, screenW],
    });
    const height = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.height, 300],
    });

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{height: screenH - barHeight, width: screenW}}
        onPress={this.props.onPress}
      >
        <Animated.Image
          style={{ height, width, left, top }}
          source={this.props.source}
        />
      </TouchableOpacity>
    );
  }
}