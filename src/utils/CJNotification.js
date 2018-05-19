/*
 * @Description: 通知工具类：1）Native ➡ JavaScript；2）JavaScript ➡ JavaScript
 * @Author: cookiej
 * @Date: 2018-05-19 14:47:01
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-19 15:39:07
 */
import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  DeviceEventEmitter,
} from 'react-native';

const { CJNotificationCenter } = NativeModules;
const emitter = Platform.OS === 'android' ? new NativeEventEmitter() : new NativeEventEmitter(CJNotificationCenter);
const NativeEventName = 'NATIVE_TO_RN';

class Emitter {

  /**
   * 监听从 Native 发来的事件
   * @param event 事件名称
   * @param callback 监听回调
   * @function dispose 销毁监听对象
   */
  static addNativeListener = (event, callback) => {
    const subscription = emitter.addListener(
      NativeEventName,
      reminder => {
        const { eventName, body } = reminder;
        if (eventName !== event) return;
        callback && callback(body);
      },
    );
    subscription.dispose = () => subscription && subscription.remove();
    return subscription;
  };

  /**
   * 监听不同 RN 页面的通知事件
   * @param event 事件名称
   * @param callback 监听回调
   * @function dispose 销毁监听对象
   */
  static addRNListener = (event, callback) => {
    const subscription = DeviceEventEmitter.addListener(
      event,
      reminder => callback && callback(reminder),
    );
    subscription.dispose = () => subscription && subscription.remove();
    return subscription;
  };

  /**
   * 发送 RN 页面之间的通知
   * @param event 事件名称
   */
  static sendRNEvent = event => DeviceEventEmitter.emit(event);
}

export default Emitter;
