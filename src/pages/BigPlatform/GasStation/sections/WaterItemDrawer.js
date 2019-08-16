import React, { Fragment, PureComponent } from 'react';

import styles from './WaterItemDrawer.less';
// import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import { DrawerContainer } from '@/pages/BigPlatform/NewFireControl/components/Components';
// import ElectricityCharts from '@/pages/BigPlatform/ElectricityMonitor/components/ElectricityCharts';
import { Gauge, LossDevice, OvSelect, TrendChart, UnitInfo, WaterTank } from '../components/Components';
import { DATE_OPTIONS, OVERHAUL, isGauge } from '../utils';
// import cameraIcon from '../../ElectricityMonitor/imgs/camera.png';

// const VIDEO_STYLE = {
//   width: '90%',
//   marginLeft: '-43%',
// };

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
    const { fetchAlarmCount, data: { item: { deviceDataList: [{ deviceId }] } } } = this.props;
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
      showCompany,
      visible,
      tabItem,
      data: {
        item,
        history,
        total,
        // cameraList = [],
      },
      handleCameraOpen,
    } = this.props;
    // const { videoVisible, videoKeyId } = this.state;
    const { dateType } = this.state;

    const { area, location, companyName, deviceName, deviceDataList, status } = item;
    const loc = `${area || ''}${location || ''}`;
    let title = `${deviceName}${showCompany ? '' : `(${loc})`}`;
    const dataItem = deviceDataList && deviceDataList[0] ? deviceDataList[0] : undefined;
    let child = <LossDevice />;

    const isOverhaul = +status === OVERHAUL;
    if (dataItem)
      child = isGauge(tabItem, dataItem.unit) ? <Gauge data={dataItem} isOverhaul={isOverhaul} /> : <WaterTank data={dataItem} isisOverhaul={isOverhaul} />;

    const left = (
      <Fragment>
        <div className={styles.chartContainer}>
          {showCompany && (
            <UnitInfo
              style={{ marginBottom: 15 }}
              name={companyName}
              location={loc}
              clickCamera={handleCameraOpen}
            />
          )}
          <h3 className={styles.chartTitle}>
            <span className={styles.rectIcon} />
            实时监测数据
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
            data={{ params: dataItem, history }}
          />
          <h3 className={styles.chartTitle}>
            <span className={styles.rectIcon} />
            历史报警统计
            <OvSelect cssType="1" options={DATE_OPTIONS} value={dateType} handleChange={this.handleDateChange} />
          </h3>
          <div className={styles.waterContainer}>
            <div className={styles.circle} style={{ borderColor: total ? 'rgb(24, 141, 255)' : '#334d6e' }}><span className={styles.total}>{total}</span>次</div>
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
        zIndex={1001}
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={() => {
          this.handleClose();
          // this.handleVideoClose();
        }}
      />
    );
  }
}
