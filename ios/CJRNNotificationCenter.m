//
//  CJRNNotificationCenter.m
//  RNProjectPlayground
//
//  Created by CookieJ on 2018/5/8.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "CJRNNotificationCenter.h"
#import "ReactRootViewManager.h"

@implementation CJRNNotificationCenter

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
  return @[@"NATIVE_TO_RN"];
}

+ (instancetype)defaultCenter {
  static CJRNNotificationCenter *_defaultCenter = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _defaultCenter = [[CJRNNotificationCenter alloc] init];
  });
  return _defaultCenter;
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone {
  static CJRNNotificationCenter *_defaultCenter = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    _defaultCenter = [super allocWithZone:zone];
  });
  return _defaultCenter;
}

- (instancetype)init {
  if (self = [super init]) {
    self.bridge = [ReactRootViewManager manager].bridge;
  }
  return self;
}

- (void)postNotificationWithName:(NSString *)notification info:(NSDictionary *)info {
  NSMutableDictionary *notifiInfo = [NSMutableDictionary dictionary];
  [notifiInfo setObject:notification forKey:@"EVENT_NAME"];
  [notifiInfo setObject:info forKey:@"EVENT_DATA"];
  [self sendEventWithName:@"NATIVE_TO_RN" body:notifiInfo];
}



@end
