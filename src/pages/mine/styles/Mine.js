/**
 * Description : 我的样式文件
 *
 * Author : cookiej
 * Date   : 2017/12/27
 * Time   : 11:47
 */
import {StyleSheet} from 'react-native';
import Constant from '../../../common/constants';

export default StyleSheet.create({
  header: {
    width: Constant.screenW,
    height: 44,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContainer: {
    height: 44,
    width: 44,
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  loginContainer: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 2,
  },
  cellContainer: {
    borderColor: '#d9d9d9',
    marginTop: 15,
    backgroundColor: 'white',
  },
  staticCell: {
    flexDirection: 'row',
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellStyle: {
    flex: 1,
    height: 46,
    borderColor: '#d9d9d9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  topImage: {
    width: Constant.screenW,
    height: 230,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});