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
    // 获取当前企业下系统配置
    dispatch({
      type: 'videoMonitor/fetchSystemList',
      payload: { companyId },
    })
    // 获取视屏绑定的信标
    this.fetchVideoBeacons({ payload: { id, pageNum: 1, pageSize: defaultPageSize } })
  }

  // 获取视屏绑定的信标
  fetchVideoBeacons = actions => {
    const {
      dispatch,
    } = this.props
    dispatch({
      type: 'videoMonitor/fetchVideoBeacons',
      ...actions,
    })
  }

  handleToAdd = () => {
    const {
      data: { id, companyId, name },
    } = this.props
    router.push(`/device-management/video-monitor/associate/${id}/add/position?name=${name}&&companyId=${companyId}`)
  }

  // 点击取消关联
  handleUnBindBeacon = beaconIds => {
    const {
      dispatch,
      data: { id },
    } = this.props
    dispatch({
      type: 'videoMonitor/unBindBeacon',
      payload: { videoId: id, beaconIds },
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
    this.fetchVideoBeacons({ payload: { id, pageNum, pageSize, ...values } })
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
        title: '信标编号',
        dataIndex: 'beaconCode',
        align: 'center',
      },
      {
        title: '所属系统',
        dataIndex: 'sysName',
        align: 'center',
      },
      {
        title: '坐标',
        key: '坐标',
        align: 'center',
        render: (val, row) => (<span>（{row.xarea},{row.yarea},{row.zarea}）</span>),
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
                  {getFieldDecorator('code')(
                    <Input placeholder="请输入编号" />
                  )}
                </FormItem>
              </Col>
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('sysId')(
                    <Select placeholder="所属系统" >
                      {systemList.map(item => (<Select.Option key={item.id} value={item.id}>{item.sysName}</Select.Option>))}
                    </Select>
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
