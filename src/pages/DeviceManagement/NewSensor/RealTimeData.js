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

const title = '实时数据'
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }

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
        render: (val, { realValue, paramUnit }) => (<span>{realValue ? realValue + paramUnit : '——'}</span>),
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
        render: (val) => (<span>{val ? moment(val).format('YYYY-MM-DD hh:mm:ss') : ''}</span>),
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
        } = {},
      },
    } = this.props
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title: '传感器管理', name: '传感器管理', href: '/device-management/new-sensor/list' },
      { title, name: title },
    ]
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card>
          <Form>
            <FormItem label="连接状态" {...formItemLayout}>
              {(linkStatus === -1 && '失联') || (linkStatus === 0 && '正常') || '未知'}
            </FormItem>
            <FormItem label="故障状态" {...formItemLayout}>
              {this.renderStatusTable()}
            </FormItem>
            <FormItem label="实时数据" {...formItemLayout}>
              {this.renderRealTimeDataTable()}
            </FormItem>

          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}
