import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { NoData } from '../components/Components';
import Section from '@/pages/BigPlatform/Safety/Company3/components/Section';
import { TabTitle } from '../components/Components';
import { MonitorEquipmentIcons } from '../utils';

import styles from './KeyPoints.less';
// import iconGas from '../imgs/icon-gas.png';
import iconHigh from '../imgs/icon-high.png';
// import iconPoison from '../imgs/icon-poison.png';
// import iconProduce from '../imgs/icon-produce.png';
// import iconStorage from '../imgs/icon-storage.png';
// import iconStorageArea from '../imgs/icon-storageArea.png';
// import iconStoreArea from '../imgs/icon-storeArea.png';
// import iconStorehouse from '../imgs/icon-storehouse.png';

import iconChemical from '../imgs/icon-chemical.png';
import iconDangerSource from '../imgs/icon-dangerSource.png';

const LABELS = ['监测对象', 'IoT监测', '两重点一重大'];
// const LABELS = ['监测对象', '两重点一重大'];
const TITLE_STYLE = { marginLeft: 10, marginTop: 10 };

// iot/major-hazard/index
const keyPointsData1 = [
  { icon: iconDangerSource, label: '重大危险源', value: 2 },
  { icon: iconChemical, label: '危险化学品', value: 2 },
  { icon: iconHigh, label: '高危工艺', value: 2 },
];
const keyPointsList = [
  { icon: iconHigh, label: '重点监管危险化工工艺', value: 0, key: 'iskeySupervisionProcess' },
  { icon: iconChemical, label: '重点监管危险化学品', value: 0, key: 'superviseChemicals' },
  { icon: iconDangerSource, label: '重大危险源', value: 0, key: 'dangerSource' },
];

export default class KeyPoints extends PureComponent {
  state = { active: 0 };

  handleClickTab = i => {
    this.setState({ active: i });
  };

  handleClickMonitor = type => {
    const { handleClickMonitor } = this.props;
    handleClickMonitor(type);
  };

  handleClickKey = (index, value) => {
    if (+value === 0) return null;
    const {
      handleShowProcessList,
      handleClickDangerSource,
      handleShowChemicalList,
      companyId,
    } = this.props;
    index === 2 && handleClickDangerSource();
    index === 1 && handleShowChemicalList();
    index === 0 && window.open(`${window.publicPath}#/big-platform/process/${companyId}`);
  };

  render() {
    const { monitorList, dangerSourceCount, monitorEquipList, handleShowMonitorList } = this.props;
    const { active } = this.state;
    const monitorData = monitorList.filter(item => item.monitorCount).map(item => {
      const { count, monitorCount, typeName, warningCount, webUrl } = item;
      return {
        ...item,
        icon: webUrl || iconDangerSource,
        label: typeName,
        value: warningCount,
        total: monitorCount,
      };
    });

    const monitorEquipData = monitorEquipList.filter(item => item.monitorCount).map(item => {
      const { count, monitorCount, typeName, warningCount, webUrl } = item;
      return {
        ...item,
        icon: webUrl || iconDangerSource,
        label: typeName,
        value: warningCount,
        total: count,
      };
    });

    const keyPointsData = keyPointsList.map(item => ({
      ...item,
      value: dangerSourceCount[item.key] || 0,
    }));
    // .filter(item => item.value);

    const dataList = [monitorData, monitorEquipData, keyPointsData][active];

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
            {dataList.length > 0 ? (
              <Row>
                {dataList.map((item, index) => {
                  const { icon, label, value, total, type } = item;
                  return active === 2 ? (
                    <Col span={12} key={index}>
                      <div
                        className={styles.item}
                        style={{
                          background: `url(${icon}) 2.5em center / 3em 3em no-repeat`,
                          // cursor: type || type === 0 ? 'pointer' : 'default',
                          cursor: 'pointer',
                        }}
                        onClick={() => this.handleClickKey(index, value)}
                      >
                        <div className={styles.countLabel}>
                          <div>{label}</div>
                        </div>
                        <div className={styles.countValue}>
                          <div>
                            <span
                              className={styles.value}
                              style={{ color: total ? '#ff4848' : '#fff' }}
                            >
                              {value}
                            </span>
                            {total ? `/${total}` : ''}
                          </div>
                        </div>
                      </div>
                    </Col>
                  ) : (
                    <Col span={24} key={index}>
                      <Row
                        className={styles.wrapper}
                        onClick={() => {
                          active === 0 && this.handleClickMonitor(type);
                          active === 1 && handleShowMonitorList(item);
                        }}
                      >
                        <Col span={3} offset={1}>
                          <span
                            className={styles.icon}
                            style={{
                              background: `url(${
                                active === 0 ? icon : MonitorEquipmentIcons[type]
                              }) center center / 3em 3em no-repeat`,
                            }}
                          />
                        </Col>
                        <Col span={9}>{label}</Col>
                        <Col span={5}>
                          <span className={styles.alarmWrapper}>
                            <span className={styles.alarm} />
                            {value}
                          </span>
                        </Col>
                        <Col span={6}>
                          <span className={styles.totalWrapper}>
                            <span className={styles.total} />
                            {total}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <NoData />
            )}
          </div>
        </div>
      </Section>
    );
  }
}
