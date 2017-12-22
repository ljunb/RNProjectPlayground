/**
 * Description : 搜索页
 *
 * Author : cookiej
 * Date   : 2017/12/21
 * Time   : 16:33
 */
import React, { Component } from 'react';
import {View, TextInput, Image, TouchableOpacity} from 'react-native';
import {observer} from 'mobx-react';
import SearchModel from './models/SearchModel';
import NavigationBar from '../../components/NavigationBar';
import CJNavigation from '../../bridges/CJNavigation';
import styles from './styles/Search';

@observer
export default class Search extends Component<{}> {
  constructor(props) {
    super(props);
    this.searchModel = SearchModel.setup();
  }

  handleBack = () => CJNavigation.pop();

  handleScan = () => alert('scan');

  renderTitleView = () => {
    return (
      <View style={styles.textInputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder="请输入食物名称"
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.handleScan}
        >
          <Image style={styles.scanIcon}/>
        </TouchableOpacity>
      </View>
    );
  };

  renderRightItem = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.handleScan}
        style={styles.searchIconWrapper}
      >
        <Image style={styles.searchIcon}/>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <NavigationBar
          renderTitleView={this.renderTitleView}
          renderRightItem={this.renderRightItem}
          onBack={this.handleBack}
        />

      </View>
    )
  }
}