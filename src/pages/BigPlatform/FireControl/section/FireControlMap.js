import React, { PureComponent } from 'react';
import { Map as GDMap, Marker, InfoWindow } from 'react-amap';
import { Button, Icon, Tooltip } from 'antd';
// import { Link } from 'dva/router';
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
import redCircle from '../img/redCircle.png';

const NO_DATA = '暂无信息';

// const { location } = global.PROJECT_CONFIG;

// function handleCompanyBasicInfoList(alarmList, companyList) {
// return companyList.map(item => {
// const { name } = item;
// const alarmed = alarmList.find(({ name: companyName }) => companyName === name)
// if (alarmed) {
//   const isFire = !Number.parseInt(alarmed.status, 10);
//   const status = isFire ? ABNORMAL : NORMAL;
//   return { address: alarmed.searchArea, ...item, isFire, status };
// }
// return { ...item, isFire: false, status: NORMAL };
// });
// }

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
      searchValue: '',
      selectList: [],
    };
  }

  newList = [];

  back = isFire => {
    const { handleBack } = this.props;
    handleBack(isFire);

    this.setState({
      // zoom: location.zoom,
      // selected: undefined,
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
  handleClick = item => {
    this.selectCompany(item);
  };

  renderMarker = item => {
    const { selected } = this.props;

    // 默认情况，有火警且未被选中，不显示红圈
    let child = <img className={styles.dotIcon} src={mapAlarmDot} alt="定位图标" />;
    const { name, isFire } = item;
    const isSelected = !!selected;

    // 没有火警，不论选中不选中显示正常图标
    if (!isFire) child = <img className={styles.dotIcon} src={mapDot} alt="定位图标" />;
    // 有火警，且被选中，显示红圈
    else if (isSelected)
      child = (
        <div className={styles.redCircle} style={{ backgroundImage: `url(${redCircle})` }}>
          <img className={styles.dotSelectedIcon} src={mapAlarmDot} alt="定位图标" />;
        </div>
      );

    return (
      <Marker
        position={{ longitude: item.longitude, latitude: item.latitude }}
        key={item.id}
        offset={isFire && isSelected ? [-100, -122] : [-22, -45]}
        events={{ click: this.handleClick.bind(this, item) }}
      >
        <Tooltip title={name}>{child}</Tooltip>
      </Marker>
    );
  };

  renderCompanyMarker(newList) {
    // const { selected } = this.state;
    const { selected } = this.props;
    // 如果有选中的企业就只渲染选中的
    return selected ? this.renderMarker(selected) : newList.map(item => this.renderMarker(item));
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
        <Icon type="rollback" />
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
        <Icon
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

  handleInputChange = (value, { props: { label } }) => {
    // console.log('change', value);
    this.debouncedFetchData(value);
    this.setState({
      searchValue: value,
    });
  };

  render() {
    // const { center, zoom, selected, searchValue, selectList } = this.state;
    const { searchValue, selectList } = this.state;
    const {
      zoom,
      center,
      selected,
      // alarm: { list = [] },
      map: { companyBasicInfoList = [], totalNum, fireNum },
      setMapItemList,
    } = this.props;

    // let newList = handleCompanyBasicInfoList(list, companyBasicInfoList);
    const newList = companyBasicInfoList;
    this.newList = newList;
    setMapItemList(newList);

    // console.log('center', center, 'zoom', zoom);

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
          {!selected && this.renderUnit(totalNum, fireNum)}
        </div>
      </FcSection>
    );
  }
}
