import { Component, Fragment } from 'react';
import { Card, Form, Input, Button, Table, Row, Col, Divider, Select, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { AuthButton, AuthA, AuthLink, AuthPopConfirm } from '@/utils/customAuth';
import codes from '@/utils/codes';
// 绑定传感器弹窗
import BindSensorModal from '@/pages/DeviceManagement/Components/BindSensorModal';

const FormItem = Form.Item;

const title = '监测设备管理'
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '物联设备管理', name: '物联设备管理' },
  { title, name: title },
]
const defaultPageSize = 10;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const {
  deviceManagement: {
    monitoringDevice: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      bindSensor: bindSensorCode,
      unbindSensor: unbindSensorCode,
    },
  },
} = codes

@Form.create()
@connect(({ device, loading }) => ({
  device,
  tableLoading: loading.effects['device/fetchMonitoringDevice'],
}))
export default class MonitoringDevice extends Component {

  state = {
    bindSensorModalVisible: false,
    bindedSensorModalVisible: false,
    selectedSensorKeys: [],
  }

  componentDidMount () {
    this.handleQuery()
    this.fetchMonitoringDeviceTypes()
  }

  // 获取设备类型--监测设备类型列表
  fetchMonitoringDeviceTypes = () => {
    const { dispatch } = this.props
    dispatch({ type: 'device/fetchMonitoringDeviceTypes' })
  }

  /**
  * 搜索列表
  */
  handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const values = getFieldsValue()
    dispatch({
      type: 'device/fetchMonitoringDevice',
      payload: { pageNum, pageSize, ...values },
    })
  }

  handleReset = () => {
    const { form: { resetFields } } = this.props
    resetFields()
    this.handleQuery()
  }

  // 删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/deleteMonitoringDevice',
      payload: { id },
      success: () => {
        message.success('删除成功！');
        this.handleQuery()
      },
      error: res => { message.error(res ? res.msg : '删除失败!') },
    });
  };

  /**
   * 获取可绑定传感器列表
   */
  querySensors = ({ payload = { pageNum: 1, pageSize: defaultPageSize }, ...res } = {}) => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/fetchSensors',
      ...res,
      payload: {
        ...payload,
        companyId: detail.companyId,
        monitorEquipmentBindStatus: 0,
        bindMonitorEquipmentId: detail.id,
      },
    });
  };

  /**
   * 获取已绑定传感器列表
   */
  queryBindedSensors = ({ payload = { pageNum: 1, pageSize: defaultPageSize }, ...res } = {}) => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/fetchSensors',
      ...res,
      payload: {
        ...payload,
        companyId: detail.companyId,
        monitorEquipmentId: detail.id,
      },
    });
  };

  /**
   * 点击打开可绑定传感器弹窗
   */
  handleViewBind = detail => {
    this.setState({ detail, selectedSensorKeys: [] }, () => {
      this.querySensors();
      this.setState({ bindSensorModalVisible: true });
    });
  };

  /**
   * 打开已绑定传感器弹窗
   */
  handleViewBindedSensorModal = detail => {
    this.setState({ detail }, () => {
      this.queryBindedSensors();
      this.setState({ bindedSensorModalVisible: true });
    });
  };

  /**
   * 绑定传感器
   */
  handleBindSensor = () => {
    const { dispatch } = this.props;
    const { selectedSensorKeys, detail } = this.state;
    dispatch({
      type: 'device/bindSensor',
      payload: {
        bindMonitorEquipmentId: detail.id,
        bindSensorIdList: selectedSensorKeys,
      },
      success: () => {
        message.success('绑定传感器成功');
        this.setState({ bindSensorModalVisible: false, detail: {} });
        this.handleQuery()
      },
      error: res => {
        message.error(res ? res.msg : '绑定传感器失败');
      },
    });
  }


  /**
   * 解绑传感器
   */
  handleunBindSensor = unbindSensorId => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/unbindSensor',
      payload: {
        bindMonitorEquipmentId: detail.id,
        unbindSensorId,
      },
      success: () => {
        message.success('解绑传感器成功');
        this.queryBindedSensors()
        this.handleQuery()
      },
      error: res => {
        message.error(res ? res.msg : '解绑传感器失败');
      },
    });
  };

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
      device: {
        monitoringDeviceTypes, // 设备类型
      },
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
                {getFieldDecorator('equipmentType')(
                  <Select placeholder="设备类型">
                    {monitoringDeviceTypes.map(({ id, name }) => (
                      <Select.Option key={id} value={id}>{name}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                <AuthButton type="primary" code={addCode} onClick={() => { router.push('/device-management/monitoring-device/add') }}>新增</AuthButton>
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
      device: {
        monitoringDevice: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      },
    } = this.props
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 400,
      },
      {
        title: '设备基本信息',
        key: '设备基本信息',
        align: 'center',
        width: 400,
        render: (val, { name, code, equipmentTypeName }) => (
          <div style={{ textAlign: 'left' }}>
            <div>名称：{name || '暂无数据'}</div>
            <div>编号：{code || '暂无数据'}</div>
            <div>设备类型：{equipmentTypeName || '暂无数据'}</div>
          </div>
        ),
      },
      {
        title: '区域位置',
        dataIndex: 'areaLocation',
        align: 'center',
        width: 300,
      },
      {
        title: '已绑定传感器数量',
        dataIndex: 'sensorCount',
        align: 'center',
        width: 200,
        render: (val, row) => (
          val > 0 ? (<AuthA onClick={() => this.handleViewBindedSensorModal(row)} code={bindSensorCode}>{val}</AuthA>) : (
            <span>{val}</span>
          )
        ),
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        fixed: 'right',
        width: 230,
        render: (val, row) => (
          <Fragment>
            <AuthA onClick={() => this.handleViewBind(row)} code={bindSensorCode}>绑定传感器</AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => router.push(`/device-management/monitoring-device/edit/${row.id}`)}>编辑</AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确认要删除该监测设备吗？"
              onConfirm={() => this.handleDelete(row.id)}
            >
              删除
            </AuthPopConfirm>
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

  render () {
    const {
      sensorLoading,
      device: { sensor },
    } = this.props
    const {
      bindSensorModalVisible,
      bindedSensorModalVisible,
      selectedSensorKeys,
    } = this.state;
    const bindSensorProps = {
      tag: 'bind',
      visible: bindSensorModalVisible,
      fetch: this.querySensors,
      onCancel: () => {
        this.setState({ bindSensorModalVisible: false });
      },
      selectedSensorKeys,
      onOk: this.handleBindSensor,
      model: sensor,
      loading: sensorLoading,
      rowSelection: {
        selectedRowKeys: selectedSensorKeys,
        onChange: selectedSensorKeys => { this.setState({ selectedSensorKeys }) },
      },
      unbindSensorCode,
    };
    const bindedSensorProps = {
      tag: 'unbind',
      visible: bindedSensorModalVisible,
      fetch: this.queryBindedSensors,
      onCancel: () => {
        this.setState({ bindedSensorModalVisible: false });
      },
      model: sensor,
      loading: sensorLoading,
      handleUnbind: this.handleunBindSensor,
      footer: null,
      unbindSensorCode,
    };
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        {this.renderFilter()}
        {this.renderTable()}
        {/* 绑定已有传感器弹窗 */}
        <BindSensorModal {...bindSensorProps} />
        {/* 已绑定传感器弹窗 */}
        <BindSensorModal {...bindedSensorProps} />
      </PageHeaderLayout>
    )
  }
}
