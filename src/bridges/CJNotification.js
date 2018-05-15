import { NativeEventEmitter, NativeModules, Platform, DeviceEventEmitter } from 'react-native';
const { CJRNNotificationCenter } = NativeModules;

const isAndroid = Platform.OS === 'android';
const notificationEmitter = isAndroid ? new NativeEventEmitter() : new NativeEventEmitter(CJRNNotificationCenter);

class Emitter {
  static addNativeListener = (eventName, callback) => {
    let subscription = notificationEmitter.addListener(
      'NATIVE_TO_RN',
      event => {
        if (eventName === event.EVENT_NAME) {
          callback && callback(event.EVENT_DATA);
        }
      }
    );
    subscription['dispose'] = () => subscription && subscription.remove();
    return subscription;
  };

  static addRNListener = (eventName, callback) => {
    let subscription = DeviceEventEmitter.addListener(
      eventName,
      response => callback && callback(response)
    );
    subscription['dispose'] = () => subscription && subscription.remove();
    return subscription;
  };

  static sendRNEvent = (eventName, params) => {
    DeviceEventEmitter.emit(eventName, params);
  };
}

export default Emitter;