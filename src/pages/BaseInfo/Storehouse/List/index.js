import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Input,
  Pagination,
  Select,
  Button,
  Table,
  Spin,
  Divider,
  message,
} from 'antd';
import router from 'umi/router';
import { hasAuthority, AuthA, AuthPopConfirm } from '@/utils/customAuth';
import InlineForm from '../../../BaseInfo/Company/InlineForm';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
import MonitoringDeviceModal from '@/pages/DeviceManagement/Components/MonitoringDeviceModal';

import styles from './index.less';

const {
  baseInfo: {
    storehouse: {
      // detail: detailCode,
      edit: editCode,
      add: addCode,
      delete: deleteCode,
      bindSensor: bindSensorCode,
      unbindSensor: unbindSensorCode,
    },
  },
} = codes;
const addUrl = '/major-hazard-info/storehouse/add';
const defaultPageSize = 10;

const { Option } = Select;
const title = '库房管理';
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '重大危险源基本信息',
    name: '重大危险源基本信息',
  },
  {
    title,
    name: title,
  },
];

/* 去除两边空格 */
const transform = value => value.trim();
/* 设置相对定位 */
const getRootChild = () => document.querySelector('#root>div');

@connect(({ storehouse, user, device, loading }) => ({
  storehouse,
  user,
  device,
  loading: loading.models.storehouse,
  modalLoading: loading.effects['device/fetchMonitoringDevice'],
}))
export default class StorehouseList extends PureComponent {
  state = {
    formData: {},
    bindModalVisible: false, // 绑定弹窗
    bindedModalVisible: false, // 已绑定弹窗
    detail: {}, // 库房信息
    selectedKeys: [], // 弹窗选择的设备key数组
  };

  componentDidMount () {
    this.fetchList(1);
    // this.fetchCompanyNum();
  }

  pageNum = 1;
  pageSize = 10;

  fetchList = (pageNum, pageSize = 10, filters = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storehouse/fetchStorehouseList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
      },
    });
  };

  /**
   * 获取传感器数量和单位数量统计
   */
  fetchCompanyNum = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storehouse/fetchCountCompanyNum',
    });
  };

  renderForm = () => {
    const {
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;
    const fields = [
      {
        id: 'name',
        render () {
          return <Input placeholder="请输入库房名称" />;
        },
        transform,
      },
      {
        id: 'code',
        render () {
          return <Input placeholder="请输入库房编号" />;
        },
        transform,
      },
      {
        id: 'position',
        render () {
          return <Input placeholder="请输入区域位置" />;
        },
        transform,
      },
      {
        id: 'dangerSource',
        render () {
          const options = [{ value: '0', name: '否' }, { value: '1', name: '是' }];
          return (
            <Select
              allowClear
              showSearch
              placeholder="是否是重大危险源"
              getPopupContainer={getRootChild}
              style={{ width: '100%' }}
            >
              {options.map(item => {
                const { value, name } = item;
                return (
                  <Option value={value} key={value}>
                    {name}
                  </Option>
                );
              })}
            </Select>
          );
        },
      },
      {
        id: 'aName',
        render () {
          return <Input placeholder="请输入库区名称" />;
        },
        transform,
      },
      {
        id: 'companyName',
        render () {
          return <Input placeholder="请输入单位名称" />;
        },
        transform,
      },
    ];

    // 是否有新增权限
    const hasAddAuthority = hasAuthority(addCode, permissionCodes);

    return (
      <Card>
        <InlineForm
          fields={unitType === 4 ? fields.slice(0, fields.length - 1) : fields}
          gutter={{ lg: 48, md: 24 }}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          action={
            <Button type="primary" onClick={this.goToAdd} disabled={!hasAddAuthority}>
              新增库房
            </Button>
          }
        />
      </Card>
    );
  };

  goToAdd = () => {
    router.push(addUrl);
  };

  handleSearch = values => {
    this.setState({ formData: { ...values } });
    this.fetchList(1, this.pageSize, { ...values });
  };

  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  goEdit = id => {
    router.push(`/major-hazard-info/storehouse/edit/${id}`);
  };

  // 表格改变触发，包含分页变动
  handleTableChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    const { formData } = this.state;
    dispatch({
      type: 'storehouse/deleteStorehouse',
      payload: {
        id,
      },
      success: () => {
        message.success('删除成功！');
        this.fetchList(this.pageNum, this.pageSize, { ...formData });
        // this.fetchCompanyNum();
      },
      error: msg => {
        message.error(msg);
      },
    });
  };

  /**
   * 绑定时选择监测设备
   */
  onModalSelectedChange = selectedKeys => {
    this.setState({ selectedKeys });
  };

  /**
   * 获取可绑定监测设备列表
   */
  fetchMonitoringDevice = ({ payload = { pageNum: 1, pageSize: defaultPageSize }, ...res } = {}) => {
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
   * 获取已绑定监测设备列表
   */
  fetchBindedMonitoringDevice = ({ payload = { pageNum: 1, pageSize: defaultPageSize }, ...res } = {}) => {
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
   * 点击打开可绑定监测设备弹窗
   */
  handleViewBind = detail => {
    this.setState({ detail, selectedKeys: [] }, () => {
      this.fetchMonitoringDevice();
      this.setState({ bindModalVisible: true });
    });
  };

  /**
   * 绑定监测设备
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
        this.fetchList(1);
        // this.fetchCompanyNum();
      },
      error: res => {
        message.error(res ? res.msg : '绑定失败');
      },
    });
  };

  /**
   * 打开已绑定监测设备弹窗
   */
  handleViewBindedModal = detail => {
    this.setState({ detail }, () => {
      this.fetchBindedMonitoringDevice();
      this.setState({ bindedModalVisible: true });
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
        targetId: detail.id, // 监测对象id（库房id）
        bindStatus: 0,// 0 解绑
        equipmentIdList: [id],
      },
      success: () => {
        message.success('解绑成功');
        this.fetchBindedMonitoringDevice();
        this.fetchList(1);
        // this.fetchCompanyNum();
      },
      error: res => {
        message.error(res ? res.msg : '解绑失败');
      },
    });
  };

  render () {
    const {
      modalLoading,
      user: { currentUser: { unitType, permissionCodes } },
      loading = false,
      storehouse: {
        list,
        pagination: { pageNum = 1, pageSize = 10, total = 0 } = {},
        countCompanyNum = 0,
      },
      device: { monitoringDevice },
    } = this.props;
    const { bindModalVisible, bindedModalVisible, selectedKeys } = this.state;
    // 解绑权限
    const unbindAuthority = hasAuthority(unbindSensorCode, permissionCodes)
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        width: 300,
      },
      {
        title: '基本信息',
        dataIndex: 'basicInfo',
        key: 'basicInfo',
        align: 'center',
        width: 250,
        render: (data, record) => {
          const { code, number, name, area, dangerSource } = record;
          return (
            <div className={styles.multi}>
              <div>库房编号：{code}</div>
              <div>库房序号：{number}</div>
              <div>库房名称：{name}</div>
              <div>库房面积（㎡）：{area}</div>
              <div>重大危险源：{dangerSource === '0' ? '否' : '是'}</div>
            </div>
          );
        },
      },
      {
        title: '所属库区',
        dataIndex: 'areaInfo',
        key: 'areaInfo',
        align: 'center',
        width: 240,
        render: (data, record) => {
          const { anumber, aname } = record;
          return (
            <div className={styles.multi}>
              <div>库区编号：{anumber}</div>
              <div> 库区名称：{aname}</div>
            </div>
          );
        },
      },
      {
        title: '贮存物质名称',
        dataIndex: 'materialsName',
        key: 'materialsName',
        align: 'center',
        width: 250,
        render: data =>
          data ? (
            <div className={styles.multi}>
              {JSON.parse(data).map(item => (
                <div key={item.materialId}>
                  {item.chineName + (item.unitChemiclaNum ? item.unitChemiclaNum + '吨' : '')}
                </div>
              ))}
            </div>
          ) : (''),
      },
      {
        title: '区域位置',
        dataIndex: 'position',
        key: 'position',
        align: 'center',
        width: 120,
      },
      {
        title: '已绑定监测设备',
        dataIndex: 'monitorEquipmentCount',
        key: 'monitorEquipmentCount',
        align: 'center',
        width: 150,
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
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 220,
        render: (data, record) => (
          <span>
            <AuthA code={bindSensorCode} onClick={() => this.handleViewBind(record)}>
              绑定监测设备
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.goEdit(record.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确认要删除该库房吗？"
              onConfirm={() => this.handleDelete(record.id)}
            >
              删除
            </AuthPopConfirm>
          </span>
        ),
      },
    ];
    const bindModalProps = {
      type: 'bind',
      visible: bindModalVisible,
      fetch: this.fetchMonitoringDevice,
      onCancel: () => {
        this.setState({ bindModalVisible: false });
      },
      selectedKeys,
      onOk: this.handleBind,
      model: monitoringDevice,
      loading: modalLoading,
      rowSelection: {
        selectedRowKeys: selectedKeys,
        onChange: this.onModalSelectedChange,
      },
      unbindAuthority,
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
      unbindAuthority,
    };
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位数量：
            {countCompanyNum}
            <span style={{ marginLeft: 15 }}>
              库房数量：
              {total}
            </span>
          </div>
        }
      >
        {this.renderForm()}
        {list && list.length ? (
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="id"
              loading={loading}
              columns={unitType === 4 ? columns.slice(1, columns.length) : columns}
              dataSource={list}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />
            <Pagination
              style={{ marginTop: '20px', float: 'right' }}
              // showTotal={false}
              showQuickJumper
              showSizeChanger
              pageSizeOptions={['5', '10', '15', '20']}
              pageSize={pageSize}
              current={pageNum}
              total={total}
              onChange={this.handleTableChange}
              onShowSizeChange={this.handleTableChange}
            // showTotal={total => `共 ${total} 条`}
            />
          </Card>
        ) : (
            <Spin spinning={loading}>
              <Card style={{ marginTop: '20px', textAlign: 'center' }}>
                <span>暂无数据</span>
              </Card>
            </Spin>
          )}
        {/* 绑定监测设备弹窗 */}
        <MonitoringDeviceModal {...bindModalProps} />
        {/* 已绑定监测设备弹窗 */}
        <MonitoringDeviceModal {...bindedModalProps} />
      </PageHeaderLayout>
    );
  }
}
