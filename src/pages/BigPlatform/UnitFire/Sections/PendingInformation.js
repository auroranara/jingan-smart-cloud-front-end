import React, { PureComponent } from 'react';
import styles from './PendingInformation.less';
import classNames from 'classnames';
import { Col, Icon, Radio, Spin } from 'antd';
import PropTypes from 'prop-types';
import Ellipsis from '@/components/Ellipsis';

import Section from '../components/Section/Section.js';
import noMsg from '../images/noMsg.png';
import videoIcon from '@/assets/videoCamera.png';

const prefix = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/';
const getPendingInfoType = (
  {
    report_type = null,
    fire_state = null,
    fault_state = null,
    main_elec_state = null,
    prepare_elec_state = null,
    start_state = null,
    supervise_state = null,
    shield_state = null,
    feedback_state = null,
  },
  returnType = 'title'
) => {
  let value = '';
  if (+report_type === 2) {
    value =
      (returnType === 'title' && '一键报修') ||
      (returnType === 'icon' && `${prefix}blue-baoxiu.png`);
  } else if (+fire_state === 1) {
    value = (returnType === 'title' && '火警') || (returnType === 'icon' && `${prefix}huojing.png`);
  } else if (+fault_state === 1 || +main_elec_state === 1 || +prepare_elec_state === 1) {
    value =
      (returnType === 'title' && '故障') || (returnType === 'icon' && `${prefix}blue-guzhang.png`);
  } else if (+start_state === 1) {
    value =
      (returnType === 'title' && '联动') || (returnType === 'icon' && `${prefix}blue-liandong.png`);
  } else if (+supervise_state === 1) {
    value =
      (returnType === 'title' && '监管') || (returnType === 'icon' && `${prefix}blue-jianguan.png`);
  } else if (+shield_state === 1) {
    value =
      (returnType === 'title' && '屏蔽') || (returnType === 'icon' && `${prefix}blue-pingbi.png`);
  } else if (+feedback_state === 1) {
    value =
      (returnType === 'title' && '反馈') || (returnType === 'icon' && `${prefix}blue-fankui.png`);
  }
  return value;
};
export default class PendingInformation extends PureComponent {
  static propTypes = {
    list: PropTypes.array.isRequired, // 展示的数组
    handleClick: PropTypes.func.isRequired, // 点击播放视频图标
    handleViewHistory: PropTypes.func.isRequired, // 点击查看历史记录
    title: PropTypes.string.isRequired, // 标题
    showTotal: PropTypes.bool, // 是否展示标题旁的统计数量
    onFilterChange: PropTypes.func.isRequired, // 点击筛选栏
  };

  static defaultProps = {
    showTotal: true,
  };

  renderMsgList = () => {
    const {
      list,
      status,
      handleClick,
      deviceWarningMessage,
      showMsgVideo,
      handleMsgVideoClose,
      handleVideoClose,
    } = this.props;
    return deviceWarningMessage.map(item => {
      const {
        id,
        remarks,
        messageContent,
        deviceId,
        paramCode,
        overFlag,
        companyId,
        deviceType,
        location,
        area,
        virtualId,
        warningTime,
        icon,
        deviceName,
        componentRegion,
        componentNo,
        deviceTypeList,
        videoList,
        fireMessage,
      } = item;
      if (fireMessage) return this.renderOldMsg(fireMessage);
      else
        return (
          <Col key={id} span={24} className={styles.alarmItem}>
            <div className={styles.innerItem}>
              <div className={styles.alarmTitle}>
                <div className={styles.title}>
                  <div
                    className={styles.icon}
                    style={{
                      backgroundImage: `url(${icon})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center center',
                      backgroundSize: '65% 65%',
                    }}
                  />
                  <div className={styles.redText}>水系统-报警</div>
                </div>
              </div>
              <div className={styles.alarmDetail}>
                <Ellipsis lines={1} tooltip>
                  <span>
                    {+deviceType === 101
                      ? '消防栓系统'
                      : +deviceType === 102
                        ? '自动喷淋系统'
                        : '水池/水箱'}
                  </span>
                </Ellipsis>
              </div>
              <div className={styles.alarmDetail}>
                <Ellipsis lines={1} tooltip>
                  <span>{messageContent}</span>
                </Ellipsis>
              </div>
              <div className={styles.lastLine}>
                <span>
                  <Icon type="environment" theme="outlined" />
                </span>
                <Ellipsis lines={1} tooltip className={styles.location}>
                  <span>{area + location}</span>
                </Ellipsis>
                <div className={styles.time}>
                  <span>{warningTime}</span>
                </div>
              </div>
            </div>
            {Array.isArray(videoList) &&
              videoList.length > 0 && (
                <div
                  className={styles.videoPlayButton}
                  onClick={() => {
                    handleVideoClose();
                    handleMsgVideoClose();
                    showMsgVideo(videoList);
                  }}
                >
                  <img src={videoIcon} alt="" />
                </div>
              )}
          </Col>
        );
    });
  };

  renderOldMsg = item => {
    const { handleClick, handleMsgVideoClose, handleVideoClose } = this.props;
    const newItem = {
      ...item,
      pendingInfoType: item.pendingInfoType || getPendingInfoType(item, 'title'),
      icon: item.icon || getPendingInfoType(item, 'icon'),
    };
    const {
      id,
      component_region = null,
      device_address = null,
      device_name = null,
      systemTypeValue = null,
      component_no = null,
      label = null,
      install_address = null,
      pendingInfoType = null,
      t,
      icon,
      ntype = null,
      fire_state = null,
    } = newItem;
    return pendingInfoType === '一键报修' ? (
      <Col key={id} span={24} className={styles.alarmItem}>
        <div className={styles.innerItem}>
          <div className={styles.alarmTitle}>
            <div className={styles.title}>
              <div
                className={styles.icon}
                style={{
                  backgroundImage: `url(${icon})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  backgroundSize: '65% 65%',
                }}
              />
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
            <span>
              <Icon type="environment" theme="outlined" />
            </span>
            <Ellipsis lines={1} tooltip className={styles.location}>
              <span>{device_address}</span>
            </Ellipsis>
            <div className={styles.time}>
              <span>{t}</span>
            </div>
          </div>
        </div>
        <div className={styles.topRightPurpleTag}>指派维保</div>
        <div
          className={styles.videoPlayButton}
          onClick={() => {
            handleVideoClose();
            handleMsgVideoClose();
            handleClick();
          }}
        >
          <img src={videoIcon} alt="" />
        </div>
      </Col>
    ) : (
      <Col key={id} span={24} className={styles.alarmItem}>
        <div className={styles.innerItem}>
          <div className={styles.alarmTitle}>
            <div className={styles.title}>
              <div
                className={styles.icon}
                style={{
                  backgroundImage: `url(${icon})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  backgroundSize: '65% 65%',
                }}
              />
              {+fire_state === 1 ? (
                <div className={styles.redText}>{pendingInfoType}</div>
              ) : (
                <div className={styles.blueText}>{pendingInfoType}</div>
              )}
            </div>
          </div>
          <div className={styles.alarmDetail}>
            {component_region}
            回路
            {component_no}号
          </div>
          <div className={styles.alarmDetail}>
            <Ellipsis lines={1} tooltip>
              <span>{label}</span>
            </Ellipsis>
          </div>
          <div className={styles.lastLine}>
            <span>
              <Icon type="environment" theme="outlined" />
            </span>
            <Ellipsis lines={1} tooltip className={styles.location}>
              <span>{install_address}</span>
            </Ellipsis>
            <div className={styles.time}>
              <span>{t}</span>
            </div>
          </div>
        </div>
        {ntype && ntype === '4' && <div className={styles.topRightPurpleTag}>指派维保</div>}
        {ntype && ntype === '3' && <div className={styles.topRightBlueTag}>自处理</div>}
        <div className={styles.videoPlayButton} onClick={handleClick}>
          <img src={videoIcon} alt="" />
        </div>
      </Col>
    );
  };

  renderAlarmList = () => {
    const { list, status, handleClick } = this.props;
    return list.map(
      (
        {
          id,
          component_region = null,
          device_address = null,
          device_name = null,
          systemTypeValue = null,
          component_no = null,
          label = null,
          install_address = null,
          pendingInfoType = null,
          t,
          icon,
          ntype = null,
          fire_state = null,
        },
        i
      ) =>
        pendingInfoType === '一键报修' ? (
          <Col
            key={i}
            span={24}
            className={i === 0 ? styles.alarmItem : classNames(styles.alarmItem, styles.mt10)}
          >
            <div className={styles.innerItem}>
              <div className={styles.alarmTitle}>
                <div className={styles.title}>
                  <div
                    className={styles.icon}
                    style={{
                      backgroundImage: `url(${icon})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center center',
                      backgroundSize: '65% 65%',
                    }}
                  />
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
                <span>
                  <Icon type="environment" theme="outlined" />
                </span>
                <Ellipsis lines={1} tooltip className={styles.location}>
                  <span>{device_address}</span>
                </Ellipsis>
                <div className={styles.time}>
                  <span>{t}</span>
                </div>
              </div>
            </div>
            <div className={styles.topRightPurpleTag}>指派维保</div>
            <div className={styles.videoPlayButton} onClick={handleClick}>
              <img src={videoIcon} alt="" />
            </div>
          </Col>
        ) : (
          <Col
            key={i}
            span={24}
            className={i === 0 ? styles.alarmItem : classNames(styles.alarmItem, styles.mt10)}
          >
            <div className={styles.innerItem}>
              <div className={styles.alarmTitle}>
                <div className={styles.title}>
                  <div
                    className={styles.icon}
                    style={{
                      backgroundImage: `url(${icon})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center center',
                      backgroundSize: '65% 65%',
                    }}
                  />
                  {+fire_state === 1 ? (
                    <div className={styles.redText}>
                      {status === '待处理'
                        ? pendingInfoType
                        : (+ntype === 1 && '误报火警') || (+ntype === 2 && '真实火警')}
                    </div>
                  ) : (
                    <div className={styles.blueText}>{pendingInfoType}</div>
                  )}
                </div>
              </div>
              <div className={styles.alarmDetail}>
                {component_region}
                回路
                {component_no}号
              </div>
              <div className={styles.alarmDetail}>
                <Ellipsis lines={1} tooltip>
                  <span>{label}</span>
                </Ellipsis>
              </div>
              <div className={styles.lastLine}>
                <span>
                  <Icon type="environment" theme="outlined" />
                </span>
                <Ellipsis lines={1} tooltip className={styles.location}>
                  <span>{install_address}</span>
                </Ellipsis>
                <div className={styles.time}>
                  <span>{t}</span>
                </div>
              </div>
            </div>
            {ntype && ntype === '4' && <div className={styles.topRightPurpleTag}>指派维保</div>}
            {ntype && ntype === '3' && <div className={styles.topRightBlueTag}>自处理</div>}
            <div className={styles.videoPlayButton} onClick={handleClick}>
              <img src={videoIcon} alt="" />
            </div>
          </Col>
        )
    );
  };

  render() {
    const {
      list,
      handleViewHistory,
      title,
      showTotal,
      onFilterChange,
      status,
      deviceWarningMessage,
      loading,
    } = this.props;
    const newTitle = (
      <span>
        {title}
        {showTotal && (
          <div className={styles.count}>
            共计 <span style={{ color: '#FF5256' }}>{list && list.length ? list.length : 0}</span>条
          </div>
        )}
      </span>
    );
    const extra = (
      <div className={styles.history} onClick={handleViewHistory}>
        历史消息>>
      </div>
    );
    return (
      <Section title={newTitle} action={extra} contentStyle={{ paddingLeft: 15 }}>
        <div className={styles.filterContainer}>
          <Radio.Group value={status} buttonStyle="solid" onChange={onFilterChange}>
            <Radio.Button value="实时消息">待处理</Radio.Button>
            {/* <Radio.Button value="待处理">待处理</Radio.Button> */}
            <Radio.Button value="处理中">处理中</Radio.Button>
          </Radio.Group>
        </div>

        <Spin wrapperClassName={styles.sectionContent} spinning={loading}>
          {(status === '实时消息' && deviceWarningMessage.length > 0) ||
          (status !== '实时消息' && list && list.length > 0) ? (
            <div>
              {status !== '实时消息' && this.renderAlarmList()}
              {status === '实时消息' && this.renderMsgList()}
            </div>
          ) : (
            <div className={styles.noAlarmContainer}>
              <div
                style={{
                  background: `url(${noMsg})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  backgroundSize: '100% 100%',
                }}
              />
            </div>
          )}
        </Spin>
      </Section>
    );
  }
}
