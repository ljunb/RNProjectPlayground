/**
 * Description :
 *
 * Author : cookiej
 * Date   : 2017/12/21
 * Time   : 10:42
 */
import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';

export default class Loading extends PureComponent {
  static propTypes = {
    isShow: PropTypes.bool,
  };

  static defaultProps = {
    isShow: false,
  };

  render() {
    if (!this.props.isShow) return null;

    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator color="white"/>
          <Text style={styles.loadingTitle}>加载中……</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    backgroundColor: 'gray',
    height: 80,
    width: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    marginTop: 10,
    fontSize: 14,
    color: 'white',
  },
});