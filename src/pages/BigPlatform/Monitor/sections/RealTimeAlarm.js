import React, { PureComponent } from 'react';
import styles from './RealTimeAlarm.less'
import classNames from 'classnames';
import { Row, Col, Icon } from 'antd'
import Ellipsis from '@/components/Ellipsis';

// import iconLight from '../../../../assets/icon-light.png' // 电
// import iconFire from '../../../../assets/icon-fire.png' // 可燃气体
// import iconWater from '../../../../assets/icon-water.png' // 废水
// import iconGas from '../../../../assets/icon-gas.png'// 废气
import noAlarm from '../../../../assets/no-alarm.png'

export default class RealTimeAlarm extends PureComponent {

  renderAlarmList = () => {
    const { realTimeAlarm, handleClick } = this.props
    return realTimeAlarm.map((item, i) => (
      <Col key={item.id} span={24} className={i === 0 ? styles.alarmItem : classNames(styles.alarmItem, styles.mt10)} style={{ cursor: 'pointer' }} onClick={handleClick} >
        <div className={styles.innerItem}>
          <div className={styles.alarmTitle}>
            <div className={styles.title}>
              <div className={styles.icon} style={{
                backgroundImage: `url(${item.icon})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: '80% 80%',
              }}></div>
              <div className={styles.remarks}>{item.remarks}</div>
            </div>
            <span style={{ textAlign: 'right', color: '#516895' }}>{item.warningTime}</span>
          </div>
          <div className={styles.alarmDetail}>
            <Ellipsis lines={1} tooltip>
              <span>{item.messageContent}</span>
            </Ellipsis>
          </div>
          <div className={styles.location}>
            <span>
              <Icon type="environment" theme="outlined" />
              {item.area}：{item.location}
            </span>
          </div>
        </div>
      </Col>
    ))
  }

  render() {
    const { realTimeAlarm, handleViewHistory } = this.props
    return (
      <div className={styles.sectionMain}>
        <div className={styles.shadowIn}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleIcon} />
            实时报警
            <div className={styles.count}>共计 <span style={{ color: '#FF5256' }}>
              {(realTimeAlarm && realTimeAlarm.length) ? realTimeAlarm.length : 0}
            </span> 条</div>
            <div className={styles.history} onClick={handleViewHistory}>历史报警>></div>
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
