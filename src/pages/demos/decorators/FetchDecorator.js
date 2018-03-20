import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
} from 'react-native'
import DefaultLoading from './CommonLoading'
import DefaultNetError from './CommonNetError'

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default (WrapperComponent, LoadingComponent, NetErrorComponent) => class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      isLoadError: false,
      data: null,
    }
  }

  componentDidMount() {
    this.fetchData()
  }

  fetchData = () => {
    setTimeout(() => {
      this.setState({
        isLoading: false,
        isLoadError: true,
      })
    }, 1500)
  }

  testReload = () => {
    setTimeout(() => {
      this.setState({
        isLoading: false,
        data: [0, 1, 2, 3, 4],
      })
    }, 1000)
  }

  handleReload = () => this.setState({isLoading: true, isLoadError: false}, this.testReload)

  render() {
    const { style, ...rest } = this.props
    const { isLoadError, isLoading, data } = this.state
    const isShowContent = !isLoading && !isLoadError
    const ShowedLoading = LoadingComponent || DefaultLoading
    const ShowedNetError = NetErrorComponent || DefaultNetError

    return (
      <View style={[styles.root, style]}>
        {isLoading && <ShowedLoading />}
        {isLoadError && <ShowedNetError onReload={this.handleReload} />}
        {isShowContent &&
          <WrapperComponent
            {...rest}
            data={data}
          />
        }
      </View>
    )
  }
}