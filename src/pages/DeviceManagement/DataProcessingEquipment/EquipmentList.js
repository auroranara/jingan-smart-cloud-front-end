import { PureComponent, Fragment } from 'react';
import { Card, Button, Form, Input, Row, Col, Select, Divider, Table, Tag, message } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { AuthButton, AuthA, AuthLink } from '@/utils/customAuth';
import codes from '@/utils/codes';
import { dataProcessingType } from '@/utils/dict'; // 数据处理设备类型枚举
import router from 'umi/router';
import moment from 'moment';
import BindSensorModal from '@/pages/DeviceManagement/Components/BindSensorModal';

const FormItem = Form.Item;

const {
  deviceManagement: {
    dataProcessing: {
      device: {
        add: addCode,
        edit: editCode,
        delete: deleteCode,
        bindSensor: bindSensorCode,
        // unbindSensor: unbindSensorCode,
      },
    },
    newSensor: {
      add: addSensorCode,
    },
  },
} = codes
const defaultPageSize = 10;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const tagSetting = [
  { color: 'orange', label: '即将过期' },
  { color: 'red', label: '已过期' },
]

@Form.create()
@connect(({ device, loading }) => ({
  device,
  tableLoading: loading.effects['device/fetchEquipmentsForPage'],
  sensorLoading: loading.effects['device/fetchSensors'],
}))
export default class EquipmentList extends PureComponent {

  state = {
    bindSensorModalVisible: false, // 绑定传感器弹窗
    bindedSensorModalVisible: false, // 已绑定传感器弹窗
    deviceInfo: {}, // 设备信息
    selectedSensorKeys: [], // 选择的传感器key数组
  }

  componentDidMount() {
    this.handleQuery()
    // 获取已绑定传感器统计
    this.fetchBindedSensorStatistics()
  }

  /**
   * 获取网关设备（全部）
   */
  fetchGatewayEquipment = actions => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/fetchGatewayEquipment',
      ...actions,
    })
  }

  /**
  * 获取可绑定传感器列表
  */
  querySensors = ({ payload = { pageNum: 1, pageSize: defaultPageSize }, ...res } = {}) => {
    const {
      dispatch,
      location: { query: { companyId } },
    } = this.props
    const { deviceInfo } = this.state
    dispatch({
      type: 'device/fetchSensors',
      ...res,
      payload: {
        ...payload,
        companyId,
        dataExecuteEquipmentBindStatus: 0, // 未绑定传感器
        bindDataExecuteEquipmentId: deviceInfo.id,
      },
    })
  }

  /**
* 获取可绑定传感器列表
*/
  queryBindedSensors = ({ payload = { pageNum: 1, pageSize: defaultPageSize }, ...res } = {}) => {
    const {
      dispatch,
      location: { query: { companyId } },
    } = this.props
    const { deviceInfo } = this.state
    dispatch({
      type: 'device/fetchSensors',
      ...res,
      payload: {
        ...payload,
        companyId,
        dataExecuteEquipmentId: deviceInfo.id,
      },
    })
  }


  /**
   * 获取已绑定传感器数量
   */
  fetchBindedSensorStatistics = () => {
    const {
      dispatch,
      location: { query: { companyId } },
      match: { params: { type } },
    } = this.props
    dispatch({
      type: 'device/fetchBindedSensorStatistics',
      payload: { companyId, equipmentType: type },
    })
  }

  /**
   * 搜索列表数据
   */
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
      match: { params: { type } },
      location: { query: { companyId } },
    } = this.props
    const values = getFieldsValue()
    dispatch({
      type: 'device/fetchEquipmentsForPage',
      payload: { pageNum, pageSize, companyId, equipmentType: type, ...values },
    })
  }


  /**
   * 重置列表数据
   */
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props
    resetFields()
    this.handleQuery()
  }


  /**
   * 跳转到新增设备页面
   */
  jumpToAddPage = () => {
    const {
      match: { params: { type } },
      location: { query: { companyId } },
    } = this.props
    router.push(`/device-management/data-processing/${type}/add?companyId=${companyId}`)
  }


  /**
   * 点击打开可绑定传感器弹窗
   */
  handleViewBind = (deviceInfo) => {
    this.setState({ deviceInfo, selectedSensorKeys: [] }, () => {
      this.querySensors()
      this.setState({ bindSensorModalVisible: true })
    })
  }


  /**
   * 绑定时选择传感器
   */
  onSensorChange = selectedSensorKeys => {
    this.setState({ selectedSensorKeys })
  }

  /**
   * 绑定传感器
   */
  handleBindSensor = () => {
    const { dispatch } = this.props
    const { selectedSensorKeys, deviceInfo } = this.state
    if (!selectedSensorKeys || selectedSensorKeys.length === 0) {
      message.warning('请勾选传感器！')
      return
    }
    dispatch({
      type: 'device/bindSensor',
      payload: {
        bindDataExecuteEquipmentId: deviceInfo.id,
        bindSensorIdList: selectedSensorKeys,
      },
      success: () => {
        message.success('绑定传感器成功')
        this.setState({ bindSensorModalVisible: false, deviceInfo: {} })
        this.handleQuery()
        this.fetchBindedSensorStatistics()
      },
      error: (res) => { message.error(res ? res.msg : '绑定传感器失败') },
    })
  }


  /**
   * 打开已绑定传感器弹窗
   */
  handleViewBindedSensorModal = (deviceInfo) => {
    this.setState({ deviceInfo }, () => {
      this.queryBindedSensors()
      this.setState({ bindedSensorModalVisible: true })
    })
  }

  /**
   * 解绑传感器
   */
  handleunBindSensor = (unbindSensorId) => {
    const {
      dispatch,
    } = this.props
    const { deviceInfo } = this.state
    dispatch({
      type: 'device/unbindSensor',
      payload: {
        bindDataExecuteEquipmentId: deviceInfo.id, // 设备id
        unbindSensorId, // 传感器id
      },
      success: () => {
        message.success('解绑传感器成功')
        this.queryBindedSensors()
        this.handleQuery()
        this.fetchBindedSensorStatistics()
      },
      error: (res) => { message.error(res ? res.msg : '解绑传感器失败') },
    })
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <Card>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('code')(
                  <Input placeholder="设备编号" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="设备名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('areaLocation')(
                  <Input placeholder="区域位置" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('connectGateway')(
                  <Select placeholder="集成数据采集" allowClear>
                    <Select.Option value={1}>是，独立式</Select.Option>
                    <Select.Option value={0}>否，非独立式</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('inheritGather')(
                  <Select placeholder="接入网关设备" allowClear>
                    <Select.Option value={1}>已接入</Select.Option>
                    <Select.Option value={0}>未接入</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            {/* <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('gatewayEquipment')(
                  <Input placeholder="网关设备编号" />
                )}
              </FormItem>
            </Col> */}
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button onClick={() => this.handleQuery()} style={{ marginRight: '10px' }} type="primary">查询</Button>
                <Button onClick={this.handleReset} style={{ marginRight: '10px' }}>重置</Button>
                <AuthButton onClick={this.jumpToAddPage} code={addCode} type="primary">新增设备</AuthButton>
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
  renderTable = () => {
    const {
      tableLoading,
      match: { params: { type } },
      device: {
        equipment: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props
    const title = dataProcessingType[type]
    const columns = [
      {
        title,
        dataIndex: 'a',
        align: 'center',
        width: 200,
        render: (val, { equipmentTypeName, brandName, name, code }) => (
          <div style={{ textAlign: 'left' }}>
            <div>类型：{equipmentTypeName}</div>
            <div>品牌：{brandName}</div>
            <div>设备名称：{name}</div>
            <div>设备编号：{code}</div>
          </div>
        ),
      },
      {
        title: '有效期至',
        key: '有效期至',
        align: 'center',
        width: 200,
        render: (val, { expireStatus, expireDate }) => expireDate && (
          <Fragment>
            {[1, 2].includes(expireStatus) && (
              <Tag color={tagSetting[expireStatus - 1].color}>{tagSetting[expireStatus - 1].label}</Tag>
            )}
            {moment(expireDate).format('YYYY.MM.DD')}
          </Fragment>
        ),
      },
      {
        title: '区域位置',
        key: '区域位置',
        align: 'center',
        width: 200,
        render: (val, { area, location }) => `${area || ''}${location || ''}`,
      },
      {
        title: '网关设备',
        key: '网关设备',
        align: 'center',
        width: 250,
        render: (val, { inheritGather, gatewayEquipment }) => inheritGather ? (
          <div style={{ textAlign: 'left' }}>
            <div>已接入</div>
            <div>网关设备编号：{gatewayEquipment}</div>
          </div>
        ) : '--',
      },
      {
        title: '集成数据采集',
        dataIndex: 'connectGateway',
        align: 'center',
        width: 120,
        render: (val) => (val === 1 && '是，独立式') || (+val === 0 && '否，非独立式') || '暂无数据',
      },
      {
        title: '已绑定传感器',
        dataIndex: 'sensorCount',
        align: 'center',
        width: 120,
        render: (val, row) => (
          <span
            onClick={() => this.handleViewBindedSensorModal(row)}
            style={val > 0 ? { color: '#1890ff', cursor: 'pointer' } : null}
          >
            {val}
          </span>
        ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        render: (val, row) => (
          <Fragment>
            <AuthLink code={bindSensorCode} to={`/device-management/new-sensor/add?deviceId=${row.id}`}>新增绑定传感器</AuthLink>
            <Divider type />
            <AuthA code={bindSensorCode} onClick={() => this.handleViewBind(row)}>绑定已有传感器</AuthA>
            <Divider type />
            <AuthLink code={editCode} to={`/device-management/data-processing/${type}/edit/${row.id}?companyId=${row.companyId}`}>编辑</AuthLink>
            <Divider type />
            <AuthA code={deleteCode}>删除</AuthA>
          </Fragment>
        ),
      },
    ]

    return (
      <Card style={{ marginTop: '24px' }}>
        {list && list.length > 0 ? (
          <Table
            rowKey="id"
            loading={tableLoading}
            columns={columns}
            dataSource={list}
            bordered
            scroll={{ x: 'max-content' }}
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
        ) : (
            <div style={{ width: '100%', textAlign: 'center' }}><span>暂无数据</span></div>
          )}

      </Card>
    )
  }

  render() {
    const {
      sensorLoading,
      match: { params: { type } },
      location: { query: { companyName = '' } },
      device: {
        sensor,
        equipment: { pagination: { total = 0 } },
        bindedSensorCount = 0,
      },
    } = this.props
    const { bindSensorModalVisible, bindedSensorModalVisible, selectedSensorKeys } = this.state
    const title = dataProcessingType[type]
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备管理', name: '设备管理' },
      { title: '单位数据处理设备', name: '单位数据处理设备', href: '/device-management/data-processing/list' },
      { title, name: title },
    ]
    const bindSensorProps = {
      tag: 'bind',
      title: '绑定传感器',
      visible: bindSensorModalVisible,
      fetch: this.querySensors,
      onCancel: () => { this.setState({ bindSensorModalVisible: false }) },
      selectedSensorKeys,
      onOk: this.handleBindSensor,
      model: sensor,
      loading: sensorLoading,
      rowSelection: {
        selectedSensorKeys,
        onChange: this.onSensorChange,
      },
    }
    const bindedSensorProps = {
      tag: 'unbind',
      title: '已绑定传感器',
      visible: bindedSensorModalVisible,
      fetch: this.queryBindedSensors,
      onCancel: () => { this.setState({ bindedSensorModalVisible: false }) },
      model: sensor,
      loading: sensorLoading,
      handleUnbind: this.handleunBindSensor,
      footer: null,
    }
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={(
          <Fragment>
            <div>企业名称：{companyName}</div>
            <div>
              <span style={{ marginRight: '30px' }}>设备总数：{total}</span>
              <span>已绑定传感器数：{bindedSensorCount}</span>
            </div>
          </Fragment>
        )}
      >
        {this.renderFilter()}
        {this.renderTable()}
        {/* 绑定已有传感器弹窗 */}
        <BindSensorModal
          {...bindSensorProps}
        />
        {/* 已绑定传感器弹窗 */}
        <BindSensorModal
          {...bindedSensorProps}
        />
      </PageHeaderLayout>
    )
  }
}
