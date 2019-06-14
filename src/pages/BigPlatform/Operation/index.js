import React, { PureComponent } from 'react';
import { notification, Icon } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { stringify } from 'qs';
import moment from 'moment';

import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import headerBg from '@/assets/new-header-bg.png';
import styles from './index.less';
import {
  BackMap,
  SettingModal,
  FireStatisticsDrawer,
} from './sections/Components';
import { genCardsInfo } from './utils';
import {
  GridSelect,
  MapSearch,
  Tooltip as MyTooltip,
  TaskDrawer,
  TaskCount,
  FireCount,
} from './components/Components';

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
@connect(({ smoke }) => ({
  smoke,
}))
export default class Operation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      taskDrawerVisible: false, // 任务抽屉
      taskDrawerProcess: undefined, // 任务处理状态
      fireStatisticsDrawerVisible: false, // 火警抽屉
      dateType: undefined, // 火警抽屉日期类型
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
      errorUnitsCardsInfo: [],
      unitDetail: {},
      importCardsInfo: [],
      deviceType: 0, // 地图中间根据设备显示企业列表
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
    this.fetchMapInfo();

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
        const { alarmIds } = this.state;
        // const index = unitIds.indexOf(companyId);
        // 如果数据为告警或恢复，则将数据插入到列表的第一个
        if ([31, 32].includes(type)) {
          // 如果发生告警，弹出通知框，否则关闭通知框
          this.fetchAbnormal();
          if (type === 32) {
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
          } else {
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
        if (type === 33) {
          this.fetchAbnormal();
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  }

  fetchAbnormal = () => {
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
    this.fetchMapInfo();

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
            this.handleAlarmClick(messageFlag, companyId, companyName);
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

  // handleClickCamera = () => {
  //   const {
  //     smoke: { cameraList },
  //   } = this.props;
  //   this.setState({
  //     videoVisible: true,
  //     videoKeyId: cameraList.length ? cameraList[0].key_id : '',
  //   });
  // };

  // handleVideoClose = () => {
  //   this.setState({ videoVisible: false });
  // };

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

  handleAlarmClick = (id, companyId, companyName, num) => {
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

  pollingMap = () => {
    this.poMap = setInterval(() => {
      this.fetchMapInfo();
    }, 2000);
  };

  clearPollingMap = () => {
    clearInterval(this.poMap);
  };

  handleFireDrawerOpen = (dateType) => {
    const dict = {
      今日: 0,
      本周: 1,
      本月: 2,
    };
    this.setState({ fireStatisticsDrawerVisible: true, dateType: dict[dateType] });
  }

  handleDateTypeChange = (dateType) => {
    this.setState({ dateType });
  }

  handleTaskDrawerOpen = (taskDrawerProcess) => {
    this.setState({ taskDrawerVisible: true, taskDrawerProcess });
  }

  handleTaskDrawerClose = () => {
    this.setState({ taskDrawerVisible: false });
  }

  handleTaskCardClick = (id) => {
    console.log(id);
  }

  handleDeviceTypeChange = v => {
    this.setState({ deviceType: v });
  };

  /**
   * 渲染
   */
  render() {
    const {
      smoke: {
        unitSet,
        deviceStatusCount,
      },
      match: {
        params: { gridId },
      },
    } = this.props;

    const {
      setttingModalVisible,
      selectList,
      searchValue,
      unitDetail,
      tooltipName,
      tooltipVisible,
      tooltipPosition,
      alarmIds,
      dateType,
      deviceType,
      fireStatisticsDrawerVisible,
    } = this.state;

    const extra = <GridSelect gridId={gridId} urlBase="/big-platform/smoke" />;
    return (
      <BigPlatformLayout
        title="智慧消防运营平台"
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
        // settable
        // onSet={this.handleClickSetButton}
      >
        {/* 地图 */}
        <BackMap
          deviceType={deviceType}
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
          handleDeviceTypeChange={this.handleDeviceTypeChange}
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
        <div className={styles.leftContainer}>
          {/* 火警数量统计 */}
          <FireCount onClick={this.handleFireDrawerOpen} />
          {/* 运维任务统计 */}
          <TaskCount onClick={this.handleTaskDrawerOpen} />
        </div>
        <SettingModal
          visible={setttingModalVisible}
          handleOk={this.handleSettingOk}
          handleCancel={this.handleSettingCancel}
        />
        {/* 火警统计抽屉 */}
        <FireStatisticsDrawer
          gridId={gridId}
          visible={fireStatisticsDrawerVisible}
          handleDateTypeChange={this.handleDateTypeChange}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
          dateType={dateType}
        />
        <MyTooltip
          visible={tooltipVisible}
          title={tooltipName}
          position={tooltipPosition}
          offset={[15, 42]}
          style={{ zIndex: 150 }}
        />
        {/* 任务抽屉 */}
        <TaskDrawer
          visible={this.state.taskDrawerVisible}
          process={this.state.taskDrawerProcess}
          onClose={this.handleTaskDrawerClose}
          onJump={this.handleTaskCardClick}
        />
      </BigPlatformLayout>
    );
  }
}
