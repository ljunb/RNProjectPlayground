package com.rnprojectplayground;


import android.app.Activity;
import android.text.TextUtils;

import java.util.Stack;

public class ReactActivityManager {
    // 管理 RN Activity 的栈结构
    private static Stack<Activity> activityStack = new Stack<>();

    private ReactActivityManager() {
        throw new IllegalStateException("不允许创建实例");
    }

    /**
     * RN Activity 入栈
     * @param activity 新的 RN Activity
     */
    public static void pushActivity(Activity activity) {
        if (activity != null) {
            activityStack.push(activity);
        }
    }

    /**
     * 获取最顶层的 RN Activity
     * @return RN Activity 实例
     */
    public static Activity topActivity() {
        if (activityStack.empty()) return null;
        return activityStack.peek();
    }

    /**
     * 移除指定的 RN Activity
     * @param activity RN Activity 实例
     */
    public static void removeActivity(Activity activity) {
        if (activityStack.empty()) return;
        activityStack.removeElement(activity);
    }

    /**
     * 返回到指定的 RN Activity
     * @param routeName 对应的 RN 界面名称
     * @param animated 是否开启动画（适配iOS？）
     */
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

    /**
     * 返回到最顶部 RN Activity
     * @param animated 是否开启动画（适配iOS？）
     */
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
