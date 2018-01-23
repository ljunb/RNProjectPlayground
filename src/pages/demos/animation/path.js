/**
 * Project - RNProjectPlayground
 * Author      : ljunb
 * Date        : 2018/1/23 上午9:48
 * Description : Path 动画菜单效果
 */
import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBtn: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  item: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: 'red',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    backgroundColor: 'transparent',
    color: '#fff',
  },
});

export default class PathMenuAnimation extends Component {
  static propTypes = {
    icons: PropTypes.array,
  };

  static defaultProps = {
    icons: [0, 1, 2, 3, 4],
  };

  animatedValue = new Animated.Value(0);
  isFold = true;
  state = {
    origin: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  };

  handleShowOrHideMenu = () => {
    this.actionBtn && this.actionBtn.measure((ox, oy, width, height, px, py) => {
      this.setState({origin: {width, height, x: px, y: py}}, () => {
        if (this.isFold) {
          this.spreadMenus();
        } else {
          this.foldMenus();
        }
      });
    });
  };

  /**
   * 展开菜单
   */
  spreadMenus = () => {
    Animated.spring(this.animatedValue, {
      toValue: 1,
      duration: 200,
      friction: 5,
    }).start(() => this.isFold = false);
  };

  /**
   * 折叠菜单
   */
  foldMenus = () => {
    Animated.sequence([
      Animated.timing(this.animatedValue, {
        toValue: 1.3,
        duration: 150,
      }),
      Animated.timing(this.animatedValue, {
        toValue: 0,
        duration: 300,
      }),
    ]).start(() => this.isFold = true);
  };

  get buildAnimatedValues() {
    const {icons} = this.props;
    // 每个按钮之间的间距角度
    const marginAngle = Math.PI / 180 * 30;
    const restAngle = (Math.PI / 180 * 180 - (icons.length - 1) * 30 * Math.PI / 180) / 2;
    return icons.map((icon, index) => {
      const top = -120 * Math.sin(restAngle + index * marginAngle) ;
      const left = 120 * Math.cos(restAngle + index * marginAngle);
      return {top, left};
    });
  }

  render() {
    const {origin} = this.state;

    const rotate = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-90deg'],
    });
    const originCenter = {
      x: origin.x + origin.width / 2,
      y: origin.y + origin.height / 2,
    };

    return (
      <View style={styles.root}>
        {this.props.icons.map((icon, index) => {
          const animatedItem = this.buildAnimatedValues[index];
          const top = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [origin.y + 5, originCenter.y + animatedItem.top],
          });
          const left = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [origin.x + 5, originCenter.x - animatedItem.left - 15],
          });
          const rotate = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '3600deg'],
          });
          const opacity = this.animatedValue;

          return (
            <Animated.View
              key={`Item_${index}`}
              style={[styles.item, {top, left, transform:[{rotate}], opacity}]}
            >
              <Text style={styles.itemText}>{index}</Text>
            </Animated.View>
          );
        })}
        <TouchableOpacity
          ref={r => this.actionBtn = r}
          activeOpacity={1}
          style={styles.centerBtn}
          onPress={this.handleShowOrHideMenu}
        >
          <Animated.Text style={[{color: '#fff'}, {transform: [{rotate}]}]}>＋</Animated.Text>
        </TouchableOpacity>
      </View>
    );
  }
}