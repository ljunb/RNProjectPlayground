/**
 * Description : 类朋友圈点击查看大图
 *
 * Author : cookiej
 * Date   : 2018/1/9
 * Time   : 14:11
 */
import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import ImageViewPager from './ViewPager';

export default class Gallery extends Component {
  imageList = [
    'http://www.quanjing.com/image/2017index/lx3.png',
    'http://p2.wmpic.me/article/2017/04/05/1491360811_KGDMrHbN_215x185.jpg',
    'http://www.vstou.com/img/201503/jkjk,m.jpg',
    'http://www.quanjing.com/image/2017index/lx3.png',
    'http://p2.wmpic.me/article/2017/04/05/1491360811_KGDMrHbN_215x185.jpg',
    'http://www.vstou.com/img/201503/jkjk,m.jpg',
    'http://www.quanjing.com/image/2017index/lx3.png',
    'http://p2.wmpic.me/article/2017/04/05/1491360811_KGDMrHbN_215x185.jpg',
    'http://www.vstou.com/img/201503/jkjk,m.jpg',
  ];
  imageRefs = [];

  handlePress = index => {
    this.imageRefs[index] && this.imageRefs[index].measure((ox, oy, width, height, px, py) => {
      const origin = {
        px, py, width, height,
      };
      this.viewPager && this.viewPager.show(index, origin, this.imageRefs);
    });
  };

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', alignItems: 'center'}}>
          {this.imageList.map((image, index) => {
            return (
              <TouchableOpacity
                key={`ImageItem_${index}`}
                ref={r => this.imageRefs[index] = r}
                activeOpacity={1}
                onPress={() => this.handlePress(index)}
              >
                <Image style={{height: 100, width: 100}} source={{uri: image}} />
              </TouchableOpacity>
            );
          })}
        </View>
        <ImageViewPager
          ref={r => this.viewPager = r}
          imageList={this.imageList}
        />
      </View>
    );
  }
}