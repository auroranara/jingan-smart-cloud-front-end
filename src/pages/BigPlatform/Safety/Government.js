import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
// import classNames from 'classnames';
import styles from './Government.less';
import Timer from './Components/Timer';
import MapSection from './Sections/MapSection';
import MyTooltip from '../FireControl/section/Tooltip';

import DangerCompany from './Sections/DangerCompany';
import CheckInfo from './Sections/CheckInfo';
import CompanyOver from './Sections/CompanyOver';
import RiskDetail from './Sections/RiskDetail';
import RiskDetailOver from './Sections/RiskDetailOver';
import RiskOver from './Sections/RiskOver';
import HdOverCompany from './Sections/HdOverCompany';
import RiskColors from './Sections/RiskColors';
import FullStaff from './Sections/FullStaff';
import CompanyIn from './Sections/CompanyIn';
import CompanyInfo from './Sections/CompanyInfo';
import CommunityCom from './Sections/CommunityCom';
import TopData from './Sections/TopData';
import HiddenDangerPie from './Sections/HiddenDangerPie';
import RiskBar from './Sections/RiskBar';

const { location: locationDefault, region } = global.PROJECT_CONFIG;

const sectionsVisible = {
  communityCom: false, // 社区接入单位数
  companyIn: false, // 接入单位统计
  fullStaff: false, // 专职人员统计
  overHd: false, // 已超期隐患
  hdCom: false, // 隐患单位统计
  comInfo: false, // 企业信息
  riskColors: false, // 风险点
  hdOverDetail: false, // 已超期隐患详情
  hiddenDanger: false, // 隐患详情
  checks: false, // 监督检查
  companyOver: false, // 已超时单位
  riskOver: false, // 已超时风险点
};
@connect(({ bigPlatform, bigPlatformSafetyCompany }) => ({
  bigPlatform,
  bigPlatformSafetyCompany,
}))
class GovernmentBigPlatform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      safetyGovernmentTitle: global.PROJECT_CONFIG.safetyGovernmentTitle,
      scrollNodeTop: 0,
      label: {
        longitude: 120.366011,
        latitude: 31.544389,
      },
      infoWindowShow: false,
      infoWindow: {
        companyId: '',
        companyName: '',
        level: '',
        address: '',
        longitude: 120.366011,
        latitude: 31.544389,
      },
      areaHeight: 0,
      pieHeight: 0,
      center: [locationDefault.x, locationDefault.y],
      zoom: locationDefault.zoom,
      // 右侧显示
      communityCom: true, // 社区接入单位数
      companyIn: false, // 接入单位统计
      fullStaff: false, // 专职人员统计
      overHd: false, // 已超期隐患
      hdCom: false, // 隐患单位统计
      comInfo: false, // 企业信息
      riskColors: false, // 风险点
      hdOverDetail: false, // 已超期隐患详情
      hiddenDanger: false, // 隐患详情
      checks: false, // 监督检查
      companyOver: false, // 已超时单位
      riskOver: false, // 已超时风险点
      companyId: '',
      riskColorSummary: {
        riskColorTitle: '',
        risk: 0,
        abnormal: 0,
        company: 0,
      },
      filter: 'All',
      legendActive: null,
      searchValue: '',
      tooltipName: '',
      tooltipVisible: false,
      tooltipPosition: [0, 0],
      dangerCompanyData: {},
      dangerCompanyLast: '',
      checksMonth: moment().format('YYYY-MM'),
      checkUserId: '',
    };
  }

  // UNSAFE_componentWillUpdate() {
  //   requestAnimationFrame(this.resolveAnimationFrame);
  // }

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 1000);
    });

    dispatch({
      type: 'bigPlatform/fetchItemList',
      payload: {
        start: 0,
        end: 24,
        pageSize: 25,
        item_type: 1,
      },
    });

    dispatch({
      type: 'bigPlatform/fetchProjectName',
    });

    // 大屏隐患点位总数据
    dispatch({
      type: 'bigPlatform/fetchListForMapForOptimize',
    });

    // dispatch({
    //   type: 'bigPlatform/fetchListForMap',
    // });

    dispatch({
      type: 'bigPlatform/fetchCountDangerLocation',
    });

    dispatch({
      type: 'bigPlatform/fetchLocation',
    });

    // 政府专职人员列表
    dispatch({
      type: 'bigPlatform/fetchGovFulltimeWorkerList',
    });

    // 获取超期未整改隐患企业列表
    dispatch({
      type: 'bigPlatform/fetchOverRectifyCompany',
    });

    // 查找重点和非重点单位
    dispatch({
      type: 'bigPlatform/fetchSearchAllCompany',
    });

    // 隐患单位数量以及具体信息
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerCompany',
      payload: {
        // date: moment().format('YYYY-MM'),
      },
    });

    dispatch({
      type: 'bigPlatform/fetchNewHomePage',
      payload: {
        month: moment().format('YYYY-MM'),
      },
    });

    // 获取已超时风险点总数
    dispatch({
      type: 'bigPlatform/fetchSelectOvertimeItemNum',
    });

    // 安全政府-超时未查单位
    dispatch({
      type: 'bigPlatform/fetchOvertimeUncheckedCompany',
    });

    // 已超时单位信息
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerOverTime',
      payload: {
        date: moment().format('YYYY-MM'),
      },
    });

    if (region === '江溪街道') {
      // 获取网格区域
      dispatch({
        type: 'bigPlatform/fetchMapLocation',
        payload: {
          gridId: 'gH3B8GRpQlyP1IWIw5BTPA',
        },
      });
    }

    this.checkNum = 0;
    this.fetchCheckMsgs(moment().format('YYYY-MM'));

    // requestAnimationFrame(this.resolveAnimationFrame);

    this.setViewport();
  }

  // 某月监督检查相关信息
  fetchCheckMsgs = month => {
    const { dispatch } = this.props;
    // 专职人员检查信息
    dispatch({
      type: 'bigPlatform/fetchCheckInfo',
      payload: {
        date: month,
      },
    });

    // 本月隐患单位数量以及具体信息
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerCompany',
      payload: {
        date: month,
      },
    });

    // 监督检查已查
    dispatch({
      type: 'bigPlatform/fetchCheckedCompanyInfo',
      payload: {
        date: month,
        isChecked: '1',
        isNormal: '1',
        isOvertime: '1',
        pageNum: 1,
        pageSize: 1,
      },
      success: num => {
        if (month === moment().format('YYYY-MM')) this.checkNum = num;
      },
    });

    // 监督检查未查
    dispatch({
      type: 'bigPlatform/fetchCheckedCompanyInfo',
      payload: {
        date: month,
        isChecked: '0',
        isNormal: '1',
        isOvertime: '1',
        pageNum: 1,
        pageSize: 1,
      },
    });
  };

  componentWillUnmount() {
    cancelAnimationFrame(this.reqRef);
  }

  setViewport() {
    const vp = document.querySelector('meta[name=viewport]');
    const sw = window.screen.width;
    const stand = 1440;
    const sca = sw / stand;
    vp.content =
      'width=device-width, initial-scale=' +
      sca +
      ', maximum-scale=' +
      sca +
      ', minimum-scale=' +
      sca +
      ', user-scalable=no';
  }

  resolveAnimationFrame = () => {
    const { scrollNodeTop } = this.state;
    setTimeout(() => {
      if (scrollNodeTop >= this.tableNode.offsetHeight + 150) {
        this.setState({
          scrollNodeTop: 0,
        });
        return;
      }
      this.setState({
        scrollNodeTop: scrollNodeTop + 1,
      });
    }, 50);
  };

  debounce = (action, delay) => {
    var timer = null;
    return function() {
      const self = this;
      const args = arguments;

      clearTimeout(timer);
      timer = setTimeout(function() {
        action.apply(self, args);
      }, delay);
    };
  };

  handleIconClick = company => {
    const { dispatch } = this.props;
    const { companyId, infoWindowShow, comInfo } = this.state;
    const { id } = company;
    if (companyId === company.id) {
      if (!comInfo) {
        this.goComponent('comInfo');
      }
      if (!infoWindowShow) {
        this.setState({ infoWindowShow: true });
      }
      return;
    }
    this.setState({
      companyId: id,
    });
    // 企业信息
    dispatch({
      type: 'bigPlatform/fetchCompanyMessage',
      payload: {
        company_id: id,
        month: moment().format('YYYY-MM'),
        status: '7',
      },
      success: response => {
        this.goComponent('comInfo');
        this.setState({
          infoWindowShow: true,
          infoWindow: {
            comapnyId: company.id,
            longitude: company.longitude,
            latitude: company.latitude,
            companyName: response.companyMessage.companyName,
          },
        });
        if (document.querySelector('#companyRisk')) {
          document.querySelector('#companyRisk').scrollTop = 0;
        }
      },
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
      type: 'bigPlatform/fetchHiddenDangerListByDate',
      payload: {
        company_id: id,
        source_type: '3',
      },
    });
  };

  handleHideInfoWindow = () => {
    this.setState({
      infoWindowShow: false,
    });
  };

  goBack = section => {
    let obj = {};
    if (this.state.comInfo) {
      this.setState({
        infoWindowShow: false,
      });
      // return;
    }
    this.setState(sectionsVisible);
    setTimeout(() => {
      if (section) {
        obj[section] = true;
        this.setState({
          ...obj,
        });
      } else {
        this.setState({
          communityCom: true,
        });
      }
    }, 225);
  };

  goComponent = type => {
    // if (this.state[type] && type !== 'comInfo') return;
    const obj = {};
    obj[type] = true;
    this.setState(sectionsVisible);
    setTimeout(() => {
      this.setState({
        ...obj,
      });
    }, 225);
  };

  goCompany = company_id => {
    window.open(`${window.publicPath}#/big-platform/safety/company/${company_id}`, `_blank`);
  };

  showTooltip = (e, name) => {
    const offset = e.target.getBoundingClientRect();
    this.setState({
      tooltipName: name,
      tooltipVisible: true,
      tooltipPosition: [offset.left, offset.top],
    });
  };

  hideTooltip = () => {
    this.setState({
      tooltipName: '',
      tooltipVisible: false,
      tooltipPosition: [0, 0],
    });
  };

  render() {
    const {
      communityCom,
      companyIn,
      fullStaff,
      overHd,
      hdCom,
      comInfo,
      riskColors,
      hdOverDetail,
      safetyGovernmentTitle,
      riskColorSummary,
      center,
      zoom,
      companyId,
      hiddenDanger,
      infoWindow,
      tooltipVisible,
      tooltipName,
      tooltipPosition,
      infoWindowShow,
      checks,
      companyOver,
      dangerCompanyData,
      dangerCompanyLast,
      checksMonth,
      riskOver,
      checkUserId,
    } = this.state;
    const {
      dispatch,
      bigPlatform: {
        newHomePage: {
          // companyDto: { company_num_with_item },
          companyLevelDto,
          countGridCompany,
        },
        countDangerLocation,
        listForMapForOptimize = {},
        listForMapForOptimize: { overRectifyNum },
        govFulltimeWorkerList: { total: fulltimeWorker = 0, list: fulltimeWorkerList = [] },
        overRectifyCompany,
        searchAllCompany,
        dangerLocationCompanyData,
        location,
        checkInfo,
        hiddenDangerCompanyAll,
        hiddenDangerCompanyMonth,
        hiddenDangerOverTime,
        checkedCompanyInfo,
        hiddenDangerListByDate,
        selectOvertimeItemNum,
        overtimeUncheckedCompany,
        companyMessage,
        specialEquipment,
        mapLocation = [],
      },
    } = this.props;

    return (
      <div className={styles.main}>
        <header className={styles.mainHeader}>
          <span>{safetyGovernmentTitle}</span>
          <div className={styles.subHeader}>
            <Timer />
          </div>
        </header>

        <article className={styles.mainBody}>
          <Row gutter={12} className={styles.heightFull}>
            <Col span={6} className={styles.heightFull}>
              <RiskBar
                dispatch={dispatch}
                countDangerLocation={countDangerLocation}
                goComponent={this.goComponent}
                handleParentChange={newState => {
                  this.setState(newState);
                }}
              />

              <HiddenDangerPie
                dispatch={dispatch}
                goComponent={this.goComponent}
                hiddenDangerCompanyAll={hiddenDangerCompanyAll}
                listForMap={listForMapForOptimize}
                handleParentChange={newState => {
                  this.setState(newState);
                }}
              />
            </Col>
            <Col
              span={12}
              className={styles.heightFull}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <TopData
                goComponent={this.goComponent}
                searchAllCompany={searchAllCompany}
                fulltimeWorker={fulltimeWorker}
                overRectifyNum={overRectifyNum}
                selectOvertimeItemNum={selectOvertimeItemNum}
                checkedCompanyInfo={this.checkNum}
                handleParentChange={newState => {
                  this.setState(newState);
                }}
                fetchCheckMsgs={this.fetchCheckMsgs}
              />

              {/* <section className={styles.sectionWrapper} style={{ marginTop: '12px', flex: 1 }}>
                <div className={styles.sectionWrapperIn}>
                  <div className={styles.sectionMain} style={{ border: 'none' }}> */}
              <MapSection
                dispatch={dispatch}
                locData={location}
                polygon={mapLocation}
                zoom={zoom}
                center={center}
                handleIconClick={this.handleIconClick}
                infoWindow={infoWindow}
                infoWindowShow={infoWindowShow}
                companyLevelDto={companyLevelDto}
                goBack={this.goBack}
                comInfo={comInfo}
                showTooltip={this.showTooltip}
                hideTooltip={this.hideTooltip}
                handleHideInfoWindow={this.handleHideInfoWindow}
              />
              {/* </div>
                </div>
              </section> */}
            </Col>

            <Col span={6} className={styles.heightFull} style={{ position: 'relative' }}>
              <CommunityCom
                visible={communityCom}
                dispatch={dispatch}
                countGridCompany={countGridCompany}
                searchAllCompany={searchAllCompany}
              />

              {/* 单位概况 */}
              <CompanyInfo
                visible={comInfo}
                dispatch={dispatch}
                goBack={this.goBack}
                goCompany={this.goCompany}
                companyId={companyId}
                companyMessage={companyMessage}
                specialEquipment={specialEquipment}
                hiddenDangerListByDate={hiddenDangerListByDate}
              />

              {/* 单位统计 */}
              <CompanyIn
                visible={companyIn}
                dispatch={dispatch}
                goBack={this.goBack}
                goCompany={this.goCompany}
                searchAllCompany={searchAllCompany}
              />

              {/* 风险点 */}
              <FullStaff
                visible={fullStaff}
                dispatch={dispatch}
                goBack={this.goBack}
                goComponent={this.goComponent}
                listData={fulltimeWorkerList}
                fulltimeWorker={fulltimeWorker}
              />

              {/* 风险点 */}
              <RiskColors
                visible={riskColors}
                dispatch={dispatch}
                goBack={this.goBack}
                goCompany={this.goCompany}
                goComponent={this.goComponent}
                listData={dangerLocationCompanyData}
                riskColorSummary={riskColorSummary}
              />

              {/* 已超期隐患单位 */}
              <HdOverCompany
                visible={overHd}
                dispatch={dispatch}
                goBack={this.goBack}
                goCompany={this.goCompany}
                goComponent={this.goComponent}
                listData={overRectifyCompany}
                overRectifyNum={overRectifyNum}
              />

              {/* 已超时风险点 */}
              <RiskOver
                visible={riskOver}
                goBack={this.goBack}
                goCompany={this.goCompany}
                listData={overtimeUncheckedCompany}
                riskOverNum={selectOvertimeItemNum}
              />

              {/* 已超期隐患详情 */}
              <RiskDetailOver
                visible={hdOverDetail}
                goBack={this.goBack}
                hiddenDangerListByDate={hiddenDangerListByDate}
              />

              {/* 隐患详情 */}
              <RiskDetail
                visible={hiddenDanger}
                goBack={this.goBack}
                hiddenDangerListByDate={hiddenDangerListByDate}
              />

              {/* 隐患单位统计 */}
              <DangerCompany
                data={dangerCompanyData}
                visible={hdCom}
                dispatch={dispatch}
                goBack={this.goBack}
                goComponent={this.goComponent}
                goCompany={this.goCompany}
                monthSelecter={false}
                lastSection={dangerCompanyLast}
                month={checksMonth}
                checkUserId={checkUserId}
                // monthSelecter={hdComMonth}
              />

              {/* 监督检查 */}
              <CheckInfo
                dispatch={dispatch}
                visible={checks}
                listData={checkInfo}
                checkedCompanyInfo={checkedCompanyInfo}
                dangerCompany={hiddenDangerCompanyMonth}
                dangerCompanyOver={hiddenDangerOverTime}
                goBack={this.goBack}
                goComponent={this.goComponent}
                handleParentChange={newState => {
                  this.setState(newState);
                }}
                fetchCheckMsgs={this.fetchCheckMsgs}
                checksMonth={checksMonth}
              />

              {/* 已超时单位 */}
              <CompanyOver
                visible={companyOver}
                listData={hiddenDangerOverTime}
                goBack={this.goBack}
                goComponent={this.goComponent}
                goCompany={this.goCompany}
              />
            </Col>
          </Row>
        </article>
        <MyTooltip
          visible={tooltipVisible}
          title={tooltipName}
          position={tooltipPosition}
          offset={[10, 30]}
        />
      </div>
    );
  }
}

export default GovernmentBigPlatform;
