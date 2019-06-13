import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { Map as GDMap, InfoWindow, Markers, Marker } from 'react-amap';
import styles from './BackMap.less';
import { MapLegend, MapTypeBar } from '../components/Components';

import iconAddress from '@/pages/BigPlatform/Smoke/BackMap/imgs/icon-address.png';
import iconMan from '@/pages/BigPlatform/Smoke/BackMap/imgs/icon-man.png';
import { pointNormal, pointAlarm, pointPreAlarm } from '../imgs/links';

const { region } = global.PROJECT_CONFIG;
const zooms = [3, 20];
let fitView = true;

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

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { units } = this.props;
    const { units: prevUnits } = prevProps;
    const { infoWindowShow, infoWindow } = this.state;
    if (JSON.stringify(units) !== JSON.stringify(prevUnits) && infoWindowShow) {
      const { companyId } = infoWindow;
      this.setState({
        infoWindow: { ...infoWindow, ...units.find(item => item.companyId === companyId) },
      });
    }
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
    const { companyName, companyId, unnormal, faultNum } = extData;
    let imgSrc = pointNormal;

    if (+unnormal > 0) {
      imgSrc = pointAlarm;
    } else if (+faultNum > 0) {
      imgSrc = pointPreAlarm;
    } else {
      imgSrc = pointNormal;
    }
    return (
      <div
        style={{ position: 'relative' }}
        className={+unnormal > 0 ? styles.imgAnimate : styles.imgContainer}
        key={companyId}
      >
        <img
          src={imgSrc}
          alt=""
          style={{ display: 'block', width: '32px', height: '42px' }}
          onClick={() => {
            this.props.handleMapClick(extData);
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
    const { fetchMapInfo } = this.props;
    // clearPollingMap();
    // pollingMap();
    fetchMapInfo();
    this.setState({
      infoWindowShow: true,
      infoWindow: {
        ...extData,
      },
    });
  };

  renderTips = () => {
    const { units = [], alarmIds = [], handleAlarmClick } = this.props;
    const tips = alarmIds.map(data => {
      return {
        ...units.find(item => item.companyId === data.companyId),
        messageFlag: data.messageFlag,
      };
    });
    return tips.map((item, index) => {
      return item.unnormal > 0 ? (
        <Marker
          key={index}
          offset={[-100, -72]}
          position={[item.longitude, item.latitude]}
          zIndex={1000}
          extData={item}
          events={{
            click: e => {
              const { messageFlag, companyId, companyName } = item;
              handleAlarmClick(messageFlag, companyId, companyName);
              const newIds = [...alarmIds.slice(0, index), ...alarmIds.slice(index + 1)];
              this.props.handleParentChange({ alarmIds: newIds });
            },
          }}
          render={() => {
            return (
              <div className={styles.alarmTip}>
                有一条火警信息！
                <span className={styles.tipMore}>详情>></span>
              </div>
            );
          }}
        />
      ) : null;
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
      },
    } = this.state;
    const { handleAlarmClick, handleCompanyClick, handleFaultClick } = this.props;
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
          <h3
            className={styles.comapnyName}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              handleCompanyClick(companyId);
            }}
          >
            {companyName}
          </h3>
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
              onClick={() => {
                if (+unnormal > 0) {
                  handleAlarmClick(undefined, companyId, companyName, +unnormal);
                } else {
                  return null;
                }
              }}
            >
              <span className={styles.statusIcon} style={{ backgroundColor: '#f83329' }} />
              火警 {unnormal > 0 ? unnormal : 0}
            </div>
            <div
              className={+faultNum > 0 ? styles.itemActive : styles.statusItem}
              onClick={() => {
                if (+faultNum > 0) {
                  handleFaultClick(undefined, companyId, companyName, +faultNum);
                } else {
                  return null;
                }
              }}
            >
              <span className={styles.statusIcon} style={{ backgroundColor: '#ffb400' }} />
              故障 {faultNum}
            </div>
          </div>
        </div>
        <Icon
          type="close"
          onClick={() => {
            // const { clearPollingMap } = this.props;
            // clearPollingMap();
            this.setState({ infoWindowShow: false });
          }}
          style={{
            color: '#FFF',
            position: 'absolute',
            right: 10,
            top: 10,
            cursor: 'pointer',
            fontSize: '16px',
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
          pitch={60}
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
        <MapLegend data={{ abnormal: 10, normal: 5 }} />
      </div>
    );
  }
}
