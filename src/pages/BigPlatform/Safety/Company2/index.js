import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import Translate from '@/components/Translate';
import CompanyInfo from './CompanyInfo';
import PointInfo from './PointInfo';
import FourColor from './FourColor';
import InspectionInfo from './InspectionInfo';
import HiddenDangerDetail from './HiddenDangerDetail';
import CurrentHiddenDanger from './CurrentHiddenDanger';
import Layout from '../Components/Layout';

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
    safetyPersonVisible: false,
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

  render() {
    const { monitorDataLoading, unitSafety } = this.props;
    const { companyMessage: { companyMessage: { companyName }, fourColorImg=[] }={} } = unitSafety;
    const { currentHiddenDangerVisible, selectedPointIndex, points, prevSelectedPointIndex, isMouseEnter } = this.state;

    return (
      <Layout
        extra={companyName}
      >
        <Row gutter={24} className={styles.row} style={{ margin: 0, padding: '16px 12px 24px' }}>
          {/* 左边 */}
          <Col span={6} className={styles.col}>
            {/* 企业信息 */}
            <CompanyInfo
              className={styles.leftTop}
              model={unitSafety}
              handleClickUnitName={this.handleClickUnitName}
              handleClickCount={(name) =>  {this.handleChange(name);}}
              currentHiddenDangerVisible={currentHiddenDangerVisible}
            />
            {/* 风险点信息 */}
            <PointInfo
              className={styles.leftBottom}
              model={unitSafety}
              handleClickCount={(name) =>  {this.handleChange(name);}}
            />
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
            {/* 单位巡查 */}
            <InspectionInfo
              className={styles.centerBottom}
              model={unitSafety}
            />
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
