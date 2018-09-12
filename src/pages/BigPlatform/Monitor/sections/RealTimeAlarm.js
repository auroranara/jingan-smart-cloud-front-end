import React, { PureComponent } from 'react';
import styles from './RealTimeAlarm.less'
import classNames from 'classnames';
import { Row, Col, Icon } from 'antd'

import iconLight from '../../../../assets/icon-light.png' // 电
import iconFire from '../../../../assets/icon-fire.png' // 可燃气体
import iconWater from '../../../../assets/icon-water.png' // 废水
import iconGas from '../../../../assets/icon-gas.png'// 废气
import noAlarm from '../../../../assets/no-alarm.png'

export default class RealTimeAlarm extends PureComponent {

  renderAlarmList = () => {
    const { realTimeAlarm } = this.props
    const iconList = [
      iconLight, iconFire, iconWater, iconGas,
    ]
    return realTimeAlarm.map((item, i) => (
      <Col key={item.id} span={24} className={i === 0 ? styles.alarmItem : classNames(styles.alarmItem, styles.mt10)} >
        <div className={styles.innerItem}>
          <div className={styles.icon} style={{
            backgroundImage: `url(${iconList[Number(item.deviceType) - 1]})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: '100% 100%',
          }}></div>
          <div className={styles.content}>
            <div className={styles.top}>
              <span style={{ verticalAlign: 'center' }}>{item.messageContent}</span>
            </div>
            <div className={styles.bottom}>
              <span>
                <Icon type="environment" theme="outlined" />
                {item.area}：{item.location}
              </span>
              <span>{item.warningTime}</span>
            </div>
          </div>
        </div>
      </Col>
    ))
  }

  render() {
    const { realTimeAlarm } = this.props
    return (
      <div className={styles.sectionMain}>
        <div className={styles.shadowIn}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleIcon} />
            实时报警
            <div className={styles.count}>共计<span style={{ color: '#FF5256' }}> 4 </span>条</div>
            {/* <div className={styles.history}>历史纪录>></div> */}
          </div>
          {realTimeAlarm && realTimeAlarm.length ? (
            <Row className={styles.sectionContent}>
              {this.renderAlarmList()}
            </Row>
          ) : (
              <div className={styles.noAlarmContainer}
                style={{
                  background: `url(${noAlarm})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  backgroundSize: '40% 55%',
                }}
              >
              </div>
            )}
        </div>
      </div>
    )
  }
}
