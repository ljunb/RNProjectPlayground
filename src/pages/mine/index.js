/**
 * Description : 我的
 *
 * Author : cookiej
 * Date   : 2017/12/20
 * Time   : 17:29
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ImageBackground,
} from 'react-native';
import {observer} from 'mobx-react/native';
import styles from './styles/Mine';
import CJNavigation from '../../bridges/CJNavigation';

@observer
export default class Profile extends Component {

  handleLogin = () => CJNavigation.push('demos/ts', {name: 'ljunb'});

  handlePressStaticCell = title => alert(title);

  render() {
    const cellStyle = {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
    };

    return (
      <View style={{flex: 1, backgroundColor: '#f5f5f5'}}>
        <HeaderView loginAction={this.handleLogin} />
        <View style={[styles.cellContainer, cellStyle]}>
          <ProfileStaticCell
            title="我的照片"
            style={{borderBottomWidth: StyleSheet.hairlineWidth}}
            imageName={require('../../resource/ic_my_photos.png')}
            onPress={this.handlePressStaticCell}
          />
          <ProfileStaticCell
            title="我的收藏"
            style={{borderBottomWidth: StyleSheet.hairlineWidth}}
            imageName={require('../../resource/ic_my_collect.png')}
            onPress={this.handlePressStaticCell}
          />
          <ProfileStaticCell
            title="上传食物数据"
            imageName={require('../../resource/ic_my_upload.png')}
            onPress={this.handlePressStaticCell}
          />
        </View>
      </View>
    );
  }
}

const HeaderView = ({settingAction, loginAction}) => {
  return (
    <ImageBackground style={styles.topImage} source={require('../../resource/img_my_head.png')}>
      <View style={styles.header}>
        <Text style={{color: 'white', fontSize: 16}}>我的</Text>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.settingContainer}
          onPress={settingAction}
        >
          <Image
            style={{width: 20, height: 20}}
            source={require('../../resource/ic_my_setting.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.avatarContainer}>
          <Image
            style={{width: 80, height: 80}}
            source={require('../../resource/img_default_avatar.png')}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.loginContainer}
          onPress={loginAction}
        >
          <Text style={{color: 'white'}}>点击登录</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const ProfileStaticCell = props => {
  const {
    title, imageName, style, onPress,
  } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      style={styles.staticCell}
      onPress={() => onPress(title)}
    >
      <Image style={{width: 20, height: 20, marginHorizontal: 15}} source={imageName} />
      <View style={[styles.cellStyle, style]}>
        <Text style={{color: 'gray'}}>{title}</Text>
        <Image style={{width: 20, height: 20}} source={require('../../resource/ic_my_right.png')} />
      </View>
    </TouchableOpacity>
  );
};