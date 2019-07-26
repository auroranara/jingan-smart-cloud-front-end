import React, { Fragment, PureComponent } from 'react';

import styles from './WaterItemDrawer.less';
// import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import { DrawerContainer } from '@/pages/BigPlatform/NewFireControl/components/Components';
// import ElectricityCharts from '@/pages/BigPlatform/ElectricityMonitor/components/ElectricityCharts';
import { Gauge, LossDevice, OvSelect, TrendChart, WaterTank } from '../components/Components';
import { isGauge } from '../utils';
// import cameraIcon from '../../ElectricityMonitor/imgs/camera.png';

// const VIDEO_STYLE = {
//   width: '90%',
//   marginLeft: '-43%',
// };

// const DATE_OPTIONS = [
//   { value: 1, desc: '最近一周' },
//   { value: 2, desc: '最近一月' },
//   { value: 3, desc: '最近三月' },
//   { value: 4, desc: '最近半年' },
//   { value: 5, desc: '最近一年' },
// ];
const DATE_OPTIONS = ['一周', '一月', '三月', '半年', '一年'].map((desc, i) => ({ value: i + 1, desc: `最近${desc}` }));

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
      visible,
      tabItem,
      data: {
        item,
        history,
        total,
        // cameraList = [],
      },
    } = this.props;
    // const { videoVisible, videoKeyId } = this.state;
    const { dateType } = this.state;

    const { area, location, deviceName, deviceDataList } = item;
    const title = `${deviceName}(${area}${location})`;
    const dataItem = deviceDataList && deviceDataList[0] ? deviceDataList[0] : undefined;
    let child = <LossDevice />;

    if (dataItem)
      child = isGauge(tabItem) ? <Gauge data={dataItem} /> : <WaterTank data={dataItem} />;

    const left = (
      <Fragment>
        <div className={styles.chartContainer}>
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
