import React, {Component, PureComponent} from 'react';
import {
  View,
  Text,
  PanResponder,
  Animated,
} from 'react-native';

const styles = {
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fragment: {
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: '#ccc',
  },
  angle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderWidth: 4,
    borderTopColor: '#ccc',
    borderLeftColor: '#fff',
    borderBottomColor: '#fff',
    borderRightColor: '#fff',
  },
  bar: {
    height: 20,
    borderRadius: 10,
    width: 200,
    backgroundColor: '#ccc',
    justifyContent: 'center',
  },
  progressWrapper: {
    alignItems: 'flex-start',
  },
  progressBar: {
    position: 'absolute',
    height: 16,
    top: 2,
    left: 2,
    borderRadius: 8,
  },
  percent: {
    alignSelf: 'flex-end',
    color: 'red',
    backgroundColor: 'transparent',
    marginRight: 5,
  },
};

export default class Progress extends Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.ValueXY();
    this.listenerValue = {x: 0};
    this.animatedValue.addListener(value => this.listenerValue = value);
    this.panResponder = {};
    this.state = {
      titleWidth: 0,
    };
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
    });
  }

  handlePanResponderGrant = () => {
    this.animatedValue.setOffset({x: this.getCurrentValue()});
    this.animatedValue.setValue({x: 0});
  };

  handlePanResponderMove = (e, gestureState) => {
    this.forceUpdate();
    return Animated.event([
      null,
      {dx: this.animatedValue.x},
    ])(e, gestureState);
  };

  handlePanResponderEnd = () => this.animatedValue.flattenOffset();

  handleLayout = evt => {
    const {layout} = evt.nativeEvent;
    if (layout.width !== this.state.titleWidth) {
      this.setState({titleWidth: layout.width});
    }
  };

  getCurrentValue = () => {
    return this.listenerValue.x > 0 ? Math.min(200, this.listenerValue.x) : 0;
  };

  render() {
    const {titleWidth} = this.state;
    const transform = [{
      translateX: this.animatedValue.x.interpolate({
        inputRange: [-10, 0, 200, 210],
        outputRange: [-titleWidth / 2, -titleWidth / 2, 200 - titleWidth / 2, 200 - titleWidth / 2],
      }),
    }];
    const width = this.animatedValue.x.interpolate({
      inputRange: [-10, 0, 200, 210],
      outputRange: [0, 0, 196, 196],
    });
    const backgroundColor = this.animatedValue.x.interpolate({
      inputRange: [0, 200],
      outputRange: ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'],
    });
    const color = this.animatedValue.x.interpolate({
      inputRange: [0, 200],
      outputRange: ['rgba(153,153,153,0)', 'rgba(153,153,153,1)'],
    });

    return (
      <View style={styles.progressWrapper}>
        <Animated.View style={{transform}} {...this.panResponder.panHandlers}>
          <ProgressFragment onLayout={this.handleLayout} />
        </Animated.View>
        <View style={styles.bar}>
          <Animated.View style={[styles.progressBar, {width, backgroundColor}]} />
          <Animated.Text style={[styles.percent, {color}]}>{`${parseInt(this.getCurrentValue() / 200 * 100)}%`}</Animated.Text>
        </View>
      </View>
    );
  }
}

const ProgressFragment = ({onLayout}) => {
  return (
    <View style={styles.fragment} onLayout={onLayout}>
      <View style={styles.content}>
        <Text>拖我</Text>
      </View>
      <View style={styles.angle} />
    </View>
  );
};