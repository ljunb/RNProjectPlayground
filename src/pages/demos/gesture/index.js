/*
 * Description : 手势操作
 *
 * Author : cookiej
 * Date   : 2018/1/17
 * Time   : 10:27
 */
import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';

const {width: screenW, height: screenH} = Dimensions.get('window');
const ButtonWH = 80;
const MinPositionX = 20;
const MinPositionY = 20;
const MaxPositionX = screenW - MinPositionX - ButtonWH;
const MaxPositionY = screenH - MinPositionY - ButtonWH;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  square: {
    width: ButtonWH,
    height: ButtonWH,
    backgroundColor: '#ccc',
    borderRadius: ButtonWH / 2,
  },
});

export default class App extends PureComponent {

  constructor(props) {
    super(props);
    this.animatedValue = new Animated.ValueXY({x: MaxPositionX, y: MaxPositionY});
    this.listenerValue = {x: MaxPositionX, y: MaxPositionY};
    this.animatedValue.addListener(value => this.listenerValue = value);
    this.panResponder = {};
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
    });
  }

  handlePanResponderGrant = () => {
    this.animatedValue.setOffset({x: this.listenerValue.x, y: this.listenerValue.y});
    this.animatedValue.setValue({x: 0, y: 0});
  };

  handlePanResponderMove = (e, gestureState) => Animated.event([
    null,
    {dx: this.animatedValue.x, dy: this.animatedValue.y},
  ])(e, gestureState);

  handlePanResponderEnd = (e, gestureState) => {
    this.animatedValue.flattenOffset();

    let posX = gestureState.moveX;
    if (gestureState.moveX < screenW / 2) {
      posX = MinPositionX;
    } else {
      posX = MaxPositionX;
    }

    let posY = gestureState.moveY;
    if (gestureState.moveY > MaxPositionY) {
      posY = MaxPositionY;
    } else if (gestureState.moveY < MinPositionY) {
      posY = MinPositionY;
    }

    // 回弹到边缘
    Animated.parallel([
      Animated.timing(this.animatedValue.x, {
        toValue: posX,
        duration: 200,
      }),
      Animated.timing(this.animatedValue.y, {
        toValue: posY,
        duration: 200,
      }),
    ]).start();
  };

  render() {
    const transform = [{translateY: this.animatedValue.y}, {translateX: this.animatedValue.x}];
    return (
      <View style={styles.container}>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[styles.square, {transform}]}
        />
      </View>
    );
  }
}