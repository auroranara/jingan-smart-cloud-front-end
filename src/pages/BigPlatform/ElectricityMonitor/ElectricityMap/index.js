import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { Map as GDMap, InfoWindow, Markers } from 'react-amap';
import styles from './index.less';
import MapTypeBar from './MapTypeBar';

import pointNormal from './imgs/point-normal.png';
import pointAlarm from './imgs/point-alarm.png';
import pointPreAlarm from './imgs/point-preAlarm.png';
import iconAddress from './imgs/icon-address.png';
import iconMan from './imgs/icon-man.png';

const { region } = global.PROJECT_CONFIG;
const zooms = [3, 20];
let fitView = true;

function MapLegend(props) {
  return (
    <div className={styles.mapLegend}>
      <div className={styles.legendItem}>
        <div className={styles.legendIcon}>
          <div className={styles.legendColor} style={{ backgroundColor: '#37a460' }} />
        </div>
        正常单位
      </div>
      <div className={styles.legendItem}>
        <div className={styles.legendIcon}>
          <div className={styles.legendColor} style={{ backgroundColor: '#f83329' }} />
        </div>
        告警单位
      </div>
      <div className={styles.legendItem}>
        <div className={styles.legendIcon}>
          <div className={styles.legendColor} style={{ backgroundColor: '#ffb400' }} />
        </div>
        预警单位
      </div>
    </div>
  );
}
export default class MapSection extends PureComponent {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     searchValue: '',
  //     legendActive: null,
  //     filter: 'All',
  //     infoWindowShow: false,
  //     infoWindow: {
  //       companyId: '',
  //       companyName: '',
  //       level: '',
  //       address: '',
  //       longitude: 120.366011,
  //       latitude: 31.544389,
  //     },
  //     tooltipName: '',
  //     tooltipVisible: false,
  //     tooltipPosition: [0, 0],
  //   };
  //   this.infoWindow = { longitude: 0, latitude: 0 };
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   console.log('prevProps', prevProps);
  //   console.log('props', this.props);
  // }

  renderMarkers = lvl => {
    const {
      // mapData: { units = [] },
      units = [],
      unitDetail: { companyId: selectedCompanyId } = {},
    } = this.props;

    if (units.length === 0) {
      if (this.mapInstance) this.mapInstance.setCity(region);
    }
    const markers = units.map(item => {
      return {
        ...item,
        position: {
          longitude: item.longitude,
          latitude: item.latitude,
        },
        zIndex: selectedCompanyId === item.comapnyId ? 999 : 100,
      };
    });

    return (
      <Markers
        markers={markers}
        offset={[-15, -42]}
        events={{
          click: (e, marker) => {
            const extData = marker.getExtData();
            this.props.handleMapClick(extData);
          },
          created: () => {
            if (fitView) {
              this.mapInstance.on('complete', () => {
                this.mapInstance.setFitView(
                  this.mapInstance.getAllOverlays().filter(d => d.CLASS_NAME === 'AMap.Marker')
                );
              });
            }
            fitView = false;
          },
        }}
        render={this.renderMarkerLayout}
      />
    );
  };

  renderMarkerLayout = extData => {
    const { status, companyName, companyId } = extData;

    return (
      <div
        onMouseEnter={e => {
          if (this.target === e.target) return;
          this.target = e.target;
          this.props.showTooltip(e, companyName);
        }}
        onMouseLeave={this.props.hideTooltip}
      >
        {(+status === 0 || +status === -1) && (
          <img
            src={pointNormal}
            alt=""
            style={{ display: 'block', width: '32px', height: '42px' }}
          />
        )}
        {+status === 1 && (
          <img
            src={pointPreAlarm}
            alt=""
            style={{ display: 'block', width: '32px', height: '42px' }}
          />
        )}
        {+status === 2 && (
          <img
            src={pointAlarm}
            alt=""
            style={{ display: 'block', width: '32px', height: '42px' }}
          />
        )}
      </div>
    );
  };

  // 弹窗渲染
  renderInfoWindow = () => {
    const {
      infoWindowShow,
      infoWindow: { address, aqy1Name, aqy1Phone, companyName, comapnyId, longitude, latitude },
      handleParentChange,
      deviceStatusCount: { count, normal, earlyWarning, confirmWarning, unconnect },
    } = this.props;

    return (
      <InfoWindow
        position={{ longitude, latitude }}
        offset={[175, 110]}
        isCustom={false}
        autoMove={true}
        visible={infoWindowShow}
      >
        <div className={styles.comapnyWrapper}>
          <h3 className={styles.comapnyName}>{companyName}</h3>
          <div className={styles.info}>
            <span
              className={styles.infoIcon}
              style={{
                background: `url(${iconAddress}) no-repeat center center`,
                backgroundSize: '100% 100%',
              }}
            />
            {address}
          </div>
          <div className={styles.info}>
            <span
              className={styles.infoIcon}
              style={{
                background: `url(${iconMan}) no-repeat center center`,
                backgroundSize: '100% 100%',
              }}
            />
            {aqy1Name}
            <span style={{ marginLeft: '10px' }}>{aqy1Phone}</span>
          </div>
          <div style={{ borderTop: '1px solid #474747', margin: '8px 0', paddingTop: '8px' }}>
            设备数量 {count}
          </div>
          <div className={styles.statusWrapper}>
            <div className={styles.statusItem}>
              <span className={styles.statusIcon} style={{ backgroundColor: '#37a460' }} />
              正常 {normal}
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusIcon} style={{ backgroundColor: '#f83329' }} />
              告警 {confirmWarning}
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusIcon} style={{ backgroundColor: '#ffb400' }} />
              预警 {earlyWarning}
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusIcon} style={{ backgroundColor: '#9f9f9f' }} />
              失联 {unconnect}
            </div>
          </div>
        </div>
        <Icon
          type="close"
          onClick={() => {
            handleParentChange({ infoWindowShow: false });
          }}
          style={{
            color: '#FFF',
            position: 'absolute',
            right: 10,
            top: 10,
            cursor: 'pointer',
          }}
        />
      </InfoWindow>
    );
  };

  handleHideInfoWindow = () => {
    this.props.handleHideInfoWindow();
  };

  render() {
    const { handleParentChange } = this.props;

    return (
      <div className={styles.mapContainer}>
        <GDMap
          version={'1.4.10'}
          amapkey="665bd904a802559d49a33335f1e4aa0d"
          viewMode="3D"
          plugins={[
            { name: 'Scale', options: { locate: false } },
            { name: 'ToolBar', options: { locate: false } },
            { name: 'ControlBar' },
          ]}
          status={{
            keyboardEnable: false,
          }}
          useAMapUI
          pitch={60}
          mapStyle="amap://styles/b9d9da96da6ba2487d60019876b26fc5"
          expandZoomRange
          zooms={zooms}
          events={{
            created: mapInstance => {
              this.mapInstance = mapInstance;
              handleParentChange({ mapInstance });
            },
          }}
        >
          {/* {this.renderInfoWindow()} */}
          {this.renderMarkers()}
          <MapTypeBar />
          <div
            className={styles.allPoint}
            onClick={() => {
              this.mapInstance.setFitView(
                this.mapInstance.getAllOverlays().filter(d => d.CLASS_NAME === 'AMap.Marker')
              );
            }}
          >
            <Icon type="reload" theme="outlined" style={{ marginRight: '3px' }} />
            重置
          </div>
        </GDMap>

        <MapLegend />
      </div>
    );
  }
}
