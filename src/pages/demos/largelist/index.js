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
} from 'react-native';
import { LargeList } from 'react-native-largelist';

const SCREEN_HEIGHT = Dimensions.get('window').height;
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
    width: 30,
    backgroundColor: '#eee',
  },
  item: {
    height: (SCREEN_HEIGHT - 160) / 26,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default class extends PureComponent {
  lastSelectedIndex = null;

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
    for (let i = 0; i < 26; i++) {
      components.push(
        <View key={`Indicator_${i}`} style={[styles.item]} pointerEvents="none">
          <Text>{i}</Text>
        </View>
      );
    }
    return components;
  };

  handleIndicatorMove = evt => {
    const ev = evt.nativeEvent.touches[0];
    const originX = 80;
    const itemHeight = (SCREEN_HEIGHT - 160) / 26;
    const index = Math.floor((ev.pageY - originX) / itemHeight);
    
    if (this.lastSelectedIndex !== index) {
      this.lastSelectedIndex = index;
      this.largeList && this.largeList.scrollToIndexPath({section: index, row: 0});
    }
  };

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
          numberOfSections={() => 26}
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
        >
          {this.renderIndicatorView()}
        </View>
      </View>
    )
  }
}