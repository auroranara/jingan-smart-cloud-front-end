import React, { Component, Fragment } from 'react';
import { Button, Input, Popconfirm, Card, Table, message, Empty } from 'antd';
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

@connect(({
  gasometer,
  user,
  loading,
}) => ({
  gasometer,
  user,
  loading: loading.effects[GET_LIST],
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
}))
export default class GasometerList extends Component {
  prevValues = {}

  componentDidMount() {
    const {
      getList,
    } = this.props;
    getList();
  }

  setFormReference = form => {
    this.form = form;
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
      // {
      //   title: '构成重大危险源',
      //   dataIndex: 'majorHazard',
      //   render: value => <SelectOrSpan type="span" list={MAJOR_HAZARD_STATUSES} value={`${value}`} />,
      //   align: 'center',
      // },
      {
        title: '区域位置',
        dataIndex: 'regionalLocation',
        align: 'center',
      },
      // {
      //   title: '已绑传感器',
      //   dataIndex: 'sensorList',
      //   render(list) {
      //     const length = list && list.length || 0;
      //     return <span className={classNames(styles.operation, length === 0 && styles.disabled)}>{length}</span>;
      //   },
      //   align: 'center',
      // },
      {
        title: '操作',
        dataIndex: 'id',
        width: 164,
        fixed: list && list.length > 0 ? 'right' : false,
        render: id => (
          <Fragment>
            {/* {<span className={classNames(styles.operation, !hasBindAuthority && styles.disabled)} onClick={hasBindAuthority ? this.handleBindButtonClick : undefined} data-id={id}>绑定传感器</span>} */}
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
        {list && list.length > 0 ? (
          <Table
            className={styles.table}
            dataSource={list}
            columns={columns}
            rowKey="id"
            loading={loading}
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
      </PageHeaderLayout>
    );
  }
}

