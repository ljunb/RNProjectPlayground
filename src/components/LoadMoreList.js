/**
 * Description :
 *
 * Author : cookiej
 * Date   : 2017/12/22
 * Time   : 10:09
 */
import React, { Component } from 'react';
import {FlatList} from 'react-native';
import PropTypes from 'prop-types';

export default class LoadMoreList extends Component {
  static propTypes = {

  };

  static defaultProps = {

  };

  render() {
    return (
      <FlatList
        data={this.props.data}
        keyExtractor={(item, index) => index}
        renderItem={this._renderItem}
      />
    );
  }
}