import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 8,
    fontSize: 14,
  }
})

export default () => {
  return (
    <View style={styles.root}>
      <ActivityIndicator />
      <Text style={styles.text}>正在加载...</Text>
    </View>
  )
}