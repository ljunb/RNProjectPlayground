/*
 * @Description: 轮播图动画指示器示例
 * @Author: cookiej
 * @Date: 2019-05-07 13:50:18
 * @Last Modified by: cookiej
 * @Last Modified time: 2019-05-07 13:50:18
 */

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Animated,
  ScrollView,
  Dimensions
} from 'react-native';

const { width: screenW } = Dimensions.get('window');
const DotWH = 8;
const DotMargin = 10;

const styles = StyleSheet.create({
  page: {
    width: screenW
  },
  indicator: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dot: {
    backgroundColor: 'red',
    height: DotWH,
    width: DotWH,
    borderRadius: DotWH / 2,
    marginRight: DotMargin
  },
  animatedDot: {
    height: DotWH,
    backgroundColor: 'blue',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRadius: DotWH / 2
  }
});

export default class AnimatedIndicatorDemo extends PureComponent {
  animatedValue = new Animated.Value(0);

  handleScroll = (evt) => {
    const { x } = evt.nativeEvent.contentOffset;
    this.animatedValue.setValue(x);
  };

  renderPage = (page, index) => (
    <View key={`Page_${index}`}
          style={[styles.page, { backgroundColor: `rgba(100,100,100,${index / 10})` }]}/>
  );

  renderIndicator = (_, index) => {
    return (
      <View key={`Indicator_${index}`} style={styles.dot}/>
    );
  };

  render() {
    const pages = [0, 0, 0, 0, 0];
    let inputRange = [],
      widthOutputRange = [],
      tranlateXOutputRange = [];
    pages.map((_, index) => {
      if (index === 4) return;

      if (index === 0) {
        inputRange.push(index * screenW);
        widthOutputRange.push(DotWH);
        tranlateXOutputRange.push(0);
      }
      inputRange.push(screenW * (index + 1 / 2));
      inputRange.push(screenW * (index + 1));

      widthOutputRange.push(DotWH * 2 + DotMargin);
      widthOutputRange.push(DotWH);

      tranlateXOutputRange.push((DotMargin+DotWH) * index);
      tranlateXOutputRange.push((DotMargin+DotWH) * (index + 1));
    });

    const width = this.animatedValue.interpolate({
      inputRange,
      outputRange: widthOutputRange,
      extrapolate: 'clamp'
    });
    const translateX = this.animatedValue.interpolate({
      inputRange,
      outputRange: tranlateXOutputRange,
      extrapolate: 'clamp'
    });
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          horizontal
          pagingEnabled
          onScroll={this.handleScroll}
          scrollEventThrottle={1}
        >
          {pages.map(this.renderPage)}
        </ScrollView>
        <View style={styles.indicator}>
          <View style={{ flexDirection: 'row' }}>
            {pages.map(this.renderIndicator)}
            <Animated.View style={[styles.animatedDot, {
              width,
              transform: [{ translateX }]
            }]}/>
          </View>
        </View>
      </View>
    )
  }
}
