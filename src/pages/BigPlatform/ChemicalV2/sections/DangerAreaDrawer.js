import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Icon } from 'antd';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './DangerAreaDrawer.less';

// import { MonitorList } from '../utils';
import cameraImg from '@/pages/BigPlatform/Operation/imgs/camera.png';

const dangerFactorsList = 'http://data.jingan-china.cn/v2/chem/chemScreen/danger-factors-list.png';
const safetyRiskList = 'http://data.jingan-china.cn/v2/chem/chemScreen/safety-risk-list.png';
const knowCard = 'http://data.jingan-china.cn/v2/chem/chemScreen/know-card.png';
const commitmentCard = 'http://data.jingan-china.cn/v2/chem/chemScreen/commitment-card.png';
const emergencyCard = 'http://data.jingan-china.cn/v2/chem/chemScreen/emergency-card.png';
const riskData = [
  { label: '红色', value: 0, color: '#FC1F02' },
  { label: '橙色', value: 0, color: '#F17A0A' },
  { label: '黄色', value: 0, color: '#FFE500' },
  { label: '蓝色', value: 0, color: '#0967D3' },
];
const Levels = [
  { label: '红', color: '#FF4848' },
  { label: '橙', color: '#F17A0A' },
  { label: '黄', color: '#FBF719' },
  { label: '蓝', color: '#1E60FF' },
];
const hdStatus = [7, 2, 3]; //已超期， 未超期， 待复查

const hiddenDangerData = [
  { label: '已超期', value: 0, color: '#FC1F02' },
  { label: '待整改', value: 0, color: '#FFE500' },
  { label: '待复查', value: 0, color: '#0967D3' },
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
    value: 0,
    url: 'two-information-management/danger-factors-list/list',
    images: [dangerFactorsList],
  },
  {
    label: '安全风险分级管控清单',
    value: 0,
    url: 'two-information-management/safety-risk-list/list',
    images: [safetyRiskList],
  },
];
const threeCardData = [
  { label: '承诺卡', value: 0, url: 'cards-info/commitment-card/list', images: [commitmentCard] },
  { label: '应知卡', value: 0, url: 'cards-info/know-card/list', images: [knowCard] },
  { label: '应急卡', value: 0, url: 'cards-info/emergency-card/list', images: [emergencyCard] },
];

export default class KeyPoints extends PureComponent {
  state = {};

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
      zoneContent: {
        zoneName,
        zoneChargerName,
        phoneNumber,
        zoneLevel,
        cbiList = [],
        hdList = [],
        acList = [],
        kcList = [],
        ecList = [],
        dcList = [],
        scList = [],
        id,
      },
      handleClickHiddenDanger,
      handleShowRiskPoint,
    } = this.props;
    // const {  } = this.state;
    const areaLvl = Levels[zoneLevel - 1] || {};
    const hiddenDangerList = hdList.filter(item => +item.status !== 4);

    return (
      <DrawerContainer
        title={`风险分区信息`}
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        left={
          <div className={styles.container}>
            <div className={styles.areaContainer}>
              <div>
                区域名称：
                {zoneName}
              </div>
              <div>
                区域负责人：
                {zoneChargerName}
              </div>
              <div>
                联系电话：
                {phoneNumber}
              </div>
              <div
                className={styles.areaColor}
                style={{
                  backgroundColor: areaLvl.color,
                  color: +zoneLevel === 3 ? '#000' : '#fff',
                }}
              >
                {areaLvl.label}
              </div>
            </div>

            {cbiList.length > 0 && (
              <div className={styles.wrapper}>
                <div className={styles.title}>
                  风险点
                  <span className={styles.value}>({cbiList.length})</span>
                  <div className={styles.extra} onClick={handleShowRiskPoint}>
                    详情
                    <span style={{ color: '#0ff' }}>>></span>
                  </div>
                </div>
                <div className={styles.content}>
                  {riskData.map((item, index) => {
                    const { label, color } = item;
                    const count = cbiList.filter(hd => +hd.riskLevel === index + 1).length;
                    return count ? (
                      <div className={styles.dotItem} key={index}>
                        <span className={styles.dot} style={{ backgroundColor: color }} />
                        {label}
                        <span className={styles.dotValue}>{count}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {hiddenDangerList.length > 0 && (
              <div className={styles.wrapper}>
                <div className={styles.title}>
                  隐患
                  <span className={styles.value}>({hiddenDangerList.length})</span>
                  <div className={styles.extra} onClick={handleClickHiddenDanger}>
                    详情
                    <span style={{ color: '#0ff' }}>>></span>
                  </div>
                </div>
                <div className={styles.content}>
                  {hiddenDangerData.map((item, index) => {
                    const { label, color } = item;
                    const count = hiddenDangerList.filter(hd => +hd.status === hdStatus[index])
                      .length;
                    return count ? (
                      <div className={styles.dotItem} key={index}>
                        <span className={styles.dot} style={{ backgroundColor: color }} />
                        {label}
                        <span className={styles.dotValue}>{count}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* <div className={styles.wrapper}>
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
            </div> */}

            <div className={styles.wrapper}>
              <div className={styles.title}>两单</div>
              <div className={styles.content}>
                {twoListData.map((item, index) => {
                  const { label, url, images } = item;
                  const cardLists = [dcList, scList];

                  return (
                    <div
                      className={styles.tagItem}
                      key={index}
                      onClick={() => cardLists[index].length > 0 && this.handleJump(url, images)}
                      style={{ cursor: cardLists[index].length > 0 ? 'pointer' : 'default' }}
                    >
                      {label}
                      <span className={styles.tagValue}>({cardLists[index].length})</span>
                      {cardLists[index].length > 0 && (
                        <Icon type="right" className={styles.rightIcon} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.wrapper}>
              <div className={styles.title}>三卡</div>
              <div className={styles.content}>
                {threeCardData.map((item, index) => {
                  const { label, url, images } = item;
                  const cardLists = [acList, kcList, ecList];

                  return (
                    <div
                      className={styles.tagItem}
                      key={index}
                      onClick={() => cardLists[index].length > 0 && this.handleJump(url, images)}
                      style={{ cursor: cardLists[index].length > 0 ? 'pointer' : 'default' }}
                    >
                      {label}
                      <span className={styles.tagValue}>({cardLists[index].length})</span>
                      {cardLists[index].length > 0 && (
                        <Icon type="right" className={styles.rightIcon} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        }
      />
    );
  }
}
