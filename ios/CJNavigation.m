//
//  CJNavigation.m
//  RNProjectPlayground
//
//  Created by CookieJ on 2017/12/20.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import "CJNavigation.h"
#import "RNPayloadViewController.h"
#import "AppDelegate.h"

@implementation CJNavigation

RCT_EXPORT_MODULE()

- (dispatch_queue_t)methodQueue {
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(push:(NSString *)pageName params:(NSDictionary *)params)
{
  RNPayloadViewController *payloadVC = [[RNPayloadViewController alloc] initWithPageName:pageName
                                                                                  params:params];
  
  AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  [appDelegate.navigationController pushViewController:payloadVC animated:YES];
}

RCT_EXPORT_METHOD(pop:(BOOL)animated)
{
  AppDelegate *appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
  [appDelegate.navigationController popViewControllerAnimated:animated];
}

@end
