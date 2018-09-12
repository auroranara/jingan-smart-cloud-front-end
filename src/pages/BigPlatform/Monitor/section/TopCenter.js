import React, { PureComponent } from 'react';
import { Row, Col } from 'antd'
import WaterWave from 'components/Charts/WaterWave/New';
import styles from './TopCenter.less'
// import classNames from 'classnames';

import abnormalDevice from '../../../../assets/abnormal-device.png'
import deviceTotalNumber from '../../../../assets/device-total-number.png'
import missingDevice from '../../../../assets/missing-device.png'

export default class TopCenter extends PureComponent {

  // 检测指数
  renderCurrentState = (number = 0) => {
    const { realTimeAlarm } = this.props
    const color = ((realTimeAlarm && realTimeAlarm.length || number < 80) && '#FF5256') || '#0082FD'
    return (
      <div className={styles.sectionMain}>
        <div className={styles.shadowIn}>
          <div className={styles.topTitle}>监测指数</div>
          <div className={styles.content}>
            <WaterWave
              color={color}
              percentColor="white"
              percentFontSize="48px"
              percent={number}
              isNumber={true}
            // style={{ width: '100%', height: 'calc(100% - 10px)' }}
            />
          </div>
        </div>
      </div>
    )
  }
  renderSection = (title, src, number = 0) => {
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
    const { countAndExponent: { score, count, outContact, unnormal } } = this.props


    return (
      <Col span={13} style={{ height: '100%' }} className={styles.topCenter}>
        <Row gutter={12} style={{ paddingBottom: 6, height: '50%' }}>
          <Col span={12} style={{ height: '100%' }}>{this.renderCurrentState(score)}</Col>
          <Col span={12} style={{ height: '100%' }}>{this.renderSection('设备总数', deviceTotalNumber, count)}</Col>
        </Row>
        <Row gutter={12} style={{ paddingTop: 6, height: '50%' }}>
          <Col span={12} style={{ height: '100%' }}>{this.renderSection('失联设备', missingDevice, outContact)}</Col>
          <Col span={12} style={{ height: '100%' }}>{this.renderSection('报警设备', abnormalDevice, unnormal)}</Col>
        </Row>
      </Col>
    )
  }
}
