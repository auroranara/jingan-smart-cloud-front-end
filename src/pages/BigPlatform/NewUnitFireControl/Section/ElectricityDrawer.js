import React, { Fragment, PureComponent } from 'react';
import { Icon } from 'antd';
import { DrawerContainer, OvSelect } from '@/pages/BigPlatform/NewFireControl/components/Components';
import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import TotalInfo from '../components/TotalInfo';
import { Gauge } from '../../ElectricityMonitor/components/Components';
import GaugeLabels from '../components/GaugeLabels';
import ElectricityCharts from '../../ElectricityMonitor/components/ElectricityCharts';
import { getAlerted, getTargetAlerted, getLimit } from '../../ElectricityMonitor/utils';
import styles from './ElectricityDrawer.less';
import cameraIcon from '../../ElectricityMonitor/imgs/camera.png';
import emptyBg from '../../Gas/imgs/no-monitor.png';

const GAUGE_LABELS = ['温度', '漏电电流', '电流', '电压'];
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
  return <Icon type="double-right" style={{ color: '#0FF' }} />;
}

export default class ElectricityDrawer extends PureComponent {
  state = {
    videoVisible: false,
    videoKeyId: '',
    labelIndex: 0,
  };

  componentDidMount() {
    const { setAlertedLabelIndexFn } = this.props;
    setAlertedLabelIndexFn(this.setAlertedLabelIndex);
  }

  setAlertedLabelIndex = paramName => {
    const {
      data: {
        deviceRealTimeData: { deviceDataForAppList },
      },
    } = this.props;
    const alerted = getTargetAlerted(deviceDataForAppList, CHARTS_LABELS, paramName);
    alerted && this.setState({ labelIndex: alerted });
  };

  handleClickCamera = () => {
    const {
      data: { cameraList = [] },
    } = this.props;
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

  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
    this.setState({ labelIndex: 0 });
  };

  render() {
    const {
      visible,
      data: {
        deviceStatusCount: {
          normal = 0,
          earlyWarning = 0,
          confirmWarning = 0,
          unconnect = 0,
          list: deviceList,
        },
        devices = [],
        deviceRealTimeData: { deviceId = undefined, deviceDataForAppList = [] },
        deviceConfig = [],
        deviceHistoryData,
        cameraList = [],
      },
      filterIndex,
      onClick,
      // handleSelect,
      // handleClose,
    } = this.props;
    const { videoVisible, videoKeyId, labelIndex } = this.state;
    // 实时数据列表
    const list = [];
    deviceDataForAppList.forEach(({ desc, code, value, unit, status }) => {
      const index = CHARTS_LABELS[labelIndex].indexOf(desc);
      if (index > -1) {
        const limit = getLimit(deviceConfig, code);
        list[index] = {
          desc,
          value,
          unit,
          limit,
          status,
        };
      }
    });
    const topData = [
      {
        name: '报警',
        value: earlyWarning + confirmWarning,
        color: '#f83329',
        deviceIds: deviceList.filter(item => +item.status > 0).map(item => item.deviceId),
      },
      {
        name: '失联',
        value: unconnect,
        color: '#9f9f9f',
        deviceIds: deviceList.filter(item => +item.status === -1).map(item => item.deviceId),
      },
      {
        name: '正常',
        value: normal,
        color: '#00ffff',
        deviceIds: deviceList.filter(item => +item.status === 0).map(item => item.deviceId),
      },
    ].map((item, index) => {
      return {
        ...item,
        onClick: () => {
          onClick(index, item.deviceIds[0]);
        },
      };
    });
    const deviceIds = topData[filterIndex] ? topData[filterIndex].deviceIds : [];
    let gauges = <div className={styles.empty} style={{ backgroundImage: `url(${emptyBg})` }} />;
    if (list.length && deviceIds.length)
      gauges = list.map((item, i) => <Gauge key={item.desc} data={item} />);
    const alerted = deviceIds.length ? getAlerted(deviceDataForAppList, CHARTS_LABELS) : [];
    const left = (
      <Fragment>
        <TotalInfo data={topData} active={filterIndex} />
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>
            <span className={styles.rectIcon} />
            数据监测
            {!!deviceIds.length && (
              <div className={styles.select}>
                <OvSelect
                  cssType={1}
                  options={devices
                    .filter(item => deviceIds.indexOf(item.deviceId) >= 0)
                    .map(({ location, area, deviceId }) => ({
                      value: deviceId,
                      desc: `${area}${location}`,
                    }))}
                  value={deviceId}
                  handleChange={this.handleSelectDevice}
                />
              </div>
            )}
            {!!deviceIds.length &&
              !!cameraList.length && (
                <span
                  className={styles.camera}
                  style={{ backgroundImage: `url(${cameraIcon})` }}
                  onClick={e => this.handleClickCamera()}
                />
              )}
          </h3>
          <GaugeLabels
            value={labelIndex}
            labels={GAUGE_LABELS}
            alerted={alerted}
            handleLabelClick={this.handleLabelClick}
            style={{
              marginLeft: '-31px',
              marginRight: '-16px',
              paddingLeft: '31px',
              paddingRight: '16px',
            }}
          />
          <div className={styles.section}>
            <h4 className={styles.secTitle}>
              <DoubleRight />
              实时监测数据
            </h4>
            <div className={styles.gauges}>{gauges}</div>
          </div>
          <div className={styles.section} style={{ marginTop: 15 }}>
            <h4 className={styles.secTitle1}>
              <DoubleRight />
              监测趋势图
            </h4>
            <ElectricityCharts
              noData={!!deviceIds.length}
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
        isTop
        title={'电气火灾监测'}
        width={700}
        visible={visible}
        left={left}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={() => {
          this.handleClose();
          this.handleVideoClose();
        }}
      />
    );
  }
}
