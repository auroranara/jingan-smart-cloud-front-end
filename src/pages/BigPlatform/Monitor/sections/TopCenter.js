import React, { PureComponent } from 'react';
import { Col, Modal, Table, Pagination, Form, Button } from 'antd';
import WaterWave from 'components/Charts/ScoreWaterWave';
import styles from './TopCenter.less';
import { connect } from 'dva';
// import classNames from 'classnames';

import abnormalDevice from '../../../../assets/abnormal-device.png';
import deviceTotalNumber from '../../../../assets/device-total-number.png';
import missingDevice from '../../../../assets/missing-device.png';
import fireHost from '../imgs/fire-host.png';
import smokeIcon from '../imgs/smokeIcon.png';
import redDot from '../imgs/redDot.png';
import SignalAnime from '../Components/SignalAnime';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
const hDivider = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/split_h.png';
const divider = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/split.png';

const FormItem = Form.Item;

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
  },
  {
    title: '报警参数',
    key: 'unormalParams',
    dataIndex: 'unormalParams',
    align: 'center',
    render: (text, record) => <Ellipsis lines={1}>{text}</Ellipsis>,
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
    render: text => <span>{text ? moment(text).format('YYYY-MM-DD hh:mm') : '暂无数据'}</span>,
  },
];

const smokeColumns = [
  {
    title: '监测模块',
    key: 'modal',
    dataIndex: 'modal',
    align: 'center',
  },
  {
    title: '设备号',
    key: '11',
    dataIndex: '11',
    align: 'center',
  },
  {
    title: '设备状态',
    key: '22',
    dataIndex: '22',
    align: 'center',
  },
  {
    title: '区域位置',
    key: '33',
    dataIndex: '33',
    align: 'center',
  },
  {
    title: '发生时间',
    key: '44',
    dataIndex: '44',
    align: 'center',
  },
];

@connect(({ monitor, errorDevicesLoading, loading }) => ({
  monitor,
  errorDevicesLoading: loading.effects['monitor/fetchErrorDevices'],
}))
export default class TopCenter extends PureComponent {
  state = {
    modalTitle: '',
    modalVisible: false,
    smokeModalVisible: false,
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
  handleSmokeModal = () => {
    this.setState({ smokeModalVisible: true });
  };

  // 关闭烟感弹出框
  handleSmokeModalClose = () => {
    this.setState({
      smokeModalVisible: false,
    });
  };

  // 渲染烟感监测弹出框
  renderSmokeModal = () => {
    const { smokeModalVisible } = this.state;
    console.log('11', smokeModalVisible);
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
        <Form layout="inline" style={{ marginBottom: '10px' }}>
          <Col>
            <FormItem>
              <Button ghost onClick={this.handleSmokeAll}>
                全部-10
              </Button>
            </FormItem>
            <FormItem>
              <Button ghost onClick={this.handleSmokeAll}>
                正常-10
              </Button>
            </FormItem>
            <FormItem>
              <Button ghost onClick={this.handleSmokeAll}>
                报警-10
              </Button>
            </FormItem>
            <FormItem>
              <Button ghost onClick={this.handleSmokeAll}>
                失联-10
              </Button>
            </FormItem>
          </Col>
        </Form>
        <Table rowKey="id" columns={smokeColumns} pagination={false} />
        <div className={styles.footer} />
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
    const pages = total % pageSize === 0 ? total / pageSize : Math.round(total / pageSize) + 1;
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
  renderMonitor = (src, title, number, color) => {
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
    return (
      <Col span={13} style={{ height: '100%' }} className={styles.topCenter}>
        {/* 监测指数 */}
        <Col span={12} style={{ height: '100%', padding: '0 6px' }}>
          <div className={styles.sectionMain}>
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
                      height={105}
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
        </Col>
        {/* 火灾自动报警监测 */}
        <Col span={12} style={{ height: '49%', padding: '0px 6px' }}>
          <div className={styles.sectionMain}>
            <div className={styles.shadowIn}>
              <div className={styles.topTitle}>
                <div className={styles.sectionTitleIcon} />
                火灾自动报警监测
              </div>
              <div className={styles.fireMain}>
                <div
                  className={styles.fireHost}
                  style={{
                    backgroundImage: `url(${fireHost})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '35% 60%',
                  }}
                />
                <div className={styles.anime}>
                  <SignalAnime />
                </div>
                <div className={styles.arrContainer}>
                  <p>
                    火警 <span className={styles.fireCount}>{fault_state}</span>
                  </p>
                  <p onClick={this.handleSmokeModal}>
                    故障 <span className={styles.errorCount}>{fire_state}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Col>

        {/* 独立烟感预报警监测 */}
        <Col span={12} style={{ height: '49%', margin: '7px 0 0 0', padding: '0px 6px' }}>
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
                    backgroundSize: '60% 65%',
                  }}
                >
                  <div
                    className={styles.dot}
                    style={{ backgroundImage: `url(${redDot})`, backgroundSize: '15% 15%' }}
                  />
                </div>
                <div className={styles.smokeCount}>
                  <p className={styles.device}>
                    设备总数 <span className={styles.deviceCount}>{total}</span>
                  </p>
                  <p className={styles.normal} onClick={this.handleSmokeModal}>
                    正常 <span className={styles.normalCount}>{normal}</span>
                  </p>
                  <p className={styles.unusual} onClick={this.handleSmokeModal}>
                    异常 <span className={styles.unusualCount}>{abnormal}</span>
                  </p>
                  <p className={styles.missing} onClick={this.handleSmokeModal}>
                    失联 <span className={styles.missingCount}>{loss}</span>
                  </p>
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
