/**
 * Project - RNProjectPlayground
 * Author      : ljunb
 * Date        : 2017/12/20 下午8:57
 * Description : TabBarView
 */
import React, {PureComponent} from 'react';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Feed from './feed';
import Home from './home';
import Mine from './mine';
import TabBar from '../components/TabBar';

const tabTitles = ['食物百科', '逛吃', '我的'];
const tabIcons = [
  require('../resource/ic_tab_search.png'),
  require('../resource/ic_tab_homepage.png'),
  require('../resource/ic_tab_my.png'),
];
const tabSelectedIcon = [
  require('../resource/ic_tab_search_select.png'),
  require('../resource/ic_tab_homepage_select.png'),
  require('../resource/ic_tab_my_select.png'),
];

export default class TabBarView extends PureComponent {
  renderTabBar = () => {
    return (
      <TabBar
        tabNames={tabTitles}
        tabIconNames={tabIcons}
        selectedTabIconNames={tabSelectedIcon}
      />
    );
  };

  render() {
    return (
      <ScrollableTabView
        locked
        scrollWithoutAnimation
        renderTabBar={this.renderTabBar}
        tabBarPosition="bottom"
      >
        <Home tabLabel="Home" {...this.props} />
        <Feed tabLabel="Feed" {...this.props} />
        <Mine tabLabel="Mine" {...this.props} />
      </ScrollableTabView>
    );
  }
}