import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Icon } from 'antd';
import SectionDrawer from '@/pages/BigPlatform/Safety/Company3/components/SectionDrawer';
import styles from './DangerAreaDrawer.less';

// import dangerFactorsList from '../imgs/danger-factors-list.png';
// import safetyRiskList from '../imgs/safety-risk-list.png';
// import knowCard from '../imgs/know-card.png';
// import commitmentCard from '../imgs/commitment-card.png';
// import emergencyCard from '../imgs/emergency-card.png';
// import { MonitorList } from '../utils';
import cameraImg from '@/pages/BigPlatform/Operation/imgs/camera.png';

const dangerFactorsList = 'http://data.jingan-china.cn/v2/chem/chemScreen/danger-factors-list.png';
const safetyRiskList = 'http://data.jingan-china.cn/v2/chem/chemScreen/safety-risk-list.png';
const knowCard = 'http://data.jingan-china.cn/v2/chem/chemScreen/know-card.png';
const commitmentCard = 'http://data.jingan-china.cn/v2/chem/chemScreen/commitment-card.png';
const emergencyCard = 'http://data.jingan-china.cn/v2/chem/chemScreen/emergency-card.png';
const riskData = [
  { label: '红色', value: 1, color: '#FC1F02' },
  { label: '橙色', value: 1, color: '#F17A0A' },
  { label: '黄色', value: 1, color: '#FFE500' },
  { label: '蓝色', value: 1, color: '#0967D3' },
];
const hiddenDangerData = [
  { label: '已超期', value: 1, color: '#FC1F02' },
  // { label: '待整改', value: 1, color: '#FFE500' },
  { label: '待复查', value: 1, color: '#0967D3' },
];
const riskSourceData = [
  { label: '危险品液体原料储罐区' },
  // { label: '储罐区监测', value: 1, tip: '可燃气体浓度、有毒气体浓度' },
  // { label: '储罐监测', value: 3, tip: '液位、压力、温度' },
  // { label: '库区监测', value: 1, tip: '可燃气体浓度、有毒气体浓度' },
  // { label: '库房监测', value: 2, tip: '温度、湿度', type: 4 },
  // { label: '生产装置', value: 3, url: '', tip: '压力、温度', type: 3 },
  // {
  //   label: '气柜',
  //   value: 2,
  //   url: 'major-hazard-info/gasometer/list',
  //   tip: '柜容、压力、可燃气体浓度、有毒气体浓度',
  //   type: 5,
  // },
  // { label: '高危工艺', value: 2, url: 'major-hazard-info/high-risk-process/list', tip: '压力、温度'  },
];
const twoListData = [
  {
    label: '危险（有害）因素排查辨识清单',
    value: 1,
    url: 'two-information-management/danger-factors-list/list',
    images: [dangerFactorsList],
  },
  {
    label: '安全风险分级管控清单',
    value: 1,
    url: 'two-information-management/safety-risk-list/list',
    images: [safetyRiskList],
  },
];
const threeCardData = [
  { label: '承诺卡', value: 1, url: 'cards-info/commitment-card/list', images: [commitmentCard] },
  { label: '应知卡', value: 1, url: 'cards-info/know-card/list', images: [knowCard] },
  { label: '应急卡', value: 1, url: 'cards-info/emergency-card/list', images: [emergencyCard] },
];

export default class KeyPoints extends PureComponent {
  state = { active: 0 };

  handleJump = (url, images) => {
    const { handleShowImg } = this.props;
    if (images && images.length > 0) {
      handleShowImg(images);
    }
    if (!url || images) return;
    window.open(`${window.publicPath}#/${url}`, `_blank`);
  };

  render() {
    const {
      visible,
      onClose,
      setDrawerVisible,
      handleShowVideo,
      handlePoisonOpen,
      handleGasOpen,
    } = this.props;
    const { active } = this.state;

    return (
      <SectionDrawer
        drawerProps={{
          title: '风险分区信息',
          visible,
          onClose,
          zIndex: 1200,
        }}
      >
        <div className={styles.areaContainer}>
          <div>区域名称：生产区域</div>
          <div>区域负责人：牛斌</div>
          <div>联系电话：15857623543</div>
          <div className={styles.areaColor} style={{ backgroundColor: '#ff4848', color: '#fff' }}>
            红
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
            <span className={styles.value}>({2})</span>
            <div className={styles.extra} onClick={() => setDrawerVisible('currentHiddenDanger')}>
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
          <div className={styles.title}>
            重大危险源
            <span
              className={styles.video}
              style={{
                background: `url(${cameraImg}) center center / 100% 100% no-repeat`,
              }}
              onClick={handleShowVideo}
            />
          </div>
          <div className={styles.content}>
            {riskSourceData.map((item, index) => {
              const { label, value, url, images, tip, type } = item;
              return (
                <div
                  className={styles.tagItem}
                  key={index}
                  // onClick={() => this.handleJump(url, images)}
                  onClick={() => {
                    setDrawerVisible('dangerSourceInfo');
                  }}
                >
                  {label}
                  {/* <span className={styles.tagValue}>({value})</span> */}
                  <Icon type="right" className={styles.rightIcon} />
                  <span className={styles.tip}>{tip}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.wrapper}>
          <div
            className={styles.title}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              // setDrawerVisible('monitor', { monitorType: 6, monitorData: MonitorList[6][0] });
              handleGasOpen();
            }}
          >
            可燃气体
            <div className={styles.extra}>
              <Icon type="right" className={styles.rightIcon} />
            </div>
          </div>
        </div>

        <div className={styles.wrapper}>
          <div
            className={styles.title}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              // setDrawerVisible('monitor', { monitorType: 7, monitorData: MonitorList[7][0] });
              handlePoisonOpen();
            }}
          >
            有毒气体
            <div className={styles.extra}>
              <Icon type="right" className={styles.rightIcon} />
            </div>
          </div>
        </div>

        <div className={styles.wrapper}>
          <div className={styles.title}>两单</div>
          <div className={styles.content}>
            {twoListData.map((item, index) => {
              const { label, value, url, images } = item;
              return (
                <div
                  className={styles.tagItem}
                  key={index}
                  onClick={() => this.handleJump(url, images)}
                >
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
              const { label, value, url, images } = item;
              return (
                <div
                  className={styles.tagItem}
                  key={index}
                  onClick={() => this.handleJump(url, images)}
                >
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
