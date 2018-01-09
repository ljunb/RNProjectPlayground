import React from 'react';
import {View} from 'react-native';
import {Provider} from 'mobx-react';
import Router from './src/routers';
import stores from './src/stores';
import Constants from './src/common/constants';

export default (props) => {
  const {pageName: routerKey} = props;
  const Page = Router[routerKey].default;
  return (
    <Provider {...stores}>
      <View style={[{flex: 1}, Constants.isIPhoneX && {paddingBottom: 34}]}>
        <Page {...props} />
      </View>
    </Provider>
  );
};