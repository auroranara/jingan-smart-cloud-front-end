import React, { Component } from 'react';
import styles from './index.less';
const Map = fengmap; // eslint-disable-line

export default class FormMap extends Component {
  map = null;

  componentDidMount() {
    const { options } = this.props;
    const { key, appName } = options || {};
    if (key && appName) {
      this.openMap();
    }
  }

  componentDidUpdate({ options: prevOptions }) {
    const { options } = this.props;
    const { key: prevKey, appName: prevAppName } = prevOptions || {};
    const { key, appName } = options || {};
    if (key !== prevKey || appName !== prevAppName) {
      if (key && appName) {
        if (this.map) {
          this.closeMap();
          this.openMap();
        } else {
          this.openMap();
        }
      } else if (this.map) {
        this.closeMap();
      }
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.options !== this.props.options || nextProps.value !== this.props.value;
  }

  // 打开地图
  openMap = () => {
    const { options } = this.props;
    const { key, appName, mapId } = options;
    const mapOptions = {
      key,
      appName,
      container: document.getElementById('mapContainer'),
    };
    const map = new Map.FMMap(mapOptions);
    this.map = map;
    map.openMapById(mapId, error => {
      console.log(error);
    });
    map.on('loadComplete', () => {
      this.loadFloorContorl();
    });
    map.on('mapClickNode', e => {
      console.log({ mapClickNode: e });
    });
    console.log(Map);
    console.log(this.map);
  };

  // 关闭地图
  closeMap = () => {
    this.map.dispose();
    this.map = null;
  };

  // 加载楼层切换控件
  loadFloorContorl = () => {
    console.log(this.map);
    const options = new Map.controlOptions({
      position: Map.controlPositon.LEFT_TOP,
      offset: {
        x: 20,
        y: 20,
      },
    });
    const floorControl = new Map.buttonGroupsControl(this.map, options);
    floorControl.expand = true;
    floorControl.onChange(e => {
      console.log({ change: e });
    });
  };

  render() {
    return <div className={styles.container} id="mapContainer" />;
  }
}
