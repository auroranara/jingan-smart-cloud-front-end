import React, { Component, Fragment } from 'react';
import { Input, Select, Spin, Card, Button, Table, Modal, Popconfirm, message } from 'antd'
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;
const title = '单位网关设备管理';
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '设备管理',
    name: '设备管理',
  },
  {
    title,
    name: title,
  },
];
const DEFAULT_FORMAT = 'YYYY.M.D';
const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 10;
const DETAIL_CODE = 'deviceManagement.gateway.detail';
const ADD_CODE = 'deviceManagement.gateway.add';
const EDIT_CODE = 'deviceManagement.gateway.edit';
const DELETE_CODE = 'deviceManagement.gateway.delete';

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
    // getList();
  }

  setFormReference = form => {
    this.form = form;
  }

  showBinding = (data) => {
    const { getBindingList } = this.props;
    // getBindingList({ id: data.id });
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
    router.push(`/device-management/gateway/edit/${id}`);
  }

  // 查看按钮点击事件
  handleViewClick = (e) => {
    const { id } = e.currentTarget.dataset;
    router.push(`/device-management/gateway/detail/${id}`);
  }

  // 删除按钮点击事件
  handleDeleteClick = (id) => {
    const { remove } = this.props;
    remove({ id }, (isSuccess) => {
      if (isSuccess) {
        const { gateway: { list: { pagination: { pageNum, pageSize } } } } = this.props;
        message.success('删除成功');
        this.handleListChange(pageNum, pageSize);
      } else {
        message.error('删除失败，请稍后重试！');
      }
    });
  }

  // 绑定列表跳转
  handleBindingChange = (pageNum, pageSize) => {
    const { getBindingList } = this.props;
    const { data } = this.props;
    getBindingList({
      id: data.id,
      pageNum,
      pageSize,
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
      gateway: {
        typeList=[],
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
      }]: []),
      {
        id: 'type',
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
            <Button type="primary" onClick={this.handleAddClick}>新增</Button>
          )}
          ref={this.setFormReference}
        />
      </Card>
    );
  }

  renderTable = () => {
    const {
      gateway: {
        list: {
          // list=[],
          pagination: {
            pageSize=DEFAULT_PAGE_SIZE,
            pageNum=DEFAULT_PAGE_NUM,
            total=0,
          }={},
        }={},
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
    const list = [{
      id: 1,
      name: '213',
      status: '0',
      binding: 3,
    }];

    const columns = [
      {
        title: '设备基本信息',
        dataIndex: 'basicInfo',
        render: (_, { type, brand, model, name, code }) => {
          return (
            <div className={styles.multi}>
              <div>类型：{type}</div>
              <div>品牌：{brand}</div>
              <div>型号：{model}</div>
              <div>名称：{name}</div>
              <div>编号：{code}</div>
            </div>
          );
        },
        align: 'center',
      },
      {
        title: '有效期至',
        dataIndex: 'endDate',
        render: endDate => endDate && moment(endDate).format(DEFAULT_FORMAT),
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
        render: (_, { area, location }) => [area, location].filter(v => v).join(''),
        align: 'center',
      },
      {
        title: '已绑定数据处理设备',
        dataIndex: 'binding',
        render: (binding, data) => <span className={binding > 0 ? styles.operation : undefined} onClick={() => this.showBinding(data)}>{binding}</span>,
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (_, { id }) => (
          <Fragment>
            {hasDetailAuthority && <span className={styles.operation} onClick={this.handleViewClick} data-id={id}>查看</span>}
            {hasEditAuthority && <span className={styles.operation} onClick={this.handleEditClick} data-id={id}>编辑</span>}
            {hasDeleteAuthority && (
              <Popconfirm title="你确定要删除这个网关设备吗?" onConfirm={() => this.handleDeleteClick(id)}>
                <span className={styles.operation}>删除</span>
              </Popconfirm>
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
              pageSizeOptions: ['5', '10', '15', '20'],
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
          list=[],
          pagination: {
            total=0,
            pageSize=DEFAULT_PAGE_SIZE,
            pageNum=DEFAULT_PAGE_NUM,
          }={},
        },
      },
      loadingBinding,
    } = this.props;
    const { visible } = this.state;
    const columns = [
      {
        title: '数据处理设备',
        dataIndex: 'basicInfo',
        render: (_, { type, brand, name, code }) => {
          return (
            <div className={styles.multi}>
              <div>类型：{type}</div>
              <div>品牌：{brand}</div>
              <div>名称：{name}</div>
              <div>编号：{code}</div>
            </div>
          );
        },
        align: 'center',
      },
      {
        title: '有效期至',
        dataIndex: 'endDate',
        render: endDate => endDate && moment(endDate).format(DEFAULT_FORMAT),
        align: 'center',
      },
      {
        title: '区域位置',
        dataIndex: 'location',
        render: (_, { area, location }) => [area, location].filter(v => v).join(''),
        align: 'center',
      },
      {
        title: '已绑定传感器',
        dataIndex: 'binding',
        render: (binding, data) => <span className={binding > 0 ? styles.operation : undefined}>{binding}</span>,
        align: 'center',
      },
    ];

    return (
      <Modal
        title="已绑定数据处理设备"
        visible={visible}
        onCancel={this.hideBinding}
        footer={null}
        width="60%"
        className={styles.modal}
        zIndex={9999}
      >
        <Spin spinning={!!loadingBinding}>
          <Table
            className={styles.table}
            dataSource={list || []}
            columns={columns}
            rowKey="id"
            scroll={{
              x: true,
            }}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              pageSizeOptions: ['5', '10', '15', '20'],
              // showTotal: total => `共 ${total} 条`,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: this.handleBindingChange,
              onShowSizeChange: (num, size) => {
                this.handleBindingChange(1, size);
              },
            }}
          />
        </Spin>
      </Modal>
    );
  }

  render() {
    const {
      trainingProgram: {
        list: {
          a,
        }={},
      }={},
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
        content={isNotCompany && <span>{`单位数量：${a || 0}`}</span>}
      >
        {this.renderForm()}
        {this.renderTable()}
        {this.renderBinding()}
      </PageHeaderLayout>
    );
  }
}
