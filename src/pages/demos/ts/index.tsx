import * as React from 'react';
import { Component } from 'react';
import { View, Text, ViewStyle } from 'react-native';

export default class TSDemo extends Component<any, any> {
  render() {
    console.log(JSON.stringify(this.props))
    return (
      <View style={styles.root}>
        <Text>这是typescript的测试</Text>
      </View>
    )
  }
}

const styles = {
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
}