import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Col, Row } from 'antd';
import Ellipsis from 'components/Ellipsis';

import { OvProgress, SearchBar } from '@/pages/BigPlatform/NewFireControl/components/Components';
import DrawerContainer from '../components/DrawerContainer';
import ChartGauge from '../components/ChartGauge';

import styles from './WaterSystemDrawer.less';

import fireError from '../imgs/fireError.png';
import fireNormal from '../imgs/fireNormal.png';
import autoError from '../imgs/autoError.png';
import autoNormal from '../imgs/autoNormal.png';
import pondAbnormal from '../imgs/pond-abnormal.png';
import pondNormal from '../imgs/pond-normal.png';
import cameralogo from '../imgs/cameralogo.png';
import noMonitorImg from '../imgs/no-monitor.png';

@connect(({ newUnitFireControl }) => ({
  newUnitFireControl,
}))
export default class WaterSystemDrawer extends PureComponent {
  state = {
    status: '',
    isSelected: true,
    visible: true,
  };

  componentDidMount() {}

  getImageError = i => {
    switch (+i) {
      case 0:
        return fireError;
      case 1:
        return autoError;
      case 2:
        return pondAbnormal;
      default:
        return;
    }
  };

  getImageNormal = i => {
    switch (+i) {
      case 0:
        return fireNormal;
      case 1:
        return autoNormal;
      case 2:
        return pondNormal;
      default:
        return;
    }
  };

  render() {
    const { visible, waterTabItem } = this.props;

    const list = Array(7)
      .fill(true)
      .map((item, index) => {
        return {
          add_time: 1536657042933,
          area: `${index + 1}号楼`,
          id: `${index + 1}`,
          location: `${index + 1}号楼`,
          normal_upper: 5,
          realtimeData: 0,
          status: '1',
          statusName: '正常',
          press: '0,1MPa',
        };
      });

    const left = (
      <div className={styles.content}>
        {/* 统计数据 */}
        <div className={styles.totalInfo}>
          <div className={styles.title}>
            {waterTabItem === 0 ? (
              <span>消火栓统计数据</span>
            ) : waterTabItem === 1 ? (
              <span>自动喷淋统计 数据</span>
            ) : (
              <span>水池/水箱统计数据</span>
            )}
          </div>
          <div className={styles.progress}>
            <Col span={16}>
              <OvProgress
                title="异常"
                percent={10}
                quantity={5}
                strokeColor="rgb(255,72,72)"
                // style={{ marginTop: 40 }}
                iconStyle={{
                  backgroundImage: `url(${this.getImageError(waterTabItem)})`,
                  width: 55,
                  height: 55,
                }}
              />
              <OvProgress
                title="正常"
                percent={10}
                quantity={2}
                strokeColor="rgb(0,251,252)"
                // style={{ cursor: 'pointer' }}
                iconStyle={{
                  backgroundImage: `url(${this.getImageNormal(waterTabItem)})`,
                  width: 55,
                  height: 55,
                }}
              />
            </Col>
          </div>
        </div>
        {/* 实时监测数据 */}
        <div className={styles.realTimeMonitor}>
          <div className={styles.titleLine}>
            <div className={styles.title}>
              <span>实时监测数据</span>
            </div>
            <SearchBar placeholder="搜索点位名称" onSearch={this.handleSearch} />
          </div>
          {list && list.length > 0 ? (
            <div className={styles.listContainer}>
              {list.map(({ area, location, status, press, normal_upper }, i) => (
                <Col span={12}>
                  <div className={styles.card} key={i} style={{ marginTop: i < 2 ? '0' : '10px' }}>
                    <div className={styles.picArea}>
                      {/* {waterTabItem === 2 && (
                        <img className={styles.pondBg} src={pondAbnormal} alt="pond" />
                      )} */}
                      {waterTabItem !== 2 && (
                        <ChartGauge
                          showName
                          showValue
                          radius="95%"
                          name=""
                          value={2}
                          range={[0, 2]}
                          normalRange={[0.4, 1.2]}
                        />
                      )}
                    </div>
                    <div className={styles.itemContainer}>
                      <Ellipsis className={styles.line} lines={1} tooltip>
                        {area}
                      </Ellipsis>
                      <Ellipsis className={styles.line} lines={1} tooltip>
                        位置：
                        {location}
                      </Ellipsis>
                      <Ellipsis className={styles.line} lines={1} tooltip>
                        当前压力：
                        {press}
                      </Ellipsis>
                      <Ellipsis className={styles.line} lines={1} tooltip>
                        参考范围：
                        {normal_upper}
                      </Ellipsis>
                      <div className={styles.lastLine}>
                        <div
                          className={styles.camera}
                          // onClick={this.handleClickCamera}
                          style={{
                            background: `url(${cameralogo}) no-repeat center center`,
                            backgroundSize: '100% 100%',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </div>
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
        {/* <VideoPlay
          showList={true}
          videoList={cameraList}
          visible={videoVisible}
          keyId={videoKeyId}
          // style={VIDEO_STYLE}
          handleVideoClose={this.handleVideoClose}
        /> */}
      </div>
    );
    return (
      <DrawerContainer
        style={{ overflow: 'hidden' }}
        destroyOnClose={true}
        title={
          waterTabItem === 0 ? '消火栓系统' : waterTabItem === 1 ? '自动喷淋系统' : '水池/水箱'
        }
        width={700}
        visible={visible}
        left={left}
        placement="right"
        onClose={() => {
          this.props.onClose();
          this.setState({
            visible: false,
          });
        }}
      />
    );
  }
}
