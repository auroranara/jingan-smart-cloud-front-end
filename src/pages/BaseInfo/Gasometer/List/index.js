import React, { Component, Fragment } from 'react';
import { Button, Spin, Input, Popconfirm, Card, Table, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { getPageSize, setPageSize } from '@/utils/utils';
import classNames from 'classnames';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

export const TITLE = '气柜管理';
export const LIST_PATH = '/base-info/gasometer/list';
export const ADD_PATH = '/base-info/gasometer/add';
export const EDIT_PATH = '/base-info/gasometer/edit';
export const DETAIL_PATH = '/base-info/gasometer/detail';
export const ADD_CODE = 'baseInfo.gasometer.add';
export const EDIT_CODE = 'baseInfo.gasometer.edit';
export const DETAIL_CODE = 'baseInfo.gasometer.detail';
export const DELETE_CODE = 'baseInfo.gasometer.delete';
export const BIND_CODE = 'baseInfo.gasometer.bind';
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
    title: '一企一档',
    name: '一企一档',
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const GET_LIST = 'gasometer/getList';
const REMOVE = 'gasometer/remove';
const FIELDS = [
  {
    id: 'name',
    label: '气柜名称',
    transform: value => value.trim(),
    render: ({ handleSearch }) => <Input placeholder="请输入气柜名称" onPressEnter={handleSearch} maxLength={50} />,
  },
  {
    id: 'code',
    label: '统一编码',
    transform: value => value.trim(),
    render: ({ handleSearch }) => <Input placeholder="请输入统一编码" onPressEnter={handleSearch} maxLength={50} />,
  },
  {
    id: 'type',
    label: '气柜类型',
    render: () => <SelectOrSpan placeholder="请选择气柜类型" list={TYPES} allowClear />,
  },
  {
    id: 'storageMedium',
    label: '存储介质',
    transform: value => value.trim(),
    render: ({ handleSearch }) => <Input placeholder="请输入存储介质" onPressEnter={handleSearch} maxLength={50} />,
  },
  {
    id: 'casNumber',
    label: 'CAS号',
    transform: value => value.trim(),
    render: ({ handleSearch }) => <Input placeholder="请输入CAS号" onPressEnter={handleSearch} maxLength={50} />,
  },
  {
    id: 'companyName',
    label: '单位名称',
    transform: value => value.trim(),
    render: ({ handleSearch }) => <Input placeholder="请输入单位名称" onPressEnter={handleSearch} maxLength={50} />,
  },
];

@connect(({
  gasometer: {
    list,
  },
  user,
  loading,
}) => ({
  list,
  user,
  loading: loading.effects[GET_LIST],
}), dispatch => ({
  getList(payload, callback) {
    dispatch({
      type: GET_LIST,
      payload,
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
}))
export default class GasometerList extends Component {
  prevValues = {}

  componentDidMount() {
    this.handleListChange();
  }

  setFormReference = form => {
    this.form = form;
  }

  handleListChange = (pageNum=1, pageSize=getPageSize()) => {
    const { getList } = this.props;
    const { setFieldsValue } = this.form;
    const { prevValues } = this;
    getList({
      ...prevValues,
      pageNum,
      pageSize,
    });
    setFieldsValue && setFieldsValue(prevValues);
    setPageSize(pageSize);
  }


  // 新增按钮点击事件
  handleAddButtonClick = () => {
    router.push(ADD_PATH);
  }

  // 绑定传感器按钮点击事件
  handleBindButtonClick = (e) => {
    const { id } = e.currentTarget.dataset;
    console.log(id);
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
    remove({ id }, (isSuccess) => {
      if (isSuccess) {
        message.success('删除成功');
        this.handleListChange(1);
      } else {
        message.error('删除失败，请稍后重试！');
      }
    });
  }

  // 查询
  handleSearch = (values) => {
    const { getList } = this.props;
    const pageSize = getPageSize();
    this.prevValues = values;
    getList({
      ...values,
      pageNum: 1,
      pageSize,
    });
  }

  // 重置
  handleReset = (values) => {
    this.handleSearch(values);
  }

  renderForm() {
    const {
      user: {
        currentUser: {
          permissionCodes,
        },
      },
    } = this.props;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);

    return (
      <Card className={styles.card} bordered={false}>
        <CustomForm
          fields={FIELDS}
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
      list: {
        list=[],
        pagination: {
          total,
          pageNum,
          pageSize,
        }={},
      }={},
      user: {
        currentUser: {
          permissionCodes,
          unitType,
        },
      },
      loading,
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
        render: (_, { code, name }) => (
          <div className={styles.multi}>
            <div><span className={styles.label}>统一编码：</span>{code}</div>
            <div><span className={styles.label}>气柜名称：</span>{name}</div>
          </div>
        ),
        align: 'center',
      },
      {
        title: '存储介质',
        dataIndex: 'storageMedium',
        render: (_, { storageMedium, casNumber }) => (
          <div className={styles.multi}>
            <div><span className={styles.label}>存储介质：</span>{storageMedium}</div>
            <div><span className={styles.label}>CAS号：</span>{casNumber}</div>
          </div>
        ),
        align: 'center',
      },
      {
        title: '构成重大危险源',
        dataIndex: 'isMajorHazard',
        render: isMajorHazard => <SelectOrSpan type="span" list={MAJOR_HAZARD_STATUSES} value={isMajorHazard} />,
        align: 'center',
      },
      {
        title: '区域位置',
        dataIndex: 'address',
        render: (_, { area, location }) => [area, location].filter(v => v).join(''),
        align: 'center',
      },
      {
        title: '已绑传感器',
        dataIndex: 'sensorList',
        render(list) {
          const length = list && list.length || 0;
          return <span className={classNames(styles.operation, length === 0 && styles.disabled)}>{length}</span>;
        },
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: 250,
        fixed: 'right',
        render: id => (
          <Fragment>
            {<span className={classNames(styles.operation, !hasBindAuthority && styles.disabled)} onClick={this.handleBindButtonClick} data-id={id}>绑定传感器</span>}
            {<span className={classNames(styles.operation, !hasDetailAuthority && styles.disabled)} onClick={this.handleDetailButtonClick} data-id={id}>查看</span>}
            {<span className={classNames(styles.operation, !hasEditAuthority && styles.disabled)} onClick={this.handleEditButtonClick} data-id={id}>编辑</span>}
            {hasDeleteAuthority ? (
              <Popconfirm title="你确定要删除这个培训计划吗?" onConfirm={() => this.handleDeleteButtonClick(id)}>
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
        <Spin spinning={!!loading}>
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
              onShowSizeChange: (_, size) => {
                this.handleListChange(1, size);
              },
            }}
          />
        </Spin>
      </Card>
    );
  }

  render() {
    const {
      user: {
        currentUser: {
          unitType,
        },
      },
      list: {
        pagination: {
          total,
        }={},
      }={},
    } = this.props;
    const isNotCompany = unitType !== 4;

    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        content={(
          <Fragment>
            {isNotCompany && <span className={styles.count}>{`单位数量：${total}`}</span>}
            <span className={styles.count}>{`气柜总数：${total}`}</span>
            <span className={styles.count}>{`已绑传感器数：${total}`}</span>
          </Fragment>
        )}
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}

