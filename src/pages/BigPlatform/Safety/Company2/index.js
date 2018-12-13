import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Translate from '@/components/Translate';
import Rotate from '@/components/Rotate';
import CompanyInfo from './CompanyInfo';
import PointInfo from './PointInfo';
import FourColor from './FourColor';
import InspectionInfo from './InspectionInfo';
import HiddenDangerDetail from './HiddenDangerDetail';
import CurrentHiddenDanger from './CurrentHiddenDanger';
import SafetyOfficer from './SafetyOfficer';
import RiskPoint from './RiskPoint';
import Layout from '../Components/Layout';
import StaffList from '../Components/StaffList';
import StaffRecords from '../Components/StaffRecords';

import styles from './index.less';

// 1 当没有四色图时，默认显示当前隐患模块        ----------> companyMessage
// 2 当有四色图时
// 2.1 当有选中的风险点时，显示风险点对应的隐患        ----------> selectedPointId <- itemId -> hiddenDangerList
// 2.1.1 当定时器执行时，自动选中当前四色图对应的风险点列表中下一个风险点并且显示下一个风险点对应的隐患      ----------> pointIds
// 2.1.2 当点击其他风险点时，选中点击的风险点并显示对应的隐患
// 2.1.3 当点击同个风险点时，取消选中，并显示当前四色图对应的隐患
// 2.2 当没有选中的风险点时，显示当前四色图对应的隐患
// 2.2.1 当点击某个风险点时，选中点击的风险点并显示对应的隐患
// 2.2.2 当定时器执行时
// 2.2.2.1 如果之前不是2.1.3的情况，则自动选中当前四色图对应的风险点列表中第一个风险点并且显示对应的隐患
// 2.2.2.2 如果是2.1.3的情况，自动选中当前四色图对应的风险点列表中下一个风险点并且显示下一个风险点对应的隐患    ----------> prevSelectedPointId

@connect(({ unitSafety, loading }) => ({
  unitSafety,
  monitorDataLoading: loading.effects['unitSafety/fetchMonitorData'],
}))
export default class App extends PureComponent {
  state = {
    // 安全人员弹出框是否显示
    safetyOfficerVisible: false,
    // 风险点弹出框是否显示
    riskPointVisible: false,
    // 风险点弹出框的参数
    riskPointType: {},
    // 当前隐患弹出框是否显示
    currentHiddenDangerVisible: false,
    // 当前选中的点位
    selectedPointIndex: undefined,
    // 当前四色图上的点位列表
    points: [],
    // 之前选中的点位索引（取消选中点位并由定时器执行下次选中时有效）
    prevSelectedPointIndex: undefined,
    // 鼠标是否移入隐患详情
    isMouseEnter: false,
    // 单位巡查显示的模块索引
    inspectionIndex: 0,
    // 当前选中的人员列表的月份
    selectedStaffListMonth: '2018-09',
    // 当前选中的人员记录的月份
    selectedStaffRecordsMonth: '2018-09',
    // 选中的人员id
    checkUserId: null,
  }

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
  }

  /**
   * 点击监控球跳转到监控大屏
   */
  handleClickMonitorBall = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    window.open(`${window.publicPath}#/big-platform/monitor/company/${companyId}`);
  };

  /**
   * 点击企业名称
   */
  handleClickUnitName = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    window.open(`/acloud_new/companyIndex.htm?company_id=${companyId}`);
  }

  /**
   * 修改弹出框显示或隐藏
   */
  handleChange = (name, rest) => {
    const visible = `${name}Visible`;
    this.setState(({ [visible]: v }) => ({ [visible]: !v, ...rest }));
  }

  /**
   * 点击点位（包含当前选中点位id，当前四色图上所有点位id，之前选中的点位id）
   */
  handleClickPoint = (params) => {
    this.setState(params);
  }

  /**
   * 修改单位巡查索引
   */
  handleResetInspectionIndex = (index, checkUserId) => {
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

  render() {
    const { monitorDataLoading, unitSafety } = this.props;
    const { companyMessage: { companyMessage: { companyName }, fourColorImg=[] }={}, staffList, staffRecords } = unitSafety;
    const { safetyOfficerVisible, riskPointVisible, riskPointType, currentHiddenDangerVisible, selectedPointIndex, points, prevSelectedPointIndex, isMouseEnter, inspectionIndex, selectedStaffListMonth, selectedStaffRecordsMonth } = this.state;

    return (
      <Layout
        extra={companyName}
      >
        <Row gutter={24} className={styles.row} style={{ margin: 0, padding: '16px 12px 24px' }}>
          {/* 左边 */}
          <Col span={6} className={styles.col}>
            <Translate
              queue={safetyOfficerVisible ? [0, 1] : (riskPointVisible ? [0, 2] : [0])}
              offset={{ right: 10, bottom: 10 }}
            >
              <div style={{ height: '100%' }}>
                {/* 企业信息 */}
                <CompanyInfo
                  className={styles.leftTop}
                  model={unitSafety}
                  handleClickUnitName={this.handleClickUnitName}
                  handleClickCount={this.handleChange}
                  currentHiddenDangerVisible={currentHiddenDangerVisible}
                />
                {/* 风险点信息 */}
                <PointInfo
                  className={styles.leftBottom}
                  model={unitSafety}
                  handleClickCount={this.handleChange}
                />
              </div>
              {/* 安全人员 */}
              <SafetyOfficer
                model={unitSafety}
                onClose={() => {this.handleChange('safetyOfficer');}}
              />
              {/* 风险点 */}
              <RiskPoint
                model={unitSafety}
                onClose={() => {this.handleChange('riskPoint');}}
                riskPointType={riskPointType}
              />
            </Translate>
          </Col>

          {/* 中间 */}
          <Col span={12} className={styles.col}>
            {/* 安全风险四色图 */}
            <FourColor
              className={styles.centerTop}
              model={unitSafety}
              points={points}
              selectedPointIndex={selectedPointIndex}
              prevSelectedPointIndex={prevSelectedPointIndex}
              monitorDataLoading={monitorDataLoading}
              handleClickMonitorBall={this.handleClickMonitorBall}
              handleClickPoint={this.handleClickPoint}
              isMouseEnter={isMouseEnter}
              currentHiddenDangerVisible={currentHiddenDangerVisible}
            />
            <Rotate
              axis="x"
              frontIndex={inspectionIndex}
              className={styles.centerBottom}
            >
              {/* 单位巡查 */}
              <InspectionInfo
                model={unitSafety}
                inspectionIndex={inspectionIndex}
                onClick={() => {this.handleResetInspectionIndex(1)}}
              />
              {/* 人员列表 */}
              <StaffList
                data={staffList}
                month={selectedStaffListMonth}
                fieldNames={{
                  id: 'check_user_id',
                  person: 'user_name',
                  total: 'totalCheck',
                  abnormal: 'abnormal',
                }}
                onBack={() => {
                  this.handleResetInspectionIndex(0);
                }}
                onClick={checkUserId => {
                  this.handleResetInspectionIndex(2, checkUserId);
                }}
                onSelect={this.handleSelectStaffList}
              />
              {/* 人员记录 */}
              <StaffRecords
                data={staffRecords}
                month={selectedStaffRecordsMonth}
                fieldNames={{
                  id: 'check_id',
                  person: 'user_name',
                  time: 'check_date',
                  point: 'object_title',
                  result: 'fireCheckStatus',
                  status: 'currentStatus',
                }}
                onBack={() => {
                  this.handleResetInspectionIndex(1);
                }}
                onSelect={this.handleSelectStaffRecords}
                // handleShowDetail={this.handleShowPatrolPointDrawer}
              />
            </Rotate>
          </Col>

          {/* 右边 */}
          <Col span={6} className={styles.col}>
            {fourColorImg.length > 0 ? (
              <Translate
                direction="left"
                queue={currentHiddenDangerVisible ? [0, 1] : [0]}
                offset={{ right: 10, bottom: 10 }}
              >
                {/* 隐患详情 */}
                <HiddenDangerDetail
                  model={unitSafety}
                  selectedPointIndex={selectedPointIndex}
                  prevSelectedPointIndex={prevSelectedPointIndex}
                  points={points}
                  currentHiddenDangerVisible={currentHiddenDangerVisible}
                  onMouseEnter={() => {this.setState({ isMouseEnter: true });}}
                  onMouseLeave={() => {this.setState({ isMouseEnter: false });}}
                />
                {/* 当前隐患 */}
                <CurrentHiddenDanger
                  model={unitSafety}
                  onClose={() => {this.handleChange('currentHiddenDanger');}}
                />
              </Translate>
            ) : (
              <CurrentHiddenDanger
                model={unitSafety}
                closable={false}
              />
            )}
          </Col>
        </Row>
      </Layout>
    );
  }
}
