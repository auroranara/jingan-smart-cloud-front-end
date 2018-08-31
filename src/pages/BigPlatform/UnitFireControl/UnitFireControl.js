import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Header from './components/Header/Header';
import Section from './components/Section/Section';
import FireAlarmSystem from './components/FireAlarmSystem/FireAlarmSystem';
import StatisticsOfMaintenance from './components/StatisticsOfMaintenance/StatisticsOfMaintenance';
import StatisticsOfHiddenDanger from './components/StatisticsOfHiddenDanger/StatisticsOfHiddenDanger';
import StatisticsOfFireControl from './components/StatisticsOfFireControl/StatisticsOfFireControl';
import Ellipsis from '../../../components/Ellipsis';

import styles from './UnitFireControl.less';

const prefix = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/';
const fireIcon = `${prefix}fire_hj.png`;
const faultIcon = `${prefix}fire_gz.png`;
const positionBlueIcon = `${prefix}fire_position_blue.png`;
const positionRedIcon = `${prefix}fire_position_red.png`;
const dfcIcon = `${prefix}fire_dfc.png`;
const wcqIcon = `${prefix}fire_wcq.png`;
const ycqIcon = `${prefix}fire_ycq.png`;
const splitIcon = `${prefix}split.png`;
const splitHIcon = `${prefix}split_h.png`;
/* 待处理信息项 */
const PendingInfoItem = ({ data }) => {
  const { id, t, install_address, component_region, component_no, label } = data;
  const type = getPendingInfoType(data);
  const isFire = type === '火警';
  return (
    <div key={id} className={styles.pendingInfoItem} style={{ color: isFire?'#FF6464':'#00ADFF' }}>
      <div style={{ backgroundImage: `url(${isFire?fireIcon:faultIcon})` }}>{type}<div className={styles.pendingInfoItemTime}>{t}</div></div>
      <div>{component_region}回路{component_no}号</div>
      <div>{label}</div>
      <div style={{ backgroundImage: `url(${isFire?positionRedIcon:positionBlueIcon})` }}>{install_address}</div>
    </div>
  );
};

/**
 * 隐患巡查记录项
 */
const HiddenDangerRecord = ({ data }) => {
  const { id, status, flow_name, report_user_name, report_time, rectify_user_name, plan_rectify_time, review_user_name, hiddenDangerRecordDto: [{ fileWebUrl }] = [{ fileWebUrl: '' }] } = data;
  const { badge, icon, color } = getIconByStatus(status);
  return (
    <div className={styles.hiddenDangerRecord} key={id}>
      <div className={styles.hiddenDangerRecordBadge} style={{ backgroundImage: badge && `url(${badge})` }}></div>
      <div>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={fileWebUrl} alt="暂无图片" style={{ display: 'block', width: '100%' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 168, 255, 0.3)' }} />
        </div>
      </div>
      <div>
        <div style={{ backgroundImage: `url(${icon})`, color }}><Ellipsis lines={2} tooltip>{flow_name}</Ellipsis></div>
        <div><span>上报：</span><Ellipsis lines={1}><span style={{ marginRight: '16px' }}>{report_user_name}</span>{moment(+report_time).format('YYYY-MM-DD')}</Ellipsis></div>
        <div><span>整改：</span><Ellipsis lines={1}><span style={{ marginRight: '16px' }}>{rectify_user_name}</span><span style={{ color: '#FF6464' }}>{moment(+plan_rectify_time).format('YYYY-MM-DD')}</span></Ellipsis></div>
        {+status === 3 && <div><span>复查：</span><Ellipsis lines={1}><span>{review_user_name}</span></Ellipsis></div>}
      </div>
    </div>
  );
}

/**
 * 根据status获取对应的标记
 */
const getIconByStatus = (status) => {
  switch(+status) {
    case 3:
    return {
      color: '#00ADFF',
      badge: dfcIcon,
      icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_blue.png',
    };
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
}

/**
 * 获取待处理信息的类型
 */
const getPendingInfoType = ({ fire_state, fault_state, main_elec_state, prepare_elec_state, start_state, supervise_state, shield_state, feedback_state }) => {
  let type = '';
  if (+fire_state === 1) {
    type = '火警';
  }
  else if (+fault_state === 1 || +main_elec_state === 1 || +prepare_elec_state === 1) {
    type = '故障';
  }
  else if (+start_state === 1) {
    type = '联动';
  }
  else if (+supervise_state === 1) {
    type = '监管';
  }
  else if (+shield_state === 1) {
    type = '屏蔽';
  }
  else if (+feedback_state === 1) {
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
    };
    // 轮询定时器
    this.pollingTimer = null;
  }

  /**
   * 挂载后声明周期函数
   */
  componentDidMount() {
    const { dispatch, match: { params: { unitId: companyId } } } = this.props;
    // 立即执行轮询
    this.polling();

    // 获取隐患巡查记录
    dispatch({
      type: 'unitFireControl/fetchHiddenDangerRecords',
      payload: {
        companyId,
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
    const { dispatch, match: { params: { unitId: companyId } } } = this.props;
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

    // 获取待维保任务数量（注：未完成，需变更）
    dispatch({
      type: 'unitFireControl/fetchToBeMaintainedNumber',
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
  }

  /**
   * 消防数据统计tab切换事件
   */
  handleSwitchFireControlType = (fireControlType) => {
    const { dispatch, match: { params: { unitId: companyId } }  } = this.props;
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
  }

  /**
   * 隐患巡查统计tab切换事件
   */
  handleSwitchHiddenDangerType = (hiddenDangerType) => {
    const { dispatch, match: { params: { unitId: companyId } }  } = this.props;
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
  }

  /**
   * 维保情况统计tab切换事件
   */
  handleSwitchMaintenanceType = (maintenanceType) => {
    const { dispatch, match: { params: { unitId: companyId } }  } = this.props;
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
  }


  /**
   * 渲染所有统计信息块
   */
  renderAllCountSection() {
    const {
      // 待处理火警数量
      pendingFireNumber=0,
      // 待处理故障数量
      pendingFaultNumber=0,
      // 超期未整改隐患数量
      outOfDateNumber=0,
      // 待整改隐患数量
      toBeRectifiedNumber=0,
      // 待维保任务数量（注：未完成，需变更）
      toBeMaintainedNumber=0,
      // 待巡查任务数量
      toBeInspectedNumber=0,
    } = this.props.unitFireControl;

    return (
      <Section>
        <div className={styles.countContainer}>
          <Row className={styles.countContainerRow}>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue} style={{ color: '#FF6464' }}>{pendingFireNumber}</div>
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
              <div className={styles.countValue}>{toBeMaintainedNumber}</div>
              <div className={styles.countName}>待维保任务</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{toBeInspectedNumber}</div>
              <div className={styles.countName}>待巡查任务</div>
            </Col>
          </Row>
          <div className={styles.firstVerticalLine}><img src={splitIcon} alt=""/></div>
          <div className={styles.secondVerticalLine}><img src={splitIcon} alt=""/></div>
          <div className={styles.horizontalLine}><img src={splitHIcon} alt=""/></div>
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
        fire_state=0,
        fault_state=0,
        start_state=0,
        supervise_state=0,
        shield_state=0,
        feedback_state=0,
      },
    } = this.props.unitFireControl;
    return (
      <FireAlarmSystem
        fire={fire_state}
        fault={fault_state}
        shield={shield_state}
        linkage={start_state}
        supervise={supervise_state}
        feedback={feedback_state}
      />
    );
  }

  /**
   * 渲染消防数据统计块（未完成）
   */
  renderStatisticsOfFireControl() {
    const {
      fireControlCount: {
        warnTrue=0,
        warnFalse=0,
        fire_state=0,
        fault_state=0,
        start_state=0,
        shield_state=0,
        feedback_state=0,
        supervise_state=0,
      },
    } = this.props.unitFireControl;
    const { fireControlType } = this.state;

    return (
      <StatisticsOfFireControl
        type={fireControlType}
        real={warnTrue}
        misinformation={warnFalse}
        pending={fire_state}
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
        dangerType: [{
          // 随手拍
          random_photo=0,
          // 风险点
          from_self_check_point=0,
        } = {} ] = [],
        dangerDto: {
          // 已超期
          over_rectify_num=0,
          // 待复查
          rectify_num=0,
          // 待整改
          total_num=0,
          // 已关闭
          count_closed_danger=0,
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
        selfAllNum=0,
        selfNoNum=0,
        selfDoingNum=0,
        selfFinishNum=0,
        assignAllNum=0,
        assignNoNum=0,
        assignDoingNum=0,
        assignFinishNum=0,
        avgSelfTime= '',
        selfRate= "100%",
        avgAssignTime= '',
        assignRate= "100%",
      },
    } = this.props.unitFireControl;
    const { maintenanceType } = this.state;

    return (
      <StatisticsOfMaintenance
        type={maintenanceType}
        onSwitch={this.handleSwitchMaintenanceType}
        maintenance={{
          name: "维保单位",
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
      // 待处理信息
      pendingInfo,
      // 消防巡查统计
      hiddenDangerCount: {
        // 企业名称
        companyName,
      },
      // 隐患巡查记录
      hiddenDangerRecords,
    } = this.props.unitFireControl;

    return (
      <div className={styles.main}>
        <Header title="晶安智慧消防云平台" extraContent={companyName} />
        <div className={styles.mainBody}>
          <Row gutter={16} style={{ marginBottom: 16, height: 'calc(48.92% - 16px)' }}>
            <Col span={6} style={{ height: '100%' }}>
              <Section isScroll isCarousel>
                {pendingInfo.map((item) => (
                  <PendingInfoItem key={item} data={item} />
                ))}
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
                {hiddenDangerRecords.map((item) => (
                  <HiddenDangerRecord
                    key={item}
                    data={item}
                  />
                ))}
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
      </div>
    );
  }
}
