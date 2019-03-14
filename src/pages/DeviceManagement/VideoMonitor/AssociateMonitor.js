import { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Spin, Form, Input, Button, Select, Row, Col, Table, Popconfirm, message } from 'antd';
import router from 'umi/router';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';

const FormItem = Form.Item;

const {
  deviceManagement: {
    videoMonitor: {
      addAssociate: addAssociateCode,
      unBindBeacon: unBindBeaconCode,
    },
  },
} = codes

const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const defaultPageSize = 10;

@Form.create()
@connect(({ videoMonitor, user }) => ({
  videoMonitor,
  user,
}))
export default class AssociatePersonnelPosition extends Component {

  componentDidMount() {
    const {
      dispatch,
      data: { id, companyId },
    } = this.props
    // TODO：获取筛选条件数据

    // 获取视屏绑定的信标
    this.fetchBindedMonitorDevice({ payload: { videoId: id, pageNum: 1, pageSize: defaultPageSize } })
    // 获取品牌列表
    dispatch({ type: 'videoMonitor/getOptionalList' })
    // 获取产品型号列表
    dispatch({ type: 'videoMonitor/getModelDescList' })
    // 获取监测类型列表
    dispatch({ type: 'videoMonitor/getClassTypeList' })
  }

  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      data: { id },
      form: { getFieldsValue },
    } = this.props
    const values = getFieldsValue()
    this.fetchBindedMonitorDevice({ payload: { videoId: id, pageNum, pageSize, ...values } })
  }

  // 获取视频已绑定设备（动态监测）
  fetchBindedMonitorDevice = actions => {
    const {
      dispatch,
    } = this.props
    dispatch({
      type: 'videoMonitor/fetchBindedMonitorDevice',
      ...actions,
    })
  }

  // 点击查询
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      data: { id },
      form: { getFieldsValue },
    } = this.props
    const values = getFieldsValue()
    this.fetchBindedMonitorDevice({ payload: { videoId: id, pageNum, pageSize, ...values } })
  }

  // 点击重置
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props
    resetFields()
    // 获取视屏绑定的信标
    this.handleQuery()
  }

  handleToAdd = () => {
    const {
      data: { id, companyId, name },
    } = this.props
    router.push(`/device-management/video-monitor/associate/${id}/add/monitor?name=${name}&&companyId=${companyId}`)
  }

  // 点击取消关联
  handleUnBindBeacon = id => {
    const {
      dispatch,
    } = this.props
    dispatch({
      type: 'videoMonitor/unbindedMonitorDevice',
      payload: { id },
      success: () => {
        message.success('取消关联成功！')
        // 获取视屏绑定的信标
        this.handleQuery()
      },
      error: () => { message.error('取消关联失败！') },
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      videoMonitor: {
        associateDevice: {
          list = [],
          pagination: { pageNum = 1, pageSize = 10, total = 0 },
        },
        // 品牌列表
        optionalList = [],
        // 产品型号列表
        modelDescList = [],
        // 监测类型列表
        classTypeList = [],
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props
    const columns = [
      {
        title: '监测类型',
        dataIndex: 'class_type',
        align: 'center',
        render: val => {
          const item = classTypeList.find(item => +item.class_type === +val) || { type_desc: '' }
          return <span>{item.type_desc}</span>
        },
      },
      {
        title: '品牌',
        dataIndex: 'optional_desc',
        align: 'center',
      },
      {
        title: '产品型号',
        dataIndex: 'model_desc',
        align: 'center',
      },
      {
        title: '设备号',
        dataIndex: 'relation_device_id',
        align: 'center',
      },
      {
        title: '所在区域位置',
        key: 'area',
        align: 'center',
        render: (val, { area = null, location = null }) => <span>{area || '' + location || ''}</span>,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            {unBindBeaconAuth ? (
              <Popconfirm title="确认要取消关联吗？" onConfirm={() => this.handleUnBindBeacon(row.id)}><a>取消关联</a></Popconfirm>
            ) : (
                <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>取消关联</span>
              )}
          </Fragment>
        ),
      },
    ]
    const unBindBeaconAuth = hasAuthority(unBindBeaconCode, permissionCodes)
    // 新增关联权限
    const addAssociateAuth = hasAuthority(addAssociateCode, permissionCodes)
    return (
      <Fragment>
        <Card>
          <Form>
            <Row gutter={16}>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('classType')(
                    <Select placeholder="监测类型" >
                      {classTypeList.map((item, i) => (<Select.Option key={i} value={item.class_type}>{item.type_desc}</Select.Option>))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('optionalDesc')(
                    <Select placeholder="品牌" >
                      {optionalList.map((item, i) => (<Select.Option key={i} value={item}>{item}</Select.Option>))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('modelDesc')(
                    <Select placeholder="产品型号" >
                      {modelDescList.map((item, i) => (<Select.Option key={i} value={item}>{item}</Select.Option>))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('relationDeviceId')(
                    <Input placeholder="请输入设备号" />
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                  <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                  <Button onClick={this.handleToAdd} type="primary" disabled={!addAssociateAuth}>新增关联</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card style={{ marginTop: '24px' }}>
          <Table
            rowKey="id"
            dataSource={list}
            columns={columns}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: this.handleQuery,
              onShowSizeChange: (num, size) => this.handleQuery(1, size),
            }}
          />
        </Card>
      </Fragment>
    )
  }
}
