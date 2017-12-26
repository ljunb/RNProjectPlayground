import React, {Component} from 'react';
import {Provider} from 'mobx-react';
import Router from './src/routers';
import stores from './src/stores';

export default (props) => {
  const {pageName: routerKey} = props;
  const Page = Router[routerKey].default;
  return (
    <Provider {...stores}>
      <Page {...props} />
    </Provider>
  );
};