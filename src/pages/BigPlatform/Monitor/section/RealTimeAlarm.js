import React, { PureComponent } from 'react';
import styles from './RealTimeAlarm.less'
import classNames from 'classnames';
import { Row, Col, Icon } from 'antd'

import iconLight from '../../../../assets/icon-light.png' // 电
import iconFire from '../../../../assets/icon-fire.png' // 可燃气体
import iconWater from '../../../../assets/icon-water.png' // 废水
import iconGas from '../../../../assets/icon-gas.png'// 废气

export default class RealTimeAlarm extends PureComponent {

  renderAlarmList = () => {
    const list = [
      {
        id: '1',
        remarks: '',
        messageContent: '1号配电箱剩余电流>3300mA，达到2小时内7次',  // 消息内容
        deviceId: '',	//传感器id
        paramCode: '',
        overFlag: '',
        companyId: '',
        deviceType: 1,   // 1 电 2 可燃气体 3 水质 4 废气
        location: '厂区',	// 区域
        area: '一车间',	// 位置
        warningTime: '2018-3-5 15:00',  // 报警时间
      },
      {
        id: '2',
        remarks: '',
        messageContent: '可燃气体',  // 消息内容
        deviceId: '',	//传感器id
        paramCode: '',
        overFlag: '',
        companyId: '',
        deviceType: 2,   // 1 电 2 可燃气体 3 水质 4 废气
        location: '',	// 区域
        area: '',	// 位置
        warningTime: '2018-3-5 15:00',  // 报警时间
      },
      {
        id: '3',
        remarks: '',
        messageContent: '水质',  // 消息内容
        deviceId: '',	//传感器id
        paramCode: '',
        overFlag: '',
        companyId: '',
        deviceType: 3,   // 1 电 2 可燃气体 3 水质 4 废气
        location: '',	// 区域
        area: '',	// 位置
        warningTime: '2018-3-5 15:00',  // 报警时间
      },
      {
        id: '4',
        remarks: '',
        messageContent: '废气',  // 消息内容
        deviceId: '',	//传感器id
        paramCode: '',
        overFlag: '',
        companyId: '',
        deviceType: 4,   // 1 电 2 可燃气体 3 水质 4 废气
        location: '',	// 区域
        area: '',	// 位置
        warningTime: '2018-3-5 15:00',  // 报警时间
      },
      {
        id: '5',
        remarks: '',
        messageContent: '废气',  // 消息内容
        deviceId: '',	//传感器id
        paramCode: '',
        overFlag: '',
        companyId: '',
        deviceType: 4,   // 1 电 2 可燃气体 3 水质 4 废气
        location: '',	// 区域
        area: '',	// 位置
        warningTime: '2018-3-5 15:00',  // 报警时间
      },
    ]
    const iconList = [
      iconLight, iconFire, iconWater, iconGas,
    ]
    return list.map((item, i) => (
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

    return (
      <div className={styles.sectionMain}>
        <div className={styles.shadowIn}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleIcon} />
            实时报警
            <div className={styles.count}>共计<span style={{ color: '#FF5256' }}> 4 </span>条</div>
            <div className={styles.history}>历史纪录>></div>
          </div>
          <Row className={styles.sectionContent}>
            {this.renderAlarmList()}
          </Row>
        </div>
      </div>
    )
  }
}
