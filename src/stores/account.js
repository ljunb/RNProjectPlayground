/**
 * Project - RNProjectPlayground
 * Author      : ljunb
 * Date        : 2017/12/20 下午8:47
 * Description : 用户信息store
 */
import {types} from 'mobx-state-tree';

const Account = types.model('Account', {
  name: '',
  phone: 0,
  avatar: '',
}).actions(self => ({
  updateAvatar: newAvatar => self.avatar = newAvatar,
}));

export default Account.create();