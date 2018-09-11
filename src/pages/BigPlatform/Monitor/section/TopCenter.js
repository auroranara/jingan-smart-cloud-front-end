import React, { PureComponent } from 'react';
import { Row, Col } from 'antd'
import WaterWave from 'components/Charts/WaterWave/New';
import styles from './TopCenter.less'
import classNames from 'classnames';

import abnormalDevice from '../../../../assets/abnormal-device.png'
import deviceTotalNumber from '../../../../assets/device-total-number.png'
import missingDevice from '../../../../assets/missing-device.png'

export default class TopCenter extends PureComponent {

  // 检测指数
  renderCurrentState = () => {
    return (
      <div className={styles.sectionMain}>
        <div className={styles.shadowIn}>
          <div className={styles.topTitle}>监测指数</div>
          <div className={styles.content}>
            <WaterWave
              color="#FF5256"
              percentColor="white"
              percentFontSize="48px"
              percent={45}
              isNumber={true}
            />
          </div>
        </div>
      </div>
    )
  }
  // 设备总数
  renderDeviceTotalNumber = () => {
    return this.renderSection('设备总数', deviceTotalNumber, 500)
  }
  // 失联设备
  renderMissingDevice = () => {
    return this.renderSection('失联设备', missingDevice, 50)
  }
  // 报警设备
  renderAbnormalDevice = () => {
    return this.renderSection('报警设备', abnormalDevice, 10)
  }
  renderSection = (title, src, number) => {
    return (
      <div className={styles.sectionMain}>
        <div className={styles.shadowIn}>
          <div className={styles.topTitle}>{title}</div>
          <div className={styles.sectionContent}>
            <div className={styles.leftImg} style={{
              backgroundImage: `url(${src})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: '100% 100%',
            }}></div>
            <div className={styles.rightNumber}>
              <span className={styles.text}>{number}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
  render() {
    return (
      <Col span={13} style={{ height: '100%' }} className={styles.topCenter}>
        <Row gutter={12} style={{ paddingBottom: 6, height: '50%' }}>
          <Col span={12} style={{ height: '100%' }}>{this.renderCurrentState()}</Col>
          <Col span={12} style={{ height: '100%' }}>{this.renderDeviceTotalNumber()}</Col>
        </Row>
        <Row gutter={12} style={{ paddingTop: 6, height: '50%' }}>
          <Col span={12} style={{ height: '100%' }}>{this.renderMissingDevice()}</Col>
          <Col span={12} style={{ height: '100%' }}>{this.renderAbnormalDevice()}</Col>
        </Row>
      </Col>
    )
  }
}
