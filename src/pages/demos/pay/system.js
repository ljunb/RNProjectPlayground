import React, {Component} from 'react';
import { View } from 'react-native';
import PasswordInput from './PasswordInput';

export default class extends Component {

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <PasswordInput
          containerHeight={55}
          onSubmit={password => console.log(password)}
        />
      </View>
    );
  }
}