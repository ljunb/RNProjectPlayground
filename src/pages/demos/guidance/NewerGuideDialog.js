/**
 * Description : 测试新手引导的遮罩
 *
 * Author : cookiej
 * Date   : 2017/12/28
 * Time   : 11:33
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000B3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
});

export default class NewerGuideDialog extends Component {
  static propTypes = {
    onDismiss: PropTypes.func,
  };

  componentDidMount() {
    console.log(`NewerGuideDialog did mount ${this.props.show}`);
  }

  handleDismiss = () => {
    const { onDismiss } = this.props;
    onDismiss && onDismiss();
  };

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.text} onPress={this.handleDismiss}>Dismiss</Text>
      </View>
    );
  }
}