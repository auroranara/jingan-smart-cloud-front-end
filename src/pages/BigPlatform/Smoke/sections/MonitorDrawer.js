import React, { Fragment, PureComponent } from 'react';
import { Icon, Row, Col } from 'antd';

import {
  DrawerContainer,
  // DrawerSection,
  OvSelect,
} from '@/pages/BigPlatform/NewFireControl/components/Components';
import moment from 'moment';
import VideoPlay from '@/pages/BigPlatform/NewFireControl/section/VideoPlay';
import { DotItem, Gauge } from '../components/Components';
import AbnormalChart from '../components/AbnormalChart';
import styles from './MonitorDrawer.less';
import locationIcon from '../imgs/location.png';
import personIcon from '../imgs/person.png';
import cameraIcon from '../imgs/camera.png';
import emptyBg from '@/pages/BigPlatform/Monitor/imgs/waterBg.png';
import smokeAlarm from '../imgs/smoke-alarm.png';
import smokeFault from '../imgs/smoke-fault.png';
import smokeNormal from '../imgs/smoke-normal.png';

// const TYPE = 'monitor';
const TEMPERATURE = '温度';
const TITLES = ['单位监测信息', '火警信息'];
const LABELS = ['正常', '火警', '故障'];
const COLORS = ['55,164,96', '248,51,41', '255,180,0', '159,159,159'];
const CHART_LABELS = ['A相温度', 'B相温度', 'C相温度', '零线温度', '漏电电流'];

const OPTIONS = ['全部', '火警', '故障', '正常'].map((d, i) => ({ value: i, desc: d }));

const VIDEO_STYLE = {
  width: '90%',
  marginLeft: '-43%',
};

function DoubleRight(props) {
  return <Icon type="double-right" style={{ color: '#0FF' }} />;
}

export default class MonitorDrawer extends PureComponent {
  state = {
    videoVisible: false,
    videoKeyId: '',
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

  renderItems = () => {
    const item = {
      area: '这里',
      address: '汉江路',
      code: 'value',
      company_id: 'DccBRhlrSiu9gMV7fmvizw',
      device_id: 'mdpiyn35d2hu_fc7',
      principal_name: '李玲',
      condition: '>=',
      company_name: '无锡晶安智慧科技有限公司',
      limit_value: 1,
      location: '那里',
      id: 'qygx203ixbx9m35g',
      principal_phone: '13906184257',
      add_time: 1542855512143,
      status: '2',
    };
    const list = Array(8).fill(item);
    return (
      <div className={styles.devScroll}>
        <Row gutter={16}>
          {list.map((item, index) => {
            const { area, location, add_time, status } = item;
            const occurTime = `发生时间：${moment(add_time).format('YYYY-MM-DD HH:mm:ss')}`;
            const devStatus = '设备状态：正常';
            const color = +status === 2 ? '#f83329' : '#ffb400';
            return (
              <Col span={12}>
                <div key={index} className={styles.deviceWrapper}>
                  <div
                    className={styles.deviceImg}
                    style={{
                      background: `url(${smokeNormal}) no-repeat center center`,
                      backgroundSize: '70% auto',
                    }}
                  />
                  <div className={styles.infoWrapper}>
                    <div className={styles.position}>{`${area}：${location}`}</div>
                    <div className={styles.infos}>{status === 1 ? devStatus : occurTime}</div>
                    <div className={styles.extraWrapper}>
                      <div
                        className={styles.camraImg}
                        style={{ backgroundImage: `url(${cameraIcon})` }}
                        onClick={e => this.handleClickCamera()}
                      />
                      {+status !== 1 && (
                        <div className={styles.status} style={{ color, borderColor: color }}>
                          {+status === 2 ? '火警' : '故障'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  };

  render() {
    const {
      visible,
      titleIndex,
      data: {
        unitDetail: {
          companyName,
          address,
          aqy1Name,
          aqy1Phone,
          normal = 0,
          unnormal = 0,
          faultNum = 0,
        } = {},
        devices = [],
        deviceRealTimeData: { deviceId = undefined, deviceDataForAppList = [] },
        deviceConfig = [],
        deviceHistoryData,
        cameraList = [],
      },
      handleSelect,
      handleClose,
      // handleClickCamera,
    } = this.props;
    const { videoVisible, videoKeyId } = this.state;

    console.log(videoKeyId);

    // 实时数据列表
    const list = [];
    deviceDataForAppList.forEach(({ desc, code, value, unit, status }) => {
      const index = CHART_LABELS.indexOf(desc);
      if (index > -1) {
        const limit = [null, null];
        deviceConfig.forEach(({ code: code2, level, limitValue }) => {
          if (code2 === code) {
            limit[level - 1] = limitValue;
          }
        });
        list[index] = {
          desc,
          value,
          unit,
          limit,
          status,
        };
      }
    });

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
            {(aqy1Name || aqy1Phone) &&
              `${aqy1Name ? aqy1Name : '未命名'} ${aqy1Phone ? aqy1Phone : ''}`}
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
              <OvSelect cssType={1} options={OPTIONS} value={0} handleChange={this.handleSelect} />
            </div>
          </h3>
          <div className={styles.section}>{this.renderItems()}</div>
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
            <AbnormalChart
              noData={devices.length}
              data={{
                deviceHistoryData,
                deviceConfig,
              }}
            />
          </div>
        </div>
        <VideoPlay
          showList={false}
          videoList={cameraList}
          visible={videoVisible}
          keyId={videoKeyId}
          style={VIDEO_STYLE}
          handleVideoClose={this.handleVideoClose}
        />
      </Fragment>
    );

    return (
      <DrawerContainer
        title={'单位监测信息'}
        width={700}
        visible={visible}
        left={left}
        placement="right"
        rowStyle={{ height: 'calc(100% - 70px)' }}
        onClose={handleClose}
      />
    );
  }
}
