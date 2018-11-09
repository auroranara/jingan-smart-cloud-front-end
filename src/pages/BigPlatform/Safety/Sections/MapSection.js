import React, { PureComponent } from 'react';
import { Icon, Row, Col } from 'antd';
import { Map as GDMap, InfoWindow, Markers, Polygon } from 'react-amap';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { connect } from 'dva';
import styles from './MapSection.less';
import styles2 from '../Government.less';
// import MapSearch from '../../FireControl/components/MapSearch';
import MapSearch from '../Components/MapSearch';
import MapTypeBar from '../Components/MapTypeBar';

import govdotRed from '../img/govdot-red.png';

const { location: locationDefault, region } = global.PROJECT_CONFIG;
let fitView = true;
@connect(({ bigPlatformSafetyCompany }) => ({ bigPlatformSafetyCompany }))
class MapSection extends PureComponent {
  constructor(props) {
    super(props);
    this.debouncedFetchData = debounce(this.searchFetchData, 500);
    this.state = {
      searchValue: '',
      legendActive: null,
      filter: 'All',
      infoWindowShow: false,
      infoWindow: {
        companyId: '',
        companyName: '',
        level: '',
        address: '',
        longitude: 120.366011,
        latitude: 31.544389,
      },
      tooltipName: '',
      tooltipVisible: false,
      tooltipPosition: [0, 0],
    };
  }

  back = isFire => {
    const { handleBack } = this.props;
    handleBack(isFire);

    this.setState({
      searchValue: '',
    });
  };

  // 搜索之后跳转
  handleSearchSelect = ({ latitude, longitude, id }) => {
    this.setState({
      infoWindowShow: true,
    });
    if (this.mapInstance) {
      // this.mapInstance.setZoom(18);
      this.mapInstance.setZoomAndCenter(18, [longitude, latitude]);
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
    const { locData = [] } = this.props;
    const { filter } = this.state;
    const loactions = locData.filter(d => filter === 'All' || d.level === filter);

    const markers = loactions
      .map((item, index) => {
        // const markers = locData.filter(d => d.level === lvl).map((item, index) => {
        return {
          ...item,
          position: this.analysisPointData(item.location),
          id: item.company_id,
          index,
        };
      })
      .filter(m => m.level);
    return (
      <Markers
        markers={markers}
        offset={[-10, 5]}
        events={{
          click: (e, marker) => {
            const extData = marker.getExtData();
            // const index = extData.index;
            this.setState({
              infoWindowShow: true,
            });
            this.props.handleIconClick({ id: extData.id, ...extData.position });
            // this.handleIconClick({ id: extData.id, ...extData.position });
          },
          created: () => {
            if (fitView) this.mapInstance.setFitView();
            fitView = false;
          },
        }}
        render={this.renderMarkerLayout}
      />
    );
  };

  handleIconClick = company => {
    const { dispatch } = this.props;
    const { id } = company;
    // 企业信息
    dispatch({
      type: 'bigPlatform/fetchCompanyMessage',
      payload: {
        company_id: id,
        month: '2018-09',
      },
      success: response => {},
    });
    // 特种设备
    dispatch({
      type: 'bigPlatform/fetchSpecialEquipment',
      payload: {
        company_id: id,
      },
    });
    // 风险点隐患
    dispatch({
      type: 'bigPlatform/fetchRiskDetail',
      payload: {
        company_id: id,
        source_type: '3',
      },
    });

    // 风险点隐患
    dispatch({
      type: 'bigPlatform/fetchHiddenDanger',
      payload: {
        company_id: id,
        status: '7',
      },
    });
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
      <div
        onMouseEnter={e => this.props.showTooltip(e, company_name)}
        onMouseLeave={this.props.hideTooltip}
      >
        {/* <Tooltip placement="bottom" title={company_name} mouseLeaveDelay={0}> */}
        {level === 'A' && (
          <img src={govdotRed} alt="" style={{ display: 'block', width: '20px', height: '20px' }} />
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
        {/* </Tooltip> */}
      </div>
    );
  };

  // 弹窗渲染
  renderInfoWindow = () => {
    const {
      infoWindow: { longitude, latitude, companyName },
      infoWindowShow,
    } = this.props;
    return (
      <InfoWindow
        position={{ longitude, latitude }}
        offset={[-15, 5]}
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
    this.props.handleHideInfoWindow();
  };

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

  // 按level筛选地图企业
  filterPoint = filter => {
    this.setState({
      filter,
    });
  };

  renderMapLegend = () => {
    const { companyLevelDto = [], locData = [] } = this.props;
    const { legendActive } = this.state;
    // let Anum = 0,
    //   Bnum = 0,
    //   Cnum = 0,
    //   Dnum = 0;
    // companyLevelDto.forEach(item => {
    //   if (item.level === 'A') Anum = item.num;
    //   if (item.level === 'B') Bnum = item.num;
    //   if (item.level === 'C') Cnum = item.num;
    //   if (item.level === 'D') Dnum = item.num;
    // });

    const lvlNum = [];
    const lvls = ['A', 'B', 'C', 'D'];
    lvls.forEach((val, index) => {
      lvlNum[val] = locData.filter(c => c.level && c.level === val).length;
    });

    const mapLegends = [
      {
        level: 'A',
        icon: styles.dotRed,
        number: lvlNum['A'],
      },
      {
        level: 'B',
        icon: styles.dotOrange,
        number: lvlNum['B'],
      },
      {
        level: 'C',
        icon: styles.dotYel,
        number: lvlNum['C'],
      },
      {
        level: 'D',
        icon: styles.dotBlue,
        number: lvlNum['D'],
      },
    ];
    return (
      <Row className={styles.mapLegend}>
        {mapLegends.map((item, index) => {
          const { level, icon, number } = item;
          const legendStyles = classNames(styles.legendItem, {
            [styles.notActive]: legendActive !== index && legendActive !== null,
          });
          return (
            <Col span={6} key={level}>
              <span
                className={legendStyles}
                onClick={() => {
                  fitView = true;
                  this.filterPoint(level);
                  this.setState({
                    legendActive: index,
                  });
                }}
              >
                <span className={icon} />
                {level}
                类单位 （{number}）
              </span>
            </Col>
          );
        })}
      </Row>
    );
  };

  render() {
    const { searchValue } = this.state;
    const {
      bigPlatformSafetyCompany: { selectList },
      center,
      zoom,
      polygon,
    } = this.props;

    return (
      <section className={styles2.sectionWrapper} style={{ marginTop: '12px', flex: 1 }}>
        <div className={styles2.sectionWrapperIn}>
          <div className={styles2.sectionMain} style={{ border: 'none' }}>
            <div className={styles.mapContainer}>
              <GDMap
                version={'1.4.10'}
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
                events={{
                  created: mapInstance => {
                    this.mapInstance = mapInstance;
                    mapInstance.setCity(region);
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
                {this.renderInfoWindow()}
                {this.renderMarkers()}
                <MapTypeBar />
                <div
                  className={styles.allPoint}
                  onClick={() => {
                    fitView = true;
                    this.filterPoint('All');
                    this.setState({
                      infoWindowShow: false,
                      legendActive: null,
                      searchValue: '',
                    });
                    // if (this.mapInstance) {
                    //   this.mapInstance.setFitView();
                    //   // this.mapInstance.setZoomAndCenter(locationDefault.zoom, [
                    //   //   locationDefault.x,
                    //   //   locationDefault.y,
                    //   // ]);
                    // }
                    if (this.props.comInfo) {
                      this.props.goBack();
                    }
                  }}
                >
                  <Icon type="reload" theme="outlined" style={{ marginRight: '3px' }} />
                  重置
                </div>
              </GDMap>
              {/* <MapSearch
          style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 666 }}
          selectList={selectList}
          value={searchValue}
          handleChange={this.handleInputChange}
          handleSelect={this.handleSearchSelect}
        /> */}
              <MapSearch
                style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 666 }}
                handleSelect={this.handleSearchSelect}
                // selectList={selectList}
                // value={searchValue}
                // handleChange={this.handleInputChange}
                // handleSelect={this.handleSearchSelect}
              />
              {this.renderMapLegend()}
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default MapSection;
