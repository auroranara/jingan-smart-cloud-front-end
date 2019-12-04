import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Icon } from 'antd';
import SectionDrawer from '@/pages/BigPlatform/Safety/Company3/components/SectionDrawer';
import styles from './DangerAreaDrawer.less';

const riskData = [
  { label: '红色', value: 14, color: '#FC1F02' },
  { label: '橙色', value: 4, color: '#F17A0A' },
  { label: '黄色', value: 5, color: '#FFE500' },
  { label: '蓝色', value: 16, color: '#0967D3' },
];
const hiddenDangerData = [
  { label: '已超期', value: 1, color: '#FC1F02' },
  { label: '待整改', value: 2, color: '#FFE500' },
  { label: '待复查', value: 1, color: '#0967D3' },
];
const riskSourceData = [
  // { label: '储罐区监测', value: 1 },
  // { label: '储罐监测', value: 3 },
  // { label: '库区监测', value: 1 },
  // { label: '库房监测', value: 2 },
  { label: '生产装置', value: 2, url: '' },
  { label: '气柜', value: 3, url: 'major-hazard-info/gasometer/list' },
  { label: '高危工艺', value: 2, url: 'major-hazard-info/high-risk-process/list' },
];
const twoListData = [
  { label: '风险辨识清单', value: 2, url: 'two-information-management/danger-factors-list/list' },
  { label: '分级管控清单', value: 2, url: 'two-information-management/safety-risk-list/list' },
];
const threeCardData = [
  { label: '承诺卡', value: 1, url: 'cards-info/commitment-card/list' },
  { label: '应知卡', value: 3, url: 'cards-info/know-card/list' },
  { label: '应急卡', value: 1, url: 'cards-info/emergency-card/list' },
];
export default class KeyPoints extends PureComponent {
  state = { active: 0 };

  handleJump = url => {
    if (!url) return;
    window.open(`${window.publicPath}#/${url}`, `_blank`);
  };

  render() {
    const { visible, onClose, setDrawerVisible } = this.props;
    const { active } = this.state;

    return (
      <SectionDrawer
        drawerProps={{
          title: '风险分区信息',
          visible,
          onClose,
        }}
      >
        <div className={styles.areaContainer}>
          <div>区域名称：生产区域</div>
          <div>区域负责人：张三</div>
          <div>联系电话：139123456789</div>
          <div className={styles.areaColor} style={{ backgroundColor: '#0967D3' }}>
            蓝
          </div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.title}>
            风险点
            <span className={styles.value}>({4})</span>
            <div
              className={styles.extra}
              onClick={() => setDrawerVisible('riskPoint', { riskPointType: { key: 'status' } })}
            >
              详情
              <span style={{ color: '#0ff' }}>>></span>
            </div>
          </div>
          <div className={styles.content}>
            {riskData.map((item, index) => {
              const { label, value, color } = item;
              return (
                <div className={styles.dotItem} key={index}>
                  <span className={styles.dot} style={{ backgroundColor: color }} />
                  {label}
                  <span className={styles.dotValue}>{value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.title}>
            隐患
            <span className={styles.value}>({4})</span>
            <div className={styles.extra}>
              详情
              <span style={{ color: '#0ff' }}>>></span>
            </div>
          </div>
          <div className={styles.content}>
            {hiddenDangerData.map((item, index) => {
              const { label, value, color } = item;
              return (
                <div className={styles.dotItem} key={index}>
                  <span className={styles.dot} style={{ backgroundColor: color }} />
                  {label}
                  <span className={styles.dotValue}>{value}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.title}>重大危险源</div>
          <div className={styles.content}>
            {riskSourceData.map((item, index) => {
              const { label, value, url } = item;
              return (
                <div className={styles.tagItem} key={index} onClick={() => this.handleJump(url)}>
                  {label}
                  <span className={styles.tagValue}>({value})</span>
                  <Icon type="right" className={styles.rightIcon} />
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.title} style={{ cursor: 'pointer' }}>
            可燃有毒气体监测
            <div className={styles.extra}>
              <Icon type="right" className={styles.rightIcon} />
            </div>
          </div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.title}>两单</div>
          <div className={styles.content}>
            {twoListData.map((item, index) => {
              const { label, value, url } = item;
              return (
                <div className={styles.tagItem} key={index} onClick={() => this.handleJump(url)}>
                  {label}
                  <span className={styles.tagValue}>({value})</span>
                  <Icon type="right" className={styles.rightIcon} />
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.title}>三卡</div>
          <div className={styles.content}>
            {threeCardData.map((item, index) => {
              const { label, value, url } = item;
              return (
                <div className={styles.tagItem} key={index} onClick={() => this.handleJump(url)}>
                  {label}
                  <span className={styles.tagValue}>({value})</span>
                  <Icon type="right" className={styles.rightIcon} />
                </div>
              );
            })}
          </div>
        </div>
      </SectionDrawer>
    );
  }
}
