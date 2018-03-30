package com.rnprojectplayground;


import android.app.Activity;
import android.text.TextUtils;

import java.util.Stack;

public class ReactActivityManager {
    private static Stack<Activity> activityStack = new Stack<>();

    private ReactActivityManager() {
        throw new IllegalStateException("不允许创建实例");
    }

    public static void pushActivity(Activity activity) {
        if (activity != null) {
            activityStack.push(activity);
        }
    }

    public static Activity topActivity() {
        if (activityStack.empty()) return null;
        return activityStack.peek();
    }

    public static void popTo(String routeName, Boolean animated) {
        if (activityStack.empty() || TextUtils.isEmpty(routeName)) return;

        for (int i = activityStack.size() - 1; i >= 0; i--) {
            Activity activity = activityStack.get(i);
            if (activity instanceof RNPayloadActivity) {
                RNPayloadActivity rnPayloadActivity = (RNPayloadActivity)activity;
                if (rnPayloadActivity == null) continue;
                if (rnPayloadActivity.viewName.equals(routeName)) return;

                if (!rnPayloadActivity.isFinishing()) {
                    rnPayloadActivity.finish();
                }
            }
        }
    }

    public static void popToRoot(Boolean animated) {
        if (activityStack.empty()) return;

        for (int i = activityStack.size() - 1; i >= 0; i--) {
            Activity activity = activityStack.get(i);
            if (activity == null) continue;
            if (activity instanceof MainActivity) return;
            if (!activity.isFinishing()) {
                activity.finish();
            }
        }
    }
}
