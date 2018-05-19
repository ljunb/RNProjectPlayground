package com.rnprojectplayground;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class CJNotification {
    // 统一 Native 到 JavaScript 的事件名称
    final static private String NATIVE_TO_RN_EVENT = "NATIVE_TO_RN";
    public static ReactContext reactContext;

    /**
     * 发送事件到 Javascript
     * @param event 事件名称
     * @param params 发送内容
     */
    public static void sendRNEvent(String event, WritableMap params) {
        if (reactContext != null) {
            WritableMap body = Arguments.createMap();

            body.putString("eventName", event);
            if (params != null) {
                body.putMap("body", params);
            }

            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(NATIVE_TO_RN_EVENT, body);
        }
    }
}
