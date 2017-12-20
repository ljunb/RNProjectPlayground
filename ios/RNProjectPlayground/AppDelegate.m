/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"
#import "CJNavigation.h"
#import "ReactRootViewManager.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UINavigationController *rootViewController = (UINavigationController *)[self setupRootViewControllerWithLaunchOptions:launchOptions];
  self.navigationController = rootViewController;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (UIViewController *)setupRootViewControllerWithLaunchOptions:(NSDictionary *)launchOptions
{
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:[ReactRootViewManager manager].bridge
                                       moduleName:@"RNProjectPlayground"
                                initialProperties:@{@"pageName": @"root"}];
  
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  UINavigationController *unv = [[UINavigationController alloc] initWithRootViewController:rootViewController];
  unv.navigationBarHidden = YES;

  return unv;
}

@end
