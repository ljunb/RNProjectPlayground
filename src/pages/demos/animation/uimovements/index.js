import React, { Component, PureComponent } from 'react'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Easing,
  Image,
} from 'react-native'
import { peoples } from './mock'
import styles from './styles'

const { width: screenW, height: screenH } = Dimensions.get('window')
const TargetHeight = 300
const TargetScale = 3
const TargetLeft = (screenW - 40 * TargetScale) / 2
const TargetTop = 70

export default class extends PureComponent {
  state = {
    activeCellIndex: null, // 激活的cell下标
    isHeadAnimatedDone: false, // 头像动画是否完毕
    photoOrigin: {x: null, y: null}, // 当前激活的照片原始位置
    activePhotoIndex: null, 
  }
  cellAvatarRefs = [] // 所有头像的 ref 引用
  avatarOrigin = {x: null, y: null} // 当前激活的头像初始位置

  headWrapperValue = new Animated.Value(0) // 头部背景动画值
  avatarPositionValue = new Animated.ValueXY() // 头像位置动画值
  headTextScaleXValue = new Animated.Value(0) // 头像下文字动画值

  detailSpreadValue = new Animated.Value(0) // 个人详情展开动画值
  photoPositionValue = new Animated.ValueXY() // 照片位置动画值
  
  // ======================= Head paralle animations - Start =======================

  get headParallelStartAnimation() {
    return [
      Animated.timing(this.headWrapperValue, {
        toValue: 1,
      }),
      Animated.timing(this.avatarPositionValue.x, {
        toValue: TargetLeft,
        duration: 250,
      }),
      Animated.timing(this.avatarPositionValue.y, {
        toValue: TargetTop,
      })
    ]
  }

  get headTextParallelStartAnimation() {
    return [
      Animated.spring(this.headTextScaleXValue, {
        toValue: 1,
        duration: 200,
      }),
      Animated.timing(this.detailSpreadValue, {
        toValue: 1,
        delay: 150,
      })
    ]
  }

  /**
   * 点击cell，进行转场动画
   */
  handlePressCell = index => {
    this.cellAvatarRefs[index].measure((x, y, width, height, pageX, pageY) => {
      // 初始位置跟动画值
      this.avatarOrigin = {x: pageX, y: pageY}
      this.avatarPositionValue.setValue({x: pageX, y: pageY})

      // 记录激活的cell下标
      this.setState({activeCellIndex: index}, this.startHeadParalleAnimation)
    })
  }

  /**
   * 开始头部相关的动画
   */
  startHeadParalleAnimation = () => {
    Animated.parallel(this.headParallelStartAnimation).start(() => {
      this.setState({isHeadAnimatedDone: true}, this.startHeadTextParalleAnimation)
    })
  }

  /**
   * 头像动画完毕，开始文本的动画
   */
  startHeadTextParalleAnimation = () => Animated.parallel(this.headTextParallelStartAnimation).start()

  // ======================= Head paralle animations - End =======================
  get headParallelEndAnimation() {
    return [
      Animated.timing(this.headWrapperValue, {
        toValue: 0,
      }),
      Animated.timing(this.avatarPositionValue.x, {
        toValue: this.avatarOrigin.x,
      }),
      Animated.timing(this.avatarPositionValue.y, {
        toValue: this.avatarOrigin.y,
        duration: 250
      })
    ]
  }

  /**
   * 点击返回，执行复原动画
   */
  handleHideAnimation = () => {
    this.setState({
      isHeadAnimatedDone: false,
    }, () => {
      Animated.parallel(this.headParallelEndAnimation).start(() => {
        // 恢复默认值
        this.headTextScaleXValue.setValue(0)
        this.detailSpreadValue.setValue(0)

        this.avatarOrigin = {x: null, y: null}
        this.setState({ activeCellIndex: null })
      })
    })
  }

  // ======================= Photo animations =======================
  /**
   * 点击照片，开始照片查看动画
   */
  handleSelectGallery = ({ x, y }, index) => {
    this.setState({
      photoOrigin: { x, y },
      activePhotoIndex: index,
    }, () => {
      this.photoPositionValue.setValue({ x: 0, y: 0 })
      Animated.spring(this.photoPositionValue, { toValue: 1 }).start()
    })
  }

  /**
   * 点击空白区域，收回照片
   */
  handleHideGallery = () => {
    Animated.timing(this.photoPositionValue, {
      toValue: 0,
      duration: 200,
    }).start(() => {
      this.setState({
        photoOrigin: { x: null, y: null },
        activePhotoIndex: null
      })
    })
  }


  renderPeopleCell = (item, key) => {
    const isActive = this.state.activeCellIndex == key

    return (
      <TouchableOpacity
        key={`People_${key}`}
        activeOpacity={0.75}
        style={[styles.peopleCell]}
        onPress={() => this.handlePressCell(key)}
      >
        <Image
          ref={r => this.cellAvatarRefs[key] = r}
          style={[styles.avatar, isActive && {opacity: 0}]}
          source={item.avatar}
        />
        <Text>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  renderPhotoItem = (item, key) => {
    return (
      <PhotoItem
        key={`PhotoItem_${key}`}
        photo={item}
        index={key}
        isShowPhoto={this.state.activePhotoIndex === key}
        onSelect={this.handleSelectGallery}
      />
    )
  }

  render() {
    const { activeCellIndex, activePhotoIndex, isHeadAnimatedDone, photoOrigin } = this.state
    const activePeople = peoples[activeCellIndex]
  
    // header背景
    const headCoverAnimatedStyle = {
      height: this.headWrapperValue.interpolate({
        inputRange: [0, 1],
        outputRange: [64, TargetHeight],
      })
    }
    // 头像
    const avatarAnimatedStyle = {
      left: this.avatarPositionValue.x,
      top: this.avatarPositionValue.y,
      width: this.headWrapperValue.interpolate({
        inputRange: [0, 1],
        outputRange: [40, TargetScale * 40]
      }),
      height: this.headWrapperValue.interpolate({
        inputRange: [0, 1],
        outputRange: [40, TargetScale * 40]
      }),
      borderRadius: this.headWrapperValue.interpolate({
        inputRange: [0, 1],
        outputRange: [20, TargetScale * 20]
      }),
      opacity: activeCellIndex === null ? 0 : 1
    }
    // 原始背景透明度
    const originBgAnimatedStyle = {
      opacity: this.headWrapperValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      })
    }
    // 个人简介
    const spreadCoverAnimatedStyle = {
      width: this.detailSpreadValue.interpolate({
        inputRange: [0, 1],
        outputRange: [screenW, 0]
      })
    }
    // 照片
    const photoAnimatedStyle = {
      width: this.photoPositionValue.x.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 260]
      }),
      height: this.photoPositionValue.y.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 260]
      }),
      left: this.photoPositionValue.x.interpolate({
        inputRange: [0, 1],
        outputRange: [photoOrigin.x, (screenW - 260) / 2]
      }),
      top: this.photoPositionValue.y.interpolate({
        inputRange: [0, 1],
        outputRange: [photoOrigin.y, (screenH - 260) / 2]
      }),
      overflow: 'visible'
    }
    // 查看图片时的背景
    const photoCoverAnimatedStyle = [
      StyleSheet.absoluteFill,
      {
        backgroundColor: 'rgba(255,255,255,0.4)',
        opacity: this.photoPositionValue.x
      }
    ]

    return (
      <View style={styles.root}>
        <Animated.View style={[styles.head, activeCellIndex !== null && {opacity: 0}]} />
        <Animated.ScrollView style={originBgAnimatedStyle}>
          {peoples.map(this.renderPeopleCell)}
        </Animated.ScrollView>
        <View
          style={StyleSheet.absoluteFill}
          pointerEvents={activeCellIndex !== null ? "auto" : "none"}
        >
          <Animated.View style={[styles.head, headCoverAnimatedStyle]}>
            {activeCellIndex !== null && 
            <Animated.View style={[styles.backBtn, {opacity: this.headWrapperValue}]}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={[StyleSheet.absoluteFill, {justifyContent: 'center', alignItems:  'center'}]}
                onPress={this.handleHideAnimation}
              >
                <Text style={{color: '#fff', fontSize: 17, fontWeight: 'bold'}}>返回</Text>
              </TouchableOpacity>
            </Animated.View>
            }
            {isHeadAnimatedDone && 
              <Animated.View style={[styles.textWrapper, {opacity: 1}, {transform: [{scaleX: this.headTextScaleXValue}]}]}>
                <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 5, color: '#fff'}}>{activePeople.name}</Text>
                <Text style={{fontSize: 14, color: '#fff'}}>{activePeople.position}</Text>
              </Animated.View>
            }
          </Animated.View>
          {activeCellIndex !== null &&
            <Animated.Image
              style={[styles.activeAvatar, avatarAnimatedStyle]}
              source={activePeople.avatar}
            />
          }
          {isHeadAnimatedDone &&
            <View>
              <View style={{paddingHorizontal: 16, paddingVertical: 10}}>
                <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 8}}>关于我</Text>
                <View style={{marginBottom: 10}}>
                  <Text style={styles.text}>姓名：{activePeople.name}</Text>
                  <Text style={styles.text}>手机号码：{activePeople.mobile}</Text>
                </View>
                <View>
                  <Text style={styles.text}>职位：{activePeople.position}</Text>
                  <Text style={styles.text}>住址：{activePeople.address}</Text>
                </View>
                <Text style={{fontSize: 16, fontWeight: 'bold', marginTop: 16}}>关于生活</Text>
                <Animated.View style={[styles.spreadCover, spreadCoverAnimatedStyle]}/>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{height: 100, width: screenW}}
                contentContainerStyle={{paddingLeft: 16}}
              >
                {activePeople.photos.map(this.renderPhotoItem)}
              </ScrollView>
            </View>
          }
          {activePhotoIndex !== null &&
            <View
              style={StyleSheet.absoluteFill}
              pointerEvents={activePhotoIndex !== null ? "auto" : "none"}
            >
              <Animated.View style={photoCoverAnimatedStyle}/>
              <TouchableOpacity
                activeOpacity={1}
                style={StyleSheet.absoluteFill}
                onPress={this.handleHideGallery}
              >
                <Animated.Image
                  source={activePeople.photos[activePhotoIndex]}
                  style={[styles.animatedPhotoItem, photoAnimatedStyle]}
                />
              </TouchableOpacity>
            </View>
          }
        </View>
      </View>
    )
  }
}

class PhotoItem extends PureComponent {

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
    this.photoRef.measure((x, y, width, height, pageX, pageY) => {
      onSelect && onSelect({x: pageX, y: pageY, width, height}, index)
    })
  }

  render() {
    const { photo } = this.props

    return (
      <Animated.View
        style={[styles.photoItem, {transform: [{scale: this.scaleValue}]}, this.props.isShowPhoto && {opacity: 0}]}
      >
        <TouchableOpacity 
          style={StyleSheet.absoluteFill}
          activeOpacity={0.75}
          onPress={this.handlePress}
        >
          <Image source={photo} style={{height: 100, width: 100}} ref={r => this.photoRef = r} onLayout={()=>{}}/>
        </TouchableOpacity>
      </Animated.View>
    )
  }
}