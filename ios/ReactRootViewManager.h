//
//  CJNavigation.h
//  RNProjectPlayground
//
//  Created by CookieJ on 2017/12/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//
#import <React/RCTRootView.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTBridge.h>
#import <Foundation/Foundation.h>

@interface ReactRootViewManager : NSObject<RCTBridgeDelegate>

// 全局唯一的bridge
@property (nonatomic, readonly, strong) RCTBridge *bridge;

/*
 * 获取单例
 */
+ (instancetype)manager;

/*
 * 根据pageName预加载bundle文件
 * param: 
 *	pageName RN界面名称
 *	initialProperty: 初始化参数
 */
- (void)preLoadRootViewWithName:(NSString *)pageName;
- (void)preLoadRootViewWithName:(NSString *)pageName initialProperty:(NSDictionary *)initialProperty;

- (void)removeAllPreLoadRootView;

/*
 * 根据pageName获取rootView
 * param:
 *	pageName RN界面名称
 *
 * return: 返回匹配的rootView
 */
- (RCTRootView *)rootViewWithName:(NSString *)pageName;

@end
