import React, { PureComponent } from 'react';
import { Row, Col, Modal, Table, Pagination } from 'antd'
import WaterWave from 'components/Charts/ScoreWaterWave';
import styles from './TopCenter.less'
import { connect } from 'dva'
// import classNames from 'classnames';

import abnormalDevice from '../../../../assets/abnormal-device.png'
import deviceTotalNumber from '../../../../assets/device-total-number.png'
import missingDevice from '../../../../assets/missing-device.png'
import fireHost from '../imgs/fire-host.png'
import arrow from '../imgs/arrow.png'
import redCircle from '../imgs/redCircle.png'
import blueCircle from '../imgs/blueCircle.png'
import SignalAnime from '../Components/SignalAnime'
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
const hDivider = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/split_h.png'
const divider = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/split.png'

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
    render: (text, record) => (
      <Ellipsis lines={1}>
        {text}
      </Ellipsis>
    ),
  },
  {
    title: '区域位置',
    key: 'areaLocation',
    align: 'center',
    render: (text, record) => (
      <span>{`${record.area}:${record.location}`}</span>
    ),
    width: 190,
  },
]
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
      <span>{`${record.area}:${record.location}`}</span>
    ),
  },
  {
    title: '发生时间',
    key: 'statusTime',
    dataIndex: 'statusTime',
    align: 'center',
    render: (text) => (
      <span>{text ? moment(text).format('YYYY-MM-DD hh-mm') : '暂无数据'}</span>
    ),
  },
]

@connect(({ monitor, errorDevicesLoading, loading }) => ({
  monitor,
  errorDevicesLoading: loading.effects['monitor/fetchErrorDevices'],
}))
export default class TopCenter extends PureComponent {

  state = {
    modalTitle: '',
    modalVisible: false,
  }


  // 打开弹窗
  handleViewModal = (title) => {
    const { fetchErrorDevices } = this.props
    fetchErrorDevices(title === "报警设备" ? 2 : 0)
    this.setState({
      modalTitle: title,
      modalVisible: true,
    })
  }

  // 关闭弹窗
  handleModalClose = () => {
    this.setState({
      modalVisible: false,
    })
  }

  // 处理分页
  handlePageChange = (pageNum, pageSize) => {
    const { dispatch } = this.props
    dispatch({
      type: 'monitor/handleDevicesPagination',
      payload: { pageNum },
    })
  }

  handleAfterClose = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'monitor/saveErrorDevices',
      payload: [],
    })
  }

  // 渲染报警设备、失联设备弹窗
  renderModal = () => {
    const { modalTitle, modalVisible } = this.state
    const { errorDevice: { errorDevicesByPage, pageNum, total, pageSize }, errorDevicesLoading } = this.props
    const pages = total % pageSize === 0 ? total / pageSize : (Math.round(total / pageSize) + 1)
    const title = (
      <div className={styles.modalTitle}>
        <div className={styles.sectionTitleIcon}></div>
        <span>{modalTitle}</span>
        <div className={styles.sectionTotal}>
          <span>共计</span>
          <span className={modalTitle === '报警设备' ? styles.red : styles.yellow}>{total}</span>
          <span>个</span>
        </div>
      </div>
    )

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
          <div><span className={styles.pagesText}>每页{pageSize}行，共计{pages}页</span></div>
          <Pagination
            current={pageNum}
            total={total}
            onChange={this.handlePageChange}
          />
        </div>
      </Modal>
    )
  }

  // 渲染分割线
  renderDivider = (src) => {
    return (
      <div className={styles.divider} style={{
        backgroundImage: `url(${src})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: '100% 100%',
      }}>
      </div>
    )
  }

  // 渲染报警设备和失联设备
  renderMonitor = (src, title, number, color) => {

    return (
      <div className={styles.section} onClick={() => { this.handleViewModal(title) }}>
        <div className={styles.leftImg}
          style={{
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: '68% 75%',
          }}>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.title}>{title}</div>
          <div className={styles.number}>
            <span className={styles[color]}>{number}</span>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { countAndExponent: { score, count, outContact, unnormal }, fireAlarmSystem: { fire_state, fault_state } } = this.props


    return (
      <Col span={13} style={{ height: '100%' }} className={styles.topCenter}>
        {/* 监测指数 */}
        <Col span={12} style={{ height: '100%', padding: '0 6px' }}>
          <div className={styles.sectionMain}>
            <div className={styles.shadowIn}>
              <div className={styles.topTitle}>监测指数</div>
              <div className={styles.monitorContent}>
                <div className={styles.waterWave}>
                  {score && (
                    < WaterWave
                      color={((!!unnormal || score < 80) && "#FF5256") || "#0082FD"}
                      percentColor="white"
                      percentFontSize="48px"
                      percent={score}
                      isNumber={true}
                    />)}
                </div>
                {this.renderDivider(hDivider)}
                <div className={styles.totalNum}>
                  <div className={styles.totalImg}
                    style={{
                      backgroundImage: `url(${deviceTotalNumber})`,
                      backgroundRepeat: 'no-repeat',
                      groundPosition: 'center center',
                      backgroundSize: '100% 100%',
                    }}
                  ></div>
                  <div className={styles.title}><span className={styles.text}>设备总数</span></div>
                  <div className={styles.number}><span className={styles.text}>{count}</span></div>
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
        <Col span={12} style={{ height: '100%', padding: '0 6px' }}>
          <div className={styles.sectionMain}>
            < div className={styles.shadowIn}>
              <div className={styles.topTitle}>
                <div className={styles.sectionTitleIcon}></div>
                火灾自动报警监测
                      </div>
              <div className={styles.monitorContent}>
                <div className={styles.iconContainer}>
                  <div className={styles.fireHost}
                    style={{
                      backgroundImage: `url(${fireHost})`,
                      backgroundRepeat: 'no-repeat',
                      groundPosition: 'center center',
                      backgroundSize: '100% 100%',
                    }}>
                  </div>
                  <span className={styles.span}>（消防主机）</span>
                  <div className={styles.anime}>
                    <SignalAnime />
                  </div>
                </div>
                <div className={styles.arrContainer}>
                  <div className={styles.arrow}
                    style={{
                      backgroundImage: `url(${arrow})`,
                      backgroundRepeat: 'no-repeat',
                      groundPosition: 'center center',
                      backgroundSize: '100% 100%',
                    }}>
                  </div>
                  <span className={styles.fireText}>监测火警数</span>
                  <span className={styles.errorText}>监测故障树</span>
                </div>
                <div className={styles.numberContainer}>
                  <div className={styles.circle}
                    style={{
                      backgroundImage: `url(${redCircle})`,
                      backgroundRepeat: 'no-repeat',
                      groundPosition: 'center center',
                      backgroundSize: '100% 100%',
                    }}
                  >
                    <span style={{ color: '#E46867' }} className={styles.number}>{fire_state}</span>
                  </div>
                  <div className={styles.circle}
                    style={{
                      backgroundImage: `url(${blueCircle})`,
                      backgroundRepeat: 'no-repeat',
                      groundPosition: 'center center',
                      backgroundSize: '100% 100%',
                    }}
                  >
                    <span style={{ color: '#07A4F9' }} className={styles.number}>{fault_state}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        {this.renderModal()}
      </Col>
    )
  }
}
