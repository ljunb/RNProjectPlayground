/**
 * Description :
 *
 * Author : cookiej
 * Date   : 2017/12/21
 * Time   : 09:21
 */
import {Dimensions, DeviceInfo, Platform} from 'react-native';

export default {
  screenW: Dimensions.get('window').width,
  screenH: Dimensions.get('window').height,
  __IOS__: Platform.OS === 'ios',
}