import React, { PureComponent, Fragment } from 'react';
// 引入样式文件
import styles from './Map.less';

const ESMap = esmap; // eslint-disable-line
const ES_MAP_ID = 'q3swlr9d__j6b3j8';
export default class Map extends PureComponent {
  state = {};

  componentDidMount() {
    this.initMap(true);
  }

  initMap(is3D) {
    var container = document.getElementById('es-map-container');
    container.innerHTML = '';
    this.map = new ESMap.ESMap({
      container: container, //渲染dom
      defaultScaleLevel: 7,
      token: 'jingan',
      viewMode: is3D ? ESMap.ESViewMode.MODE_3D : ESMap.ESViewMode.MODE_2D,
    });
    this.map.openMapById(ES_MAP_ID);
    this.map.showScaler = false; //显示地图比例尺
  }

  render() {
    return <div className={styles.container} id="es-map-container" />;
  }
}
