import React, {Component} from 'react';
import Router from './src/routers';
import {Provider} from 'mobx-react';
import stores from './src/stores';

export default class App extends Component<{}> {
  render() {
    const {pageName: routerKey} = this.props;
    const Page = Router[routerKey].default;
    return (
      <Provider {...stores}>
        <Page {...this.props}/>
      </Provider>
    );
  }
}