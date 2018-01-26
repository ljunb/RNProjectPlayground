/**
 * 仿头脑王者游戏效果
 */
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';

const OutCircleRadius = 90;
const InnerCircleRadius = 60;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: 200,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'red',
    position: 'absolute',
    left: 80,
    top: 80,
  },
  outCircle: {
    borderColor: 'red',
    borderWidth: 1,
    height: OutCircleRadius * 2,
    width: OutCircleRadius * 2,
    borderRadius: OutCircleRadius,
  },
  innerCircle: {
    borderColor: 'red',
    borderWidth: 1,
    height: InnerCircleRadius * 2,
    width: InnerCircleRadius * 2,
    borderRadius: InnerCircleRadius,
    position: 'absolute',
    top: (200 - InnerCircleRadius*2) / 2,
    left: (200 - InnerCircleRadius*2) / 2,
  },
  outIndicator: {
    position: 'absolute',
    top: 0,
    left: OutCircleRadius,
    height: 5,
    width: 5,
    backgroundColor: 'red',
  },
  innerIndicator: {
    position: 'absolute',
    top: 0,
    left: InnerCircleRadius,
    height: 5,
    width: 5,
    backgroundColor: 'red',
  }
})

export default class HeadKing extends Component {

  rotateValue = new Animated.Value(0);


  componentDidMount() {
    this.startMatching();
  }

  startMatching = () => {
    Animated.timing(this.rotateValue, {
      toValue: 1,
      duration: 5 * 1000,
      easing: Easing.linear,
    }).start(this.repeatAnimation);
  };

  repeatAnimation = () => {
    this.rotateValue.setValue(0);
    this.startMatching();
  };

  render() {
    const outRotate = this.rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const innerRotate = this.rotateValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['360deg', '0deg'],
    });
    const innerScale = this.rotateValue.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 1, 1,]
    })

    return (
      <View style={styles.root}>
        <View style={styles.content}>
          <Animated.View style={[styles.outCircle, {transform: [{rotate: outRotate}]}]}>
            <View style={styles.outIndicator} />
          </Animated.View>
          <Animated.View style={[styles.innerCircle, {transform: [{rotate: innerRotate}, {scale: innerScale}]}]}>
            <View style={styles.innerIndicator} />
          </Animated.View>
          <View style={styles.avatar} />
        </View>
      </View>
    );
  }
}