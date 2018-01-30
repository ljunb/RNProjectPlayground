package com.rnprojectplayground;

import android.content.ComponentName;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactRootView;

public class MainActivity extends ReactActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Bundle bundle = new Bundle();
        bundle.putString("pageName", "test");

        ReactRootView rootView = new ReactRootView(this);
        rootView.startReactApplication(
                MainApplication.reactInstanceManager,
                "RNProjectPlayground",
                bundle
        );
        setContentView(rootView);
    }
}
