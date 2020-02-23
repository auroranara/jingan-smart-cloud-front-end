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
import { LEVELS, DEFAULT_FORMAT } from '../../QuickReport/List';
import styles from './index.less';
const { Option } = Select;
const GET_LIST = 'accidentReport/getList';
const GET_COMPANY_TYPE_LIST = 'accidentReport/getCompanyTypeList';
const REMOVE = 'accidentReport/remove';
export const DETAIL_CODE = 'accidentManagement.accidentReport.view';
export const ADD_CODE = 'accidentManagement.accidentReport.add';
export const EDIT_CODE = 'accidentManagement.accidentReport.edit';
export const DELETE_CODE = 'accidentManagement.accidentReport.delete';
export const LIST_PATH = '/accident-management/accident-report/list';
export const ADD_PATH = '/accident-management/accident-report/add';
export const EDIT_PATH = '/accident-management/accident-report/edit';
export const DETAIL_PATH = '/accident-management/accident-report/detail';
export { LEVELS, DEFAULT_FORMAT };
export const PROCESS_TYPES = [
  { key: '0', value: '国务院领导做出批示' },
  { key: '1', value: '中央办公厅或国务院办公厅要求上报' },
  { key: '2', value: '总局领导明确要求' },
  { key: '3', value: '省级领导作示' },
  { key: '4', value: '省政府要求上报' },
  { key: '5', value: '省安监局领导明确要求' },
  { key: '6', value: '市级领导作出批示' },
  { key: '7', value: '市政府要求上报' },
  { key: '8', value: '市安监局领导明确要求' },
  { key: '9', value: '其它' },
];
export const REPORT_TYPES = [
  { key: '0', value: '首报' },
  { key: '1', value: '续报' },
  { key: '2', value: '重报' },
  { key: '3', value: '核报' },
  { key: '4', value: '反馈' },
];
export const REPORT_STATUSES = [{ key: '0', value: '保存' }, { key: '1', value: '上报' }];

@connect(
  ({ user, accidentReport, loading }) => ({
    user,
    accidentReport,
    loading: loading.effects[GET_LIST],
  }),
  dispatch => ({
    getList(payload, callback) {
      dispatch({
        type: GET_LIST,
        payload: {
          type: '1',
          pageNum: 1,
          pageSize: getPageSize(),
          ...payload,
        },
        callback,
      });
    },
    getCompanyTypeList(payload, callback) {
      dispatch({
        type: GET_COMPANY_TYPE_LIST,
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
  })
)
export default class ReportList extends PureComponent {
  prevValues = null;

  componentDidMount() {
    const { getList, getCompanyTypeList } = this.props;
    getList();
    getCompanyTypeList();
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

  renderForm() {
    const {
      user: {
        currentUser: { unitType, permissionCodes },
      },
      accidentReport: { companyTypeList = [] },
    } = this.props;
    const isNotCompany = +unitType !== 4;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);

    const FIELDS = [
      ...(isNotCompany
        ? [
            {
              id: 'companyName',
              label: '事故单位名称',
              transform: value => value.trim(),
              render: _this => (
                <Input
                  placeholder="请输入事故单位名称"
                  onPressEnter={_this.handleSearch}
                  maxLength={50}
                />
              ),
            },
          ]
        : []),
      {
        id: 'regulatoryClassification',
        label: '事故单位类型',
        render: () => (
          <Select placeholder="请选择事故单位类型" allowClear>
            {companyTypeList.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'accidentTitle',
        label: '事故信息标题',
        transform: value => value.trim(),
        render: _this => (
          <Input
            placeholder="请输入事故信息标题"
            onPressEnter={_this.handleSearch}
            maxLength={50}
          />
        ),
      },
      {
        id: 'reportCompany',
        label: '报送单位',
        transform: value => value.trim(),
        render: _this => (
          <Input placeholder="请输入报送单位" onPressEnter={_this.handleSearch} maxLength={50} />
        ),
      },
      {
        id: 'reportType',
        label: '报送类型',
        render: () => (
          <Select placeholder="请选择报送类型" allowClear>
            {REPORT_TYPES.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'reportStatus',
        label: '报送状态',
        render: () => (
          <Select placeholder="请选择报送状态" allowClear>
            {REPORT_STATUSES.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'accidentType',
        label: '事故类型代码',
        render: () => <TypeSelect allowClear />,
      },
      {
        id: 'accidentLevel',
        label: '事故级别',
        render: () => (
          <Select placeholder="请选择事故级别" allowClear>
            {LEVELS.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
        ),
      },
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
      accidentReport: {
        list: { list = [], pagination: { pageSize = 10, pageNum = 1, total = 0 } = {} } = {},
        companyTypeList = [],
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
              title: '事故单位',
              dataIndex: 'companyName',
              align: 'center',
            },
          ]
        : []),
      {
        title: '事故企业类型',
        dataIndex: 'regulatoryClassification',
        render: value => <SelectOrSpan list={companyTypeList} value={`${value}`} type="span" />,
        align: 'center',
      },
      {
        title: '事故信息标题',
        dataIndex: 'accidentTitle',
        align: 'center',
      },
      {
        title: '事故发生时间',
        dataIndex: 'happenTime',
        render: time => time && moment(time).format(DEFAULT_FORMAT),
        align: 'center',
      },
      {
        title: '事故处理类型',
        dataIndex: 'handleType',
        render: value => <SelectOrSpan list={PROCESS_TYPES} value={`${value}`} type="span" />,
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
        render: value => <SelectOrSpan list={LEVELS} value={`${value}`} type="span" />,
        align: 'center',
      },
      {
        title: '报送单位',
        dataIndex: 'reportCompany',
        align: 'center',
      },
      {
        title: '报送类型',
        dataIndex: 'reportType',
        render: value => <SelectOrSpan list={REPORT_TYPES} value={`${value}`} type="span" />,
        align: 'center',
      },
      {
        title: '报送状态',
        dataIndex: 'reportStatus',
        render: (value, { reportType }) =>
          +reportType === 1 && (
            <SelectOrSpan list={REPORT_STATUSES} value={`${value}`} type="span" />
          ),
        align: 'center',
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
              pageSizeOptions: ['5', '10', '15', '20'],
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
    const title = '事故报告';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '事故管理', name: '事故管理' },
      { title: '事故报告', name: '事故报告' },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
