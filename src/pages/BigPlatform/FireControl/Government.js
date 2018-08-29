import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col, Row } from 'antd';

import styles from './Government.less';
import Head from './Head';
import FcModule from './FcModule';
// import FcMultiRotateModule from './FcMultiRotateModule';
import FcMultiRotateModule from './FcNewMultiRotateModule';
import FcSection from './section/FcSection';
import OverviewSection from './section/OverviewSection';
import OverviewBackSection from './section/OverviewBackSection';
import AlarmSection from './section/AlarmSection';
import AlarmDetailSection from './section/AlarmDetailSection';
import SystemSection from './section/SystemSection';
import TrendSection from './section/TrendSection';
import DangerSection from './section/DangerSection';
import FireControlMap from './section/FireControlMap';
// import bg from './bg.png';

import UnitLookUp from './section/UnitLookUp';
import UnitLookUpBack from './section/UnitLookUpBack';
import UnitLookUpReverse from './section/UnitLookUpReverse';

const { location } = global.PROJECT_CONFIG;

const HEIGHT_PERCNET = { height: '100%' };
const LOOKING_UP = 'lookingUp';
const OFF_GUARD = 'offGuardWarning';

const DELAY = 2000;

@connect(({ bigFireControl }) => ({ bigFireControl }))
export default class FireControlBigPlatform extends PureComponent {
  state = {
    alarmDetail: {},
    showReverse: false, // 父组件翻转
    isAlarmRotated: false,
    isDangerRotated: false,
    isLookUpRotated: false, // 单位查岗组件翻转
    lookUpShow: LOOKING_UP,
    startLookUp: false,
    mapSelected: undefined,
    mapCenter: [location.x, location.y],
    mapZoom: location.zoom,
    mapShowInfo: false,
  };

  componentDidMount() {
    this.initFetch();
    // this.timer = setInterval(this.polling, DELAY);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  timer = null;
  mapItemList = [];

  initFetch = () => {
    const { dispatch } = this.props;

    dispatch({ type: 'bigFireControl/fetchOvAlarmCounts' });
    dispatch({ type: 'bigFireControl/fetchOvDangerCounts' });
    dispatch({ type: 'bigFireControl/fetchSys' });
    dispatch({ type: 'bigFireControl/fetchAlarm' });
    dispatch({ type: 'bigFireControl/fetchAlarmHistory' });
    dispatch({ type: 'bigFireControl/fetchFireTrend' });
    dispatch({ type: 'bigFireControl/fetchCompanyFireInfo' });
    dispatch({ type: 'bigFireControl/fetchDanger' });
  };

  polling = () => {
    const { dispatch } = this.props;

    dispatch({ type: 'bigFireControl/fetchOvAlarmCounts' });
    dispatch({ type: 'bigFireControl/fetchOvDangerCounts' });
    dispatch({ type: 'bigFireControl/fetchSys' });
    // dispatch({ type: 'bigFireControl/fetchAlarm' });
    dispatch({ type: 'bigFireControl/fetchFireTrend' });
    // dispatch({ type: 'bigFireControl/fetchCompanyFireInfo' });
    dispatch({ type: 'bigFireControl/fetchDanger' });
  };

  handleClickLookUp = () => {
    this.setState(({ isLookUpRotated }) => ({ lookUpShow: LOOKING_UP, isLookUpRotated: !isLookUpRotated, startLookUp: true }));
  };

  handleClickOffGuard = () => {
    this.setState(({ isLookUpRotated }) => ({ lookUpShow: OFF_GUARD, isLookUpRotated: !isLookUpRotated }));
  };

  handleUnitLookUpRotateBack = () => {
    this.setState(({ isLookUpRotated }) => ({ isLookUpRotated: !isLookUpRotated }));
  };

  handleAlarmRotate = () => {
    this.setState(({ isAlarmRotated }) => ({ isAlarmRotated: !isAlarmRotated }));
  };

  handleAlarmClick = (alarmDetail) => {
    // 将父组件翻到反面，地图设置zoom，center，及selected
    // console.log('mapItemList', this.mapItemList);
    const selected = this.mapItemList.find(({ name }) => name === alarmDetail.name);
    // console.log('selected', selected);
    this.handleMapSelected(selected, alarmDetail);
  }

  handleDangerRotate = () => {
    this.setState(({ isDangerRotated }) => ({ isDangerRotated: !isDangerRotated }));
  };

  // rotateAll = () => {
  //   this.setState(({ showReverse }) => ({ showReverse: !showReverse }));
  // };

  handleMapBack = () => {
    this.setState({ showReverse: false, mapZoom: location.zoom, mapSelected: undefined });
  };

  handleMapSelected = (item, alarmDetail) => {
    const { dispatch, bigFireControl: { alarm: { list = [] } } } = this.props;

    const { id, name, latitude, longitude } = item;
    dispatch({ type: 'bigFireControl/fetchOvAlarmCounts', payload: { companyId: id } });
    dispatch({ type: 'bigFireControl/fetchOvDangerCounts', payload: { company_id: id } });
    dispatch({ type: 'bigFireControl/fetchCompanyOv', payload: { company_id: id } });
    dispatch({ type: 'bigFireControl/fetchFireTrend', payload: { companyId: id } });
    dispatch({ type: 'bigFireControl/fetchDanger', payload: { company_id: id } });

    let detail = alarmDetail;
    // 若alarmDetail没有传，则是在地图中点击的公司，所以在警情列表中筛选该公司的第一个警情，若传了，则是在警情列表中点击的
    if (!alarmDetail)
      detail = list.find(li => name === li.name);

    if (!detail)
      detail = {};

    this.setState({
      showReverse: true,
      alarmDetail: detail,
      mapCenter: [longitude, latitude],
      mapZoom: 18,
      mapSelected: item,
      mapShowInfo: true,
    });
  };

  handleMapInfoClose = () => {
    this.setState({ mapShowInfo: false });
  };

  // 将地图组件中处理的list缓存到当前组件中
  setMapItemList = (newList) => {
    this.mapItemList = newList;
  };

  render() {
    const {
      bigFireControl: { overview, companyOv, alarm, alarmHistory, sys, trend, companyTrend, danger, gridDanger, companyDanger, map },
      dispatch,
    } = this.props;

    console.log(danger, gridDanger, companyDanger);

    const {
      isAlarmRotated,
      isDangerRotated,
      isLookUpRotated,
      mapZoom,
      mapCenter,
      mapSelected,
      mapShowInfo,
      alarmDetail,
      lookUpShow,
      startLookUp,
      showReverse,
    } = this.state;

    const handleRotateMethods = {
      handleClickLookUp: this.handleClickLookUp,
      handleClickOffGuard: this.handleClickOffGuard,
    };

    return (
      <div className={styles.root}>
      {/* <div className={styles.root} style={{ background: `url(${bg}) center center`, backgroundSize: 'cover' }}> */}
        <Head title="晶 安 智 慧 消 防 云 平 台" />
        <div className={styles.empty} />
        <Row style={{ height: 'calc(90% - 15px)', marginLeft: 0, marginRight: 0 }} gutter={{ xs: 4, sm: 8, md: 12, lg: 16 }}>
          <Col span={6} style={HEIGHT_PERCNET}>
            <FcModule className={styles.overview} isRotated={showReverse}>
              <OverviewSection data={overview} />
              <OverviewBackSection data={{ selected: mapSelected, companyOv }} />
            </FcModule>
            <div className={styles.gutter1} />
            {/* <FcModule className={styles.alarmInfo} isRotated={showReverse}>
              <AlarmSection
                title="警情信息"
                data={alarm}
                handleFetch={payload => dispatch({ type: 'bigFireControl/fetchAlarm', payload })}
                reverse={this.rotateAll}
              />
              <FcSection title="警情信息反面" isBack><Button onClick={this.rotateAll}>BACK</Button></FcSection>
            </FcModule> */}
            <FcMultiRotateModule
              className={styles.alarmInfo}
              isRotated={isAlarmRotated}
              showReverse={showReverse}
              front={
                <AlarmSection
                  data={alarm}
                  title="警情信息"
                  backTitle="历史火警"
                  handleRotate={this.handleAlarmRotate}
                  handleFetch={payload => dispatch({ type: 'bigFireControl/fetchAlarm', payload })}
                  handleClick={this.handleAlarmClick}
                />
              }
              back={
                <AlarmSection
                  isBack
                  data={alarmHistory}
                  title="历史火警"
                  backTitle="实时火警"
                  handleRotate={this.handleAlarmRotate}
                  handleFetch={payload => dispatch({ type: 'bigFireControl/fetchAlarmHistory', payload })}
                  handleClick={this.handleAlarmClick}
                />
              }
              reverse={
                <AlarmDetailSection
                  detail={alarmDetail}
                  handleReverse={this.handleMapBack}
                />
              }
            />
          </Col>
          <Col span={12} style={HEIGHT_PERCNET}>
            <FcModule className={styles.map}>
              <FireControlMap
                map={map}
                alarm={isAlarmRotated ? alarmHistory : alarm}
                zoom={mapZoom}
                center={mapCenter}
                selected={mapSelected}
                showInfo={mapShowInfo}
                handleBack={this.handleMapBack}
                handleInfoClose={this.handleMapInfoClose}
                handleSelected={this.handleMapSelected}
                setMapItemList={this.setMapItemList}
              />
              <FcSection title="Map Reverse" isBack />
            </FcModule>
            <div className={styles.gutter2} />
            <Row className={styles.center}>
              <Col span={12} className={styles.centerLeft}>
                <FcModule style={{ height: '100%' }} isRotated={showReverse}>
                  <TrendSection title="火警趋势" data={trend} />
                  <TrendSection title="单位火警趋势" data={companyTrend} isBack />
                </FcModule>
              </Col>
              <Col span={12} className={styles.centerRight}>
                {/* <FcModule style={{ height: '100%' }} isRotated={showReverse}>
                  <DangerSection title="网格隐患巡查" data={danger} />
                  <FcSection title="网格隐患巡查反面" isBack />
                </FcModule> */}
                <FcMultiRotateModule
                  style={{ height: '100%' }}
                  isRotated={isDangerRotated}
                  showReverse={showReverse}
                  front={<DangerSection title="辖区隐患巡查" backTitle="网格隐患巡查" data={danger} handleRotate={this.handleDangerRotate} />}
                  back={<DangerSection title="网格隐患巡查" backTitle="辖区隐患巡查" data={gridDanger} handleRotate={this.handleDangerRotate} isBack />}
                  reverse={<DangerSection title="单位隐患巡查" data={companyDanger} isBack />}
                />
              </Col>
            </Row>
          </Col>
          <Col span={6} style={HEIGHT_PERCNET}>
            {/* <FcMultiRotateModule
              className={styles.inspect}
              isRotated={isLookUpRotated}
              showReverse={showReverse}
              front={<UnitLookUp handleRotateMethods={handleRotateMethods} />}
              back={<UnitLookUpBack
                handleRotateBack={this.handleUnitLookUpRotateBack}
                lookUpShow={lookUpShow}
                startLookUp={startLookUp}
              />}
              reverse={<UnitLookUpReverse isBack={isLookUpRotated} />}
            /> */}
            <FcMultiRotateModule
              className={styles.inspect}
              isRotated={isLookUpRotated}
              showReverse={showReverse}
              front={<UnitLookUp handleRotateMethods={handleRotateMethods} />}
              back={
                <UnitLookUpBack
                  handleRotateBack={this.handleUnitLookUpRotateBack}
                  lookUpShow={lookUpShow}
                  startLookUp={startLookUp}
                />
              }
              reverse={<UnitLookUpReverse />}
            />
            <div className={styles.gutter3} />
            <FcModule className={styles.system} isRotated={showReverse}>
              <SystemSection sysData={sys} />
              <FcSection title="系统接入情况反面" isBack />
            </FcModule>
          </Col>
        </Row>
      </div>
    );
  }
}
