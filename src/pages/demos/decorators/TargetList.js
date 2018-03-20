import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default class extends PureComponent {

  renderItem = (item, index) => {
    return <Text key={`Demo_${index}`}>{`Demo_${item}`}</Text>
  }

  render() {
    const {data = []} = this.props
    return (
      <View style={styles.root}>
        {data.map(this.renderItem)}
      </View>
    )
  }
}