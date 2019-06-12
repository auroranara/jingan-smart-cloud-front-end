import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import Ellipsis from 'components/Ellipsis';
import Section from '../Section';
import styles from './SmokeMonitor.less';
import smokeAlarm from '../../Smoke/imgs/smoke-alarm.png';
import smokeFault from '../../Smoke/imgs/smoke-fault.png';
import smokeNormal from '../../Smoke/imgs/smoke-normal.png';
import smokeLost from '../../Smoke/imgs/smoke-lost.png';

/**
 * description: 独立烟感监测
 */
const emptyIcon = 'http://data.jingan-china.cn/v2/big-platform/monitor/com/waterBg1.png';
function TopNav(props) {
  const { list } = props;
  return (
    <div className={styles.topNav}>
      <div className={styles.bottomDiveder} />
      {list.map((item, index) => {
        const { name, value, color, onClick } = item;
        return (
          <div className={styles.topItem} key={index} onClick={onClick}>
            <Ellipsis lines={1} tooltip>
              {name}
              <span className={styles.number} style={{ color }}>
                {value || 0}
              </span>
            </Ellipsis>
          </div>
        );
      })}
    </div>
  );
}

export default class SmokeMonitor extends PureComponent {
  renderItems = () => {
    const {
      companySmokeInfo: {
        map: { unnormal = [], fault = [], normal = [] } = { unnormal: [], fault: [], normal: [] },
      },
    } = this.props;

    const list = [...unnormal, ...fault, ...normal];
    return list.length > 0 ? (
      <Row>
        {list.map((item, index) => {
          const { area, location, status, iotId } = item;
          let smokeImg, color, statusStr;
          if (+status > 0) {
            smokeImg = smokeAlarm;
            color = '#f83329';
            statusStr = '报警';
          } else if (+status === 0 || !status) {
            smokeImg = smokeNormal;
            color = '#00ffff';
            statusStr = '正常';
          } else if (+status === -1) {
            smokeImg = smokeLost;
            color = '#9f9f9f';
            statusStr = '失联';
          } else {
            smokeImg = smokeFault;
            color = '#ffb400';
            statusStr = '故障';
          }
          return (
            <Col span={12} key={index}>
              <div className={styles.deviceWrapper}>
                <div className={styles.deviceImg}>
                  <img src={smokeImg} alt="smokeImg" />
                </div>
                <div className={styles.infoWrapper}>
                  <div className={styles.info}>
                    <Ellipsis lines={1} tooltip>
                      {area ? (location ? `${area}: ${location}` : area) : location || '暂无信息'}
                    </Ellipsis>
                  </div>
                  <div className={styles.info} style={{ color }}>
                    {statusStr}
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `url(${emptyIcon}) center center / 40% auto no-repeat`,
        }}
      />
    );
  };

  render() {
    const {
      companySmokeInfo: {
        map: { unnormal = [], fault = [], normal = [] } = { unnormal: [], fault: [], normal: [] },
      },
      onClick,
    } = this.props;
    const lost = fault.filter(item => +item.status === -1).length;
    const topData = [
      { name: '报警', value: unnormal.length, color: '#f83329' },
      { name: '故障', value: fault.length - lost, color: '#ffb400' },
      { name: '失联', value: lost, color: '#9f9f9f' },
      { name: '正常', value: normal.length, color: '#00ffff' },
    ].map((item, index) => {
      return {
        ...item,
        onClick: () => {
          onClick(index);
        },
      };
    });

    return (
      <Section title="独立烟感监测">
        <div className={styles.container}>
          <TopNav list={topData} />
          <div className={styles.scrollContainer}>{this.renderItems()}</div>
        </div>
      </Section>
    );
  }
}
