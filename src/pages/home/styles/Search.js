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
    width: Constant.screenW - 44 * 2,
    height: 30,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: -16,
    backgroundColor: '#aaa',
    paddingHorizontal: 5,
  },
  textInput:  {
    width: Constant.screenW - 60 * 2,
    height: 30,
  },
  scanIcon: {
    height: 20,
    width: 20,
    backgroundColor: 'red',
  },
  searchIconWrapper: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  searchIcon: {
    height: 24,
    width: 24,
    backgroundColor: 'red',
  },
});