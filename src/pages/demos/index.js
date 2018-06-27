/**
 * Description : demo入口
 *
 * Author : cookiej
 * Date   : 2018/1/19
 * Time   : 16:15
 */
import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import CJNavigation from '../../bridges/CJNavigation';

export default class Demo extends PureComponent {
  demos = [
    {title: 'Decorator实现新手引导页注入', path: 'guidance'},
    {title: '类朋友圈查看图片', path: 'gallery'},
    {title: '手势相关', path: 'gesture'},
    {title: '浮动文本效果的输入框', path: 'animation/floating'},
    {title: '仿Path菜单动画', path: 'animation/path'},
    {title: '仿支付宝密码输入框', path: 'pay'},
    {title: 'Decorator实现通用loading、error配置', path: 'decorators'},
    {title: 'UIMovement转场动画', path: 'animation/uimovements'},
    {title: '带索引分组列表', path: 'sectionlist/largelist'},
    {title: '粘性TabBar', path: 'stickytabbar'}
  ];

  renderDemoItem = (demo, index) => {
    return (
      <Text
        key={`${demo.path}${index}`}
        style={{height: 40}}
        onPress={() => CJNavigation.push(`demos/${demo.path}`)}
      >
        {`${index + 1}、${demo.title}`}
      </Text>
    );
  };

  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View>
          <Text style={{height: 40, fontWeight: 'bold'}}>进入下一页后，直接可手势返回</Text>
          {this.demos.map(this.renderDemoItem)}
        </View>
      </View>
    );
  }
}