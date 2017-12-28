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
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  title_bar_bg: {
    flex: 1,
    backgroundColor: '#000000B3',
  },
});

export default class NewerGuideDialog extends Component {
  static propTypes = {
    show: PropTypes.bool,
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
    if (!this.props.show) return null;

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.root}
        onPress={this.handleDismiss}
      >
        <View style={styles.title_bar_bg} />
      </TouchableOpacity>
    );
  }
}