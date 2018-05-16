/*
 * @Description: 基于react-native-largelist来实现带索引分组列表
 * @Author: cookiej 
 * @Date: 2018-05-15 09:31:25 
 * @Last Modified by: cookiej
 * @Last Modified time: 2018-05-16 11:22:03
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
import NavigationBar from '../../../components/NavigationBar';
import CJNavigation from '../../../bridges/CJNavigation';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SAMPLE_COUNT = 26;
const LETTER_HEIGHT = 20;

const styles = StyleSheet.create({
  root: {
    flex: 1,
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
    height: LETTER_HEIGHT,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  recommendItem: {
    height: 30,
    width: 70,
    marginTop: 12,
    marginRight: 12,
    borderColor: '#ebebeb',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default class extends PureComponent {
  
  lastSelectedIndex = null;
  animationValue = new Animated.Value(-SCREEN_HEIGHT);
  state = {
    dataSource: [],
    originY: 0,
    indicatorHeight: 0,
  };

  componentDidMount() {
    this.setupMock();
  }

  setupMock = () => {
    const dataSource = [];
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      const rowCount = i === 0 ? 1 : (i % 2 === 0 ? 6 : 10);
      const row = [];
      for (let j = 0; j < rowCount; j++) {
        row.push(j);
      }
      dataSource.push(row);
    }

    const indicatorHeight = SAMPLE_COUNT * LETTER_HEIGHT;
    const originY = (SCREEN_HEIGHT - STATUSBAR_HEIGHT - indicatorHeight) / 2;
    this.setState({originY, dataSource, indicatorHeight});
  };

  renderItem = (section, row) => {
    if (section === 0) {
      return (
        <View style={styles.recommend}>
          {[0, 1, 2, 3, 4, 5, 6].map(item => {
            return (
              <View key={`Recommend_${item}`} style={styles.recommendItem}>
                <Text>{`优品_${row}`}</Text>
              </View>
            );
          })}
        </View>
      )
    }
    return (
      <View style={styles.row}>
        <Text>{`Row_${row}`}</Text>
      </View>
    )
  };

  renderSection = section => {
    return (
      <View style={styles.section}>
        <Text>{section === 0 ? '推荐' : `Section_${section}`}</Text>
      </View>
    );
  };

  heightForCell = (section, row) => {
    if (section !== 0) return 44;
    return 30 * 2 + 36;
  }

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
      });

      components.push(
        <Animated.View key={`Indicator_${i}`} style={[styles.item, {transform: [{scale}, {translateX}], opacity}]} pointerEvents="none">
          <Text style={{backgroundColor: 'transparent', fontSize: 12}}>{i === 0 ? '推荐' : i}</Text>
        </Animated.View>
      );
    }
    return components;
  };

  handleIndicatorMove = evt => {
    const { indicatorHeight, originY } = this.state;
    const ev = evt.nativeEvent.touches[0];
    let index = Math.floor((ev.pageY - originY) / LETTER_HEIGHT);
    
    if (this.lastSelectedIndex !== index) {
      if (index < 0) {
        index = 0;
      } else if (index > this.state.dataSource.length - 1) {
        index = this.state.dataSource.length - 1;
      }

      this.lastSelectedIndex = index;
      this.largeList && this.largeList.scrollToIndexPath({section: index, row: 0});
      this.animationValue.setValue(index);
    }
  };

  handleRelease = () => {
    this.animationValue.setValue(SCREEN_HEIGHT);
  }

  render() {
    const { originY } = this.state;

    return (
      <View style={styles.root}>
        <NavigationBar
          title="LargeList"
          onBack={() => CJNavigation.pop()}
        />
        {this.state.dataSource.length > 0 &&
        <LargeList
          bounces
          ref={r => this.largeList = r}
          style={{ flex: 1 }}
          safeMargin={600}
          showsVerticalScrollIndicator={false}
          numberOfRowsInSection={section => this.state.dataSource[section].length}
          numberOfSections={() => SAMPLE_COUNT}
          heightForCell={this.heightForCell}
          heightForSection={section => 50}
          renderSection={this.renderSection}
          renderCell={this.renderItem}
        />
        }
        <View
          style={[styles.indicator, {top: originY, bottom: originY}]}
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