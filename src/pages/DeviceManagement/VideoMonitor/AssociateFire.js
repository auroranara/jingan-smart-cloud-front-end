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

export default class AssociateFire extends Component {

  componentDidMount() {
    const {
      dispatch,
      data: { id, companyId },
    } = this.props
    // 获取筛选栏数据
    dispatch({
      type: 'videoMonitor/fetchFireFilterList',
      payload: { companyId },
    })
    // 获取设施系统类型
    dispatch({
      type: 'videoMonitor/fetchDictList',
      payload: { key: 'facilitySystemList', type: 'systemcode' },
    })
    // 获取视屏绑定的信标
    this.fetchBindedFireDevice({ payload: { videoId: id, pageNum: 1, pageSize: defaultPageSize } })
  }

  // 获取当前摄像头绑定的报警点位(火灾报警系统)
  fetchBindedFireDevice = actions => {
    const {
      dispatch,
    } = this.props
    dispatch({
      type: 'videoMonitor/fetchBindedFireDevice',
      ...actions,
    })
  }

  handleToAdd = () => {
    const {
      data: { id, companyId, name },
    } = this.props
    router.push(`/device-management/video-monitor/associate/${id}/add/fire?name=${name}&&companyId=${companyId}`)
  }

  // 点击取消关联
  handleUnBindBeacon = fireIds => {
    const {
      dispatch,
      data: { id },
    } = this.props
    dispatch({
      type: 'videoMonitor/unbindedFirerDevice',
      payload: { videoId: id, fireIds },
      success: () => {
        message.success('取消关联成功！')
        // 获取视屏绑定的信标
        this.handleQuery()
      },
      error: () => { message.error('取消关联失败！') },
    })
  }

  // 点击查询
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      data: { id },
      form: { getFieldsValue },
    } = this.props
    const values = getFieldsValue()
    this.fetchBindedFireDevice({ payload: { videoId: id, pageNum, pageSize, ...values } })
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


  render() {
    const {
      form: { getFieldDecorator },
      videoMonitor: {
        associateDevice: {
          list = [],
          pagination: { pageNum = 1, pageSize = 10, total = 0 },
        },
        systemList = [],
        // 消控主机
        deviceCodes = [],
        // 设施部件类型
        dictDataList = [],
        // 设施系统类型
        facilitySystemList = [],
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props
    // 解绑权限
    const unBindBeaconAuth = hasAuthority(unBindBeaconCode, permissionCodes)
    // 新增关联权限
    const addAssociateAuth = hasAuthority(addAssociateCode, permissionCodes)
    const columns = [
      {
        title: '消防主机编号',
        dataIndex: 'fireCode',
        align: 'center',
      },
      {
        title: '设施系统类型',
        dataIndex: 'systemType',
        align: 'center',
        render: (val) => {
          const item = facilitySystemList.find(item => +item.value === +val) || { label: '' }
          return <span>{item.label}</span>
        },
      },
      {
        title: '设施部件类型',
        dataIndex: 'unitType',
        align: 'center',
        render: (val) => {
          const item = dictDataList.find(item => +item.value === +val) || { label: '' }
          return <span>{item.label}</span>
        },
      },
      {
        title: '回路号',
        dataIndex: 'loopNumber',
        align: 'center',
      },
      {
        title: '部位号',
        dataIndex: 'partNumber',
        align: 'center',
      },
      {
        title: '安装位置',
        dataIndex: 'installAddress',
        align: 'center',
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

    return (
      <Fragment>
        <Card>
          <Form>
            <Row gutter={16}>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('fireCode')(
                    <Select placeholder="请选择消控主机" >
                      {deviceCodes.map((item, i) => (<Select.Option key={i} value={item}>{item}</Select.Option>))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('systemType')(
                    <Select placeholder="设施系统类型" >
                      {facilitySystemList.map((item, i) => (<Select.Option key={i} value={item.value}>{item.label}</Select.Option>))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('unitType')(
                    <Select placeholder="设施部件类型" >
                      {dictDataList.map(item => (<Select.Option key={item.id} value={item.value}>{item.label}</Select.Option>))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('loopNumber')(
                    <Input placeholder="请输入回路号" />
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('partNumber')(
                    <Input placeholder="请输入部位号" />
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('location')(
                    <Input placeholder="请输入安装位置" />
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
