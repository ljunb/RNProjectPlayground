import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';

const InputItemWH = 50;
const SecurityDotWH = 10;
const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  password: {
    flexDirection: 'row',
    height: InputItemWH,
    alignItems: 'center',
  },
  pwdItem: {
    height: InputItemWH,
    width: InputItemWH,
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0,
  },
  dot: {
    backgroundColor: 'black',
    height: SecurityDotWH,
    width: SecurityDotWH,
    borderRadius: SecurityDotWH / 2,
  },
  animatingBox: {
    position: 'absolute',
    top: 0,
    height: InputItemWH,
    width: InputItemWH,
    borderWidth: 1,
    borderColor: 'blue',
    shadowOpacity: 0.75,
    shadowRadius: 2,
    shadowColor: 'blue',
    shadowOffset: { height: 0, width: 0 },
  }
});

export default class extends Component {
  static propTypes = {
    maxLength: PropTypes.number,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    maxLength: 6,
  };

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordArray: new Array(props.maxLength).fill(0),
      hasSubmited: false,
    };
    this.positionValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.textInput && this.textInput.focus();
  }

  renderPasswordItem = (item, index) => {
    const isLastItem = parseInt(index) === this.state.passwordArray.length - 1;
    const passwordItem = this.state.password[index];

    return (
      <TouchableOpacity
        style={[styles.pwdItem, isLastItem && {borderRightWidth: 0}]}
        key={`PwdItem_${index}`}
        activeOpacity={1}
        onPress={this.handlePressItem}
      >
        {passwordItem >= 0 && <View style={styles.dot}/>}
      </TouchableOpacity>
    );
  };

  handlePressItem = () => this.textInput && this.textInput.focus();

  handleChange = password => {
    const { maxLength, onSubmit } = this.props;

    if (this.state.password.length === maxLength && password.length === maxLength - 1) {
      this.positionValue.setValue(maxLength - 1);
      this.setState({
        password,
        hasSubmited: false,
      });
    } else {
      this.setState({
        password,
        hasSubmited: password.length === maxLength,
      }, () => {
        Animated.timing(this.positionValue, {
          toValue: password.length,
          duration: 100,
        }).start();
      });
    }
    if (password.length === maxLength) {
      onSubmit && onSubmit(password);
      Keyboard.dismiss();
    }
  };

  render() {
    const { password, hasSubmited } = this.state;
    const { maxLength } = this.props;
    const left = this.positionValue.interpolate({
      inputRange: [0, maxLength],
      outputRange: [0, InputItemWH * maxLength],
    });

    return (
      <View style={styles.root}>
        <TextInput
          ref={r => this.textInput = r}
          style={styles.textInput}
          keyboardType="number-pad"
          maxLength={maxLength}
          onChangeText={this.handleChange}
        />
        <View style={styles.password}>
          {this.state.passwordArray.map(this.renderPasswordItem)}
        </View>
        {!hasSubmited && <Animated.View style={[styles.animatingBox, {left}]}/>}
      </View>
    );
  }
}