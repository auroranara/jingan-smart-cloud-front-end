import React, { PureComponent } from 'react';
import styles from './AlarmHistory.less';
import { Icon, Row, Col, Spin } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';

import iconLight from '../../../../assets/icon-light.png' // 电
import iconFire from '../../../../assets/icon-fire.png' // 可燃气体
import iconWater from '../../../../assets/icon-water.png' // 废水
import iconGas from '../../../../assets/icon-gas.png'// 废气
import noAlarm from '../../../../assets/no-alarm.png'

const deviceTypes = [
  {
    label: '用电安全',
    id: 1,
  },
  {
    label: '可燃有毒气体',
    id: 2,
  },
  {
    label: '废水监测',
    id: 3,
  },
  {
    label: '废气监测',
    id: 4,
  },
]

export default class AlarmHistory extends PureComponent {

  state = {
    selectedDeviceType: 1,
  }

  // 点击筛选
  handleFilter = ({ selectedDeviceType }) => {
    const { handleFilterHistory } = this.props
    this.setState({
      selectedDeviceType,
    })
    handleFilterHistory(selectedDeviceType)
  }

  renderAlarmHistory = (list) => {
    const iconList = [
      iconLight, iconFire, iconWater, iconGas,
    ]
    return list.map((item, i) => (
      <Col key={item.id} span={24} className={i === 0 ? styles.alarmItem : classNames(styles.alarmItem, styles.mt10)} >
        <div className={styles.innerItem}>
          <div className={styles.alarmTitle}>
            <div className={styles.title}>
              <div className={styles.icon} style={{
                backgroundImage: `url(${iconList[Number(item.deviceType) - 1]})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: '80% 80%',
              }}></div>
              <div className={styles.remarks}>{item.remarks || '暂无数据'}</div>
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
    const {
      historyAlarm: { list, isLast },
      handleClose,
      loading,
      handleLoadMore,
    } = this.props
    const { selectedDeviceType } = this.state


    return (
      <div className={styles.AlarmHistory}>
        <div className={styles.sectionMain}>
          <div className={styles.shadowIn}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionTitleIcon} />
              历史报警
              <div className={styles.iconClose}>
                <Icon onClick={handleClose} className={styles.icon} type="close" theme="outlined" />
              </div>
            </div>
            <Row className={styles.sectionFilter}>
              {deviceTypes.map((item, i) => (
                <Col span={8} className={styles.filter} key={item.id}>
                  <div className={selectedDeviceType === item.id ? styles.activeFilter : styles.inActiveFilter} onClick={() => this.handleFilter({ selectedDeviceType: item.id })}>{item.label}</div>
                </Col>
              ))}
            </Row>
            {list && list.length ? (
              <div
                className={styles.historyContent}
                ref={historyList => { this.historyList = historyList }}
                onScroll={() => {
                  !loading && (this.historyList.scrollHeight - this.historyList.scrollTop - this.historyList.clientHeight) < 220 && handleLoadMore({ deviceType: selectedDeviceType })
                }}>
                {this.renderAlarmHistory(list)}
                {loading && (
                  <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                    <Spin />
                  </div>
                )}
              </div>
            ) : (
                <div className={styles.noAlarmContainer}
                  style={{
                    background: `url(${noAlarm})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: '40% 25%',
                  }}
                >
                </div>
              )}
          </div>
        </div>
      </div>
    )
  }
}
