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
  headerContainer: {
    height: 220,
    width: Constant.screenW,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Constant.__IOS__ ? 20 + 15 : 15,
    paddingBottom: 28,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(1,1,1,0)',
    overflow: 'hidden'
  },
  headerLogo: {
    width: 66,
    height: 24,
  },
  headerSearchContainer: {
    height: 44,
    width: Constant.screenW - 16 * 2,
    backgroundColor: 'white',
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'row'
  },
  foodHandleContainer: {
    height: 60,
    width: Constant.screenW - 16 * 2,
    backgroundColor: 'white',
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: 'gray',
    shadowOpacity: 0.3,
    shadowOffset: {width: 1, height: -1},
    shadowRadius: 2,
  },
  handelItem: {
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5
  },
  line: {
    height: 50,
    width: 0.5,
    backgroundColor: '#d9d9d9'
  },
  categoryContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: Constant.screenW - 16 * 2
  },
  groupHeader: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  category: {
    width: (Constant.screenW - 16 * 2) / 3,
    height: 65,
    alignItems: 'center',
    marginBottom: 25,
  },
  categoryIcon: {
    width: 40,
    height: 40,
  },
  categoryTitle: {
    color: 'gray',
    fontSize: 12,
    marginTop: 5,
  },
  animatedNav: {
    height: 64,
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(231, 139, 86)',
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});