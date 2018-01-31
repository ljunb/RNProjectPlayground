/**
 * 仿头脑王者游戏效果
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  Easing,
} from 'react-native';
import Common from '../../../../common/constants';
import CJNavigation from '../../../../bridges/CJNavigation';
import Gaming from './gaming';

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
    top: (200 - InnerCircleRadius * 2) / 2,
    left: (200 - InnerCircleRadius * 2) / 2,
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
  },
});

export default class HeadKing extends Component {

  state = {
    isMatchSuccess: false,
    isGaming: false,
  };
  rotateValue = new Animated.Value(0);
  coinValue = new Animated.Value(0);
  value = 0;

  componentWillMount() {
    this.rotateValue.addListener(({value}) => {
      const second = 3 + Math.random();
      if (value >= second * 1000) {
        this.rotateValue.stopAnimation();
        this.setState({isMatchSuccess: true}, this.startCoinAnimation);
      } else {
        this.value = value;
      }
    });
  }

  componentDidMount() {
    this.startMatching();
  }

  startMatching = () => {
    Animated.timing(this.rotateValue, {
      toValue: 10 * 4 * 1000,
      duration: 10 * 4 * 1000,
      easing: Easing.linear,
    }).start();
  };

  startCoinAnimation = () => {
    Animated.timing(this.coinValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
    }).start(() => {
      // 进入答题页
      // setTimeout(() => CJNavigation.push('demos/animation/headking/gaming'), 2000);
      setTimeout(() => this.setState({isGaming: true}), 2000);
    });
  };

  renderMatchSuccess = () => {
    const scale = this.coinValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    const rotate = this.coinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={{flex: 1, paddingVertical: 80, justifyContent: 'space-between'}}>
        <LeftPlayer />
        <Animated.Text style={{transform: [{rotate}, {scale}], alignSelf: 'center'}}>胜者赢取17个金币</Animated.Text>
        <RightPlayer />
      </View>
    );
  };

  render() {
    if (this.state.isGaming) return <Gaming />;
    if (this.state.isMatchSuccess) return this.renderMatchSuccess();

    const outRotate = this.rotateValue.interpolate({
      inputRange: [0, 10 * 4 * 1000],
      outputRange: ['0deg', `${360 * 10}deg`],
    });
    const innerRotate = this.rotateValue.interpolate({
      inputRange: [0, 10 * 4 * 1000],
      outputRange: [`${360 * 10}deg`, '0deg'],
    });

    return (
      <View style={styles.root}>
        <View style={styles.content}>
          <Animated.View style={[styles.outCircle, {transform: [{rotate: outRotate}]}]}>
            <View style={styles.outIndicator}/>
          </Animated.View>
          <Animated.View style={[styles.innerCircle, {transform: [{rotate: innerRotate}]}]}>
            <View style={styles.innerIndicator}/>
          </Animated.View>
          <View style={styles.avatar}/>
        </View>
        <Text>匹配中……</Text>
      </View>
    );
  }
}

class LeftPlayer extends Component {

  animatedValue = new Animated.Value(0);
  scaleValue = new Animated.Value(0);

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    Animated.sequence([
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
      }),
      Animated.spring(this.scaleValue, {
        toValue: 1,
        duration: 100,
      }),
    ]).start();
  };

  render() {
    const translateX = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-150, 50],
    });
    const scale = this.scaleValue;

    return (
      <Animated.View style={{transform: [{translateX}], alignItems: 'center', width: 150}}>
        <View style={{backgroundColor: 'red', height: 100, width: 100, borderRadius: 50}}/>
        <Animated.Text style={{transform: [{scale}], marginTop: 10}}>广州 奥迪</Animated.Text>
      </Animated.View>
    );
  }
}

class RightPlayer extends Component {

  animatedValue = new Animated.Value(0);
  scaleValue = new Animated.Value(0);

  componentDidMount() {
    this.startAnimation();
  }

  startAnimation = () => {
    Animated.sequence([
      Animated.timing(this.animatedValue, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
      }),
      Animated.spring(this.scaleValue, {
        toValue: 1,
        duration: 100,
      }),
    ]).start();
  };

  render() {
    const translateX = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [Common.screenW + 150, Common.screenW - 150 - 50],
    });
    const scale = this.scaleValue;

    return (
      <Animated.View style={{transform: [{translateX}], alignItems: 'center', width: 150}}>
        <View style={{backgroundColor: 'red', height: 100, width: 100, borderRadius: 50}}/>
        <Animated.Text style={{transform: [{scale}], marginTop: 10}}>厦门 奔驰</Animated.Text>
      </Animated.View>
    );
  }
}