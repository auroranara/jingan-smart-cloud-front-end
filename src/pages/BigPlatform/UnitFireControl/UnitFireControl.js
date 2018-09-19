import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Header from './components/Header/Header';
import Section from './components/Section/Section';
import FireAlarmSystem from './components/FireAlarmSystem/FireAlarmSystem';
import StatisticsOfMaintenance from './components/StatisticsOfMaintenance/StatisticsOfMaintenance';
import StatisticsOfHiddenDanger from './components/StatisticsOfHiddenDanger/StatisticsOfHiddenDanger';
import StatisticsOfFireControl from './components/StatisticsOfFireControl/StatisticsOfFireControl';
import Rotate from 'components/Rotate';
import VideoPlay from '../FireControl/section/VideoPlay';
import Ellipsis from '../../../components/Ellipsis';
import resetKeyIcon from './images/resetKey.png';
import resetKeyPressIcon from './images/resetKeyPress.png';
import hostIcon from './images/hostIcon.png';
import fireHostIcon from './images/fireHostIcon.png';
import noPhotoIcon from './images/noPhoto.png';
import noPendingInfo from './images/noPendingInfo.png';
import noHiddenDangerRecords from './images/noHiddenDangerRecords.png';
import dfcIcon from './images/dfc.png';
import wcqIcon from './images/wcq.png';
import ycqIcon from './images/ycq.png';
import backIcon from '../FireControl/img/back.png';

import styles from './UnitFireControl.less';

const prefix = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/';
const fireIcon = `${prefix}fire_hj.png`;
const faultIcon = `${prefix}fire_gz.png`;
const positionBlueIcon = `${prefix}fire_position_blue.png`;
const positionRedIcon = `${prefix}fire_position_red.png`;
const splitIcon = `${prefix}split.png`;
const splitHIcon = `${prefix}split_h.png`;
/* 待处理信息项 */
const PendingInfoItem = ({ data, onClick }) => {
  const { id, t, install_address, component_region, component_no, label, pendingInfoType } = data;
  const isFire = pendingInfoType === '火警';
  return (
    <div
      key={id}
      className={styles.pendingInfoItem}
      style={{ color: isFire ? '#FF6464' : '#00ADFF', cursor: onClick && 'pointer' }}
      onClick={onClick}
    >
      <div style={{ backgroundImage: `url(${isFire ? fireIcon : faultIcon})` }}>
        {pendingInfoType}
        <div className={styles.pendingInfoItemTime}>{t}</div>
      </div>
      <div>
        {component_region}
        回路
        {component_no}号
      </div>
      <div>{label}</div>
      <div style={{ backgroundImage: `url(${isFire ? positionRedIcon : positionBlueIcon})` }}>
        {install_address}
      </div>
    </div>
  );
};

/**
 * 隐患巡查记录项
 */
const HiddenDangerRecord = ({ data }) => {
  const {
    id,
    status,
    desc,
    report_user_name,
    report_time,
    rectify_user_name,
    plan_rectify_time,
    real_rectify_time,
    review_user_name,
    hiddenDangerRecordDto,
  } = data;
  let [{ fileWebUrl = '' } = {}] = hiddenDangerRecordDto || [];
  fileWebUrl = fileWebUrl ? fileWebUrl.split(',')[0] : '';
  const { badge, icon, color } = getIconByStatus(status);
  const isYCQ = +status === 7;
  const isDFC = +status === 3;
  const rectify_time = isDFC ? real_rectify_time : plan_rectify_time;
  return (
    <div className={styles.hiddenDangerRecord} key={id}>
      <div
        className={styles.hiddenDangerRecordBadge}
        style={{ backgroundImage: badge && `url(${badge})` }}
      />
      <div style={{ backgroundImage: `url(${noPhotoIcon})` }}>
        <div style={{ position: 'relative', width: '100%', textAlign: 'center' }}>
          <img
            src={fileWebUrl && fileWebUrl.split(',')[0]}
            alt=""
            style={{ display: 'block', width: '100%', margin: '0 auto' }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: 'rgba(0, 168, 255, 0.3)',
            }}
          />
        </div>
      </div>
      <div>
        <div style={{ backgroundImage: `url(${icon})`, color }}>
          <Ellipsis lines={2} tooltip>
            {desc || <span style={{ color: '#fff' }}>暂无隐患描述</span>}
          </Ellipsis>
        </div>
        <div>
          <span>上<span style={{ opacity: '0' }}>隐藏</span>报：</span>
          <Ellipsis lines={1} tooltip>
            <span style={{ marginRight: '16px' }}>{report_user_name}</span>
            {moment(+report_time).format('YYYY-MM-DD')}
          </Ellipsis>
        </div>
        <div>
          <span>{isDFC?'实际整改：':'计划整改：'}</span>
          <Ellipsis lines={1} tooltip>
            <span style={{ marginRight: '16px' }}>{rectify_user_name}</span>
            <span style={{ color: isYCQ?'#FF6464':undefined }}>
              {moment(+rectify_time).format('YYYY-MM-DD')}
            </span>
          </Ellipsis>
        </div>
        {isDFC && (
          <div>
            <span>复<span style={{ opacity: '0' }}>隐藏</span>查：</span>
            <Ellipsis lines={1} tooltip>
              <span>{review_user_name}</span>
            </Ellipsis>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 复位主机
 */
const Host = ({ data, onClick }) => {
  const { id, deviceCode, installLocation, isReset, isFire } = data;
  const hostInfoItemClassName = +isFire && !isReset
    ? `${styles.hostInfoItem} ${styles.fireHostInfoItem}`
    : styles.hostInfoItem;
  return (
    <div className={styles.hostContainer} key={id}>
      <div className={styles.hostIconContainer}>
        <img src={+isFire && !isReset ? fireHostIcon : hostIcon} alt="" />
      </div>
      <div className={styles.hostInfoContainer}>
        <div className={hostInfoItemClassName}>
          <span>主机编号：</span>
          <span>{deviceCode}</span>
        </div>
        <div className={hostInfoItemClassName}>
          <span>安装位置：</span>
          <span>{installLocation}</span>
        </div>
      </div>
      <div
        className={styles.hostResetButton}
        style={{ cursor: isReset ? 'not-allowed' : 'pointer' }}
        onClick={isReset ? undefined : onClick}
      >
        <img src={isReset ? resetKeyPressIcon : resetKeyIcon} alt="" />
      </div>
    </div>
  );
};

/**
 * 根据status获取对应的标记
 */
const getIconByStatus = status => {
  switch (+status) {
    case 3:
      return {
        color: '#00ADFF',
        badge: dfcIcon,
        icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_blue.png',
      };
    case 1:
    case 2:
      return {
        color: '#00ADFF',
        badge: wcqIcon,
        icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_blue.png',
      };
    case 7:
      return {
        color: '#FF6464',
        badge: ycqIcon,
        icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_red.png',
      };
    default:
      return {
        color: '#00ADFF',
        icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_blue.png',
      };
  }
};

/**
 * 获取待处理信息的类型
 */
const getPendingInfoType = ({
  fire_state,
  fault_state,
  main_elec_state,
  prepare_elec_state,
  start_state,
  supervise_state,
  shield_state,
  feedback_state,
}) => {
  let type = '';
  if (+fire_state === 1) {
    type = '火警';
  } else if (+fault_state === 1 || +main_elec_state === 1 || +prepare_elec_state === 1) {
    type = '故障';
  } else if (+start_state === 1) {
    type = '联动';
  } else if (+supervise_state === 1) {
    type = '监管';
  } else if (+shield_state === 1) {
    type = '屏蔽';
  } else if (+feedback_state === 1) {
    type = '反馈';
  }
  return type;
};

/* 默认选中的消防数据统计类型 */
const defaultFireControlType = 1;
/* 默认选中的隐患巡查统计类型 */
const defaultHiddenDangerType = moment().get('month');
/* 默认选中的维保情况统计类型 */
const defaultMaintenanceType = 6;

/**
 * 单位消防大屏
 */
@connect(({ unitFireControl }) => ({
  unitFireControl,
}))
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fireControlType: defaultFireControlType,
      hiddenDangerType: defaultHiddenDangerType,
      maintenanceType: defaultMaintenanceType,
      frontIndex: 0,
      videoVisible: false,
    };
    // 轮询定时器
    this.pollingTimer = null;
  }

  /**
   * 挂载后声明周期函数
   */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 立即执行轮询
    this.polling();

    // 获取隐患巡查记录
    dispatch({
      type: 'unitFireControl/fetchHiddenDangerRecords',
      payload: {
        company_id: companyId,
      },
    });

    // 获取隐患巡查统计
    dispatch({
      type: 'unitFireControl/fetchHiddenDangerCount',
      payload: {
        companyId,
        month: moment({ month: defaultHiddenDangerType }).format('YYYY-MM'),
      },
    });

    // 获取视频列表
    dispatch({
      type: 'unitFireControl/fetchVideoList',
      payload: {
        company_id: companyId,
      },
    });

    // 设置轮询
    this.pollingTimer = setInterval(this.polling, 5000);
  }

  /**
   * 组件销毁
   */
  componentWillUnmount() {
    clearInterval(this.pollingTimer);
  }

  /**
   * 轮询回调
   */
  polling = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { fireControlType, maintenanceType } = this.state;
    // 获取待处理信息
    dispatch({
      type: 'unitFireControl/fetchPendingInfo',
      payload: {
        companyId,
      },
    });

    // 获取待处理火警和待处理故障数量
    dispatch({
      type: 'unitFireControl/fetchPendingNumber',
      payload: {
        companyId,
      },
    });

    // 超期未整改隐患数量
    dispatch({
      type: 'unitFireControl/fetchOutOfDateNumber',
      payload: {
        companyId,
      },
    });

    // 获取待整改隐患数量
    dispatch({
      type: 'unitFireControl/fetchToBeRectifiedNumber',
      payload: {
        companyId,
      },
    });

    // 获取待巡查任务数量
    dispatch({
      type: 'unitFireControl/fetchToBeInspectedNumber',
      payload: {
        companyId,
      },
    });

    // 获取火灾报警系统
    dispatch({
      type: 'unitFireControl/fetchFireAlarmSystem',
      payload: {
        companyId,
      },
    });

    // 获取消防数据统计
    dispatch({
      type: 'unitFireControl/fetchFireControlCount',
      payload: {
        companyId,
        t: fireControlType,
      },
    });

    // 获取维保情况统计
    dispatch({
      type: 'unitFireControl/fetchMaintenanceCount',
      payload: {
        companyId,
        type: maintenanceType,
      },
    });

    // 获取主机列表
    dispatch({
      type: 'unitFireControl/fetchHosts',
      payload: {
        companyId,
      },
    });
  };

  /**
   * 消防数据统计tab切换事件
   */
  handleSwitchFireControlType = fireControlType => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.setState({
      fireControlType,
    });
    // 重新获取消防数据统计
    dispatch({
      type: 'unitFireControl/fetchFireControlCount',
      payload: {
        companyId,
        t: fireControlType,
      },
    });
  };

  /**
   * 隐患巡查统计tab切换事件
   */
  handleSwitchHiddenDangerType = hiddenDangerType => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.setState({
      hiddenDangerType,
    });
    // 重新获取隐患巡查统计
    dispatch({
      type: 'unitFireControl/fetchHiddenDangerCount',
      payload: {
        companyId,
        month: moment({ month: hiddenDangerType }).format('YYYY-MM'),
      },
    });
  };

  /**
   * 维保情况统计tab切换事件
   */
  handleSwitchMaintenanceType = maintenanceType => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.setState({
      maintenanceType,
    });
    // 重新获取隐患巡查统计
    dispatch({
      type: 'unitFireControl/fetchMaintenanceCount',
      payload: {
        companyId,
        type: maintenanceType,
      },
    });
  };

  /**
   * 显示一键复位模块
   */
  handleShowResetSection = () => {
    const {
      dispatch,
      match: {
        params: { unitId },
      },
    } = this.props;
    // 获取主机列表
    dispatch({
      type: 'unitFireControl/fetchHosts',
      payload: {
        companyId: unitId,
      },
    });
    // 显示一键复位模块
    this.setState({
      frontIndex: 1,
    });
  };

  /**
   * 隐藏一键复位模块
   */
  handleHideResetSection = () => {
    // 立即更新数据
    this.polling();
    // 隐藏一键复位模块
    this.setState({
      frontIndex: 0,
    });
  };

  /**
   * 复位单个主机
   */
  handleResetSingleHost = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitFireControl/changeSingleHost',
      payload: {
        id,
      },
    });
  };

  /**
   * 复位所有主机
   */
  handleResetAllHosts = () => {
    const {
      dispatch,
      match: {
        params: { unitId },
      },
    } = this.props;
    // 获取主机列表
    dispatch({
      type: 'unitFireControl/changeAllHosts',
      payload: {
        companyId: unitId,
      },
    });
  };

  /**
   * 打开视频播放
   */
  handleVideoOpen = () => {
    this.setState({ videoVisible: true });
  };

  /**
   * 关闭视频播放
   */
  handleVideoClose = () => {
    this.setState({ videoVisible: false });
  };

  /**
   * 渲染所有统计信息块
   */
  renderAllCountSection() {
    const {
      // 待处理火警数量
      pendingFireNumber = 0,
      // 待处理故障数量
      pendingFaultNumber = 0,
      // 超期未整改隐患数量
      outOfDateNumber = 0,
      // 待整改隐患数量
      toBeRectifiedNumber = 0,
      // 待巡查任务数量
      toBeInspectedNumber = 0,
      maintenanceCount: { needRepairNum = 0 } = {},
    } = this.props.unitFireControl;

    return (
      <Section>
        <div className={styles.countContainer}>
          <Row className={styles.countContainerRow}>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue} style={{ color: '#FF6464' }}>
                {pendingFireNumber}
              </div>
              <div className={styles.countName}>待处理火警</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{pendingFaultNumber}</div>
              <div className={styles.countName}>待处理故障</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{outOfDateNumber}</div>
              <div className={styles.countName}>超期未整改隐患</div>
            </Col>
          </Row>
          <Row className={styles.countContainerRow}>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{toBeRectifiedNumber}</div>
              <div className={styles.countName}>待整改隐患</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{needRepairNum}</div>
              <div className={styles.countName}>待维保任务</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{toBeInspectedNumber}</div>
              <div className={styles.countName}>待巡查任务</div>
            </Col>
          </Row>
          <div className={styles.firstVerticalLine}>
            <img src={splitIcon} alt="" />
          </div>
          <div className={styles.secondVerticalLine}>
            <img src={splitIcon} alt="" />
          </div>
          <div className={styles.horizontalLine}>
            <img src={splitHIcon} alt="" />
          </div>
        </div>
      </Section>
    );
  }

  /**
   * 火灾警报系统
   */
  renderFireAlarmSystem() {
    // 从props中获取数据
    const {
      fireAlarmSystem: {
        fire_state = 0,
        fault_state = 0,
        start_state = 0,
        supervise_state = 0,
        shield_state = 0,
        feedback_state = 0,
      },
      hosts,
    } = this.props.unitFireControl;
    const { frontIndex } = this.state;
    const isResetAll = hosts.filter(({ isReset }) => isReset).length === hosts.length;
    return (
      <Rotate frontIndex={frontIndex}>
        <FireAlarmSystem
          fire={fire_state}
          fault={fault_state}
          shield={shield_state}
          linkage={start_state}
          supervise={supervise_state}
          feedback={feedback_state}
          fixedContent={hosts.length > 0 && (
            <Tooltip overlayClassName={styles.tooltip} title="一键复位功能只对平台数据进行复位，并不能控制主机复位。如需复位火警等，需到消防主机进行复位">
              <div className={styles.resetButton} onClick={this.handleShowResetSection}>
                <img src={resetKeyIcon} alt="" />
                一键复位
              </div>
            </Tooltip>
          )}
          // onClick={this.handleVideoOpen}
        />
        <Section
          title="一键复位"
          isScroll
          contentStyle={{
            borderTop: '2px solid #0967D3',
            paddingLeft: '16px',
            marginLeft: '-16px',
            paddingBottom: '48px',
          }}
          fixedContent={
            <Fragment>
              <div className={styles.backButton} onClick={this.handleHideResetSection}>
                <img src={backIcon} alt="" />
              </div>
              <div className={styles.hostSectionBottom}>
                <div className={styles.hostNumber}>
                  <span>主机数量：</span>
                  <span>{hosts.length}</span>
                </div>
                <div
                  className={styles.resetAllHostsButton}
                  style={{
                    cursor: isResetAll ? 'not-allowed' : undefined,
                    backgroundColor: isResetAll ? '#0D3473' : undefined,
                    color: isResetAll ? '#0967d3' : undefined,
                  }}
                  onClick={isResetAll ? undefined : this.handleResetAllHosts}
                >
                  全部复位
                </div>
              </div>
            </Fragment>
          }
        >
          {hosts.length !== 0 ? (
            hosts.map(item => {
              const { id } = item;
              return (
                <Host
                  key={id}
                  data={item}
                  onClick={() => {
                    this.handleResetSingleHost(id);
                  }}
                />
              );
            })
          ) : (
            <div style={{ textAlign: 'center', paddingTop: '12px', fontSize: '14px' }}>
              暂无主机
            </div>
          )}
        </Section>
      </Rotate>
    );
  }

  /**
   * 渲染消防数据统计块（未完成）
   */
  renderStatisticsOfFireControl() {
    const {
      fireControlCount: {
        warnTrue = 0,
        warnFalse = 0,
        fire_state = 0,
        fault_state = 0,
        start_state = 0,
        shield_state = 0,
        feedback_state = 0,
        supervise_state = 0,
      },
    } = this.props.unitFireControl;
    const { fireControlType } = this.state;

    return (
      <StatisticsOfFireControl
        type={fireControlType}
        real={warnTrue}
        misinformation={warnFalse}
        pending={fire_state - warnTrue - warnFalse}
        fault={fault_state}
        shield={shield_state}
        linkage={start_state}
        supervise={supervise_state}
        feedback={feedback_state}
        onSwitch={this.handleSwitchFireControlType}
      />
    );
  }

  /**
   * 隐患巡查统计模块
   */
  renderStatisticsOfHiddenDanger() {
    const {
      hiddenDangerCount: {
        dangerType: [
          {
            // 随手拍
            random_photo = 0,
            // 风险点
            from_self_check_point = 0,
          } = {},
        ] = [],
        dangerDto: {
          // 已超期
          over_rectify_num = 0,
          // 待复查
          rectify_num = 0,
          // 待整改
          total_num = 0,
          // 已关闭
          count_closed_danger = 0,
        } = {},
      },
    } = this.props.unitFireControl;
    const { hiddenDangerType } = this.state;

    return (
      <StatisticsOfHiddenDanger
        type={hiddenDangerType}
        onSwitch={this.handleSwitchHiddenDangerType}
        ssp={random_photo}
        fxd={from_self_check_point}
        cqwzg={over_rectify_num}
        dfc={rectify_num}
        dzg={total_num - over_rectify_num - rectify_num - count_closed_danger}
        ygb={count_closed_danger}
      />
    );
  }

  /**
   * 维保情况统计
   */
  renderStatisticsOfMaintenance() {
    const {
      maintenanceCount: {
        selfAllNum = 0,
        selfNoNum = 0,
        selfDoingNum = 0,
        selfFinishNum = 0,
        assignAllNum = 0,
        assignNoNum = 0,
        assignDoingNum = 0,
        assignFinishNum = 0,
        avgSelfTime = '',
        selfRate = '100%',
        avgAssignTime = '',
        assignRate = '100%',
      },
    } = this.props.unitFireControl;
    const { maintenanceType } = this.state;

    return (
      <StatisticsOfMaintenance
        type={maintenanceType}
        onSwitch={this.handleSwitchMaintenanceType}
        maintenance={{
          name: '维保单位',
          total: assignAllNum,
          repaired: assignFinishNum,
          unrepaired: assignNoNum,
          repairing: assignDoingNum,
          duration: avgAssignTime,
          rate: assignRate,
        }}
        local={{
          total: selfAllNum,
          repaired: selfFinishNum,
          unrepaired: selfNoNum,
          repairing: selfDoingNum,
          duration: avgSelfTime,
          rate: selfRate,
        }}
      />
    );
  }

  /**
   * 渲染函数
   */
  render() {
    // 从props中获取单位名称
    const {
      unitFireControl: {
        // 待处理信息
        pendingInfo,
        // 消防巡查统计
        hiddenDangerCount: {
          // 企业名称
          companyName,
        },
        // 隐患巡查记录
        hiddenDangerRecords,
        // 视频列表
        videoList,
      },
    } = this.props;
    const { videoVisible } = this.state;
    const pendingInfoList = pendingInfo.map(item => {
      return {
        ...item,
        pendingInfoType: getPendingInfoType(item),
      };
    });

    return (
      <div className={styles.main}>
        <Header title="晶安智慧消防云平台" extraContent={companyName} />
        <div className={styles.mainBody}>
          <Row gutter={16} style={{ marginBottom: 16, height: 'calc(48.92% - 16px)' }}>
            <Col span={6} style={{ height: '100%' }}>
              <Section isScroll isCarousel splitHeight={48}>
                {pendingInfoList.length !== 0 ? (
                  [
                    ...pendingInfoList.filter(({ pendingInfoType }) => pendingInfoType === '火警'),
                    ...pendingInfoList.filter(({ pendingInfoType }) => pendingInfoType !== '火警'),
                  ].map((item, index) => {
                    const { id } = item;
                    return <PendingInfoItem key={id || index} data={item} onClick={this.handleVideoOpen} />;
                  }).concat(<div key="split" className={styles.splitText}>——已经到底了，您即将看到第一条信息——</div>)
                ) : (
                  <div className={styles.noPendingInfo} style={{ backgroundImage: `url(${noPendingInfo})` }}></div>
                )}
              </Section>
            </Col>
            <Col span={12} style={{ height: '100%' }}>
              {this.renderAllCountSection()}
            </Col>
            <Col span={6} style={{ height: '100%' }}>
              {this.renderFireAlarmSystem()}
            </Col>
          </Row>
          <Row gutter={16} style={{ height: '51.08%' }}>
            <Col span={6} style={{ height: '100%' }}>
              <Section isScroll isCarousel title="隐患巡查记录">
                {hiddenDangerRecords.length !== 0 ? (
                  hiddenDangerRecords.map(item => {
                    const { id } = item;
                    return <HiddenDangerRecord key={id} data={item} />;
                  })
                ) : (
                  <div className={styles.noPendingInfo} style={{ backgroundImage: `url(${noHiddenDangerRecords})` }}></div>
                )}
              </Section>
            </Col>
            <Col span={6} style={{ height: '100%' }}>
              {this.renderStatisticsOfFireControl()}
            </Col>
            <Col span={6} style={{ height: '100%' }}>
              {this.renderStatisticsOfHiddenDanger()}
            </Col>
            <Col span={6} style={{ height: '100%' }}>
              {this.renderStatisticsOfMaintenance()}
            </Col>
          </Row>
        </div>
        <VideoPlay
          showList={false}
          videoList={videoList}
          visible={videoVisible}
          handleVideoClose={this.handleVideoClose}
        />
      </div>
    );
  }
}
