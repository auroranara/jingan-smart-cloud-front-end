import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Col, message, Modal, notification, Row } from 'antd';

import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import { myParseInt, getNewAlarms, getGridId } from './utils';
import styles from './Government.less';
// import Head from './Head';
import GridSelect from './components/GridSelect';
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
import Tooltip from './section/Tooltip';
import UnitLookUp from './section/UnitLookUp';
import UnitLookUpBack from './section/UnitLookUpBack';
import AlarmHandle from './section/AlarmHandle';
import VideoPlay from './section/VideoPlay';
import UnitDrawer from './section/UnitDrawer';
import UnitDangerDrawer from './section/UnitDangerDrawer';
import HostDrawer from './section/HostDrawer';
import AlarmDrawer from './section/AlarmDrawer';
// import DangerTableDrawer from './section/DangerTableDrawer';
import DangerDrawer from './section/DangerDrawer';
import SafeDrawer from './section/SafeDrawer';
import RiskDrawer from './section/RiskDrawer';

const { location, region, projectName } = global.PROJECT_CONFIG;

// const AUTO_LOOKUP_ROTATE = 1;
const AUTO_LOOKUP_ROTATE = 2;

const HEIGHT_PERCNET = { height: '100%' };
const LOOKING_UP = 'lookingUp';
const OFF_GUARD = 'offGuardWarning';
const VIDEO_LOOK_UP = 'videoLookUp';
const VIDEO_ALARM = 'videoAlarm';

const DELAY = 2000;
const LOOKING_UP_DELAY = 5000;

message.config({
  getContainer: () => {
    // console.log(document.querySelector('#unitLookUp'));
    return document.querySelector('#unitLookUp') || document.querySelector('body');
  },
});

@connect(({ bigFireControl, user, loading }) => ({
  bigFireControl,
  user,
  offGuardWarnLoading: loading.effects['bigFireControl/offGuardWarn'],
  dangerCardLoading: loading.effects['bigFireControl/fetchDangerRecords'],
}))
export default class FireControlBigPlatform extends PureComponent {
  state = {
    alarmDetail: {},
    showReverse: false, // 父组件翻转
    isAlarmRotated: false,
    isDangerRotated: false,
    isLookUpRotated: false, // 单位查岗组件翻转
    lookUpShow: LOOKING_UP,
    // recordsId: undefined,
    isLookingUp: false,
    startLookUp: false,
    showConfirm: false,
    confirmCount: 5,
    mapSelected: undefined,
    mapCenter: [location.x, location.y],
    mapZoom: location.zoom,
    mapShowInfo: false,
    videoVisible: false,
    videoKeyId: undefined,
    showVideoList: false,
    videoState: VIDEO_ALARM,
    tooltipName: '',
    tooltipVisible: false,
    tooltipPosition: [0, 0],
    unitDrawerVisible: false,
    unitDrawerLabelIndex: 0, // unitDrawer的最顶部标签的切换
    unitDangerDrawerVisible: false,
    unitDangerLabelIndex: 0, // 单位隐患列表中的小标签切换
    hostIndex: -1, // 消防主机抽屉中被选中的卡片序号
    hostDrawerVisible: false,
    alarmDrawerVisible: false,
    alarmDrawerLeftType: 0,
    alarmDrawerRightType: 0,
    // dangerTableDrawerVisible: false,
    dangerDrawerVisible: false,
    dangerLabelIndex: 0, // 企业隐患列表(由隐患排名表格点击的抽屉)的小标签切换
    safeDrawerVisible: false,
    riskDrawerVisible: false,
  };

  componentDidMount() {
    // const { match: { params: { gridId } } } = this.props;

    this.initFetch();
    this.timer = setInterval(this.polling, DELAY);
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
  dropdownDOM = null;
  formerAlarmList = [];
  // isLookingUp = false; // 标记正在查岗状态
  companyId = '';
  // 将FireControlMap中的设置searchValue值的函数挂载到当前组件上，虽然违反了React的数据单项流动的规则，但是这样做可以尽量少的修改代码
  clearSearchValueInMap = null;

  setClearSearchValueFnInMap = f => {
    this.clearSearchValueInMap = f;
  };

  getGridId = () => {
    const {
      match: {
        params: { gridId },
      },
    } = this.props;

    return getGridId(gridId);
  };

  initFetch = () => {
    const { dispatch } = this.props;

    const gridId = this.getGridId();

    dispatch({ type: 'bigFireControl/fetchOvAlarmCounts', payload: { gridId } });
    dispatch({ type: 'bigFireControl/fetchOvDangerCounts', payload: { gridId, businessType: 2 } });
    dispatch({ type: 'bigFireControl/fetchSys', payload: { gridId } });
    dispatch({ type: 'bigFireControl/fetchAlarm', payload: { gridId } });
    dispatch({ type: 'bigFireControl/fetchAlarmHistory', payload: { gridId } });
    dispatch({ type: 'bigFireControl/fetchFireTrend', payload: { gridId } });
    dispatch({ type: 'bigFireControl/fetchCompanyFireInfo', payload: { gridId } });
    dispatch({ type: 'bigFireControl/fetchDanger', payload: { gridId, businessType: 2 } });

    dispatch({ type: 'bigFireControl/fetchDangerList', payload: { gridId, businessType: 2 } });
    dispatch({ type: 'bigFireControl/fetchHostAlarmTrend', payload: { gridId } });

    this.fetchInitLookUp();

    if (region === '无锡市') {
      // 获取网格区域
      dispatch({
        type: 'bigFireControl/fetchMapLocation',
        payload: {
          gridId: 'gH3B8GRpQlyP1IWIw5BTPA',
        },
      });
    }

    this.fetchLookUpVideo();
  };

  polling = () => {
    const { dispatch } = this.props;
    const gridId = this.getGridId();

    // 只需要轮询火警相关，其他不必轮询
    dispatch({ type: 'bigFireControl/fetchOvAlarmCounts', payload: { gridId } });
    dispatch({
      type: 'bigFireControl/fetchAlarm',
      payload: { gridId },
      callback: (list = []) => {
        // console.log(list);
        const newAlarms = getNewAlarms(list, this.formerAlarmList);
        const companyIds = [];
        if (newAlarms.length)
          for (let i = 0; i < newAlarms.length; i++) {
            const { id, comapnyId, name, saveTimeStamp } = newAlarms[i];
            // 单次警告时，相同企业只警告一次
            if (!companyIds.includes(comapnyId)) {
              companyIds.push(comapnyId);
              notification.warning({
                key: id,
                className: styles.note,
                placement: 'bottomLeft',
                message: moment(saveTimeStamp).format('YYYY-MM-DD HH:mm:ss'),
                description: (
                  <span
                    className={styles.desc}
                    onClick={e => {
                      this.handleReverseById(id);
                      notification.close(id);
                    }}
                  >
                    {`${name}发生火警，请查看！`}
                  </span>
                ),
                duration: null,
              });
            }
          }

        this.formerAlarmList = list;
      },
    });
    dispatch({ type: 'bigFireControl/fetchAlarmHistory', payload: { gridId } });

    dispatch({ type: 'bigFireControl/fetchSys', payload: { gridId } });
    // dispatch({ type: 'bigFireControl/fetchCompanyFireInfo' });

    // dispatch({ type: 'bigFireControl/fetchOvDangerCounts' });
    // dispatch({ type: 'bigFireControl/fetchSys' });
    // dispatch({ type: 'bigFireControl/fetchFireTrend' });
    // dispatch({ type: 'bigFireControl/fetchDanger' });
  };

  // 在实时警情中根据id或companyId获取符合条件的最新的火警，然后翻转卡片
  handleReverseById = (id, prop = 'id') => {
    const {
      bigFireControl: {
        alarm: { list = [] },
      },
    } = this.props;
    const alarmDetail = list.find(item => item[prop] === id) || {};
    this.handleAlarmClick(alarmDetail);
  };

  fetchInitLookUp = () => {
    const {
      dispatch,
      // match: { params: { gridId } },
    } = this.props;

    const gridId = this.getGridId();

    dispatch({
      type: 'bigFireControl/fetchInitLookUp',
      payload: { gridId },
      callback: (flag, recordsId) => {
        // flag用来判断状态，为2时，是有人正在查岗，自动跳转到正在查岗页面
        if (myParseInt(flag) === AUTO_LOOKUP_ROTATE) {
          this.handleClickLookUp(true);
        }

        // 当有查岗记录时，存在recordsId，则获取脱岗情况，否则没有查过岗，不用获取并默认显示0
        // recordsId = 'ZwNsxkTES_y5Beu560xF5w';
        // this.setState({ recordsId });
        this.recordsId = recordsId;
        recordsId &&
          dispatch({ type: 'bigFireControl/fetchOffGuard', payload: { recordsId, gridId } });
      },
    });
  };

  handleLookUpConfirmOk = () => {
    const {
      dispatch,
      // match: { params: { gridId } },
    } = this.props;

    const gridId = this.getGridId();
    this.showLookUpConfirm();

    dispatch({
      type: 'bigFireControl/postLookingUp',
      payload: { gridId },
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
  };

  // 跳转到正在查岗界面
  jumpToLookingUp = () => {
    const {
      dispatch,
      // match: { params: { gridId } },
    } = this.props;

    const gridId = this.getGridId();

    // 状态改为正在查岗
    this.setState({ isLookingUp: true });

    // 开始轮询正在查岗数据(倒计时时候的数据)，可能会提早结束，所以轮询时判断返回的值，若提早结束，则直接赚回来
    this.lookingUpTimer = setInterval(() => {
      dispatch({
        type: 'bigFireControl/fetchCountdown',
        payload: { gridId },
        callback: ended => {
          if (ended) this.handleLookUpRotateBack(true);
        },
      });
    }, LOOKING_UP_DELAY);

    this.setState({ lookUpShow: LOOKING_UP, isLookUpRotated: true, startLookUp: true });
  };

  // 正在查岗时，翻转到正在查岗页面，普通翻转，并不需要上个函数那些开始查岗进行的操作
  turnToLookingUp = () => {
    this.setState({ lookUpShow: LOOKING_UP, isLookUpRotated: true, startLookUp: false });
  };

  handleClickOffGuard = () => {
    this.setState({ lookUpShow: OFF_GUARD, isLookUpRotated: true });
  };

  // 不传，默认false，则只是翻回来，传true，则是倒计时结束后，自动翻回来，清除轮询正在查岗数据的定时器，正在查岗状态改为false，并重新获取查岗历史记录
  handleLookUpRotateBack = (isCountdownBack = false) => {
    const {
      dispatch,
      // match: { params: { gridId } },
    } = this.props;

    const gridId = this.getGridId();

    this.setState({ isLookUpRotated: false, startLookUp: false });

    // 翻回来时重新更新offGuard
    const recordsId = this.recordsId;
    recordsId && dispatch({ type: 'bigFireControl/fetchOffGuard', payload: { recordsId, gridId } });

    if (isCountdownBack) {
      this.setState({ isLookingUp: false });
      clearInterval(this.lookingUpTimer);
      // 为了防止后台没有处理完，延迟一点发送请求
      setTimeout(() => this.fetchInitLookUp(), 1000);
    }
  };

  handleClickVideoLookUp = () => {
    this.setState({ isLookUpRotated: true, lookUpShow: VIDEO_LOOK_UP });
  };

  handleVideoLookUpRotate = () => {
    this.setState({ isLookUpRotated: false });
  };

  fetchLookUpVideo = (value = '') => {
    const {
      dispatch,
      // match: { params: { gridId } },
    } = this.props;

    const gridId = this.getGridId();

    dispatch({
      type: 'bigFireControl/fetchVideoLookUp',
      payload: { searchName: value, gridId },
    });
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

  handleMapBack = (isAlarmRotatedInit = false, isFire = false) => {
    // 需要重置警情模块，即地图中返回时(且是从有火警的地图中返回，点击无火警的公司由于不需要翻页，返回时无需处理)，警情模块初始化为实时警情
    if (isAlarmRotatedInit && isFire)
      this.setState({
        showReverse: false,
        isAlarmRotated: false,
        mapZoom: location.zoom,
        // mapCenter: [location.x, location.y],
        mapSelected: undefined,
      });
    // 警情详情中返回时，原来的状态保持不变
    else
      this.setState({
        showReverse: false,
        mapZoom: location.zoom,
        // mapCenter: [location.x, location.y],
        mapSelected: undefined,
      });
  };

  handleMapSelected = (item, alarmDetail) => {
    const isInMap = !alarmDetail;
    const {
      // match: { params: { gridId } },
      dispatch,
      bigFireControl: {
        alarm: { list = [] },
      },
    } = this.props;

    const gridId = this.getGridId();

    const { id, isFire, latitude, longitude } = item;
    dispatch({ type: 'bigFireControl/fetchOvAlarmCounts', payload: { companyId: id, gridId } });
    dispatch({
      type: 'bigFireControl/fetchOvDangerCounts',
      payload: { company_id: id, gridId, businessType: 2 },
    });
    dispatch({ type: 'bigFireControl/fetchCompanyOv', payload: { company_id: id, gridId } });
    dispatch({ type: 'bigFireControl/fetchFireTrend', payload: { companyId: id, gridId } });
    dispatch({
      type: 'bigFireControl/fetchDanger',
      payload: { company_id: id, gridId, businessType: 2 },
    });
    dispatch({ type: 'bigFireControl/fetchRiskPoints', payload: { company_id: id } });
    dispatch({ type: 'bigFireControl/fetchSafeMan', payload: { company_id: id } });

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
    dispatch({ type: 'bigFireControl/fetchAlarmHandle', payload: { id: detailId, gridId } });

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

  handleVideoShow = (keyId, showList = true, videoState = VIDEO_ALARM) => {
    this.setState({ videoVisible: true, videoKeyId: keyId, showVideoList: showList, videoState });
  };

  handleVideoClose = () => {
    this.setState({ videoVisible: false, videoKeyId: undefined });
  };

  handleVideoSelect = companyId => {
    const {
      dispatch,
      // match: { params: { gridId } },
    } = this.props;
    const gridId = this.getGridId();
    dispatch({
      type: 'bigFireControl/fetchAllCamera',
      payload: {
        company_id: companyId, // companyId
        gridId,
      },
    });
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
    this.setState({ tooltipVisible: false });
  };

  handleDrawerVisibleChange = (name, rest) => {
    const stateName = `${name}DrawerVisible`;
    this.setState(state => ({
      [stateName]: !state[stateName],
      ...rest,
    }));
  };

  // 概况中单位弹框的搜索
  // handleUnitSearch = v => {
  //   const { dispatch } = this.props;
  //   const gridId = this.getGridId();
  //   dispatch({ type: 'bigFireControl/fetchSys', payload: { gridId, companyName: v } });
  // };

  handleUnitDrawerLabelSwitch = i => {
    const { dispatch } = this.props;
    const gridId = this.getGridId();

    this.setState({ unitDrawerLabelIndex: i });
    dispatch({ type: 'bigFireControl/fetchSys', payload: { gridId } });
  };

  handleAlarmDrawerChange = (key, val) => {
    // console.log(key, val);
    const keys = [];
    const vals = [];
    if (!Array.isArray(key)) {
      keys[0] = key;
      vals[0] = val;
    }

    this.setState(
      keys.reduce((prev, next, i) => {
        prev[`alarmDrawer${next}Type`] = vals[i];
        return prev;
      }, {})
    );
  };

  fetchDangerRecords = companyId => {
    const { dispatch } = this.props;
    this.companyId = companyId;

    dispatch({
      type: 'bigFireControl/fetchDangerRecords',
      payload: { company_id: companyId, businessType: 2 },
    });
  };

  handleShowDangerBase = (companyId, labelIndex, type = 'danger') => {
    this.fetchDangerRecords(companyId);
    this.handleDrawerVisibleChange(type);
    this.setState({ [`${type}LabelIndex`]: labelIndex });
  };

  handleShowUnitDanger = (companyId, labelIndex = 0) => {
    this.handleShowDangerBase(companyId, labelIndex, 'unitDanger');

    // this.fetchDangerRecords(companyId);
    // this.handleDrawerVisibleChange('unitDanger');
    // this.setState({ unitDangerLabelIndex: 0 });
  };

  // handleShowDanger = (companyId, labelIndex) => {
  //   this.handleShowDangerBase(companyId, labelIndex);
  // };

  handleUnitDangerLabelClick = index => {
    this.setState({ unitDangerLabelIndex: index });
  };

  handleDangerLabelClick = (index, companyId) => {
    // 手动重置，不选择标签
    if (index === -1) {
      this.setState({ dangerLabelIndex: -1 });
      return;
    }

    if (!companyId) return;

    const formerCompanyId = this.companyId;
    const { dangerLabelIndex: formerLabelIndex } = this.state;
    // 如果在原选中标签上点击，则将当前选中标签去掉，并将隐患列表收上去
    if (formerCompanyId === companyId && index === formerLabelIndex) {
      this.setState({ dangerLabelIndex: -1 });
      return;
    }

    this.setState({ dangerLabelIndex: index });
    if (companyId !== formerCompanyId) this.fetchDangerRecords(companyId);
  };

  // 正面的概况模块的单位抽屉中点击主机状态的报警
  handleUnitDrawerAlarmClick = (companyId, drawer = 'unit') => {
    const {
      bigFireControl: {
        alarm: { list = [] },
      },
    } = this.props;
    const alarmDetail = list.find(item => item.companyId === companyId) || {};
    this.handleAlarmClick(alarmDetail);
    this.handleDrawerVisibleChange(drawer);
  };

  // 正面的概况模块的火警抽屉中点击警情卡片
  handleAlarmDrawerCardClick = id => {
    const {
      bigFireControl: {
        alarmHistory: { list = [] },
      },
    } = this.props;
    const alarmDetail = list.find(item => item.id === id) || {};
    this.handleAlarmClick(alarmDetail);
    this.handleDrawerVisibleChange('alarm');
  };

  // 反面的概况模块的火警抽屉中点击警情卡片
  handleUnitAlarmDrawerCardClick = id => {
    const {
      dispatch,
      bigFireControl: {
        alarmHistory: { list = [] },
      },
    } = this.props;
    const gridId = this.getGridId();
    const alarmDetail = list.find(item => item.id === id) || {};

    this.setState({ alarmDetail });
    this.handleDrawerVisibleChange('alarm');
    dispatch({ type: 'bigFireControl/fetchAlarmHandle', payload: { id: alarmDetail.id, gridId } });
  };

  handleSysClick = i => {
    this.setState({ hostIndex: i });
    this.handleDrawerVisibleChange('host');
  };

  render() {
    const {
      // match: { params: { gridId } },
      bigFireControl: {
        overview,
        companyOv,
        govAlarm, // 概况中的火警信息(政府)
        comAlarm, // 概况中的火警信息(企业)
        alarm,
        alarmHistory,
        sys,
        trend,
        companyTrend,
        danger,
        dangerList, // 隐患企业列表
        dangerRecords, // 对应企业的隐患列表
        gridDanger,
        companyDanger,
        map,
        lookUp,
        countdown,
        offGuard,
        alarmProcess,
        allCamera,
        videoLookUp,
        lookUpCamera,
        mapLocation,
        grids,
        riskPoints,
        safeMan,
        hostAlarmTrend,
      },
      dispatch,
      offGuardWarnLoading,
      dangerCardLoading,
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
      // recordsId,
      isLookingUp,
      startLookUp,
      showReverse,
      videoVisible,
      videoKeyId,
      showVideoList,
      videoState,
      tooltipName,
      tooltipVisible,
      tooltipPosition,
      unitDrawerVisible,
      unitDrawerLabelIndex,
      unitDangerDrawerVisible,
      unitDangerLabelIndex,
      hostIndex,
      hostDrawerVisible,
      alarmDrawerVisible,
      alarmDrawerLeftType,
      alarmDrawerRightType,
      // dangerTableDrawerVisible,
      dangerLabelIndex,
      dangerDrawerVisible,
      safeDrawerVisible,
      riskDrawerVisible,
    } = this.state;

    // console.log(user);

    const gridId = this.getGridId();
    const newOffGuard = {
      unitName: overview.titleName,
      // recordsId,
      ...offGuard,
    };

    const extra = <GridSelect dispatch={dispatch} data={grids} gridId={gridId} />;

    return (
      <BigPlatformLayout extra={extra} className={styles.root}>
        {/* <div
        className={styles.root}
        style={{ overflow: 'hidden', position: 'relative', width: '100%' }}
      > */}
        {/* <div className={styles.root} style={{ background: `url(${bg}) center center`, backgroundSize: 'cover' }}> */}
        {/* <Head
          title={projectName.split('').join(' ')}
          dispatch={dispatch}
          data={grids}
          gridId={gridId}
        />
        <div className={styles.empty} /> */}
        <Row
          style={{ height: '100%', marginLeft: 0, marginRight: 0, padding: '15px 12px' }}
          // style={{ height: 'calc(90% - 15px)', marginLeft: 0, marginRight: 0 }}
          gutter={{ xs: 4, sm: 8, md: 12, lg: 16 }}
        >
          <Col span={6} style={HEIGHT_PERCNET}>
            <FcModule className={styles.overview} isRotated={showReverse}>
              <OverviewSection
                data={overview}
                handleDrawerVisibleChange={this.handleDrawerVisibleChange}
              />
              <OverviewBackSection
                data={{ selected: mapSelected, companyOv }}
                handleShowUnitDanger={this.handleShowUnitDanger}
                handleDrawerVisibleChange={this.handleDrawerVisibleChange}
              />
            </FcModule>
            <div className={styles.gutter1} />
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
                  handleFetch={payload =>
                    dispatch({ type: 'bigFireControl/fetchAlarm', payload: { ...payload, gridId } })
                  }
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
                    dispatch({
                      type: 'bigFireControl/fetchAlarmHistory',
                      payload: { ...payload, gridId },
                    })
                  }
                  handleClick={this.handleAlarmClick}
                />
              }
              reverse={
                <AlarmDetailSection
                  detail={alarmDetail}
                  handleReverse={() => {
                    this.handleMapBack();
                    this.clearSearchValueInMap && this.clearSearchValueInMap();
                  }}
                />
              }
            />
          </Col>
          <Col span={12} style={HEIGHT_PERCNET}>
            <FcModule className={styles.map}>
              <FireControlMap
                map={map}
                polygon={mapLocation}
                alarm={alarm}
                zoom={mapZoom}
                center={mapCenter}
                selected={mapSelected}
                showInfo={mapShowInfo}
                handleBack={isFire => this.handleMapBack(true, isFire)}
                handleInfoClose={this.handleMapInfoClose}
                handleSelected={this.handleMapSelected}
                setMapItemList={this.setMapItemList}
                setClearSearchValueFn={this.setClearSearchValueFnInMap}
                showTooltip={this.showTooltip}
                hideTooltip={this.hideTooltip}
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
                <FcMultiRotateModule
                  style={{ height: '100%' }}
                  isRotated={isDangerRotated}
                  showReverse={showReverse}
                  front={
                    <DangerSection
                      title="监督巡查/隐患"
                      backTitle="单位巡查/隐患"
                      data={gridDanger}
                      handleRotate={this.handleDangerRotate}
                    />
                  }
                  back={
                    <DangerSection
                      isBack
                      title="单位巡查/隐患"
                      backTitle="监督巡查/隐患"
                      data={danger}
                      handleRotate={this.handleDangerRotate}
                    />
                  }
                  reverse={<DangerSection title="该单位巡查/隐患" data={companyDanger} isBack />}
                />
              </Col>
            </Row>
          </Col>
          <Col span={6} style={HEIGHT_PERCNET}>
            <div className={styles.inspect} id="unitLookUp">
              <FcMultiRotateModule
                className={styles.inspectInner}
                isRotated={isLookUpRotated}
                showReverse={showReverse}
                front={
                  <UnitLookUp
                    data={lookUp}
                    // 正在查岗时候，按查岗按钮时，只是普通的翻过去，不在查岗，表示开始查岗，进行原来的逻辑
                    handleClickLookUp={isLookingUp ? this.turnToLookingUp : this.handleClickLookUp}
                    handleClickOffGuard={this.handleClickOffGuard}
                    handleClickVideoLookUp={this.handleClickVideoLookUp}
                  />
                }
                back={
                  <UnitLookUpBack
                    gridId={gridId}
                    dispatch={dispatch}
                    videoVisible={videoVisible}
                    data={{ lookUp, countdown, offGuard: newOffGuard, videoLookUp }}
                    lookUpShow={lookUpShow}
                    startLookUp={startLookUp}
                    offGuardWarnLoading={offGuardWarnLoading}
                    fetchLookUpVideo={this.fetchLookUpVideo}
                    handleVideoShow={this.handleVideoShow}
                    handleRotateBack={this.handleLookUpRotateBack}
                    handleVideoLookUpRotate={this.handleVideoLookUpRotate}
                  />
                }
                reverse={<AlarmHandle data={alarmProcess} />}
              />
            </div>
            <div className={styles.gutter3} />
            <FcModule className={styles.system} isRotated={showReverse}>
              <SystemSection data={sys} handleClick={this.handleSysClick} />
              <VideoSection
                data={allCamera}
                showVideo={this.handleVideoShow}
                backTitle={allCamera.length ? '更多' : ''}
                handleBack={() => this.handleVideoShow()}
              />
            </FcModule>
          </Col>
        </Row>
        {this.renderConfirmModal()}
        <VideoPlay
          // dispatch={dispatch}
          // actionType="bigFireControl/fetchStartToPlay"
          showList={showVideoList}
          videoList={videoState === VIDEO_LOOK_UP ? lookUpCamera : allCamera}
          visible={videoVisible}
          keyId={videoKeyId} // keyId
          handleVideoClose={this.handleVideoClose}
        />
        <Tooltip
          visible={tooltipVisible}
          title={tooltipName}
          position={tooltipPosition}
          offset={[23, -38]}
        />
        {/*</div>*/}
        <UnitDrawer
          data={sys}
          visible={unitDrawerVisible}
          labelIndex={unitDrawerLabelIndex}
          // handleSearch={this.handleUnitSearch}
          handleShowUnitDanger={this.handleShowUnitDanger}
          handleAlarmClick={this.handleUnitDrawerAlarmClick}
          handleSwitch={this.handleUnitDrawerLabelSwitch}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
        <UnitDangerDrawer
          loading={dangerCardLoading}
          labelIndex={unitDangerLabelIndex}
          companyId={this.companyId}
          data={{ dangerList, dangerRecords }}
          visible={unitDangerDrawerVisible}
          handleLabelClick={this.handleUnitDangerLabelClick}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
        <HostDrawer
          hostIndex={hostIndex}
          data={{ sys, hostAlarmTrend }}
          visible={hostDrawerVisible}
          handleCardClick={this.handleUnitDrawerAlarmClick}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
        <AlarmDrawer
          data={{ alarm: showReverse ? comAlarm : govAlarm, trend }}
          hideSearch={showReverse}
          visible={alarmDrawerVisible}
          leftType={alarmDrawerLeftType}
          rightType={alarmDrawerRightType}
          handleSelectChange={this.handleAlarmDrawerChange}
          handleCardClick={this[`handle${showReverse ? 'Unit' : ''}AlarmDrawerCardClick`]}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
        {/* <DangerTableDrawer
          data={dangerList}
          visible={dangerTableDrawerVisible}
          handleShowDanger={this.handleShowDanger}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        /> */}
        <DangerDrawer
          cardLoading={dangerCardLoading}
          selectedCompanyId={this.companyId}
          data={{ overview, dangerList, dangerRecords }}
          labelIndex={dangerLabelIndex}
          visible={dangerDrawerVisible}
          handleLabelClick={this.handleDangerLabelClick}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
        <SafeDrawer
          data={safeMan}
          visible={safeDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
        <RiskDrawer
          data={riskPoints}
          visible={riskDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
      </BigPlatformLayout>
    );
  }
}