/**
 * Project - RNProjectPlayground
 * Author      : ljunb
 * Date        : 2017/12/20 下午8:55
 * Description : 信息流
 */
import React, { Component } from 'react';
import {View, Text} from 'react-native';
import CJNavigation from '../../bridges/CJNavigation';

export default class Home extends Component<{}> {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Feed</Text>
      </View>
    )
  }
}