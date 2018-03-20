import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import FetchDecorator from './FetchDecorator'
import TargetList from './TargetList'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

const CustomerLoading = () => {
  return (
    <Text>Customer Loading...</Text>
  )
}

const FinalList = FetchDecorator(TargetList, CustomerLoading)

export default class extends PureComponent {
  render() {
    return (
      <View style={styles.root}>
        <FinalList />
      </View>
    )
  }
}