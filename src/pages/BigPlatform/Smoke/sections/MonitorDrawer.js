import React, { Fragment, PureComponent } from 'react';
import { Row, Col } from 'antd';

import {
  DrawerContainer,
  OvSelect,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import moment from 'moment';
import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import { DotItem } from '../components/Components';
import AbnormalChart from '../components/AbnormalChart';
import styles from './MonitorDrawer.less';
import locationIcon from '../imgs/location.png';
import personIcon from '../imgs/person.png';
import cameraIcon from '../imgs/camera.png';
import emptyBg from '../imgs/waterBg.png';
import smokeAlarm from '../imgs/smoke-alarm.png';
import smokeFault from '../imgs/smoke-fault.png';
import smokeNormal from '../imgs/smoke-normal.png';
import Ellipsis from '@/components/Ellipsis';

const LABELS = ['正常', '火警', '故障'];
const COLORS = ['55,164,96', '248,51,41', '255,180,0', '159,159,159'];

const OPTIONS = ['全部', '火警', '故障', '正常'].map((d, i) => ({ value: i, desc: d }));

// const VIDEO_STYLE = {
//   width: '90%',
//   marginLeft: '-43%',
// };

export default class MonitorDrawer extends PureComponent {
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

  renderItems = () => {
    const {
      data: { devList, cameraList = [], unitDetail: { companyName, companyId } = {} },
      handleAlarmClick,
      handleFaultClick,
    } = this.props;
    const { statusIndex } = this.state;
    const dataList = devList.filter(item => {
      const { status } = item;
      switch (statusIndex) {
        case 0:
          return true;
        case 1:
          if (+status > 0) return true;
          else return false;
        case 2:
          if (+status < 0) return true;
          else return false;
        case 3:
          if (+status === 0 || !status) return true;
          else return false;
        default:
          return true;
      }
    });
    return (
      <div className={styles.devScroll}>
        <Row gutter={16}>
          {dataList.length ? (
            dataList.map((item, index) => {
              const { area, location, add_time, status, iotId } = item;
              const occurTime = `发生时间：${moment(add_time).format('YYYY-MM-DD HH:mm:ss')}`;
              const devStatus = '设备状态：正常';
              const color = +status > 0 ? '#f83329' : '#ffb400';
              let smokeImg;
              if (+status > 0) {
                smokeImg = smokeAlarm;
              } else if (+status === 0 || !status) {
                smokeImg = smokeNormal;
              } else {
                smokeImg = smokeFault;
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
                        {!!cameraList.length && (
                          <div
                            className={styles.camraImg}
                            style={{ backgroundImage: `url(${cameraIcon})` }}
                            onClick={e => this.handleClickCamera()}
                          />
                        )}
                        {(+status !== 0 || !status) && (
                          <div
                            className={styles.status}
                            style={{ color, borderColor: color /* cursor: 'pointer' */ }}
                            onClick={() => {
                              +status > 0
                                ? handleAlarmClick(iotId, companyId, companyName, undefined)
                                : handleFaultClick(iotId, companyId, companyName, undefined);
                            }}
                          >
                            {+status > 0 ? '火警' : '故障'}
                          </div>
                        )}
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
      data: {
        unitDetail: {
          companyName,
          address,
          principalName,
          principalPhone,
          normal = 0,
          unnormal = 0,
          faultNum = 0,
        } = {},
        cameraList = [],
        dataByCompany,
        devList,
      },
      handleClose,
    } = this.props;
    const { videoVisible, videoKeyId, statusIndex } = this.state;

    const left = (
      <Fragment>
        <div className={styles.info}>
          <p className={styles.name}>{companyName}</p>
          <p>
            <span className={styles.location} style={{ backgroundImage: `url(${locationIcon})` }} />
            {address}
          </p>
          <p>
            <span className={styles.person} style={{ backgroundImage: `url(${personIcon})` }} />
            {(principalName || principalPhone) &&
              `${principalName ? principalName : '未命名'} ${principalPhone ? principalPhone : ''}`}
          </p>
          <p className={styles.dots}>
            {[normal, unnormal, faultNum].map((n, i) => (
              <DotItem key={i} title={LABELS[i]} color={`rgb(${COLORS[i]})`} quantity={n} />
            ))}
          </p>
        </div>
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>
            <span className={styles.rectIcon} />
            实时监测数据
            <div className={styles.select}>
              <OvSelect
                cssType={1}
                options={OPTIONS}
                value={statusIndex}
                handleChange={this.handleSelectChange}
              />
            </div>
          </h3>
          <div className={styles.section}>
            {devList.length > 0 ? (
              this.renderItems()
            ) : (
              <div className={styles.empty} style={{ backgroundImage: `url(${emptyBg})` }} />
            )}
          </div>
        </div>
        <div className={styles.chartContainer}>
          <h3 className={styles.chartTitle}>
            <span className={styles.rectIcon} />
            异常趋势图
            <span style={{ color: '#4e6692', display: 'inline-block', marginLeft: '10px' }}>
              (最近12个月)
            </span>
          </h3>
          <div className={styles.section}>
            <AbnormalChart noData={dataByCompany.length} data={dataByCompany} />
          </div>
        </div>
        <VideoPlay
          showList={true}
          videoList={cameraList}
          visible={videoVisible}
          keyId={videoKeyId}
          // style={VIDEO_STYLE}
          handleVideoClose={this.handleVideoClose}
        />
      </Fragment>
    );

    return (
      <DrawerContainer
        title={'单位监测信息'}
        width={700}
        visible={visible}
        zIndex={2000}
        left={left}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={() => {
          handleClose();
          this.setState({ statusIndex: 0 });
          this.handleVideoClose();
        }}
      />
    );
  }
}
