
import React, { Component } from 'react';
import Router from './src/routers';

export default class App extends Component<{}> {
  render() {
    const {pageName: routerKey} = this.props;
    const Page = Router[routerKey].default;
    return <Page {...this.props}/>;
  }
}