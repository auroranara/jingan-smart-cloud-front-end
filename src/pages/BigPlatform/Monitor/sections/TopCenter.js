import React, { PureComponent } from 'react';
import { Col, Modal, Table, Pagination, Tooltip } from 'antd';
import WaterWave from 'components/Charts/ScoreWaterWave';
import styles from './TopCenter.less';
import { connect } from 'dva';
// import classNames from 'classnames';

import abnormalDevice from '@/assets/abnormal-device.png';
import deviceTotalNumber from '@/assets/device-total-number.png';
import missingDevice from '@/assets/missing-device.png';
import fireHost from '../imgs/fire-host.png';
import smokeIcon from '../imgs/smokeIcon.png';
import redDot from '../imgs/redDot.png';
import SignalAnime from '../components/SignalAnime';
import SmokeStatusLabel from '../components/SmokeStatusLabel';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
const hDivider = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/split_h.png';
const divider = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/split.png';

const alarmColumns = [
  {
    title: '设备号',
    key: 'relationDeviceId',
    dataIndex: 'relationDeviceId',
    align: 'center',
    width: 200,
  },
  {
    title: '报警类型',
    key: 'typeName',
    dataIndex: 'typeName',
    align: 'center',
    width: 160,
    render: (val) => (<span>{val === '储罐监测/水系统监测' ? '储罐监测' : val}</span>),
  },
  {
    title: '报警参数',
    key: 'unormalParams',
    dataIndex: 'unormalParams',
    align: 'center',
    render: (text, record) => (
      <Ellipsis lines={1} tooltip>
        {text}
      </Ellipsis>
    ),
  },
  {
    title: '区域位置',
    key: 'areaLocation',
    align: 'center',
    render: (text, record) => (
      <span>
        {record.area}
        {record.area && record.location && '：'}
        {record.location}
      </span>
    ),
    width: 190,
  },
];
const missingColumns = [
  {
    title: '设备号',
    key: 'relationDeviceId',
    dataIndex: 'relationDeviceId',
    align: 'center',
  },
  {
    title: '区域位置',
    key: 'areaLocation',
    align: 'center',
    render: (text, record) => (
      <span>
        {record.area}
        {record.area && record.location && '：'}
        {record.location}
      </span>
    ),
  },
  {
    title: '发生时间',
    key: 'statusTime',
    dataIndex: 'statusTime',
    align: 'center',
    render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm') : '暂无数据'}</span>,
  },
];

// 独立烟感状态
const LOSS = 0; //失联
const NORMAL = 1; //正常
const ABNORMAL = 2; // 异常
const ALL = 3; // 全部

const STATUSES = [-1, 0, 2];

const smokeColumns = [
  {
    title: '设备号',
    key: 'relationDeviceId',
    dataIndex: 'relationDeviceId',
    align: 'center',
  },
  {
    title: '设备状态',
    key: 'status',
    dataIndex: 'status',
    align: 'center',
    width: 160,
    render: (val, { deviceStatus = null, workStatus = null, workStatusName = null }) => {
      return +deviceStatus === -1
        ? '故障(失联)'
        : (+workStatus === -3 && +deviceStatus === 1) || (+workStatus === -3 && +deviceStatus === 2)
          ? `故障(${workStatusName})、火警`
          : +deviceStatus === 1 || +deviceStatus === 2
            ? '火警'
            : +workStatus === -3
              ? `故障(${workStatusName})`
              : +deviceStatus === 0 && '正常';
    },
  },
  {
    title: '区域位置',
    key: 'areaLocation',
    dataIndex: 'areaLocation',
    align: 'center',
    render: (text, record) => (
      <span>
        {record.area}
        {record.area && record.location && '：'}
        {record.location}
      </span>
    ),
  },
  {
    title: '发生时间',
    key: 'addTime',
    dataIndex: 'addTime',
    align: 'center',
    render: (text, val) => (
      <span>
        {+val.status === 0
          ? val.statusTime
            ? moment(val.statusTime).format('YYYY-MM-DD HH:mm:ss')
            : '暂无数据'
          : text
            ? moment(text).format('YYYY-MM-DD HH:mm:ss')
            : '暂无数据'}
      </span>
    ),
  },
];

@connect(({ monitor, errorDevicesLoading, loading }) => ({
  monitor,
  errorDevicesLoading: loading.effects['monitor/fetchErrorDevices'],
  smokeListLoding: loading.effects['monitor/fetchSmokeList'],
}))
export default class TopCenter extends PureComponent {
  state = {
    modalTitle: '',
    modalVisible: false,
    smokeModalVisible: false,
    status: '',
  };

  // 打开弹窗
  handleViewModal = title => {
    const { fetchErrorDevices } = this.props;
    fetchErrorDevices(title === '报警设备' ? 2 : 0);
    this.setState({
      modalTitle: title,
      modalVisible: true,
    });
  };

  // 关闭弹窗
  handleModalClose = () => {
    this.setState({
      modalVisible: false,
    });
  };

  // 处理分页
  handlePageChange = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/handleDevicesPagination',
      payload: { pageNum },
    });
  };

  handleAfterClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/saveErrorDevices',
      payload: [],
    });
  };

  // 打开烟感弹窗
  handleSmokeModal = status => {
    const { dispatch, companyId } = this.props;
    const sts = {};
    sts.status = STATUSES[status];
    dispatch({
      type: 'monitor/fetchSmokeList',
      payload: {
        companyId,
        deviceType: 6,
        ...sts,
      },
    });
    this.setState({ smokeModalVisible: true, status: status });
  };

  // 处理分页
  handleSomkePageChange = pageNum => {
    const { dispatch } = this.props;
    dispatch({
      type: 'monitor/handleSmokeListPagination',
      payload: { pageNum },
    });
  };

  // 处理烟感状态按钮
  handleLabelOnClick = s => {
    const { dispatch, companyId } = this.props;
    const sts = {};
    if (+s !== 3) sts.status = STATUSES[s];
    dispatch({
      type: 'monitor/fetchSmokeList',
      payload: {
        companyId,
        deviceType: 6,
        ...sts,
      },
    });

    this.setState({
      status: s,
    });
  };

  // 关闭烟感弹出框
  handleSmokeModalClose = () => {
    this.setState({
      smokeModalVisible: false,
    });
  };

  // 渲染烟感监测弹出框
  renderSmokeModal = () => {
    const {
      smokeList: { smokeListByPage, pageNum, total, pageSize },
      smokeListLoding,
      smokeCountData,
    } = this.props;
    const { smokeModalVisible, status } = this.state;
    const {
      count: totals = 0,
      normal = 0,
      unnormal: abnormal = 0,
      outContact: loss = 0,
    } = smokeCountData;

    const page = total % pageSize === 0 ? total / pageSize : Math.floor(total / pageSize) + 1;
    const statusTotal = [totals, normal, abnormal, loss];
    const nums = [ALL, NORMAL, ABNORMAL, LOSS].map((status, index) => [status, statusTotal[index]]);

    const title = (
      <div className={styles.modalTitle}>
        <div className={styles.sectionTitleIcon} />
        <span>设备列表-独立烟感</span>
      </div>
    );

    return (
      <Modal
        className={styles.modalContainer}
        width={850}
        title={title}
        visible={smokeModalVisible}
        onCancel={this.handleSmokeModalClose}
        footer={false}
      >
        <div className={styles.labelContainer}>
          {nums.map(([s, n]) => (
            <SmokeStatusLabel
              key={s}
              num={n}
              status={s}
              selected={status === s}
              onClick={() => this.handleLabelOnClick(s)}
            />
          ))}
        </div>
        <Table
          rowKey="deviceId"
          columns={smokeColumns}
          dataSource={smokeListByPage}
          pagination={false}
          loading={smokeListLoding}
        />
        {smokeListByPage &&
          smokeListByPage.length > 0 && (
            <div className={styles.footer}>
              <div>
                <span className={styles.pagesText}>
                  每页
                  {pageSize}
                  行，共计
                  {page}页
                </span>
              </div>
              <Pagination current={pageNum} total={total} onChange={this.handleSomkePageChange} />
            </div>
          )}
      </Modal>
    );
  };

  // 渲染报警设备、失联设备弹窗
  renderModal = () => {
    const { modalTitle, modalVisible } = this.state;
    const {
      errorDevice: { errorDevicesByPage, pageNum, total, pageSize },
      errorDevicesLoading,
    } = this.props;

    const pages = total % pageSize === 0 ? total / pageSize : Math.floor(total / pageSize) + 1;

    const title = (
      <div className={styles.modalTitle}>
        <div className={styles.sectionTitleIcon} />
        <span>{modalTitle}</span>
        <div className={styles.sectionTotal}>
          <span>共计</span>
          <span className={modalTitle === '报警设备' ? styles.red : styles.yellow}>{total}</span>
          <span>个</span>
        </div>
      </div>
    );

    return (
      <Modal
        className={styles.modalContainer}
        width={850}
        title={title}
        visible={modalVisible}
        onCancel={this.handleModalClose}
        footer={false}
        afterClose={this.handleAfterClose}
      >
        <Table
          rowKey="deviceId"
          columns={modalTitle === '报警设备' ? alarmColumns : missingColumns}
          dataSource={errorDevicesByPage}
          loading={errorDevicesLoading}
          pagination={false}
        />
        <div className={styles.footer}>
          <div>
            <span className={styles.pagesText}>
              每页
              {pageSize}
              行，共计
              {pages}页
            </span>
          </div>
          <Pagination current={pageNum} total={total} onChange={this.handlePageChange} />
        </div>
      </Modal>
    );
  };

  // 渲染分割线
  renderDivider = src => {
    return (
      <div
        className={styles.divider}
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: '100% 100%',
        }}
      />
    );
  };

  // 渲染报警设备和失联设备
  /* renderMonitor = (src, title, number, color) => {
    return (
      <div
        className={styles.section}
        onClick={() => {
          this.handleViewModal(title);
        }}
      >
        <div
          className={styles.leftImg}
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: '68% 75%',
          }}
        />
        <div className={styles.rightContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.number}>
            <span className={styles[color]}>{number}</span>
          </div>
        </div>
      </div>
    );
  }; */

  renderDeviceSection = ({ img, title, num, color, isHover }) => {
    return (
      <Col
        span={8}
        className={styles.section}
        style={{ cursor: isHover ? 'pointer' : 'inherit' }}
        onClick={
          isHover
            ? () => {
              this.handleViewModal(title);
            }
            : null
        }
      >
        <div
          className={styles.leftImg}
          style={{
            backgroundImage: `url(${img})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: '50% 40%',
          }}
        />
        <div className={styles.rightContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.number}>
            <span className={styles[color]}>{num}</span>
          </div>
        </div>
      </Col>
    );
  };

  render() {
    const {
      countAndExponent: { score, count, outContact, unnormal },
      fireAlarmSystem: { fire_state, fault_state },
      smokeCountData,
    } = this.props;
    const {
      count: total = 0,
      normal = 0,
      unnormal: abnormal = 0,
      outContact: loss = 0,
    } = smokeCountData;

    const waveHeight = window.document.body.scrollHeight < 680 ? 65 : 105;

    return (
      <Col span={13} style={{ height: '100%' }} className={styles.topCenter}>
        {/* 设备统计 */}
        <Col span={24} style={{ height: '35%', padding: '0' }}>
          <div className={styles.deviceStatistics}>
            <div className={styles.shadowIn}>
              {this.renderDeviceSection({
                img: deviceTotalNumber,
                title: '设备总数',
                num: count,
                color: 'blue',
                isHover: false,
              })}
              {this.renderDeviceSection({
                img: abnormalDevice,
                title: '报警设备',
                num: unnormal,
                color: 'red',
                isHover: true,
              })}
              {this.renderDeviceSection({
                img: missingDevice,
                title: '故障设备',
                num: outContact,
                color: 'yellow',
                isHover: true,
              })}
            </div>
          </div>
        </Col>

        {/* 监测指数 */}
        {/* <Col span={12} style={{ height: '100%', padding: '0 6px' }}>
          <div className={styles.sectionMainMonitor}>
            <div className={styles.shadowIn}>
              <div className={styles.topTitle}>监测指数</div>
              <div className={styles.monitorContent}>
                <div className={styles.waterWave}>
                  {(score || score === 0) && (
                    <WaterWave
                      color={((!!unnormal || score < 80) && '#FF5256') || '#0082FD'}
                      percentColor="white"
                      percentFontSize="48px"
                      percent={score}
                      isNumber={true}
                      height={waveHeight}
                    />
                  )}
                </div>
                {this.renderDivider(hDivider)}
                <div className={styles.totalNum}>
                  <div
                    className={styles.totalImg}
                    style={{
                      backgroundImage: `url(${deviceTotalNumber})`,
                      backgroundRepeat: 'no-repeat',
                      groundPosition: 'center center',
                      backgroundSize: '100% 100%',
                    }}
                  />
                  <div className={styles.title}>
                    <span className={styles.text}>设备总数</span>
                  </div>
                  <div className={styles.number}>
                    <span className={styles.text}>{count}</span>
                  </div>
                </div>
                {this.renderDivider(hDivider)}
                <div className={styles.errorDevice}>
                  {this.renderMonitor(abnormalDevice, '报警设备', unnormal, 'red')}
                  {this.renderDivider(divider)}
                  {this.renderMonitor(missingDevice, '失联设备', outContact, 'yellow')}
                </div>
              </div>
            </div>
          </div>
        </Col> */}

        {/* 消防主机监测 */}
        <Col span={12} style={{ height: '65%', padding: '12px 6px 0 0' }}>
          <div className={styles.sectionMain}>
            <div className={styles.shadowIn}>
              <div className={styles.topTitle}>
                <div className={styles.sectionTitleIcon} />
                消防主机监测
              </div>
              <div className={styles.fireMain}>
                <div
                  className={styles.fireHost}
                  style={{
                    backgroundImage: `url(${fireHost})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '30% 45%',
                  }}
                >
                  <div className={styles.anime}>
                    <SignalAnime />
                  </div>
                </div>
                <div className={styles.arrContainer}>
                  <div className={styles.line}>
                    <Tooltip
                      placement="right"
                      overlayClassName={styles.tooltip}
                      title="有探测器等报警设备报警检测到火警信号。"
                    >
                      <span className={styles.fireHover}>火警</span>
                    </Tooltip>
                    <span className={styles.fireCount}>{fire_state}</span>
                  </div>
                  <div className={styles.line}>
                    <Tooltip
                      placement="right"
                      overlayClassName={styles.tooltip}
                      title="表示控制器检测到外部探测器或模块有故障，提示用户立即对控制器进行修复。"
                    >
                      <span className={styles.errorHover}>故障</span>
                    </Tooltip>
                    <span className={styles.errorCount}>{fault_state}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* 独立烟感预报警监测 */}
        <Col span={12} style={{ height: '65%', padding: '12px 0 0 6px' }}>
          <div className={styles.sectionMain}>
            <div className={styles.shadowIn}>
              <div className={styles.topTitle}>
                <div className={styles.sectionTitleIcon} />
                独立烟感报警监测
              </div>
              <div className={styles.smokeMain}>
                <div
                  className={styles.iconSmoke}
                  style={{
                    backgroundImage: `url(${smokeIcon})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '50% 40%',
                  }}
                >
                  <div className={styles.total}>
                    <span>设备数 {total}</span>
                  </div>
                  <div
                    className={styles.dot}
                    style={{ backgroundImage: `url(${redDot})`, backgroundSize: '15% 15%' }}
                  />
                </div>
                <div className={styles.smokeCount}>
                  {/* <p className={styles.device}>
                    设备总数 <span className={styles.deviceCount}>{total}</span>
                  </p> */}
                  <div className={styles.normal} onClick={() => this.handleSmokeModal(NORMAL)}>
                    正常 <span className={styles.normalCount}>{normal}</span>
                  </div>
                  <div className={styles.unusual} onClick={() => this.handleSmokeModal(ABNORMAL)}>
                    火警 <span className={styles.unusualCount}>{abnormal}</span>
                  </div>
                  <div className={styles.missing} onClick={() => this.handleSmokeModal(LOSS)}>
                    故障 <span className={styles.missingCount}>{loss}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        {this.renderModal()}
        {this.renderSmokeModal()}
      </Col>
    );
  }
}
