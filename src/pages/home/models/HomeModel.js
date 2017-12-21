/**
 * Description : 集中管理model
 *
 * Author : cookiej
 * Date   : 2017/12/21
 * Time   : 10:27
 */
import {types, flow} from 'mobx-state-tree';

const Home = types.model('Home', {
  foodList: types.optional(types.array(types.frozen), []),
  state: types.optional(types.enumeration(['loading', 'loadSuccess', 'loadError']), 'loading'),
}).views(self => ({
  get isLoading() {
    return self.state === 'loading';
  },
  get isLoadError() {
    return self.state === 'loadError';
  }
})).actions(self => ({
  fetchData: flow(function*() {
    try {
      const url = 'http://food.boohee.com/fb/v1/categories/list';
      const responseData = yield fetch(url).then(res => res.json());
      self.foodList = responseData.group;
      self.state = 'loadSuccess';
    } catch (e) {
      self.state = 'loadError';
      console.log(`[Home] fetch category list error: ${e}`);
    }
  }),
  refresh: () => {
    self.state = 'loading';
    self.fetchData();
  },
}));

export default {
  setup: () => Home.create(),
}