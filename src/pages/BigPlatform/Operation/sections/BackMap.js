import React, { Fragment, PureComponent } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Map as GDMap, InfoWindow, Markers, Marker } from 'react-amap';
import styles from './BackMap.less';
import { DeviceBar, InfoStatus, MapLegend, MapTypeBar, OvSelect } from '../components/Components';

import iconAddress from '@/pages/BigPlatform/Smoke/BackMap/imgs/icon-address.png';
import iconMan from '@/pages/BigPlatform/Smoke/BackMap/imgs/icon-man.png';
import {
  dotElecGreen,
  dotElecGrey,
  dotElecRed,
  dotGasGreen,
  dotGasGrey,
  dotGasRed,
  dotGasYellow,
  dotGreen,
  dotRed,
  dotHostGreen,
  dotHostRed,
  dotHostYellow,
  dotSmokeGreen,
  dotSmokeRed,
  dotSmokeYellow,
  dotSmokeGrey,
  dotWaterGreen,
  dotWaterGrey,
  dotWaterRed,
  dotWaterYellow,
} from '../imgs/links';
import { BAR_COLORS, COUNT_BASE_KEY, COUNT_KEYS, COUNT_LABELS, MAP_THEMES as THEMES, TYPE_KEYS, TYPE_COUNTS, getMapLegendData, getMapItemStatus, sortUnits } from '../utils';

const IMGS = [
  [dotGreen, dotRed],
  [dotHostGreen, dotHostRed, dotHostYellow],
  [dotSmokeGreen, dotSmokeRed, dotSmokeYellow, dotSmokeGrey],
  [dotElecGreen, dotElecRed, '', dotElecGrey],
  [dotGasGreen, dotGasRed, dotGasYellow, dotGasGrey],
  [dotWaterGreen, dotWaterRed, dotWaterYellow, dotWaterGrey],
];

const { region } = global.PROJECT_CONFIG;
const zooms = [3, 20];
let fitView = true;
const INIT_INFO = {
  companyId: '',
  companyName: '',
  address: '',
  longitude: 120.366011,
  latitude: 31.544389,
  saferName: '',
  saferPhone: '',
};

const MAP_CSS_IDS = ['2e4b83bf089a6c075c0bea7b3ac22e25', 'b9d9da96da6ba2487d60019876b26fc5'];

export default class MapSection extends PureComponent {
  state = {
    infoWindowShow: false,
    infoWindow: INIT_INFO,
    mapStyleType: 0,
  };

  componentDidMount() {
    this.props.onRef(this);
    const isWine = global.PROJECT_CONFIG.projectShortName === '智慧消防云'; // 是否泸州
    if (!isWine)
      this.setState({ mapStyleType: 1 });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { units } = this.props;
    const { units: prevUnits } = prevProps;
    const { infoWindowShow, infoWindow } = this.state;

    if (units !== prevUnits && infoWindowShow) {
      const { companyId } = infoWindow;
      this.setState({
        infoWindow: { ...infoWindow, ...units.find(item => item.companyId === companyId) },
      });
    }
    // if (JSON.stringify(units) !== JSON.stringify(prevUnits) && infoWindowShow) {
    //   const { companyId } = infoWindow;
    //   this.setState({
    //     infoWindow: { ...infoWindow, ...units.find(item => item.companyId === companyId) },
    //   });
    // }
  }

  renderMarkers = lvl => {
    const {
      units = [],
      aggUnits,
      // unitDetail: { companyId: selectedCompanyId } = {},
      unitDetail: { key: selectedKey },
    } = this.props;
    if (units.length === 0) {
      if (this.mapInstance) this.mapInstance.setCity(region);
    }
    // const newUnits = sortUnits(units, deviceType);
    const markers = aggUnits.map(item => {
      return {
        ...item,
        position: {
          longitude: item.longitude,
          latitude: item.latitude,
        },
        // zIndex: selectedCompanyId === item.companyId ? 999 : 100,
        zIndex: selectedKey === item.key,
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
    const { deviceType, unitSelected, handleMapClick, showTooltip, showUnitListDrawer, hideTooltip } = this.props;
    // const { companyName, companyId } = extData;
    // const status = getMapItemStatus(extData, deviceType);
    // const imgSrc = IMGS[deviceType][status];
    const { key, list, icon } = extData;
    const isSingle = list.length === 1;
    const { companyName } = list[0];
    const iconIndex = unitSelected ? unitSelected.icons[deviceType] : icon;
    // console.log(unitSelected);
    const imgSrc = IMGS[deviceType][iconIndex];

    const handleClick = e => {
      handleMapClick(extData);
      hideTooltip();
      if (!isSingle)
        showUnitListDrawer(1);
    };

    return (
      <div
        style={{ position: 'relative' }}
        // className={status ? styles.imgAnimate : styles.imgContainer}
        className={styles.imgContainer}
        key={key}
      >
        <img
          src={imgSrc}
          alt="dot"
          className={styles.dot}
          // style={{ display: 'block', width: '32px', height: '42px' }}
          onClick={handleClick}
          onMouseEnter={isSingle ? e => showTooltip(e, companyName) : null}
          onMouseLeave={isSingle ? hideTooltip : null}
        />
        {!unitSelected && !isSingle && <span className={styles.cyanDot}>{list.length}</span>}
      </div>
    );
  };

  handleMapClick = (extData, index) => { // showInfo不传，则为直接在地图上点击，根据长度判断是否显示，要显示，则传入true，不会传false
    const { list } = extData;
    const { infoWindowShow, infoWindow } = this.state;
    const notHasIndex = index === undefined;
    if (notHasIndex)
      index = 0;
    if (notHasIndex && list.length > 1) return;

    const companyInfo = list[index];
    if (notHasIndex && infoWindowShow && companyInfo.companyId === infoWindow.companyId) return;

    this.setState({
      infoWindowShow: true,
      infoWindow: companyInfo,
    });
  };

  // handleMapClick = extData => {
  //   if (extData.companyId === this.state.infoWindow.companyId && this.state.infoWindowShow) return;
  //   this.setState({
  //     infoWindowShow: true,
  //     infoWindow: {
  //       ...extData,
  //     },
  //   });
  // };

  // renderTips = () => {
  //   const { units = [], alarmIds = [], handleAlarmClick } = this.props;
  //   const tips = alarmIds.map(data => {
  //     return {
  //       ...units.find(item => item.companyId === data.companyId),
  //       messageFlag: data.messageFlag,
  //     };
  //   });
  //   return tips.map((item, index) => {
  //     return item.unnormal > 0 ? (
  //       <Marker
  //         key={index}
  //         offset={[-100, -72]}
  //         position={[item.longitude, item.latitude]}
  //         zIndex={1000}
  //         extData={item}
  //         events={{
  //           click: e => {
  //             const { messageFlag, companyId, companyName } = item;
  //             handleAlarmClick(messageFlag, companyId, companyName);
  //             const newIds = [...alarmIds.slice(0, index), ...alarmIds.slice(index + 1)];
  //             this.props.handleParentChange({ alarmIds: newIds });
  //           },
  //         }}
  //         render={() => {
  //           return (
  //             <div className={styles.alarmTip}>
  //               有一条火警信息！
  //               <span className={styles.tipMore}>详情>></span>
  //             </div>
  //           );
  //         }}
  //       />
  //     ) : null;
  //   });
  // };

  // 弹窗渲染
  renderInfoWindow = () => {
    const { deviceType, handleCompanyClick, handleAlarmClick, handleFaultClick } = this.props;
    const {
      infoWindowShow,
      infoWindow,
    } = this.state;

    const {
      companyId,
      companyName,
      address,
      longitude,
      latitude,
      saferName,
      saferPhone,
    } = infoWindow;

    const typeKey = `${TYPE_KEYS[deviceType]}${COUNT_BASE_KEY}`;
    const typeCount = TYPE_COUNTS[deviceType];
    const statuses = COUNT_KEYS.slice(1).map(key => {
      const value = infoWindow[`${typeKey}For${key}`];
      return value ? +value : 0;
    });
    const bar = (
      <div className={styles.statusWrapper}>
        {statuses.map((n, i) => {
          const label = COUNT_LABELS[i + 1];
          if (typeCount[i + 1])
            return (
              <div key={label} className={styles.statusItem}>
                <span className={styles.statusIcon} style={{ backgroundColor: BAR_COLORS[i] }} />
                {label} {n}
              </div>
            );
          return null;
        })}
      </div>
    );

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
            onClick={() => { handleCompanyClick(companyId); }}
          >
            {companyName}
          </h3>
          <div className={styles.info}>
            <span
              className={styles.infoIcon}
              style={{ backgroundImage: `url(${iconAddress})` }}
            />
            {address}
          </div>
          <div className={styles.info}>
            <span
              className={styles.infoIcon}
              style={{ backgroundImage: `url(${iconMan})` }}
            />
            {saferName}
            {saferPhone && (
              <span
                className={styles.saferPhone}
              >
                {saferPhone}
              </span>
            )}
            {!saferName && !saferPhone && <span>暂无数据</span>}
          </div>
          {deviceType ? bar : <InfoStatus data={infoWindow} />}
        </div>
        <LegacyIcon
          type="close"
          onClick={this.handleHideInfoWindow}
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

  handleHideInfoWindow = e => {
    const { clearUnitSelected } = this.props;
    this.setState({ infoWindowShow: false });
    clearUnitSelected();
  };

  onDeviceTypeChange = v => {
    const { handleDeviceTypeChange } = this.props;
    handleDeviceTypeChange(v, (isInList, isDetailExist) => {
      setTimeout(() => this.reset(), 100);
      // if (!isInList)
      //   this.setState({ infoWindowShow: false });
    });
  };

  reset = e => {
    this.mapInstance.setFitView(
      this.mapInstance.getAllOverlays().filter(d => d.CLASS_NAME === 'AMap.Marker')
    );
    this.setState({ infoWindowShow: false });
  };

  handleMapStyleChange = value => {
    this.setState({ mapStyleType: value });
  };

  render() {
    const { deviceType, handleParentChange, units, unitLists, showUnitListDrawer } = this.props;
    const { mapStyleType } = this.state;
    const mapLegendData = getMapLegendData(units, deviceType);
    const nums = unitLists.map(list => list.length);
    const theme = (
      <div className={styles.theme}>
        <OvSelect cssType="3" options={THEMES} value={mapStyleType} handleChange={this.handleMapStyleChange} />
      </div>
    );
    const resetBtn = (
      <div
        className={styles.allPoint}
        onClick={this.reset}
      >
        <LegacyIcon type="reload" theme="outlined" style={{ marginRight: '3px' }} />
        重置
      </div>
    );
    const listBtn = (
      <div className={styles.listBtn} onClick={e => showUnitListDrawer()}>
        单位列表
      </div>
    );



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
          mapStyle={`amap://styles/${MAP_CSS_IDS[mapStyleType]}`}
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
          {/* {this.renderTips()} */}
          <MapTypeBar />
          {theme}
          {resetBtn}
          {listBtn}
        </GDMap>
        <DeviceBar type={deviceType} nums={nums} ignore={[]} handleClick={this.onDeviceTypeChange} />
        <MapLegend type={deviceType} data={mapLegendData} />
      </div>
    );
  }
}
