/**
 * Description : 类朋友圈查看图片效果的尝试
 *
 * Author : cookiej
 * Date   : 2018/1/9
 * Time   : 09:46
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import Gallery from 'react-native-gallery';

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
  animatedValue = new Animated.Value(0);
  positionValue = new Animated.Value(0);

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
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 300,
      }).start(() => this.positionValue.setValue(1));
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
        origin: {px, py, width, height},
      }, () => {
        this.positionValue.setValue(0);
        Animated.timing(this.animatedValue, {
          toValue: 0,
          duration: 300,
        }).start(this.hideViewPager);
      });
    });
  };

  hideViewPager = () => this.setState({show: false});

  render() {
    if (!this.state.show) return null;
    const {imageList} = this.props;
    const {operateIndex, origin} = this.state;
    const newImageList = imageList.map(item => item.url);

    const image = imageList[operateIndex];
    const newHeight = screenH * image.height / image.width;
    const top = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [origin.py, (screenH - barHeight - newHeight) / 2],
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
      outputRange: [origin.height, newHeight],
    });

    const translateY = this.positionValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, screenH],
    });

    return (
      <View style={[StyleSheet.absoluteFill]}>
          <Gallery
            style={{flex: 1, backgroundColor: 'black'}}
            images={newImageList}
            initialPage={operateIndex}
            onSingleTapConfirmed={this.close}
            onPageSelected={index => this.setState({operateIndex: index})}
          />
        <Animated.View style={[StyleSheet.absoluteFill, {backgroundColor: 'black', transform: [{translateY}]}]}>
          <Animated.Image
            style={{height, width, left, top}}
            source={{uri: image.url}}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    );
  }
}