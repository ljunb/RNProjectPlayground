import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  ScrollView,
  SectionList,
  PanResponder,
  Animated,
} from 'react-native'
import PropTypes from 'prop-types'

const {width: screenW, height: screenH} = Dimensions.get('window')
const DefaultContentWidth = 200
const DefaultContentMargin = 15

const styles = StyleSheet.create({
  root: {
    height: 120,
  },
  item: {
    height: 120,
    width: DefaultContentWidth,
    backgroundColor: '#ccc',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default class extends PureComponent {

  static propTypes = {
    data: PropTypes.array.isRequired,
    contentWidth: PropTypes.number,
    contentMargin: PropTypes.number,
    initialRenderIndex: PropTypes.number,
    renderItem: PropTypes.func,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    contentWidth: DefaultContentWidth,
    contentMargin: DefaultContentMargin,
    initialRenderIndex: 0,
    data: [0, 1, 2, 3, 4, 5, 6]
  }

  constructor(props) {
    super(props)
    this.defaultOffsetX = -(screenW - props.contentWidth) / 2
    this.currentOffsetX = this.defaultOffsetX
    this.currenIndex = props.initialRenderIndex
    this.animationValue = new Animated.Value(0)
  }

  componentDidMount() {
    // not working in Android
    this.updateOffset()
  }

  updateOffset = () => {
    const { contentMargin, contentWidth } = this.props
    const offset = this.currenIndex * (contentMargin + contentWidth) + this.defaultOffsetX
    this.flatList && this.flatList.scrollToOffset({animated: true, offset})
  }

  renderItem = ({item, index}) => {
    const { contentWidth, renderItem } = this.props
    const scale = this.animationValue.interpolate({
      inputRange: [(index - 1) * contentWidth, index * contentWidth, (index + 1) * contentWidth],
      outputRange: [1, 1.2, 1],
      extrapolate: 'clamp'
    })
    return (
      <Animated.View style={[styles.item, {width: contentWidth, transform: [{scale}]}]} pointerEvents="none">
        <Text>{item}</Text>
      </Animated.View>
    )
  }

  handleMomentumScrollEnd = evt => {
    const { data, contentWidth, contentMargin, onChange } = this.props
    const { contentOffset } = evt.nativeEvent
    this.currentOffsetX = contentOffset.x

    const pageNo = Math.floor(contentOffset.x / (contentWidth + contentMargin))
    this.currenIndex = pageNo + 1
    if (this.currenIndex > data.length - 1) {
      this.currenIndex = data.length - 1
    }

    // Bug：滑动之后会触发多次？
    onChange && onChange(this.currenIndex)
    console.log(`CurrentIndex: ${this.currenIndex}`)
  }

  handleScrollEndDrag = evt => {
    const { data, contentMargin, contentWidth } = this.props
    const { contentOffset } = evt.nativeEvent
    // 决定滑动方向
    const offsetDiff = contentOffset.x - this.currentOffsetX
    this.currenIndex = offsetDiff > 0 ? this.currenIndex + 1 : this.currenIndex - 1
    // 边界控制
    if (this.currenIndex > data.length - 1) {
      this.currenIndex = data.length - 1
    }
    if (this.currenIndex < 0) {
      this.currenIndex = 0
    }

    this.updateOffset()
  }

  handleScroll = Animated.event([{ nativeEvent: { contentOffset: { x: this.animationValue } } }])

  render() {
    const { data, contentMargin, style } = this.props
    const containerStyle = [
      styles.root,
      style && style.height && {height: style.height}
    ]

    return (
      <View style={containerStyle}>
        <FlatList
          {...this.props}
          horizontal
          ref={r => this.flatList = r}
          data={data}
          renderItem={this.renderItem}
          keyExtractor={item => `Item_${item}`}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{width: contentMargin}}/>}
          scrollEventThrottle={16}
          onScrollEndDrag={this.handleScrollEndDrag}
          onMomentumScrollEnd={this.handleMomentumScrollEnd}
          onScroll={this.handleScroll}
        />
      </View>
    )
  }  
}