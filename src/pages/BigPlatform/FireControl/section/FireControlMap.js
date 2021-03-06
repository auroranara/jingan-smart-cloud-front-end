import React, { PureComponent } from 'react';
import { Map as GDMap, Marker, InfoWindow, Polygon } from 'react-amap';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button } from 'antd';
// import { Link } from 'dva/router';
import debounce from 'lodash/debounce';

import FcSection from './FcSection';
import styles from './FireControlMap.less';
import MapSearch from '../components/MapSearch';
import MapTypeBar from '../../Safety/Components/MapTypeBar';

import mapDot from '../img/mapDot.png';
import mapAlarmDot from '../img/mapAlarmDot.png';
import locateIcon from '../img/mapLocate.png';
import personIcon from '../img/mapPerson.png';
import statusIcon from '../img/mapFire.png';
import status1Icon from '../img/mapFire1.png';
// import redCircle from '../img/redCircle.png';
const { region } = global.PROJECT_CONFIG;
const NO_DATA = '暂无信息';
const ZOOMS = [3, 20];
// const { location } = global.PROJECT_CONFIG;

// 从实时火警中筛选并标记有火警的企业
function handleCompanyBasicInfoList(alarmList, companyList) {
  // 遍历companyList中的企业，若有火警则标记
  return companyList.map(item => {
    const { id } = item;
    const alarmed = alarmList.find(({ companyId }) => companyId === id);
    if (alarmed) return { address: alarmed.searchArea, ...item, isFire: true };
    return { ...item, isFire: false };
  });
}

// 从实时火警中统计出不重复企业的数量
function getFireNum(list) {
  return list.reduce((prev, next) => {
    const { companyId } = next;
    if (!prev.includes(companyId)) prev.push(companyId);
    return prev;
  }, []).length;
}

function genBackgrondStyle(url) {
  return { backgroundImage: `url(${url})` };
}

export default class FireControlMap extends PureComponent {
  constructor(props) {
    super(props);
    this.debouncedFetchData = debounce(this.searchFetchData, 500);
    this.state = {
      // center: [location.x, location.y],
      // zoom: location.zoom,
      // selected: undefined,
      // showInfo: false,
      status: {
        keyboardEnable: false,
        dragEnable: true,
      },
      searchValue: '',
      selectList: [],
    };
  }

  newList = [];

  back = isFire => {
    const { handleBack } = this.props;
    handleBack(isFire);

    this.setState({
      status: {
        dragEnable: true,
      },
      searchValue: '',
    });
  };

  selectCompany = item => {
    const { handleSelected } = this.props;
    // const { latitude, longitude } = item;

    handleSelected(item);

    // this.setState({
    //   center: [longitude, latitude],
    //   zoom: 18,
    //   selected: item,
    //   showInfo: true,
    // });
  };
  // 搜索之后跳转
  handleSelect = item => {
    this.selectCompany(item);
  };

  // 点击
  // 点击之后不可以拖拽
  handleClick = item => {
    const { hideTooltip } = this.props;
    hideTooltip();
    this.selectCompany(item);
    // this.setState(
    //   {
    //     status: { dragEnable: false },
    //   },
    //   () => {
    //     hideTooltip();
    //     this.selectCompany(item);
    //   }
    // );
  };

  renderMarker = (item, isLast) => {
    const { selected, showTooltip, hideTooltip } = this.props;
    const { name, isFire } = item;
    const isSelected = !!selected;

    const handleMouseEnter = e => showTooltip(e, name);

    // 默认情况，有火警且未被选中，不显示红圈
    let child = (
      <div
        className={styles.dotIcon}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={hideTooltip}
        style={{ backgroundImage: `url(${mapAlarmDot})` }}
      />
    );

    // 没有火警，不论选中不选中显示正常图标
    if (!isFire)
      child = (
        <div
          className={styles.dotIcon}
          onMouseEnter={isSelected ? null : handleMouseEnter}
          onMouseLeave={isSelected ? null : hideTooltip}
          style={{ backgroundImage: `url(${mapDot})` }}
        />
      );
    // 有火警，且被选中，显示红圈
    else if (isSelected)
      child = (
        // <div className={styles.redCircle} style={{ backgroundImage: `url(${redCircle})` }}>
        <div className={styles.redCircle}>
          <img className={styles.dotSelectedIcon} src={mapAlarmDot} alt="定位图标" />;
        </div>
      );

    return (
      <Marker
        // title={name}
        position={{ longitude: item.longitude, latitude: item.latitude }}
        key={item.id}
        offset={isFire && isSelected ? [-100, -122] : [-22, -45]}
        events={{
          click: this.handleClick.bind(this, item),
          created: () => {
            if (isLast) {
              this.mapInstance.on('complete', () => {
                this.mapInstance.setFitView(
                  this.mapInstance.getAllOverlays().filter(d => d.CLASS_NAME === 'AMap.Marker')
                );
              });
            }
          },
        }}
      >
        {child}
      </Marker>
    );
  };

  renderCompanyMarker(newList) {
    // const { selected } = this.state;
    const { selected } = this.props;
    // 如果有选中的企业就只渲染选中的
    if (newList.length === 0) {
      if (this.mapInstance) this.mapInstance.setCity(region);
      return null;
    }
    return selected
      ? this.renderMarker(selected, false)
      : newList.map((item, index) => this.renderMarker(item, index === newList.length - 1));
  }

  renderBackButton() {
    const { selected = {} } = this.props;

    return (
      <Button
        onClick={() => this.back(!!selected.isFire)}
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
        <LegacyIcon type="rollback" />
        返回
      </Button>
    );
  }

  renderInfoWindow() {
    // const {
    //   showInfo,
    //   selected: { longitude, latitude, name=NO_DATA, address=NO_DATA, safetyName=NO_DATA, safetyPhone=NO_DATA, status=NO_DATA, isFire  },
    // } = this.state;

    const {
      showInfo,
      selected: {
        id,
        longitude,
        latitude,
        name = NO_DATA,
        practicalAddress = NO_DATA,
        safetyName = NO_DATA,
        safetyPhone = NO_DATA,
        status = NO_DATA,
        isFire,
      },
      handleInfoClose,
    } = this.props;

    return (
      <InfoWindow
        position={{ longitude, latitude }}
        // offset={[50, 10]}
        isCustom
        showShadow
        autoMove={false}
        visible={showInfo}
      >
        <h3 className={styles.companyName}>
          <a
            className={styles.link}
            href={`${window.publicPath}#/big-platform/fire-control/company/${id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {name}
          </a>
        </h3>
        <p className={styles.address}>
          {/* <span className={styles.locateIcon} /> */}
          <span className={styles.locateIcon} style={genBackgrondStyle(locateIcon)} />
          {practicalAddress}
        </p>
        <p className={styles.safety}>
          {/* <span className={styles.personIcon} /> */}
          <span className={styles.personIcon} style={genBackgrondStyle(personIcon)} />
          <span className={styles.safetyName}>{safetyName}</span>
          <span>{safetyPhone}</span>
        </p>
        <p className={isFire ? styles.statusFire : styles.status}>
          {/* <span className={isFire ? styles.status1Icon : styles.statusIcon} /> */}
          <span
            className={styles.statusIconBase}
            style={isFire ? genBackgrondStyle(status1Icon) : genBackgrondStyle(statusIcon)}
          />
          {status}
        </p>
        <LegacyIcon
          type="close"
          onClick={handleInfoClose}
          style={{
            color: 'rgb(110,169,221)',
            position: 'absolute',
            right: 10,
            top: 10,
            cursor: 'pointer',
          }}
        />
      </InfoWindow>
    );
  }

  renderUnit(totalNum, fireNum) {
    return (
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
    );
  }

  searchFetchData = value => {
    // console.log('fetchData', value);
    // const { list } = this.props;
    const list = this.newList;
    const selectList = value ? list.filter(item => item.name.includes(value)) : [];
    // console.log('fetchData selectList', selectList);
    this.setState({
      searchValue: value,
      selectList: selectList.length > 10 ? selectList.slice(0, 9) : selectList,
    });
  };

  // handleInputChange = (value, { props: { label } }) => {
  handleInputChange = value => {
    // console.log('change', value);
    this.debouncedFetchData(value);
    this.setState({
      searchValue: value,
    });
  };

  render() {
    // const { center, zoom, selected, searchValue, selectList } = this.state;
    const { searchValue, selectList, status } = this.state;
    const {
      zoom,
      center,
      selected,
      alarm: { list = [] },
      map: { companyBasicInfoList = [], totalNum },
      setMapItemList,
      polygon,
    } = this.props;

    const mapBarStyle = selected ? { top: 11, right: 100 } : { top: 11, right: 15 };

    const fireNum = getFireNum(list);
    let newList = handleCompanyBasicInfoList(list, companyBasicInfoList);
    // const newList = companyBasicInfoList;
    this.newList = newList;
    setMapItemList(newList);

    // console.log('center', center, 'zoom', zoom);

    return (
      <FcSection style={{ padding: 8 }} className={styles.map}>
        <div className={styles.mapContainer}>
          <GDMap
            version={'1.4.10'}
            viewMode="3D"
            amapkey="665bd904a802559d49a33335f1e4aa0d"
            plugins={[{ name: 'Scale', options: { locate: false } }, { name: 'ControlBar' }]}
            status={status}
            useAMapUI
            mapStyle="amap://styles/88a73b344f8608540c84a2d7acd75f18"
            center={center}
            zooms={ZOOMS}
            pitch={60}
            zoom={zoom}
            expandZoomRange
            events={{
              created: mapInstance => {
                this.mapInstance = mapInstance;
                // mapInstance.setCity(region);
              },
            }}
          >
            <Polygon
              path={polygon}
              visible={polygon.length}
              style={{
                strokeColor: '#5ebeff',
                strokeOpacity: 1,
                fillColor: '#5ebeff',
                fillOpacity: 0.5,
              }}
            />
            {this.renderCompanyMarker(newList)}
            {selected && this.renderInfoWindow()}
            <MapTypeBar style={mapBarStyle} />
          </GDMap>
          {/* 点击到具体企业时不显示搜索框，只有在全局地图时显示搜索框 */}
          {!selected && (
            <MapSearch
              className={styles.search}
              style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 666 }}
              list={newList}
              selectList={selectList}
              value={searchValue}
              handleChange={this.handleInputChange}
              handleSelect={this.handleSelect}
            />
          )}
          {selected && this.renderBackButton()}
          {!selected && this.renderUnit(totalNum, fireNum)}
        </div>
      </FcSection>
    );
  }
}
