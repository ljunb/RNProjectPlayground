/**
 * 仿头脑王者游戏效果，答题中
 */
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Common from '../../../../common/constants';
import AnswerCell from './AnswerCell';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  playerWrapper: {
    height: 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
  },
  player: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 35,
    backgroundColor: 'red',
    marginBottom: 15,
  },
  coinWrapper: {
    height: 30,
    width: 96,
    borderRadius: 48,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  pkWrapper: {
    alignItems: 'center',
  },
  answer: {
    height: 440,
    width: Common.screenW - 16 * 2,
    marginLeft: 16,
  },
  countdown: {
    position: 'absolute',
    height: 80,
    width: 80,
    borderRadius: 40,
    borderWidth: StyleSheet.hairlineWidth,
    top: 0,
    left: (Common.screenW - 16 * 2 - 80) / 2,
    backgroundColor: '#fff',
  },
  answerContent: {
    marginTop: 40,
    height: 400,
    width: Common.screenW - 16 * 2,
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  question: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
    marginBottom: 40,
  },
});

export default class Gaming extends Component {

  translateYValue = new Animated.Value(0);
  answerPosValue = new Animated.Value(0);
  fill = 0;
  question = {
    title: '转子发动机是由哪个汽车品牌发明的？',
    options: ['丰田', '马自达', '本田', '名爵'],
    answer: '马自达',
  };
  answerCellRef = [];
  leftAnswer = '';
  rightAnswer = '';

  componentDidMount() {
    this.startShowPlayers();
  }

  startShowPlayers = () => {
    Animated.parallel([
      Animated.timing(this.translateYValue, {
        toValue: 1,
        duration: 300,
        delay: 500,
      }),
      Animated.spring(this.answerPosValue, {
        toValue: 1,
        duration: 3000,
        friction: 6,
        delay: 600,
      }),
    ]).start(() => {
      setTimeout(() => this.progress && this.progress.performLinearAnimation(100, 10 * 1000), 1000);
    });
  };

  handlePressAnswer = ({title, index}) => {
    const {answer: correctAnswer} = this.question;
    // todo
    this.answerCellRef[index] && this.answerCellRef[index].performAnswerResultAnimation();
  };

  renderChildren = fill => {
    this.fill = fill;
    return (
      <Text style={{transform: [{rotate: '90deg'}]}}>
        { 10 - parseInt(fill / 10) }
      </Text>
    );
  };

  renderAnswerCell = (answer, index) => {
    return (
      <AnswerCell
        ref={r => this.answerCellRef[index] = r}
        key={`AnswerCell_${index}`}
        title={answer}
        index={index}
        onPress={this.handlePressAnswer}
      />
    );
  };

  render() {
    const {title, options} = this.question;
    const translateY = this.translateYValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-180, 64],
    });
    const answerPos = this.answerPosValue.interpolate({
      inputRange: [0, 1],
      outputRange: [Common.screenH - 180, 20],
    });

    return (
      <View style={styles.root}>
        <Animated.View style={[styles.playerWrapper, {transform: [{translateY}]}]}>
          <View style={styles.player}>
            <View style={styles.avatar}/>
            <Text>广州 奥迪</Text>
            <View style={styles.coinWrapper}>
              <Text>180</Text>
            </View>
          </View>
          <View style={styles.pkWrapper}>
            <Text>PK</Text>
            <View style={styles.coinWrapper}>
              <Text>汽车知识</Text>
            </View>
          </View>
          <View style={styles.player}>
            <View style={styles.avatar}/>
            <Text>广州 奥迪</Text>
            <View style={styles.coinWrapper}>
              <Text>180</Text>
            </View>
          </View>
        </Animated.View>
        <Animated.View style={[styles.answer, {transform: [{translateY: answerPos}]}]}>
          <View style={styles.answerContent}>
            <Text style={styles.question}>{title}</Text>
            {options.map(this.renderAnswerCell)}
          </View>
          <View style={[styles.countdown, {transform: [{rotate: '-90deg'}]}]}>
            <AnimatedCircularProgress
              style={{backgroundColor: 'transparent', marginLeft: -1, marginTop: -1}}
              ref={r => this.progress = r}
              size={81}
              width={4}
              fill={0}
              tintColor="red"
              backgroundColor="#ccc"
            >
              {this.renderChildren}
            </AnimatedCircularProgress>
          </View>
        </Animated.View>
      </View>
    );
  }
}