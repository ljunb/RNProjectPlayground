/*
 * @Description: react-native-largelist demo
 * @Author: cookiej 
 * @Date: 2018-05-15 09:31:25 
 * @Last Modified by: cookiej
 * @Last Modified time: 2018-05-15 10:44:11
 */

import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { LargeList } from 'react-native-largelist';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const INDICATOR_HEIGHT = SCREEN_HEIGHT - 80 * 2;
const SAMPLE_COUNT = 26;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 64,
  },
  row: {
    justifyContent: 'center',
    paddingLeft: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
    height: 44,
  },
  section: {
    justifyContent: 'center',
    paddingLeft: 16,
    backgroundColor: '#ddd',
    height: 50,
  },
  indicator: {
    position: 'absolute',
    right: 0,
    top: 80,
    bottom: 80,
    width: Platform.OS === 'android' ? 80 : 30,
    backgroundColor: 'transparent',
    alignItems: 'flex-end'
  },
  item: {
    height: INDICATOR_HEIGHT / SAMPLE_COUNT,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default class extends PureComponent {
  
  lastSelectedIndex = null;
  animationValue = new Animated.Value(-SCREEN_HEIGHT);

  renderItem = (section, row) => {
    return (
      <View style={styles.row}>
        <Text>{`Row_${row}`}</Text>
      </View>
    )
  };

  renderSection = section => {
    return (
      <View style={styles.section}>
        <Text>{`Section_${section}`}</Text>
      </View>
    );
  };

  renderIndicatorView = () => {
    const components = [];
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const scale = this.animationValue.interpolate({
        inputRange: [i-3, i-2, i-1, i, i+1, i+2, i+3],
        outputRange: [1, 1.2, 1.5, 1.7, 1.5, 1.2, 1],
        extrapolate: 'clamp'
      });
      const translateX = this.animationValue.interpolate({
        inputRange: [i-4, i-3, i-2, i-1, i, i+1, i+2, i+3, i+4],
        outputRange: [0, -15, -25, -30, -30, -30, -25, -15, 0],
        extrapolate: 'clamp'
      });
      const opacity = this.animationValue.interpolate({
        inputRange: [i-4, i-3, i-2, i-1, i, i+1, i+2, i+3, i+4],
        outputRange: [1, 0.9, 0.5, 0.2, 1, 0.2, 0.5, 0.9, 1],
        extrapolate: 'clamp'
      })
      components.push(
        <Animated.View key={`Indicator_${i}`} style={[styles.item, {transform: [{scale}, {translateX}], opacity}]} pointerEvents="none">
          <Text style={{backgroundColor: 'transparent'}}>{i}</Text>
        </Animated.View>
      );
    }
    return components;
  };

  handleIndicatorMove = evt => {
    const ev = evt.nativeEvent.touches[0];
    const originX = 80;
    const itemHeight = INDICATOR_HEIGHT / SAMPLE_COUNT;
    const index = Math.floor((ev.pageY - originX) / itemHeight);
    
    if (this.lastSelectedIndex !== index) {
      this.lastSelectedIndex = index;
      this.largeList && this.largeList.scrollToIndexPath({section: index, row: 0});
      this.animationValue.setValue(index);
    }
  };

  handleRelease = () => {
    this.animationValue.setValue(SCREEN_HEIGHT);
  }

  render() {
    return (
      <View style={styles.root}>
        <LargeList
          bounces
          ref={r => this.largeList = r}
          style={{ flex: 1 }}
          safeMargin={600}
          showsVerticalScrollIndicator={false}
          numberOfRowsInSection={() => 10}
          numberOfSections={() => SAMPLE_COUNT}
          heightForCell={(section, row) => 44}
          heightForSection={section => 50}
          renderSection={this.renderSection}
          renderCell={this.renderItem}
        />
        <View
          style={styles.indicator}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={this.handleIndicatorMove}
          onResponderMove={this.handleIndicatorMove}
          onResponderRelease={this.handleRelease}
        >
          {this.renderIndicatorView()}
        </View>
      </View>
    )
  }
}