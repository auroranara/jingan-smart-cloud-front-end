import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Rotate } from 'react-transform-components';
import { mapMutations } from '@/utils/utils';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
// 视频播放
import VideoPlay from '@/pages/BigPlatform/FireControl/section/VideoPlay';
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
  // 风险点详情抽屉
  RiskPointDetailDrawer,
  // 巡查点位详情抽屉
  InspectionDetailDrawer,
} from './components';
import IndexDrawer from '../Company2/sections/IndexDrawer';
// 引入样式文件
import styles from './index.less';

// 默认分页显示数量
const DEFAULT_PAGE_SIZE = 10;

/**
 * description: 模板
 */
@connect(({ unitSafety, loading }) => ({
  unitSafety,
  loadingSafetyIndex: loading.effects['unitSafety/fetchSafetyIndex'],
  loadingRiskPointInspectionList: loading.effects['unitSafety/fetchRiskPointInspectionList'],
  loadingRiskPointHiddenDangerList: loading.effects['unitSafety/fetchRiskPointHiddenDangerList'],
  loadingHiddenDangerList: loading.effects['unitSafety/fetchHiddenDangerList'],
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
      // 巡查点位详情抽屉是否显示
      inspectionDetailDrawerVisible: false,
      // 安全指数抽屉是否显示
      indexDrawerVisible: false,
      // 视频是否显示
      videoVisible: false,
      // 当前播放的视频id
      videoKeyId: null,
      // 当前显示的巡查块索引
      inspectionIndex: 0,
      // 当前选中的人员列表的月份
      selectedStaffListMonth: '2019-02',
      // 当前选中的人员记录的月份
      selectedStaffRecordsMonth: '2019-02',
      // 选中的人员id
      checkUserId: null,
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
      ],
    });
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const { match: { params: { companyId } } } = this.props;
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
    this.fetchPoints({ companyId });
  }

  /* 前往动态监控大屏 */
  goToMonitor = () => {
    const { match: { params: { companyId } } } = this.props;
    window.open(`${window.publicPath}#/big-platform/monitor/company/${companyId}`);
  }

  /* 前往1.0统计页面 */
  goToCompanyIndex = () => {
    const { match: { params: { companyId } } } = this.props;
    window.open(`/acloud_new/companyIndex.htm?company_id=${companyId}`);
  }

  /**
   * 获取隐患列表
   */
  getHiddenDangerList = (restProps) => {
    const { match: { params: { companyId } } } = this.props;
    this.fetchHiddenDangerList({ pageNum: 1, pageSize: DEFAULT_PAGE_SIZE, company_id: companyId, status: 5, ...restProps });
  }

  /**
   * 获取巡查记录对应的隐患列表
   */
  getInspectionRecordData = (checkId, status, callback) => {
    const { match: { params: { companyId } } } = this.props;
    const { selectedStaffRecordsMonth: month, checkUserId } = this.state;
    this.fetchInspectionRecordData({
      companyId,
      checkId,
      status,
      month,
      checkUserId,
    }, callback);
  }

  /**
   * 获取风险点巡查列表
   */
  getRiskPointInspectionList = (restProps) => {
    this.fetchRiskPointInspectionList({
      itemId: this.itemId,
      pageNum: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...restProps,
    });
  }

  /**
   * 获取风险点隐患列表
   */
  getRiskPointHiddenDangerList = (restProps) => {
    this.fetchRiskPointHiddenDangerList({
      itemId: this.itemId,
      pageNum: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      ...restProps,
    });
  }

  /**
   * 获取风险点的隐患统计
   */
  getRiskPointHiddenDangerCount = (restProps) => {
    this.fetchRiskPointHiddenDangerCount({
      itemId: this.itemId,
      ...restProps,
    });
  }

  /**
   * 获取风险点的巡查统计
   */
  getRiskPointInspectionCount = (restProps) => {
    this.fetchRiskPointInspectionCount({
      itemId: this.itemId,
      ...restProps,
    });
  }

  /**
   * 设置抽屉是否显示
   * @param {string} drawerName 抽屉名称
   * @param {object} props 其他参数
   */
  setDrawerVisible = (drawerName, props, callback) => {
    const fullName = `${drawerName}DrawerVisible`;
    this.setState(({ [fullName]: visible }) => ({ [fullName]: !visible, ...props }));
    callback && callback(this.props);
  }

  /**
   * 显示视频
   */
  showVideo = (videoKeyId) => {
    this.setState({ videoVisible: true, videoKeyId });
  }

  /**
  * 隐藏视频
  */
  hideVideo = () => {
    this.setState({ videoVisible: false });
  }

  /**
   * 显示风险点详情
   */
  showRiskPointDetailDrawer = (itemId) => {
    // 保存点位id
    this.itemId = itemId;
    // 获取风险告知卡列表
    this.fetchRiskPointCardList({ itemId }, () => {
      this.setDrawerVisible('riskPointDetail');
    });
    // 获取隐患列表
    this.getRiskPointHiddenDangerList();
    // 获取隐患统计
    this.getRiskPointHiddenDangerCount();
  }

  /**
   * 显示巡查点位详情
   */
  ShowInspectionDetailDrawer = (itemId, status) => {
    const { match: { params: { companyId } } } = this.props;
    const { selectedStaffRecordsMonth: month, checkUserId } = this.state;
    this.fetchInspectionPointData({
      companyId,
      itemId,
      status,
      month,
      checkUserId,
    }, () => {
      this.setDrawerVisible('inspectionDetail');
    });
  };

  /**
   * 显示安全指数抽屉
   */
  showIndexDrawer = e => {
    const { match: { params: { companyId } } } = this.props;
    this.setDrawerVisible('index');
    this.fetchSafeFiles({ companyId });
    this.fetchMonitorList({ companyId });
  };

  /**
   * 显示单位巡查
   */
  showUnitInspection = () => {
    this.setState({ inspectionIndex: 0 });
  }

  /**
   * 显示巡查人员
   */
  showStaffList = () => {
    // 如果是从单位巡查切换，则初始化巡查人员数据
    if (this.state.inspectionIndex === 0) {
      this.handleSelectStaffList(moment().format('YYYY-MM'));
    }
    this.setState({ inspectionIndex: 1 });
  }

  /**
   * 显示巡查记录
   */
  showStaffRecords = (checkUserId) => {
    // 根据当前选中的巡查人员的月份，初始化巡查记录数据
    this.handleSelectStaffRecords(this.state.selectedStaffListMonth, checkUserId);
    this.setState({ inspectionIndex: 2, checkUserId });
  }

  /**
   * 根据月份获取人员列表
   */
  handleSelectStaffList = month => {
    const { match: { params: { companyId } } } = this.props;
    this.fetchStaffList({ company_id: companyId, month });
    this.setState({ selectedStaffListMonth: month });
  };

  /**
   * 根据月份获取人员记录
   */
  handleSelectStaffRecords = (month, checkUserId = this.state.checkUserId) => {
    const { match: { params: { companyId } } } = this.props;
    this.fetchStaffRecords({ company_id: companyId, month, checkUserId });
    this.setState({ selectedStaffRecordsMonth: month });
  };

  /**
   * 渲染
   */
  render() {
    const {
      unitSafety,
      loadingSafetyIndex,
      loadingRiskPointInspectionList,
      loadingRiskPointHiddenDangerList,
      loadingHiddenDangerList,
    } = this.props;
    const {
      riskPointDrawerVisible,
      riskPointType,
      safetyOfficerDrawerVisible,
      riskPointDetailDrawerVisible,
      inspectionDetailDrawerVisible,
      indexDrawerVisible,
      videoVisible,
      videoKeyId,
      inspectionIndex,
      selectedStaffListMonth,
      selectedStaffRecordsMonth,
    } = this.state;
    const {
      videoList,
      hiddenDangerList,
      hiddenDangerCount,
      dynamicMonitorData,
      companyMessage,
      staffList,
      staffRecords,
      inspectionRecordData,
      inspectionPointData,
      riskPointDetail,
      points,
    } = unitSafety;

    return (
      <BigPlatformLayout
        title={global.PROJECT_CONFIG.projectName}
      >
        <Row gutter={16} className={styles.row}>
          {/* 左边 */}
          <Col span={6} className={styles.col}>
            <div className={styles.leftTop}>
              {/* 企业信息 */}
              <CompanyInfo
                model={unitSafety}
                loading={loadingSafetyIndex}
                handleClickUnitName={this.goToCompanyIndex}
                handleClickSafetyIndex={this.showIndexDrawer}
                handleClickCount={this.setDrawerVisible}
              />
            </div>
            <div className={styles.leftBottom}>
              {/* 风险点 */}
              <RiskPoint
                data={points}
                handleClick={this.setDrawerVisible}
              />
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
              <Rotate
                axis="x"
                frontIndex={inspectionIndex}
              >
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
              />
            </div>
            <div className={styles.rightBottom}>
              <DynamicMonitor
                data={dynamicMonitorData}
                onClick={this.goToMonitor}
              />
            </div>
          </Col>
        </Row>
        {/* 风险点抽屉 */}
        <RiskPointDrawer
          visible={riskPointDrawerVisible}
          onClose={this.setDrawerVisible}
          data={points}
          riskPointType={riskPointType}
        />
        {/* 安全人员抽屉 */}
        <SafetyOfficerDrawer
          visible={safetyOfficerDrawerVisible}
          onClose={this.setDrawerVisible}
          model={unitSafety}
        />
        {/* 风险点详情抽屉 */}
        <RiskPointDetailDrawer
          visible={riskPointDetailDrawerVisible}
          onClose={this.setDrawerVisible}
          data={riskPointDetail}
          loadingRiskPointInspectionList={loadingRiskPointInspectionList}
          loadingRiskPointHiddenDangerList={loadingRiskPointHiddenDangerList}
          getRiskPointInspectionList={this.getRiskPointInspectionList}
          getRiskPointHiddenDangerList={this.getRiskPointHiddenDangerList}
          getRiskPointHiddenDangerCount={this.getRiskPointHiddenDangerCount}
          getRiskPointInspectionCount={this.getRiskPointInspectionCount}
        />
        {/* 巡查点位详情抽屉 */}
        <InspectionDetailDrawer
          visible={inspectionDetailDrawerVisible}
          onClose={this.setDrawerVisible}
          data={inspectionPointData}
        />
        {/* 安全指数抽屉 */}
        <IndexDrawer
          data={unitSafety}
          visible={indexDrawerVisible}
          handleDrawerVisibleChange={this.setDrawerVisible}
        />
        {/* 视频播放 */}
        <VideoPlay
          style={{ zIndex: 99999999 }}
          videoList={videoList}
          visible={videoVisible}
          showList={true}
          keyId={videoKeyId}
          handleVideoClose={this.hideVideo}
        />
      </BigPlatformLayout>
    );
  }
}
