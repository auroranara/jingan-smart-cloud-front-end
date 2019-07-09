import React, { PureComponent } from 'react';
import { notification, Icon } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { stringify } from 'qs';
import moment from 'moment';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import NewSection from '@/components/NewSection';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import headerBg from '@/assets/new-header-bg.png';
// 接入单位统计
import AccessUnitStatistics from './AccessUnitStatistics';
// 实时火警
import RealTimeFire from './RealTimeFire';
// 历史火警
import HistoricalFire from './HistoricalFire';
// 设备故障统计
import EquipmentStatistics from './EquipmentStatistics';

// 告警信息
// import WarningMessage from './WarningMessage';
import MyTooltip from './components/Tooltip';
// 故障/火警处理动态
import MaintenanceDrawer from './sections/MaintenanceDrawer';
import AlarmDynamicDrawer from './sections/AlarmDynamicDrawer';
import FireDynamicDrawer from './sections/FireDynamicDrawer';

import MonitorDrawer from './sections/MonitorDrawer';

// import AlarmChart from './AlarmChart';
import BackMap from './BackMap';
import MapSearch from './BackMap/MapSearch';
// 引入样式文件
import styles from './index.less';
import { SettingModal, UnitDrawer, AlarmDrawer, FireStatisticsDrawer } from './sections/Components';
// import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';

import { genCardsInfo } from './utils';
import { GridSelect } from './components/Components';

// websocket配置
const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

/**
 * description: 智能烟感
 * author:
 * date: 2019年01月08日
 */
@connect(({ smoke, newUnitFireControl }) => ({
  smoke,
  newUnitFireControl,
}))
export default class Smoke extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      setttingModalVisible: false,
      unitDrawerVisible: false,
      alarmDrawerVisible: false,
      fireDrawerVisible: false,
      monitorDrawerVisible: false,
      monitorDrawerTitleIndex: 0,
      videoVisible: false,
      selectList: [],
      searchValue: '',
      mapInstance: undefined,
      // 企业详情
      tooltipName: '',
      tooltipVisible: false,
      tooltipPosition: [0, 0],
      maintenanceDrawerVisible: false,
      alarmDynamicDrawerVisible: false,
      // drawerType: '', // alarm,fault
      alarmIds: [],
      companyName: '',
      type: 0,
      errorUnitsCardsInfo: [],
      unitDetail: {},
      importCardsInfo: [],
    };
    this.debouncedFetchData = debounce(this.fetchMapSearchData, 500);
    // 设备状态统计数定时器
    this.deviceStatusCountTimer = null;
    // 设备实时数据定时器
    this.deviceRealTimeDataTimer = null;
    // 设备历史数据定时器
    this.deviceHistoryDataTimer = null;
    // 设备配置策略定时器
    this.deviceConfigTimer = null;
    this.number = 0;
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;

    // 获取单位数据
    dispatch({
      type: 'smoke/fetchUnitData',
      payload: { gridId },
    });

    // 烟感地图数据
    dispatch({
      type: 'smoke/fetchMapList',
      payload: { gridId },
    });

    // 获取异常单位统计数据
    dispatch({
      type: 'smoke/fetchUnNormalCount',
      payload: { gridId },
    });

    // 获取接入单位统计列表
    dispatch({
      type: 'smoke/fetchImportingTotal',
      payload: {
        status,
        gridId,
      },
      callback: data => {
        if (!data) return;
        const {
          gasUnitSet: { importingUnits = [] },
        } = data;
        // this.importCardsInfo = genCardsInfo(importingUnits);
        this.setState({ importCardsInfo: genCardsInfo(importingUnits) });
      },
    });

    // 获取异常单位统计列表
    dispatch({
      type: 'smoke/fetchAbnormalingTotal',
      payload: {
        status,
        gridId,
      },
      callback: data => {
        if (!data) return;
        const {
          gasErrorUnitSet: { errorUnits = [] },
        } = data;
        this.errorUnitsCardsInfo = genCardsInfo(errorUnits);
        this.setState({ errorUnitsCardsInfo: this.errorUnitsCardsInfo });
      },
    });

    // 品牌故障统计
    dispatch({
      type: 'smoke/fetchFaultByBrand',
      payload: {
        gridId,
        classType: 6,
      },
    });

    const params = {
      companyId: gridId,
      env,
      type: 5,
    };
    const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;
    // const url = `ws://192.168.10.19:10036/websocket?${stringify(params)}`;

    // 链接webscoket
    const ws = new WebsocketHeartbeatJs({ url, ...options });

    ws.onopen = () => {
      console.log('connect success');
      ws.send('heartbeat');
    };

    ws.onmessage = e => {
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;
      try {
        const data = JSON.parse(e.data).data;
        const { type, companyId, messageFlag } = data;
        // const {
        //   smoke: {
        //     // messages,
        //     unitIds,
        //     // unitSet,
        //     // unitSet: { units },
        //   },
        // } = this.props;
        const { alarmIds } = this.state;
        // const index = unitIds.indexOf(companyId);
        // 如果数据为告警或恢复，则将数据插入到列表的第一个
        if ([38, 50].includes(type)) {
          // dispatch({
          //   type: 'smoke/save',
          //   payload: { messages: [data].concat(messages) },
          // });
          // 如果发生告警，弹出通知框，否则关闭通知框
          this.fetchAbnormal();
          if (type === 38) {
            // const sameItem = alarmIds.find(item=>item.companyId===companyId);
            const sameIndex = alarmIds.map(item => item.companyId).indexOf(companyId);
            const newList =
              sameIndex >= 0
                ? [
                    ...alarmIds.slice(0, sameIndex),
                    { companyId, messageFlag },
                    ...alarmIds.slice(sameIndex + 1),
                  ]
                : [...alarmIds, { companyId, messageFlag }];
            this.setState({ alarmIds: newList });
            this.showWarningNotification(data);
            // dispatch({
            //   type: 'smoke/saveUnitData',
            //   payload: {
            //     unitSet: {
            //       ...unitSet,
            //       units: [
            //         ...units.slice(0, index),
            //         { ...units[index], unnormal: units[index].unnormal + 1 },
            //         ...units.slice(index + 1),
            //       ],
            //     },
            //   },
            // });
          } else {
            // dispatch({
            //   type: 'smoke/saveUnitData',
            //   payload: {
            //     unitSet: {
            //       ...unitSet,
            //       units: [
            //         ...units.slice(0, index),
            //         { ...units[index], unnormal: units[index].unnormal - 1 },
            //         ...units.slice(index + 1),
            //       ],
            //     },
            //   },
            // });
            let sameIndex;
            alarmIds.forEach((item, i) => {
              if (item.messageFlag === messageFlag) sameIndex = i;
            });
            if (sameIndex !== undefined) {
              const newIds = [...alarmIds.slice(0, sameIndex), ...alarmIds.slice(sameIndex + 1)];
              this.setState({ alarmIds: newIds });
            }
          }
        }
        // 如果为33，则修改单位状态
        if ([38, 40, 46, 47, 50, 51].includes(type)) {
          this.fetchAbnormal();
          // dispatch({
          //   type: 'smoke/saveUnitData',
          //   payload: {
          //     unitSet: {
          //       ...unitSet,
          //       units: [
          //         ...units.slice(0, index),
          //         { ...units[index], faultNum: units[index].faultNum - 1 },
          //         ...units.slice(index + 1),
          //       ],
          //     },
          //   },
          // });
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };

    // setInterval(() => {
    //   this.fetchPending();
    // }, 10000);
  }

  fetchAbnormal = () => {
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    const { monitorDrawerVisible } = this.state;
    const {
      infoWindowShow,
      infoWindow: { companyId },
    } = this.mapChild.state;
    // 获取单位数据
    dispatch({
      type: 'smoke/fetchUnitData',
      payload: { gridId },
    });
    // 获取接入单位统计列表
    dispatch({
      type: 'smoke/fetchImportingTotal',
      payload: {
        status,
        gridId,
      },
      callback: data => {
        if (!data) return;
        const {
          gasUnitSet: { importingUnits = [] },
        } = data;
        // this.importCardsInfo = genCardsInfo(importingUnits);
        this.setState({ importCardsInfo: genCardsInfo(importingUnits) });
      },
    });
    // 烟感地图数据
    dispatch({
      type: 'smoke/fetchMapList',
      payload: { gridId },
    });

    // 获取异常单位统计数据
    dispatch({
      type: 'smoke/fetchUnNormalCount',
      payload: { gridId },
    });

    dispatch({
      type: 'smoke/fetchAbnormalingTotal',
      payload: {
        status,
        gridId,
      },
      callback: data => {
        if (!data) return;
        const {
          gasErrorUnitSet: { errorUnits = [] },
        } = data;
        this.errorUnitsCardsInfo = genCardsInfo(errorUnits);
        this.setState({ errorUnitsCardsInfo: this.errorUnitsCardsInfo });
      },
    });
  };

  /**
   * 更新后
   */
  componentDidUpdate() {}

  /**
   * 销毁前
   */
  componentWillUnmount() {
    clearInterval(this.pollCompanyInfo);
  }

  // cardsInfo = [];
  importCardsInfo = [];
  errorUnitsCardsInfo = [];

  /**
   * 1.获取接口数据
   * 2.显示弹出框
   * 3.添加定时器
   */
  showUnitDetail = (unitDetail, deviceId) => {
    if (!unitDetail) {
      return;
    }
    const { mapInstance } = this.state;
    const { longitude, latitude } = unitDetail;
    mapInstance.setZoomAndCenter(18, [longitude, latitude]);
    this.setState({ unitDetail });
    this.mapChild.handleMapClick(unitDetail);
    this.hideTooltip();
  };

  /**
   * 1.取消定时器
   * 2.隐藏弹出框
   */
  hideUnitDetail = () => {
    // clearInterval(this.deviceStatusCountTimer);
    // clearInterval(this.deviceRealTimeDataTimer);
    // clearInterval(this.deviceHistoryDataTimer);
    // clearInterval(this.deviceConfigTimer);
    this.setState({ monitorDrawerVisible: false });
  };

  /**
   * 显示告警通知提醒框
   */
  showWarningNotification = ({
    companyId,
    addTime,
    companyName,
    area,
    location,
    paramName,
    messageFlag,
    messageFlagForId,
    paramCode,
  }) => {
    const options = {
      key: `${messageFlag}_${paramCode}`,
      duration: null,
      placement: 'bottomLeft',
      className: styles.notification,
      message: (
        <div className={styles.notificationTitle}>
          <Icon type="warning" theme="filled" className={styles.notificationIcon} />
          警情提示
        </div>
      ),
      description: (
        <div
          className={styles.notificationContent}
          onClick={() => {
            this.setState({ companyName });
            this.handleClickNotification(companyId);
            this.handleAlarmClick(messageFlagForId || messageFlag, companyId, companyName);
          }}
        >
          <div className={styles.notificationText}>
            <div className={styles.notificationTextFirst}>{moment(addTime).format('HH:mm:ss')}</div>
            <div className={styles.notificationTextSecond}>{companyName}</div>
          </div>
          <div className={styles.notificationText}>
            <div className={styles.notificationTextFirst}>{`${area}${location}${paramName}`}</div>
            <div className={styles.notificationTextSecond}>发生火警！</div>
          </div>
        </div>
      ),
    };
    notification.open(options);
  };

  /**
   * 关闭通知框
   */
  hideWarningNotification = ({ messageFlag, paramCode }) => {
    notification.close(`${messageFlag}_${paramCode}`);
  };

  /**
   * 点击设置按钮
   */
  handleClickSetButton = () => {
    this.setState({ setttingModalVisible: true });
  };

  handleSettingOk = e => {
    this.setState({ setttingModalVisible: false });
  };

  handleSettingCancel = e => {
    this.setState({ setttingModalVisible: false });
  };

  handleDrawerVisibleChange = (name, rest) => {
    const stateName = `${name}DrawerVisible`;
    this.setState(state => ({
      [stateName]: !state[stateName],
      ...rest,
    }));
  };

  // 地图搜索
  fetchMapSearchData = value => {
    const {
      smoke: {
        unitSet: { units },
      },
    } = this.props;
    const list = units;
    const selectList = value ? list.filter(item => item.companyName.includes(value)) : [];
    this.setState({
      searchValue: value,
      selectList: selectList.length > 10 ? selectList.slice(0, 9) : selectList,
    });
  };

  handleMapSearchChange = value => {
    this.debouncedFetchData(value);
    this.setState({
      searchValue: value,
    });
  };

  handleClickNotification = companyId => {
    const {
      smoke: {
        unitSet: { units },
      },
    } = this.props;
    this.showUnitDetail(units.filter(item => item.companyId === companyId)[0]);
  };

  handleClickCamera = () => {
    const {
      smoke: { cameraList },
    } = this.props;
    this.setState({
      videoVisible: true,
      videoKeyId: cameraList.length ? cameraList[0].key_id : '',
    });
  };

  handleVideoClose = () => {
    this.setState({ videoVisible: false });
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

  handleMapParentChange = newState => {
    this.setState({ ...newState });
  };

  handleHistoricalFireClick = type => {
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    dispatch({
      type: 'smoke/fetchFireHistory',
      payload: {
        type,
        gridId,
      },
      success: () => {
        this.handleDrawerVisibleChange('fire');
      },
    });
    this.setState({ type: type });
  };

  handleAlarmClick = (id, companyId, companyName, num, msg) => {
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    this.setState({ companyName });
    dispatch({
      type: 'smoke/fetchSmokeForMaintenance',
      payload: { companyId, id, gridId, num, type: '1' },
      success: () => {
        this.handleDrawerVisibleChange('alarmDynamic');
      },
    });

    // dispatch({
    //   type: 'newUnitFireControl/fetchCountNumAndTimeById',
    //   payload: {
    //     id,
    //     reportType: 4,
    //     fireType: 1,
    //   },
    //   callback: res => {
    //     if (res) {
    //       // 待处理自行拼
    //       const { num, lastTime, firstTime } = res;
    //       // this.setState({ flowRepeat: { times: num, lastreportTime: lastTime } });
    //       dispatch({
    //         type: 'newUnitFireControl/saveWorkOrderDetail',
    //         payload: [{ ...occurData[0], firstTime, num, lastTime }],
    //       });
    //     } else {
    //       // 处理中，已完成请求接口流程信息
    //       dispatch({
    //         type: 'newUnitFireControl/fetchWorkOrder',
    //         payload: { companyId, reportType: 4, id },
    //         // callback: res => {
    //         //   if (res.data.list.length === 0) return;
    //         //   const { num, lastTime } = res.data.list[0];
    //         //   this.setState({ flowRepeat: { times: num, lastreportTime: lastTime } });
    //         // },
    //       });
    //     }
    //   },
    // });
  };

  handleFaultClick = (id, companyId, companyName, num) => {
    // return null;
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    this.setState({ companyName });
    dispatch({
      type: 'smoke/fetchSmokeForMaintenance',
      payload: { companyId, id, gridId, num, type: '2' },
      success: () => {
        this.handleDrawerVisibleChange('maintenance');
      },
    });
  };

  onRef = ref => {
    this.mapChild = ref;
  };

  handleCompanyClick = companyId => {
    const { dispatch } = this.props;
    dispatch({ type: 'smoke/fetchCameraTree', payload: { company_id: companyId } });
    dispatch({
      type: 'smoke/fetchCompanySmokeInfo',
      payload: { company_id: companyId },
      success: () => {
        this.handleDrawerVisibleChange('monitor');
        this.pollCompanyInfo = setInterval(() => {
          dispatch({
            type: 'smoke/fetchCompanySmokeInfo',
            payload: { company_id: companyId },
          });
        }, 2000);
      },
    });
  };

  handleClickUnitStatistics = unitDetail => {
    const { dispatch } = this.props;
    const { companyId } = unitDetail;
    this.setState({ unitDetail });
    dispatch({ type: 'smoke/fetchCameraTree', payload: { company_id: companyId } });
    dispatch({
      type: 'smoke/fetchCompanySmokeInfo',
      payload: { company_id: companyId },
      success: () => {
        this.handleDrawerVisibleChange('monitor');
        this.pollCompanyInfo = setInterval(() => {
          dispatch({
            type: 'smoke/fetchCompanySmokeInfo',
            payload: { company_id: companyId },
          });
        }, 2000);
      },
    });
  };

  pollingMap = () => {
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    this.poMap = setInterval(() => {
      // 烟感地图数据
      dispatch({
        type: 'smoke/fetchMapList',
        payload: { gridId },
      });
    }, 2000);
  };

  clearPollingMap = () => {
    clearInterval(this.poMap);
  };

  fetchMapInfo = () => {
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    // 烟感地图数据
    dispatch({
      type: 'smoke/fetchMapList',
      payload: { gridId },
    });
  };

  /**
   * 渲染
   */
  render() {
    const {
      smoke: {
        statisticsData,
        unNormalCount,
        AccessStatistics,
        AccessCount,
        companyStatus,
        AbnormalTrend,
        brandData,
        unitSet,
        deviceStatusCount,
        gasForMaintenance = [],
        companySmokeInfo: { dataByCompany, map: devMap = { unnormal: [], fault: [], normal: [] } },
        // cameraList,
        cameraTree,
      },
      match: {
        params: { gridId },
      },
    } = this.props;

    const {
      setttingModalVisible,
      unitDrawerVisible,
      alarmDrawerVisible,
      fireDrawerVisible,
      selectList,
      searchValue,
      unitDetail,
      tooltipName,
      tooltipVisible,
      tooltipPosition,
      maintenanceDrawerVisible,
      monitorDrawerVisible,
      alarmDynamicDrawerVisible,
      // videoVisible,
      // drawerType,
      alarmIds,
      companyName,
      type,
      errorUnitsCardsInfo,
      importCardsInfo,
    } = this.state;

    // const importCardsInfo = this.importCardsInfo;
    // const errorUnitsCardsInfo = this.errorUnitsCardsInfo;
    const extra = <GridSelect gridId={gridId} urlBase="/big-platform/smoke" />;
    return (
      <BigPlatformLayout
        title="智能烟感平台"
        extra={extra}
        style={{ backgroundImage: 'none' }}
        headerStyle={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          fontSize: 16,
          zIndex: 99,
          backgroundImage: `url(${headerBg})`,
          backgroundSize: '100% 100%',
        }}
        titleStyle={{ fontSize: 46 }}
        contentStyle={{ position: 'relative', height: '100%', zIndex: 0 }}
        settable
        onSet={this.handleClickSetButton}
      >
        {/* 地图 */}
        <BackMap
          units={Array.isArray(unitSet.units) ? unitSet.units : []}
          deviceStatusCount={deviceStatusCount}
          handleMapClick={this.showUnitDetail}
          showTooltip={this.showTooltip}
          hideTooltip={this.hideTooltip}
          unitDetail={unitDetail}
          alarmIds={alarmIds}
          handleParentChange={this.handleMapParentChange}
          handleAlarmClick={this.handleAlarmClick}
          handleFaultClick={this.handleFaultClick}
          onRef={this.onRef}
          handleCompanyClick={this.handleCompanyClick}
          clearPollingMap={this.clearPollingMap}
          pollingMap={this.pollingMap}
          fetchMapInfo={this.fetchMapInfo}
        />
        {/* 搜索框 */}
        <MapSearch
          className={styles.mapSearch}
          style={{
            top: 'calc(9.62963% + 24px)',
            position: 'absolute',
            left: '24px',
            width: '25.46875%',
            zIndex: 9999,
          }}
          selectList={selectList}
          value={searchValue}
          handleChange={this.handleMapSearchChange}
          handleSelect={this.showUnitDetail}
        />
        {/* 接入单位统计 */}
        <AccessUnitStatistics
          data={statisticsData}
          className={`${styles.left} ${styles.accessUnitStatistics}`}
          onClick={e => {
            const {
              dispatch,
              match: {
                params: { gridId },
              },
            } = this.props;
            // 获取接入单位统计列表
            dispatch({
              type: 'smoke/fetchImportingTotal',
              payload: {
                status,
                gridId,
              },
              callback: data => {
                if (!data) return;
                const {
                  gasUnitSet: { importingUnits = [] },
                } = data;
                this.setState({ importCardsInfo: genCardsInfo(importingUnits) });
              },
            });
            this.handleDrawerVisibleChange('unit');
          }}
        />
        {/* 异常单位统计 */}
        <RealTimeFire
          data={unNormalCount}
          className={`${styles.left} ${styles.realTimeAlarmStatistics}`}
          onClick={e => this.handleDrawerVisibleChange('alarm')}
        />
        {/* 历史火警单位统计 */}
        <NewSection
          title="历史火警单位统计"
          className={styles.left}
          style={{ top: 'calc(38.79% + 92px)', height: '16%', cursor: 'pointer' }}
        >
          <HistoricalFire data={statisticsData} onClick={this.handleHistoricalFireClick} />
        </NewSection>
        <NewSection
          title="设备故障统计"
          className={styles.left}
          style={{ top: 'calc(55.85% + 92px)', height: '28%', cursor: 'pointer' }}
        >
          <EquipmentStatistics brandData={brandData} />
        </NewSection>
        {/* extra info */}
        <SettingModal
          visible={setttingModalVisible}
          handleOk={this.handleSettingOk}
          handleCancel={this.handleSettingCancel}
        />
        {/* 接入单位统计弹窗 */}
        <UnitDrawer
          data={{ list: importCardsInfo, AccessStatistics, AccessCount }}
          visible={unitDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
          handleAlarmClick={this.handleAlarmClick}
          handleFaultClick={this.handleFaultClick}
          handleClickUnitStatistics={this.handleClickUnitStatistics}
        />
        <AlarmDrawer
          data={{ list: errorUnitsCardsInfo, companyStatus, graphList: AbnormalTrend }}
          visible={alarmDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
          handleAlarmClick={this.handleAlarmClick}
          handleFaultClick={this.handleFaultClick}
          handleClickDeviceNumber={this.handleClickUnitStatistics}
        />
        <FireStatisticsDrawer
          visible={fireDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
          type={type}
          gridId={gridId}
        />
        {/* 故障处理动态 */}
        <MaintenanceDrawer
          title="故障处理动态"
          // type={drawerType}
          type={'fault'}
          data={gasForMaintenance}
          visible={maintenanceDrawerVisible}
          companyName={companyName}
          onClose={() => this.handleDrawerVisibleChange('maintenance')}
        />
        {/* 灾情事件动态 */}
        {/* <AlarmDynamicDrawer
          data={[]}
          companyName={companyName}
          visible={alarmDynamicDrawerVisible}
          onClose={() => this.handleDrawerVisibleChange('alarmDynamic')}
        /> */}
        <FireDynamicDrawer
          title="灾情事件动态"
          // type={drawerType}
          type={'alarm'}
          data={gasForMaintenance}
          visible={alarmDynamicDrawerVisible}
          companyName={companyName}
          onClose={() => this.handleDrawerVisibleChange('alarmDynamic')}
        />
        {/* 单位监测数据 */}
        <MonitorDrawer
          data={{
            unitDetail,
            cameraTree,
            dataByCompany,
            companySmokeInfo: this.props.smoke.companySmokeInfo,
            devList: [...devMap.unnormal, ...devMap.fault, ...devMap.normal],
          }}
          visible={monitorDrawerVisible}
          handleClose={() => {
            this.hideUnitDetail();
            clearInterval(this.pollCompanyInfo);
          }}
          handleSelect={this.handleSelectDevice}
          handleClickCamera={this.handleClickCamera}
          handleFaultClick={this.handleFaultClick}
          handleAlarmClick={this.handleAlarmClick}
        />
        {/* <VideoPlay
          showList={false}
          videoList={cameraList}
          visible={videoVisible}
          keyId={cameraList.length ? cameraList[0].key_id : ''}
          style={{ position: 'fixed', zIndex: 99999 }}
          handleVideoClose={this.handleVideoClose}
        /> */}
        <MyTooltip
          visible={tooltipVisible}
          title={tooltipName}
          position={tooltipPosition}
          offset={[15, 42]}
          style={{ zIndex: 150 }}
        />
      </BigPlatformLayout>
    );
  }
}
