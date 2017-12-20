/**
 * Description :
 *
 * Author : cookiej
 * Date   : 2017/12/20
 * Time   : 17:29
 */
import React, { Component } from 'react';
import {View, Text} from 'react-native';
import CJNavigation from '../../bridges/CJNavigation';

export default class Mine extends Component<{}> {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text onPress={() => CJNavigation.pop()}>Back</Text>
      </View>
    )
  }
}