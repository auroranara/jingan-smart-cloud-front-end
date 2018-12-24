import React, { PureComponent } from 'react';
import styles from './AlarmHistory.less';
import { Icon, Row, Col, Spin } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import noAlarm from '@/assets/no-alarm.png'

export default class AlarmHistory extends PureComponent {

  static propTypes = {
    title: PropTypes.string.isRequired, // 模块标题
    selectedDeviceType: PropTypes.number, // 当前筛选栏选中的key
    handleFilterHistory: PropTypes.func.isRequired, // 点击筛选栏筛选
    data: PropTypes.shape({
      list: PropTypes.array.isRequired,  // 列表数组
      alarmTypes: PropTypes.array.isRequired, // 筛选栏所需数组
    }),
    handleClose: PropTypes.func.isRequired, // 点击右上角关闭历史记录
    loading: PropTypes.bool.isRequired, // 是否正在加载数据
    handleLoadMore: PropTypes.func.isRequired, // 加载更多数据
  }


  static defaultProps = {
    selectedDeviceType: 1,
    loading: false,
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
      data: { list = [], alarmTypes },
      handleClose,
      loading,
      handleLoadMore,
      selectedDeviceType,
      title,
    } = this.props

    return (
      <div className={styles.AlarmHistory}>
        <div className={styles.sectionMain}>
          <div className={styles.shadowIn}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionTitleIcon} />
              {title}
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
            {list && list.length > 0 ? (
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
