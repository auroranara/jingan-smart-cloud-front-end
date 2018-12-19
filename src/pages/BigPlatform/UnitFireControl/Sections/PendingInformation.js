import React, { PureComponent } from 'react';
import styles from './PendingInformation.less'
import classNames from 'classnames';
import { Row, Col, Icon, Radio, Spin } from 'antd'
import PropTypes from 'prop-types';
import Ellipsis from '@/components/Ellipsis';

import noPendingInfo from '../images/noPendingInfo.png';
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
    const { list, status } = this.props
    return list.map(({ id, component_region = null, device_address = null, device_name = null, systemTypeValue = null, component_no = null, label = null, install_address = null, pendingInfoType = null, t, icon, ntype = null, fire_state = null }, i) => pendingInfoType === '一键报修' ? (
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
              <div className={styles.blueText}>{pendingInfoType}</div>
            </div>
          </div>
          {systemTypeValue && <div className={styles.alarmDetail}>{systemTypeValue}</div>}
          <div className={styles.alarmDetail}>
            <Ellipsis lines={1} tooltip>
              <span>{device_name}</span>
            </Ellipsis>
          </div>
          <div className={styles.lastLine}>
            <div className={styles.location}>
              <span><Icon type="environment" theme="outlined" />{device_address}</span>
            </div>
            <div className={styles.time}><span>{t}</span></div>
          </div>
        </div>
        <div className={styles.topRightPurpleTag}>指派维保</div>
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
            {+fire_state === 1 ? (
              <div className={styles.redText}>{status === '待处理' ? pendingInfoType : (+ntype === 1 && '误报火警') || (+ntype === 2 && '真实火警')}</div>
            ) : (
                <div className={styles.blueText}>{pendingInfoType}</div>
              )}
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
    </Col>
      ))
  }

  render() {
    const { list, handleViewHistory, title, showTotal, onFilterChange, status, loading } = this.props
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
            <div className={styles.history} onClick={handleViewHistory}>历史消息>></div>
          </div>
          <div className={styles.filterContainer}>
            <Radio.Group value={status} buttonStyle="solid" onChange={onFilterChange}>
              <Radio.Button value="待处理">待处理</Radio.Button>
              <Radio.Button value="处理中">处理中</Radio.Button>
            </Radio.Group>
          </div>
          {list && list.length > 0 ? (
            <Spin wrapperClassName={styles.sectionContent} spinning={loading}>
              {this.renderAlarmList()}
            </Spin>
          ) : (
              <div className={styles.noAlarmContainer}>
                <div style={{
                  background: `url(${noPendingInfo})`,
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
