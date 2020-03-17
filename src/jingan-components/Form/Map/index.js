import React, { Component } from 'react';
import styles from './index.less';
const Map = fengmap; // eslint-disable-line

export default class FormMap extends Component {
  state = {
    map: undefined,
  };

  componentDidMount() {
    const { options } = this.props;
    const { key, appName, mapId } = options || {};
    if (key && appName && mapId) {
      this.openMap();
    }
  }

  componentDidUpdate({
    options: prevOptions,
    imageMarkerList: prevImageMarkerList,
    polygonMarkerList: prevPolygonMarkerList,
  }) {
    const { options, imageMarkerList, polygonMarkerList } = this.props;
    const { map } = this.state;
    const { key: prevKey, appName: prevAppName, mapId: prevMapId } = prevOptions || {};
    const { key, appName, mapId } = options || {};
    if (key !== prevKey || appName !== prevAppName || mapId !== prevMapId) {
      if (key && appName) {
        if (map) {
          this.closeMap();
          this.openMap();
        } else {
          this.openMap();
        }
      } else if (map) {
        this.closeMap();
      }
    } else if (map) {
      const group = map.getFMGroup(map.focusGroupID);
      if (imageMarkerList !== prevImageMarkerList) {
        const layer = group.getOrCreateLayer('imageMarker');
        layer.removeAll();
        imageMarkerList &&
          imageMarkerList.every(
            this.renderImageMarker.bind(this, group.getOrCreateLayer('imageMarker'))
          );
      }
      if (polygonMarkerList !== prevPolygonMarkerList) {
        const layer = group.getOrCreateLayer('polygonMarker');
        layer.removeAll();
        polygonMarkerList &&
          polygonMarkerList.every(
            this.renderPolygonMarker.bind(this, group.getOrCreateLayer('polygonMarker'))
          );
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.options !== this.props.options ||
      nextProps.value !== this.props.value ||
      nextProps.imageMarkerList !== this.props.imageMarkerList ||
      nextProps.polygonMarkerList !== this.props.polygonMarkerList ||
      nextState !== this.state
    );
  }

  // 打开地图
  openMap = () => {
    const { options, imageMarkerList, polygonMarkerList } = this.props;
    const { key, appName, mapId, theme } = options;
    const mapOptions = new Map.MapOptions({
      key,
      appName,
      container: document.getElementById('mapContainer'),
      mapServerURL: './data/' + mapId,
      theme: theme || '2001',
    });
    const map = new Map.FMMap(mapOptions);
    map.openMapById(mapId, error => {
      console.log(error);
    });
    map.on('loadComplete', () => {
      const group = map.getFMGroup(map.focusGroupID);
      this.renderFloorContorl(map);
      imageMarkerList &&
        imageMarkerList.every(
          this.renderImageMarker.bind(this, group.getOrCreateLayer('imageMarker'))
        );
      polygonMarkerList &&
        polygonMarkerList.every(
          this.renderPolygonMarker.bind(this, group.getOrCreateLayer('polygonMarker'))
        );
      this.setState({
        map,
      });
    });
    map.on('mapClickNode', e => {
      console.log({ mapClickNode: e });
    });
    console.log(Map);
    console.log(map);
  };

  // 关闭地图
  closeMap = () => {
    const { map } = this.state;
    map.dispose();
    this.setState({
      map: undefined,
    });
  };

  // 加载楼层切换控件
  renderFloorContorl(map) {
    const options = new Map.controlOptions({
      position: Map.controlPositon.LEFT_TOP,
      offset: {
        x: 0,
        y: 0,
      },
    });
    const floorControl = new Map.buttonGroupsControl(map, options);
    floorControl.expand = true;
    floorControl.onChange(e => {
      console.log({ change: e });
    });
  }

  renderImageMarker(layer, data) {
    const marker = new Map.FMImageMarker({
      ...data,
    });
    layer.add(marker);
  }

  renderPolygonMarker(layer, data) {
    const marker = new Map.FMPolygonMarker({
      ...data,
    });
    layer.add(marker);
  }

  render() {
    const { children } = this.props;
    const { map } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.map} id="mapContainer" />
        {map && children}
      </div>
    );
  }
}
