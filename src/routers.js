/**
 * Description : 路由配置
 *
 * Author : cookiej
 * Date   : 2017/12/20
 * Time   : 16:53
 */
export default {
  'main_tab': require('./pages'),
  'home': require('./pages/home'),
  'search': require('./pages/home/Search'),
  'feed': require('./pages/feed'),
  'mine': require('./pages/mine'),

  'demos/guidance': require('./pages/demos/guidance/NewGuidePage'),
  'demos/gallery': require('./pages/demos/gallery'),
  'demos/ts': require('./pages/demos/ts'),
  'demos/gesture': require('./pages/demos/gesture'),
  'demos/animation/floating': require('./pages/demos/animation'),
  'demos/animation/path': require('./pages/demos/animation/path'),
  'demos/animation/headking': require('./pages/demos/animation/headking'),
};