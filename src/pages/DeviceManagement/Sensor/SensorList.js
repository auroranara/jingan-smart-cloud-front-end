import { Component, Fragment } from 'react';
import { Card, Form, Input, Button, Table, Row, Col, Divider, Popconfirm, Select, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import codes from '@/utils/codes';

const FormItem = Form.Item;
const Option = Select.Option;

const title = '传感器管理'
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理' },
  { title, name: title },
]
const noAuthStyle = { style: { color: 'rgba(0, 0, 0, 0.25)', cursor: 'not-allowed' } }
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const defaultPageSize = 10;
const {
  deviceManagement: {
    sensor: {
      add: addSensorCode,
      edit: editSensorCode,
      delete: deleteSensorCode,
    },
  },
} = codes

@Form.create()
@connect(({ sensor, resourceManagement, user, loading }) => ({
  sensor,
  resourceManagement,
  user,
  loading: loading.effects['sensor/fetchSensors'],
}))
export default class SensorList extends Component {

  componentDidMount() {
    this.fetchMonitoringTypeDict()
    this.fetchSensorBrandDict()
    this.fetchSensorTypeDict()
    this.handleQuery()
  }


  /**
   * 获取传感器列表（分页）
   */
  fetchSensors = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchSensors',
      ...actions,
    })
  }


  /**
   * 获取监测类型列表（字典）
   */
  fetchMonitoringTypeDict = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchMonitoringTypeDict',
      ...actions,
    })
  }


  /**
   * 获取传感器品牌列表（字典）
   */
  fetchSensorBrandDict = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchSensorBrandDict',
      ...actions,
    })
  }


  /**
   * 获取传感器类型列表（字典）
   */
  fetchSensorTypeDict = (actions) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchSensorTypeDict',
      ...actions,
    })
  }

  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      form: { getFieldsValue },
    } = this.props
    const values = getFieldsValue()
    this.fetchSensors({
      payload: { pageNum, pageSize, ...values },
    })
  }

  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props
    resetFields()
    this.handleQuery()
    this.fetchMonitoringTypeDict()
    this.fetchSensorBrandDict()
    this.fetchSensorTypeDict()
  }


  /**
   * 删除传感器
   */
  handleDelete = ({ deviceId }) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/deleteSensor',
      payload: { id: deviceId },
      success: () => {
        message.success('删除成功！')
        this.handleQuery()
      },
      error: response => { message.error(response.msg) },
    })
  }


  /**
   * 筛选栏检测类型改变
   */
  handlemonitoringTypeChange = (monitoringTypeId) => {
    this.fetchSensorBrandDict({ payload: { monitoringTypeId } })
    this.fetchSensorTypeDict({ payload: { monitoringTypeId } })
  }


  /**
   * 筛选栏品牌改变
   */
  handleBrandChange = (brand) => {
    this.fetchMonitoringTypeDict({ payload: { brand } })
    this.fetchSensorTypeDict({ payload: { brand } })
  }


  /**
   * 筛选栏类型改变
   */
  handleTypeChange = (type) => {
    this.fetchMonitoringTypeDict({ payload: { type } })
    this.fetchSensorBrandDict({ payload: { type } })
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = ({ addAuth }) => {
    const {
      form: { getFieldDecorator },
      sensor: {
        // 监测类型字典
        monitoringTypeDict = [],
        // 传感器品牌字典
        brandDict = [],
        // 传感器型号字典
        typeDict = [],
      },
      user: { },
    } = this.props
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('companyName')(
                  <Input placeholder="单位名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('monitoringTypeId')(
                  <Select placeholder="监测类型" onChange={this.handlemonitoringTypeChange}>
                    {monitoringTypeDict.map(({ value, key }) => (
                      <Option key={key} value={key}>{value}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('brand')(
                  <Select placeholder="品牌" onChange={this.handleBrandChange}>
                    {brandDict.map(({ value, key }) => (
                      <Option key={key} value={key}>{value}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('type')(
                  <Select placeholder="传感器型号" onChange={this.handleTypeChange}>
                    {typeDict.map(({ value, key }) => (
                      <Option key={key} value={key}>{value}</Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('relationDeviceId')(
                  <Input placeholder="传感器ID" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                <Button type="primary" disabled={!addAuth} onClick={() => router.push('/device-management/sensor/add')}>新增传感器</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  /**
  * 渲染表格
  */
  renderTable = ({ deleteAuth }) => {
    const {
      loading,
      sensor: {
        list = [],
        pagination: {
          pageNum,
          pageSize,
          total,
        },
      },
    } = this.props

    const columns = [
      {
        title: '企业名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 400,
      },
      {
        title: '监测类型',
        dataIndex: 'monitoringType',
        align: 'center',
        width: 150,
      },
      {
        title: '品牌',
        dataIndex: 'brand',
        align: 'center',
        width: 150,
      },
      {
        title: '传感器型号',
        dataIndex: 'type',
        align: 'center',
        width: 150,
      },
      {
        title: '传感器名称',
        dataIndex: 'deviceName',
        align: 'center',
        width: 150,
      },
      {
        title: '传感器ID',
        dataIndex: 'relationDeviceId',
        align: 'center',
        width: 150,
      },
      {
        title: '所在区域',
        dataIndex: 'area',
        align: 'center',
        width: 150,
      },
      {
        title: '位置详情',
        dataIndex: 'location',
        align: 'center',
        width: 200,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        width: 150,
        render: (val, row) => (
          <Fragment>
            <AuthA code={editSensorCode} onClick={() => router.push(`/device-management/sensor/edit/${row.deviceId}`)}>编辑</AuthA>
            <Divider type="vertical" />
            {deleteAuth ? (
              <Popconfirm title="确认要删除该传感器吗？" onConfirm={() => this.handleDelete(row)}>
                <a>删除</a>
              </Popconfirm>
            ) : (<span {...noAuthStyle}>删除</span>)}
          </Fragment>
        ),
      },
    ]
    return (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="deviceId"
          loading={loading}
          columns={columns}
          dataSource={list}
          bordered
          scroll={{ x: 1500 }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: this.handleQuery,
            onShowSizeChange: (num, size) => {
              this.handleQuery(1, size);
            },
          }}
        />
      </Card>
    )
  }

  render() {
    const {
      sensor: {
        pagination: { total = 0 },
      },
      user: { currentUser: { permissionCodes } },
    } = this.props
    const deleteAuth = hasAuthority(deleteSensorCode, permissionCodes)
    const addAuth = hasAuthority(addSensorCode, permissionCodes)
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<span>传感器总数：{total}</span>}
      >
        {this.renderFilter({ addAuth })}
        {this.renderTable({ deleteAuth })}
      </PageHeaderLayout>
    )
  }
}
