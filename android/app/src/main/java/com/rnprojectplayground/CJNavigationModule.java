package com.rnprojectplayground;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class CJNavigationModule extends ReactContextBaseJavaModule {

    @Override
    public String getName() {
        return "CJNavigation";
    }

    public CJNavigationModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void push(String pageName, ReadableMap param) {
        Activity activity = ReactActivityManager.topActivity();
        Intent intent = new Intent();
        intent.setClass(activity, RNPayloadActivity.class);
        intent.putExtra("pageName", pageName);
        activity.startActivity(intent);
    }

    @ReactMethod
    public void pop(Boolean animated) {
        Activity activity = ReactActivityManager.topActivity();
        if (activity == null) return;
        activity.finish();
    }
}
