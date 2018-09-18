import React, { PureComponent } from 'react';
import { Map as GDMap, Marker, InfoWindow, Markers } from 'react-amap';
import { Button, Icon } from 'antd';
import debounce from 'lodash/debounce';

import styles from './MapSection.less';
import MapSearch from '../../FireControl/components/MapSearch';
import MapTypeBar from './MapTypeBar';

const NO_DATA = '暂无信息';

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
    const { hideTooltip } = this.props;

    hideTooltip();
    this.selectCompany(item);
  };

  analysisPointData = data => {
    // POINT ()
    const str = data.substring(7, data.length - 1);
    const point = str.split(' ');
    return {
      longitude: point[0],
      latitude: point[1],
    };
  };

  renderMarkers = () => {
    const { locData } = this.props;
    console.log(locData);

    const markers = locData.map((item, index) => {
      return {
        ...item,
        position: this.analysisPointData(item.location),
        id: item.company_id,
        index,
      };
    });
    return (
      <Markers
        markers={markers}
        events={{
          click: (e, marker) => {
            const extData = marker.getExtData();
            const index = extData.index;
            console.log(extData);

            this.props.handleIconClick({ id: extData.id, ...extData.position });
          },
        }}
        render={this.renderMarkerLayout}
      />
    );
  };

  renderMarkerLayout = extData => {
    const { level } = extData;
    return (
      <div>
        {/* <img
          src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-red.svg"
          alt=""
          style={{ display: 'block', width: '26px', height: '26px' }}
        /> */}
        {level === 'A' && (
          <img
            src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-red.svg"
            alt=""
            style={{ display: 'block', width: '26px', height: '26px' }}
          />
        )}
        {level === 'B' && (
          <img
            src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-orange2.png"
            alt=""
            style={{ display: 'block', width: '20px', height: '20px' }}
          />
        )}
        {level === 'C' && (
          <img
            src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-yel2.png"
            alt=""
            style={{ display: 'block', width: '20px', height: '20px' }}
          />
        )}
        {level === 'D' && (
          <img
            src="http://data.jingan-china.cn/v2/big-platform/safety/govdot-blue2.png"
            alt=""
            style={{ display: 'block', width: '20px', height: '20px' }}
          />
        )}
      </div>
    );
  };

  renderInfoWindow() {
    return null;
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
    // const { searchValue, selectList } = this.state;
    const {
      zoom,
      center,
      // selected,
      // alarm: { list = [] },
      // map: { companyBasicInfoList = [], totalNum },
      // setMapItemList,
    } = this.props;

    return (
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
          {this.renderMarkers()}
          {/* {selected && this.renderInfoWindow()} */}
          <MapTypeBar />
        </GDMap>
        {/* <MapSearch
              className={styles.search}
              style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 666 }}
              // list={newList}
              selectList={selectList}
              value={searchValue}
              handleChange={this.handleInputChange}
              handleSelect={this.handleSelect}
            /> */}
      </div>
    );
  }
}
