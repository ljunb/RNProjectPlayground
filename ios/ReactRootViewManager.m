//
//  CJNavigation.h
//  RNProjectPlayground
//
//  Created by CookieJ on 2017/12/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "ReactRootViewManager.h"

@interface ReactRootViewManager ()
// 以 pageName-rootView 的形式保存需预加载的RN界面
@property (nonatomic, strong) NSMutableDictionary<NSString *, RCTRootView*> * rootViewMap;
@end

@implementation ReactRootViewManager

- (void)dealloc {
	_rootViewMap = nil;
	[_bridge invalidate];
}

+ (instancetype)manager {
	static ReactRootViewManager *_rootViewManager = nil;
	static dispatch_once_t onceToken;
	dispatch_once(&onceToken, ^{
		_rootViewManager = [[ReactRootViewManager alloc] init];
	});
	return _rootViewManager;
}

+ (instancetype)allocWithZone:(struct _NSZone *)zone {
	static ReactRootViewManager *_rootViewManager = nil;
	static dispatch_once_t onceToken;
	dispatch_once(&onceToken, ^{
		_rootViewManager = [super allocWithZone:zone];
	});
	return _rootViewManager;
}

- (instancetype)init {
	if (self = [super init]) {
		_rootViewMap = [NSMutableDictionary dictionaryWithCapacity:0];
		_bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:nil];
	}
	return self;
}

- (void)preLoadRootViewWithName:(NSString *)pageName {
	[self preLoadRootViewWithName:pageName initialProperty:nil];
}

- (void)preLoadRootViewWithName:(NSString *)pageName initialProperty:(NSDictionary *)initialProperty {
	if (!pageName && [_rootViewMap objectForKey:pageName]) {
		return;
	}
  NSMutableDictionary *tmpInitialProperty = [NSMutableDictionary dictionaryWithDictionary:initialProperty];
  [tmpInitialProperty setObject:pageName ?: @"default" forKey:PAGE_NAME_KEY];
	// create root view with bridge
	RCTRootView *rnView = [[RCTRootView alloc] initWithBridge:self.bridge
																								 moduleName:APP_MODULE_NAME
																					initialProperties:tmpInitialProperty];
	[self.rootViewMap setObject:rnView forKey:pageName];
}

- (void)removeAllPreLoadRootView {
	[self.rootViewMap removeAllObjects];
}

- (RCTRootView *)rootViewWithName:(NSString *)pageName {
	if (!pageName) {
		return nil;
	}
	return [self.rootViewMap objectForKey:pageName];
}

#pragma mark - RCTBridgeDelegate
- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"
                                                        fallbackResource:nil];
}

@end
