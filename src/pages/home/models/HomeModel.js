/**
 * Description : 集中管理model
 *
 * Author : cookiej
 * Date   : 2017/12/21
 * Time   : 10:27
 */
import {types, flow} from 'mobx-state-tree';

const Category = types.model('Category', {
  id: types.number,
  name: types.string,
  image_url: types.string,
});

const Group = types.model('Group', {
  kind: types.string,
  categories: types.optional(types.array(Category), [])
});

const Home = types.model('Home', {
  isLoading: true,
  isLoadError: false,
  foodList: types.optional(types.array(Group), []),
}).actions(self => ({
  fetchData: flow(function*() {
    try {
      const url = 'http://food.boohee.com/fb/v1/categories/list';
      const responseData = yield fetch(url).then(res => res.json());
      self.foodList = responseData.group;
      self.isLoading = false;
    } catch (e) {
      self.isLoadError = true;
      self.isLoading = false;
      console.log(`[Home] fetch category list error: ${e}`);
    }
  }),
  refresh: () => {
    self.isLoading = true;
    self.isLoadError = false;
    self.fetchData();
  }
}));

export default {
  setup: () => Home.create(),
}