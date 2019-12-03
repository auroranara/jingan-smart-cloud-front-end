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

const LABELS = ['实时监测', '两重点一重大'];
const TITLE_STYLE = { marginLeft: 10, marginTop: 10 };

// iot/major-hazard/index
const monitorData = [
  { icon: iconPoison, label: '可燃有毒气体', value: 2, total: 20 },
  {
    icon: iconStorage,
    label: '储罐监测',
    value: 2,
    total: 20,
    // url: 'major-hazard-info/storage-management/list',
  },
  { icon: iconHigh, label: '高危工艺监测', value: 2, total: 20 },
  { icon: iconProduce, label: '生产装置监测', value: 2, total: 20 },
  {
    icon: iconStoreArea,
    label: '库区监测',
    value: 2,
    total: 20,
    // url: 'major-hazard-info/reservoir-region-management/list',
  },
  {
    icon: iconStorehouse,
    label: '库房监测',
    value: 2,
    total: 20,
    // url: 'major-hazard-info/storehouse/list',
  },
  {
    icon: iconStorageArea,
    label: '罐区监测',
    value: 2,
    total: 20,
    // url: 'major-hazard-info/storage-area-management/list',
  },
  { icon: iconGas, label: '气柜监测', value: 2, total: 20 },
];
const keyPointsData = [
  { icon: iconDangerSource, label: '重大危险源', value: 2 },
  { icon: iconChemical, label: '危险化学品', value: 2 },
  { icon: iconHigh, label: '高危工艺', value: 2 },
];

export default class KeyPoints extends PureComponent {
  state = { active: 0 };

  handleClickTab = i => {
    this.setState({ active: i });
  };

  handleClick = url => {
    if (!url) return;
    window.open(`${window.publicPath}#/${url}`, `_blank`);
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
              {[monitorData, keyPointsData][active].map((item, index) => {
                const { icon, label, value, total, url } = item;
                return (
                  <Col span={12} key={index}>
                    <div
                      className={styles.item}
                      style={{
                        background: `url(${icon}) 3em center / 3em 3em no-repeat`,
                        cursor: url ? 'pointer' : 'default',
                      }}
                      onClick={() => {
                        this.handleClick(url);
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
