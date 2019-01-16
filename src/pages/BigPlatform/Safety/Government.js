import React, { Component } from 'react';
import { Row, Col, TreeSelect } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
// import classNames from 'classnames';
import styles from './Government.less';
import Timer from './Components/Timer';
import MapSection from './Sections/MapSection';
import MyTooltip from '../FireControl/section/Tooltip';

// import DangerCompany from './Sections/DangerCompany';
// import CheckInfo from './Sections/CheckInfo';
// import CompanyOver from './Sections/CompanyOver';
// import RiskDetail from './Sections/RiskDetail';
// import RiskDetailOver from './Sections/RiskDetailOver';
// import RiskOver from './Sections/RiskOver';
// import HdOverCompany from './Sections/HdOverCompany';
// import RiskColors from './Sections/RiskColors';
// import FullStaff from './Sections/FullStaff';
// import CompanyIn from './Sections/CompanyIn';
// import CompanyInfo from './Sections/CompanyInfo';
import CommunityCom from './Sections/CommunityCom';
import TopData from './Sections/TopData';
import HiddenDangerPie from './Sections/HiddenDangerPie';
// import RiskBar from './Sections/RiskBar';
import RiskPoint from './Sections/Drawers/RiskPoint';
import DangerCompanyDrawer from './Sections/Drawers/DangerCompanyDrawer';
import CheckBar from './Sections/CheckBar';
import CheckDrawer from './Sections/Drawers/CheckDrawer';
import RiskPointCompany from './Sections/Drawers/RiskPointCompany';
import DangerInfo from './Sections/Drawers/DangerInfo';
import OverComDrawer from './Sections/Drawers/OverComDrawer';
import ComInDrawer from './Sections/Drawers/ComInDrawer';
import FullStaffDrawer from './Sections/Drawers/FullStaffDrawer';
import OverHdCom from './Sections/Drawers/OverHdCom';
import CompanyInfoDrawer from './Sections/Drawers/CompanyInfoDrawer';

const { location: locationDefault, region } = global.PROJECT_CONFIG;

const sectionsVisible = {
  communityCom: false, // 社区接入单位数
  companyIn: false, // 接入单位统计
  fullStaff: false, // 监管人员统计
  overHd: false, // 已超期隐患
  hdCom: false, // 隐患单位统计
  comInfo: false, // 企业信息
  // riskColors: false, // 风险点
  hdOverDetail: false, // 已超期隐患详情
  hiddenDanger: false, // 隐患详情
  checks: false, // 安全检查
  companyOver: false, // 已超时单位
  riskOver: false, // 已超时风险点
  riskPoint: false, //风险点
};

const drawVisible = {
  riskPoint: false, // 风险点
  riskPointCompany: false, // 风险点-企业
  dangerCoDrawer: false, // 隐患单位
  dangerInfo: false, // 隐患详情
  checkDrawer: false, // 安全检查
  overComDrawer: false, // 已超时单位
  comInDrawer: false, // 单位统计
  fullStaffDrawer: false, // 专职人员统计
  overHdCom: false, // 已超期隐患单位
  overHdDetail: false, // 已超期隐患详情
  companyInfoDrawer: false, // 单位概况
};

export function getGridId(gridId, initVal = 'index') {
  return !gridId || gridId === initVal ? undefined : gridId;
}
@connect(({ bigPlatform, bigPlatformSafetyCompany, bigFireControl }) => ({
  bigPlatform,
  bigPlatformSafetyCompany,
  bigFireControl,
}))
class GovernmentBigPlatform extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectName: global.PROJECT_CONFIG.projectName,
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
      ...sectionsVisible,
      communityCom: true, // 社区接入单位数
      // companyIn: false, // 接入单位统计
      // fullStaff: false, // 监管人员统计
      // overHd: false, // 已超期隐患
      // hdCom: false, // 隐患单位统计
      // comInfo: false, // 企业信息
      // riskColors: false, // 风险点
      // hdOverDetail: false, // 已超期隐患详情
      // hiddenDanger: false, // 隐患详情
      // checks: false, // 安全检查
      // companyOver: false, // 已超时单位
      // riskOver: false, // 已超时风险点
      companyId: '',
      riskColorSummary: {
        riskColorTitle: '',
        risk: 0,
        abnormal: 0,
        company: 0,
        componentSubType: 'bar',
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
      checkNum: 0,
      treeValue: '',
      dangerCoTitle: '隐患单位统计',
      riskComName: '',
      ...drawVisible,
    };
  }

  // UNSAFE_componentWillUpdate() {
  //   requestAnimationFrame(this.resolveAnimationFrame);
  // }

  componentDidMount() {
    const { dispatch } = this.props;
    const gridId = this.getGridId();
    const isIndex = !gridId;
    // 是首页则获取网格点数组后第一个，不是首页则将值设为传入的gridId
    !isIndex && this.setState({ treeValue: gridId });
    dispatch({
      type: 'bigFireControl/fetchGrids',
      callback: isIndex
        ? data => this.setState({ treeValue: data && data.length ? data[0].key : '' })
        : null,
    });

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
        gridId,
      },
    });

    // dispatch({
    //   type: 'bigPlatform/fetchProjectName',
    //   payload: { gridId },
    // });

    // 大屏隐患点位总数据
    dispatch({
      type: 'bigPlatform/fetchListForMapForOptimize',
      payload: { gridId },
    });

    // dispatch({
    //   type: 'bigPlatform/fetchListForMap',
    // });

    dispatch({
      type: 'bigPlatform/fetchCountDangerLocation',
      payload: { gridId },
    });

    dispatch({
      type: 'bigPlatform/fetchLocation',
      payload: { gridId },
    });

    // 政府监管人员列表
    dispatch({
      type: 'bigPlatform/fetchGovFulltimeWorkerList',
      payload: { gridId },
    });

    // 获取超期未整改隐患企业列表
    dispatch({
      type: 'bigPlatform/fetchOverRectifyCompany',
      payload: { gridId },
    });

    // 查找重点和非重点单位
    dispatch({
      type: 'bigPlatform/fetchSearchAllCompany',
      payload: { gridId },
    });

    // // 隐患单位数量以及具体信息
    // dispatch({
    //   type: 'bigPlatform/fetchHiddenDangerCompany',
    //   payload: {
    //     // date: moment().format('YYYY-MM'),
    //   },
    // });

    dispatch({
      type: 'bigPlatform/fetchNewHomePage',
      payload: {
        month: moment().format('YYYY-MM'),
        gridId,
      },
    });

    // 获取已超时风险点总数
    dispatch({
      type: 'bigPlatform/fetchSelectOvertimeItemNum',
      payload: { gridId },
    });

    // 安全政府-超时未查单位
    dispatch({
      type: 'bigPlatform/fetchOvertimeUncheckedCompany',
      payload: { gridId },
    });

    // 已超时单位信息
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerOverTime',
      payload: {
        date: moment().format('YYYY-MM'),
        gridId,
      },
    });

    // 企业风险点
    dispatch({
      type: 'bigPlatform/fetchSelfCheckPoint',
      payload: {
        gridId,
      },
    });

    // 12迭代 安全检查柱状图
    dispatch({
      type: 'bigPlatform/fetchSecurityCheck',
      payload: {
        gridId,
      },
    });

    if (region === '无锡市') {
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

  getGridId = () => {
    const {
      match: {
        params: { gridId },
      },
    } = this.props;
    return getGridId(gridId);
  };

  // 某月安全检查相关信息
  fetchCheckMsgs = month => {
    const { dispatch } = this.props;
    const gridId = this.getGridId();
    // 监管人员检查信息
    dispatch({
      type: 'bigPlatform/fetchCheckInfo',
      payload: {
        date: month,
        gridId,
      },
    });

    // 本月隐患单位数量以及具体信息
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerCompany',
      payload: {
        date: month,
        gridId,
        reportSource: 2,
      },
    });

    // 监管人员检查信息 已检查和未检查单位数量
    dispatch({
      type: 'bigPlatform/fetchCompanyCheckCount',
      payload: {
        date: month,
        gridId,
      },
      success: data => {
        if (month === moment().format('YYYY-MM'))
          this.setState({ checkNum: data.fireCheckCompanyCount });
      },
    });

    // // 安全检查已查
    // dispatch({
    //   type: 'bigPlatform/fetchCheckedCompanyInfo',
    //   payload: {
    //     date: month,
    //     isChecked: '1',
    //     isNormal: '1',
    //     isOvertime: '1',
    //     pageNum: 1,
    //     pageSize: 1,
    //   },
    // success: num => {
    //   if (month === moment().format('YYYY-MM')) this.checkNum = num;
    // },
    // });

    // // 安全检查未查
    // dispatch({
    //   type: 'bigPlatform/fetchCheckedCompanyInfo',
    //   payload: {
    //     date: month,
    //     isChecked: '0',
    //     isNormal: '1',
    //     isOvertime: '1',
    //     pageNum: 1,
    //     pageSize: 1,
    //   },
    // });
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
    const gridId = this.getGridId();
    if (companyId === company.id) {
      if (!comInfo) {
        // this.goComponent('comInfo');
        this.setState({ companyInfoDrawer: true });
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
        gridId,
      },
      success: response => {
        this.companyInfo.initFull();
        // this.goComponent('comInfo');
        // this.setState({companyInfoDrawer: true});
        this.setState({
          companyInfoDrawer: true,
          infoWindowShow: true,
          infoWindow: {
            comapnyId: company.id,
            longitude: company.longitude,
            latitude: company.latitude,
            companyName: response.companyMessage.companyName,
          },
        });
        this.hideTooltip();
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
        gridId,
      },
    });
    // 风险点隐患
    dispatch({
      type: 'bigPlatform/fetchRiskDetail',
      payload: {
        company_id: id,
        // source_type: '3',
        gridId,
      },
    });
  };

  companyInfoRef = ref => {
    this.companyInfo = ref;
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
    if (e.target === this.lastTarget) return;
    const offset = e.target.getBoundingClientRect();
    this.lastTarget = e.target;
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

  onGridChange = value => {
    const { treeValue: formerValue } = this.state;
    // 选择的值与之前相同时，不做处理
    if (value === formerValue) return;
    this.setState({ treeValue: value });
    router.push(`/big-platform/safety/government/${value}`);
    location.reload();
  };

  closeAllDrawers = () => {
    this.setState({ ...drawVisible });
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
      projectName,
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
      checkNum,
      treeValue,
      dangerCoTitle,
      // drawer
      riskPoint,
      riskPointCompany,
      dangerCoDrawer,
      dangerInfo,
      checkDrawer,
      riskComName,
      overComDrawer,
      comInDrawer,
      fullStaffDrawer,
      overHdCom,
      overHdDetail,
      companyInfoDrawer,
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
        companyCheckCount,
        riskDetailList,
        selfCheckPoint = {},
        selfCheckPoint: { total: selfCheckPointTotal },
        securityCheck,
        riskDetailNoOrder,
      },
      bigFireControl: { grids },
    } = this.props;
    const gridId = this.getGridId();
    return (
      <div className={styles.main}>
        <header className={styles.mainHeader}>
          <span>{projectName}</span>
          <div className={styles.subHeader}>
            <Timer />
          </div>
          {grids.length > 0 && (
            <div className={styles.treeContainer}>
              {grids.length === 1 ? (
                <span>{grids[0].title}</span>
              ) : (
                <TreeSelect
                  value={treeValue}
                  dropdownClassName={styles.gridDropdown}
                  treeData={grids}
                  treeDefaultExpandAll
                  onChange={this.onGridChange}
                />
              )}
            </div>
          )}
        </header>

        <article className={styles.mainBody}>
          <Row gutter={12} className={styles.heightFull}>
            <Col span={6} className={styles.heightFull}>
              {/* <RiskBar
                dispatch={dispatch}
                countDangerLocation={countDangerLocation}
                goComponent={this.goComponent}
                handleParentChange={newState => {
                  this.setState(newState);
                }}
                gridId={gridId}
              /> */}

              <HiddenDangerPie
                dispatch={dispatch}
                goComponent={this.goComponent}
                hiddenDangerCompanyAll={hiddenDangerCompanyAll}
                listForMap={listForMapForOptimize}
                handleParentChange={newState => {
                  this.setState(newState);
                }}
                gridId={gridId}
                closeAllDrawers={this.closeAllDrawers}
              />

              <CheckBar
                dispatch={dispatch}
                goComponent={this.goComponent}
                data={securityCheck}
                handleParentChange={newState => {
                  this.setState(newState);
                }}
                fetchCheckMsgs={this.fetchCheckMsgs}
                closeAllDrawers={this.closeAllDrawers}
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
                selfCheckPointTotal={selfCheckPointTotal}
                selectOvertimeItemNum={selectOvertimeItemNum}
                checkedCompanyInfo={checkNum}
                handleParentChange={newState => {
                  this.setState(newState);
                }}
                fetchCheckMsgs={this.fetchCheckMsgs}
                closeAllDrawers={this.closeAllDrawers}
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
                handleParentChange={newState => {
                  this.setState(newState);
                }}
                goCompany={this.goCompany}
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
              {/* <CompanyInfo
                visible={comInfo}
                dispatch={dispatch}
                goBack={this.goBack}
                goCompany={this.goCompany}
                companyId={companyId}
                companyMessage={companyMessage}
                specialEquipment={specialEquipment}
                hiddenDangerListByDate={riskDetailList}
                onRef={this.companyInfoRef}
              /> */}

              {/* 单位统计 */}
              {/* <CompanyIn
                visible={companyIn}
                dispatch={dispatch}
                goBack={this.goBack}
                goCompany={this.goCompany}
                searchAllCompany={searchAllCompany}
              /> */}

              {/* 监管人员 */}
              {/* <FullStaff
                visible={fullStaff}
                dispatch={dispatch}
                goBack={this.goBack}
                goComponent={this.goComponent}
                listData={fulltimeWorkerList}
                fulltimeWorker={fulltimeWorker}
              /> */}

              {/* 风险点 */}
              {/* <RiskColors
                visible={riskColors}
                dispatch={dispatch}
                goBack={this.goBack}
                goCompany={this.goCompany}
                goComponent={this.goComponent}
                listData={dangerLocationCompanyData}
                riskColorSummary={riskColorSummary}
              /> */}

              {/* 已超期隐患单位 */}
              {/* <HdOverCompany
                visible={overHd}
                dispatch={dispatch}
                goBack={this.goBack}
                goCompany={this.goCompany}
                goComponent={this.goComponent}
                listData={overRectifyCompany}
                overRectifyNum={overRectifyNum}
                gridId={gridId}
              /> */}

              {/* 已超时风险点 */}
              {/* <RiskOver
                visible={riskOver}
                goBack={this.goBack}
                goCompany={this.goCompany}
                listData={overtimeUncheckedCompany}
                riskOverNum={selectOvertimeItemNum}
              /> */}

              {/* 已超期隐患详情 */}
              {/* <RiskDetailOver
                visible={hdOverDetail}
                goBack={this.goBack}
                hiddenDangerListByDate={riskDetailList}
              /> */}

              {/* 隐患详情 */}
              {/* <RiskDetail
                visible={hiddenDanger}
                goBack={this.goBack}
                hiddenDangerListByDate={hiddenDangerListByDate}
                riskDetailList={riskDetailList}
                lastSection={dangerCompanyLast}
              /> */}

              {/* 隐患单位统计 */}
              {/* <DangerCompany
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
                gridId={gridId}
                // monthSelecter={hdComMonth}
              /> */}

              {/* 安全检查 */}
              {/* <CheckInfo
                dispatch={dispatch}
                visible={checks}
                listData={checkInfo}
                checkedCompanyInfo={companyCheckCount}
                dangerCompany={hiddenDangerCompanyMonth}
                dangerCompanyOver={hiddenDangerOverTime}
                goBack={this.goBack}
                goComponent={this.goComponent}
                handleParentChange={newState => {
                  this.setState(newState);
                }}
                fetchCheckMsgs={this.fetchCheckMsgs}
                checksMonth={checksMonth}
                gridId={gridId}
              /> */}

              {/* 已超时单位 */}
              {/* <CompanyOver
                visible={companyOver}
                listData={hiddenDangerOverTime}
                goBack={this.goBack}
                goComponent={this.goComponent}
                goCompany={this.goCompany}
              /> */}
            </Col>
          </Row>
        </article>
        <MyTooltip
          visible={tooltipVisible}
          title={tooltipName}
          position={tooltipPosition}
          offset={[10, 30]}
        />

        {/* 风险点 */}
        <RiskPoint
          riskPointVisible={riskPointCompany}
          visible={riskPoint}
          dispatch={dispatch}
          goBack={this.goBack}
          goCompany={this.goCompany}
          goComponent={this.goComponent}
          data={selfCheckPoint}
          riskColorSummary={riskColorSummary}
          handleParentChange={newState => {
            this.setState(newState);
          }}
          closeAllDrawers={this.closeAllDrawers}
        />

        {/* 风险点-企业 */}
        <RiskPointCompany
          visible={riskPointCompany}
          handleParentChange={newState => {
            this.setState(newState);
          }}
          closeAllDrawers={this.closeAllDrawers}
          companyName={riskComName}
        />

        {/* 隐患单位统计 */}
        <DangerCompanyDrawer
          data={dangerCompanyData}
          visible={dangerCoDrawer}
          dispatch={dispatch}
          goCompany={this.goCompany}
          monthSelecter={false}
          lastSection={dangerCompanyLast}
          month={checksMonth}
          checkUserId={checkUserId}
          gridId={gridId}
          handleParentChange={newState => {
            this.setState(newState);
          }}
          dangerCoTitle={dangerCoTitle}
        />

        {/* 安全检查 */}
        <CheckDrawer
          dispatch={dispatch}
          visible={checkDrawer}
          listData={checkInfo}
          checkedCompanyInfo={companyCheckCount}
          dangerCompany={hiddenDangerCompanyMonth}
          dangerCompanyOver={hiddenDangerOverTime}
          goComponent={this.goComponent}
          handleParentChange={newState => {
            this.setState(newState);
          }}
          fetchCheckMsgs={this.fetchCheckMsgs}
          checksMonth={checksMonth}
          gridId={gridId}
        />

        {/* 隐患详情 */}
        <DangerInfo
          visible={dangerInfo}
          hiddenDangerListByDate={hiddenDangerListByDate}
          riskDetailList={riskDetailNoOrder}
          lastSection={dangerCompanyLast}
          handleParentChange={newState => {
            this.setState(newState);
          }}
        />

        {/* 已超时单位 */}
        <OverComDrawer
          visible={overComDrawer}
          listData={hiddenDangerOverTime}
          goCompany={this.goCompany}
          handleParentChange={newState => {
            this.setState(newState);
          }}
        />

        {/* 单位概况 */}
        <ComInDrawer
          visible={comInDrawer}
          goCompany={this.goCompany}
          searchAllCompany={searchAllCompany}
          handleParentChange={newState => {
            this.setState(newState);
          }}
        />

        {/* 监管人员 */}
        <FullStaffDrawer
          visible={fullStaffDrawer}
          goComponent={this.goComponent}
          listData={fulltimeWorkerList}
          fulltimeWorker={fulltimeWorker}
          handleParentChange={newState => {
            this.setState(newState);
          }}
        />

        {/* 已超期隐患单位 */}
        <OverHdCom
          visible={overHdCom}
          dispatch={dispatch}
          goCompany={this.goCompany}
          listData={overRectifyCompany}
          overRectifyNum={overRectifyNum}
          gridId={gridId}
          handleParentChange={newState => {
            this.setState(newState);
          }}
        />

        {/* 单位概况 */}
        <CompanyInfoDrawer
          visible={companyInfoDrawer}
          dispatch={dispatch}
          goCompany={this.goCompany}
          companyId={companyId}
          companyMessage={companyMessage}
          specialEquipment={specialEquipment}
          hiddenDangerListByDate={riskDetailNoOrder}
          onRef={this.companyInfoRef}
          handleParentChange={newState => {
            this.setState(newState);
          }}
        />
      </div>
    );
  }
}

export default GovernmentBigPlatform;
