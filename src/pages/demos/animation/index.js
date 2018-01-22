/**
 * Description : 动画相关
 *
 * Author : cookiej
 * Date   : 2018/1/22
 * Time   : 11:21
 */
import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import FloatingTextInput from './textinput';

export default class AnimatedDemos extends Component {
  render() {
    return (
      <ScrollView
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center', flex: 1}}
        keyboardShouldPersistTaps="handled"
      >
        <FloatingTextInput
          style={{marginBottom: 10}}
          ref={r => this.nameInput = r}
          onSubmitEditing={() => this.pwdInput && this.pwdInput.focus()}
          placeholder="Your name"
        />
        <FloatingTextInput
          ref={r => this.pwdInput = r}
          placeholder="Your password"
        />
      </ScrollView>
    );
  }
}