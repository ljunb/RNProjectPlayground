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
const BorderColor = '#ccc';

const styles = StyleSheet.create({
  root: {
    borderWidth: 1,
    borderColor: BorderColor,
  },
  password: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pwdItem: {
    height: InputItemWH,
    width: InputItemWH,
    borderRightColor: BorderColor,
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
    autoSubmit: PropTypes.bool,
    containerHeight: PropTypes.number,
    itemWidth: PropTypes.number,
    dotRadius: PropTypes.number,
    borderColor: PropTypes.string,
    onChangeText: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    maxLength: 6,
    autoSubmit: true,
    containerHeight: InputItemWH,
    itemWidth: InputItemWH,
    dotRadius: SecurityDotWH / 2,
    borderColor: BorderColor,
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

  get passwordItemStyle() {
    const { containerHeight: height, itemWidth: width, borderColor } = this.props;
    return [styles.pwdItem, { height, width, borderRightColor: borderColor }];
  }

  get securityDotStyle() {
    const { dotRadius: borderRadius } = this.props;
    return [styles.dot, { height: borderRadius * 2, width: borderRadius * 2, borderRadius }];
  }

  get animatingBoxStyle() {
    const { containerHeight: height, itemWidth: width } = this.props;
    return [styles.animatingBox, { height, width }];
  }

  renderPasswordItem = (item, index) => {
    const isLastItem = parseInt(index) === this.state.passwordArray.length - 1;
    const passwordItem = this.state.password[index];

    return (
      <TouchableOpacity
        style={[this.passwordItemStyle, isLastItem && {borderRightWidth: 0}]}
        key={`PwdItem_${index}`}
        activeOpacity={1}
        onPress={this.handlePressItem}
      >
        {passwordItem >= 0 && <View style={this.securityDotStyle} />}
      </TouchableOpacity>
    );
  };

  handlePressItem = () => this.textInput && this.textInput.focus();

  handleChange = password => {
    const { maxLength, onSubmit, autoSubmit, onChangeText } = this.props;
    const { password: oldPassword } = this.state;

    if (oldPassword.length === maxLength && password.length === maxLength - 1) {
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

      // `onSubmit` will never invoke while `autoSubmit` config to false, use `onChangeText`
      // to handle input logic instead
      if (password.length === maxLength && autoSubmit) {
        onSubmit && onSubmit(password);
        Keyboard.dismiss();
      }
    }
    onChangeText && onChangeText(password);
  };

  render() {
    const { password, hasSubmited } = this.state;
    const { maxLength, itemWidth, borderColor } = this.props;
    const left = this.positionValue.interpolate({
      inputRange: [0, maxLength],
      outputRange: [0, itemWidth * maxLength],
    });

    return (
      <View style={[styles.root, { borderColor }]}>
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
        {!hasSubmited && <Animated.View style={[this.animatingBoxStyle, { left }]}/>}
      </View>
    );
  }
}