import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Rotate from '@/components/Rotate';
import { mapMutations } from '@/utils/utils';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
// 视频播放
// import VideoPlay from '@/pages/BigPlatform/FireControl/section/VideoPlay';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import {
  // 企业信息
  CompanyInfo,
  // 风险点
  RiskPoint,
  // 四色图
  FourColor,
  // 单位巡查
  UnitInspection,
  // 巡查人员列表
  StaffList,
  // 巡查记录
  StaffRecords,
  // 当前隐患
  CurrentHiddenDanger,
  // 动态监测
  DynamicMonitor,
  // 风险点抽屉
  RiskPointDrawer,
  // 安全人员抽屉
  SafetyOfficerDrawer,
  // 安全指数抽屉
  SafetyIndexDrawer,
  // 风险点详情抽屉
  RiskPointDetailDrawer,
  // 巡查点位详情抽屉
  InspectionDetailDrawer,
  // 特种设备抽屉
  SpecialEquipmentDrawer,
  // 可燃有毒气体监测
  GasMonitorDrawer,
  // 设置抽屉
  SetDrawer,
  // 设备统计
  DeviceCountDrawer,
  // 温湿度监测点列表抽屉
  HumiturePointListDrawer,
  // 温湿度监测点详情抽屉
  HumiturePointDetailDrawer,
  // 隐患记录抽屉
  HiddenDangerRecordDrawer,
} from './components';
import debounce from 'lodash/debounce';
// import IndexDrawer from '../Company2/sections/IndexDrawer';
// 引入样式文件
import styles from './index.less';

// 默认分页显示数量
const DEFAULT_PAGE_SIZE = 10;

/**
 * description: 模板
 */
@connect(({ unitSafety, loading, monitor }) => ({
  unitSafety,
  loadingHiddenDangerList: loading.effects['unitSafety/fetchHiddenDangerList'],
  loadingDangerList: loading.effects['unitSafety/fetchDangerList'],
  loadingStaffRecords: loading.effects['unitSafety/fetchStaffRecords'],
  loadingHiddenDangerRecordList: loading.effects['unitSafety/fetchHiddenDangerRecordList'],
  monitor,
}))
export default class UnitSafety extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 安全指数抽屉是否显示
      safetyIndexDrawerVisible: false,
      // 安全人员抽屉是否显示
      safetyOfficerDrawerVisible: false,
      // 风险点抽屉是否显示
      riskPointDrawerVisible: false,
      // 风险点抽屉参数
      riskPointType: {},
      // 风险点详情抽屉是否显示
      riskPointDetailDrawerVisible: false,
      //  特种设备抽屉是否显示
      specialEquipmentDrawerVisible: false,
      // 巡查点位详情抽屉是否显示
      inspectionDetailDrawerVisible: false,
      // 安全指数抽屉是否显示
      indexDrawerVisible: false,
      // 视频是否显示
      videoVisible: false,
      // 当前播放的视频id
      videoKeyId: null,
      // 视频列表
      videoList: [],
      // 当前显示的巡查块索引
      inspectionIndex: 0,
      // 当前选中的人员列表的月份
      selectedStaffListMonth: '2019-02',
      // 当前选中的人员记录的月份
      selectedStaffRecordsMonth: '2019-02',
      // 选中的人员id
      checkUserId: null,
      // specialStatus: undefined,
      // 可燃有毒气体监测
      gasMonitorDrawerVisible: false,
      // 设置抽屉是否显示
      setDrawerVisible: false,
      // 设备统计抽屉是否显示
      deviceCountDrawerVisible: false,
      // 设备统计当前输入的区域位置
      deviceCountAddress: undefined,
      // 设备统计当前选中的状态
      deviceCountSelectedStatus: '0',
      // 设备统计当前选中的监测类型
      deviceCountSelectedMonitoringType: '0',
      // 温湿度监测点列表抽屉是否显示
      humiturePointListDrawerVisible: false,
      // 温湿度监测点详情抽屉是否显示
      humiturePointDetailDrawerVisible: false,
      // 温湿度监测点详情抽屉值
      humiturePointDetailDrawerValue: null,
      // 隐患记录抽屉是否显示
      hiddenDangerRecordDrawerVisible: false,
    };
    // 添加变异函数
    mapMutations(this, {
      namespace: 'unitSafety',
      types: [
        // 获取企业信息
        'fetchCompanyMessage',
        // 获取特种设备数
        'fetchSpecialEquipmentCount',
        // 获取隐患列表
        'fetchHiddenDangerList',
        // 获取视频列表
        'fetchVideoList',
        // 获取视频树列表
        'fetchVideoTree',
        // 获取监控数据
        'fetchMonitorData',
        // // 获取四色风险点
        // 'fetchCountDangerLocation',
        // 获取安全人员信息
        'fetchSafetyOfficer',
        // 获取安全指数
        'fetchSafetyIndex',
        // 获取动态监测数据
        'fetchDynamicMonitorData',
        // 获取巡查记录列表
        'fetchInspectionRecordData',
        // 获取风险点巡查列表
        'fetchRiskPointInspectionList',
        // 获取风险点隐患列表
        'fetchRiskPointHiddenDangerList',
        // 获取风险点隐患统计
        'fetchRiskPointHiddenDangerCount',
        // 获取风险点巡查统计
        'fetchRiskPointInspectionCount',
        // 获取风险告知卡列表
        'fetchRiskPointCardList',
        // 获取巡查点位数据
        'fetchInspectionPointData',
        // 获取巡查人员列表
        'fetchStaffList',
        // 获取巡查记录列表
        'fetchStaffRecords',
        // 获取安全档案
        'fetchSafeFiles',
        // 获取监测信息
        'fetchMonitorList',
        // 获取点位
        'fetchPoints',
        // 获取隐患统计
        'fetchHiddenDangerCount',
        // 获取弹窗的隐患列表
        'fetchDangerList',
        // 获取特种设备列表
        'fetchSpecialEquipmentList',
        // 获取手机是否显示配置
        'savePhoneVisible',
        // 获取设备统计列表
        'fetchDeviceCountList',
        // 获取隐患记录
        'fetchHiddenDangerRecordList',
      ],
    });

    this.debouncedFetchDeviceCountList = debounce(this.fetchDeviceCountList, 300);
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      match: {
        params: { companyId },
      },
      dispatch,
    } = this.props;
    // 获取企业信息
    this.fetchCompanyMessage({ company_id: companyId });
    // 获取特种设备数
    this.fetchSpecialEquipmentCount({ company_id: companyId });
    // 获取隐患列表
    this.getHiddenDangerList();
    // 获取隐患统计
    this.fetchHiddenDangerCount({ company_id: companyId });
    // 获取视频列表
    this.fetchVideoList({ company_id: companyId });
    // 获取视频树列表
    this.fetchVideoTree({ company_id: companyId });
    // 获取监控数据
    this.fetchMonitorData({ companyId });
    // // 获取四色风险点
    // this.fetchCountDangerLocation({ company_id: companyId });
    // 获取安全人员信息（安全人员信息卡片源数据）
    this.fetchSafetyOfficer({ company_id: companyId });
    // 获取安全指数
    this.fetchSafetyIndex({ companyId });
    // 获取动态监测数据
    this.fetchDynamicMonitorData({ companyId });
    // 获取点位
    this.getPoints();
    // 获取特种设备列表
    this.fetchSpecialEquipmentList({ companyId });
    // 获取手机是否显示配置
    this.savePhoneVisible();

    dispatch({ type: 'monitor/fetchGasCount', payload: { companyId, type: 2 } });
    dispatch({ type: 'monitor/fetchGasList', payload: { companyId, type: 2 } });

    this.setPollingTimer();
  }

  componentWillUnmount() {
    clearTimeout(this.pollingTimer);
  }

  /* 设置轮询 */
  setPollingTimer = () => {
    this.pollingTimer = setTimeout(() => {
      this.getPoints(() => {
        this.setPollingTimer();
      });
    }, 5 * 1000);
  };

  /* 获取点位 */
  getPoints = callback => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    this.fetchPoints({ companyId }, callback);
  };

  /* 前往动态监控大屏 */
  goToMonitor = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    window.open(`${window.publicPath}#/big-platform/monitor/company/${companyId}`);
  };

  /* 前往1.0统计页面 */
  goToCompanyIndex = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    window.open(`/acloud_new/companyIndex.htm?company_id=${companyId}`);
  };

  /**
   * 获取弹窗的隐患列表
   */
  getDangerList = restProps => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    this.fetchDangerList({
      pageNum: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      company_id: companyId,
      status: 5,
      ...restProps,
    });
  };

  /**
   * 获取隐患列表
   */
  getHiddenDangerList = restProps => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    this.fetchHiddenDangerList({
      pageNum: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      company_id: companyId,
      status: 5,
      ...restProps,
    });
  };

  /**
   * 获取巡查记录对应的隐患列表
   */
  getInspectionRecordData = (checkId, status, callback) => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    const { selectedStaffRecordsMonth: month, checkUserId } = this.state;
    this.fetchInspectionRecordData(
      {
        companyId,
        checkId,
        status,
        month,
        checkUserId,
      },
      callback
    );
  };

  /**
   * 获取风险点巡查列表
   */
  getRiskPointInspectionList = restProps => {
    this.fetchRiskPointInspectionList({
      itemId: this.itemId,
      pageNum: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...restProps,
    });
  };

  /**
   * 获取风险点隐患列表
   */
  getRiskPointHiddenDangerList = restProps => {
    this.fetchRiskPointHiddenDangerList({
      itemId: this.itemId,
      pageNum: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...restProps,
    });
  };

  /**
   * 获取风险点的隐患统计
   */
  getRiskPointHiddenDangerCount = restProps => {
    this.fetchRiskPointHiddenDangerCount({
      itemId: this.itemId,
      ...restProps,
    });
  };

  /**
   * 获取风险点的巡查统计
   */
  getRiskPointInspectionCount = restProps => {
    this.fetchRiskPointInspectionCount({
      itemId: this.itemId,
      ...restProps,
    });
  };

  /**
   * 设置抽屉是否显示
   * @param {string} drawerName 抽屉名称
   * @param {object} props 其他参数
   */
  setDrawerVisible = (drawerName, props, callback) => {
    const fullName = `${drawerName}DrawerVisible`;
    this.setState(({ [fullName]: visible }) => ({ [fullName]: !visible, ...props }));
    callback && callback(this.props);
  };

  /**
   * 显示视频
   */
  showVideo = (videoKeyId, videoList = this.props.unitSafety.videoTree) => {
    this.setState({
      videoVisible: true,
      videoKeyId,
      videoList: videoList.map(item => ({ ...item, id: item.id || item.key_id })),
    });
  };

  /**
   * 隐藏视频
   */
  hideVideo = () => {
    this.setState({ videoVisible: false });
  };

  /**
   * 显示风险点详情
   */
  showRiskPointDetailDrawer = (itemId, status) => {
    console.log('itemId', itemId);
    console.log('status', status);
    // 保存点位id
    this.itemId = itemId;
    // 获取风险告知卡列表
    this.fetchRiskPointCardList({ itemId, status }, () => {
      this.setDrawerVisible('riskPointDetail');
    });
    // 获取隐患列表
    this.getRiskPointHiddenDangerList();
    // 获取隐患统计
    this.getRiskPointHiddenDangerCount();
  };

  /**
   * 显示巡查点位详情
   */
  ShowInspectionDetailDrawer = (itemId, status) => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    const { selectedStaffRecordsMonth: month, checkUserId } = this.state;
    this.fetchInspectionPointData(
      {
        companyId,
        itemId,
        status,
        month,
        // checkUserId,
      },
      () => {
        this.setDrawerVisible('inspectionDetail');
      }
    );
  };

  // /**
  //  * 显示安全指数抽屉
  //  */
  // showIndexDrawer = e => {
  //   const {
  //     match: {
  //       params: { companyId },
  //     },
  //   } = this.props;
  //   this.setDrawerVisible('index');
  //   this.fetchSafeFiles({ companyId });
  //   this.fetchMonitorList({ companyId });
  // };

  /**
   * 显示单位巡查
   */
  showUnitInspection = () => {
    this.setState({ inspectionIndex: 0 });
  };

  /**
   * 显示巡查人员
   */
  showStaffList = () => {
    // 如果是从单位巡查切换，则初始化巡查人员数据
    if (this.state.inspectionIndex === 0) {
      this.handleSelectStaffList(moment().format('YYYY-MM'));
    }
    this.setState({ inspectionIndex: 1 });
  };

  /**
   * 显示巡查记录
   */
  showStaffRecords = checkUserId => {
    // 根据当前选中的巡查人员的月份，初始化巡查记录数据
    this.handleSelectStaffRecords(this.state.selectedStaffListMonth, checkUserId);
    this.setState({ inspectionIndex: 2, checkUserId });
  };

  /**
   * 显示设备统计抽屉
   */
  showDeviceCountDrawer = deviceCountSelectedMonitoringType => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    this.fetchDeviceCountList({
      companyId,
      type: deviceCountSelectedMonitoringType,
    });
    this.setState({
      deviceCountDrawerVisible: true,
      deviceCountAddress: undefined,
      deviceCountSelectedStatus: '0',
      deviceCountSelectedMonitoringType,
    });
  };

  /**
   * 显示隐患记录抽屉
   */
  showHiddenDangerRecordDrawer = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;

    this.setState({
      hiddenDangerRecordDrawerVisible: true,
    });
    this.fetchHiddenDangerRecordList({
      company_id: companyId,
      pageNum: 1,
      pageSize: 20,
    });
  };

  /**
   * 隐藏隐患记录抽屉
   */
  hideHiddenDangerRecordDrawer = () => {
    this.setState({
      hiddenDangerRecordDrawerVisible: false,
    });
  };

  /**
   * 根据月份获取人员列表
   */
  handleSelectStaffList = month => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    this.fetchStaffList({ company_id: companyId, month });
    this.setState({ selectedStaffListMonth: month });
  };

  /**
   * 根据月份获取人员记录
   */
  handleSelectStaffRecords = (month, checkUserId = this.state.checkUserId) => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    this.fetchStaffRecords({ company_id: companyId, month, checkUserId });
    this.setState({ selectedStaffRecordsMonth: month });
  };

  handleClickGas = () => {
    this.setDrawerVisible('gasMonitor');
  };

  /**
   * 显示设置抽屉
   */
  handleShowSetDrawer = () => {
    this.setDrawerVisible('set');
  };

  /**
   * 隐藏设置抽屉
   */
  handleHideSetDrawer = () => {
    this.setDrawerVisible('set');
  };

  /**
   * 设备区域位置改变
   */
  handleDeviceCountAddressChange = deviceCountAddress => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    const { deviceCountSelectedStatus, deviceCountSelectedMonitoringType } = this.state;
    this.setState({ deviceCountAddress });
    this.debouncedFetchDeviceCountList({
      companyId,
      areaLocation: deviceCountAddress,
      status: deviceCountSelectedStatus === '0' ? undefined : deviceCountSelectedStatus,
      type:
        deviceCountSelectedMonitoringType === '0' ? undefined : deviceCountSelectedMonitoringType,
    });
  };

  /**
   * 设备统计状态改变
   */
  handleDeviceCountStatusChange = deviceCountSelectedStatus => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    const { deviceCountAddress, deviceCountSelectedMonitoringType } = this.state;
    this.setState({ deviceCountSelectedStatus });
    this.fetchDeviceCountList({
      companyId,
      areaLocation: deviceCountAddress,
      status: deviceCountSelectedStatus === '0' ? undefined : deviceCountSelectedStatus,
      type:
        deviceCountSelectedMonitoringType === '0' ? undefined : deviceCountSelectedMonitoringType,
    });
  };

  /**
   * 设备统计状态改变
   */
  handleDeviceCountMonitoringTypeChange = deviceCountSelectedMonitoringType => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    const { deviceCountAddress, deviceCountSelectedStatus } = this.state;
    this.setState({ deviceCountSelectedMonitoringType });
    this.fetchDeviceCountList({
      companyId,
      areaLocation: deviceCountAddress,
      status: deviceCountSelectedStatus === '0' ? undefined : deviceCountSelectedStatus,
      type:
        deviceCountSelectedMonitoringType === '0' ? undefined : deviceCountSelectedMonitoringType,
    });
  };

  // 温湿度监测点击事件
  handleHumitureClick = () => {
    this.setState({
      humiturePointListDrawerVisible: true,
    });
  };

  // 温湿度监测点列表抽屉关闭事件
  handleHumiturePointListDrawerClose = () => {
    this.setState({
      humiturePointListDrawerVisible: false,
    });
  };

  // 温湿度监测点点击事件
  handleHumiturePointClick = humiturePointDetailDrawerValue => {
    this.setState({
      humiturePointDetailDrawerValue,
      humiturePointDetailDrawerVisible: true,
    });
  };

  // 温湿度监测点详情抽屉关闭事件
  handleHumiturePointDetailDrawerClose = () => {
    this.setState({
      humiturePointDetailDrawerVisible: false,
    });
  };

  /**
   * 渲染
   */
  render() {
    const {
      unitSafety,
      loadingHiddenDangerList,
      loadingStaffRecords,
      monitor: { gasCount = {}, gasList = [] },
      match: {
        params: { companyId },
      },
    } = this.props;
    const {
      riskPointDrawerVisible,
      riskPointType,
      // specialStatus,
      safetyOfficerDrawerVisible,
      safetyIndexDrawerVisible,
      specialEquipmentDrawerVisible,
      riskPointDetailDrawerVisible,
      inspectionDetailDrawerVisible,
      videoVisible,
      videoKeyId,
      videoList,
      inspectionIndex,
      selectedStaffListMonth,
      selectedStaffRecordsMonth,
      gasMonitorDrawerVisible,
      setDrawerVisible, // 设置抽屉是否显示
      deviceCountDrawerVisible,
      // 设备统计当前选中的状态
      deviceCountSelectedStatus,
      // 设备统计当前选中的监测类型
      deviceCountSelectedMonitoringType,
    } = this.state;
    const {
      hiddenDangerList,
      hiddenDangerCount,
      companyMessage,
      staffList,
      staffRecords,
      inspectionRecordData,
      points,
    } = unitSafety;
    return (
      <BigPlatformLayout
        // title={global.PROJECT_CONFIG.projectName}
        title="企业安全驾驶舱"
        settable
        onSet={this.handleShowSetDrawer}
      >
        <Row gutter={16} className={styles.row}>
          {/* 左边 */}
          <Col span={6} className={styles.col}>
            <div className={styles.leftTop}>
              {/* 企业信息 */}
              <CompanyInfo
                handleClickUnitName={this.goToCompanyIndex}
                handleClickSafetyIndex={() => {
                  this.setDrawerVisible('safetyIndex');
                }}
                handleClickCount={this.setDrawerVisible}
              />
            </div>
            <div className={styles.leftBottom}>
              {/* 风险点 */}
              <RiskPoint data={points} handleClick={this.setDrawerVisible} />
            </div>
          </Col>

          {/* 中间 */}
          <Col span={12} className={styles.col}>
            <div className={styles.centerTop}>
              {/* 四色图 */}
              <FourColor
                model={unitSafety}
                handleClickPoint={this.showRiskPointDetailDrawer}
                handleClickVideo={this.showVideo}
              />
            </div>
            <div className={styles.centerBottom}>
              <Rotate axis="x" frontIndex={inspectionIndex}>
                {/* 单位巡查 */}
                <UnitInspection
                  data={companyMessage}
                  inspectionIndex={inspectionIndex}
                  onClick={this.showStaffList}
                />
                {/* 人员列表 */}
                <StaffList
                  data={staffList}
                  month={selectedStaffListMonth}
                  onBack={this.showUnitInspection}
                  onClick={this.showStaffRecords}
                  onSelect={this.handleSelectStaffList}
                />
                {/* 人员记录 */}
                <StaffRecords
                  data={staffRecords}
                  inspectionRecordData={inspectionRecordData}
                  loading={loadingStaffRecords}
                  month={selectedStaffRecordsMonth}
                  onBack={this.showStaffList}
                  onSelect={this.handleSelectStaffRecords}
                  handleShowDetail={this.ShowInspectionDetailDrawer}
                  getInspectionRecordData={this.getInspectionRecordData}
                />
              </Rotate>
            </div>
          </Col>

          {/* 右边 */}
          <Col span={6} className={styles.col}>
            <div className={styles.rightTop}>
              <CurrentHiddenDanger
                data={hiddenDangerList}
                count={hiddenDangerCount}
                loading={loadingHiddenDangerList}
                onClick={this.getHiddenDangerList}
                onRecordClick={this.showHiddenDangerRecordDrawer}
              />
            </div>
            <div className={styles.rightBottom}>
              <DynamicMonitor
                onClick={this.goToMonitor}
                onShow={this.showDeviceCountDrawer}
                handleClickVideo={this.showVideo}
                // handleClickGas={this.handleClickGas}
                onHumitureClick={this.handleHumitureClick}
              />
            </div>
          </Col>
        </Row>
        {/* 风险点抽屉 */}
        <RiskPointDrawer
          visible={riskPointDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('riskPoint');
          }}
          data={points}
          riskPointType={riskPointType}
        />
        {/* 安全人员抽屉 */}
        <SafetyOfficerDrawer
          visible={safetyOfficerDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('safetyOfficer');
          }}
        />
        {/* 特种设备抽屉 */}
        <SpecialEquipmentDrawer
          visible={specialEquipmentDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('specialEquipment');
          }}
        />
        {/* 风险点详情抽屉 */}
        <RiskPointDetailDrawer
          visible={riskPointDetailDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('riskPointDetail');
          }}
          getRiskPointInspectionList={this.getRiskPointInspectionList}
          getRiskPointHiddenDangerList={this.getRiskPointHiddenDangerList}
          getRiskPointHiddenDangerCount={this.getRiskPointHiddenDangerCount}
          getRiskPointInspectionCount={this.getRiskPointInspectionCount}
        />
        {/* 巡查点位详情抽屉 */}
        <InspectionDetailDrawer
          visible={inspectionDetailDrawerVisible}
          onClose={() => this.setDrawerVisible('inspectionDetail')}
        />
        {/* 安全指数抽屉 */}
        <SafetyIndexDrawer
          visible={safetyIndexDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('safetyIndex');
          }}
          companyId={companyId}
        />
        {/* 视频播放 */}
        {/* <VideoPlay
          style={{ zIndex: 99999999 }}
          videoList={videoList}
          visible={videoVisible}
          showList={true}
          keyId={videoKeyId}
          handleVideoClose={this.hideVideo}
        /> */}
        <NewVideoPlay
          style={{ zIndex: 99999999 }}
          videoList={videoList}
          visible={videoVisible}
          showList={true}
          keyId={videoKeyId}
          handleVideoClose={this.hideVideo}
          isTree={true}
        />
        <GasMonitorDrawer
          visible={gasMonitorDrawerVisible}
          onClose={this.setDrawerVisible}
          data={gasCount}
          gasList={gasList}
        />
        {/* 设置抽屉 */}
        <SetDrawer visible={setDrawerVisible} onClose={this.handleHideSetDrawer} />
        {/* 设备统计 */}
        <DeviceCountDrawer
          visible={deviceCountDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('deviceCount');
          }}
          address={this.state.deviceCountAddress}
          deviceCountSelectedStatus={deviceCountSelectedStatus}
          deviceCountSelectedMonitoringType={deviceCountSelectedMonitoringType}
          onAddressChange={this.handleDeviceCountAddressChange}
          onStatusChange={this.handleDeviceCountStatusChange}
          onMonitoringTypeChange={this.handleDeviceCountMonitoringTypeChange}
        />
        {/* 温湿度监测点列表抽屉 */}
        <HumiturePointListDrawer
          visible={this.state.humiturePointListDrawerVisible}
          onClose={this.handleHumiturePointListDrawerClose}
          onClick={this.handleHumiturePointClick}
          onVideoClick={this.showVideo}
          companyId={companyId}
        />
        {/* 温湿度监测点详情抽屉 */}
        <HumiturePointDetailDrawer
          value={this.state.humiturePointDetailDrawerValue}
          visible={this.state.humiturePointDetailDrawerVisible}
          onClose={this.handleHumiturePointDetailDrawerClose}
          onVideoClick={this.showVideo}
        />
        {/* 隐患记录抽屉 */}
        <HiddenDangerRecordDrawer
          visible={this.state.hiddenDangerRecordDrawerVisible}
          onClose={this.hideHiddenDangerRecordDrawer}
          loading={this.props.loadingHiddenDangerRecordList}
          list={this.props.unitSafety.hiddenDangerRecordList}
        />
      </BigPlatformLayout>
    );
  }
}
