import React, { Fragment, PureComponent } from 'react';

import styles from './WaterItemDrawer.less';
// import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import { DrawerContainer } from '@/pages/BigPlatform/NewFireControl/components/Components';
// import ElectricityCharts from '@/pages/BigPlatform/ElectricityMonitor/components/ElectricityCharts';
import { TrendChart, WaterTank } from '../components/Components';
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

  handleClose = () => {
    const { handleClose } = this.props;
    handleClose();
  };

  render() {
    const {
      visible,
      data: {
        deviceRealTimeData: { deviceId = undefined, deviceDataForAppList = [] },
        deviceConfig = [],
        deviceHistoryData,
        // cameraList = [],
      },
      onClick,
      // handleSelect,
      // handleClose,
    } = this.props;
    // const { videoVisible, videoKeyId } = this.state;
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
          <WaterTank
            dy={30}
            width={200}
            height={200}
            value={3}
            size={[100, 150]}
            limits={[1, 4]}
            range={5}
            // className={styles.tank}
          />
          <h3 className={styles.chartTitle}>
            <span className={styles.rectIcon} />
            当天监测数据趋势
            <TrendChart
              // noData={!!deviceIds.length}
              data={{
                deviceHistoryData,
                deviceConfig,
              }}
            />
          </h3>
          <h3 className={styles.chartTitle}>
            <span className={styles.rectIcon} />
            历史报警统计
          </h3>
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
        title="水系统"
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
