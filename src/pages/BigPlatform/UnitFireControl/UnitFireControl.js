import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
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
const PendingInfoItem = ({ id, isFire, time, position, pointName, monitor }) => {
  return (
    <div key={id} className={styles.pendingInfoItem} style={{ color: isFire?'#FF6464':'#00ADFF' }}>
      <div style={{ backgroundImage: `url(${isFire?fireIcon:faultIcon})` }}>{isFire?'火警':'故障'}<div className={styles.pendingInfoItemTime}>{time}</div></div>
      <div>{pointName}</div>
      <div>{monitor}</div>
      <div style={{ backgroundImage: `url(${isFire?positionRedIcon:positionBlueIcon})` }}>{position}</div>
    </div>
  );
};

/**
 * 隐患巡查记录项
 */
const HiddenDangerRecord = ({ id, status, image, description, sbr, sbsj, zgr, zgsj, fcr }) => {
  const { badge, icon, color } = getIconByStatus(status);
  return (
    <div className={styles.hiddenDangerRecord} key={id}>
      <div className={styles.hiddenDangerRecordBadge} style={{ backgroundImage: `url(${badge})` }}></div>
      <div>
        <div style={{ position: 'relative', width: '100%' }}>
          <img src={image} alt="暂无图片" style={{ display: 'block', width: '100%' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 168, 255, 0.3)' }} />
        </div>
      </div>
      <div>
        <div style={{ backgroundImage: `url(${icon})`, color }}><Ellipsis lines={2} tooltip>{description}</Ellipsis></div>
        <div><span>上报：</span><Ellipsis lines={1}><span style={{ marginRight: '16px' }}>{sbr}</span>{sbsj}</Ellipsis></div>
        <div><span>整改：</span><Ellipsis lines={1}><span style={{ marginRight: '16px' }}>{zgr}</span><span style={{ color: '#FF6464' }}>{zgsj}</span></Ellipsis></div>
        <div><span>复查：</span><Ellipsis lines={1}><span>{fcr}</span></Ellipsis></div>
      </div>
    </div>
  );
}

/**
 * 根据status获取对应的标记
 */
const getIconByStatus = (status) => {
  switch(status) {
    case 1:
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
    default:
    return {
      color: '#FF6464',
      badge: ycqIcon,
      icon: 'http://data.jingan-china.cn/v2/big-platform/safety/com/description_red.png',
    };
  };
}

/**
 * 单位消防大屏
 */
export default class App extends PureComponent {

  /**
   * 挂载后声明周期函数
   */
  componentDidMount() {
    const { match: { params: { unitId } } } = this.props;
  }



  /**
   * 渲染所有统计信息块
   */
  renderAllCountSection() {
    const one = 0;
    const two = 0;
    const three = 0;
    const four = 0;
    const five = 0;
    const six = 0;

    return (
      <Section>
        <div className={styles.countContainer}>
          <Row className={styles.countContainerRow}>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue} style={{ color: '#FF6464' }}>{one}</div>
              <div className={styles.countName}>待处理火警</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{two}</div>
              <div className={styles.countName}>待处理故障</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{three}</div>
              <div className={styles.countName}>超期未整改隐患</div>
            </Col>
          </Row>
          <Row className={styles.countContainerRow}>
          <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{four}</div>
              <div className={styles.countName}>待整改隐患</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{five}</div>
              <div className={styles.countName}>待维保任务</div>
            </Col>
            <Col span={8} className={styles.countContainerColumn}>
              <div className={styles.countValue}>{six}</div>
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
    // const {  } = this.props;
    // 火警
    const fire = 1;
    // 故障
    const fault = 2;
    // 屏蔽
    const shield = 3;
    // 联动
    const linkage = 4;
    // 监管
    const supervise = 5;
    // 反馈
    const feedback = 6;
    return (
      <FireAlarmSystem
        fire={fire}
        fault={fault}
        shield={shield}
        linkage={linkage}
        supervise={supervise}
        feedback={feedback}
      />
    );
  }

  /**
   * 渲染消防数据统计块
   */
  renderStatisticsOfFireControl() {
    const real = 0;
    const misinformation = 1;
    const pending = 0;
    const fault = 2;
    const shield = 3;
    const linkage = 4;
    const supervise = 5;
    const feedback = 6;

    return (
      <StatisticsOfFireControl
        real={real}
        misinformation={misinformation}
        pending={pending}
        fault={fault}
        shield={shield}
        linkage={linkage}
        supervise={supervise}
        feedback={feedback}
        onSwitch={(item, index)=> {console.log(item, index);}}
      />
    );
  }

  /**
   * 隐患巡查统计模块
   */
  renderStatisticsOfHiddenDanger() {
    const ssp = 1;
    const fxd = 2;
    const cqwzg = 3;
    const dfc = 4;
    const dzg = 5;
    const ygb = 6;

    return (
      <StatisticsOfHiddenDanger
        ssp={ssp}
        fxd={fxd}
        cqwzg={cqwzg}
        dfc={dfc}
        dzg={dzg}
        ygb={ygb}
        onSwitch={(item) => {console.log(item);}}
      />
    );
  }

  /**
   * 维保情况统计
   */
  renderStatisticsOfMaintenance() {
    // const {
    //   maintenance: {
    //     name: maintenanceName="维保单位",
    //     total: maintenanceTotal=0,
    //     repaired: maintenanceRepaired=0,
    //     unrepaired: maintenanceUnrepaired=0,
    //     repairing: maintenanceRepairing=0,
    //     duration: maintenanceDuration=0,
    //     rate: maintenanceRate=0,
    //   } = {},
    //   local: {
    //     total: localTotal=0,
    //     repaired: localRepaired=0,
    //     unrepaired: localUnrepaired=0,
    //     repairing: localRepairing=0,
    //     duration: localDuration=0,
    //     rate: localRate=0,
    //   } = {},
    // } = this.props;

    return (
      <StatisticsOfMaintenance
        onSwitch={(item, index) => { console.log(item, index); }}
      />
    );
  }

  /**
   * 渲染函数
   */
  render() {
    // 从props中获取单位名称
    // const {  } = this.props;

    // 临时的单位名称，对接接口以后替换为真实数据
    const tempUnitName = "无锡晶安智慧科技有限公司";

    return (
      <div className={styles.main}>
        <Header title="晶安智慧消防云平台" extraContent={tempUnitName} />
        <div className={styles.mainBody}>
          <Row gutter={16} style={{ marginBottom: 16, height: 'calc(48.92% - 16px)' }}>
            <Col span={6} style={{ height: '100%' }}>
              <Section isScroll isCarousel>
                {[...Array(10).keys()].map((item) => (
                  <PendingInfoItem key={item} id={item} isFire time={'2018-08-24'} position={'风险点位置'} pointName={'风险点名称'} monitor={'监控信息'} />
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
                {[...Array(10).keys()].map((item) => (
                  <HiddenDangerRecord
                    key={item}
                    id={item}
                    status={1}
                    image=""
                    description="提示信息"
                    sbr="陆华"
                    sbsj="2018-07-03"
                    zgr="陆华"
                    zgsj="2018-07-03"
                    fcr="陆华"
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
