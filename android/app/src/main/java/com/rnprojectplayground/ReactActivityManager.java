package com.rnprojectplayground;


import android.app.Activity;

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
}
