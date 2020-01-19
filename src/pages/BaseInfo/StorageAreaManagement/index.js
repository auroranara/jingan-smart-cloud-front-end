import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Button,
  Input,
  Select,
  Table,
  Divider,
  Pagination,
  Spin,
  message,
} from 'antd';
import router from 'umi/router';
import { hasAuthority, AuthA, AuthButton, AuthPopConfirm } from '@/utils/customAuth';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codes from '@/utils/codes';
// 选择监测设备弹窗
import MonitoringDeviceModal from '@/pages/DeviceManagement/Components/MonitoringDeviceModal';
import styles from './Edit.less';

const {
  baseInfo: {
    storageAreaManagement: {
      detail: detailCode,
      edit: editCode,
      add: addCode,
      delete: deleteCode,
      bind: bindCode,
      unbind: unbindCode,
    },
  },
} = codes;
const { Option } = Select;
// 标题
const title = '储罐区管理';
const defaultPageSize = 10;
const dangerTypeList = [{ key: '1', value: '是' }, { key: '0', value: '否' }];

//面包屑
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
    name: '储罐区管理',
  },
];

const spanStyle = { md: 8, sm: 12, xs: 24 };
const fields = [
  {
    id: 'areaName',
    label: '储罐区名称',
    span: spanStyle,
    render: () => <Input placeholder="请输入" />,
    transform: v => v.trim(),
  },
  {
    id: 'code',
    label: '统一编码',
    span: spanStyle,
    render: () => <Input placeholder="请输入" />,
    transform: v => v.trim(),
  },
  {
    id: 'location',
    label: '区域位置',
    span: spanStyle,
    render: () => <Input placeholder="请输入" />,
    transform: v => v.trim(),
  },
  {
    id: 'chineName',
    label: '存储介质',
    span: spanStyle,
    render: () => <Input placeholder="请输入" />,
    transform: v => v.trim(),
  },
  {
    id: 'isDanger',
    label: '是否重大危险源',
    span: spanStyle,
    render: () => (
      <Select allowClear placeholder="请选择">
        {dangerTypeList.map(({ key, value }) => (
          <Option key={key} value={key}>
            {value}
          </Option>
        ))}
      </Select>
    ),
  },
  {
    id: 'companyName',
    label: '单位名称',
    span: spanStyle,
    render: () => <Input placeholder="请输入单位名称" />,
    transform: v => v.trim(),
  },
];

@connect(({ loading, storageAreaManagement, user, device }) => ({
  loading: loading.models.storageAreaManagement,
  storageAreaManagement,
  user,
  device,
  modalLoading: loading.effects['device/fetchMonitoringDevice'],
}))
@Form.create()
export default class StorageAreaManagement extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      bindModalVisible: false,
      bindedModalVisible: false,
      selectedKeys: [],
    };
    this.exportButton = (
      <Button type="primary" href={`#/major-hazard-info/storage-area-management/add`}>
        新增
      </Button>
    );
    this.pageNum = 1;
    this.pageSize = 10;
    this.toolbar = null;
  }

  // 挂载后
  componentDidMount () {
    this.handleQuery();
  }

  handleQuery = (pageNum = 1, pageSize = 10) => {
    const { dispatch } = this.props;
    const values = this.toolbar.props.form.getFieldsValue();
    dispatch({
      type: 'storageAreaManagement/fetchTankAreaList',
      payload: {
        ...values,
        pageNum,
        pageSize,
      },
    });
  }

  // 重置
  handleReset = () => {
    this.setState({ formData: {} });
    this.handleQuery(1, this.pageSize);
  };

  goDetail = id => {
    router.push(`/major-hazard-info/storage-area-management/detail/${id}`);
  };

  goEdit = id => {
    router.push(`/major-hazard-info/storage-area-management/edit/${id}`);
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storageAreaManagement/deleteTankArea',
      payload: {
        id,
      },
      success: () => {
        message.success('删除成功！');
        this.handleQuery(this.pageNum, this.pageSize);
      },
      error: msg => {
        message.error(msg);
      },
    });
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
   * 绑定时选择传感器
   */
  onModalSelectedChange = selectedKeys => {
    this.setState({ selectedKeys });
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
   * 打开已绑定传感器弹窗
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
        this.handleQuery();
      },
      error: res => {
        message.error(res ? res.msg : '解绑失败');
      },
    });
  };

  // 渲染表格
  renderTable = () => {
    const {
      loading,
      user: {
        currentUser: { unitType },
      },
      storageAreaManagement: {
        list,
        pagination: { pageNum, pageSize, total },
      },
    } = this.props;

    const columns = [
      {
        title: '单位名称',
        key: 'companyName',
        dataIndex: 'companyName',
        align: 'center',
        width: 300,
      },
      {
        title: '基本信息',
        key: 'info',
        dataIndex: 'info',
        align: 'center',
        width: 300,
        render: (val, row) => {
          const { code, areaName, tankCount } = row;
          return (
            <div className={styles.multi}>
              <div>统一编码：{code || '暂无数据'} </div>
              <div>储罐区名称： {areaName || '暂无数据'}</div>
              <div>储罐个数： {tankCount || 0}</div>
            </div>
          );
        },
      },
      {
        title: '存储介质',
        key: 'chineNameList',
        dataIndex: 'chineNameList',
        align: 'center',
        width: 300,
        render: val => val && val.join(', '),
      },
      {
        title: '重大危险源',
        key: 'isDanger',
        dataIndex: 'isDanger',
        align: 'center',
        width: 120,
        render: val => (+val === 0 ? '否' : '是'),
      },
      {
        title: '区域位置',
        key: 'location',
        dataIndex: 'location',
        align: 'center',
        width: 200,
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
        key: '操作',
        align: 'center',
        fixed: 'right',
        width: 270,
        render: (val, row) => (
          <Fragment>
            <AuthA code={bindCode} onClick={() => this.handleViewBind(row)}>
              绑定监测设备
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={detailCode} onClick={() => this.goDetail(row.id)}>
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.goEdit(row.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              code={deleteCode}
              title="确认要删除该储罐区吗？"
              onConfirm={() => this.handleDelete(row.id)}
            >
              删除
            </AuthPopConfirm>
          </Fragment>
        ),
      },
    ];

    return list && list.length ? (
      <Spin spinning={loading}>
        <Card style={{ marginTop: '24px' }}>
          <Table
            rowKey="id"
            // loading={loading}
            columns={unitType === 4 ? columns.slice(1, columns.length) : columns}
            dataSource={list}
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
          {/* <Pagination
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
          /> */}
        </Card>
      </Spin>
    ) : (
        <Spin spinning={loading}>
          <Card style={{ marginTop: '20px', textAlign: 'center' }}>
            <span>暂无数据</span>
          </Card>
        </Spin>
      );
  };

  render () {
    const {
      modalLoading,
      user: { currentUser: { permissionCodes, unitType } },
      storageAreaManagement: {
        a: companyNum,
        pagination: { total },
      },
      device: { monitoringDevice },
    } = this.props;
    const { bindModalVisible, bindedModalVisible, selectedKeys } = this.state;
    // 解绑权限
    const unbindAuthority = hasAuthority(unbindCode, permissionCodes)
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
            {unitType !== 4 && (
              <span>
                单位数量：
                {companyNum}
              </span>
            )}
            <span style={{ paddingLeft: unitType === 4 ? 0 : 20 }}>
              储罐区总数：
              {total}
            </span>
          </div>
        }
      >
        <Card>
          <ToolBar
            fields={unitType === 4 ? fields.slice(0, fields.length - 1) : fields}
            onSearch={() => this.handleQuery()}
            onReset={this.handleReset}
            action={
              <AuthButton
                code={addCode}
                type="primary"
                href={`#/major-hazard-info/storage-area-management/add`}
                disabled={false}
              >
                新增
              </AuthButton>
            }
            wrappedComponentRef={ref => { this.toolbar = ref }}
          />
        </Card>

        {this.renderTable()}
        {/* 绑定监测设备弹窗 */}
        <MonitoringDeviceModal {...bindModalProps} />
        {/* 已绑定监测设备弹窗 */}
        <MonitoringDeviceModal {...bindedModalProps} />
      </PageHeaderLayout>
    );
  }
}
