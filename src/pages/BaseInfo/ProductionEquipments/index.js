import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Table, message, Divider } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import codes from '@/utils/codes';
import { hasAuthority, AuthA, AuthPopConfirm, AuthLink } from '@/utils/customAuth';
import MonitoringDeviceModal from '@/pages/DeviceManagement/Components/MonitoringDeviceModal';

import {
  BREADCRUMBLIST,
  // LIST,
  // PAGE_SIZE,
  ROUTER,
  SEARCH_FIELDS as FIELDS,
  TABLE_COLUMNS as COLUMNS,
} from './utils';

// 权限
const {
  baseInfo: {
    productionEquipments: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      bindSensor: bindCode,
      unbindSensor: unbindCode,
    },
  },
} = codes;
const defaultPageSize = 10;

@connect(({ productionEquipments, user, device, loading }) => ({
  productionEquipments,
  device,
  user,
  loading: loading.models.productionEquipments,
  modalLoading: loading.effects['device/fetchMonitoringDevice'],
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      bindModalVisible: false,
      bindedModalVisible: false,
      selectedKeys: [],
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    this.fetchList();
  }

  // 获取列表
  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productionEquipments/fetchProEquipList',
      payload: {
        ...params,
        pageSize,
        pageNum,
      },
    });
  };

  handleSearch = values => {
    this.setState({ formData: { ...values } });
    this.fetchList(1, this.pageSize, { ...values });
  };

  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  handlePageChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  handleDeleteClick = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productionEquipments/fetchProEquipDel',
      payload: { ids: id },
      success: () => {
        this.fetchList();
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };

  // 获取可绑定监测设备列表
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

  // 获取已绑定监测设备列表
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

  // 绑定时选择传感器
  onModalSelectedChange = selectedKeys => {
    this.setState({ selectedKeys });
  };

  // 点击打开可绑定传感器弹窗
  handleViewBind = detail => {
    this.setState({ detail, selectedKeys: [] }, () => {
      this.fetchMonitoringDevice();
      this.setState({ bindModalVisible: true });
    });
  };

  // 绑定传感器
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
        this.handleSearch();
      },
      error: res => {
        message.error(res ? res.msg : '绑定失败');
      },
    });
  };

  // 打开已绑定传感器弹窗
  handleViewBindedModal = detail => {
    this.setState({ detail }, () => {
      this.fetchBindedMonitoringDevice();
      this.setState({ bindedModalVisible: true });
    });
  };

  // 解绑监测设备
  handleunBind = id => {
    const { dispatch } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'device/bindMonitoringDevice',
      payload: {
        targetId: detail.id, // 监测对象id（库房id）
        bindStatus: 0, // 0 解绑
        equipmentIdList: [id],
      },
      success: () => {
        message.success('解绑成功');
        this.fetchBindedMonitoringDevice();
        this.handleSearch();
      },
      error: res => {
        message.error(res ? res.msg : '解绑失败');
      },
    });
  };

  render() {
    const {
      loading,
      modalLoading,
      productionEquipments: {
        proData: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
        msg,
      },
      user: {
        currentUser: { unitType, permissionCodes },
      },
      device: { monitoringDevice },
    } = this.props;

    const { bindModalVisible, bindedModalVisible, selectedKeys } = this.state;
    // 解绑权限
    const unbindAuthority = hasAuthority(unbindCode, permissionCodes);
    const addAuth = hasAuthority(addCode, permissionCodes);

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });
    const toolBarAction = (
      <Button
        type="primary"
        disabled={!addAuth}
        onClick={this.handleAdd}
        style={{ marginTop: '8px' }}
      >
        新增
      </Button>
    );

    const extraColumns = [
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 250,
        render: (val, row) => (
          <Fragment>
            <AuthA code={bindCode} onClick={() => this.handleViewBind(row)}>
              绑定监测设备
            </AuthA>
            <Divider type="vertical" />
            <AuthLink to={`${ROUTER}/edit/${row.id}`} code={editCode}>
              编辑
            </AuthLink>
            <Divider type="vertical" />
            <AuthPopConfirm
              title="确认要删除数据吗？"
              code={deleteCode}
              onConfirm={() => this.handleDeleteClick(row.id)}
            >
              删除
            </AuthPopConfirm>
          </Fragment>
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
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>单位数量: {msg}</span>
            <span style={{ paddingLeft: 20 }}>装置总数: {total}</span>
            <span style={{ paddingLeft: 10 }}>已绑定传感器数: {''}</span>
          </div>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={unitType === 4 ? [...FIELDS.slice(1, FIELDS.length)] : [...FIELDS]}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonSpan={{ xl: 8, sm: 12, xs: 24 }}
          />
        </Card>
        <div className={styles1.container}>
          {list.length > 0 ? (
            <Table
              bordered
              rowKey="id"
              loading={loading}
              scroll={{ x: 'max-content' }}
              columns={
                unitType === 4
                  ? [...COLUMNS.slice(1, COLUMNS.length), ...extraColumns]
                  : [...COLUMNS, ...extraColumns]
              }
              dataSource={list}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '15', '20'],
                onChange: this.handlePageChange,
                onShowSizeChange: (num, size) => {
                  this.handlePageChange(1, size);
                },
              }}
            />
          ) : (
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <span>暂无数据</span>
            </Card>
          )}
        </div>
        {/* 绑定监测设备弹窗 */}
        <MonitoringDeviceModal {...bindModalProps} />
        {/* 已绑定监测设备弹窗 */}
        <MonitoringDeviceModal {...bindedModalProps} />
      </PageHeaderLayout>
    );
  }
}
