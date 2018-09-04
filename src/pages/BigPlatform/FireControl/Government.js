import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col, Modal, Row, message } from 'antd';

import { myParseInt } from './utils';
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
import VideoSection from './section/VideoSection';
// import bg from './bg.png';

import UnitLookUp from './section/UnitLookUp';
import UnitLookUpBack from './section/UnitLookUpBack';
import AlarmHandle from './section/AlarmHandle';
import VideoPlay from './section/VideoPlay';

// const { confirm } = Modal;
const { location } = global.PROJECT_CONFIG;

// const AUTO_LOOKUP_ROTATE = 1;
const AUTO_LOOKUP_ROTATE = 2;

const HEIGHT_PERCNET = { height: '100%' };
const LOOKING_UP = 'lookingUp';
const OFF_GUARD = 'offGuardWarning';

// const DELAY = 2000;
const LOOKING_UP_DELAY = 5000;

message.config({
  getContainer: () => {
    return document.querySelector('#unitLookUp') || document.querySelector('body');
  },
});

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
    showConfirm: false,
    confirmCount: 5,
    mapSelected: undefined,
    mapCenter: [location.x, location.y],
    mapZoom: location.zoom,
    mapShowInfo: false,
    videoVisible: false,
    videoKeyId: undefined,
  };

  componentDidMount() {
    this.initFetch();
    // this.timer = setInterval(this.polling, DELAY);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.confirmTimer);
    clearInterval(this.lookingUpTimer);
  }

  timer = null;
  confirmTimer = null;
  lookingUpTimer = null;
  mapItemList = [];
  // hasGotCreateTime = false;

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
    dispatch({
      type: 'bigFireControl/fetchInitLookUp',
      callback: (flag, recordsId) => {
        // flag用来判断状态，为2时，是有人正在查岗，自动跳转到正在查岗页面
        if (myParseInt(flag) === AUTO_LOOKUP_ROTATE) this.handleClickLookUp(true);

        // 当有查岗记录时，存在recordsId，则获取脱岗情况，否则没有查过岗，不用获取并默认显示0
        // recordsId = 'ZwNsxkTES_y5Beu560xF5w';
        recordsId && dispatch({ type: 'bigFireControl/fetchOffGuard', payload: { recordsId } });
      },
    });
    // dispatch({
    //   type: 'bigFireControl/fetchAllCamera',
    //   payload: {
    //     company_id: '_w1_0hUYSGCADpw_WqUMFg', // companyId
    //   },
    // });
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

  handleLookUpConfirmOk = () => {
    const { dispatch } = this.props;

    this.showLookUpConfirm();

    dispatch({
      type: 'bigFireControl/postLookingUp',
      callback: (code, msg) => {
        if (code === 200) {
          this.jumpToLookingUp();
          // 手动点击开始查岗时，在store中存入当前开始时间，虽然会和服务器开始时间不同，但差距不大，用来骗下用户
          dispatch({ type: 'bigFireControl/saveCreateTime', payload: Date.now() });
        } else message.error(msg);
        // message.error(msg, 0);
      },
    });
  };

  showLookUpConfirm = show => {
    this.setState({ showConfirm: !!show });
    clearInterval(this.confirmTimer);
  };

  renderConfirmModal() {
    const { showConfirm, confirmCount } = this.state;

    return (
      <Modal
        // title="提示"
        width={300}
        cancelText={`取消(${confirmCount})`}
        visible={showConfirm}
        closable={false}
        onOk={this.handleLookUpConfirmOk}
        onCancel={() => this.showLookUpConfirm()}
        // 关闭后将confirmCount重新设置为5
        afterClose={() => this.setState({ confirmCount: 5 })}
        getContainer={() => document.querySelector('#unitLookUp')}
      >
        您是否确定进行查岗操作？
      </Modal>
    );
  }

  handleClickLookUp = isAutoJump => {
    if (isAutoJump) {
      this.jumpToLookingUp();
      return;
    }

    let counter = 4;
    this.showLookUpConfirm(true);
    this.confirmTimer = setInterval(() => {
      if (counter) {
        this.setState({ confirmCount: counter });
        counter = counter - 1;
      }
      // 倒计时到0时，自动取消，并关掉当前modal
      else {
        this.showLookUpConfirm();
        // this.handleLookUpConfirmOk();
      }
    }, 1000);

    // confirm({
    //   title: '您是否确定进行单位查岗',
    //   okText: '确定',
    //   cancelText: '取消',
    //   onOk: this.handleLookUpConfirmOk,
    // });
  };

  // 跳转到正在查岗界面
  jumpToLookingUp = () => {
    const { dispatch } = this.props;

    // 开始轮询正在查岗数据(倒计时时候的数据)，可能会提早结束，所以轮询时判断返回的值，若提早结束，则直接赚回来
    this.lookingUpTimer = setInterval(() => {
      dispatch({
        type: 'bigFireControl/fetchCountdown',
        callback: ended => {
          if (ended) this.handleLookUpRotateBack(true);
        },
      });
    }, LOOKING_UP_DELAY);

    this.setState({ lookUpShow: LOOKING_UP, isLookUpRotated: true, startLookUp: true });
  };

  handleClickOffGuard = () => {
    this.setState({ lookUpShow: OFF_GUARD, isLookUpRotated: true });
  };

  // 不传，默认false，则只是翻回来，传true，则是倒计时结束后，自动翻回来，清除轮询正在查岗数据的定时器，并重新获取查岗历史记录
  handleLookUpRotateBack = (isCountdownBack = false) => {
    const { dispatch } = this.props;
    this.setState({ isLookUpRotated: false, startLookUp: false });

    if (isCountdownBack) {
      clearInterval(this.lookingUpTimer);
      // 为了防止后台没有处理完，延迟一点发送请求
      setTimeout(() => dispatch({ type: 'bigFireControl/fetchInitLookUp' }), 1500);
    }
  };

  handleAlarmRotate = () => {
    this.setState(({ isAlarmRotated }) => ({ isAlarmRotated: !isAlarmRotated }));
  };

  handleAlarmClick = alarmDetail => {
    // 将父组件翻到反面，地图设置zoom，center，及selected
    // console.log('mapItemList', this.mapItemList);
    const selected = this.mapItemList.find(({ id }) => id === alarmDetail.companyId);
    // console.log('selected', selected);
    this.handleMapSelected(selected, alarmDetail);
  };

  handleDangerRotate = () => {
    this.setState(({ isDangerRotated }) => ({ isDangerRotated: !isDangerRotated }));
  };

  // rotateAll = () => {
  //   this.setState(({ showReverse }) => ({ showReverse: !showReverse }));
  // };

  handleMapBack = (isAlarmRotatedInit=false, isFire=false) => {
    // 需要重置警情模块，即地图中返回时(且是从有火警的地图中返回，点击无火警的公司由于不需要翻页，返回时无需处理)，警情模块初始化为实时警情
    if (isAlarmRotatedInit && isFire)
      this.setState({ showReverse: false, isAlarmRotated: false, mapZoom: location.zoom, mapCenter: [location.x, location.y], mapSelected: undefined });
    // 警情详情中返回时，原来的状态保持不变
    else
      this.setState({ showReverse: false, mapZoom: location.zoom, mapCenter: [location.x, location.y], mapSelected: undefined });
  };

  handleMapSelected = (item, alarmDetail) => {
    const isInMap = !alarmDetail;
    const {
      dispatch,
      bigFireControl: {
        alarm: { list = [] },
      },
    } = this.props;

    const { id, isFire, latitude, longitude } = item;
    dispatch({ type: 'bigFireControl/fetchOvAlarmCounts', payload: { companyId: id } });
    dispatch({ type: 'bigFireControl/fetchOvDangerCounts', payload: { company_id: id } });
    dispatch({ type: 'bigFireControl/fetchCompanyOv', payload: { company_id: id } });
    dispatch({ type: 'bigFireControl/fetchFireTrend', payload: { companyId: id } });
    dispatch({ type: 'bigFireControl/fetchDanger', payload: { company_id: id } });

    // 点击火警或地图中的企业时，获取视频相关信息
    this.handleVideoSelect(id);

    // 如果从地图中选中时且没有火警，不需要翻转
    if (isInMap && !isFire) {
      this.setState({
        mapCenter: [longitude, latitude],
        mapZoom: 18,
        mapSelected: item,
        mapShowInfo: true,
      });
      return;
    }

    // 如果从实时警情或历史警情选中或从地图中选中且有火警，需要翻转
    let detail = alarmDetail;
    // 若alarmDetail没有传，则是在地图中点击的公司，所以在警情列表中筛选该公司的第一个警情，若传了，则是在警情列表中点击的，使用默认传入的alarmDetail
    if (!alarmDetail) detail = list.find(li => id === li.companyId);

    // 地图中选择的所属公司没有找到对应的火警，实际上这种情况不可能，但是为了防止后台数据错误，作此处理
    if (!detail) detail = {};

    const { 
      id: detailId, 
      // companyId, 
    } = detail;
    dispatch({ type: 'bigFireControl/fetchAlarmHandle', payload: { id: detailId } });

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
  setMapItemList = newList => {
    this.mapItemList = newList;
  };

  handleVideoShow = keyId => {
    this.setState({ videoVisible: true, videoKeyId: keyId });
  };

  handleVideoClose = () => {
    this.setState({ videoVisible: false, videoKeyId: undefined });
  };

  handleVideoSelect = companyId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'bigFireControl/fetchAllCamera',
      payload: {
        company_id: companyId, // companyId
      },
    });
  };

  render() {
    const {
      bigFireControl: {
        overview,
        companyOv,
        alarm,
        alarmHistory,
        sys,
        trend,
        companyTrend,
        danger,
        gridDanger,
        companyDanger,
        map,
        lookUp,
        countdown,
        offGuard,
        alarmProcess,
        allCamera,
      },
      dispatch,
    } = this.props;

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
      videoVisible,
      videoKeyId,
    } = this.state;

    // console.log(videoKeyId);

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
                  handleFetch={payload =>
                    dispatch({ type: 'bigFireControl/fetchAlarmHistory', payload })
                  }
                  handleClick={this.handleAlarmClick}
                />
              }
              reverse={
                <AlarmDetailSection detail={alarmDetail} handleReverse={() => this.handleMapBack()} />
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
                handleBack={isFire => this.handleMapBack(true, isFire)}
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
                  front={
                    <DangerSection
                      title="辖区隐患巡查"
                      backTitle="网格隐患巡查"
                      data={danger}
                      handleRotate={this.handleDangerRotate}
                    />
                  }
                  back={
                    <DangerSection
                      title="网格隐患巡查"
                      backTitle="辖区隐患巡查"
                      data={gridDanger}
                      handleRotate={this.handleDangerRotate}
                      isBack
                    />
                  }
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
              front={
                <UnitLookUp
                  data={lookUp}
                  handleClickLookUp={this.handleClickLookUp}
                  handleClickOffGuard={this.handleClickOffGuard}
                />
              }
              back={
                <UnitLookUpBack
                  dispatch={dispatch}
                  data={{ lookUp, countdown, offGuard }}
                  lookUpShow={lookUpShow}
                  startLookUp={startLookUp}
                  handleRotateBack={this.handleLookUpRotateBack}
                />
              }
              reverse={<AlarmHandle data={alarmProcess} />}
            />
            <div className={styles.gutter3} />
            <FcModule className={styles.system} isRotated={showReverse}>
              <SystemSection data={sys} />
              <VideoSection data={allCamera} showVideo={this.handleVideoShow} />
            </FcModule>
          </Col>
        </Row>
        {this.renderConfirmModal()}
        <VideoPlay
          dispatch={dispatch}
          // style={{}}
          videoList={allCamera}
          visible={videoVisible}
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleVideoClose}
        />
      </div>
    );
  }
}
