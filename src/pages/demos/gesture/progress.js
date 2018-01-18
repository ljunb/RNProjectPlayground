import React, {Component} from 'react';
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
  },
  progressWrapper: {
    alignItems: 'flex-start',
  },
  progressBar: {
    backgroundColor: '#fff',
    position: 'absolute',
    height: 16,
    top: 2,
    left: 2,
    borderRadius: 8,
  },
  percent: {
    alignSelf: 'flex-end',
    color: '#fff',
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
      title: '正常',
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
    this.animatedValue.setOffset({x: this.listenerValue.x});
    this.animatedValue.setValue({x: 0});
  };

  handlePanResponderMove = (e, gestureState) => Animated.event([
    null,
    {dx: this.animatedValue.x},
  ])(e, gestureState);

  handlePanResponderEnd = () => this.animatedValue.flattenOffset();

  handleLayout = evt => {
    const {layout} = evt.nativeEvent;
    if (layout.width !== this.state.titleWidth) {
      this.setState({titleWidth: layout.width});
    }
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

    return (
      <View style={styles.root}>
        <View style={styles.progressWrapper}>
          <Animated.View style={{transform}} {...this.panResponder.panHandlers}>
            <ProgressFragment onLayout={this.handleLayout} title={this.state.title} />
          </Animated.View>
          <View style={styles.bar}>
            <Animated.View style={[styles.progressBar, {width}]} />
          </View>
        </View>
      </View>
    );
  }
}

const ProgressFragment = ({onLayout, title}) => {
  return (
    <View style={styles.fragment} onLayout={onLayout}>
      <View style={styles.content}>
        <Text>{title}</Text>
      </View>
      <View style={styles.angle} />
    </View>
  );
};