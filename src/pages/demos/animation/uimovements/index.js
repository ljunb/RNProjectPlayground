import React, { Component, PureComponent } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing
} from 'react-native'

const {width: screenW, height: screenH} = Dimensions.get('window')
const TargetHeight = 300
const TargetScale = 3
const TargetLeft = (screenW - 40 * TargetScale) / 2
const TargetTop = 70

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  head: {
    height: 64,
    width: screenW,
    backgroundColor: '#ccc',
    alignItems: 'center',
  },
  peopleCell: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'red',
    marginLeft: 16,
    marginRight: 12,
  },
  activeAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'red',
    position: 'absolute',
  },
  textWrapper: {
    position: 'absolute',
    top: TargetTop + 40 * TargetScale + 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  coverView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#ccc',
  },
  spreadCover: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  galleryItem: {
    backgroundColor: 'red',
    height: 100,
    width: 100,
    borderRadius: 4,
    marginRight: 16,
  },
  animatedGalleryItem: {
    backgroundColor: '#fff',
    height: 100,
    width: 100,
    borderRadius: 4,
    position: 'absolute',
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowColor: '#ccc',
    shadowOffset: { height: 0, width: 0 },
  },
  backBtn: {
    backgroundColor: 'red',
    height: 44,
    width: 50,
    position: 'absolute',
    top: 20,
    left: 0,
  }
})

const peoples = [
  {name: 'Tomy1', position: 'developer', avatar: '', gallery: [0, 1, 2]},
  {name: 'Tomy2', position: 'manager', avatar: '', gallery: [0, 1, 2, 3]},
  {name: 'Tomy3', position: 'cleaner', avatar: '', gallery: [0, 1, 2, 3]},
  {name: 'Tomy4', position: 'tester', avatar: '', gallery: [0, 1, 2]},
  {name: 'Tomy5', position: 'developer', avatar: '', gallery: [0, 1, 2, 3]},
]

export default class extends Component {

  state = {
    activeCellIndex: null,
    showText: false,
    galleryOrigin: {x: null, y: null},
    activeGallery: null,
  }
  headValue = new Animated.Value(0)
  headPosition = new Animated.ValueXY()
  textValue = new Animated.Value(0)
  spreadValue = new Animated.Value(0)
  galleryValue = new Animated.ValueXY()
  origin = {x: null, y: null}
  peopleRefs = []

  handlePressCell = index => {
    this.peopleRefs[index].measure((x, y, width, height, pageX, pageY) => {
      this.origin = {x: pageX, y: pageY}
      this.headPosition.setValue({x: pageX, y: pageY})

      this.setState({activeCellIndex: parseInt(index)}, () => {
        Animated.parallel([
          Animated.timing(this.headValue, {
            toValue: 1,
          }),
          Animated.timing(this.headPosition.x, {
            toValue: TargetLeft,
            duration: 250,
          }),
          Animated.timing(this.headPosition.y, {
            toValue: TargetTop,
          })
        ]).start(() => {
          this.setState({showText: true}, () => {
            Animated.parallel([
              Animated.spring(this.textValue, {
                toValue: 1,
                duration: 200,
              }),
              Animated.timing(this.spreadValue, {
                toValue: 1,
                delay: 150,
              })
            ]).start()
          })
        })
      })
    })
  }

  handleHideAnimation = () => {
    this.setState({
      showText: false,
    }, () => {
      Animated.parallel([
        Animated.timing(this.headValue, {
          toValue: 0,
        }),
        Animated.timing(this.headPosition.x, {
          toValue: this.origin.x,
        }),
        Animated.timing(this.headPosition.y, {
          toValue: this.origin.y,
          duration: 250,
        })
      ]).start(() => {
        this.textValue.setValue(0)
        this.spreadValue.setValue(0)
        this.origin = {x: null, y: null}
        this.setState({
          activeCellIndex: null,
        })
      })
    })
  }

  handleSelectGallery = (origin, index) => {
    // this.galleryOrigin = {x: origin.pageX, y: origin.pageY}
    this.setState({
      galleryOrigin: {x: origin.pageX, y: origin.pageY},
      activeGallery: index,
    }, () => {
      this.galleryValue.setValue({x: 0, y: 0})

      Animated.spring(this.galleryValue, {
        toValue: 1
      }).start()
    })
  }

  handleHideGallery = () => {
    Animated.timing(this.galleryValue, {
      toValue: 0,
      duration: 200,
    }).start(() => {
      this.setState({
        galleryOrigin: {x: null, y: null},
        activeGallery: null
      })
    })
  }

  renderItem = (item, key) => {
    const isActive = this.state.activeCellIndex == key

    return (
      <TouchableOpacity
        key={`People_${key}`}
        activeOpacity={0.75}
        style={[styles.peopleCell]}
        onPress={() => this.handlePressCell(key)}
      >
        <View
          ref={r => this.peopleRefs[key] = r}
          style={[styles.avatar, isActive && {opacity: 0}]}
        />
        <Text>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  renderGalleryItem = (item, key) => {
    return (
      <GalleryItem
        key={`GalleryItem_${key}`}
        index={key}
        isShowGallery={this.state.activeGallery === key}
        onSelect={this.handleSelectGallery}
      />
    )
  }

  render() {
    const animatedHeadStyle = this.headValue.interpolate({
      inputRange: [0, 1],
      outputRange: [64, TargetHeight],
    })
    const left = this.headPosition.x
    const top = this.headPosition.y
    const opacity = this.state.activeCellIndex === null ? 0 : 1
    const width = this.headValue.interpolate({
      inputRange: [0, 1],
      outputRange: [40, TargetScale * 40]
    })
    const borderRadius = this.headValue.interpolate({
      inputRange: [0, 1],
      outputRange: [20, TargetScale * 20]
    })

    const animatedHeadPositionStyle = {
      left,
      top,
      opacity,
      width,
      borderRadius,
      height: width,
    }

    const leftCover = this.textValue.interpolate({
      inputRange: [0, 1],
      outputRange: [screenW / 2, 0]
    })
    const rightCover = this.textValue.interpolate({
      inputRange: [0, 1],
      outputRange: [screenW / 2, screenW]
    })
    const textWidth = this.textValue.interpolate({
      inputRange: [0, 1],
      outputRange: [screenW / 2, 0]
    })
    const bgOpacity = this.headValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    })
    const spreadStyle = {
      width: this.spreadValue.interpolate({
        inputRange: [0, 1],
        outputRange: [screenW, 0]
      })
    }

    const galleryItemStyle = {
      width: this.galleryValue.x.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 260]
      }),
      height: this.galleryValue.y.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 260]
      }),
      left: this.galleryValue.x.interpolate({
        inputRange: [0, 1],
        outputRange: [this.state.galleryOrigin.x, (screenW - 260) / 2]
      }),
      top: this.galleryValue.y.interpolate({
        inputRange: [0, 1],
        outputRange: [this.state.galleryOrigin.y, (screenH - 260) / 2]
      })
    }

    return (
      <View style={styles.root}>
        <Animated.View style={[styles.head, this.state.activeCellIndex !== null && {opacity: 0}]} />
        <Animated.ScrollView style={{opacity: bgOpacity}}>
          {peoples.map(this.renderItem)}
        </Animated.ScrollView>
        <View
          style={StyleSheet.absoluteFill}
          pointerEvents={this.state.activeCellIndex !== null ? "auto" : "none"}
        >
          <Animated.View style={[styles.head, {height: animatedHeadStyle}]}>
            {this.state.activeCellIndex !== null && 
            <Animated.View style={[styles.backBtn, {opacity: this.headValue}]}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={StyleSheet.absoluteFill}
                onPress={this.handleHideAnimation}
              >
                
              </TouchableOpacity>
            </Animated.View>
            }
            <Animated.View style={[styles.activeAvatar, animatedHeadPositionStyle]} />
            {this.state.showText && 
              <Animated.View style={[styles.textWrapper, {opacity: 1}, {transform: [{scaleX: this.textValue}]}]}>
                <Text>{peoples[this.state.activeCellIndex].name}</Text>
                <Text>{peoples[this.state.activeCellIndex].position}</Text>
              </Animated.View>
            }
          </Animated.View>
          {this.state.showText &&
            <View>
              <View style={{paddingHorizontal: 16, paddingVertical: 10}}>
                <View style={{marginBottom: 10}}>
                  <Text>姓名：{peoples[this.state.activeCellIndex].name}</Text>
                  <Text>职位：{peoples[this.state.activeCellIndex].position}</Text>
                </View>
                <View>
                  <Text>姓名：{peoples[this.state.activeCellIndex].name}</Text>
                  <Text>职位：{peoples[this.state.activeCellIndex].position}</Text>
                </View>
                <Animated.View style={[styles.spreadCover, spreadStyle]}/>
              </View>
              <ScrollView
                horizontal
                style={{height: 100, width: screenW}}
                contentContainerStyle={{paddingLeft: 16}}
              >
                {peoples[this.state.activeCellIndex].gallery.map(this.renderGalleryItem)}
              </ScrollView>
            </View>
          }
          {this.state.galleryOrigin.x !== null &&
            <View
              style={StyleSheet.absoluteFill}
              pointerEvents={this.state.galleryOrigin.x !== null ? "auto" : "none"}
            >
              <TouchableOpacity
                activeOpacity={1}
                style={StyleSheet.absoluteFill}
                onPress={this.handleHideGallery}
              >
                <Animated.View style={[styles.animatedGalleryItem, galleryItemStyle]}/>
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    )
  }
}

class GalleryItem extends PureComponent {

  scaleValue = new Animated.Value(0)

  componentDidMount() {
    this.startAnimation()
  }

  startAnimation = () => {
    Animated.spring(this.scaleValue, {
      toValue: 1,
      duration: 200
    }).start()
  }

  handlePress = () => {
    const { onSelect, index } = this.props
    this.galleryItem.measure((x, y, width, height, pageX, pageY) => {
      onSelect && onSelect({pageX, pageY, width, height}, index)
    })
  }

  render() {
    return (
      <Animated.View
        style={[styles.galleryItem, {transform: [{scale: this.scaleValue}]}, this.props.isShowGallery && {opacity: 0}]}
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFill}
          activeOpacity={0.75}
          onPress={this.handlePress}
        >
          <View style={StyleSheet.absoluteFill} ref={r => this.galleryItem = r}/>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}