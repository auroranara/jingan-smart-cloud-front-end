import { Component, Fragment } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  Radio,
  DatePicker,
  TreeSelect,
  Upload,
  Icon,
  Tooltip,
  Table,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import moment from 'moment';
import { armStatusEnum } from '@/utils/dict';
import styles from './RealTimeData.less';

import logoLocation from '@/assets/logo-location.svg';

const title = '实时数据'
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };
// 图标样式
const statusStyle = [
  {},  // 蓝色
  { filter: 'hue-rotate(190deg)' }, // 橙色
  { filter: 'invert(1) hue-rotate(-20deg)' }, // 红色
  { filter: 'grayscale(1)' }, // 灰色
];
// 数字颜色（与图标颜色相对应）
const numColor = ['rgb(48,179,233)', 'rgb(247,137,67)', 'rgb(227,66,63)', 'rgb(155,155,155)'];
const logoItemWrapper = {
  sm: 12,
  md: 8,
  lg: 6,
}
const descWrapper = {
  sm: 24,
  md: 12,
  lg: 8,
}

@connect(({ device }) => ({
  device,
}))
export default class RealTimeData extends Component {

  constructor(props) {
    super(props)
    this.timer = null
  }

  componentDidMount() {
    this.fetchRealTimeData()
    this.timer = setInterval(() => {
      this.fetchRealTimeData()
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  /**
   * 获取传感器实时数据
   */
  fetchRealTimeData = () => {
    const {
      dispatch,
      match: { params: { id } },
    } = this.props
    dispatch({
      type: 'device/fetchRealTimeData',
      payload: { id },
    })
  }

  formatTime = (time, formatter = 'YYYY-MM-DD HH:mm:ss') => moment(time).format(formatter)

  /**
   * 实时数据表格
   */
  renderRealTimeDataTable = () => {
    const {
      device: {
        realTimeData: {
          linkStatus = null,
          sensorMonitorParamList: list = [],
        } = {},
      },
    } = this.props
    const columns = [
      {
        title: '编码',
        dataIndex: 'paramCode',
        align: 'center',
      },
      {
        title: '名称',
        dataIndex: 'paramDesc',
        align: 'center',
      },
      {
        title: '实时值',
        dataIndex: 'code',
        align: 'center',
        render: (val, { realValue, paramUnit }) => (<span>{typeof realValue === 'number' ? realValue + paramUnit : '——'}</span>),
      },
      {
        title: '实时状态',
        dataIndex: 'status',
        align: 'center',
        render: (val) => (
          <span>{(val === 0 && '正常') || (val === 1 && '预警') || (val === 2 && '告警') || '未知'} </span>
        ),
      },
    ]
    return linkStatus === 0 ? (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        bordered
        pagination={false}
      />
    ) : '暂无数据'
  }


  /**
   * 渲染故障状态表
   */
  renderStatusTable = () => {
    const {
      device: {
        realTimeData: {
          faultStatusList: list = [],
        } = {},
      },
    } = this.props
    const columns = [
      {
        title: '故障类型',
        dataIndex: 'faultTypeName',
        align: 'center',
      },
      {
        title: '发生时间',
        dataIndex: 'happenTime',
        align: 'center',
        render: (val) => (<span>{val ? this.formatTime(val) : ''}</span>),
      },
    ]
    return list.length ? (
      <Table
        rowKey="id"
        columns={columns}
        dataSource={list}
        bordered
        pagination={false}
      />
    ) : '暂无数据'
  }

  render() {
    const {
      device: {
        realTimeData: {
          linkStatus, // 连接状态 -1 失联 0正常 null未知
          dataUpdateTime, // 更新时间
          linkStatusUpdateTime, // 失联时间
          code,
          companyName,
          pointAreaLocation, // 地址
          faultStatus, // 运行状态
          faultStatusList = [], // 故障列表
          sensorMonitorParamList = [],
          armStatus, // {String} 机械臂状态
        } = {},
      },
    } = this.props;
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title: '传感器管理', name: '传感器管理', href: '/device-management/new-sensor/list' },
      { title, name: title },
    ];
    // 联网状态、运行状态
    const linkLabel = (linkStatus === -1 && `失联（${this.formatTime(linkStatusUpdateTime)}）`) || (linkStatus === 0 && '在线') || '未知';
    const runningLabel = (faultStatus === -1 && '故障') || (faultStatus === 0 && '正常') || '未知';

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <div className={styles.realTimeContainer}>
          <Card>
            <Form>
              <h3>{code ? `${code}——` : ''}{companyName || ''}</h3>
              <Row className={styles.line}>
                <img alt="" src={logoLocation} width="14" height="14" />
                <span>{pointAreaLocation || '暂无点位地址'}</span>
              </Row>
              <Row className={styles.line}>
                <Col {...descWrapper}>
                  <span> 联网状态：{linkLabel}</span>
                </Col>
                <Col {...descWrapper}>
                  <span>运行状态：</span>
                  <span className={faultStatus === -1 ? styles.red : null}>{runningLabel}</span>
                </Col>
              </Row>
              {armStatus && (
                <Row className={styles.line}>
                  <span>机械臂状态：{armStatusEnum[armStatus]}</span>
                </Row>
              )}
              {faultStatusList.length > 0 && (
                <Fragment>
                  <h4>当前故障</h4>
                  {faultStatusList.map(({ faultTypeName, happenTime }, index) => (
                    <Row key={index} className={styles.line}>
                      <Col {...descWrapper}>
                        <span> 故障描述：{faultTypeName}</span>
                      </Col>
                      <Col {...descWrapper}>
                        <span>时间：{this.formatTime(happenTime)}</span>
                      </Col>
                    </Row>
                  ))}
                </Fragment>
              )}
            </Form>
          </Card>

          <Card style={{ marginTop: '24px' }}>
            <h3>实时监测</h3>
            <Row className={styles.line}>
              <span> 数据更新时间：{dataUpdateTime ? this.formatTime(dataUpdateTime) : '暂无数据'}</span>
            </Row>
            {linkStatus === 0 ? (
              <Row className={styles.line} gutter={10}>
                {sensorMonitorParamList.map(({ fixType, logoWebUrl, paramDesc, paramUnit, realValue, status }, index) => (
                  <Col key={index} {...logoItemWrapper} className={styles.logoItem}>
                    <img alt="" src={logoWebUrl} style={statusStyle[/\d+/.test(status) ? status : 3]} />
                    {+fixType === 5 ? (
                      <div className={styles.num} style={{ color: numColor[/\d+/.test(status) ? status : 3] }}>
                        {(realValue === 0 && '正常') || (realValue === 1 && '火警') || '—'}
                      </div>
                    ) : (
                        <div>
                          <div>{`${paramDesc}${paramUnit ? `（${paramUnit}）` : ''}`}</div>
                          <div style={{ color: numColor[/\d+/.test(status) ? status : 3] }} className={styles.num}>{/\d+/.test(realValue) ? realValue : '—'}</div>
                        </div>
                      )}
                  </Col>
                ))}
              </Row>
            ) : (
                <Row className={styles.line} gutter={10}>
                  {sensorMonitorParamList.map(({ fixType, logoWebUrl, paramDesc, paramUnit }, index) => (
                    <Col key={index}{...logoItemWrapper} className={styles.logoItem}>
                      <img alt="" src={logoWebUrl} style={{ filter: 'grayscale(1)' }} />
                      {+fixType === 5 ? (
                        <div className={styles.num}>{'—'}</div>
                      ) : (
                          <div>
                            <div>{`${paramDesc}${paramUnit ? `（${paramUnit}）` : ''}`}</div>
                            <div className={styles.num}>{'—'}</div>
                          </div>
                        )}
                    </Col>
                  ))}
                </Row>
              )}
          </Card>
        </div>
      </PageHeaderLayout>
    )
  }
}
