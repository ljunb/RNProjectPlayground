//
//  RNPayloadViewController.m
//  RNProjectPlayground
//
//  Created by CookieJ on 2017/12/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "RNPayloadViewController.h"
#import "ReactRootViewManager.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@interface RNPayloadViewController ()
@property (nonatomic, copy) NSString *pageName;
@property (nonatomic, strong) NSMutableDictionary *initialProperties;
@end

@implementation RNPayloadViewController

- (instancetype)initWithPageName:(NSString *)pageName params:(NSDictionary *)params
{
  self = [super init];
  if (self) {
    _pageName = pageName;
    _initialProperties = [NSMutableDictionary dictionaryWithDictionary:params];
  }
  return self;
}

- (void)viewDidLoad {
  [super viewDidLoad];
  [self configInitialProperties];
  [self setupRootView];
}

- (void)configInitialProperties {
  [self.initialProperties setObject:self.pageName ?: @"default" forKey:PAGE_NAME_KEY];
}

- (void)setupRootView {
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:[ReactRootViewManager manager].bridge
                                                   moduleName:APP_MODULE_NAME
                                            initialProperties:self.initialProperties];
  rootView.backgroundColor = [UIColor whiteColor];
  self.view = rootView;
}

@end
