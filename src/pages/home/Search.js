/**
 * Description : 搜索页
 *
 * Author : cookiej
 * Date   : 2017/12/21
 * Time   : 16:33
 */
import React, { Component } from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
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
    this.state = {
      keyword: '',
    }
  }

  handleBack = () => CJNavigation.pop();

  handleScanOrClear = () => {
    const {keyword} = this.state;
    if (keyword.length > 0) {
      this.setState({keyword: ''});
    } else {
      alert('scan')
    }
  };

  handleSearchKeyword = keyword => this.searchModel.search(keyword);

  handleClearHistory = () => this.searchModel.clearHistoryKeywords();

  renderTitleView = () => {
    const {keyword} = this.state;
    const icon = keyword.length > 0 ? require('../../resource/ic_clear.png') : require('../../resource/ic_scan.png');

    return (
      <View style={styles.textInputWrapper}>
        <TextInput
          style={styles.textInput}
          value={this.state.keyword}
          placeholder="请输入食物名称"
          onChangeText={keyword => this.setState({keyword})}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={this.handleScanOrClear}
        >
          <Image style={styles.scanIcon} source={icon}/>
        </TouchableOpacity>
      </View>
    );
  };

  renderRightItem = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => this.handleSearchKeyword(this.state.keyword)}
        style={styles.searchIconWrapper}
      >
        <Image
          style={styles.searchIcon}
          source={require('../../resource/ic_feed_search_selected.png')}
        />
      </TouchableOpacity>
    );
  };

  renderHotKeywordView = () => {
    const {hotKeywords} = this.searchModel;
    if (hotKeywords.length === 0) return null;

    return (
      <View>
        <SectionCell title="大家都在搜"/>
        <View style={styles.hotKeywordWrapper}>
          {hotKeywords.map((keywordArr, index) => {
            const isLastCell = index === hotKeywords.length - 1;
            return (
              <View
                key={`KeywordCell_${index}`}
                style={[styles.keywordItem, isLastCell && {borderBottomWidth: 0}]}
              >
                {keywordArr.map((item, key) => {
                  return (
                    <TouchableOpacity
                      key={`Keyword_${key}`}
                      activeOpacity={0.8}
                      style={{flex: 1, height: 44, justifyContent: 'center'}}
                      onPress={() => this.handleSearchKeyword(item)}
                    >
                      <Text style={{fontSize: 16, color: '#333', fontWeight: '100'}}>{item}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  renderHistoryKeywordView = () => {
    const {historyKeywords} = this.searchModel;
    if (historyKeywords.length === 0) return null;

    return (
      <View>
        <SectionCell title="最近搜过"/>
        <View style={styles.hotKeywordWrapper}>
          {historyKeywords.map((keyword, index) => {
            return (
              <TouchableOpacity
                key={`History_${index}`}
                activeOpacity={0.8}
                style={styles.historyKeyword}
                onPress={() => this.handleSearchKeyword(keyword)}
              >
                <Image style={styles.clockIcon} source={require('../../resource/ic_search_history.png')}/>
                <View style={styles.historyKeywordInner}>
                  <Text style={{fontSize: 16, color: '#333', fontWeight: '100'}}>{keyword}</Text>
                  <Image
                    style={styles.arrowIcon}
                    source={require('../../resource/ic_bullet_dark.png')}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={this.handleClearHistory}
          >
            <Image style={styles.clearIcon} source={require('../../resource/ic_trash.png')}/>
            <Text style={{fontSize: 14, color: '#999', fontWeight: '100'}}>清空历史记录</Text>
          </TouchableOpacity>
        </View>
      </View>
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
        <ScrollView style={{backgroundColor: '#f5f5f5'}}>
          {this.renderHistoryKeywordView()}
          {this.renderHotKeywordView()}
        </ScrollView>
      </View>
    )
  }
}

const SectionCell = ({title}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  )
};