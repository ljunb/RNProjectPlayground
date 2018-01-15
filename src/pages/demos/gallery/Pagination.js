/**
 * Description : 页码指示器
 *
 * Author : cookiej
 * Date   : 2018/1/15
 * Time   : 17:22
 */
import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  paginationItem: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
});

export default class Pagination extends PureComponent {
  static propTypes = {
    pageCount: PropTypes.number,
    selectedPage: PropTypes.number,
    animated: PropTypes.bool,
  };

  static defaultProps = {
    animated: true,
  };

  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(props.selectedPage);
  }

  componentWillReceiveProps(nextProps) {
    const {selectedPage, animated} = this.props;
    if (nextProps.selectedPage !== selectedPage) {
      if (animated) {
        Animated.timing(this.animatedValue, {
          toValue: nextProps.selectedPage,
          duration: 200,
        }).start();
      } else {
        this.animatedValue.setValue(nextProps.selectedPage);
      }
    }
  }

  render() {
    const {pageCount} = this.props;

    const componentArr = [];
    for (let i = 0; i < pageCount; i++) {
      const scale = this.animatedValue.interpolate({
        inputRange: [i - 2, i - 1, i, i + 1, i + 2],
        outputRange: [0.8, 0.8, 1.2, 0.8, 0.8],
      });
      const backgroundColor = this.animatedValue.interpolate({
        inputRange: [i - 2, i - 1, i, i + 1, i + 2],
        outputRange: ['#aaa', '#aaa', '#fff', '#aaa', '#aaa'],
      });

      componentArr.push(
        <Animated.View
          key={`PaginationItem-${i}`}
          style={[styles.paginationItem, {transform: [{scale}]}, {backgroundColor}]}
        />
      );
    }

    return (
      <View style={styles.root}>
        {componentArr}
      </View>
    );
  }
}