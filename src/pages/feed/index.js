/**
 * Project - RNProjectPlayground
 * Author      : ljunb
 * Date        : 2017/12/20 下午8:55
 * Description : 信息流
 */
import React from 'react';
import {View, Text} from 'react-native';
import CJNavigation from '../../bridges/CJNavigation';

export default () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text onPress={() => CJNavigation.push('demo/decorator')}>Feed</Text>
    </View>
  );
};