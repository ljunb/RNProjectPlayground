/**
 * Description : 首页样式文件
 *
 * Author : cookiej
 * Date   : 2017/12/21
 * Time   : 09:13
 */
import {StyleSheet} from 'react-native';
import Constant from '../../../common/constants';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  textInputWrapper: {
    width: Constant.screenW - 44 - 28,
    height: 30,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: -12,
    backgroundColor: '#f5f5f5',
    paddingLeft: 5,
  },
  textInput:  {
    width: Constant.screenW - 60 * 2,
    height: 30,
  },
  scanIcon: {
    height: 26,
    width: 26,
  },
  searchIconWrapper: {
    width: 28,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 44,
  },
  searchIcon: {
    height: 18,
    width: 18,
  },
  hotKeywordWrapper: {
    paddingLeft: 16,
    borderColor: '#ebebeb',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 13,
    color: '#999',
    fontWeight: '100',
  },
  section: {
    height: 36,
    paddingTop: 16,
    paddingLeft: 16,
    backgroundColor: '#f5f5f5'
  },
  keywordItem: {
    height: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyKeyword: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyKeywordInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ebebeb',
    height: 44,
    width: Constant.screenW - 16 * 2 - 18,
    paddingRight: 16,
  },
  clockIcon: {
    height: 18,
    width: 18,
    marginRight: 16,
  },
  arrowIcon: {
    height: 12,
    width: 12,
  },
  clearBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
  },
  clearIcon: {
    height: 26,
    width: 26,
    marginRight: 3,
  }
});