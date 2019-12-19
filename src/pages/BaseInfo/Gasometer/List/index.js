import React, { Component, Fragment } from 'react';
import { Button, Input, Popconfirm, Card, Table, message, Empty, Modal, Spin } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { getPageSize, setPageSize } from '@/utils/utils';
import classNames from 'classnames';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

export const TITLE = '气柜管理';
export const LIST_PATH = '/major-hazard-info/gasometer/list';
export const ADD_PATH = '/major-hazard-info/gasometer/add';
export const EDIT_PATH = '/major-hazard-info/gasometer/edit';
export const DETAIL_PATH = '/major-hazard-info/gasometer/detail';
export const ADD_CODE = 'majorHazardInfo.gasometer.add';
export const EDIT_CODE = 'majorHazardInfo.gasometer.edit';
export const DETAIL_CODE = 'majorHazardInfo.gasometer.detail';
export const DELETE_CODE = 'majorHazardInfo.gasometer.delete';
export const BIND_CODE = 'majorHazardInfo.gasometer.bind';
export const TYPES = [
  {
    key: '0',
    value: '湿式',
  },
  {
    key: '1',
    value: '干式',
  },
];
export const MAJOR_HAZARD_STATUSES = [
  {
    key: '0',
    value: '否',
  },
  {
    key: '1',
    value: '是',
  },
];
const BREADCRUMB_LIST = [
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
    title: TITLE,
    name: TITLE,
  },
];
const GET_LIST = 'gasometer/getList';
const REMOVE = 'gasometer/remove';
const GET_MONITOR_DEVICE_LIST = 'gasometer/getMonitorDeviceList';
const SET_MONITOR_DEVICE_BIND_STATUS = 'gasometer/setMonitorDeviceBindStatus';

@connect(({
  gasometer,
  user,
  loading,
}) => ({
  gasometer,
  user,
  loading: loading.effects[GET_LIST],
  loadingMonitorDeviceList: loading.effects[GET_MONITOR_DEVICE_LIST],
}), dispatch => ({
  getList(payload, callback) {
    dispatch({
      type: GET_LIST,
      payload: {
        pageNum: 1,
        pageSize: getPageSize(),
        ...payload,
      },
      callback,
    });
  },
  remove(payload, callback) {
    dispatch({
      type: REMOVE,
      payload,
      callback,
    });
  },
  getMonitorDeviceList(payload, callback) {
    dispatch({
      type: GET_MONITOR_DEVICE_LIST,
      payload: {
        pageNum: 1,
        pageSize: getPageSize(),
        ...payload,
      },
      callback: (success, data) => {
        if (!success) {
          message.error('获取监测设备列表失败，请稍后重试或联系管理人员');
        }
        callback && callback(success, data);
      },
    });
  },
  setMonitorDeviceBindStatus(payload, callback) {
    dispatch({
      type: SET_MONITOR_DEVICE_BIND_STATUS,
      payload,
      callback,
    });
  },
}))
export default class GasometerList extends Component {
  state = {
    type: undefined, // 0为绑定，1为已绑定
    visible: false,
    data: undefined,
    bindIdList: undefined,
    binding: false,
    unbinding: false,
  }

  prevValues = {}

  prevValues2 = {}

  componentDidMount() {
    const {
      getList,
    } = this.props;
    getList();
  }

  setFormReference = form => {
    this.form = form;
  }

  setForm2Reference = form => {
    this.form2 = form;
  }

  reload = () => {
    const {
      gasometer: {
        list: {
          pagination: {
            pageNum=1,
            pageSize=getPageSize(),
          }={},
        }={},
      },
      getList,
    } = this.props;
    getList({
      ...this.prevValues,
      pageNum,
      pageSize,
    });
    this.form && this.form.setFieldsValue(this.prevValues);
  }

  reload2 = () => {
    const {
      gasometer: {
        monitorDeviceList: {
          pagination: {
            pageNum=1,
            pageSize=getPageSize(),
          }={},
        }={},
      },
      getMonitorDeviceList,
    } = this.props;
    const { data } = this.state;
    getMonitorDeviceList({
      ...this.prevValues2,
      pageNum,
      pageSize,
      companyId: data.companyId,
      targetId: data.id,
    });
    this.form2 && this.form2.setFieldsValue(this.prevValues2);
  }

  // 新增按钮点击事件
  handleAddButtonClick = () => {
    router.push(ADD_PATH);
  }

  // 绑定统计按钮点击事件
  handleBindCountButtonClick = (data) => {
    const {
      gasometer: {
        monitorDeviceList: {
          pagination: {
            pageSize=getPageSize(),
          }={},
        }={},
      },
      getMonitorDeviceList,
    } = this.props;
    getMonitorDeviceList({
      pageSize,
      companyId: data.companyId,
      targetId: data.id,
    });
    this.form2 && this.form2.resetFields();
    this.setState({
      type: 1,
      visible: true,
      data,
    });
  }

  // 绑定监测设备按钮点击事件
  handleBindButtonClick = (data) => {
    const {
      gasometer: {
        monitorDeviceList: {
          pagination: {
            pageSize=getPageSize(),
          }={},
        }={},
      },
      getMonitorDeviceList,
    } = this.props;
    getMonitorDeviceList({
      pageSize,
      companyId: data.companyId,
      bindTargetId: data.id,
      bindTargetStatus: 0,
    });
    this.form2 && this.form2.resetFields();
    this.setState({
      type: 0,
      visible: true,
      data,
      bindIdList: [],
    });
  }

  // 编辑按钮点击事件
  handleEditButtonClick = (e) => {
    const { id } = e.currentTarget.dataset;
    router.push(`${EDIT_PATH}/${id}`);
  }

  // 查看按钮点击事件
  handleDetailButtonClick = (e) => {
    const { id } = e.currentTarget.dataset;
    router.push(`${DETAIL_PATH}/${id}`);
  }

  // 删除按钮点击事件
  handleDeleteButtonClick = (id) => {
    const { remove } = this.props;
    remove({ id }, (success) => {
      if (success) {
        message.success('删除成功');
        this.reload();
      } else {
        message.error('删除失败，请稍后重试或联系管理人员！');
      }
    });
  }

  // 查询
  handleSearch = (values) => {
    const {
      gasometer: {
        list: {
          pagination: {
            pageSize=getPageSize(),
          }={},
        }={},
      },
      getList,
    } = this.props;
    this.prevValues = values;
    getList({
      ...values,
      pageSize,
    });
  }

  // 重置
  handleReset = (values) => {
    this.handleSearch(values);
  }

  // 表格change
  handleTableChange = ({ current, pageSize }) => {
    const {
      gasometer: {
        list: {
          pagination: {
            pageSize: prevPageSize=getPageSize(),
          }={},
        }={},
      },
      getList,
    } = this.props;
    getList({
      ...this.prevValues,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    });
    this.form && this.form.setFieldsValue(this.prevValues);
    prevPageSize !== pageSize && setPageSize(pageSize);
  }

  // 模态框搜索
  handleModalSearch = (values) => {
    const {
      gasometer: {
        monitorDeviceList: {
          pagination: {
            pageSize=getPageSize(),
          }={},
        }={},
      },
      getMonitorDeviceList,
    } = this.props;
    const { type, data } = this.state;
    this.prevValues2 = values;
    getMonitorDeviceList({
      ...values,
      pageSize,
      companyId: data.companyId,
      ...(type ? {
        targetId: data.id,
      } : {
        bindTargetId: data.id,
        bindTargetStatus: 0,
      }),
    });
  }

  // 模态框重置
  handleModalReset = (values) => {
    this.handleModalSearch(values);
    this.setState({
      bindIdList: [],
    });
  }

  // 模态框表格change
  handleModalTableChange = ({ current, pageSize }) => {
    const {
      gasometer: {
        monitorDeviceList: {
          pagination: {
            pageSize: prevPageSize=getPageSize(),
          }={},
        }={},
      },
      getMonitorDeviceList,
    } = this.props;
    const { type, data } = this.state;
    getMonitorDeviceList({
      ...this.prevValues2,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
      companyId: data.companyId,
      ...(type ? {
        targetId: data.id,
      } : {
        bindTargetId: data.id,
        bindTargetStatus: 0,
      }),
    });
    this.form2 && this.form2.setFieldsValue(this.prevValues2);
    prevPageSize !== pageSize && setPageSize(pageSize);
  }

  // 模态框确定
  handleModalOk = () => {
    const {
      setMonitorDeviceBindStatus,
    } = this.props;
    const { bindIdList, data } = this.state;
    this.setState({
      binding: true,
    });
    setMonitorDeviceBindStatus({
      bindStatus: 1,
      targetId: data.id,
      equipmentIdList: bindIdList,
    }, (success) => {
      if (success) {
        message.success('绑定成功！');
        this.setState({
          visible: false,
          binding: false,
        });
        this.reload();
      } else {
        message.error('绑定失败！');
        this.setState({
          binding: false,
        });
      }
    });
  }

  // 模态框取消
  handleModalCancel = () => {
    const {
      gasometer: {
        monitorDeviceList: {
          pagination: {
            total,
          }={},
        }={},
      },
    } = this.props;
    const { type, data } = this.state;
    this.setState({
      visible: false,
    });
    if (type && total !== data.monitorEquipmentCount) {
      this.reload();
    }
  }

  // 解绑按钮点击事件
  handleUnbindButtonClick = (id) => {
    const { setMonitorDeviceBindStatus } = this.props;
    const { data } = this.state;
    this.setState({
      unbinding: true,
    });
    setMonitorDeviceBindStatus({
      bindStatus: 0,
      targetId: data.id,
      equipmentIdList: [id],
    }, (success) => {
      if (success) {
        message.success('解绑成功！');
        this.reload2();
      } else {
        message.error('解绑失败！');
      }
      this.setState({
        unbinding: false,
      });
    });
  }

  handleBindIdListChange = (bindIdList) => {
    this.setState({
      bindIdList,
    });
  }

  renderForm() {
    const {
      user: {
        currentUser: {
          unitType,
          permissionCodes,
        },
      },
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);

    const fields = [
      {
        id: 'gasholderName',
        label: '气柜名称',
        transform: value => value.trim(),
        render: ({ handleSearch }) => <Input placeholder="请输入气柜名称" onPressEnter={handleSearch} maxLength={50} />,
      },
      {
        id: 'unifiedCode',
        label: '统一编码',
        transform: value => value.trim(),
        render: ({ handleSearch }) => <Input placeholder="请输入统一编码" onPressEnter={handleSearch} maxLength={50} />,
      },
      {
        id: 'gasholderType',
        label: '气柜类型',
        render: () => <SelectOrSpan placeholder="请选择气柜类型" list={TYPES} allowClear />,
      },
      {
        id: 'chineName',
        label: '存储介质',
        transform: value => value.trim(),
        render: ({ handleSearch }) => <Input placeholder="请输入存储介质" onPressEnter={handleSearch} maxLength={50} />,
      },
      {
        id: 'casNo',
        label: 'CAS号',
        transform: value => value.trim(),
        render: ({ handleSearch }) => <Input placeholder="请输入CAS号" onPressEnter={handleSearch} maxLength={50} />,
      },
      ...(isNotCompany ? [
        {
          id: 'companyName',
          label: '单位名称',
          transform: value => value.trim(),
          render: ({ handleSearch }) => <Input placeholder="请输入单位名称" onPressEnter={handleSearch} maxLength={50} />,
        },
      ] : []),
    ];

    return (
      <Card className={styles.card} bordered={false}>
        <CustomForm
          fields={fields}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          action={(
            <Button type="primary" onClick={this.handleAddButtonClick} disabled={!hasAddAuthority}>新增</Button>
          )}
          ref={this.setFormReference}
        />
      </Card>
    );
  }

  renderTable() {
    const {
      gasometer: {
        list: {
          list=[],
          pagination: {
            total,
            pageNum,
            pageSize,
          }={},
        }={},
      },
      user: {
        currentUser: {
          permissionCodes,
          unitType,
        },
      },
      loading=false,
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasBindAuthority = permissionCodes.includes(BIND_CODE);
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    const hasDeleteAuthority = permissionCodes.includes(DELETE_CODE);
    const columns = [
      ...(isNotCompany ? [
        {
          title: '单位名称',
          dataIndex: 'companyName',
          align: 'center',
        },
      ] : []),
      {
        title: '基本信息',
        dataIndex: 'basicInfo',
        render: (_, { unifiedCode, gasholderName }) => (
          <div className={styles.multi}>
            <div><span className={styles.label}>统一编码：</span>{unifiedCode}</div>
            <div><span className={styles.label}>气柜名称：</span>{gasholderName}</div>
          </div>
        ),
        align: 'center',
      },
      {
        title: '存储介质',
        dataIndex: 'storageMedium',
        render: (_, { chineName, casNo }) => (
          <div className={styles.multi}>
            <div><span className={styles.label}>存储介质：</span>{chineName}</div>
            <div><span className={styles.label}>CAS号：</span>{casNo}</div>
          </div>
        ),
        align: 'center',
      },
      {
        title: '构成重大危险源',
        dataIndex: 'majorHazard',
        render: value => <SelectOrSpan type="span" list={MAJOR_HAZARD_STATUSES} value={`${value}`} />,
        align: 'center',
      },
      {
        title: '区域位置',
        dataIndex: 'regionalLocation',
        align: 'center',
      },
      {
        title: '已绑监测设备',
        dataIndex: 'monitorEquipmentCount',
        width: 116,
        fixed: list && list.length > 0 ? 'right' : false,
        render: (value, data) => <span className={classNames(styles.operation, !+value && styles.disabled)} onClick={value > 0 ? () => this.handleBindCountButtonClick(data) : undefined}>{value || 0}</span>,
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: 164,
        fixed: list && list.length > 0 ? 'right' : false,
        render: (id, data) => (
          <Fragment>
            {<span className={classNames(styles.operation, !hasBindAuthority && styles.disabled)} onClick={hasBindAuthority ? () => this.handleBindButtonClick(data) : undefined}>绑定监测设备</span>}
            {<span className={classNames(styles.operation, !hasDetailAuthority && styles.disabled)} onClick={hasDetailAuthority ? this.handleDetailButtonClick : undefined} data-id={id}>查看</span>}
            {<span className={classNames(styles.operation, !hasEditAuthority && styles.disabled)} onClick={hasEditAuthority ? this.handleEditButtonClick : undefined} data-id={id}>编辑</span>}
            {hasDeleteAuthority ? (
              <Popconfirm title="你确定要删除吗?" onConfirm={() => this.handleDeleteButtonClick(id)}>
                <span className={styles.operation}>删除</span>
              </Popconfirm>
            ) : (
              <span className={classNames(styles.operation, styles.disabled)}>删除</span>
            )}
          </Fragment>
        ),
        align: 'center',
      },
    ];

    return (
      <Card className={styles.card} bordered={false}>
        <Spin spinning={loading}>
          {list && list.length > 0 ? (
            <Table
              className={styles.table}
              dataSource={list}
              columns={columns}
              rowKey="id"
              scroll={{
                x: true,
              }}
              onChange={this.handleTableChange}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                pageSizeOptions: ['5', '10', '15', '20'],
                // showTotal: total => `共 ${total} 条`,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
            />
          ) : (
            <Empty />
          )}
        </Spin>
      </Card>
    );
  }

  renderModal = () => {
    const {
      gasometer: {
        monitorDeviceList: {
          list=[],
          pagination: {
            total,
            pageNum,
            pageSize,
          }={},
        }={},
      },
      loadingMonitorDeviceList=false,
    } = this.props;
    const { type, visible, bindIdList, binding, unbinding } = this.state;
    const fields = [
      {
        id: 'name',
        label: '监测设备名称',
        transform: value => value.trim(),
        render: ({ handleSearch }) => <Input placeholder="请输入监测设备名称" onPressEnter={handleSearch} maxLength={50} />,
      },
      {
        id: 'code',
        label: '监测设备编码',
        transform: value => value.trim(),
        render: ({ handleSearch }) => <Input placeholder="请输入监测设备编码" onPressEnter={handleSearch} maxLength={50} />,
      },
    ];
    const columns = [
      {
        title: '监测设备名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '监测设备编码',
        dataIndex: 'code',
        align: 'center',
      },
      {
        title: '监测设备类型',
        dataIndex: 'equipmentTypeName',
        align: 'center',
      },
      ...(type ? [{
        title: '操作',
        dataIndex: 'id',
        width: 88,
        fixed: list && list.length > 0 ? 'right' : false,
        render: (id) => (
          <Popconfirm title="你确定要解绑吗?" onConfirm={() => this.handleUnbindButtonClick(id)}>
            <span className={styles.operation}>解绑</span>
          </Popconfirm>
        ),
        align: 'center',
      }] : []),
    ];

    return (
      <Modal
        title={type ? '已绑定监测设备' : '绑定监测设备'}
        visible={visible}
        onOk={this.handleModalOk}
        onCancel={this.handleModalCancel}
        footer={type ? null : undefined}
        confirmLoading={binding}
        width="60%"
        okButtonProps={{
          disabled: !(bindIdList && bindIdList.length),
        }}
      >
        <CustomForm
          className={styles.modalForm}
          fields={fields}
          onSearch={this.handleModalSearch}
          onReset={this.handleModalReset}
          ref={this.setForm2Reference}
        />
        <Spin spinning={loadingMonitorDeviceList || unbinding}>
          {list && list.length > 0 ? (
            <Table
              className={styles.table}
              dataSource={list}
              columns={columns}
              rowKey="id"
              scroll={{
                x: true,
              }}
              onChange={this.handleModalTableChange}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                pageSizeOptions: ['5', '10', '15', '20'],
                showTotal: total => `共 ${total} 条`,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
              rowSelection={type ? undefined : {
                selectedRowKeys: bindIdList,
                onChange: this.handleBindIdListChange,
              }}
            />
          ) : (
            <Empty />
          )}
        </Spin>
      </Modal>
    );
  }

  render() {
    const {
      user: {
        currentUser: {
          unitType,
        },
      },
      gasometer: {
        list: {
          a=0,
          pagination: {
            total=0,
          }={},
        }={},
      },
    } = this.props;
    const isNotCompany = unitType !== 4;

    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        content={(
          <Fragment>
            {isNotCompany && <span className={styles.count}>{`单位数量：${a}`}</span>}
            <span className={styles.count}>{`气柜总数：${total}`}</span>
            {/* <span className={styles.count}>{`已绑传感器数：${total}`}</span> */}
          </Fragment>
        )}
      >
        {this.renderForm()}
        {this.renderTable()}
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}

