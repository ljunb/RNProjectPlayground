/**
 * Description : 答案条目
 *
 * Author : cookiej
 * Date   : 2018/1/31
 * Time   : 10:57
 */
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import Common from '../../../../common/constants';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
    height: 40,
    width: Common.screenW - 16 * 2 - 16 * 2,
  },
  icon: {
    height: 20,
    width: 20,
  },
});

const AnswerStatus = {
  Idle: 'Idle',
  AllCorrect: 'AllCorrect',
  LeftCorrect: 'LeftCorrect',
  RightCorrect: 'RightCorrect',
};

export default class AnswerCell extends Component {

  static propTypes = {
    title: PropTypes.string,
    index: PropTypes.number,
    onPress: PropTypes.func,
  };

  state = {
    status: AnswerStatus.Idle,
  };
  animatedValue = new Animated.Value(1);

  performAnswerResultAnimation = status => {
    Animated.sequence([
      Animated.timing(this.animatedValue, {
        toValue: 1.05,
        duration: 200,
      }),
      Animated.spring(this.animatedValue, {
        toValue: 1,
        duration: 200,
      }),
    ]).start();
  };

  handlePress = () => {
    const {title, index, onPress} = this.props;
    onPress && onPress({title, index});
  };

  render() {
    const {AllCorrect, RightCorrect, LeftCorrect} = AnswerStatus;
    const {status} = this.state;
    let leftIcon = null;
    let rightIcon = null;
    if (status === LeftCorrect || status === AllCorrect) {
      leftIcon = 'green';
    } else if (status === RightCorrect) {
      leftIcon = 'red';
    }

    if (status === RightCorrect || status === AllCorrect) {
      rightIcon = 'green';
    } else if (status === LeftCorrect) {
      rightIcon = 'red';
    }
    const scale = this.animatedValue;

    return (
      <Animated.View style={{transform: [{scale}]}}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.handlePress}
          style={styles.root}
        >
          <Image style={[styles.icon, leftIcon && {backgroundColor: leftIcon}]}/>
          <Text>{this.props.title}</Text>
          <Image style={[styles.icon, rightIcon && {backgroundColor: rightIcon}]}/>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}