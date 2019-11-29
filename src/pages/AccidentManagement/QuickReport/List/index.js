import React, { PureComponent, Fragment } from 'react';
import { Button, Card, Table, Input, Select, Empty, Popconfirm, Spin, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import TypeSelect from '../../components/TypeSelect';
import { connect } from 'dva';
import router from 'umi/router';
import classNames from 'classnames';
import moment from 'moment';
import { getPageSize, setPageSize } from '@/utils/utils';
import styles from './index.less';
const { Option } = Select;
const GET_LIST = 'accidentReport/getList';
const REMOVE = 'accidentReport/remove';
export const DETAIL_CODE = 'accidentManagement.quickReport.view';
export const ADD_CODE = 'accidentManagement.quickReport.add';
export const EDIT_CODE = 'accidentManagement.quickReport.edit';
export const DELETE_CODE = 'accidentManagement.quickReport.delete';
export const LIST_PATH = '/accident-management/quick-report/list';
export const ADD_PATH = '/accident-management/quick-report/add';
export const EDIT_PATH = '/accident-management/quick-report/edit';
export const DETAIL_PATH = '/accident-management/quick-report/detail';
export const LEVELS = [
  { key: '1', value: '特别重大' },
  { key: '2', value: '重大' },
  { key: '3', value: '较大' },
  { key: '4', value: '一般' },
];
export const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

@connect(({
  user,
  accidentReport,
  loading,
}) => ({
  user,
  accidentReport,
  loading: loading.effects[GET_LIST],
}), (dispatch) => ({
  getList(payload, callback) {
    dispatch({
      type: GET_LIST,
      payload: {
        type: '0',
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
export default class ReportList extends PureComponent {
  componentDidMount() {
    this.getList();
  }

  setFormReference = form => {
    this.form = form;
  }

  getList = (payload) => {
    const {
      accidentReport: {
        list: {
          pagination: {
            pageSize: prevPageSize=getPageSize(),
          }={},
        }={},
      },
      getList,
    } = this.props;
    const { current=1, pageSize=getPageSize() } = payload || {};
    const values = this.form && this.form.getFieldsValue();
    getList({
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
      ...values,
      ...payload,
    });
    setPageSize(pageSize);
  }

  reload = () => {
    const {
      accidentReport: {
        list: {
          pagination: {
            pageNum=1,
          }={},
        }={},
      },
    } = this.props;
    this.getList({
      current: pageNum,
    });
  }

  // 新增按钮点击事件
  handleAddClick = () => {
    router.push(ADD_PATH);
  }

  // 编辑按钮点击事件
  handleEditClick = (e) => {
    const { id } = e.currentTarget.dataset;
    router.push(`${EDIT_PATH}/${id}`);
  }

  // 查看按钮点击事件
  handleViewClick = (e) => {
    const { id } = e.currentTarget.dataset;
    router.push(`${DETAIL_PATH}/${id}`);
  }

  // 删除按钮点击事件
  handleDeleteClick = (id) => {
    const { remove } = this.props;
    remove({ id }, (success, msg) => {
      if (success) {
        message.success('删除成功');
        this.reload();
      } else {
        message.error(msg || '删除失败，请稍后重试！');
      }
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
    const isNotCompany = +unitType !== 4;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);

    const FIELDS = [
      ...(isNotCompany ? [{
        id: 'companyName',
        label: '事故单位名称',
        transform: value => value.trim(),
        render: _this => <Input placeholder="请输入事故单位名称" onPressEnter={_this.handleSearch} maxLength={50} />,
      }] : []),
      {
        id: 'accidentTitle',
        label: '事故信息标题',
        transform: value => value.trim(),
        render: _this => <Input placeholder="请输入事故信息标题" onPressEnter={_this.handleSearch} maxLength={50} />,
      },
      {
        id: 'accidentType',
        label: '事故类型代码',
        render: () => (
          <TypeSelect allowClear />
        ),
      },
      {
        id: 'accidentLevel',
        label: '事故级别',
        render: () => (
          <Select placeholder="请选择事故级别" allowClear>
            {LEVELS.map(({ key, value }) => <Option key={key}>{value}</Option>)}
          </Select>
        ),
      },
    ];

    return (
      <Card className={styles.card} bordered={false}>
        <CustomForm
          fields={FIELDS}
          onSearch={this.getList}
          onReset={this.getList}
          action={<Button type="primary" onClick={this.handleAddClick} disabled={!hasAddAuthority}>新增</Button>}
          ref={this.setFormReference}
        />
      </Card>
    );
  }

  renderTable = () => {
    const {
      accidentReport: {
        list: {
          list=[],
          pagination: {
            pageSize=10,
            pageNum=1,
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
      loading,
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    const hasDeleteAuthority = permissionCodes.includes(DELETE_CODE);

    const COLUMNS = (isNotCompany ? [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
      },
    ] : []).concat([
      {
        title: '事故信息标题',
        dataIndex: 'accidentTitle',
        align: 'center',
      },
      {
        title: '事故发生时间',
        dataIndex: 'happenTime',
        render: (time) => time && moment(time).format(DEFAULT_FORMAT),
        align: 'center',
      },
      {
        title: '事故发生地址',
        dataIndex: 'address',
        render: (_, { provinceName, cityNamem, districtName, townName, address }) => [provinceName, cityNamem, districtName, townName, address].filter(v => v).join(''),
        align: 'center',
      },
      {
        title: '事故类型代码',
        dataIndex: 'accidentTypeDesc',
        align: 'center',
      },
      {
        title: '事故级别',
        dataIndex: 'accidentLevel',
        render: (value) => <SelectOrSpan list={LEVELS} value={`${value}`} type="span" />,
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: list && list.length > 0 ? 'right' : false,
        render: (_, { id }) => {
          return (
            <Fragment>
              {<span className={classNames(styles.operation, !hasDetailAuthority && styles.disabled)} onClick={hasDetailAuthority ? this.handleViewClick : undefined} data-id={id}>查看</span>}
              {<span className={classNames(styles.operation, !hasEditAuthority && styles.disabled)} onClick={hasEditAuthority ? this.handleEditClick : undefined} data-id={id}>编辑</span>}
              {hasDeleteAuthority ? (
                <Popconfirm title="你确定要删除吗?" onConfirm={() => this.handleDeleteClick(id)}>
                  <span className={styles.operation}>删除</span>
                </Popconfirm>
              ) : (
                <span className={classNames(styles.operation, styles.disabled)}>删除</span>
              )}
            </Fragment>
          );
        },
        align: 'center',
      },
    ]);

    return (
      <Card className={styles.card} bordered={false}>
        <Spin spinning={loading || false}>
          {list && list.length > 0 ? (
            <Table
              className={styles.table}
              dataSource={list}
              columns={COLUMNS}
              rowKey="id"
              scroll={{
                x: true,
              }}
              onChange={this.getList}
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

  render() {
    const title = "事故快报";
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '事故管理', name: '事故管理' },
      { title: '事故快报', name: '事故快报' },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
