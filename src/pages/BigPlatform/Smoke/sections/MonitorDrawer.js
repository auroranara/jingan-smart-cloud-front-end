import React, { Fragment, PureComponent } from 'react';
import { Row, Col } from 'antd';

import {
  DrawerContainer,
  OvSelect,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import moment from 'moment';
// import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
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
import smokeLost from '../imgs/smoke-lost.png';
// import smokeLost from '../imgs/smoke-lost.png';
import Ellipsis from '@/components/Ellipsis';
import { findFirstVideo } from '@/utils/utils';

const LABELS = ['正常', '火警', '故障', '失联'];
const COLORS = ['55,164,96', '248,51,41', '255,180,0', '159,159,159'];

const OPTIONS = ['全部', '火警', '故障', '失联', '正常'].map((d, i) => ({ value: i, desc: d }));

// const VIDEO_STYLE = {
//   width: '90%',
//   marginLeft: '-43%',
// };

export default class MonitorDrawer extends PureComponent {
  state = {
    videoVisible: false,
    videoKeyId: '',
    statusIndex: 0,
    videoList: [],
  };

  handleClickCamera = videoList => {
    // const {
    //   data: { cameraTree = [] },
    // } = this.props;
    this.setState({
      videoVisible: true,
      videoList: videoList,
      videoKeyId: videoList.length ? findFirstVideo(videoList).id : '',
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
      data: {
        // devList, cameraTree = [],
        unitDetail: { company_name, company_id } = {},
      },
      handleAlarmClick,
      handleFaultClick,
      deviceListData: { list = [] },
    } = this.props;

    const { statusIndex } = this.state;
    const dataList = list.filter(item => {
      const { deviceStatus, workStatus, warnStatus } = item;
      switch (statusIndex) {
        case 0:
          return true;
        case 1:
          if (+warnStatus > 0) return true;
          else return false;
        case 2:
          if (+workStatus === -3) return true;
          else return false;
        case 3:
          if (+deviceStatus === -1) return true;
          else return false;
        case 4:
          if (+workStatus === 0 && +deviceStatus !== -1) return true;
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
              const {
                area,
                location,
                deviceStatusUpdateTime,
                videoList,
                deviceStatus,
                workStatus,
                warnStatus,
                deviceId,
                dataUpdateTime,
              } = item;
              const normalStatus =
                +warnStatus !== 1 &&
                +warnStatus !== 2 &&
                +workStatus !== -3 &&
                +deviceStatus !== -1;
              const lossTime = `发生时间：${moment(deviceStatusUpdateTime).format(
                'YYYY-MM-DD HH:mm:ss'
              )}`;
              const currTime = `发生时间：${moment(dataUpdateTime).format('YYYY-MM-DD HH:mm:ss')}`;
              const devStatus = '设备状态：正常';
              const color =
                +deviceStatus === -1
                  ? '#9f9f9f'
                  : +workStatus === -3
                    ? '#ffb400'
                    : +warnStatus === 1 || +warnStatus === 2
                      ? '#f83329'
                      : '';

              let smokeImg;
              if (+deviceStatus === -1) {
                smokeImg = smokeLost;
              } else if (+warnStatus === 1 || +warnStatus === 2) {
                smokeImg = smokeAlarm;
              } else if (+workStatus === -3) {
                smokeImg = smokeFault;
              } else {
                smokeImg = smokeNormal;
              }
              return (
                <Col span={12} key={index}>
                  <div className={styles.deviceWrapper}>
                    <div className={styles.deviceImg}>
                      <img src={smokeImg} alt="smokeImg" />
                    </div>
                    <div className={styles.infoWrapper}>
                      <div className={styles.position}>
                        <Ellipsis lines={1} tooltip>
                          {area && location
                            ? `${area}：${location}`
                            : area
                              ? area
                              : location
                                ? location
                                : '暂无位置信息'}
                        </Ellipsis>
                      </div>
                      <div className={styles.infos}>
                        <Ellipsis lines={1} tooltip>
                          {+deviceStatus === -1
                            ? lossTime
                            : +workStatus === -3 || +warnStatus === 1 || +warnStatus === 2
                              ? currTime
                              : devStatus}
                        </Ellipsis>
                      </div>
                      <div className={styles.extraWrapper}>
                        {!!videoList.length && (
                          <div
                            className={styles.camraImg}
                            style={{ backgroundImage: `url(${cameraIcon})` }}
                            onClick={e => this.handleClickCamera(videoList)}
                          />
                        )}
                        {(!normalStatus &&
                          +deviceStatus !== -1 &&
                          +workStatus !== 0 &&
                          +workStatus === -3 &&
                          +warnStatus === 2) ||
                        +warnStatus === 1 ? (
                          <div>
                            <span
                              className={styles.status}
                              style={{
                                color: '#f83329',
                                borderColor: '#f83329',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                handleAlarmClick(deviceId, company_id, company_name, 1, undefined);
                              }}
                            >
                              火警
                            </span>
                            <span
                              className={styles.status}
                              style={{
                                color: '#ffb400',
                                borderColor: '#ffb400',
                                cursor: 'pointer',
                                marginLeft: 10,
                              }}
                              onClick={() => {
                                handleFaultClick(deviceId, company_id, company_name, 2, undefined);
                              }}
                            >
                              故障
                            </span>
                          </div>
                        ) : (
                          !normalStatus && (
                            <div
                              className={styles.status}
                              style={{
                                color,
                                borderColor: color,
                                cursor: +deviceStatus !== -1 ? 'pointer' : 'default',
                              }}
                              onClick={() => {
                                (+deviceStatus !== -1 && +warnStatus === 1) || +warnStatus === 2
                                  ? handleAlarmClick(
                                      deviceId,
                                      company_id,
                                      company_name,
                                      1,
                                      undefined
                                    )
                                  : +deviceStatus !== -1 &&
                                    handleFaultClick(
                                      deviceId,
                                      company_id,
                                      company_name,
                                      2,
                                      undefined
                                    );
                              }}
                            >
                              {+deviceStatus === -1
                                ? '失联'
                                : +workStatus === -3
                                  ? '故障'
                                  : +warnStatus === 1 || +warnStatus === 2
                                    ? '火警'
                                    : ''}
                            </div>
                          )
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
          company_name,
          address,
          principal_name,
          principal_phone,
          company_id,
          // normal = 0,
          // unnormal = 0,
          // faultNum = 0,
        } = {},
        // cameraTree = [],
        // dataByCompany,
        // devList,
        // companySmokeInfo: { map: devMap = { unnormal: [], fault: [], normal: [] } },
      },
      handleClose,
      deviceCountChartData: { list: dataByCompany = [] },
      deviceListData: { list = [] },
      units,
    } = this.props;
    const { videoVisible, videoKeyId, videoList, statusIndex } = this.state;

    const filterUnits = units.filter(item => item.companyId === company_id);
    const [{ normal, fault, outContact, unnormal } = {}] = filterUnits;

    const left = (
      <Fragment>
        <div className={styles.info}>
          <p className={styles.name}>{company_name}</p>
          <p>
            <span className={styles.location} style={{ backgroundImage: `url(${locationIcon})` }} />
            {address}
          </p>
          <p>
            <span className={styles.person} style={{ backgroundImage: `url(${personIcon})` }} />
            {(principal_name || principal_phone) &&
              `${principal_name ? principal_name : '未命名'} ${
                principal_phone ? principal_phone : ''
              }`}
          </p>
          <p className={styles.dots}>
            {[normal, unnormal, fault, outContact].map((n, i) => (
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
            {list.length > 0 ? (
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
        <NewVideoPlay
          showList={true}
          videoList={videoList}
          visible={videoVisible}
          keyId={videoKeyId}
          // style={VIDEO_STYLE}
          handleVideoClose={this.handleVideoClose}
          isTree={true}
        />
      </Fragment>
    );

    return (
      <DrawerContainer
        title={'单位监测信息'}
        width={700}
        visible={visible}
        zIndex={1050}
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
