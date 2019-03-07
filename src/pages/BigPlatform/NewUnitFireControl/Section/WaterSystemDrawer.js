import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Col, Row } from 'antd';
import Ellipsis from 'components/Ellipsis';

import { OvProgress } from '@/pages/BigPlatform/NewFireControl/components/Components';
import DrawerContainer from '../components/DrawerContainer';
import ChartGauge from '../components/ChartGauge';

import styles from './WaterSystemDrawer.less';

import fireError from '../imgs/fireError.png';
import fireNormal from '../imgs/fireNormal.png';
import cameralogo from '../imgs/cameralogo.png';

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

  render() {
    const { visible, waterTabItem } = this.props;

    const list = [
      {
        add_time: 1536657042933,
        area: '1号楼',
        id: '1',
        location: '1号楼',
        normal_upper: 5,
        realtimeData: 0,
        status: '0',
        statusName: '正常',
        press: '0,1MPa',
      },
      {
        add_time: 1536657042933,
        area: '2号楼',
        id: '2',
        location: '1号楼',
        normal_upper: 5,
        realtimeData: 0,
        status: '1',
        statusName: '正常',
        press: '0,1MPa',
      },
    ];
    const left = (
      <div className={styles.content}>
        {/* 统计数据 */}
        <div className={styles.totalInfo}>
          <div className={styles.title}>
            <span>消火栓统计数据</span>
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
                  backgroundImage: `url(${fireError})`,
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
                  backgroundImage: `url(${fireNormal})`,
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
            {/* <OvSelect
              cssType={1}
              options={OPTIONS}
              value={status}
              handleChange={handleChangeStatus} /> */}
          </div>
          {list && list.length > 0 ? (
            <div className={styles.listContainer}>
              {list.map(({ area, location, status, press, normal_upper }, i) => (
                <div className={styles.card} key={i} style={{ marginTop: i < 2 ? '0' : '10px' }}>
                  {+status === 0 && <div className={styles.status}>异常</div>}
                  <div className={styles.chartGauge}>
                    <ChartGauge
                      showName
                      showValue
                      name=""
                      value={2}
                      range={[0, 2]}
                      normalRange={[0.4, 1.2]}
                    />
                  </div>
                  <div className={styles.contentContainer}>
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
              ))}
            </div>
          ) : (
            <div
              className={styles.emptyContainer}
              style={{
                // background: `url(${noMonitorImg}) no-repeat center center`,
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
