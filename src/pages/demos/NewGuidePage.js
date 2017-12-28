/**
 * Description : 测试新手引导装饰器
 *
 * Author : cookiej
 * Date   : 2017/12/28
 * Time   : 11:33
 */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { injectGuidance } from 'rn-beginner-guidance-decorator';
import NewerGuideDialog from './NewerGuideDialog';

const NewGuidePage = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Test</Text>
    </View>
  );
};

export default injectGuidance(NewerGuideDialog, {displayName: 'NewGuidePage2'})(NewGuidePage);

// @injectGuidance(NewerGuideDialog, {displayName: 'NewGuidePage'})
// class NewGuidePage extends Component {
//   render() {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <Text>Test</Text>
//       </View>
//     );
//   }
// }
//
// export default NewGuidePage;