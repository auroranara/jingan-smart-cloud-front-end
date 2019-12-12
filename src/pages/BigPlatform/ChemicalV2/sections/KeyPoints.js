import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
// import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
import Section from '@/pages/BigPlatform/Safety/Company3/components/Section';
import { TabTitle } from '../components/Components';

import styles from './KeyPoints.less';
import iconGas from '../imgs/icon-gas.png';
import iconHigh from '../imgs/icon-high.png';
import iconPoison from '../imgs/icon-poison.png';
import iconProduce from '../imgs/icon-produce.png';
import iconStorage from '../imgs/icon-storage.png';
import iconStorageArea from '../imgs/icon-storageArea.png';
import iconStoreArea from '../imgs/icon-storeArea.png';
import iconStorehouse from '../imgs/icon-storehouse.png';

import iconChemical from '../imgs/icon-chemical.png';
import iconDangerSource from '../imgs/icon-dangerSource.png';

// const LABELS = ['监测对象', 'IOT监测', '两重点一重大'];
const LABELS = ['监测对象', '两重点一重大'];
const TITLE_STYLE = { marginLeft: 10, marginTop: 10 };

// iot/major-hazard/index
const monitorData = [
  {
    icon: iconStorageArea,
    label: '罐区监测',
    value: 1,
    total: 1,
    url: 'iot/major-hazard/tank-area/real-time',
    type: 0,
  },
  {
    icon: iconStoreArea,
    label: '库区监测',
    value: 1,
    total: 1,
    url: 'iot/major-hazard/storage-area/real-time',
    type: 1,
  },
  {
    icon: iconStorage,
    label: '储罐监测',
    value: 2,
    total: 3,
    url: 'iot/major-hazard/tank/real-time',
    type: 2,
  },
  { icon: iconProduce, label: '生产装置监测', value: 1, total: 3, type: 3 },
  {
    icon: iconStorehouse,
    label: '库房监测',
    value: 1,
    total: 2,
    url: 'iot/major-hazard/storage-house/real-time',
    type: 4,
  },
  { icon: iconGas, label: '气柜监测', value: 1, total: 2, type: 5 },
  {
    icon: iconPoison,
    label: '可燃气体',
    value: 1,
    total: 2,
    url: 'gas-iot/monitor-report',
    type: 6,
  },
  {
    icon: iconHigh,
    label: '有毒气体',
    value: 1,
    total: 2,
    url: 'gas-iot/monitor-report',
    type: 6,
  },
  // { icon: iconHigh, label: '高危工艺监测', value: 1, total: 4 },
];
const keyPointsData1 = [
  { icon: iconDangerSource, label: '重大危险源', value: 2 },
  { icon: iconChemical, label: '危险化学品', value: 2 },
  { icon: iconHigh, label: '高危工艺', value: 2 },
];
const keyPointsData = [
  { icon: iconDangerSource, label: '重大危险源', value: 2 },
  { icon: iconChemical, label: '重点监管危险化学品', value: 2 },
  { icon: iconHigh, label: '重点监管危险化工工艺', value: 2 },
];

export default class KeyPoints extends PureComponent {
  state = { active: 0 };

  handleClickTab = i => {
    this.setState({ active: i });
  };

  handleClickMonitor = type => {
    const { setDrawerVisible } = this.props;
    if (type || type === 0) {
      setDrawerVisible('monitor', { monitorType: type });
    }
    // window.open(`${window.publicPath}#/${url}`, `_blank`);
  };

  handleClickKey = index => {
    const { setDrawerVisible } = this.props;
    const drawers = ['dangerSource', 'chemical', 'technology'];
    setDrawerVisible(drawers[index]);
  };

  render() {
    const { active } = this.state;

    return (
      <Section>
        <div className={styles.container}>
          <TabTitle
            index={active}
            labels={LABELS}
            handleClickTab={this.handleClickTab}
            style={TITLE_STYLE}
          />
          <div className={styles.scroll}>
            <Row>
              {[monitorData, keyPointsData1, keyPointsData][active].map((item, index) => {
                const { icon, label, value, total, type } = item;
                return (
                  <Col span={12} key={index}>
                    <div
                      className={styles.item}
                      style={{
                        background: `url(${icon}) 3em center / 3em 3em no-repeat`,
                        // cursor: type || type === 0 ? 'pointer' : 'default',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        active === 0 && this.handleClickMonitor(type);
                        active === 1 && this.handleClickKey(index);
                      }}
                    >
                      <div className={styles.countLabel}>
                        <div>{label}</div>
                      </div>
                      <div className={styles.countValue}>
                        <div>
                          <span className={styles.value}>{value}</span>
                          {total && `/${total}`}
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      </Section>
    );
  }
}
