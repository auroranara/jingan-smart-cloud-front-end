import React, { PureComponent } from 'react';
import { Map as GDMap, Marker } from 'react-amap';
import { Button, Icon } from 'antd';
import FcSection from './FcSection';
import styles from './FireControlMap.less';
import MapSearch from './components/MapSearch';

const { location } = global.PROJECT_CONFIG;

export default class FireControlMap extends PureComponent {
  state = {
    center: [location.x, location.y],
    zoom: location.zoom,
    selected: undefined,
  };

  back = () => {
    this.setState({ zoom: location.zoom, selected: undefined });
  };

  selectCompany = item => {
    const { latitude, longitude } = item;
    this.setState({
      center: [longitude, latitude],
      zoom: 18,
      selected: item,
    });
  };
  // 搜索之后跳转
  handleSelect = item => {
    this.selectCompany(item);
  };

  // 点击
  handleClick = item => {
    this.selectCompany(item);
  };

  renderMarker = item => {
    return (
      <Marker
        position={{ longitude: item.longitude, latitude: item.latitude }}
        key={item.id}
        offset={[-13, -34]}
        events={{
          click: this.handleClick.bind(this, item),
        }}
      >
        <img
          src="http://data.jingan-china.cn/v2/big-platform/fire-control/gov/mapDot.png"
          alt=""
          style={{ display: 'block', width: '26px', height: '34px' }}
        />
      </Marker>
    );
  };

  renderCompanyMarker() {
    const {
      map: { companyBasicInfoList },
    } = this.props;
    const { selected } = this.state;
    // 如果有选中的企业就只渲染选中的
    return selected
      ? this.renderMarker(selected)
      : companyBasicInfoList.map(item => this.renderMarker(item));
  }
  render() {
    const { center, zoom, selected } = this.state;
    const {
      map: { companyBasicInfoList, totalNum, fireNum },
    } = this.props;
    return (
      <FcSection style={{ padding: 8 }} className={styles.map}>
        <div className={styles.mapContainer}>
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
          {selected && (
            <Button
              onClick={this.back}
              style={{
                background: 'rgba(1, 39, 79, 0.8)',
                border: 'none',
                color: '#009eff',
                width: '80',
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 666,
              }}
            >
              <Icon type="rollback" />
              返回
            </Button>
          )}
          <ul className={styles.mapLegend}>
            <li>
              单位总数：
              {totalNum}
            </li>
            <li>
              报警单位：
              {fireNum}
            </li>
          </ul>
        </div>
      </FcSection>
    );
  }
}
