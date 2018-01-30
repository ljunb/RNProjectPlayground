/**
 * Description :
 *
 * Author : cookiej
 * Date   : 2018/1/30
 * Time   : 15:17
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class Test extends Component {
  fill = 0;

  startAnimation = () => {
    this.progress && this.progress.performLinearAnimation(100, 1000 * 10);
  };

  stopAnimation = () => {
    this.progress && this.progress.performLinearAnimation(this.fill, 0);
  };

  restartAnimation = () => {
    this.progress && this.progress.performLinearAnimation(0, 0);
    this.startAnimation();
  };

  renderChildren = fill => {
    this.fill = fill;
    return (
      <Text style={{transform: [{rotate: '90deg'}]}}>
        { 10 - parseInt(fill / 10) }
      </Text>
    );
  };

  render() {
    return (
      <View style={styles.root}>
        <View style={{transform: [{rotate: '-90deg'}]}}>
          <AnimatedCircularProgress
            ref={r => this.progress = r}
            size={120}
            width={15}
            fill={0}
            tintColor="#00e0ff"
            onAnimationComplete={() => console.log('onAnimationComplete')}
            backgroundColor="#3d5875"
          >
            {this.renderChildren}
          </AnimatedCircularProgress>
        </View>
        <Text onPress={this.startAnimation}>Start</Text>
        <Text onPress={this.stopAnimation}>Stop</Text>
        <Text onPress={this.restartAnimation}>Restart</Text>
      </View>
    );
  }
}