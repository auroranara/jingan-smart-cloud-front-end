import React, { Fragment, PureComponent } from 'react';
import { Icon } from 'antd';

import {
  DrawerContainer,
  // DrawerSection,
  OvSelect,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import { DotItem, Gauge, GaugeLabels } from '../components/Components';
import ElectricityCharts from '../components/ElectricityCharts';
import { getAlerted } from '../utils';
import styles from './MonitorDrawer.less';
import locationIcon from '../imgs/location.png';
import personIcon from '../imgs/person.png';
import cameraIcon from '../imgs/camera.png';
import emptyBg from '@/pages/BigPlatform/Monitor/imgs/waterBg.png';

// const TYPE = 'monitor';
// const TEMPERATURE = '温度';
const TITLES = ['单位监测信息', '报警信息'];
const LABELS = ['正常', '告警', '预警', '失联'];
const COLORS = ['55,164,96', '248,51,41', '255,180,0', '159,159,159'];
const GAUGE_LABELS = ['温度', '漏电电流', '电流', '电压'];
// const CHART_LABELS = ['A相温度', 'B相温度', 'C相温度', '零线温度', '漏电电流'];
const CHARTS_LABELS = [
  ['A相温度', 'B相温度', 'C相温度', '零线温度'],
  ['漏电电流'],
  ['A相电流', 'B相电流', 'C相电流'],
  ['A相电压', 'B相电压', 'C相电压'],
];

const VIDEO_STYLE = {
  width: '90%',
  marginLeft: '-43%',
};

function DoubleRight(props) {
  return (
    <Icon
      type="double-right"
      style={{ color: '#0FF' }}
    />
  );
}

export default class MonitorDrawer extends PureComponent {
  state={
    videoVisible: false,
    videoKeyId: '',
    labelIndex: 0,
  };

  handleClickCamera = () => {
    const { data: { cameraList=[] } } = this.props;
    this.setState({
      videoVisible: true,
      videoKeyId: cameraList.length ? cameraList[0].key_id : '',
    });
  };

  handleVideoClose = () => {
    this.setState({ videoVisible: false, videoKeyId: '' });
  };

  handleLabelClick = i => {
    this.setState({ labelIndex: i });
  };

  handleSelectDevice = id => {
    const { handleSelect } = this.props;
    handleSelect(id);
    this.setState({ labelIndex: 0 });
  };

  render() {
    const {
      visible,
      titleIndex,
      data: {
        unitDetail: {
          companyName,
          address,
          aqy1Name,
          aqy1Phone,
        }={},
        deviceStatusCount: {
          normal=0,
          earlyWarning=0,
          confirmWarning=0,
          unconnect=0,
        },
        devices=[],
        deviceRealTimeData: {
          deviceId=undefined,
          deviceDataForAppList=[],
        },
        deviceConfig=[],
        deviceHistoryData,
        cameraList=[],
      },
      // handleSelect,
      handleClose,
      // handleClickCamera,
    } = this.props;
    const { videoVisible, videoKeyId, labelIndex } = this.state;

    // console.log(videoKeyId);

    const alerted = getAlerted(deviceDataForAppList, CHARTS_LABELS);
    // console.log(alerted);
    // 实时数据列表
    const list = [];
    deviceDataForAppList.forEach(({ desc, code, value, unit, status }) => {
      const index = CHARTS_LABELS[labelIndex].indexOf(desc);
      if (index > -1) {
        const limit = [null, null];
        deviceConfig.forEach(({ code: code2, level, limitValue }) => {
          if (code2 === code) {
            limit[level-1] = limitValue;
          }
        });
        list[index] = {
          desc,
          value,
          unit,
          limit,
          status,
        };
      }
    });

    let gauges = <div className={styles.empty} style={{ backgroundImage: `url(${emptyBg})` }} />;
    if (list.length)
      gauges = list.map((item, i) => (
        <Gauge
          key={item.desc}
          data={item}
        />
      ));

    const left = (
      <Fragment>
        <div className={styles.info}>
          <p className={styles.name}>{companyName}</p>
          <p><span className={styles.location} style={{ backgroundImage: `url(${locationIcon})` }} />{address}</p>
          <p><span className={styles.person} style={{ backgroundImage: `url(${personIcon})` }} />{(aqy1Name || aqy1Phone) && `${aqy1Name?aqy1Name:'未命名'} ${aqy1Phone?aqy1Phone:''}`}</p>
          <p className={styles.dots}>
            {[normal, confirmWarning, earlyWarning, unconnect].map((n, i) => (
              <DotItem key={i} title={LABELS[i]} color={`rgb(${COLORS[i]})`} quantity={n} />
            ))}
          </p>
        </div>
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>
            <span className={styles.rectIcon} />
            数据监测
            {!!devices.length && (
              <div className={styles.select}>
                <OvSelect
                  cssType={1}
                  options={devices.map(({ location, area, deviceId }) => ({ value: deviceId, desc: `${area}${location}` }))}
                  value={deviceId}
                  handleChange={this.handleSelectDevice}
                />
              </div>
            )}
            {!!devices.length && !!cameraList.length && (
              <span
                className={styles.camera}
                style={{ backgroundImage: `url(${cameraIcon})` }}
                onClick={e => this.handleClickCamera()}
                // onClick={e => handleClickCamera()}
              />
            )}
          </h3>
          <GaugeLabels
            value={labelIndex}
            labels={GAUGE_LABELS}
            alerted={alerted}
            handleLabelClick={this.handleLabelClick} />
          <div className={styles.section}>
            <h4 className={styles.secTitle}>
              <DoubleRight />
              实时监测数据
            </h4>
            <div className={styles.gauges}>
              {gauges}
            </div>
          </div>
          <div className={styles.section}>
            <h4 className={styles.secTitle1}>
              <DoubleRight />
              监测趋势图
            </h4>
            <ElectricityCharts
              noData={devices.length}
              data={{
                deviceHistoryData,
                deviceConfig,
                // chartTabs: ['temp', 'v1'],
              }}
              activeTab={labelIndex}
            />
          </div>
        </div>
        <VideoPlay
          showList={false}
          videoList={cameraList}
          visible={videoVisible}
          keyId={videoKeyId}
          style={VIDEO_STYLE}
          handleVideoClose={this.handleVideoClose}
        />
      </Fragment>
    );

    return (
      <DrawerContainer
        title={TITLES[titleIndex]}
        width={700}
        visible={visible}
        left={left}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={handleClose}
      />
    );
  }
}
