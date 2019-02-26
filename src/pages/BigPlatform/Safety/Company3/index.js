import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { Rotate } from 'react-transform-components';
// import { mapMutations } from '@/utils/utils';
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
const DEFAULT_PAGE_SIZE = 50;

/**
 * description: 模板
 */
@connect(({ unitSafety, loading }) => ({
  unitSafety,
  loadingSafetyIndex: loading.effects['unitSafety/fetchSafetyIndex'],
  loadingRiskPointInspectionList: loading.effects['unitSafety/fetchRiskPointInspectionList'],
  loadingRiskPointHiddenDangerList: loading.effects['unitSafety/fetchRiskPointHiddenDangerList'],
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
      selectedStaffListMonth: '2019-2',
      // 当前选中的人员记录的月份
      selectedStaffRecordsMonth: '2019-2',
      // 选中的人员id
      checkUserId: null,
    };
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const { dispatch, match: { params: { companyId } } } = this.props;

    // 获取企业信息
    dispatch({
      type: 'unitSafety/fetchCompanyMessage',
      payload: {
        company_id: companyId,
      },
    });
    // 获取特种设备数
    dispatch({
      type: 'unitSafety/fetchSpecialEquipmentCount',
      payload: {
        company_id: companyId,
      },
    });
    // 获取隐患列表
    dispatch({
      type: 'unitSafety/fetchHiddenDangerList',
      payload: {
        company_id: companyId,
      },
    });
    // 获取视频列表
    dispatch({
      type: 'unitSafety/fetchVideoList',
      payload: {
        company_id: companyId,
      },
    });
    // 获取监控数据
    dispatch({
      type: 'unitSafety/fetchMonitorData',
      payload: {
        companyId,
      },
    });
    // 获取四色风险点
    dispatch({
      type: 'unitSafety/fetchCountDangerLocation',
      payload: {
        company_id: companyId,
      },
    });
    // 获取安全人员信息（安全人员信息卡片源数据）
    dispatch({
      type: 'unitSafety/fetchSafetyOfficer',
      payload: {
        company_id: companyId,
      },
    });
    // 获取安全指数
    dispatch({
      type: 'unitSafety/fetchSafetyIndex',
      payload: {
        companyId,
      },
    });
    // 获取动态监测数据
    dispatch({
      type: 'unitSafety/fetchDynamicMonitorData',
      payload: {
        companyId,
      },
    });
  }

  goToMonitor = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    window.open(`${window.publicPath}#/big-platform/monitor/company/${companyId}`);
  }

  goToCompanyIndex = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    window.open(`/acloud_new/companyIndex.htm?company_id=${companyId}`);
  }

  /**
   * 获取巡查记录对应的隐患列表
   */
  getInspectionRecordData = (checkId, status, callback) => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    const { selectedStaffRecordsMonth: month, checkUserId } = this.state;
    const payload = {
      companyId,
      checkId,
      status,
      month,
      checkUserId,
    };
    dispatch({
      type: 'unitSafety/fetchInspectionRecordData',
      payload,
      callback,
    });
  }

  /**
   * 获取风险点巡查列表
   */
  getRiskPointInspectionList = ({ pageNum = 1, itemId = this.itemId, ...restProps }={}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitSafety/fetchRiskPointInspectionList',
      payload: {
        itemId,
        pageNum,
        pageSize: DEFAULT_PAGE_SIZE,
        ...restProps,
      },
    });
  }

  /**
   * 获取风险点隐患列表
   */
  getRiskPointHiddenDangerList = ({ pageNum = 1, itemId = this.itemId, ...restProps }={}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitSafety/fetchRiskPointHiddenDangerList',
      payload: {
        itemId,
        pageNum,
        pageSize: DEFAULT_PAGE_SIZE,
        ...restProps,
      },
    });
  }

  /**
   * 获取风险点的隐患统计
   */
  getRiskPointHiddenDangerCount = ({ itemId=this.itemId, ...restProps }={}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitSafety/fetchRiskPointHiddenDangerCount',
      payload: {
        itemId,
        ...restProps,
      },
    });
  }

  /**
   * 获取风险点的巡查统计
   */
  getRiskPointInspectionCount = ({ itemId=this.itemId, ...restProps }={}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitSafety/fetchRiskPointInspectionCount',
      payload: {
        itemId,
        ...restProps,
      },
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
    const { dispatch } = this.props;
    // 保存点位id
    this.itemId = itemId;
    // 获取风险告知卡列表
    dispatch({
      type: 'unitSafety/fetchRiskPointCardList',
      payload: {
        itemId,
      },
      callback: () => {
        this.setState({ riskPointDetailDrawerVisible: true });
      },
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
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    const { selectedStaffRecordsMonth: month, checkUserId } = this.state;
    const payload = {
      companyId,
      itemId,
      status,
      month,
      checkUserId,
    };
    // 1.获取数据
    dispatch({
      type: 'unitSafety/fetchInspectionPointData',
      payload,
      callback: () => {
        // 2.显示抽屉
        this.setState({ inspectionDetailDrawerVisible: true });
      },
    });
  };

  /**
   * 显示安全指数抽屉
   */
  showIndexDrawer = e => {
    const { dispatch, match: { params: { companyId } } } = this.props;

    this.setDrawerVisible('index');
    dispatch({ type: 'unitSafety/fetchSafeFiles', payload: { companyId } });
    dispatch({ type: 'unitSafety/fetchMonitorList', payload: { companyId } });
  };

   /**
   * 修改单位巡查索引
   */
  setInspectionIndex = (index, checkUserId) => {
    const { inspectionIndex, selectedStaffListMonth } = this.state;
    // 从单位巡查切换到人员列表
    if (index === 1 && inspectionIndex === 0) {
      this.handleSelectStaffList(moment().format('YYYY-MM'));
    }
    // 切换到人员记录
    else if (index === 2) {
      this.handleSelectStaffRecords(selectedStaffListMonth, checkUserId);
    }
    this.setState({
      inspectionIndex: index,
      checkUserId,
    });
  }

  /**
   * 根据月份获取人员列表
   */
  handleSelectStaffList = month => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'unitSafety/fetchStaffList',
      payload: {
        company_id: companyId,
        month,
      },
    });
    this.setState({
      selectedStaffListMonth: month,
    });
  };

  /**
   * 根据月份获取人员记录
   */
  handleSelectStaffRecords = (month, checkUserId = this.state.checkUserId) => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'unitSafety/fetchStaffRecords',
      payload: {
        company_id: companyId,
        month,
        checkUserId,
      },
    });
    this.setState({
      selectedStaffRecordsMonth: month,
    });
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
      dynamicMonitorData,
      companyMessage,
      staffList,
      staffRecords,
      inspectionRecordData,
      inspectionPointData,
      riskPointDetail,
    } = unitSafety;

    console.log(videoList);
    console.log(videoKeyId);

    return (
      <BigPlatformLayout
        title={global.PROJECT_CONFIG.projectName}
      >
        <Row gutter={16} className={styles.row} style={{ margin: 0, padding: '16px 8px' }}>
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
                model={unitSafety}
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
                  onClick={() => {this.setInspectionIndex(1)}}
                />
                {/* 人员列表 */}
                <StaffList
                  data={staffList}
                  month={selectedStaffListMonth}
                  onBack={() => {
                    this.setInspectionIndex(0);
                  }}
                  onClick={checkUserId => {
                    this.setInspectionIndex(2, checkUserId);
                  }}
                  onSelect={this.handleSelectStaffList}
                />
                {/* 人员记录 */}
                <StaffRecords
                  data={staffRecords}
                  inspectionRecordData={inspectionRecordData}
                  month={selectedStaffRecordsMonth}
                  onBack={() => {
                    this.setInspectionIndex(1);
                  }}
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
          model={unitSafety}
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
