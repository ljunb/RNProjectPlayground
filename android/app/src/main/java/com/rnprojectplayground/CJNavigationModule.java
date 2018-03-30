package com.rnprojectplayground;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

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

        Bundle paramBundle = convertMapToBundle(param);
        if (paramBundle != null) {
            intent.putExtras(paramBundle);
        }
        activity.startActivity(intent);
    }

    @ReactMethod
    public void pop(Boolean animated) {
        Activity activity = ReactActivityManager.topActivity();
        if (activity == null) return;
        activity.finish();
    }

    @ReactMethod
    public void popTo(String routeName, Boolean animated) {
        ReactActivityManager.popTo(routeName, animated);
    }

    @ReactMethod
    public void popToRoot(Boolean animated) {
        ReactActivityManager.popToRoot(animated);
    }

    private Bundle convertMapToBundle(ReadableMap readableMap) {
        if (readableMap == null) return null;

        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        if (iterator == null || !iterator.hasNextKey()) return null;

        Bundle bundle = new Bundle();
        try {
            while (iterator.hasNextKey()) {
                String key = iterator.nextKey();
                switch (readableMap.getType(key).name()) {
                    case "String":
                        bundle.putString(key, readableMap.getString(key));
                        break;
                    case "Number":
                        bundle.putInt(key, readableMap.getInt(key));
                        break;
                    case "Boolean":
                        bundle.putBoolean(key, readableMap.getBoolean(key));
                        break;
                    case "Map":
                        String value = readableMap.getMap(key).toString();
                        value = value.substring(13, value.length() - 2);
                        bundle.putString(key, value);
                        break;
                    case "Array":
                        bundle.putString(key, readableMap.getArray(key).toString());
                        break;
                    case "Null":
                        bundle.putString(key, "");
                        break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return bundle;
    }
}
