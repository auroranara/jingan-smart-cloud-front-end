import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import Header from '../UnitFireControl/components/Header/Header';

import styles from './Company.less';

import ExhaustMonitor from './ExhaustMonitor';

/**
 * 动态监测
 */
@connect(({ monitor }) => ({
  monitor,
}))
export default class App extends PureComponent {
  /**
   * 实时报警
   */
  renderRealTimeAlarm() {
    return <div />;
  }

  /**
   * 视频监控
   */
  renderVideoMonitor() {
    return <div />;
  }

  /**
   * 当前状态
   */
  renderCurrentState() {
    return <div />;
  }

  /**
   * 设备总数
   */
  renderDeviceTotalNumber() {
    return <div />;
  }

  /**
   * 失联设备
   */
  renderMissingDevice() {
    return <div />;
  }

  /**
   * 异常设备
   */
  renderAbnormalDevice() {
    return <div />;
  }

  /**
   * 用电安全监测
   */
  renderElectricitySafetyMonitor() {
    return <div />;
  }

  /**
   * 可燃/有毒气体监测
   */
  renderGasMonitor() {
    return <div />;
  }

  /**
   * 废水监测
   */
  renderEffluentMonitor() {
    return <div />;
  }

  /**
   * 废气监测
   */
  // renderExhaustMonitor() {
  //   return <div />;
  // }

  render() {
    // 从props中获取企业名称
    // const {
    //   monitor: {

    //   },
    // } = this.props;
    const companyName = '无锡晶安智慧';

    return (
      <div className={styles.main}>
        <Header title="晶安智慧安全云平台" extraContent={companyName} />
        <div className={styles.mainBody}>
          <Row gutter={12} style={{ height: '100%' }}>
            <Col span={6} style={{ height: '100%' }}>
              <div className={styles.realTimeAlarmContainer}>{this.renderRealTimeAlarm}</div>
              <div className={styles.videoMonitorContainer}>{this.renderVideoMonitor}</div>
            </Col>
            <Col span={18} style={{ height: '100%' }}>
              <Row gutter={12} style={{ paddingBottom: 6, height: '50%' }}>
                <Col span={13} style={{ height: '100%' }}>
                  <Row gutter={12} style={{ paddingBottom: 6, height: '50%' }}>
                    <Col span={12} style={{ height: '100%' }}>
                      {this.renderCurrentState}
                    </Col>
                    <Col span={12} style={{ height: '100%' }}>
                      {this.renderDeviceTotalNumber}
                    </Col>
                  </Row>
                  <Row gutter={12} style={{ paddingTop: 6, height: '50%' }}>
                    <Col span={12} style={{ height: '100%' }}>
                      {this.renderMissingDevice}
                    </Col>
                    <Col span={12} style={{ height: '100%' }}>
                      {this.renderAbnormalDevice}
                    </Col>
                  </Row>
                </Col>
                <Col span={11} style={{ height: '100%' }}>
                  {this.renderElectricitySafetyMonitor}
                </Col>
              </Row>
              <Row gutter={12} style={{ paddingTop: 6, height: '50%' }}>
                <Col span={8} style={{ height: '100%' }}>
                  {this.renderGasMonitor}
                </Col>
                <Col span={8} style={{ height: '100%' }}>
                  {this.renderEffluentMonitor}
                </Col>
                <Col span={8} style={{ height: '100%' }}>
                  <ExhaustMonitor />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
