import React, { PureComponent, Fragment } from 'react';
import {
  Button,
  Card,
  Table,
  Input,
  Select,
  Empty,
  Popconfirm,
  Spin,
  message,
  TreeSelect,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { connect } from 'dva';
import router from 'umi/router';
import classNames from 'classnames';
import moment from 'moment';
import { getPageSize, setPageSize } from '@/utils/utils';
import { LEVELS } from '../../QuickReport/List';
import styles from './index.less';
const { Option } = Select;
const { TreeNode } = TreeSelect;
const GET_LIST = 'injuryReport/getList';
const REMOVE = 'injuryReport/remove';
export const DETAIL_CODE = 'accidentManagement.injuryReport.view';
export const ADD_CODE = 'accidentManagement.injuryReport.add';
export const EDIT_CODE = 'accidentManagement.injuryReport.edit';
export const DELETE_CODE = 'accidentManagement.injuryReport.delete';
export const LIST_PATH = '/accident-management/injury-report/list';
export const ADD_PATH = '/accident-management/injury-report/add';
export const EDIT_PATH = '/accident-management/injury-report/edit';
export const DETAIL_PATH = '/accident-management/injury-report/detail';
export { LEVELS };

export const INJURY_TYPES = [
  { key: '0', value: '轻微伤' },
  { key: '1', value: '轻伤' },
  { key: '2', value: '重伤' },
  { key: '3', value: '死亡' },
];
export const SEX = [{ key: '0', value: '男' }, { key: '1', value: '女' }];
const DEFAULT_FORMAT = 'YYYY-MM-DD';

@connect(
  ({ user, accidentReport, loading, injuryReport }) => ({
    user,
    accidentReport,
    loading: loading.effects[GET_LIST],
    injuryReport,
  }),
  dispatch => ({
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
    fetchDepartmentDict(payload, callback) {
      dispatch({
        type: 'injuryReport/fetchDepartmentDict',
        payload,
        callback,
      });
    },
  })
)
export default class InjuryReportList extends PureComponent {
  prevValues = null;

  componentDidMount() {
    const {
      user: {
        currentUser: { unitType, unitId },
      },
      getList,
      fetchDepartmentDict,
    } = this.props;
    const isNotCompany = +unitType !== 4;
    getList();
    !isNotCompany && fetchDepartmentDict({ companyId: unitId });
  }

  setFormReference = form => {
    this.form = form;
  };

  reload = () => {
    const {
      accidentReport: { list: { pagination: { pageNum = 1, pageSize = getPageSize() } = {} } = {} },
      getList,
    } = this.props;
    getList({
      ...this.prevValues,
      pageNum,
      pageSize,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
  };

  // 新增按钮点击事件
  handleAddClick = () => {
    router.push(ADD_PATH);
  };

  // 编辑按钮点击事件
  handleEditClick = e => {
    const { id } = e.currentTarget.dataset;
    router.push(`${EDIT_PATH}/${id}`);
  };

  // 查看按钮点击事件
  handleViewClick = e => {
    const { id } = e.currentTarget.dataset;
    router.push(`${DETAIL_PATH}/${id}`);
  };

  // 删除按钮点击事件
  handleDeleteClick = id => {
    const { remove } = this.props;
    remove({ id }, (success, msg) => {
      if (success) {
        message.success('删除成功');
        this.reload();
      } else {
        message.error(msg || '删除失败，请稍后重试！');
      }
    });
  };

  // 查询
  handleSearch = values => {
    const {
      accidentReport: { list: { pagination: { pageSize = getPageSize() } = {} } = {} },
      getList,
    } = this.props;
    this.prevValues = values;
    getList({
      ...values,
      pageSize,
    });
  };

  // 重置
  handleReset = values => {
    this.handleSearch(values);
  };

  // 表格change
  handleTableChange = ({ current, pageSize }) => {
    const {
      accidentReport: {
        list: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {},
      },
      getList,
    } = this.props;
    getList({
      ...this.prevValues,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
    prevPageSize !== pageSize && setPageSize(pageSize);
  };

  renderTreeNodes = dict =>
    dict.map(
      ({ key, value, children }) =>
        children ? (
          <TreeNode title={value} key={key} value={key}>
            {this.renderTreeNodes(children)}
          </TreeNode>
        ) : (
          <TreeNode title={value} key={key} value={key} />
        )
    );

  renderForm() {
    const {
      user: {
        currentUser: { unitType, permissionCodes },
      },
      injuryReport: { departmentDict },
    } = this.props;
    const isNotCompany = +unitType !== 4;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);
    const FIELDS = [
      ...(isNotCompany
        ? [
            {
              id: 'companyName',
              label: '单位名称',
              transform: value => value.trim(),
              render: _this => (
                <Input
                  placeholder="请输入单位名称"
                  onPressEnter={_this.handleSearch}
                  maxLength={50}
                />
              ),
            },
          ]
        : []),
      {
        id: 'injuryType',
        label: '工伤类型',
        render: () => (
          <Select placeholder="工伤类型" allowClear>
            {INJURY_TYPES.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'declarePerson',
        label: '申报人姓名',
        transform: value => value.trim(),
        render: _this => (
          <Input placeholder="请输入申报人姓名" onPressEnter={_this.handleSearch} maxLength={50} />
        ),
      },
      ...(!isNotCompany
        ? [
            {
              id: 'departmentId',
              label: '申报人部门',
              render: () => (
                <TreeSelect
                  placeholder="请选择申报人部门"
                  allowClear
                  dropdownClassName={styles.treeSelectDropDown}
                >
                  {this.renderTreeNodes(departmentDict)}
                </TreeSelect>
              ),
            },
          ]
        : []),
    ];

    return (
      <Card className={styles.card} bordered={false}>
        <CustomForm
          fields={FIELDS}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          action={
            <Button type="primary" onClick={this.handleAddClick} disabled={!hasAddAuthority}>
              新增
            </Button>
          }
          ref={this.setFormReference}
        />
      </Card>
    );
  }

  renderTable = () => {
    const {
      injuryReport: {
        list: { list = [], pagination: { pageSize = 10, pageNum = 1, total = 0 } = {} } = {},
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
      loading = false,
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    const hasDeleteAuthority = permissionCodes.includes(DELETE_CODE);

    const COLUMNS = [
      ...(isNotCompany
        ? [
            {
              title: '单位名称',
              dataIndex: 'companyName',
              align: 'center',
            },
          ]
        : []),
      {
        title: '申报人',
        dataIndex: 'declarePerson',
        align: 'center',
        render: (val, row) => {
          const { declarePerson, sex, departmentName } = row;
          return (
            <div className={styles.multi}>
              <div>
                姓名：
                {declarePerson}
              </div>
              <div>
                性别：
                {<SelectOrSpan list={SEX} value={`${sex}`} type="span" />}
              </div>
              <div>
                部门：
                {departmentName}
              </div>
            </div>
          );
        },
      },
      {
        title: '事故名称',
        dataIndex: 'accidentTitle',
        align: 'center',
      },
      {
        title: '事故发生时间',
        dataIndex: 'happenTime',
        render: time => time && moment(time).format('YYYY-MM-DD HH:mm:ss'),
        align: 'center',
      },
      {
        title: '工伤类型',
        dataIndex: 'injuryType',
        render: value => <SelectOrSpan list={INJURY_TYPES} value={`${value}`} type="span" />,
        align: 'center',
      },
      {
        title: '申报日期',
        dataIndex: 'declareDate',
        render: time => time && moment(time).format(DEFAULT_FORMAT),
        align: 'center',
      },
      {
        title: '相关附件',
        dataIndex: 'fileList',
        align: 'center',
        render: fileList => {
          return (
            <Fragment>
              {fileList.map(item => {
                const { fileName, webUrl, id } = item;
                const fileNames = fileName.split('.');
                const name = fileNames.slice(0, fileNames.length - 1).join('.');
                return (
                  <div key={id}>
                    <a href={webUrl} target="_blank" rel="noopener noreferrer">
                      {name}
                    </a>
                  </div>
                );
              })}
            </Fragment>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 164,
        fixed: list && list.length > 0 ? 'right' : false,
        render: (_, { id }) => {
          return (
            <Fragment>
              {
                <span
                  className={classNames(styles.operation, !hasDetailAuthority && styles.disabled)}
                  onClick={hasDetailAuthority ? this.handleViewClick : undefined}
                  data-id={id}
                >
                  查看
                </span>
              }
              {
                <span
                  className={classNames(styles.operation, !hasEditAuthority && styles.disabled)}
                  onClick={hasEditAuthority ? this.handleEditClick : undefined}
                  data-id={id}
                >
                  编辑
                </span>
              }
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
    ];

    return (
      <Card className={styles.card} bordered={false}>
        {list && list.length > 0 ? (
          <Table
            className={styles.table}
            dataSource={list}
            columns={COLUMNS}
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
              // pageSizeOptions: ['5', '10', '15', '20'],
              showTotal: total => `共 ${total} 条`,
              showQuickJumper: true,
              showSizeChanger: true,
            }}
          />
        ) : (
          <Empty />
        )}
      </Card>
    );
  };

  render() {
    const title = '工伤申报';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '事故管理', name: '事故管理' },
      { title: '工伤申报', name: '工伤申报' },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
