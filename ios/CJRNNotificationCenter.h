//
//  CJRNNotificationCenter.h
//  RNProjectPlayground
//
//  Created by CookieJ on 2018/5/8.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>

@interface CJRNNotificationCenter : RCTEventEmitter <RCTBridgeModule>

+ (instancetype)defaultCenter;

- (void)postNotificationWithName:(NSString *)notification info:(NSDictionary *)info;

@end
