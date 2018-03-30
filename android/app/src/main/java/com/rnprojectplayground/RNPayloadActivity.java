package com.rnprojectplayground;

import android.content.MutableContextWrapper;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;

public class RNPayloadActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler{

    protected ReactRootView rootView;
    public String viewName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String pageName = getIntent().getStringExtra("pageName");
        viewName = pageName;

        Bundle bundle = new Bundle();
        bundle.putString("pageName", pageName);
        rootView = new ReactRootView(this);
        rootView.startReactApplication(
                MainApplication.reactInstanceManager,
                "RNProjectPlayground",
                bundle
        );
        ReactActivityManager.pushActivity(this);
        setContentView(rootView);
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }
}
