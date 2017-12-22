/**
 * Description :
 *
 * Author : cookiej
 * Date   : 2017/12/22
 * Time   : 09:33
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import PropTypes from 'prop-types';
import Constant from '../common/constants';

const LeftItem = ({onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.leftItem}
      onPress={onPress}
    >
      <Image
        style={{width: 20, height: 20}}
        source={require('../resource/ic_back_dark.png')}
        resizeMode={"contain"}
      />
    </TouchableOpacity>
  )
};

const RightItem = ({onPress, text}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.rightItem}
      onPress={onPress}
    >
      <Text style={{fontSize: 15, color: '#666666'}}>{text}</Text>
    </TouchableOpacity>
  )
};

const RightIconItem = ({onPress, icon}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.rightIconItem}
      onPress={onPress}
    >
      <Image style={{width: 18, height: 18}} source={icon} resizeMode={"contain"}/>
    </TouchableOpacity>
  )
};

export default class NavigationBar extends Component {
  static propTypes = {
    style: View.propTypes.style,
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    rightTitle: PropTypes.string,
    rightIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    showGoBack: PropTypes.bool,
    renderRightItem: PropTypes.func,
    renderTitleView: PropTypes.func,
    onBack: PropTypes.func,
    onRight: PropTypes.func,
  };

  static defaultProps = {
    showGoBack: true,
  };

  render() {
    const {
      title, titleStyle,
      showGoBack, onBack,
      style, rightTitle, onRight, rightIcon,
      renderRightItem, renderTitleView,
    } = this.props;

    return (
      <View style={[styles.header, style]}>
        {showGoBack && <LeftItem onPress={onBack}/>}
        {renderTitleView || <Text style={[styles.title, titleStyle]}>{title || ''}</Text>}
        {renderTitleView && renderTitleView()}
        {rightTitle && <RightItem text={rightTitle} onPress={onRight}/>}
        {rightIcon && <RightIconItem icon={rightIcon} onPress={onRight}/>}
        {renderRightItem &&
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.renderRight}
          onPress={onRight}
        >
          {renderRightItem()}
        </TouchableOpacity>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    height:64,
    width: Constant.screenW,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ebebeb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    color: '#666',
    fontSize: 18,
  },
  leftItem: {
    position: 'absolute',
    top: 20,
    left: 0,
    height: 44,
    width: 60,
    paddingLeft: 5,
    justifyContent: 'center',
  },
  rightItem: {
    position: 'absolute',
    top: 20,
    right: 0,
    height: 44,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightIconItem: {
    position: 'absolute',
    top: 20,
    right: 0,
    height: 44,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  renderRight: {
    position: 'absolute',
    top: 20,
    right: 0,
    height: 44,
    paddingRight: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});