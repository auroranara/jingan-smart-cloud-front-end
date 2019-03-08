import React, { Fragment, PureComponent } from 'react';
import { Row, Col } from 'antd';

import { DrawerContainer } from '@/pages/BigPlatform/NewFireControl/components/Components';
import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import ChartGauge from '../../components/ChartGauge';
import styles from './index.less';
// import hydrantAbnormal from '../images/hydrant-abnormal.png';
// import hydrantNormal from '../images/hydrant-normal.png';
import cameraIcon from '../../images/camera.png';

export default class WaterDrawer extends PureComponent {
  state = {
    videoVisible: false,
    videoKeyId: '',
    statusIndex: 0,
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

  handleSelectChange = index => {
    this.setState({ statusIndex: index });
  };
  // <div className={styles.deviceWrapper}></div>
  renderItems = () => {
    const {
      cameraList = [],
      dataSet: {
        valName = '数据',
        newLine = true,
        dataList = [],
        useGauge = false,
        abnormalImg,
        normalImg,
      },
    } = this.props;
    // const dataList = Array(7)
    //   .fill(true)
    //   .map((item, index) => {
    //     return {
    //       name: `水箱${index + 1}`,
    //       id: Math.floor(Math.random() * 666666666).toString(),
    //       location: `${index + 1}号楼`,
    //       value: 2 * Math.random().toFixed(2),
    //       unit: 'm',
    //       range: [2, 4],
    //       status: Math.floor(2 * Math.random()),
    //     };
    //   });
    return (
      <div className={styles.devScroll}>
        <Row gutter={16}>
          {dataList.length ? (
            dataList.map((item, index) => {
              const { name, value, unit, range, location, status } = item;
              return (
                <Col span={12} key={index}>
                  <div className={styles.deviceWrapper}>
                    {status === 0 && <div className={styles.status}>异常</div>}
                    <div
                      className={styles.deviceImg}
                      style={{ width: useGauge ? '120px' : '80px' }}
                    >
                      {/* <img src={hydrantNormal} alt="" /> */}
                      {useGauge ? (
                        <ChartGauge
                          showName={false}
                          showValue={false}
                          name={name}
                          value={value}
                          range={[0, 2]}
                          normalRange={[0.4, 1.2]}
                          style={{ width: '110px', height: '110px' }}
                        />
                      ) : (
                        <img src={status === 0 ? abnormalImg : normalImg} alt="" />
                      )}
                    </div>
                    <div className={styles.infoWrapper}>
                      <div className={styles.name}>{name}</div>
                      <div className={styles.position}>{`位置：${location}`}</div>
                      <Row gutter={8}>
                        <Col span={newLine ? 24 : 12}>
                          {`当前${valName}：`}
                          <span style={{ color: status === 0 ? '#f83329' : '#fff' }}>{`${value +
                            unit}`}</span>
                        </Col>
                        <Col span={newLine ? 24 : 12}>{`参考范围：${range[0]}~${
                          range[1]
                        }${unit}`}</Col>
                      </Row>
                      {/* <div className={styles.value}>{`当前${valName}：${value+unit}`}</div>
                      <div className={styles.range}>{`参考范围：${range[0]}~${range[1]}${unit}`}</div> */}
                      <div className={styles.extraWrapper}>
                        {/* {!!cameraList.length && ( */}
                        <div
                          className={styles.camraImg}
                          style={{ backgroundImage: `url(${cameraIcon})` }}
                          onClick={e => this.handleClickCamera()}
                        />
                        {/* )} */}
                      </div>
                    </div>
                  </div>
                </Col>
              );
            })
          ) : (
            <div
              style={{
                width: '100%',
                height: '135px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#4f678d',
              }}
            >
              暂无相关监测数据
            </div>
          )}
        </Row>
      </div>
    );
  };

  render() {
    const {
      visible,
      dataSet: { subTitle, abnormal, normal, abnormalImg, normalImg },
      onClose,
    } = this.props;
    const { videoVisible, videoKeyId, statusIndex } = this.state;

    const left = (
      <Fragment>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>
              <span className={styles.rectIcon} />
              {subTitle}
              统计数据
            </h3>
            <div className={styles.section}>
              <div className={styles.statisticsWrapper}>
                <div className={styles.statisticsItem}>
                  <img src={abnormalImg} alt="" />
                  <div className={styles.infoWrapper}>
                    <div className={styles.name}>异常</div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          backgroundColor: '#ff4848',
                          width: (100 * abnormal) / (normal + abnormal) + '%',
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.value} style={{ color: '#ff4848' }}>
                    {abnormal}
                  </div>
                </div>
                <div className={styles.statisticsItem}>
                  <img src={normalImg} alt="" />
                  <div className={styles.infoWrapper}>
                    <div className={styles.name}>正常</div>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          backgroundColor: '#00fbfc',
                          width: (100 * normal) / (normal + abnormal) + '%',
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.value} style={{ color: '#00fbfc' }}>
                    {normal}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={styles.chartContainer}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', marginRight: -10 }}
          >
            <h3 className={styles.chartTitle}>
              <span className={styles.rectIcon} />
              实时监测数据
            </h3>
            <div className={styles.section} style={{ flex: 1, overflow: 'hidden' }}>
              {this.renderItems()}
            </div>
          </div>
          {/* <VideoPlay
          showList={true}
          videoList={cameraList}
          visible={videoVisible}
          keyId={videoKeyId}
          handleVideoClose={this.handleVideoClose}
        /> */}
        </div>
      </Fragment>
    );

    return (
      <DrawerContainer
        title={'消火栓系统'}
        width={700}
        visible={visible}
        left={left}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={() => {
          onClose();
          this.handleVideoClose();
        }}
      />
    );
  }
}
