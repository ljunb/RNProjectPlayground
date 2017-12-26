import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    height: 50,
    borderTopColor: '#d9d9d9',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  icon: {
    width: 26,
    height: 26,
    marginBottom: 2,
  },
});

export default class TabBar extends Component {
  static propType = {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,

    tabNames: PropTypes.array,
    tabIconNames: PropTypes.array,
  };

  render() {
    const {
      activeTab, selectedTabIconNames, tabIconNames, tabNames, goToPage,
    } = this.props;

    return (
      <View style={[styles.tabs, {borderTopWidth: StyleSheet.hairlineWidth}]}>
        {this.props.tabs.map((tab, i) => {
          const color = activeTab === i ? 'red' : 'gray';
          const icon = activeTab === i ? selectedTabIconNames[i] : tabIconNames[i];
          return (
            <TouchableOpacity
              key={`TabBarItem_${tabNames[i]}`}
              activeOpacity={1}
              style={styles.tab}
              onPress={() => goToPage && goToPage(i)}
            >
              <View style={styles.tabItem}>
                <Image style={styles.icon} source={icon} />
                <Text style={{color, fontSize: 12}}>{tabNames[i]}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}