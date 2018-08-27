import React, { PureComponent } from 'react';
import { Map as GDMap, Marker, InfoWindow } from 'react-amap';
import { Button, Icon } from 'antd';
import debounce from 'lodash/debounce';

import FcSection from './FcSection';
import styles from './FireControlMap.less';
import MapSearch from '../components/MapSearch';

import mapDot from '../img/mapDot.png';
import mapAlarmDot from '../img/mapAlarmDot.png';
import locateIcon from '../img/mapLocate.png';
import personIcon from '../img/mapPerson.png';
import statusIcon from '../img/mapFire.png';
import status1Icon from '../img/mapFire1.png';

const NO_DATA = '暂无信息';

const { location } = global.PROJECT_CONFIG;

function handleCompanyBasicInfoList(alarmList, companyList) {
  return companyList.map(item => {
    const { name } = item;
    const alarmed = alarmList.find(({ name: companyName }) => companyName === name)
    if (alarmed)
      return { address: alarmed.searchArea, ...item, isFire: true, status: alarmed.status };
    return { ...item, isFire: false, status: item.isFire };
  });
}

function genBackgrondStyle(url) {
  return { backgroundImage: `url(${url})` };
}

export default class FireControlMap extends PureComponent {
  constructor(props) {
    super(props);
    this.debouncedFetchData = debounce(this.searchFetchData, 500);
    this.state = {
      center: [location.x, location.y],
      zoom: location.zoom,
      selected: undefined,
      showInfo: false,
      searchValue: '',
      selectList: [],
    };
  }

  newList = [];

  back = () => {
    this.setState({
      zoom: location.zoom,
      selected: undefined,
      searchValue: '',
    });
  };

  selectCompany = item => {
    const { latitude, longitude } = item;
    this.setState({
      center: [longitude, latitude],
      zoom: 18,
      selected: item,
      showInfo: true,
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

  renderMarker = (item) => {
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
          className={styles.dotIcon}
          src={item.isFire ? mapAlarmDot : mapDot}
          // src={`http://data.jingan-china.cn/v2/big-platform/fire-control/gov/${item.isFire ? 'mapAlarmDot' : 'mapDot'}.png`}
          alt=""
          // style={{ display: 'block', width: '30px', height: '30px' }}
        />
      </Marker>
    );
  };

  renderCompanyMarker(newList) {
    const { selected } = this.state;
    // 如果有选中的企业就只渲染选中的
    return selected
      ? this.renderMarker(selected)
      : newList.map(item => this.renderMarker(item));
  }

  renderBackButton() {
    return (
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
    );
  }

  renderInfoWindow() {
    const {
      showInfo,
      selected: { longitude, latitude, name=NO_DATA, address=NO_DATA, safetyName=NO_DATA, safetyPhone=NO_DATA, status=NO_DATA, isFire  },
    } = this.state;

    return (
      <InfoWindow
        position={{ longitude, latitude }}
        // offset={[50, 10]}
        isCustom
        showShadow
        autoMove={false}
        visible={showInfo}
      >
        <h3 className={styles.companyName}>{name}</h3>
        <p className={styles.address}>
          {/* <span className={styles.locateIcon} /> */}
          <span className={styles.locateIcon} style={genBackgrondStyle(locateIcon)} />
          {address}
        </p>
        <p className={styles.safety}>
          {/* <span className={styles.personIcon} /> */}
          <span className={styles.personIcon} style={genBackgrondStyle(personIcon)} />
          <span className={styles.safetyName}>{safetyName}</span>
          <span>{safetyPhone}</span>
        </p>
        <p className={isFire ? styles.statusFire : styles.status}>
          {/* <span className={isFire ? styles.status1Icon : styles.statusIcon} /> */}
          <span className={styles.statusIconBase} style={isFire ? genBackgrondStyle(status1Icon) : genBackgrondStyle(statusIcon)} />
          {status}
        </p>
        <Icon
          type="close"
          onClick={() => this.setState({ showInfo: false })}
          style={{ color: 'rgb(110,169,221)', position: 'absolute', right: 10, top: 10, cursor: 'pointer' }}
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

  handleInputChange = (value, { props: { label } }) => {
    // console.log('change', value);
    this.debouncedFetchData(value);
    this.setState({
      searchValue: value,
    });
  };

  render() {
    const { center, zoom, selected, searchValue, selectList } = this.state;
    const {
      alarm: { list = [] },
      map: { companyBasicInfoList = [], totalNum, fireNum },
    } = this.props;

    let newList = handleCompanyBasicInfoList(list, companyBasicInfoList);
    this.newList = newList;

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
            {this.renderCompanyMarker(newList)}
            {selected && this.renderInfoWindow()}
          </GDMap>
          <MapSearch
            className={styles.search}
            style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 666 }}
            list={newList}
            selectList={selectList}
            value={searchValue}
            handleChange={this.handleInputChange}
            handleSelect={this.handleSelect}
          />
          {selected && this.renderBackButton()}
          {this.renderUnit(totalNum, fireNum)}
        </div>
      </FcSection>
    );
  }
}