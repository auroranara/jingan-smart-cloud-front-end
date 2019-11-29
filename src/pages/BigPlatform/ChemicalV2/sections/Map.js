import React, { PureComponent, Fragment } from 'react';
// 引入样式文件
import styles from './Map.less';

const fengMap = fengmap; // eslint-disable-line
let map;
const fmapID = '100';
export default class Map extends PureComponent {
  state = {};

  componentDidMount() {
    this.initMap();
  }

  initMap() {
    var mapOptions = {
      //必要，地图容器
      container: document.getElementById('fengMap'),
      //地图数据位置
      mapServerURL: './data/' + fmapID,
      //主题数据位置
      // mapThemeURL: './data/theme',
      //设置主题
      defaultThemeName: '2001',
      //默认背景颜色,十六进制颜色值或CSS颜色样式 0xff00ff, '#00ff00'
      // defaultBackgroundColor: '#f7f4f4',
      //必要，地图应用名称，通过蜂鸟云后台创建
      appName: '真趣办公室',
      //必要，地图应用密钥，通过蜂鸟云后台获取
      key: 'cbb7eb159ce5b7d9300f0ce004f3a614',
    };

    //初始化地图对象
    map = new fengMap.FMMap(mapOptions);

    //打开Fengmap服务器的地图数据和主题
    map.openMapById(fmapID, function(error) {
      //打印错误信息
      console.log(error);
    });

    //地图加载完成事件
    map.on('loadComplete', function() {
      console.log('地图加载完成！');
      //显示按钮
      // document.getElementById('btnsGroup').style.display = 'block';
    });
  }

  render() {
    return <div className={styles.container} id="fengMap" />;
  }
}
