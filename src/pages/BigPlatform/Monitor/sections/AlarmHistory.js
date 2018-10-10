import React, { PureComponent } from 'react';
import styles from './AlarmHistory.less';
import { Icon, Row, Col, Spin } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// import iconLight from '../../../../assets/icon-light.png' // 电
// import iconFire from '../../../../assets/icon-fire.png' // 可燃气体
// import iconWater from '../../../../assets/icon-water.png' // 废水
// import iconGas from '../../../../assets/icon-gas.png'// 废气
import noAlarm from '../../../../assets/no-alarm.png'

export default class AlarmHistory extends PureComponent {

  static propTypes = {
    selectedDeviceType: PropTypes.number,
  }

  static defaultProps = {
    selectedDeviceType: 1,
  }



  // 点击筛选
  handleFilter = ({ selectedDeviceType }) => {
    const { handleFilterHistory } = this.props
    handleFilterHistory(selectedDeviceType)
  }

  renderAlarmHistory = (list) => {
    return list.map((item, i) => (
      <Col key={item.id} span={24} className={i === 0 ? styles.alarmItem : classNames(styles.alarmItem, styles.mt10)} >
        <div className={styles.innerItem}>
          <div className={styles.alarmTitle}>
            <div className={styles.title}>
              <div className={styles.icon} style={{
                backgroundImage: `url(${item.icon})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: '65% 65%',
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
              {item.area}{item.area && item.location && '：'}{item.location}
            </span>
          </div>
        </div>
      </Col>
    ))
  }
  render() {
    const {
      historyAlarm: { list, alarmTypes },
      handleClose,
      loading,
      handleLoadMore,
      selectedDeviceType,
    } = this.props

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
              {alarmTypes.map((item) => (
                <Col span={8} className={styles.filter} key={item.deviceType}>
                  <div className={selectedDeviceType === item.deviceType ? styles.activeFilter : styles.inActiveFilter}
                    onClick={() => this.handleFilter({ selectedDeviceType: item.deviceType })}>
                    {item.typeName.length > 9 ? `${item.typeName.slice(0, 9)}...` : item.typeName}
                  </div>
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
