/**
 * Description : 新手引导蒙层装饰器
 *
 * 一般情况下，App的个别界面会需要添加新手引导遮罩视图，因为显示与隐藏逻辑基本雷同，只是遮罩的样式有所区别。
 * 鉴于这种业务情况，考虑用装饰器模式来实现，也有解耦合效果。
 * 实现思路：
 * 以curry化方式，依次传入新手引导遮罩（GuideComponent）、目的页面组件（WrapperComponent），并显式
 * 指定一个 displayName 作为组件名称，同时用于生成本地缓存标识位。
 *
 * 使用方式：
 * 1）decorator
 * @injectGuide(SomeNewGuideComponent, displayName)
 * export default class TargetComponentName extends Component {}
 *
 * 2）function
 * class TargetComponentName extends Component {}
 * or
 * const TargetComponentName = () => {}
 *
 * export default injectGuide(SomeNewGuideComponent, displayName)(TargetComponentName)
 *
 * 总结：通过该方式，只要创建不同的新手引导组件，在需要的页面进入注入即可。
 * 注意点：
 * 当前装饰器指定了新手引导组件的 props 为 show 和 onDismiss ，所以所有的引导组件封装，需暴露这两个属性。
 * Author : cookiej
 * Date   : 2017/12/28
 * Time   : 11:22
 */
import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';

const injectGuide = (GuideComponent, displayName) => WrapperComponent => class extends Component {
  static displayName = `NewGuideDecorator_${displayName}`;

  state = {
    showGuide: false,
  };

  componentWillMount() {
    this.getCacheFlag();
  }

  componentDidMount() {
    console.log(`NewGuideDecorator_${displayName} did mount!`);
  }

  getCacheFlag = async () => {
    try {
      const result = await AsyncStorage.getItem(`NewGuideDecorator_${displayName}`);
      if (!result) {
        this.setState({showGuide: true});
        AsyncStorage.setItem(`NewGuideDecorator_${displayName}`, JSON.stringify({}));
      }
    } catch (e) {
      console.log(`[NewGuideDecorator_${displayName}] JSON parse error: ${e}`);
    }
  };

  handleDismiss = () => {
    this.setState({showGuide: false});
    AsyncStorage.setItem(`NewGuideDecorator_${displayName}`, JSON.stringify({}));
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <WrapperComponent {...this.props} />
        <GuideComponent show={this.state.showGuide} onDismiss={this.handleDismiss} />
      </View>
    );
  }
};

export { injectGuide };