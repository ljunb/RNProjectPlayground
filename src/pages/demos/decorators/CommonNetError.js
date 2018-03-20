import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import PropTypes from 'prop-types'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reloadBtn: {
    paddingHorizontal: 12,
    height: 40,
    justifyContent: 'center',
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    marginVertical: 10,
  },
})

export default class extends PureComponent {

  static propTypes = {
    onReload: PropTypes.func,
  }

  handleReload = () => this.props.onReload && this.props.onReload()

  render() {
    return (
      <View style={styles.root}>
        <Text>网络不给力~</Text>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.reloadBtn}
          onPress={this.handleReload}
        >
          <Text>重新加载</Text>
        </TouchableOpacity>
      </View>
    )
  }
}