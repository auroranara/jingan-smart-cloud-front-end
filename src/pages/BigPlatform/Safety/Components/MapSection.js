import React, { PureComponent } from 'react';
import { Tooltip, Icon } from 'antd';
import { Map as GDMap, Marker, InfoWindow, Markers } from 'react-amap';
import debounce from 'lodash/debounce';
import { connect } from 'dva';
import styles from './MapSection.less';
import MapSearch from '../../FireControl/components/MapSearch';
import MapTypeBar from './MapTypeBar';

const NO_DATA = '暂无信息';
const { location: locationDefault } = global.PROJECT_CONFIG;
@connect(({ bigPlatformSafetyCompany }) => ({ bigPlatformSafetyCompany }))
class MapSection extends PureComponent {
  constructor(props) {
    super(props);
    this.debouncedFetchData = debounce(this.searchFetchData, 500);
    this.state = {
      searchValue: '',
      selectList: [],
      infoWindowShow: false,
      infoWindow: {
        companyId: '',
        companyName: '',
        level: '',
        address: '',
        longitude: 120.366011,
        latitude: 31.544389,
      },
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

  // 搜索之后跳转
  handleSearchSelect = ({ latitude, longitude, id }) => {
    this.setState({
      center: [longitude, latitude],
      infoWindowShow: true,
    });
    if (this.mapInstance) {
      this.mapInstance.setZoom(18);
    }
    this.props.handleIconClick({ latitude, longitude, id });
  };

  // 点击
  handleClick = item => {
    const { hideTooltip } = this.props;

    hideTooltip();
    this.selectCompany(item);
  };

  analysisPointData = data => {
    // POINT (120,31)
    const str = data.substring(7, data.length - 1);
    const point = str.split(' ');
    return {
      longitude: point[0],
      latitude: point[1],
    };
  };

  renderMarkers = lvl => {
    const { locData } = this.props;
    console.log(locData);

    const markers = locData.map((item, index) => {
      // const markers = locData.filter(d => d.level === lvl).map((item, index) => {
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
            // const index = extData.index;
            this.setState({
              infoWindowShow: true,
            });
            this.props.handleIconClick({ id: extData.id, ...extData.position });
          },
        }}
        render={this.renderMarkerLayout}
      />
    );
  };

  renderCluserMarker = lvl => {
    let img = null;
    if (lvl === 'A') img = <img src="http://webapi.amap.com/theme/v1.3/m5.png" alt="" />;
    if (lvl === 'B') img = <img src="http://webapi.amap.com/theme/v1.3/m3.png" alt="" />;
    if (lvl === 'C') img = <img src="http://webapi.amap.com/theme/v1.3/m2.png" alt="" />;
    if (lvl === 'D') img = <img src="http://webapi.amap.com/theme/v1.3/m1.png" alt="" />;
    return img;
  };

  renderMarkerLayout = extData => {
    const { level, company_name } = extData;
    return (
      <div>
        <Tooltip placement="bottom" title={company_name} mouseLeaveDelay={0}>
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
        </Tooltip>
      </div>
    );
  };

  // 弹窗渲染
  renderInfoWindow = () => {
    const {
      infoWindowShow,
      // infoWindow: { longitude, latitude, companyName },
    } = this.state;
    const {
      infoWindow: { longitude, latitude, companyName },
    } = this.props;
    return (
      <InfoWindow
        position={{ longitude, latitude }}
        offset={[-7, 10]}
        isCustom={false}
        autoMove={false}
        visible={infoWindowShow}
        events={{ close: this.handleHideInfoWindow }}
      >
        <div style={{ padding: '0 5px 0 13px' }} className={styles.companyLabel}>
          <div>{companyName}</div>
        </div>
      </InfoWindow>
    );
  };

  handleHideInfoWindow = () => {
    this.setState({
      infoWindowShow: false,
    });
  };

  // searchFetchData = value => {
  //   // console.log('fetchData', value);
  //   // const { list } = this.props;
  //   const list = this.newList;
  //   const selectList = value ? list.filter(item => item.name.includes(value)) : [];
  //   // console.log('fetchData selectList', selectList);
  //   this.setState({
  //     searchValue: value,
  //     selectList: selectList.length > 10 ? selectList.slice(0, 9) : selectList,
  //   });
  // };

  searchFetchData = value => {
    this.props.dispatch({
      type: 'bigPlatformSafetyCompany/fetchSelectList',
      payload: {
        name: value,
      },
      callback: () => {},
    });

    this.setState({
      searchValue: value,
    });
  };

  handleInputChange = (value, { props: { label } }) => {
    this.debouncedFetchData(value);
    this.setState({
      searchValue: value,
    });
  };

  render() {
    const { searchValue } = this.state;
    const {
      zoom,
      center,
      bigPlatformSafetyCompany: { selectList },
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
          events={{ created: mapInstance => (this.mapInstance = mapInstance) }}
        >
          {this.renderMarkers()}
          {/* {this.renderInfoWindow()} */}
          <MapTypeBar />
          <div
            className={styles.allPoint}
            onClick={() => {
              this.filterPoint('All');
              this.setState({
                center: [locationDefault.x, locationDefault.y],
                infoWindowShow: false,
                legendActive: null,
                searchValue: '',
              });
              if (this.mapInstance) {
                this.mapInstance.setZoom(locationDefault.zoom);
              }
              if (this.state.comInfo) {
                this.goBack();
              }
            }}
          >
            <Icon type="reload" theme="outlined" style={{ marginRight: '3px' }} />
            重置
          </div>
        </GDMap>
        <MapSearch
          style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 666 }}
          // list={newList}
          selectList={selectList}
          value={searchValue}
          handleChange={this.handleInputChange}
          handleSelect={this.handleSearchSelect}
        />
      </div>
    );
  }
}

export default MapSection;
