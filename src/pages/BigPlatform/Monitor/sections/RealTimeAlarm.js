import React, { PureComponent } from 'react';
import styles from './RealTimeAlarm.less'
import classNames from 'classnames';
import { Row, Col, Icon } from 'antd'
import PropTypes from 'prop-types';
import Ellipsis from '@/components/Ellipsis';

import noAlarm from '@/assets/no-alarm.png'
import videoIcon from '@/assets/videoCamera.png';

export default class RealTimeAlarm extends PureComponent {

  static propTypes = {
    list: PropTypes.array.isRequired, // 展示的数组
    handleClick: PropTypes.func.isRequired, // 点击播放视频图标
    handleViewHistory: PropTypes.func.isRequired,  // 点击查看历史记录
    title: PropTypes.string.isRequired,  // 标题
    showTotal: PropTypes.bool,  // 是否展示标题旁的统计数量
  }

  static defaultProps = {
    showTotal: true,
  }

  renderAlarmList = () => {
    const { list, handleClick } = this.props
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
              {item.area}{item.area && item.location && '：'}{item.location}
            </span>
          </div>
        </div>
        <div className={styles.videoPlayButton} onClick={handleClick}><img src={videoIcon} alt="" /></div>
      </Col>
    ))
  }

  render() {
    const { list = [], handleViewHistory, title, showTotal } = this.props
    return (
      <div className={styles.sectionMain}>
        <div className={styles.shadowIn}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleIcon} />
            {title}
            {showTotal && (
              <div className={styles.count}>
                共计 <span style={{ color: '#FF5256' }}>{(list && list.length) ? list.length : 0}</span>条
              </div>
            )}
            <div className={styles.history} onClick={handleViewHistory}>历史报警>></div>
          </div>
          {list && list.length > 0 ? (
            <Row className={styles.sectionContent}>
              {this.renderAlarmList()}
            </Row>
          ) : (
              <div className={styles.noAlarmContainer}>
                <div style={{
                  background: `url(${noAlarm})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  backgroundSize: '100% 100%',
                }}></div>
              </div>
            )}
        </div>
      </div>
    )
  }
}
