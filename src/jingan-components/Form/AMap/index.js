import React, { Component } from 'react';
import { Map, Marker } from 'react-amap';
import styles from './index.less';

export default class AMap extends Component {
  render() {
    const {
      // 覆盖物列表
      markerList,
      ...props
    } = this.props;
    console.log(markerList);

    return (
      <Map
        amapkey="08390761c9e9bcedbdb2f18a2a815541"
        plugins={['Scale', { name: 'ToolBar', options: { locate: false } }]}
        {...props}
      >
        {markerList && markerList.map(item => <Marker {...item} />)}
      </Map>
    );
  }
}
