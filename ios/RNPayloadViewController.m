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

- (void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];
  if ([[self lightContentPageNames] containsObject:self.pageName]) {
    [UIApplication sharedApplication].statusBarStyle = UIStatusBarStyleLightContent;
  } else {
    [UIApplication sharedApplication].statusBarStyle = UIStatusBarStyleDefault;
  }
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

- (UIStatusBarStyle)preferredStatusBarStyle {
  if ([[self lightContentPageNames] containsObject:self.pageName]) {
    return UIStatusBarStyleLightContent;
  }
  return UIStatusBarStyleDefault;
}

- (NSArray *)lightContentPageNames {
  return @[
           @"main_tab",
           ];
}

@end
