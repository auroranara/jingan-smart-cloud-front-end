import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import FourColor from './FourColor';
import Layout from '../Components/Layout';

import styles from './index.less';

@connect(({ unitSafety, loading }) => ({
  unitSafety,
  monitorDataLoading: loading.effects['unitSafety/fetchMonitorData'],
}))
export default class App extends PureComponent {

  componentDidMount() {
    const { dispatch, match: { params: { companyId } } } = this.props;

    // 获取企业信息
    dispatch({
      type: 'unitSafety/fetchCompanyMessage',
      payload: {
        company_id: companyId,
      },
    });
    // 获取风险点信息列表（风险告知卡）
    dispatch({
      type: 'unitSafety/fetchPointInfoList',
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
   * 跳转到监控大屏
   */
  goToMonitor = () => {
    const {
      match: {
        params: { companyId },
      },
    } = this.props;
    window.open(`${window.publicPath}#/big-platform/monitor/company/${companyId}`);
  };

  render() {
    const { monitorDataLoading, unitSafety } = this.props;

    return (
      <Layout
        extra="晶安科技有限公司"
      >
        <Row gutter={24} className={styles.row} style={{ margin: 0, padding: '16px 12px 24px' }}>
          {/* 左边 */}
          <Col span={6} className={styles.col}>
            {/* 企业信息 */}
            <div style={{ backgroundColor: 'white' }} className={styles.leftTop} />
            {/* 风险点信息 */}
            <div style={{ backgroundColor: 'white' }} className={styles.leftBottom} />
          </Col>

          {/* 中间 */}
          <Col span={12} className={styles.col}>
            {/* 安全风险四色图 */}
            <FourColor
              className={styles.centerTop}
              model={unitSafety}
              monitorDataLoading={monitorDataLoading}
              handleClickMonitorBall={this.goToMonitor}
            />
            {/* 单位巡查 */}
            <div style={{ backgroundColor: 'white' }} className={styles.centerBottom} />
          </Col>

          {/* 右边 */}
          <Col span={6} className={styles.col}>
            {/* 隐患详情 */}
            <div style={{ backgroundColor: 'white' }} className={styles.right} />
          </Col>
        </Row>
      </Layout>
    );
  }
}
