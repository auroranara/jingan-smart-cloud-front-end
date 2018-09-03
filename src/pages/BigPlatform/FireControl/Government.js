import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col, Row } from 'antd';

import styles from './Government.less';
import Head from './Head';
import FcModule from './FcModule';
import FcSection from './section/FcSection';
import OverviewSection from './section/OverviewSection';
import AlarmSection from './section/AlarmSection';
import SystemSection from './section/SystemSection';
import TrendSection from './section/TrendSection';
import GridDangerSection from './section/GridDangerSection';
import FireControlMap from './section/FireControlMap';
// import bg from './bg.png';

import UnitLookUp from './section/UnitLookUp';
import UintLookUpBack from './section/UintLookUpBack';
import VideoPlay from './section/VideoPlay';

const HEIGHT_PERCNET = { height: '100%' };
const LOOKING_UP = 'lookingUp';
const OFF_GUARD = 'offGuardWarning';

const DELAY = 2000;

@connect(({ bigFireControl }) => ({ bigFireControl }))
export default class FireControlBigPlatform extends PureComponent {
  state = {
    isLookUpRotated: false,
    lookUpShow: LOOKING_UP,
    startLookUp: false,
    videoVisible: true,
  };

  componentDidMount() {
    this.initFetch();
    // this.timer = setInterval(this.polling, DELAY);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  timer = null;

  initFetch = () => {
    const { dispatch } = this.props;

    dispatch({ type: 'bigFireControl/fetchOvAlarmCounts' });
    dispatch({ type: 'bigFireControl/fetchOvDangerCounts' });
    dispatch({ type: 'bigFireControl/fetchSys' });
    dispatch({ type: 'bigFireControl/fetchAlarm' });
    dispatch({ type: 'bigFireControl/fetchFireTrend' });
    dispatch({ type: 'bigFireControl/fetchCompanyFireInfo' });
    dispatch({ type: 'bigFireControl/fetchDanger' });
    dispatch({
      type: 'bigFireControl/fetchAllCamera',
      payload: {
        company_id: '_w1_0hUYSGCADpw_WqUMFg', // companyId
      },
    });
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
    this.setState({ lookUpShow: LOOKING_UP, isLookUpRotated: true, startLookUp: true });
  };

  handleClickOffGuard = () => {
    this.setState({ lookUpShow: OFF_GUARD, isLookUpRotated: true });
  };

  handleUnitLookUpRotateBack = () => {
    this.setState({ isLookUpRotated: false, startLookUp: false });
  };

  handleVideoClose = () => {
    this.setState({
      videoVisible: false,
    });
  };

  handleVideoSelect = companyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bigFireControl/fetchAllCamera',
      payload: {
        company_id: '_w1_0hUYSGCADpw_WqUMFg', // companyId
      },
    });
  };

  render() {
    const {
      bigFireControl: { overview, alarm, sys, trend, danger, map, allCamera },
      dispatch,
    } = this.props;

    const { isLookUpRotated, lookUpShow, startLookUp, videoVisible } = this.state;

    const handleRotateMethods = {
      handleClickLookUp: this.handleClickLookUp,
      handleClickOffGuard: this.handleClickOffGuard,
    };

    return (
      <div
        className={styles.root}
        style={{ overflow: 'hidden', position: 'relative', width: '100%' }}
      >
        {/* <div className={styles.root} style={{ background: `url(${bg}) center center`, backgroundSize: 'cover' }}> */}
        <Head title="晶 安 智 慧 消 防 云 平 台" />
        <div className={styles.empty} />
        <Row
          style={{ height: 'calc(90% - 15px)', marginLeft: 0, marginRight: 0 }}
          gutter={{ xs: 4, sm: 8, md: 12, lg: 16 }}
        >
          <Col span={6} style={HEIGHT_PERCNET}>
            <FcModule className={styles.overview}>
              <OverviewSection ovData={overview} />
              <FcSection title="辖区概况反面" isBack />
            </FcModule>
            <div className={styles.gutter1} />
            <FcModule className={styles.alarmInfo}>
              <AlarmSection alarmData={alarm} dispatch={dispatch} />
              <FcSection title="警情信息反面" isBack />
            </FcModule>
          </Col>
          <Col span={12} style={HEIGHT_PERCNET}>
            <FcModule className={styles.map}>
              <FireControlMap map={map} alarm={alarm} />
              <FcSection title="Map Reverse" isBack />
            </FcModule>
            <div className={styles.gutter2} />
            <Row className={styles.center}>
              <Col span={12} className={styles.centerLeft}>
                <FcModule style={{ height: '100%' }}>
                  <TrendSection trendData={trend} />
                  <FcSection title="火警趋势反面" isBack />
                </FcModule>
              </Col>
              <Col span={12} className={styles.centerRight}>
                <FcModule style={{ height: '100%' }}>
                  <GridDangerSection dangerData={danger} />
                  <FcSection title="网格隐患巡查反面" isBack />
                </FcModule>
              </Col>
            </Row>
          </Col>
          <Col span={6} style={HEIGHT_PERCNET}>
            <FcModule className={styles.inspect} isRotated={isLookUpRotated}>
              <UnitLookUp handleRotateMethods={handleRotateMethods} />
              <UintLookUpBack
                handleRotateBack={this.handleUnitLookUpRotateBack}
                lookUpShow={lookUpShow}
                isLookUpRotated={isLookUpRotated}
                startLookUp={startLookUp}
              />
            </FcModule>
            <div className={styles.gutter3} />
            <FcModule className={styles.system}>
              <SystemSection sysData={sys} />
              <FcSection title="系统接入情况反面" isBack />
            </FcModule>
          </Col>
        </Row>
        <VideoPlay
          dispatch={dispatch}
          style={{}}
          videoList={allCamera}
          visible={videoVisible}
          keyId="" // keyId
          handleVideoClose={this.handleVideoClose.bind(this)}
        />
      </div>
    );
  }
}
