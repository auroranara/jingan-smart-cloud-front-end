import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { Map as GDMap, InfoWindow, Markers, Marker } from 'react-amap';
import styles from './index.less';
import MapTypeBar from './MapTypeBar';

import pointNormal from './imgs/point-normal.png';
import pointAlarm from './imgs/point-alarm.png';
// import pointPreAlarm from './imgs/point-preAlarm.png';
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
        报警单位
      </div>
      {/* <div className={styles.legendItem}>
        <div className={styles.legendIcon}>
          <div className={styles.legendColor} style={{ backgroundColor: '#ffb400' }} />
        </div>
        预警单位
      </div> */}
    </div>
  );
}
export default class MapSection extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      infoWindowShow: false,
      infoWindow: {
        companyId: '',
        companyName: '',
        principalName: '',
        principalPhone: '',
        count: 0,
        normal: 0,
        unnormal: 0,
        faultNum: 0,
        outContact: 0,
        address: '',
        longitude: 120.366011,
        latitude: 31.544389,
      },
    };
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  renderMarkers = lvl => {
    const { units = [], unitDetail: { companyId: selectedCompanyId } = {} } = this.props;
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
        zIndex: selectedCompanyId === item.companyId ? 999 : 100,
        // ...{ zIndex: item.companyId === 'DccBRhlrSiu9gMV7fmvizw' ? 998 : 100 },
      };
    });

    return (
      <Markers
        markers={markers}
        offset={[-15, -42]}
        events={{
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
    const { companyName, companyId, unnormal /* faultNum */ } = extData;
    let imgSrc = pointNormal;

    if (+unnormal > 0) {
      imgSrc = pointAlarm;
      // } else if (+faultNum > 0) {
      //   imgSrc = pointPreAlarm;
    } else {
      imgSrc = pointNormal;
    }
    return (
      <div style={{ position: 'relative' }} key={companyId}>
        <img
          src={imgSrc}
          alt=""
          style={{ display: 'block', width: '32px', height: '42px' }}
          onClick={() => {
            this.handleMapClick(extData);
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

  handleMapClick = extData => {
    if (extData.companyId === this.state.infoWindow.companyId && this.state.infoWindowShow) return;
    this.setState({
      infoWindowShow: true,
      infoWindow: {
        ...extData,
      },
    });
  };

  renderTips = () => {
    const { units = [], alarmIds = [] } = this.props;
    const tips = alarmIds.map(id => {
      return units.find(item => item.companyId === id);
    });
    return tips.map((item, index) => {
      return (
        <Marker
          key={index}
          offset={[-100, -72]}
          position={[item.longitude, item.latitude]}
          zIndex={1000}
          extData={item}
          events={{
            click: e => {
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
      infoWindow: {
        address,
        principalName,
        principalPhone,
        companyName,
        companyId,
        longitude,
        latitude,
        count,
        normal,
        unnormal,
        faultNum,
        outContact,
      },
    } = this.state;
    const { handleAlarmClick } = this.props;
    // const activeStyles = classNames(styles.statusItem, styles.itemActive);
    return (
      <InfoWindow
        position={{ longitude, latitude }}
        offset={[175, 125]}
        isCustom={false}
        autoMove={true}
        visible={infoWindowShow}
        key={companyId}
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
            {principalName}
            <span style={{ marginLeft: '10px' }}>{principalPhone}</span>
          </div>
          <div style={{ borderTop: '1px solid #474747', margin: '8px 0', paddingTop: '8px' }}>
            设备数量 {count}
          </div>
          <div className={styles.statusWrapper}>
            <div className={styles.statusItem}>
              <span className={styles.statusIcon} style={{ backgroundColor: '#37a460' }} />
              正常 {normal}
            </div>
            <div
              className={+unnormal > 0 ? styles.itemActive : styles.statusItem}
              onClick={() => handleAlarmClick(undefined, companyId, companyName)}
            >
              <span className={styles.statusIcon} style={{ backgroundColor: '#f83329' }} />
              报警 {unnormal}
            </div>
            <div className={+faultNum > 0 ? styles.itemActive : styles.statusItem}>
              <span className={styles.statusIcon} style={{ backgroundColor: '#ffb400' }} />
              故障 {faultNum}
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusIcon} style={{ backgroundColor: '#9f9f9f' }} />
              失联 {outContact}
            </div>
          </div>
        </div>
        <Icon
          type="close"
          onClick={() => {
            this.setState({ infoWindowShow: false });
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
              this.setState({ infoWindowShow: false });
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
