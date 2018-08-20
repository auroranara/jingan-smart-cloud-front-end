import React, { PureComponent } from 'react';
import { Map as GDMap, Marker } from 'react-amap';
import styles from './FireControlMap.less';
import MapSearch from './MapSearch';

const { location } = global.PROJECT_CONFIG;

export default class FireControlMap extends PureComponent {
  state = {
    center: [location.x, location.y],
    zoom: location.zoom,
  };

  // 搜索之后跳转
  handleSelect = ({ latitude, longitude, id }) => {
    this.setState({
      center: [longitude, latitude],
      zoom: 18,
    });
  };

  renderCompanyMarker() {
    const {
      map: { companyBasicInfoList, totalNum },
    } = this.props;
    return companyBasicInfoList.map(item => {
      return (
        item.longitude &&
        item.latitude && (
          <Marker
            position={{ longitude: item.longitude, latitude: item.latitude }}
            key={item.id}
            offset={[-13, -34]}
          >
            <img
              src="http://data.jingan-china.cn/v2/big-platform/fire-control/gov/mapDot.png"
              alt=""
              style={{ display: 'block', width: '26px', height: '34px' }}
            />
          </Marker>
        )
      );
    });
  }
  render() {
    const { center, zoom } = this.state;
    const {
      map: { companyBasicInfoList },
    } = this.props;
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <GDMap
          amapkey="665bd904a802559d49a33335f1e4aa0d"
          plugins={[
            { name: 'Scale', options: { locate: false } },
            { name: 'ToolBar', options: { locate: false } },
          ]}
          status={{
            keyboardEnable: false,
          }}
          useAMapUI
          mapStyle="amap://styles/88a73b344f8608540c84a2d7acd75f18"
          center={center}
          zoom={zoom}
        >
          {this.renderCompanyMarker()}
        </GDMap>
        <MapSearch
          style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 666 }}
          list={companyBasicInfoList}
          handleSelect={this.handleSelect}
        />
      </div>
    );
  }
}
