import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import Ellipsis from 'components/Ellipsis';

import { OvProgress, SearchBar } from '@/pages/BigPlatform/NewFireControl/components/Components';
import DrawerContainer from '../components/DrawerContainer';
import TotalInfo from '../components/TotalInfo';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import { findFirstVideo } from '@/utils/utils';

import styles from './SmokeDrawer.less';

import smokeAlarm from '../../Smoke/imgs/smoke-alarm.png';
import smokeFault from '../../Smoke/imgs/smoke-fault.png';
import smokeNormal from '../../Smoke/imgs/smoke-normal.png';
import smokeLost from '../../Smoke/imgs/smoke-lost.png';
import cameralogo from '../imgs/cameralogo.png';
import noMonitorImg from '../imgs/no-monitor.png';

export default class SmokeDrawer extends PureComponent {
  state = {
    videoVisible: false, // 视频弹框是否可见
    searchValue: '',
  };

  componentDidMount() {}

  handleSearch = v => {
    this.setState({ searchValue: v });
  };

  handleClickCamera = deviceId => {
    const { getDeviceCamera } = this.props;
    getDeviceCamera(deviceId, 3, () => {
      this.setState({
        videoVisible: true,
      });
    });
  };

  handleVideoClose = () => {
    this.setState({ videoVisible: false });
  };

  renderItems = list => {
    return (
      <Row gutter={16}>
        {list.map((item, index) => {
          const { area, location, add_time, status, iotId, device_id, hasCamera } = item;
          let occurTime = `时间：${moment(add_time).format('YYYY-MM-DD HH:mm:ss')}`;
          const devStatus = '设备状态：正常';
          const color = +status > 0 ? '#f83329' : '#ffb400';
          let smokeImg;
          if (+status > 0) {
            smokeImg = smokeAlarm;
            occurTime = '报警' + occurTime;
          } else if (+status === 0 || !status) {
            smokeImg = smokeNormal;
          } else if (+status === -1) {
            smokeImg = smokeLost;
            occurTime = '失联' + occurTime;
          } else {
            smokeImg = smokeFault;
            occurTime = '故障' + occurTime;
          }
          return (
            <Col span={12} key={index}>
              <div className={styles.deviceWrapper}>
                <div className={styles.deviceImg}>
                  <img src={smokeImg} alt="smokeImg" />
                </div>
                <div className={styles.infoWrapper}>
                  <div className={styles.position}>
                    <Ellipsis lines={1} tooltip>{`${area}：${location}`}</Ellipsis>
                  </div>
                  <div className={styles.infos}>
                    <Ellipsis lines={1} tooltip>
                      {+status === 0 ? devStatus : occurTime}
                    </Ellipsis>
                  </div>
                  <div className={styles.extraWrapper}>
                    {+hasCamera === 1 && (
                      <div
                        className={styles.camraImg}
                        style={{ backgroundImage: `url(${cameralogo})` }}
                        onClick={e => this.handleClickCamera(device_id)}
                      />
                    )}
                    {(+status > 0 || !status || +status < -1) && (
                      <div
                        className={styles.status}
                        // onClick={() => {
                        //   +status > 0
                        //     ? handleAlarmClick(iotId, companyId, companyName, undefined)
                        //     : handleFaultClick(iotId, companyId, companyName, undefined);
                        // }}
                      >
                        处理动态>>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    );
  };

  render() {
    const {
      companySmokeInfo: {
        map: { unnormal = [], fault = [], normal = [] } = { unnormal: [], fault: [], normal: [] },
      },
      onClick,
      videoList,
      filterIndex,
      visible,
    } = this.props;
    const { videoVisible } = this.state;

    const lost = fault.filter(item => +item.status === -1).length;
    const topData = [
      { name: '报警', value: unnormal.length, color: '#f83329', list: unnormal },
      {
        name: '故障',
        value: fault.length - lost,
        color: '#ffb400',
        list: fault.filter(item => +item.status !== -1),
      },
      {
        name: '失联',
        value: lost,
        color: '#9f9f9f',
        list: fault.filter(item => +item.status === -1),
      },
      { name: '正常', value: normal.length, color: '#00ffff', list: normal },
    ].map((item, index) => {
      return {
        ...item,
        onClick: () => {
          onClick(index);
        },
      };
    });
    // const newList = searchValue ? topData[filterIndex].list.filter(item=>) : topData[filterIndex].list;
    const newList = topData[filterIndex] ? topData[filterIndex].list : [];

    const left = (
      <div className={styles.content}>
        {/* 统计数据 */}
        <TotalInfo data={topData} active={filterIndex} />

        {/* 实时监测数据 */}
        <div className={styles.realTimeMonitor}>
          <div className={styles.titleLine}>
            <div className={styles.title}>
              <span>实时监测数据</span>
            </div>
            {/* <SearchBar placeholder="搜索点位名称" onSearch={this.handleSearch} /> */}
          </div>
          {newList && newList.length > 0 ? (
            <div className={styles.listContainer}>{this.renderItems(newList)}</div>
          ) : (
            <div
              className={styles.emptyContainer}
              style={{
                background: `url(${noMonitorImg}) no-repeat center center`,
                backgroundSize: '35% 80%',
              }}
            />
          )}
        </div>
        <NewVideoPlay
          showList={true}
          videoList={videoList}
          visible={videoVisible}
          keyId={videoList.length > 0 ? findFirstVideo(videoList).id : undefined}
          handleVideoClose={this.handleVideoClose}
          isTree={true}
        />
      </div>
    );

    return (
      <DrawerContainer
        style={{ overflow: 'hidden' }}
        destroyOnClose={true}
        title={'独立烟感监测'}
        width={700}
        visible={visible}
        left={left}
        placement="right"
        onClose={() => {
          this.props.onClose();
          this.setState({
            visible: false,
            videoVisible: false,
            searchValue: '',
          });
        }}
      />
    );
  }
}
