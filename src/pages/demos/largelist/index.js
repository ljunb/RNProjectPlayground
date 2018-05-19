/*
 * @Description: 带索引分组列表测试
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
  TouchableOpacity,
} from 'react-native';
import CJNavigation from '../../../bridges/CJNavigation';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  btn: {
    marginBottom: 20,
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 4,
    borderColor: '#ccc',
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
  }
})

export default class SectionListDemo extends PureComponent {
  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>带索引分组列表测试</Text>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.btn}
          onPress={() => CJNavigation.push('sectionlist/largelist')}
        >
        <Text>基于LargeList实现</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.btn}
          onPress={() => CJNavigation.push('sectionlist/listview')}
        >
        <Text>基于ListView实现</Text>
        </TouchableOpacity>
      </View>
    )
  }
}