import React, { Component, Fragment } from 'react';
import { Input, Select, Spin, Card, Button, Table, Modal, Popconfirm, message } from 'antd'
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import classNames from 'classnames';
import codes from '@/utils/codes';
import { AuthButton } from '@/utils/customAuth';
import styles from './index.less';

const { Option } = Select;
const title = '网关设备管理';
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '物联设备管理',
    name: '物联设备管理',
  },
  {
    title,
    name: title,
  },
];
const DEFAULT_FORMAT = 'YYYY.MM.DD';
const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 10;
const DETAIL_CODE = 'deviceManagement.gateway.detail';
const ADD_CODE = 'deviceManagement.gateway.add';
const EDIT_CODE = 'deviceManagement.gateway.edit';
const DELETE_CODE = 'deviceManagement.gateway.delete';
const { deviceManagement: { gateway: { add: addCode } } } = codes

@connect(({
  gateway,
  user,
  loading,
}) => ({
  gateway,
  user,
  loadingList: loading.effects['gateway/fetchList'],
  loadingBinding: loading.effects['gateway/fetchBindingList'],
}), (dispatch) => ({
  getList(payload, callback) {
    dispatch({
      type: 'gateway/fetchList',
      payload: {
        pageNum: DEFAULT_PAGE_NUM,
        pageSize: DEFAULT_PAGE_SIZE,
        ...payload,
      },
      callback,
    });
  },
  getBindingList(payload, callback) {
    dispatch({
      type: 'gateway/fetchBindingList',
      payload: {
        pageNum: DEFAULT_PAGE_NUM,
        pageSize: DEFAULT_PAGE_SIZE,
        ...payload,
      },
      callback,
    });
  },
  getTypeList() {
    dispatch({
      type: 'gateway/fetchTypeList',
    });
  },
  remove(payload, callback) {
    dispatch({
      type: 'gateway/remove',
      payload,
      callback,
    });
  },
}))
export default class GatewayList extends Component {
  state = {
    visible: false,
    data: undefined,
  }

  componentDidMount() {
    const { getTypeList, getList } = this.props;
    getTypeList();
    getList();
  }

  setFormReference = form => {
    this.form = form;
  }

  showBinding = (data) => {
    const { getBindingList } = this.props;
    getBindingList({ gatewayEquipment: data.id });
    this.setState({
      visible: true,
      data,
    });
  }

  hideBinding = () => {
    this.setState({
      visible: false,
    });
  }

  // 列表change事件
  handleListChange = (pageNum, pageSize) => {
    const { getList } = this.props;
    const { getFieldsValue } = this.form;
    const values = getFieldsValue();
    getList({
      ...values,
      pageNum,
      pageSize,
    });
  }

  // 新增按钮点击事件
  handleAddClick = () => {
    router.push('/device-management/gateway/add');
  }

  // 编辑按钮点击事件
  handleEditClick = (e) => {
    const { id } = e.currentTarget.dataset;
    // router.push(`/device-management/gateway/edit/${id}`);
    window.open(`${window.publicPath}#/device-management/gateway/edit/${id}`);
  }

  // 查看按钮点击事件
  handleViewClick = (e) => {
    const { id } = e.currentTarget.dataset;
    // router.push(`/device-management/gateway/detail/${id}`);
    window.open(`${window.publicPath}#/device-management/gateway/detail/${id}`);
  }

  // 删除按钮点击事件
  handleDeleteClick = ({ id, dataExecuteEquipmentCount }) => {
    const { remove } = this.props;
    if (+dataExecuteEquipmentCount > 0) {
      message.warning('该网关设备已绑定数据处理设备，无法删除，请先解绑');
      return;
    }
    remove({ id }, (isSuccess, msg) => {
      if (isSuccess) {
        const { gateway: { list: { pagination: { pageNum, pageSize } } } } = this.props;
        message.success('删除成功');
        this.handleListChange(pageNum, pageSize);
      } else {
        message.error(msg || '删除失败，请稍后重试！');
      }
    });
  }

  // 绑定列表跳转
  handleBindingChange = (pageNum, pageSize) => {
    const { getBindingList } = this.props;
    const { data } = this.state;
    getBindingList({
      gatewayEquipment: data.id,
      pageNum,
      pageSize,
    });
  }

  handleSensorCountClick = (e) => {
    const { id } = e.currentTarget.dataset;
    window.open(`/#/device-management/new-sensor/list?dataExecuteEquipmentId=${id}`);
  }

  renderForm() {
    const {
      user: {
        currentUser: {
          unitType,
          permissionCodes,
        },
      },
      gateway: {
        typeList = [],
      },
      getList,
    } = this.props;
    const isNotCompany = +unitType !== 4;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);
    const fields = [
      ...(isNotCompany ? [{
        id: 'companyName',
        label: '单位名称',
        transform: value => value.trim(),
        render: _this => <Input placeholder="请输入单位名称" onPressEnter={_this.handleSearch} maxLength={50} />,
      }] : []),
      {
        id: 'equipmentType',
        label: '设备类型',
        render: () => (
          <Select placeholder="请选择设备类型" allowClear>
            {typeList.map(({ id, name }) => <Option key={id}>{name}</Option>)}
          </Select>
        ),
      },
    ];

    return (
      <Card className={styles.card} bordered={false}>
        <CustomForm
          fields={fields}
          onSearch={getList}
          onReset={getList}
          action={hasAddAuthority && (
            <AuthButton code={addCode} type="primary" onClick={this.handleAddClick}>新增</AuthButton>
          )}
          ref={this.setFormReference}
        />
      </Card>
    );
  }

  renderTable = () => {
    const {
      gateway: {
        typeList,
        list: {
          list = [],
          pagination: {
            pageSize = DEFAULT_PAGE_SIZE,
            pageNum = DEFAULT_PAGE_NUM,
            total = 0,
          } = {},
        } = {},
      },
      user: {
        currentUser: {
          permissionCodes,
          unitType,
        },
      },
      loadingList,
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    const hasDeleteAuthority = permissionCodes.includes(DELETE_CODE);

    const columns = [
      {
        title: '设备基本信息',
        dataIndex: 'basicInfo',
        render: (_, { equipmentType, brandName, modelName, name, code }) => {
          return (
            <div className={styles.multi}>
              <div>类型：{(typeList.filter(({ id }) => id === equipmentType)[0] || {}).name}</div>
              <div>品牌：{brandName}</div>
              <div>型号：{modelName}</div>
              <div>名称：{name}</div>
              <div>编号：{code}</div>
            </div>
          );
        },
        align: 'center',
      },
      {
        title: '有效期至',
        dataIndex: 'expireDate',
        render: (expireDate, { expireStatus }) => {
          const label = ({ 0: '', 1: '即将到期', 2: '已过期' })[expireStatus];
          return (
            <div className={styles.multi}>
              {label && <div className={styles.red}>{label}</div>}
              <div>{expireDate && moment(expireDate).format(DEFAULT_FORMAT)}</div>
            </div>
          );
        },
        align: 'center',
      },
      ...(isNotCompany ? [
        {
          title: '单位名称',
          dataIndex: 'companyName',
          align: 'center',
        },
      ] : []),
      {
        title: '区域位置',
        dataIndex: 'location',
        render: (_, { locationType, buildingName, floorName, area, location }) => (({ 0: [buildingName, floorName, location], 1: [area, location] })[locationType] || []).filter(v => v).join(''),
        align: 'center',
      },
      {
        title: '已绑定数据处理设备',
        dataIndex: 'dataExecuteEquipmentCount',
        render: (dataExecuteEquipmentCount, data) => <span className={classNames(styles.operation, +dataExecuteEquipmentCount === 0 && styles.disabled)} onClick={dataExecuteEquipmentCount > 0 ? () => this.showBinding(data) : undefined}>{dataExecuteEquipmentCount || 0}</span>,
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, row) => (
          <Fragment>
            {<span className={classNames(styles.operation, !hasDetailAuthority && styles.disabled)} onClick={hasDetailAuthority ? this.handleViewClick : undefined} data-id={row.id}>查看</span>}
            {<span className={classNames(styles.operation, !hasEditAuthority && styles.disabled)} onClick={hasEditAuthority ? this.handleEditClick : undefined} data-id={row.id}>编辑</span>}
            {hasDeleteAuthority ? (
              <Popconfirm title="你确定要删除吗?" onConfirm={() => this.handleDeleteClick(row)}>
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
        <Spin spinning={loadingList || false}>
          <Table
            className={styles.table}
            dataSource={list}
            columns={columns}
            rowKey="id"
            scroll={{
              x: true,
            }}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              // pageSizeOptions: ['5', '10', '15', '20'],
              // showTotal: total => `共 ${total} 条`,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: this.handleListChange,
              onShowSizeChange: (num, size) => {
                this.handleListChange(1, size);
              },
            }}
          />
        </Spin>
      </Card>
    );
  }

  // 绑定列表
  renderBinding() {
    const {
      gateway: {
        bindingList: {
          list = [],
          pagination: {
            total = 0,
            pageSize = DEFAULT_PAGE_SIZE,
            pageNum = DEFAULT_PAGE_NUM,
          } = {},
        },
      },
      loadingBinding,
    } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '数据处理设备',
        dataIndex: 'basicInfo',
        render: (_, { equipmentTypeName, brandName, name, code }) => {
          return (
            <div className={styles.multi}>
              <div>设备类型：{equipmentTypeName}</div>
              <div>品牌：{brandName}</div>
              <div>设备名称：{name}</div>
              <div>设备编号：{code}</div>
            </div>
          );
        },
        align: 'center',
      },
      {
        title: '有效期至',
        dataIndex: 'expireDate',
        render: (expireDate, { expireStatus }) => {
          const label = ({ 0: '', 1: '即将到期', 2: '已过期' })[expireStatus];
          return (
            <div className={styles.multi}>
              {label && <div className={styles.red}>{label}</div>}
              <div>{expireDate && moment(expireDate).format(DEFAULT_FORMAT)}</div>
            </div>
          );
        },
        align: 'center',
      },
      {
        title: '区域位置',
        dataIndex: 'location',
        render: (_, { locationType, buildingName, floorName, area, location }) => (({ 0: [buildingName, floorName, location], 1: [area, location] })[locationType] || []).filter(v => v).join(''),
        align: 'center',
      },
      // {
      //   title: '已绑定传感器',
      //   dataIndex: 'sensorCount',
      //   render: (sensorCount, { id }) => <span className={classNames(styles.operation, +sensorCount === 0 && styles.disabled)} onClick={sensorCount > 0 ? this.handleSensorCountClick : undefined} data-id={id}>{sensorCount || 0}</span>,
      //   align: 'center',
      // },
    ];

    return (
      <Modal
        title="已绑定数据处理设备"
        visible={visible}
        onCancel={this.hideBinding}
        footer={null}
        width={800}
        className={styles.modal}
        zIndex={9999}
      >
        <Table
          className={styles.table}
          dataSource={list || []}
          columns={columns}
          loading={loadingBinding}
          rowKey="id"
          scroll={{
            x: true,
          }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            // pageSizeOptions: ['5', '10', '15', '20'],
            // showTotal: total => `共 ${total} 条`,
            showQuickJumper: true,
            showSizeChanger: true,
            onChange: this.handleBindingChange,
            onShowSizeChange: (num, size) => {
              this.handleBindingChange(1, size);
            },
          }}
        />
      </Modal>
    );
  }

  render() {
    const {
      gateway: {
        list: {
          pagination: {
            total = 0,
          } = {},
        } = {},
      } = {},
      user: {
        currentUser: {
          unitType,
        },
      },
    } = this.props;
    const isNotCompany = +unitType !== 4;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={isNotCompany && <span>{`设备总数：${total}`}</span>}
      >
        {this.renderForm()}
        {this.renderTable()}
        {this.renderBinding()}
      </PageHeaderLayout>
    );
  }
}
