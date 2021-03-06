import React, { PureComponent } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { notification } from 'antd';
import { connect } from 'dva';
import debounce from 'lodash/debounce';
import { stringify } from 'qs';
// import moment from 'moment';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import NewSection from '@/components/NewSection';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
// import headerBg from '@/assets/new-header-bg.png';
// 接入单位统计
import AccessUnitStatistics from './AccessUnitStatistics';
// 实时火警
import RealTimeFire from './RealTimeFire';
// 历史火警
import HistoricalFire from './HistoricalFire';
// 设备故障统计
// import EquipmentStatistics from './EquipmentStatistics';

// 告警信息
// import WarningMessage from './WarningMessage';
import MyTooltip from './components/Tooltip';
// 故障/火警处理动态
import MaintenanceDrawer from './sections/MaintenanceDrawer';
// import AlarmDynamicDrawer from './sections/AlarmDynamicDrawer';
import FireDynamicDrawer from './sections/FireDynamicDrawer';

import MonitorDrawer from './sections/MonitorDrawer';

// import AlarmChart from './AlarmChart';
import BackMap from './BackMap';
import MapSearch from './BackMap/MapSearch';
// 引入样式文件
import styles from './index.less';
import { findFirstVideo } from '@/utils/utils';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import { SettingModal, UnitDrawer, AlarmDrawer, FireStatisticsDrawer } from './sections/Components';
// import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';

import { genCardsInfo } from './utils';
import { GridSelect } from './components/Components';

const headerBg = 'http://data.jingan-china.cn/v2/chem/assets/new-header-bg.png';
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
@connect(({ smoke, newUnitFireControl, operation, loading }) => ({
  smoke,
  newUnitFireControl,
  operation,
  messageInformListLoading: loading.effects['newUnitFireControl/fetchMessageInformList'],
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
      msgFlow: 0, // 0 火警 1故障
      dynamicType: 0,
      videoList: [],
      fireVideoVisible: false,
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
      payload: { gridId, type: 6 },
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

    // 历史状态图表数据
    dispatch({
      type: 'smoke/fetchDeviceCountChart',
      payload: {
        gridId,
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

        const { type, companyId, messageFlag, messageFlagForId } = data;
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
          // 获取单位传感器列表
          dispatch({
            type: 'smoke/fetchUnitDeviceList',
            payload: {
              companyId,
              classType: 6,
              // showData: 1,
              showVideo: 1,
            },
          });
          if (type === 38) {
            // const sameItem = alarmIds.find(item=>item.companyId===companyId);
            const sameIndex = alarmIds.map(item => item.companyId).indexOf(companyId);
            const newList =
              sameIndex >= 0
                ? [
                    ...alarmIds.slice(0, sameIndex),
                    { companyId, messageFlag: messageFlagForId || messageFlag },
                    ...alarmIds.slice(sameIndex + 1),
                  ]
                : [...alarmIds, { companyId, messageFlag: messageFlagForId || messageFlag }];
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
              if (item.messageFlag === messageFlag || item.messageFlag === messageFlagForId)
                sameIndex = i;
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
          // 获取单位传感器列表
          dispatch({
            type: 'smoke/fetchUnitDeviceList',
            payload: {
              companyId,
              classType: 6,
              // showData: 1,
              showVideo: 1,
            },
          });
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
    // const {
    //   infoWindowShow,
    //   infoWindow: { companyId },
    // } = this.mapChild.state;
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
      payload: { gridId, type: 6 },
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
    companyId: company_id,
    // addTime,
    companyName: company_name,
    area,
    location,
    paramName,
    messageFlag,
    // messageFlagForId,
    paramCode,
    deviceId,
  }) => {
    const options = {
      key: `${messageFlag}_${paramCode}`,
      // duration: null,
      duration: 30,
      placement: 'bottomLeft',
      className: styles.notification,
      message: (
        <div className={styles.notificationTitle}>
          <LegacyIcon type="warning" theme="filled" className={styles.notificationIcon} />
          警情提示
        </div>
      ),
      description: (
        <div
          className={styles.notificationContent}
          onClick={() => {
            this.setState({ companyName: company_name });
            this.handleClickNotification(company_id);
            this.handleAlarmClick(null, deviceId, company_id, company_name, 1);
          }}
        >
          <div className={styles.notificationText}>
            <div className={styles.notificationTextFirst}>刚刚</div>
            <div className={styles.notificationTextSecond}>{company_name}</div>
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
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    const stateName = `${name}DrawerVisible`;
    this.setState(state => ({
      [stateName]: !state[stateName],
      ...rest,
    }));
    if (name === 'alarm') {
      // 历史状态图表数据
      dispatch({
        type: 'smoke/fetchDeviceCountChart',
        payload: {
          gridId,
        },
      });
    }
  };

  // 地图搜索
  fetchMapSearchData = value => {
    const {
      smoke: {
        statisticsData: { companysList = [] },
      },
    } = this.props;

    const list = companysList;
    const selectList = value ? list.filter(item => item.company_name.includes(value)) : [];
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

  handleClickNotification = company_id => {
    const {
      smoke: {
        statisticsData: { companysList = [] },
      },
    } = this.props;
    this.showUnitDetail(companysList.filter(item => item.company_id === company_id)[0]);
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

  // 获取消息人员列表
  fetchMessageInformList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchMessageInformList',
      payload: { ...params },
    });
  };

  // 获取视频
  fetchCameraMessage = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'operation/fetchCameraMessage',
      payload: { ...params },
      callback: cameraMessage => {
        this.setState({ videoList: cameraMessage });
      },
    });
  };

  handleAlarmClick = (id, deviceId, company_id, company_name, type, num, msg) => {
    console.log('handleAlarmClick', id, deviceId, company_id, company_name, type, num, msg);
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;

    this.setState({ companyName: company_name, msgFlow: +type === 1 ? 0 : 1, dynamicType: type });
    dispatch({
      type: 'smoke/fetchSmokeForMaintenance',
      payload: { id, deviceId, companyId: company_id, gridId, num, type: type },
      success: res => {
        const {
          data: { list = [] },
        } = res;
        const {
          smoke: { gasForMaintenance = [] },
        } = this.props;
        const gasId = gasForMaintenance.map(item => item.data_id)[0];
        const dataId = list
          .filter(item => item.data_id === gasId)
          .map(item => item.data_id)
          .join('');
        this.handleDrawerVisibleChange('alarmDynamic');
        this.fetchMessageInformList({ dataId });
        dispatch({
          type: 'operation/fetchCameraMessage',
          payload: { id: dataId, reportType: 4 },
          callback: cameraMessage => {
            this.setState({ videoList: cameraMessage });
            Array.isArray(cameraMessage) && cameraMessage.length > 0 && this.handleShowFlowVideo();
          },
        });
      },
    });
  };

  // 开启视频监控
  handleShowFlowVideo = videoList => {
    this.setState({ fireVideoVisible: true });
  };

  // 关闭视频监控
  handleFireVideoClose = () => {
    this.setState({ fireVideoVisible: false, fireVideoKeyId: undefined });
  };

  handleMapParentChange = newState => {
    this.setState({ ...newState });
  };

  handleFaultClick = (id, company_id, company_name, type, num) => {
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    this.setState({ companyName: company_name, msgFlow: +type === 1 ? 0 : 1, dynamicType: type });
    dispatch({
      type: 'smoke/fetchSmokeForMaintenance',
      payload: { companyId: company_id, deviceId: id, gridId, num, type: type },
      success: res => {
        const {
          data: { list = [] },
        } = res;
        const {
          smoke: { gasForMaintenance = [] },
        } = this.props;
        const gasId = gasForMaintenance.map(item => item.data_id)[0];
        const dataId = list
          .filter(item => item.data_id === gasId)
          .map(item => item.data_id)
          .join('');
        this.handleDrawerVisibleChange('maintenance');
        this.fetchMessageInformList({ dataId });
        dispatch({
          type: 'operation/fetchCameraMessage',
          payload: { id: dataId, reportType: 4 },
          callback: cameraMessage => {
            this.setState({ videoList: cameraMessage });
            Array.isArray(cameraMessage) && cameraMessage.length > 0 && this.handleShowFlowVideo();
          },
        });
      },
    });
  };

  onRef = ref => {
    this.mapChild = ref;
  };

  handleCompanyClick = companyId => {
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    // 获取单位传感器列表
    dispatch({
      type: 'smoke/fetchUnitDeviceList',
      payload: {
        companyId,
        classType: 6,
        // showData: 1,
        showVideo: 1,
      },
      success: () => {
        this.handleDrawerVisibleChange('monitor');
      },
    });
    // 历史状态图表数据
    dispatch({
      type: 'smoke/fetchDeviceCountChart',
      payload: {
        gridId,
        companyId: companyId,
      },
    });
  };

  handleClickUnitStatistics = unitDetail => {
    const {
      dispatch,
      match: {
        params: { gridId },
      },
    } = this.props;
    const { company_id } = unitDetail;
    this.setState({ unitDetail });
    // 获取单位传感器列表
    dispatch({
      type: 'smoke/fetchUnitDeviceList',
      payload: {
        companyId: company_id,
        classType: 6,
        // showData: 1,
        showVideo: 1,
      },
      success: () => {
        this.handleDrawerVisibleChange('monitor');
      },
    });
    // 历史状态图表数据
    dispatch({
      type: 'smoke/fetchDeviceCountChart',
      payload: {
        gridId,
        companyId: company_id,
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
        payload: { gridId, type: 6 },
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
      payload: { gridId, type: 6 },
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
        deviceCountChartData,
        deviceListData,
      },
      match: {
        params: { gridId },
      },
      newUnitFireControl: { messageInformList },
      messageInformListLoading,
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
      // drawerType,companysList
      alarmIds,
      companyName,
      type,
      errorUnitsCardsInfo,
      importCardsInfo,
      msgFlow,
      dynamicType,
      videoList,
      fireVideoVisible,
    } = this.state;
    const headProps = {
      ...gasForMaintenance[0],
      videoList,
      dynamicType,
      onCameraClick: this.handleShowFlowVideo,
    };
    const dataId = gasForMaintenance.map(item => item.data_id);

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
          units={Array.isArray(unitSet) ? unitSet : []}
          statisticsData={statisticsData}
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
          unitsCount={Array.isArray(unitSet) ? unitSet : []}
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
        {/* <NewSection
          title="设备故障统计"
          className={styles.left}
          style={{ top: 'calc(55.85% + 92px)', height: '28%', cursor: 'pointer' }}
        >
          <EquipmentStatistics brandData={brandData} />
        </NewSection> */}
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
          allUnitList={{ list: importCardsInfo }}
          deviceCountChartData={deviceCountChartData}
          data={{ list: errorUnitsCardsInfo, companyStatus, graphList: AbnormalTrend }}
          unitsCount={Array.isArray(unitSet) ? unitSet : []}
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
          msgFlow={msgFlow}
          data={gasForMaintenance}
          dataId={dataId}
          visible={maintenanceDrawerVisible}
          companyName={companyName}
          onClose={() => this.handleDrawerVisibleChange('maintenance')}
          head={true}
          headProps={headProps}
          messageInformList={messageInformList}
          messageInformListLoading={messageInformListLoading}
          fetchCameraMessage={this.fetchCameraMessage}
          fetchMessageInformList={this.fetchMessageInformList}
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
          // type={'alarm'}
          msgFlow={msgFlow}
          data={gasForMaintenance}
          visible={alarmDynamicDrawerVisible}
          companyName={companyName}
          onClose={() => this.handleDrawerVisibleChange('alarmDynamic')}
          head={true}
          dataId={dataId}
          headProps={headProps}
          messageInformList={messageInformList}
          messageInformListLoading={messageInformListLoading}
          fetchCameraMessage={this.fetchCameraMessage}
          fetchMessageInformList={this.fetchMessageInformList}
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
          units={Array.isArray(unitSet) ? unitSet : []}
          handleSelect={this.handleSelectDevice}
          handleClickCamera={this.handleClickCamera}
          handleFaultClick={this.handleFaultClick}
          handleAlarmClick={this.handleAlarmClick}
          deviceCountChartData={deviceCountChartData}
          deviceListData={deviceListData}
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
        <NewVideoPlay
          showList={true}
          videoList={videoList}
          visible={fireVideoVisible}
          keyId={videoList.length > 0 ? findFirstVideo(videoList).id : undefined} // keyId
          handleVideoClose={this.handleFireVideoClose}
          isTree={false}
        />
      </BigPlatformLayout>
    );
  }
}
