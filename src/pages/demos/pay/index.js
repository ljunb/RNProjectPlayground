import React, {Component} from 'react';
import { View, Text } from 'react-native';
import PasswordInput from './PasswordInput';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';

@observer
export default class extends Component {

  @observable password = '';

  @computed
  get statusLabel() {
    if (this.password.length === 6) {
      return `输入${this.password === '123456' ? '正确' : '错误'}！`;
    }
    return '请输入完整密码！';
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <PasswordInput
          containerHeight={55}
          onChangeText={password => this.password = password}
        />
        <Text style={{marginTop: 20}}>{this.statusLabel}</Text>
      </View>
    );
  }
}