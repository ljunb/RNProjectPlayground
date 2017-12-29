package com.rnprojectplayground;

import android.content.MutableContextWrapper;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;

public class RNPayloadActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler{

    protected ReactRootView rootView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String pageName = getIntent().getStringExtra("pageName");

        Bundle bundle = new Bundle();
        bundle.putString("pageName", pageName);
        rootView = new ReactRootView(this);
        rootView.startReactApplication(
                MainApplication.reactInstanceManager,
                "RNProjectPlayground",
                bundle
        );

        setContentView(rootView);
        // 替换mReactRootView的context为当前Activity
//        MutableContextWrapper contextWrapper = (MutableContextWrapper) rootView.getContext();
//        contextWrapper.setBaseContext(this);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }
}
