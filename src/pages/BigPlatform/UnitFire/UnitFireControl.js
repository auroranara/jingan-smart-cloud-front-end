import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Tooltip, Icon } from 'antd';
import { connect } from 'dva';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import Section from './components/Section/Section.js';
import StatisticsOfMaintenance from './components/StatisticsOfMaintenance/StatisticsOfMaintenance';
import StatisticsOfFireControl from './components/StatisticsOfFireControl/StatisticsOfFireControl';
import Rotate from 'components/Rotate';
import VideoPlay from '../FireControl/section/VideoPlay';
import resetKeyIcon from './images/resetKey.png';
import resetKeyPressIcon from './images/resetKeyPress.png';
import hostIcon from './images/hostIcon.png';
import fireHostIcon from './images/fireHostIcon.png';
import backIcon from '../FireControl/img/back.png';
import PendingInformation from './Sections/PendingInformation';
import InformationHistory from './Sections/InformationHistory';
import InspectionStatistics from './Sections/InspectionStatistics';
import FireHostMonitoring from './Sections/FireHostMonitoring';
import ElectricityCharts from './Sections/ElectricityCharts';
import StatisticsOfHiddenDanger from './Sections/StatisticsOfHiddenDanger';
import DrawerOfHiddenDanger from './Sections/DrawerOfHiddenDanger';
import ModalOfFireHost from './Sections/ModalOfFireHost';
import ModalOfInspectionStatistics from './Sections/ModalOfInspectionStatistics';
import WaterMonitor from './Sections/WaterMonitor';
import HydrantDrawer from './Sections/HydrantDrawer';
import PistolDrawer from './Sections/PistolDrawer';
import PondDrawer from './Sections/PondDrawer';
import styles from './UnitFireControl.less';
const { projectName } = global.PROJECT_CONFIG;
/**
 * 复位主机
 */
const Host = ({ data, onClick }) => {
  const { id, deviceCode, installLocation, isReset, isFire } = data;
  const hostInfoItemClassName =
    +isFire && !isReset ? `${styles.hostInfoItem} ${styles.fireHostInfoItem}` : styles.hostInfoItem;
  return (
    <div className={styles.hostContainer} key={id}>
      <div className={styles.hostIconContainer}>
        <img src={+isFire && !isReset ? fireHostIcon : hostIcon} alt="" />
      </div>
      <div className={styles.hostInfoContainer}>
        <div className={hostInfoItemClassName}>
          <span>主机编号：</span>
          <span>{deviceCode}</span>
        </div>
        <div className={hostInfoItemClassName}>
          <span>安装位置：</span>
          <span>{installLocation}</span>
        </div>
      </div>
      <div
        className={styles.hostResetButton}
        style={{ cursor: isReset ? 'not-allowed' : 'pointer' }}
        onClick={isReset ? undefined : onClick}
      >
        <img src={isReset ? resetKeyPressIcon : resetKeyIcon} alt="" />
      </div>
    </div>
  );
};

/* 默认选中的消防数据统计类型 */
const defaultFireControlType = 1;
/* 默认选中的隐患巡查统计类型 */
const defaultHiddenDangerType = 1;
/* 默认选中的维保情况统计类型 */
const defaultMaintenanceType = 6;
/* 默认每页显示数量 */
const defaultPageSize = 10;

/**
 * 单位消防大屏
 */
@connect(({ unitFireControl, monitor, loading }) => ({
  unitFireControl,
  monitor,
  devicesLoading: loading.effects['unitFireControl/fetchCompanyDevicesByType'],
  pendingHistoryLoading: loading.effects['unitFireControl/fetchDeviceWarningMessage'],
  hiddenDnagerLoading: loading.effects['unitFireControl/fetchHiddenDangerRecords'],
  inspectionMoreLoading:
    loading.effects['unitFireControl/fetchNormalPatrol'] ||
    loading.effects['unitFireControl/fetchAbnormalPatrol'],
}))
export default class UnitFireControl extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fireControlType: defaultFireControlType,
      hiddenDangerType: 'realTime', // 实时：realTime  月份：YYYY-MM
      maintenanceType: defaultMaintenanceType,
      frontIndex: 0,
      videoVisible: false,
      selectedInspectionMonth: defaultHiddenDangerType, // 选中的巡查统计时间筛选 今日、本周、本月、本季度依次为 1 2 3 4
      chartSelectVal: '',
      hiddenDangerVisible: false, // 隐患抽屉是否可见
      fireHostVisible: false, // 消防主机弹窗可见
      currentFireHostType: null, // 当前选择的消防主机类型
      fireHostLoading: false, // 消防主机弹窗数据加载
      fireHostPagination: {
        // 消防主机表格的分页数据
        pageNum: 1,
        pageSize: defaultPageSize,
        total: 0,
      },
      currentFireHosts: [], // 当前分页展示的消防主机
      pendingInfoStatus: '实时消息', // 待处理信息展示状态 （待处理、处理中、实时消息）
      inspectionModalVisible: false, // 巡查统计数据下钻可见
      InspectionModalType: 'normal', // 巡查统计数据数据下钻正常正常还是异常数据（normal、abnormal）
      dangerCardVisible: false, // 巡查统计数据下钻显示的隐患卡片
      hiddenDangerLabel: '', // 点击隐患统计时保存类型（已超期、待复查、未超期）
      pendingInfoLoading: true, // 待办事项是否加载
      hydrantDrawerVisible: false,
      pistolDrawerVisible: false,
      pondDrawerVisible: false,
      infoHistoryDrawerVisible: false,
    };
    // 轮询定时器
    this.pollingTimer = null;
  }
  /**
   * 挂载后声明周期函数
   */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { fireControlType, maintenanceType } = this.state;

    // 获取报警信息
    dispatch({
      type: 'unitFireControl/fetchDeviceWarningMessage',
      payload: {
        companyId,
        overFlag: 0,
        deviceTypeList: '101,102,103',
      },
    });

    // 获取待处理信息列表 (显示50条)
    dispatch({
      type: 'unitFireControl/fetchPendingInfo',
      payload: {
        companyId,
        pageNum: 1,
        pageSize: 50,
      },
      callback: () => {
        this.setState({ pendingInfoLoading: false });
      },
    });

    // 获取巡查统计数据 今日、本周、本月、本季度type依次为 1 2 3 4
    dispatch({
      type: 'unitFireControl/fetchInspectionStatistics',
      payload: { type: 1, companyId },
    });

    // 获取消防主机监测数据
    dispatch({
      type: 'unitFireControl/fetchFireAlarmSystem',
      payload: {
        companyId,
      },
    });

    // 电气火灾监测数据
    dispatch({
      type: 'monitor/fetchCompanyDevices',
      payload: { companyId, type: 1 },
      callback: firstDeviceId => {
        this.setState({ chartSelectVal: firstDeviceId });
        // 获取传感器历史
        // dispatch({
        //   type: 'monitor/fetchGsmsHstData',
        //   payload: { deviceId: firstDeviceId },
        // });
        // 获取实时警报信息
        dispatch({
          type: 'monitor/fetchDeviceDataHistory',
          payload: { deviceId: firstDeviceId },
        });
        // 获取上下线的区块
        this.fetchPieces(firstDeviceId);
      },
    });

    // 获取隐患统计（实时）
    dispatch({
      type: 'unitFireControl/fetchDangerStatistics',
      payload: {
        companyId,
        // date: moment().format('YYYY-MM-DD'),
      },
    });

    // 获取消防数据统计
    dispatch({
      type: 'unitFireControl/fetchFireControlCount',
      payload: {
        companyId,
        t: fireControlType,
      },
    });

    // 获取维保情况统计
    dispatch({
      type: 'unitFireControl/fetchMaintenanceCount',
      payload: {
        companyId,
        type: maintenanceType,
      },
    });

    // 获取主机列表
    dispatch({
      type: 'unitFireControl/fetchHosts',
      payload: {
        companyId,
      },
    });

    // 立即执行轮询
    // this.polling();

    // 获取视频列表
    dispatch({
      type: 'unitFireControl/fetchVideoList',
      payload: {
        company_id: companyId,
      },
    });

    this.fetchCompanyDevicesByType('101');
    this.fetchCompanyDevicesByType('102');
    this.fetchCompanyDevicesByType('103');

    // 设置轮询
    // this.pollingTimer = setInterval(this.polling, 5000);
  }

  /**
   * 组件销毁
   */
  componentWillUnmount() {
    clearInterval(this.pollingTimer);
  }

  /**
   * 轮询回调
   */
  polling = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { fireControlType, maintenanceType, pendingInfoStatus } = this.state;
    this.fetchCompanyDevicesByType('101');
    this.fetchCompanyDevicesByType('102');
    this.fetchCompanyDevicesByType('103');

    // 获取报警信息
    dispatch({
      type: 'unitFireControl/fetchDeviceWarningMessage',
      payload: {
        companyId,
        overFlag: 0,
        deviceTypeList: '101,102,103',
      },
    });

    // 获取待处理信息 1-1
    dispatch({
      type: 'unitFireControl/fetchPendingInfo',
      payload: {
        companyId,
        status: pendingInfoStatus === '处理中' ? '2' : null,
        pageNum: 1,
        pageSize: 50,
      },
    });

    // 获取消防主机监测数据 1-2
    dispatch({
      type: 'unitFireControl/fetchFireAlarmSystem',
      payload: {
        companyId,
      },
    });

    // 获取主机列表
    dispatch({
      type: 'unitFireControl/fetchHosts',
      payload: {
        companyId,
      },
    });

    // 获取待处理火警和待处理故障数量
    /* dispatch({
      type: 'unitFireControl/fetchPendingNumber',
      payload: {
        companyId,
      },
    }); */

    // 超期未整改隐患数量
    /* dispatch({
      type: 'unitFireControl/fetchOutOfDateNumber',
      payload: {
        companyId,
      },
    }); */

    // 获取待整改隐患数量
    /* dispatch({
      type: 'unitFireControl/fetchToBeRectifiedNumber',
      payload: {
        companyId,
      },
    }); */

    // 获取待巡查任务数量
    /* dispatch({
      type: 'unitFireControl/fetchToBeInspectedNumber',
      payload: {
        companyId,
      },
    }); */

    // 获取消防数据统计 2-3
    /* dispatch({
      type: 'unitFireControl/fetchFireControlCount',
      payload: {
        companyId,
        t: fireControlType,
      },
    }); */

    // 获取维保情况统计 2-4
    /* dispatch({
      type: 'unitFireControl/fetchMaintenanceCount',
      payload: {
        companyId,
        type: maintenanceType,
      },
    }); */
  };

  /**
   * 消防数据统计tab切换事件
   */
  handleSwitchFireControlType = fireControlType => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.setState({
      fireControlType,
    });
    // 重新获取消防数据统计
    dispatch({
      type: 'unitFireControl/fetchFireControlCount',
      payload: {
        companyId,
        t: fireControlType,
      },
    });
  };

  /**
   * 隐患巡查统计tab切换事件
   */
  handleSwitchHiddenDangerType = hiddenDangerType => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 实时不传date
    const date = hiddenDangerType === 'realTime' ? null : hiddenDangerType;
    this.setState({
      hiddenDangerType,
    });
    // 更新获取隐患统计
    dispatch({
      type: 'unitFireControl/fetchDangerStatistics',
      payload: {
        companyId,
        date,
      },
    });
  };

  /**
   * 维保情况统计tab切换事件
   */
  handleSwitchMaintenanceType = maintenanceType => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.setState({
      maintenanceType,
    });
    // 重新获取隐患巡查统计
    dispatch({
      type: 'unitFireControl/fetchMaintenanceCount',
      payload: {
        companyId,
        type: maintenanceType,
      },
    });
  };

  fetchCompanyDevicesByType = type => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'unitFireControl/fetchCompanyDevicesByType',
      payload: {
        companyId,
        type,
      },
    });
  };

  /**
   * 显示一键复位模块
   */
  handleShowResetSection = () => {
    /* const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取主机列表
    dispatch({
      type: 'unitFireControl/fetchHosts',
      payload: {
        companyId,
      },
    }); */
    // 显示一键复位模块
    this.setState({
      frontIndex: 1,
    });
  };

  /**
   * 隐藏一键复位模块
   */
  handleHideResetSection = () => {
    // 立即更新数据
    this.polling();
    // 隐藏一键复位模块
    this.setState({
      frontIndex: 0,
    });
  };

  /**
   * 复位单个主机
   */
  handleResetSingleHost = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitFireControl/changeSingleHost',
      payload: {
        id,
      },
    });
  };

  /**
   * 复位所有主机
   */
  handleResetAllHosts = () => {
    const {
      dispatch,
      match: {
        params: { unitId },
      },
    } = this.props;
    // 获取主机列表
    dispatch({
      type: 'unitFireControl/changeAllHosts',
      payload: {
        companyId: unitId,
      },
    });
  };

  /**
   * 打开视频播放
   */
  handleVideoOpen = () => {
    this.setState({ videoVisible: true });
  };

  /**
   * 关闭视频播放
   */
  handleVideoClose = () => {
    this.setState({ videoVisible: false });
  };

  /**
   * 点击加载更多已处理信息
   */
  handleMorePendingInfo = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
      unitFireControl: {
        informationHistory: {
          pagination: { pageNum, pageSize },
          isLast,
        },
      },
    } = this.props;
    if (isLast) return;
    // 获取更多已处理信息
    dispatch({
      type: 'unitFireControl/fetchInformationHistory',
      payload: { companyId, pageSize, pageNum: pageNum + 1, status: '1' },
    });
  };

  // 查看待处理信息的历史纪录
  handleViewHistory = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
      unitFireControl: {
        informationHistory: {
          pagination: { pageSize },
        },
      },
    } = this.props;

    // 获取报警信息
    dispatch({
      type: 'unitFireControl/fetchDeviceWarningMessage',
      payload: {
        companyId,
        overFlag: 1,
        deviceTypeList: '101,102,103',
      },
      callback: () => {
        this.handleDrawerVisibleChange('infoHistory');
      },
    });

    // 获取已处理信息
    // dispatch({
    //   type: 'unitFireControl/fetchInformationHistory',
    //   payload: { companyId, pageSize, pageNum: 1, status: '1' },
    //   callback: () => {
    //     // this.leftSections.style.opacity = 0;
    //     // this.InformationHistory.style.right = 0;
    //     this.handleDrawerVisibleChange('infoHistory');
    //   },
    // });
    // this.setState({pendingInfoStatus:'历史报警'})
  };

  // 点击未处理信息模块筛选栏
  handlePendingFilterChnage = e => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const value = e.target.value;
    this.setState({ pendingInfoLoading: true });
    const callback = () => {
      this.setState({ pendingInfoStatus: value, pendingInfoLoading: false });
    };
    if (value === '待处理') {
      dispatch({
        type: 'unitFireControl/fetchPendingInfo',
        payload: { companyId, pageNum: 1, pageSize: 50 },
        callback,
      });
    } else if (value === '处理中') {
      dispatch({
        type: 'unitFireControl/fetchPendingInfo',
        payload: { companyId, status: '2', pageNum: 1, pageSize: 50 },
        callback,
      });
    } else if (value === '实时消息') {
      dispatch({
        type: 'unitFireControl/fetchDeviceWarningMessage',
        payload: {
          companyId,
          overFlag: 0,
          deviceTypeList: '101,102,103',
        },
        callback,
      });
    }
  };

  /**
   *   渲染待处理信息模块
   */
  renderPendingInfo = () => {
    const {
      unitFireControl: {
        // 待处理信息
        pendingInfo: { list },
        deviceWarningMessage = [],
      },
    } = this.props;
    const { pendingInfoStatus, pendingInfoLoading } = this.state;

    return (
      <PendingInformation
        title="报警信息"
        showTotal={false}
        status={pendingInfoStatus}
        list={list}
        deviceWarningMessage={deviceWarningMessage}
        handleClick={this.handleVideoOpen}
        handleViewHistory={this.handleViewHistory}
        onFilterChange={this.handlePendingFilterChnage}
        loading={pendingInfoLoading}
      />
    );
  };

  /**
   * 渲染消防数据统计块
   */
  renderStatisticsOfFireControl() {
    const {
      fireControlCount: {
        warnTrue = 0,
        warnFalse = 0,
        fire_state = 0,
        fault_state = 0,
        start_state = 0,
        shield_state = 0,
        feedback_state = 0,
        supervise_state = 0,
      },
    } = this.props.unitFireControl;
    const { fireControlType } = this.state;

    return (
      <StatisticsOfFireControl
        type={fireControlType}
        real={warnTrue}
        misinformation={warnFalse}
        pending={fire_state - warnTrue - warnFalse}
        fault={fault_state}
        shield={shield_state}
        linkage={start_state}
        supervise={supervise_state}
        feedback={feedback_state}
        onSwitch={this.handleSwitchFireControlType}
      />
    );
  }

  /**
   * 点击隐患统计图表显示详情抽屉
   */
  handleClickChat = params => {
    const {
      data: { status = null, source_type = null, name = null },
    } = params;
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { hiddenDangerType } = this.state;
    if (source_type) return;
    dispatch({
      type: 'unitFireControl/fetchHiddenDangerRecords',
      payload: {
        companyId,
        businessType: 2,
        _status: status,
        month: hiddenDangerType === 'realTime' ? null : hiddenDangerType,
      },
    });
    this.setState({ hiddenDangerVisible: true, hiddenDangerLabel: name });
  };

  // 关闭隐患统计抽屉
  closeDrawerOfHiddenDanger = () => {
    this.setState({ hiddenDangerVisible: false, hiddenDangerLabel: '' });
  };

  /**
   * 渲染隐患统计
   */
  renderhiddenDangerDtatistics() {
    const {
      dangerStatistics: {
        dangerType: [
          {
            /* // 随手拍
            random_photo = 0,
            // 风险点
            from_self_check_point = 0,
            // 监督点
            from_grid_point = 0, */
            company_self_check = 0, // 企业自查
            gov_check = 0, // 政府监督
            maintenance_check = 0, // 维保检查
          } = {},
        ] = [],
        dangerDto: {
          /* // 已超期
          over_rectify_num = 0,
          // 待复查
          rectify_num = 0,
          // 待整改
          total_num = 0,
          // 已关闭
          count_closed_danger = 0, */
          overRectifyNum = 0,
          reviewNum = 0,
          rectifyNum = 0,
          closedNum = 0,
        } = {},
      },
    } = this.props.unitFireControl;
    const { hiddenDangerType } = this.state;
    return (
      <StatisticsOfHiddenDanger
        type={hiddenDangerType}
        handleClickChat={this.handleClickChat}
        onSwitch={this.handleSwitchHiddenDangerType}
        qyzc={company_self_check}
        zfjd={gov_check}
        wbjc={maintenance_check}
        // cqwzg={over_rectify_num}
        // dfc={rectify_num}
        // dzg={total_num - over_rectify_num - rectify_num - count_closed_danger}
        // ygb={count_closed_danger}
        cqwzg={overRectifyNum}
        dfc={reviewNum}
        dzg={rectifyNum}
        ygb={closedNum}
      />
    );
  }

  /**
   * 点击巡查统计右侧月份
   */
  handleInspectionFilter = selectedInspectionMonth => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.setState({
      selectedInspectionMonth,
    });
    // 更新巡查统计数据 今日、本周、本月、本季度依次为 1 2 3 4
    dispatch({
      type: 'unitFireControl/fetchInspectionStatistics',
      payload: { type: selectedInspectionMonth, companyId },
    });
  };

  /**
   * 点击查看巡查统计下钻
   */
  handleViewInspectionStatistics = type => {
    // type normal:正常  abnormal:异常
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { selectedInspectionMonth } = this.state;
    // TODO:拿数据
    const callback = () => {
      this.setState({
        inspectionModalVisible: true,
        InspectionModalType: type,
      });
    };
    dispatch({
      type:
        type === 'normal'
          ? 'unitFireControl/fetchNormalPatrol'
          : 'unitFireControl/fetchAbnormalPatrol',
      payload: {
        companyId,
        type: selectedInspectionMonth,
        pageNum: 1,
        pageSize: 10,
      },
      callback,
    });
  };

  /**
   * 巡查统计数据下钻翻页
   */
  handleInspectionPageChange = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
      unitFireControl: {
        inspectionStatistics: {
          pagination: { pageNum, pageSize },
        },
      },
    } = this.props;
    const { InspectionModalType, selectedInspectionMonth } = this.state;
    dispatch({
      type:
        InspectionModalType === 'normal'
          ? 'unitFireControl/fetchNormalPatrol'
          : 'unitFireControl/fetchAbnormalPatrol',
      payload: {
        companyId,
        type: selectedInspectionMonth, // 月份
        pageNum: pageNum + 1,
        pageSize,
      },
    });
  };

  /**
   * 关闭巡查统计数据下钻
   */
  handleCloseModalOfInspection = () => {
    this.setState({
      inspectionModalVisible: false,
      dangerCardVisible: false,
    });
  };

  // 巡查统计下钻隐患卡片显示与否
  handleChangeDangerCardVisible = (value = false) => {
    this.setState({
      dangerCardVisible: value,
    });
  };

  /**
   * 巡查统计模块
   */
  renderInspectionStatistics = () => {
    const {
      unitFireControl: { inspectionStatistics },
    } = this.props;
    const { selectedInspectionMonth } = this.state;
    return (
      <InspectionStatistics
        type={selectedInspectionMonth}
        onSwitch={this.handleInspectionFilter}
        onClick={this.handleViewInspectionStatistics}
        {...inspectionStatistics}
      />
    );
  };

  fetchPieces = firstDeviceId => {
    const { dispatch } = this.props;
    const codes = ['v1', 'v2', 'v3', 'v4', 'v5', 'ia', 'ib', 'ic', 'ua', 'ub', 'uc'];
    codes.forEach(code => {
      dispatch({
        type: 'monitor/fetchPieces',
        payload: { deviceId: firstDeviceId, code },
      });
    });

    // 获取参数
    dispatch({
      type: 'monitor/fetchChartParams',
      payload: { deviceId: firstDeviceId },
    });
  };

  handleChartSelect = value => {
    const { dispatch } = this.props;
    this.setState({ chartSelectVal: value });
    // 获取实时警报信息
    dispatch({
      type: 'monitor/fetchDeviceDataHistory',
      payload: { deviceId: value },
      error: () => {
        dispatch({
          type: 'monitor/deviceDataHistory',
          payload: {},
        });
      },
    });
    // 获取传感器历史
    // dispatch({
    //   type: 'monitor/fetchGsmsHstData',
    //   payload: { deviceId: value },
    //   error: () => {
    //     dispatch({
    //       type: 'monitor/gsmsHstData',
    //       payload: {},
    //     });
    //   },
    // });
    // 获取上下线的区块
    this.fetchPieces(value);
  };

  // 查看消防主机（消防主机监测模块）
  handleViewFireHosts = type => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'unitFireControl/fetchFireHosts',
      payload: {
        companyId,
      },
      callback: () => {
        const {
          unitFireControl: {
            fireHost: { list = [] },
          },
        } = this.props;
        const currentFireHosts = list.filter(item => item.typeName === type);
        this.setState({
          currentFireHostType: type,
          currentFireHosts,
          fireHostVisible: true,
          fireHostLoading: true,
        });
        setTimeout(() => {
          this.setState({
            fireHostLoading: false,
          });
        }, 500);
      },
    });
  };

  // 消防主机翻页
  // handleFireHostPageChange = (pageNum, pageSize) => {
  //   const {
  //     unitFireControl: {
  //       fireHost: { list = [] },
  //     },
  //   } = this.props
  //   const { currentFireHostType } = this.state
  //   const currentFireHosts = list.filter(item => item.typeName === currentFireHostType).slice((pageNum - 1) * pageSize, pageNum * pageSize)
  //   this.setState({
  //     fireHostPagination: {
  //       ...this.state.fireHostPagination,
  //       pageNum,
  //     },
  //     currentFireHosts,
  //     fireHostLoading: true,
  //   })
  //   setTimeout(() => {
  //     this.setState({
  //       fireHostLoading: false,
  //     })
  //   }, 500);
  // }

  // 消防主机筛选
  handleFireHostFilter = value => {
    const {
      unitFireControl: {
        fireHost: { list = [] },
      },
    } = this.props;
    const currentFireHosts = list.filter(item => item.typeName === value);
    this.setState({
      currentFireHostType: value,
      fireHostPagination: {
        ...this.state.fireHostPagination,
        pageNum: 1,
      },
      currentFireHosts,
      fireHostLoading: true,
    });
    setTimeout(() => {
      this.setState({
        fireHostLoading: false,
      });
    }, 500);
  };

  // 关闭消防主机弹窗
  handleCloseModalOfFireHost = () => {
    this.setState({
      fireHostVisible: false,
      fireHostLoading: false,
      currentFireHosts: [],
    });
  };

  // 关闭历史信息
  handleCloseInfoHistory = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitFireControl/saveHistoryInfo',
      payload: {
        list: [],
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },
    });
    this.leftSections.style.opacity = 1;
    this.InformationHistory.style.right = '110%';
  };

  /**
   * 维保情况统计
   */
  renderStatisticsOfMaintenance() {
    const {
      maintenanceCount: {
        selfAllNum = 0,
        selfNoNum = 0,
        selfDoingNum = 0,
        selfFinishNum = 0,
        assignAllNum = 0,
        assignNoNum = 0,
        assignDoingNum = 0,
        assignFinishNum = 0,
        avgSelfTime = '',
        selfRate = '100%',
        avgAssignTime = '',
        assignRate = '100%',
        unitName,
      },
    } = this.props.unitFireControl;
    const { maintenanceType } = this.state;

    return (
      <StatisticsOfMaintenance
        type={maintenanceType}
        onSwitch={this.handleSwitchMaintenanceType}
        maintenance={{
          name: unitName && unitName.length > 0 ? unitName[0].name : '维保单位',
          total: assignAllNum,
          repaired: assignFinishNum,
          unrepaired: assignNoNum,
          repairing: assignDoingNum,
          duration: avgAssignTime,
          rate: assignRate,
        }}
        local={{
          total: selfAllNum,
          repaired: selfFinishNum,
          unrepaired: selfNoNum,
          repairing: selfDoingNum,
          duration: avgSelfTime,
          rate: selfRate,
        }}
      />
    );
  }

  /**
   * 渲染历史信息
   */
  renderHistoryInfo = () => {
    const {
      pendingHistoryLoading,
      unitFireControl: {
        informationHistory: { list },
      },
    } = this.props;
    const { infoHistoryDrawerVisible } = this.state;
    return (
      <div
        ref={InformationHistory => {
          this.InformationHistory = InformationHistory;
        }}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          right: '110%',
          transition: 'all 0.5s',
        }}
      >
        <InformationHistory
          title="历史消息"
          data={{ list, alarmTypes: [] }}
          loading={pendingHistoryLoading}
          handleLoadMore={this.handleMorePendingInfo}
          handleClose={() => this.handleCloseInfoHistory()}
          onClose={() => this.handleDrawerVisibleChange('infoHistory')}
          visible={infoHistoryDrawerVisible}
        />
      </div>
    );
  };

  /**
   * 消防主机监测以及主机复位
   */
  renderFireAlarmMonitor = () => {
    const {
      unitFireControl: { fireAlarmSystem, hosts },
    } = this.props;
    const { frontIndex } = this.state;
    const isResetAll = hosts.filter(({ isReset }) => isReset).length === hosts.length;
    return (
      <Rotate frontIndex={frontIndex}>
        <FireHostMonitoring
          data={fireAlarmSystem}
          action={
            hosts &&
            hosts.length > 0 && (
              <Tooltip
                overlayClassName={styles.tooltip}
                title="一键复位功能只对平台数据进行复位，并不能控制主机复位。"
              >
                <div className={styles.resetButton} onClick={this.handleShowResetSection}>
                  {/* <img src={resetKeyIcon} alt="" /> */}
                  <Icon type="reload" style={{ marginRight: 8 }} />
                  一键复位
                </div>
              </Tooltip>
            )
          }
          onClick={this.handleViewFireHosts}
        />
        <Section
          title="一键复位"
          isScroll
          contentStyle={{
            borderTop: '2px solid #0967D3',
            paddingLeft: '16px',
            marginLeft: '-16px',
          }}
          fixedContentStyle={{
            order: '9',
          }}
          action={
            <div className={styles.backButton} onClick={this.handleHideResetSection}>
              <img src={backIcon} alt="" />
            </div>
          }
          fixedContent={
            <Fragment>
              <div className={styles.hostSectionBottom}>
                <div className={styles.hostNumber}>
                  <span>主机数量：</span>
                  <span>{hosts.length}</span>
                </div>
                <div
                  className={styles.resetAllHostsButton}
                  style={{
                    cursor: isResetAll ? 'not-allowed' : undefined,
                    backgroundColor: isResetAll ? '#0D3473' : undefined,
                    color: isResetAll ? '#0967d3' : undefined,
                  }}
                  onClick={isResetAll ? undefined : this.handleResetAllHosts}
                >
                  全部复位
                </div>
              </div>
            </Fragment>
          }
        >
          {hosts.length !== 0 ? (
            hosts.map(item => {
              const { id } = item;
              return (
                <Host
                  key={id}
                  data={item}
                  onClick={() => {
                    this.handleResetSingleHost(id);
                  }}
                />
              );
            })
          ) : (
            <div className={styles.hostIsEmpty}>
              <span>暂无主机</span>
            </div>
          )}
        </Section>
      </Rotate>
    );
  };

  handleDrawerVisibleChange = (name, rest) => {
    const stateName = `${name}DrawerVisible`;
    this.setState(state => ({
      [stateName]: !state[stateName],
      ...rest,
    }));
  };

  /**
   * 渲染函数
   */
  render() {
    // 从props中获取单位名称
    const {
      hiddenDnagerLoading,
      inspectionMoreLoading,
      devicesLoading,
      unitFireControl: {
        // 隐患统计
        dangerStatistics: { companyName },
        // 隐患巡查记录
        hiddenDangerRecords,
        // 视频列表
        videoList,
        fireAlarmSystem,
        informationHistory: { list },
        companyDevicesByType,
        deviceWarningMsgHistory,
      },
      monitor: { chartDeviceList, gsmsHstData, electricityPieces, chartParams, deviceDataHistory },
      pendingHistoryLoading,
    } = this.props;
    const {
      videoVisible,
      chartSelectVal,
      hiddenDangerVisible,
      fireHostVisible,
      fireHostLoading,
      currentFireHostType,
      fireHostPagination,
      currentFireHosts,
      inspectionModalVisible,
      InspectionModalType,
      // inspectionCurrentList,
      dangerCardVisible,
      hiddenDangerLabel,
      hydrantDrawerVisible,
      pistolDrawerVisible,
      pondDrawerVisible,
      infoHistoryDrawerVisible,
    } = this.state;
    return (
      <BigPlatformLayout extra={companyName} className={styles.root}>
        <div className={styles.unitFileControl}>
          <div className={styles.mainBody}>
            <Row gutter={16} style={{ height: '100%' }}>
              <Col span={6} style={{ height: '100%', position: 'relative' }}>
                <div
                  ref={leftSections => {
                    this.leftSections = leftSections;
                  }}
                  style={{ width: '100%', height: '100%', transition: 'opacity 0.5s' }}
                >
                  <div style={{ marginBottom: 16, height: 'calc(48.92% - 16px)' }}>
                    {/* 告警信息 */}
                    {this.renderPendingInfo()}
                  </div>
                  <div style={{ height: '51.08%' }}>
                    {/* 水系统监测 */}
                    <WaterMonitor
                      handleDrawerVisibleChange={this.handleDrawerVisibleChange}
                      loading={devicesLoading}
                      fetchCompanyDevicesByType={this.fetchCompanyDevicesByType}
                      data={companyDevicesByType}
                    />
                  </div>
                </div>
                {/* 历史信息 */}
                {/* {this.renderHistoryInfo()} */}
              </Col>
              <Col span={18} style={{ height: '100%' }}>
                <Row gutter={16} style={{ marginBottom: 16, height: 'calc(48.92% - 16px)' }}>
                  <Col span={8} style={{ height: '100%' }}>
                    {/* 消防主机监测 */}
                    {this.renderFireAlarmMonitor()}
                  </Col>
                  <Col span={16} style={{ height: '100%' }}>
                    {/* 电气火灾监测 */}
                    <ElectricityCharts
                      title="电气火灾监测"
                      data={{
                        chartDeviceList,
                        gsmsHstData,
                        electricityPieces,
                        chartParams,
                        deviceDataHistory,
                      }}
                      selectVal={chartSelectVal}
                      handleSelect={this.handleChartSelect}
                    />
                  </Col>
                </Row>
                <Row gutter={16} style={{ height: '51.08%' }}>
                  <Col span={8} style={{ height: '100%' }}>
                    {/* 隐患统计 */}
                    {this.renderhiddenDangerDtatistics()}
                  </Col>
                  <Col span={8} style={{ height: '100%' }}>
                    {/* 巡查统计 */}
                    {this.renderInspectionStatistics()}
                  </Col>
                  <Col span={8} style={{ height: '100%' }}>
                    {/* 消防数据统计 */}
                    {this.renderStatisticsOfFireControl()}
                  </Col>
                  {/* <Col span={8} style={{ height: '100%' }}>
                     维保情况统计
                    {this.renderStatisticsOfMaintenance()}
                  </Col> */}
                </Row>
              </Col>
            </Row>
          </div>
          <VideoPlay
            showList={true}
            videoList={videoList}
            visible={videoVisible}
            handleVideoClose={this.handleVideoClose}
          />
          {/* 隐患统计数据下钻抽屉 */}
          <DrawerOfHiddenDanger
            title={hiddenDangerLabel}
            loading={hiddenDnagerLoading}
            visible={hiddenDangerVisible}
            onClose={this.closeDrawerOfHiddenDanger}
            data={{ hiddenDangerRecords }}
          />
          {/* 消防主机监测数据下钻 */}
          <ModalOfFireHost
            visible={fireHostVisible}
            loading={fireHostLoading}
            onCancel={this.handleCloseModalOfFireHost}
            // handlePageChange={this.handleFireHostPageChange}
            currentFireHostType={currentFireHostType}
            onFilterChange={this.handleFireHostFilter}
            pagination={fireHostPagination}
            list={currentFireHosts}
            statistics={fireAlarmSystem}
          />
          {/* 巡查统计数据下钻 */}
          <ModalOfInspectionStatistics
            visible={inspectionModalVisible}
            onCancel={this.handleCloseModalOfInspection}
            type={InspectionModalType}
            handlePageChange={this.handleInspectionPageChange}
            cardVisible={dangerCardVisible}
            handleChangeDangerCardVisible={this.handleChangeDangerCardVisible}
            moreLoading={inspectionMoreLoading}
          />
          {/* 消火栓系统 */}
          <HydrantDrawer
            visible={hydrantDrawerVisible}
            data={companyDevicesByType}
            onClose={() => this.handleDrawerVisibleChange('hydrant')}
          />
          {/* 自动喷淋系统 */}
          <PistolDrawer
            visible={pistolDrawerVisible}
            data={companyDevicesByType}
            onClose={() => this.handleDrawerVisibleChange('pistol')}
          />
          {/* 水池/水箱 */}
          <PondDrawer
            visible={pondDrawerVisible}
            data={companyDevicesByType}
            onClose={() => this.handleDrawerVisibleChange('pond')}
          />
          {/* 历史消息 */}
          <InformationHistory
            title="历史消息"
            data={{ list, alarmTypes: [], deviceWarningMsgHistory }}
            loading={pendingHistoryLoading}
            handleLoadMore={this.handleMorePendingInfo}
            onClose={() => this.handleDrawerVisibleChange('infoHistory')}
            visible={infoHistoryDrawerVisible}
          />
        </div>
      </BigPlatformLayout>
    );
  }
}
