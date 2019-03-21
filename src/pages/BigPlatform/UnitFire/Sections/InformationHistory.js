import React, { PureComponent } from 'react';
import DrawerContainer from '../components/DrawerContainer';
import styles from './InformationHistory.less';
import { Icon, Row, Col, Spin } from 'antd';
import Ellipsis from '@/components/Ellipsis';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import noPendingInfo from '../images/emptyLogo.png';

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
export default class InformationHistory extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired, // 模块标题
    selectedDeviceType: PropTypes.number, // 当前筛选栏选中的key
    handleFilterHistory: PropTypes.func, // 点击筛选栏筛选
    data: PropTypes.shape({
      list: PropTypes.array.isRequired, // 列表数组
      alarmTypes: PropTypes.array, // 筛选栏所需数组
    }),
    // handleClose: PropTypes.func.isRequired, // 点击右上角关闭历史记录
    loading: PropTypes.bool.isRequired, // 是否正在加载数据
    handleLoadMore: PropTypes.func.isRequired, // 加载更多数据
  };

  static defaultProps = {
    selectedDeviceType: 1,
    loading: false,
  };

  // 点击筛选
  handleFilter = ({ selectedDeviceType }) => {
    const { handleFilterHistory } = this.props;
    handleFilterHistory(selectedDeviceType);
  };

  // 监听滚动
  handleOnScroll = () => {
    const { loading, handleLoadMore, isLast } = this.props;
    if (
      isLast ||
      loading ||
      this.historyList.scrollHeight - this.historyList.scrollTop - this.historyList.clientHeight >
        250
    ) {
      return;
    }
    handleLoadMore();
  };

  renderMsg = () => {
    const {
      data: { deviceWarningMsgHistory = [] },
    } = this.props;
    return deviceWarningMsgHistory.map(item => {
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
          </Col>
        );
    });
  };

  renderOldMsg = item => {
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
                <div className={styles.redText}>
                  {(+ntype === 1 && '误报火警') || (+ntype === 2 && '真实火警')}
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
      </Col>
    );
  };

  renderAlarmHistory = list => {
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
            {/* {systemTypeValue && <div className={styles.alarmDetail}>{systemTypeValue}</div>}
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
            </div> */}
            <div className={styles.topRightPurpleTag}>指派维保</div>
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
                      {(+ntype === 1 && '误报火警') || (+ntype === 2 && '真实火警')}
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
          </Col>
        )
    );
  };
  render() {
    const {
      data: { list, alarmTypes = [] },
      // handleClose,
      loading,
      selectedDeviceType,
      title,
      onClose,
      visible,
    } = this.props;
    const left = (
      <div className={styles.AlarmHistory}>
        <div className={styles.sectionMain}>
          {/* <div className={styles.shadowIn}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionTitleIcon} />
              {title}
              <div className={styles.iconClose}>
                <Icon onClick={handleClose} className={styles.icon} type="close" theme="outlined" />
              </div>
            </div> */}
          <Row className={styles.sectionFilter}>
            {alarmTypes &&
              alarmTypes.map(item => (
                <Col span={8} className={styles.filter} key={item.deviceType}>
                  <div
                    className={
                      selectedDeviceType === item.deviceType
                        ? styles.activeFilter
                        : styles.inActiveFilter
                    }
                    onClick={() => this.handleFilter({ selectedDeviceType: item.deviceType })}
                  >
                    {item.typeName.length > 9 ? `${item.typeName.slice(0, 9)}...` : item.typeName}
                  </div>
                </Col>
              ))}
          </Row>

          <Row className={styles.historyContent}>{this.renderMsg()}</Row>
          {/* {list && list.length > 0 ? (
            <div
              className={styles.historyContent}
              ref={historyList => {
                this.historyList = historyList;
              }}
              onScroll={this.handleOnScroll}
            >
              {this.renderAlarmHistory(list)}
              {loading && (
                <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                  <Spin />
                </div>
              )}
            </div>
          ) : (
            <div className={styles.noAlarmContainer}>
              <div
                className={styles.image}
                style={{
                  background: `url(${noPendingInfo})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center center',
                  backgroundSize: '100% 100%',
                }}
              >
                <div className={styles.text}>
                  <span>暂无消息</span>
                </div>
              </div>
            </div>
          )} */}
          {/* </div> */}
        </div>
      </div>
    );
    return (
      <DrawerContainer
        title={title}
        visible={visible}
        placement="right"
        destroyOnClose
        onClose={onClose}
        closable={true}
        width={530}
        left={left}
      />
    );
  }
}
