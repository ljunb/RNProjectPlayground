import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'
import Carousel from './Carousel'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default class extends PureComponent {

  handleChange = index => console.log(index)
  
  render() {
    return (
      <View style={styles.root} >
        <Carousel
          contentWidth={180}
          contentMargin={20}
          onChange={this.handleChange}
        />
      </View>
    )
  }  
}