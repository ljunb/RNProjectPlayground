//
//  CJNotification.h
//  RNProjectPlayground
//
//  Created by cookiej on 2018/5/19.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface CJNotificationCenter : RCTEventEmitter <RCTBridgeModule>

/**
 单例
 */
+ (instancetype)center;

/**
 发送事件到 JavaScript

 @param notification 事件名称
 @param body 发送内容
 */
- (void)sendRNEventWithName:(NSString *)notification body:(NSDictionary *)body;

@end
