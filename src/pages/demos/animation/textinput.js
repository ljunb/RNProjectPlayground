/**
 * Description : 动画效果输入框
 *
 * Author : cookiej
 * Date   : 2018/1/22
 * Time   : 11:23
 */
import React, {PureComponent, Component} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  root: {
    height: 50,
    width: 200,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'flex-end',
  },
  textInput: {
    height: 30,
    width: 200,
    padding: 0,
    fontSize: 16,
  },
  animatedText: {
    position: 'absolute',
    // height: 30,
    bottom: 0,
    left: 0,
  },
  animatedWrapper: {
    position: 'absolute',
    height: 30,
    left: 0,
    right: 0,
  },
  btn: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
  },
  animatedBorder: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    height: 1,
    backgroundColor: 'rgb(0, 0, 255)',
  },
});

export default class FloatingTextInput extends Component {

  static propTypes = {
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
  };

  static defaultProps = {
    placeholderTextColor: 'transparent',
  };

  animatedValue = new Animated.Value(0);
  borderValue = new Animated.Value(0);
  operateValue = 0;
  content = '';
  state = {
    isFocus: false,
  };

  focus = () => this.handleFocusInput();

  blur = () => this.handleBlurInput();

  get parallelAnimatedValues() {
    return [
      Animated.timing(this.animatedValue, {
        toValue: this.operateValue,
        duration: 200,
      }),
      Animated.timing(this.borderValue, {
        toValue: this.operateValue,
        duration: 200,
      }),
    ];
  }

  get buildAnimatedValues() {
    const bottom = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 30],
    });
    const height = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 20],
    });
    const fontSize = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    });
    const color = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(153, 153, 153)', 'rgb(0, 0, 255)'],
    });
    const right = this.borderValue.interpolate({
      inputRange: [0, 1],
      outputRange: [200, 0],
    });
    return { bottom, height, fontSize, color, right };
  }

  handleFocusInput = () => {
    if (this.content) {
      this.borderValue.setValue(1);
      this.focusTextInput();
    } else {
      this.operateValue = 1;
      Animated.parallel(this.parallelAnimatedValues).start(this.focusTextInput);
    }
  };

  handleBlurInput = () => {
    if (this.content) {
      this.borderValue.setValue(0);
      this.blurTextInput();
    } else {
      this.operateValue = 0;
      Animated.parallel(this.parallelAnimatedValues).start(this.blurTextInput);
    }
  };

  focusTextInput = () => {
    this.setState({isFocus: true}, () => this.textInput && this.textInput.focus());
  };

  blurTextInput = () => {
    this.setState({isFocus: false}, () => this.textInput && this.textInput.blur());
  };

  render() {
    const { bottom, height, fontSize, color, right } = this.buildAnimatedValues;
    const { placeholder, placeholderTextColor, style } = this.props;

    return (
      <View style={[styles.root, style]}>
        <TextInput
          {...this.props}
          ref={r => this.textInput = r}
          style={styles.textInput}
          placeholderTextColor={placeholderTextColor}
          onBlur={this.handleBlurInput}
          onFocus={this.handleFocusInput}
          onChangeText={content => this.content = content}
          underlineColorAndroid="transparent"
        />
        <Animated.View style={[styles.animatedWrapper, {bottom, height}]}>
          <TouchableOpacity
            activeOpacity={1}
            style={styles.btn}
            onPress={this.handleFocusInput}
          >
            <Animated.Text style={[{fontSize, color}, !this.state.isFocus && {color: 'rgb(153, 153, 153)'}]}>
              {placeholder}
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.animatedBorder, {right}]} />
      </View>
    );
  }
}