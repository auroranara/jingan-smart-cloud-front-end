import { Component, Fragment } from 'react';
import { Card, Button, Row, Col, Form, Input, Select, Modal, Table, Popconfirm, Divider } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import codes from '@/utils/codes';
import { hasAuthority, AuthA } from '@/utils/customAuth';
import { message } from 'antd';

const FormItem = Form.Item;

const title = '消防给水系统';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理' },
  { title: '设备关联传感', name: '设备关联传感', href: '/device-management/associate-sensor/list' },
  { title, name: title },
]
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const defaultPageSize = 10;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const noAuthStyle = { style: { color: 'rgba(0, 0, 0, 0.25)', cursor: 'not-allowed' } }
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } }
const {
  deviceManagement: {
    associateSensor: {
      waterSystem: {
        add: addCode,
        delete: deleteCode,
        edit: editCode,
        bindSensor: bindSensorCode,
        unbindSensor: unbindSensorCode,
      },
    },
  },
} = codes

@Form.create()
@connect(({ sensor, user, loading }) => ({
  sensor,
  user,
  loading: loading.effects['sensor/fetchCompanyDevice'],
  bindTableLoading: loading.effects['sensor/fetchCompanySensor'],
}))
export default class SensorCompanyList extends Component {

  state = {
    addModalVisible: false, // 新增设备弹窗可见
    selectedSensorKeys: [],  // 绑定传感器时选择的keys
    deviceInfo: {},           // 绑定传感器时保存的设备信息
    bindedModalVisible: false, // 已绑定传感器弹窗可见
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { companyId } },
    } = this.props
    this.fetchCompanyDevice({ payload: { companyId, pageNum: 1, pageSize: defaultPageSize } })
    // 获取设备类型列表
    dispatch({ type: 'sensor/fetchDeviceTypes' })
  }

  /**
   * 获取企业下绑定的传感器列表
   */
  fetchCompanyDevice = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchCompanyDevice',
      ...actions,
    })
  }

  // 获取企业下传感器列表
  fetchCompanySensor = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchCompanySensor',
      ...actions,
    })
  }

  // 获取已绑定传感器列表
  fetchDeviceBindedSensor = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/fetchDeviceBindedSensor',
      ...actions,
    })
  }

  /**
   * 绑定传感器获取数据
   * @param {number} [pageNum=1]
   * @param {number} [pageSize=defaultPageSize]
   */
  queryBindList = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      match: { params: { companyId } },
      form: { getFieldsValue },
    } = this.props
    const virtualDeviceId = this.state.deviceInfo.deviceId
    const { deviceModelId, deviceNo } = getFieldsValue()
    this.fetchCompanySensor({ payload: { companyId, pageNum, pageSize, deviceModelId, deviceNo, virtualDeviceId } })
  }

  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      match: { params: { companyId } },
      form: { getFieldsValue },
    } = this.props
    const { searchDeviceName: deviceName, searchDeviceType: deviceType, searchArea: area } = getFieldsValue()
    this.fetchCompanyDevice({ payload: { deviceName, deviceType, area, companyId, pageNum, pageSize } })
  }

  handleReset = () => {
    const { form: { resetFields } } = this.props
    resetFields()
    this.handleQuery()
  }


  /**
   * 新增设备
   */
  addDevice = () => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { companyId } },
    } = this.props
    const { deviceInfo } = this.state
    const deviceId = deviceInfo.deviceId || null
    validateFields((err, { deviceName, deviceType, area, location }) => {
      if (!err) {
        const payload = { companyId, deviceName, deviceType, area, location }
        dispatch({
          type: deviceId ? 'sensor/editCompanyDevice' : 'sensor/addSensorCompany',
          payload: deviceId ? { deviceId, ...payload } : payload,
          success: () => {
            message.success(deviceId ? '编辑设备成功！' : '新增设备成功！')
            this.setState({ addModalVisible: false, deviceInfo: {} })
            this.handleQuery()
          },
          error: () => { message.error(deviceId ? '编辑设备失败！' : '新增设备失败！') },
        })
      }
    })
  }

  handleSelectChange = (selectedSensorKeys) => {
    this.setState({ selectedSensorKeys })
  }

  // 点击打开绑定传感器弹窗
  handleToBind = (deviceInfo) => {
    const { dispatch } = this.props
    // 获取传感器类型
    dispatch({ type: 'sensor/fetchSensorTypes' })
    this.setState({ deviceInfo }, () => {
      this.queryBindList()
      this.setState({ bindModalVisible: true })
    })
  }

  handleResetBind = () => {
    const {
      form: { setFieldsValue },
    } = this.props
    setFieldsValue({ deviceModelId: undefined, deviceNo: undefined })
    this.queryBindList()
  }

  // 点击绑定
  bindSensor = () => {
    const {
      dispatch,
    } = this.props
    const { selectedSensorKeys, deviceInfo } = this.state
    if (!selectedSensorKeys || selectedSensorKeys.length === 0) {
      message.warning('请勾选传感器！')
      return
    }
    dispatch({
      type: 'sensor/bindDeviceSensor',
      payload: {
        deviceId: deviceInfo.deviceId,
        realDeviceIds: selectedSensorKeys.join(','),
      },
      success: () => {
        message.success('绑定传感器成功！')
        this.setState({ bindModalVisible: false, deviceInfo: {} })
        this.handleQuery()
      },
      error: () => { message.error('绑定传感器失败！') },
    })
  }

  /**
   * 点击查看设备绑定的传感器
   */
  handleViewBindedSensor = (deviceInfo) => {
    this.fetchDeviceBindedSensor({
      payload: { deviceId: deviceInfo.deviceId },
      callback: () => {
        this.setState({ bindedModalVisible: true, deviceInfo })
      },
    })
  }

  handleUnBind = ({ deviceId: realDeviceId }) => {
    const {
      dispatch,
    } = this.props
    const { deviceInfo } = this.state
    const virtualDeviceId = deviceInfo.deviceId
    dispatch({
      type: 'sensor/unbindDeviceSensor',
      payload: { realDeviceId, virtualDeviceId },
      success: () => {
        message.success('解绑传感器成功！')
        this.fetchDeviceBindedSensor({ payload: { deviceId: deviceInfo.deviceId } })
        this.handleQuery()
      },
      error: () => { message.error('解绑传感器失败！') },
    })
  }

  handleDeleteDevice = ({ deviceId: id }) => {
    const { dispatch } = this.props
    dispatch({
      type: 'sensor/deleteCompanyDevice',
      payload: { id },
      success: () => {
        message.success('删除设备成功！')
        this.handleQuery()
      },
      error: () => { message.error('删除设备失败！') },
    })
  }

  // 打开编辑设备弹窗
  handleEditDevice = (deviceInfo) => {
    const {
      form: { setFieldsValue },
    } = this.props
    this.setState({ addModalVisible: true, deviceInfo }, () => {
      const { deviceName, deviceType, area, location } = deviceInfo
      setFieldsValue({ deviceName, deviceType: +deviceType, area, location })
    })
  }

  /**
   * 渲染筛选栏
   */
  renderForm = ({ addAuth }) => {
    const {
      form: { getFieldDecorator },
      sensor: { deviceTypes = [] },
    } = this.props
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('searchDeviceName')(
                  <Input placeholder="请输入设备名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('searchDeviceType')(
                  <Select placeholder="请选择设备类型">
                    {deviceTypes.map(({ type, typeDesc }, i) => (<Select.Option key={i} value={type}>{typeDesc}</Select.Option>))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('searchArea')(
                  <Input placeholder="请输入所在区域" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                <Button disabled={!addAuth} type="primary" onClick={() => { this.setState({ addModalVisible: true, deviceInfo: {} }) }}>新增设备</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  /**
   * 渲染新增设备弹窗
   */
  renderAddModal = () => {
    const {
      form: { getFieldDecorator },
      sensor: { deviceTypes = [] },
    } = this.props
    const { addModalVisible, deviceInfo } = this.state
    return (
      <Modal
        title={deviceInfo && deviceInfo.deviceId ? '编辑设备' : "新增设备"}
        width={700}
        visible={addModalVisible}
        destroyOnClose={true}
        onCancel={() => { this.setState({ addModalVisible: false, deviceInfo: {} }) }}
        onOk={this.addDevice}
      >
        <Form>
          <FormItem label="设备名称" {...formItemLayout}>
            {getFieldDecorator('deviceName', {
              rules: [{ required: true, message: '请输入设备名称' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="设备类型" {...formItemLayout}>
            {getFieldDecorator('deviceType', {
              rules: [{ required: true, message: '请选择设备类型' }],
            })(
              <Select placeholder="请选择" {...itemStyles}>
                {deviceTypes.map(({ type, typeDesc }, i) => (<Select.Option key={i} value={type}>{typeDesc}</Select.Option>))}
              </Select>
            )}
          </FormItem>
          <FormItem label="所在区域" {...formItemLayout}>
            {getFieldDecorator('area', {
              rules: [{ required: true, message: '请输入所在区域' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="所在位置" {...formItemLayout}>
            {getFieldDecorator('location', {
              rules: [{ required: true, message: '请输入所在位置' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }


  /**
   * 渲染设备表格
   */
  renderTable = ({ deleteAuth }) => {
    const {
      loading,
      sensor: {
        companyDevice: {
          list = [],
          pagination: {
            pageNum,
            pageSize,
            total,
          },
        },
        deviceTypes = [],
      },
    } = this.props
    const columns = [
      {
        title: '设备名称',
        dataIndex: 'deviceName',
        align: 'center',
      },
      {
        title: '设备类型',
        dataIndex: 'deviceType',
        align: 'center',
        render: (val) => {
          const item = deviceTypes.find(item => +item.type === +val) || { typeDesc: '' }
          return <span>{item.typeDesc}</span>
        },
      },
      {
        title: '所在区域',
        dataIndex: 'area',
        align: 'center',
      },
      {
        title: '所在位置',
        dataIndex: 'location',
        align: 'center',
      },
      {
        title: '绑定的传感器数量',
        dataIndex: 'edeviceNum',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            {+val > 0 ? (<a onClick={() => this.handleViewBindedSensor(row)}>{val}</a>) : (<span>{val}</span>)}
          </Fragment>
        ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            <AuthA code={bindSensorCode} onClick={() => this.handleToBind(row)}>绑定传感器</AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleEditDevice(row)}>编辑</AuthA>
            <Divider type="vertical" />
            {deleteAuth ? (
              <Popconfirm title="确认要删除设备吗？" onConfirm={() => this.handleDeleteDevice(row)}>
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


  /**
   * 渲染绑定传感器弹窗
   */
  renderBindModal = () => {
    const {
      bindTableLoading,
      form: { getFieldDecorator },
      sensor: {
        companySensor: {
          list = [],
          pagination: {
            pageNum = 1,
            pageSize = defaultPageSize,
            total = 0,
          },
        },
        sensorTypes = [],
      },
    } = this.props
    const { selectedSensorKeys, bindModalVisible } = this.state
    const columns = [
      {
        title: '传感器型号',
        dataIndex: 'modelName',
        align: 'center',
      },
      {
        title: '传感器ID',
        dataIndex: 'relationDeviceId',
        align: 'center',
      },
      {
        title: '所在区域',
        dataIndex: 'area',
        align: 'center',
      },
      {
        title: '所在位置',
        dataIndex: 'location',
        align: 'center',
      },
    ]
    const rowSelection = {
      selectedSensorKeys,
      onChange: this.handleSelectChange,
    }
    return (
      <Modal
        title="绑定传感器"
        width={700}
        visible={bindModalVisible}
        destroyOnClose={true}
        onCancel={() => { this.setState({ bindModalVisible: false, deviceInfo: {} }) }}
        onOk={this.bindSensor}
      >
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('deviceModelId')(
                  <Select placeholder="传感器型号">
                    {sensorTypes.map(({ id, label }) => (<Select.Option key={id} value={id}>{label}</Select.Option>))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('deviceNo')(
                  <Input placeholder="传感器ID" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.queryBindList()}>查询</Button>
                <Button onClick={this.handleResetBind}>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <Table
          rowKey="deviceId"
          loading={bindTableLoading}
          columns={columns}
          dataSource={list}
          bordered
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: this.queryBindList,
            onShowSizeChange: (num, size) => {
              this.queryBindList(1, size);
            },
          }}
          rowSelection={rowSelection}
        />
      </Modal>
    )
  }


  /**
   * 渲染已绑定传感器列表弹窗
   */
  renderBindedModal = ({ unbindSensorAuth }) => {
    const {
      sensor: {
        deviceBindedSensor: {
          list = [],
        },
      },
    } = this.props
    const { bindedModalVisible } = this.state
    const columns = [
      {
        title: '传感器型号',
        dataIndex: 'modelName',
        align: 'center',
      },
      {
        title: '传感器ID',
        dataIndex: 'relationDeviceId',
        align: 'center',
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            {unbindSensorAuth ? (
              <Popconfirm title="确认要解绑传感器吗？" onConfirm={() => this.handleUnBind(row)}>
                <a>解绑</a>
              </Popconfirm>
            ) : (<span {...noAuthStyle}>解绑</span>)}
          </Fragment>
        ),
      },
    ]
    return (
      <Modal
        title="已绑定传感器"
        width={700}
        visible={bindedModalVisible}
        destroyOnClose={true}
        onCancel={() => { this.setState({ bindedModalVisible: false }) }}
        footer={<Button onClick={() => { this.setState({ bindedModalVisible: false }) }}>关闭</Button>}
      >
        <Table
          rowKey="deviceId"
          columns={columns}
          dataSource={list}
          bordered
        />
      </Modal>
    )
  }

  render() {
    const {
      location: { query: { name } },
      sensor: {
        companyDevice: {
          pagination: { total = 0 },
        },
      },
      user: { currentUser: { permissionCodes } },
    } = this.props
    const addAuth = hasAuthority(addCode, permissionCodes),
      deleteAuth = hasAuthority(deleteCode, permissionCodes),
      unbindSensorAuth = hasAuthority(unbindSensorCode, permissionCodes)
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={(
          <Fragment>
            <p>{name}</p>
            <p>设备总数：{total}</p>
          </Fragment>
        )}
      >
        {this.renderForm({ addAuth })}
        {this.renderTable({ deleteAuth })}
        {this.renderAddModal()}
        {this.renderBindModal()}
        {this.renderBindedModal({ unbindSensorAuth })}
      </PageHeaderLayout>
    )
  }
}
