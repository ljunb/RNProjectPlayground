/**
 * Description :
 *
 * Author : cookiej
 * Date   : 2017/12/20
 * Time   : 16:56
 */
import React, { Component } from 'react';
import {View, Text} from 'react-native';
import CJNavigation from '../../bridges/CJNavigation';

export default class Home extends Component<{}> {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text onPress={() => CJNavigation.push('mine')}>To Mine</Text>
      </View>
    )
  }
}