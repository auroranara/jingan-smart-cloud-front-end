import React, { Component, Fragment } from 'react';
import { List, Card, Tooltip } from 'antd';
import router from 'umi/router';
import moment from 'moment';
import classNames from 'classnames';
import {
  TANK_AREA_REAL_TIME_URL,
} from '../../URLS';
import iconTankArea from '../../imgs/icon-tank-area.png';
import iconTank from '../../imgs/icon-tank.png';
import iconStorageHouse from '../../imgs/icon-storage-house.png';
import iconStorageArea from '../../imgs/icon-storage-area.png';
import iconProcessUnit from '../../imgs/icon-process-unit.png';
import iconGasometer from '../../imgs/icon-gasometer.png';
import iconHighRiskProcess from '../../imgs/icon-high-risk-process.png';
import iconAlarm from '../../imgs/icon-alarm.png';
import iconNormal from '../../imgs/icon-normal.png';
import styles from './index.less';

const DELAY = 1 * 60 * 1000;
const LIST = [
  { title: '罐区', title2: '储罐区', unit: '个', icon: iconTankArea, realTimeUrl: TANK_AREA_REAL_TIME_URL },
  { title: '储罐', unit: '个', icon: iconTank },
  { title: '库区', unit: '个', icon: iconStorageArea },
  { title: '库房', unit: '个', icon: iconStorageHouse },
  { title: '生产装置', unit: '套', icon: iconProcessUnit },
  { title: '气柜', unit: '套', icon: iconGasometer },
  { title: '高危工艺', unit: '套', icon: iconHighRiskProcess },
];
const GRID = {
  gutter: 24,
  xl: 3,
  md: 2,
  sm: 1,
  xs: 1,
};

/**
 * 重大危险源监测-实时监测
 */
export default class RealTime extends Component {
  state = {
    hoverIndex: undefined,
  };

  myTimer = null

  componentDidMount() {
    const { getData } = this.props;
    getData && getData();
  }

  componentWillUnmount() {
    clearTimeout(this.myTimer);
  }

  setTimer = () => {
    this.myTimer = setTimeout(() => {
      const { getData } = this.props;
      getData && getData();
      this.setTimer();
    }, DELAY);
  }

  handleMouseEnter = (hoverIndex) => {
    this.setState({
      hoverIndex,
    });
  }

  handleMouseLeave = () => {
    this.setState({
      hoverIndex: undefined,
    });
  }

  render() {
    // const {
    //   data=[],
    // } = this.props;
    const { hoverIndex } = this.state;

    const data = [
      { params: '可燃气体浓度、有毒气体浓度', total: 5, alarm: 1, point: 90, alarmPoint: 2, status: 1, paramName: '可燃气体', value: 30, unit: '%LEL', normalUpper: 20, name: '罐区一', pointName: '点位A', area: '东厂区五楼', location: '演示厅', createTime: 1574062123000 },
      { params: '可燃气体浓度、有毒气体浓度', total: 5, alarm: 1, point: 90, alarmPoint: 2, status: 2, paramName: '有毒气体', value: 20, unit: '%LEL', largeUpper: 15, name: '储罐二', pointName: '点位B', area: '东厂区四楼', location: '实验室', createTime: 1574062103000 },
      { params: '温度、湿度', total: 5, alarm: 1, point: 90, alarmPoint: 2, status: 0 },
      { params: '液位、压力、温度', total: 5, alarm: 1, point: 90, alarmPoint: 2, status: 0 },
      { params: '压力、温度', total: 5, alarm: 1, point: 90, alarmPoint: 2, status: 0 },
      { params: '柜容、压力', total: 5, alarm: 1, point: 90, alarmPoint: 2, status: 0 },
      { params: '关键联锁参数、各类重点监测参数、气体报警参数、联锁投切信号等', total: 5, alarm: 1, status: 0 },
    ];

    return (
      <List
        className={styles.container}
        grid={GRID}
        dataSource={data}
        renderItem={(item, index) => {
          const { title, title2, icon, unit, realTimeUrl } = LIST[index];
          const { params, alarm, total, alarmPoint, point, status=1, createTime, paramName, value, largeUpper, normalUpper, name, pointName, area, location, unit: unit2 } = item || {};
          const isNotNormal = status > 0;
          const isAlarm = status > 1;
          const isHighRiskProcess = index === 6;
          const FooterLabel = hoverIndex === index ? 'marquee' : 'div';
          return item && (
            <List.Item>
              <Card
                title={(
                  <div className={styles.titleContainer}>
                    <img className={styles.titleIcon} src={icon} alt="" />
                    <div className={styles.titleWrapper}>
                      <div className={styles.title}>{title}</div>
                      <div className={styles.subTitle}>
                        <div className={styles.subTitleLabel}>监测：</div>
                        <Tooltip placement="topLeft" title={params}>
                          <div className={styles.subTitleValue}>
                            {params}
                          </div>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                )}
                actions={[
                  <div
                    className={styles.footer}
                    // onClick={(e) => {e.stopPropagation();}}
                  >
                    <div className={styles.footerIcon} style={{ backgroundImage: `url(${isNotNormal ? iconAlarm : iconNormal})` }} />
                    {isNotNormal ? (
                      <FooterLabel className={styles.footerLabel}>
                        {moment(createTime).format('HH:mm:ss')}&nbsp;&nbsp;{paramName}发生{isAlarm ? '报警' : '预警'}，当前浓度为{value}{unit2}，超过{isAlarm ? '报警' : '预警'}值{value - (isAlarm ? largeUpper : normalUpper)}{unit2}。{title2 || title}：{name}，监测点：{pointName || '暂无数据'}，区域位置：{[area, location].filter(v => v).join('-') || '暂无数据'}
                      </FooterLabel>
                    ) : (
                      <div className={classNames(styles.footerLabel, styles.normalFooterLabel)}>监测无异常！</div>
                    )}
                  </div>,
                ]}
                size="small"
                hoverable
                onClick={() => router.push(realTimeUrl)}
                onMouseEnter={() => this.handleMouseEnter(index)}
                onMouseLeave={this.handleMouseLeave}
              >
                <div className={styles.content}>
                  <div className={styles.item}>
                    <div className={styles.itemValue}>
                      <span className={styles.alarm}>{alarm}</span>
                      {!isHighRiskProcess && (
                        <Fragment>
                          <span className={styles.slash}>/</span>
                          <span className={styles.total}>{total}</span>
                        </Fragment>
                      )}
                      {unit}
                    </div>
                    <div className={styles.itemLabel}>{!isHighRiskProcess ? `${title.slice(-2)}：报警/全部` : '报警工艺'}</div>
                  </div>
                  <div className={styles.item}>
                    <div className={styles.itemValue}>
                      {!isHighRiskProcess ? (
                        <Fragment>
                          <span className={styles.alarm}>{alarmPoint}</span>
                          <span className={styles.slash}>/</span>
                          <span className={styles.total}>{point}</span>
                        </Fragment>
                      ) : (
                        <span className={styles.alarm} style={{ color: 'rgba(0, 0, 0, 0.85)' }}>{total}</span>
                      )}
                      {unit}
                    </div>
                    <div className={styles.itemLabel}>{!isHighRiskProcess ? '点位：报警/全部' : '高危工艺'}</div>
                  </div>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
    );
  }
}
