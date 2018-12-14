import React, { PureComponent } from 'react';
import styles from './PendingInformation.less'
import classNames from 'classnames';
import { Row, Col, Icon, Radio } from 'antd'
import PropTypes from 'prop-types';
import Ellipsis from '@/components/Ellipsis';

import noAlarm from '@/assets/no-alarm.png'
import videoIcon from '@/assets/videoCamera.png';

export default class PendingInformation extends PureComponent {

  static propTypes = {
    list: PropTypes.array.isRequired, // 展示的数组
    handleClick: PropTypes.func.isRequired, // 点击播放视频图标
    handleViewHistory: PropTypes.func.isRequired,  // 点击查看历史记录
    title: PropTypes.string.isRequired,  // 标题
    showTotal: PropTypes.bool,  // 是否展示标题旁的统计数量
    onFilterChange: PropTypes.func.isRequired, // 点击筛选栏
  }

  static defaultProps = {
    showTotal: true,
  }

  renderAlarmList = () => {
    const { list } = this.props
    return list.map(({ id, component_region = null, deviceAddress = null, devideName = null, systemTypeValue = null, component_no = null, label = null, install_address = null, pendingInfoType = null, t, icon, ntype = null }, i) => pendingInfoType === '一键报修' ? (
      <Col key={i} span={24} className={i === 0 ? styles.alarmItem : classNames(styles.alarmItem, styles.mt10)} >
        <div className={styles.innerItem}>
          <div className={styles.alarmTitle}>
            <div className={styles.title}>
              <div className={styles.icon} style={{
                backgroundImage: `url(${icon})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: '65% 65%',
              }}></div>
              <div className={styles.remarks}>{pendingInfoType}</div>
            </div>
          </div>
          {systemTypeValue && <div className={styles.alarmDetail}>{systemTypeValue}</div>}
          <div className={styles.alarmDetail}>
            <Ellipsis lines={1} tooltip>
              <span>{devideName}</span>
            </Ellipsis>
          </div>
          <div className={styles.lastLine}>
            <div className={styles.location}>
              <span><Icon type="environment" theme="outlined" />{deviceAddress}</span>
            </div>
            <div className={styles.time}><span>{t}</span></div>
          </div>
        </div>
        <div className={styles.topRightPurpleTag}>指派维保</div>)
        {/* <div className={styles.videoPlayButton} onClick={handleClick}><img src={videoIcon} alt="" /></div> */}
      </Col>
    ) : (<Col key={i} span={24} className={i === 0 ? styles.alarmItem : classNames(styles.alarmItem, styles.mt10)} >
      <div className={styles.innerItem}>
        <div className={styles.alarmTitle}>
          <div className={styles.title}>
            <div className={styles.icon} style={{
              backgroundImage: `url(${icon})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: '65% 65%',
            }}></div>
            <div className={styles.remarks}>{pendingInfoType}</div>
          </div>
        </div>
        <div className={styles.alarmDetail}>
          {component_region}回路{component_no}号
          </div>
        <div className={styles.alarmDetail}>
          <Ellipsis lines={1} tooltip>
            <span>{label}</span>
          </Ellipsis>
        </div>
        <div className={styles.lastLine}>
          <div className={styles.location}>
            <span><Icon type="environment" theme="outlined" />{install_address}</span>
          </div>
          <div className={styles.time}><span>{t}</span></div>
        </div>
      </div>
      {ntype && ntype === '4' && (<div className={styles.topRightPurpleTag}>指派维保</div>)}
      {ntype && ntype === '3' && (<div className={styles.topRightBlueTag}>自处理</div>)}
      {/* <div className={styles.videoPlayButton} onClick={handleClick}><img src={videoIcon} alt="" /></div> */}
    </Col>
      ))
  }

  render() {
    const { list, handleViewHistory, title, showTotal, onFilterChange, status } = this.props
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
          <div className={styles.filterContainer}>
            <Radio.Group value={status} buttonStyle="solid" onChange={onFilterChange}>
              <Radio.Button value="待处理">待处理</Radio.Button>
              <Radio.Button value="处理中">处理中</Radio.Button>
            </Radio.Group>
          </div>
          {list && list.length ? (
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
