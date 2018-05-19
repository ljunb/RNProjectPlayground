//
//  CJNotification.m
//  RNProjectPlayground
//
//  Created by cookiej on 2018/5/19.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "CJNotificationCenter.h"

#define NATIVE_TO_RN_EVENT_KEY @"NATIVE_TO_RN"

@implementation CJNotificationCenter
{
  BOOL hasListeners;
}

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents {
  return @[NATIVE_TO_RN_EVENT_KEY];
}

- (void)startObserving {
  hasListeners = YES;
}

- (void)stopObserving {
  hasListeners = NO;
}

+ (instancetype)center {
  static CJNotificationCenter *_center = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _center = [[CJNotificationCenter alloc] init];
  });
  return _center;
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone {
  static CJNotificationCenter *_center = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _center = [super allocWithZone:zone];
  });
  return _center;
}

- (void)sendRNEventWithName:(NSString *)notification body:(NSDictionary *)body {
  NSMutableDictionary *newInfo = [NSMutableDictionary dictionary];
  [newInfo setObject:notification forKey:@"eventName"];
  [newInfo setObject:body forKey:@"body"];
  if (hasListeners) {
    [self sendEventWithName:NATIVE_TO_RN_EVENT_KEY body:newInfo];
  }
}

@end
