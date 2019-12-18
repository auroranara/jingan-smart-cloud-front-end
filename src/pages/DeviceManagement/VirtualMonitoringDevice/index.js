import { Component, Fragment } from 'react';
import { Card, Form, Input, Button, Table, Row, Col, Divider, Select, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
// import { AuthButton, AuthA, AuthLink, AuthPopConfirm } from '@/utils/customAuth';
// import codes from '@/utils/codes';
// 选择监测设备弹窗
import MonitoringDeviceModal from '@/pages/DeviceManagement/Components/MonitoringDeviceModal';

const FormItem = Form.Item;

const title = '虚拟监测对象管理'
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '物联设备管理', name: '物联设备管理' },
  { title, name: title },
]
const defaultPageSize = 10;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }

@Form.create()
@connect(({ device, loading }) => ({
  device,
  tableLoading: loading.effects['device/fetchVirtualMonitoringDevice'],
  modalLoading: loading.effects['device/fetchMonitoringDevice'],
}))
export default class VirtualMonitoringDevice extends Component {

  state = {
    bindModalVisible: false,
    bindedModalVisible: false,
    selectedKeys: [],
    detail: {},
  };

  componentDidMount () {
    this.handleQuery()
    this.fetchMonitoringDeviceTypes()
  }

  // 获取设备类型--监测设备类型列表
  fetchMonitoringDeviceTypes = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'device/fetchAllDeviceTypes',
      payload: { targetRealStatus: 0, type: 3 },
    })
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
      type: 'device/fetchVirtualMonitoringDevice',
      payload: { ...values, pageNum, pageSize, targetRealStatus: 0 },
    })
  }

  // 点击重置
  handleReset = () => {
    const { form: { resetFields } } = this.props
    resetFields()
    this.handleQuery()
  }

  // 删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'device/deleteVirtualMonitoringDevice',
      payload: { id },
      success: () => {
        message.success('删除成功！');
        this.handleQuery();
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };


  /**
   * 获取已绑定监测设备列表
   */
  fetchBindedMonitoringDevice = ({
    payload = { pageNum: 1, pageSize: defaultPageSize },
    ...res
  } = {}) => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/fetchMonitoringDevice',
      ...res,
      payload: {
        ...payload,
        companyId: detail.companyId,
        targetId: detail.id,
      },
    });
  };

  /**
   * 获取可绑定监测设备列表
   */
  fetchMonitoringDevice = ({
    payload = { pageNum: 1, pageSize: defaultPageSize },
    ...res
  } = {}) => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/fetchMonitoringDevice',
      ...res,
      payload: {
        ...payload,
        companyId: detail.companyId,
        bindTargetStatus: 0, // 绑定状态 0 未绑定
        bindTargetId: detail.id,
      },
    });
  };

  /**
   * 打开已绑定传感器弹窗
   */
  handleViewBindedModal = detail => {
    this.setState({ detail }, () => {
      this.fetchBindedMonitoringDevice();
      this.setState({ bindedModalVisible: true });
    });
  };


  /**
   * 点击打开可绑定传感器弹窗
   */
  handleViewBind = detail => {
    this.setState({ detail, selectedKeys: [] }, () => {
      this.fetchMonitoringDevice();
      this.setState({ bindModalVisible: true });
    });
  };

  /**
   * 绑定传感器
   */
  handleBind = () => {
    const { dispatch } = this.props;
    const { selectedKeys, detail } = this.state;
    if (!selectedKeys || selectedKeys.length === 0) {
      message.warning('请勾选监测设备！');
      return;
    }
    dispatch({
      type: 'device/bindMonitoringDevice',
      payload: {
        bindStatus: 1, // 1 绑定
        targetId: detail.id,
        equipmentIdList: selectedKeys,
      },
      success: () => {
        message.success('绑定成功');
        this.setState({ bindModalVisible: false, detail: {} });
        this.handleQuery();
      },
      error: res => {
        message.error(res ? res.msg : '绑定失败');
      },
    });
  };


  /**
   * 解绑监测设备
   */
  handleunBind = id => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/bindMonitoringDevice',
      payload: {
        targetId: detail.id, // 监测对象id
        bindStatus: 0, // 0 解绑
        equipmentIdList: [id],
      },
      success: () => {
        message.success('解绑成功');
        this.fetchBindedMonitoringDevice();
        this.handleQuery();
      },
      error: res => {
        message.error(res ? res.msg : '解绑失败');
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
        deviceType: { list: deviceTypeOptions },
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
                {getFieldDecorator('type')(
                  <Select placeholder="类型">
                    {deviceTypeOptions.map(({ id, name }) => (
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
                <Button type="primary" onClick={() => { router.push('/device-management/virtual-monitoring-device/add') }}>新增</Button>
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
        virtualMonitoringDevice: {
          list,
          pagination: { pageNum, pageSize, total },
        },
        // 类型
        deviceType: { list: deviceTypeOptions },
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
        title: '基本信息',
        key: '基本信息',
        align: 'center',
        width: 400,
        render: (val, { name, code, type }) => {
          const typeItem = deviceTypeOptions.find(item => item.id === type) || {}
          return (
            <div style={{ textAlign: 'left' }}>
              <div>名称：{name || '暂无数据'}</div>
              <div>编号：{code || '暂无数据'}</div>
              <div>类型：{typeItem.name || '暂无数据'}</div>
            </div>
          )
        },
      },
      {
        title: '区域位置',
        dataIndex: 'areaLocation',
        align: 'center',
        width: 300,
      },
      {
        title: '已绑定监测设备',
        dataIndex: 'monitorEquipmentCount',
        key: 'monitorEquipmentCount',
        align: 'center',
        width: 120,
        render: (val, row) => (
          <span
            onClick={() => (val > 0 ? this.handleViewBindedModal(row) : null)}
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
        width: 230,
        render: (val, row) => (
          <Fragment>
            <a onClick={() => this.handleViewBind(row)}>绑定监测设备</a>
            <Divider type="vertical" />
            <a onClick={() => router.push(`/device-management/virtual-monitoring-device/edit/${row.id}`)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm
              title="确认要删除该监测设备吗？"
              onConfirm={() => this.handleDelete(row.id)}
            >
              <a>删除</a>
            </Popconfirm>
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
      modalLoading,
      device: { monitoringDevice },
    } = this.props;
    const { bindModalVisible, bindedModalVisible, selectedKeys } = this.state;

    const bindModalProps = {
      type: 'bind',
      visible: bindModalVisible,
      fetch: this.fetchMonitoringDevice,
      onCancel: () => {
        this.setState({ bindModalVisible: false });
      },
      onOk: this.handleBind,
      model: monitoringDevice,
      loading: modalLoading,
      rowSelection: {
        selectedRowKeys: selectedKeys,
        onChange: (selectedKeys) => { this.setState({ selectedKeys }) },
      },
      unbindAuthority: true,
    };
    const bindedModalProps = {
      type: 'unbind',
      visible: bindedModalVisible,
      fetch: this.fetchBindedMonitoringDevice,
      onCancel: () => {
        this.setState({ bindedModalVisible: false });
      },
      model: monitoringDevice,
      loading: modalLoading,
      handleUnbind: this.handleunBind,
      footer: null,
      unbindAuthority: true,
    };
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        {this.renderFilter()}
        {this.renderTable()}
        {/* 绑定监测设备弹窗 */}
        <MonitoringDeviceModal {...bindModalProps} />
        {/* 已绑定监测设备弹窗 */}
        <MonitoringDeviceModal {...bindedModalProps} />
      </PageHeaderLayout>
    )
  }
}
