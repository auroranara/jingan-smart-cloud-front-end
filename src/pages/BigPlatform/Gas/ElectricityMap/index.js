import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { Map as GDMap, InfoWindow, Markers, Marker } from 'react-amap';
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
        ...{ zIndex: item.companyId === 'DccBRhlrSiu9gMV7fmvizw' ? 998 : 100 },
      };
    });

    return (
      <Markers
        markers={markers}
        offset={[-15, -42]}
        events={{
          // click: (e, marker) => {
          //   const extData = marker.getExtData();
          //   // this.props.handleMapClick(extData);
          //   this.props.handleMapClick(extData.companyId, extData);
          //   this.props.hideTooltip();
          // },
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
    let imgSrc = pointNormal;
    if (+status === 0 || +status === -1) {
      imgSrc = pointNormal;
    } else if (+status === 1) {
      imgSrc = pointPreAlarm;
    } else if (+status === 2) {
      imgSrc = pointAlarm;
    }
    return (
      // <div style={{ position: 'relative', width: 0, height: 0 }}>
      <div style={{ position: 'relative' }}>
        {/* {companyId === 'DccBRhlrSiu9gMV7fmvizw' && (
          <div
            className={styles.alarmTip}
            onMouseEnter={e => {
              if (this.targetTip === e.target) return;
              this.targetTip = e.target;
              this.props.showTooltip(e, companyName);
            }}
            onMouseLeave={this.props.hideTooltip}
          >
            有一条报警信息！
            <span className={styles.tipMore}>详情>></span>
          </div>
        )} */}

        <img
          src={imgSrc}
          alt=""
          style={{ display: 'block', width: '32px', height: '42px' }}
          onClick={() => {
            // const extData = marker.getExtData();
            // this.props.handleMapClick(extData);
            this.props.handleMapClick(extData.companyId, extData);
            this.props.hideTooltip();
          }}
          onMouseEnter={e => {
            if (this.target === e.target) return;
            this.target = e.target;
            this.props.showTooltip(e, companyName);
          }}
          onMouseLeave={this.props.hideTooltip}
        />
      </div>
    );
  };

  renderTips = () => {
    const { units = [], alarmIds = [] } = this.props;
    // const tips = units.filter(item => item.companyId === 'DccBRhlrSiu9gMV7fmvizw');
    const tips = alarmIds.map(id => {
      return units.find(item => item.companyId === id);
    });
    return tips.map((item, index) => {
      return (
        <Marker
          offset={[-100, -72]}
          position={[item.longitude, item.latitude]}
          zIndex={1000}
          extData={item}
          events={{
            click: e => {
              console.log('e', e);
              const newIds = [...alarmIds];
              newIds.splice(index, 1);
              this.props.handleParentChange({ maintenanceDrawerVisible: true, alarmIds: newIds });
            },
          }}
          render={() => {
            return (
              <div className={styles.alarmTip}>
                有一条报警信息！
                <span className={styles.tipMore}>详情>></span>
              </div>
            );
          }}
        />
      );
    });
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
        offset={[175, 120]}
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
          {this.renderInfoWindow()}
          {this.renderMarkers()}
          {this.renderTips()}
          <MapTypeBar />
          <div
            className={styles.allPoint}
            onClick={() => {
              this.mapInstance.setFitView(
                this.mapInstance.getAllOverlays().filter(d => d.CLASS_NAME === 'AMap.Marker')
              );
              handleParentChange({ infoWindowShow: false });
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
