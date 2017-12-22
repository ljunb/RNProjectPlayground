/**
 * Description : 桥接的导航模块
 *
 * Author : cookiej
 * Date   : 2017/12/20
 * Time   : 17:25
 */
import {NativeModules} from 'react-native';
const { CJNavigation } = NativeModules;

class Module {
  /**
   * push 操作
   * @param {String} pageName 下一页面的名称
   * @param {Object} params 参数
   */
  static push = (pageName, params) => CJNavigation.push(pageName, params);

  /**
   * pop 操作
   * @param {Boolean} animated 是否开启动画
   */
  static pop = (animated = true) => CJNavigation.pop(animated);

  /**
   * pop 到某个指定页面
   * @param {String} pageName 页面名称
   * @param {Boolean} animated 是否开启动画
   */
  static popTo = (pageName, animated = true) => CJNavigation.popTo(pageName, animated);

  /**
   * 返回到最先入栈的页面
   * @param {Boolean} animated 是否开启动画
   */
  static popToRoot = (animated = true) => CJNavigation.popToRoot(animated);
}

export default Module;