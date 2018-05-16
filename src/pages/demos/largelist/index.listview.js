/*
 * @Description: 基于ListView来实现带索引分组列表
 * @Author: cookiej 
 * @Date: 2018-05-16 09:29:04 
 * @Last Modified by: cookiej
 * @Last Modified time: 2018-05-16 10:12:57
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
  ListView,
} from 'react-native';
import { LargeList } from 'react-native-largelist';

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 0 : StatusBar.currentHeight;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const INDICATOR_HEIGHT = SCREEN_HEIGHT - 80 * 2 - STATUSBAR_HEIGHT;
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
    top: 80 - STATUSBAR_HEIGHT,
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
  dataSource = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    getRowData: (rowData, section, row) => rowData[section][row],
    getSectionHeaderData: (rowData, section) => rowData[section]
  });
  state = {
    dataSource: this.dataSource
  }

  componentDidMount() {
    this.setupMock();
  }

  setupMock = () => {
    let rowData = [];
    for (let i = 0; i < SAMPLE_COUNT; i++) {
      let section = [];
      for (let j = 0; j < 10; j++) {
        section.push(`Row_${j}`);
      }
      rowData.push(section);
    }
    this.setState({dataSource: this.state.dataSource.cloneWithRowsAndSections(rowData)})
  };

  renderItem = (rowData, section, row) => {
    return (
      <View style={styles.row}>
        <Text>{rowData}</Text>
      </View>
    )
  };

  renderSection = (rowData, section) => {
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
    let index = Math.floor((ev.pageY - originX) / itemHeight);
    
    if (this.lastSelectedIndex !== index) {
      this.lastSelectedIndex = index;

      if (index < 0) {
        index = 0;
      } else if (index > SAMPLE_COUNT - 1) {
        index = SAMPLE_COUNT - 1;
      }
      let offset = 50 * index + 44 * index * 10;
      if (index === SAMPLE_COUNT - 1) {
        offset -= (SCREEN_HEIGHT - 64) - (50 + 10 *44);
      }

      this.largeList && this.largeList.scrollTo({y: offset});
      this.animationValue.setValue(index);
    }
  };

  handleRelease = () => {
    this.animationValue.setValue(SCREEN_HEIGHT);
  }

  render() {
    return (
      <View style={styles.root}>
        <ListView
          ref={r => this.largeList = r}
          style={{flex: 1}}
          dataSource={this.state.dataSource}
          renderRow={this.renderItem}
          renderSectionHeader={this.renderSection}
          stickySectionHeadersEnabled
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