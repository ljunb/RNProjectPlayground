/**
 * Description :
 *
 * Author : cookiej
 * Date   : 2017/12/22
 * Time   : 09:02
 */
import {AsyncStorage} from 'react-native';
import {types, flow} from 'mobx-state-tree';

const SearchHistoryKey = 'SearchHistoryKey';
const Search = types.model('Search', {
  state: types.optional(types.enumeration(['none', 'searching', 'searchSuccess', 'searchError']), 'none'),
  historyKeywords: types.optional(types.array(types.string), []),
  hotKeywords: types.optional(types.array(types.frozen), []),
  searchResults: types.optional(types.array(types.frozen), []),
}).views(self => ({
  get showResult() {
    return self.state === 'searchSuccess';
  },
  get isLoading() {
    return self.state === 'searching';
  },
  get isLoadError() {
    return self.state === 'searchError';
  },
})).actions(self => ({
  afterCreate: () => {
    // 获取搜索历史
    self.getHistoryKeywords();
    // self.fetchHotKeywords;
  },
  getHistoryKeywords: flow(function* () {
    try {
      const result = yield AsyncStorage.getItem(SearchHistoryKey);
      if (!result) return;
      self.historyKeywords = JSON.parse(result);
    } catch (e) {
      console.log(`[SearchModel] JSON parse historyKeywords error: ${e}`);
    }
  }),
  fetchHotKeywords: flow(function* () {
    try {
      // todo: no URL
      const url = '';
      const responseData = yield fetch(url).then(res => res.json());

    } catch (e) {
      console.log(`[SearchModel] fetch hot keywords error: ${e}`);
    }
  }),
  search: flow(function* (keyword) {
    try {
      self.historyKeywords.push(keyword);
      AsyncStorage.setItem(SearchHistoryKey, JSON.stringify(self.historyKeywords));

      // todo: get result from server
      const url = '';
      const responseData = yield fetch(url).then(res => res.json())

    } catch (e) {
      console.log(`[SearchModel] search keyword error: ${e}`);
    }
  }),
}));

export default {
  setup: () => Search.create(),
}