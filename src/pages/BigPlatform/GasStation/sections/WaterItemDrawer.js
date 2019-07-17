import React, { Fragment, PureComponent } from 'react';

import styles from './WaterItemDrawer.less';
// import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import { DrawerContainer } from '@/pages/BigPlatform/NewFireControl/components/Components';
// import ElectricityCharts from '@/pages/BigPlatform/ElectricityMonitor/components/ElectricityCharts';
import { LossDevice, OvSelect, TrendChart, WaterTank } from '../components/Components';
// import cameraIcon from '../../ElectricityMonitor/imgs/camera.png';

// const VIDEO_STYLE = {
//   width: '90%',
//   marginLeft: '-43%',
// };

const DATE_OPTIONS = [
  { value: 1, desc: '最近一周' },
  { value: 2, desc: '最近一月' },
  { value: 5, desc: '最近一年' },
];

export default class WaterItemDrawer extends PureComponent {
  // state = {
  //   videoVisible: false,
  //   videoKeyId: '',
  // };

  state = { dateType: 1 };

  // handleClickCamera = () => {
  //   const {
  //     data: { cameraList = [] },
  //   } = this.props;
  //   this.setState({
  //     videoVisible: true,
  //     videoKeyId: cameraList.length ? cameraList[0].key_id : '',
  //   });
  // };

  // handleVideoClose = () => {
  //   this.setState({ videoVisible: false, videoKeyId: '' });
  // };

  handleDateChange = value => {
    const { fetchAlarmCount, data: { item: { deviceId } } } = this.props;
    this.setState({ dateType: value });
    fetchAlarmCount(deviceId, value);
  };

  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
    this.setState({ dateType: 1 });
  };

  render() {
    const {
      visible,
      data: {
        item,
        history,
        total,
        // cameraList = [],
      },
      // handleSelect,
      // handleClose,
    } = this.props;
    // const { videoVisible, videoKeyId } = this.state;
    const { dateType } = this.state;

    const { area, location, deviceName, deviceDataList } = item;
    const title = `${deviceName}(${area}${location})`;
    const water = deviceDataList && deviceDataList[0] ? deviceDataList[0] : undefined;
    let child = <LossDevice />;
    if (water) {
      const { value, status, unit, deviceParamsInfo: { normalLower, normalUpper, maxValue } } = water;
      child = (
        <WaterTank
          status={+status}
          dy={30}
          width={200}
          height={200}
          value={value}
          size={[100, 150]}
          limits={[normalLower, normalUpper]}
          range={maxValue}
          unit={unit}
        />
      );
    }

    const left = (
      <Fragment>
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>
            <span className={styles.rectIcon} />
            数据监测
            {/* {!!cameraList.length && (
              <span
                className={styles.camera}
                style={{ backgroundImage: `url(${cameraIcon})` }}
                onClick={e => this.handleClickCamera()}
              />
            )} */}
          </h3>
          <div className={styles.waterContainer}>
            {child}
          </div>
          <h3 className={styles.chartTitle}>
            <span className={styles.rectIcon} />
            当天监测数据趋势
          </h3>
          <TrendChart
            // noData={!!deviceIds.length}
            data={{ item, history }}
          />
          <h3 className={styles.chartTitle}>
            <span className={styles.rectIcon} />
            历史报警统计
            <OvSelect cssType="1" options={DATE_OPTIONS} value={dateType} handleChange={this.handleDateChange} />
          </h3>
          <div className={styles.waterContainer}>
            <div className={styles.circle}><span className={styles.total}>{total}</span>次</div>
          </div>
        </div>
        {/* <VideoPlay
          showList={true}
          videoList={cameraList}
          visible={videoVisible}
          keyId={videoKeyId}
          style={VIDEO_STYLE}
          handleVideoClose={this.handleVideoClose}
        /> */}
      </Fragment>
    );

    return (
      <DrawerContainer
        isTop
        title={title}
        width={700}
        visible={visible}
        left={left}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={() => {
          this.handleClose();
          // this.handleVideoClose();
        }}
      />
    );
  }
}
