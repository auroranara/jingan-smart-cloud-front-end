import React, { Component, Fragment } from 'react';
import { Button, Input, Popconfirm, Card, Table, message, Empty, Modal, Divider } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import { getPageSize, setPageSize } from '@/utils/utils';
import classNames from 'classnames';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import styles from './index.less';
// 审核弹窗
import ReviewModal from '@/pages/EmergencyManagement/EmergencyPlan/ReviewModal';
import { AuthPopConfirm, AuthA } from '@/utils/customAuth';

export const TITLE = '安全制度管理';
export const LIST_PATH = '/safety-production-regulation/safety-system/list';
export const ADD_PATH = '/safety-production-regulation/safety-system/add';
export const EDIT_PATH = '/safety-production-regulation/safety-system/edit';
export const DETAIL_PATH = '/safety-production-regulation/safety-system/detail';
export const ADD_CODE = 'safetyProductionRegulation.safetySystem.add';
export const EDIT_CODE = 'safetyProductionRegulation.safetySystem.edit';
export const DETAIL_CODE = 'safetyProductionRegulation.safetySystem.view';
export const DELETE_CODE = 'safetyProductionRegulation.safetySystem.delete';
export const AUDIT_CODE = 'safetyProductionRegulation.safetySystem.audit';
export const PUBLISH_CODE = 'safetyProductionRegulation.safetySystem.publish';
export const EXPIRE_STATUSES = [
  { key: '0', value: '未到期' /* , color: '#52c41a' */ },
  { key: '1', value: '即将到期', color: '#faad14' },
  { key: '2', value: '已过期', color: '#f5222d' },
];
export const STATUSES = [
  { key: '1', value: '待审核' },
  { key: '2', value: '审核通过待发布' },
  { key: '3', value: '审核不通过' },
  { key: '4', value: '审核通过已发布' },
];
export const DEFAULT_FORMAT = 'YYYY-MM-DD';
export const DEFAULT_FORMAT2 = 'YYYY-MM-DD HH:mm:ss';
const STATUSES_MAPPER = {
  1: '待审核',
  2: '待发布',
  3: '审核不通过',
  4: '已发布',
  5: '已作废',
};
const BREADCRUMB_LIST = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '安全生产制度法规',
    name: '安全生产制度法规',
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const GET_LIST = 'safetySystem/getList';
const GET_HISTORY_LIST = 'safetySystem/getHistoryList';
const REMOVE = 'safetySystem/remove';
const AUDIT = 'safetySystem/audit';
const PUBLISH = 'safetySystem/publish';

@connect(
  ({ safetySystem, user, loading }) => ({
    safetySystem,
    user,
    loading: loading.effects[GET_LIST],
    loadingHistory: loading.effects[GET_HISTORY_LIST],
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
    getHistoryList(payload, callback) {
      dispatch({
        type: GET_HISTORY_LIST,
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
    audit(payload, callback) {
      dispatch({
        type: AUDIT,
        payload,
        callback,
      });
    },
    publish(payload, callback) {
      dispatch({
        type: PUBLISH,
        payload,
        callback,
      });
    },
    dispatch,
  })
)
export default class SafetySystemList extends Component {
  state = {
    historyVisible: false,
    data: undefined,
    reviewModalVisible: false, // 审核弹窗可见
    ruleId: undefined,
  };

  prevValues = null;

  componentDidMount() {
    const { getList } = this.props;
    getList();
  }

  setFormReference = form => {
    this.form = form;
  };

  reload = () => {
    const {
      safetySystem: { list: { pagination: { pageNum = 1, pageSize = getPageSize() } = {} } = {} },
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
  handleAddButtonClick = () => {
    router.push(ADD_PATH);
  };

  // 编辑按钮点击事件
  handleEditButtonClick = e => {
    const { id } = e.currentTarget.dataset;
    router.push(`${EDIT_PATH}/${id}`);
  };

  // 查看按钮点击事件
  handleDetailButtonClick = e => {
    const { id } = e.currentTarget.dataset;
    router.push(`${DETAIL_PATH}/${id}`);
  };

  // 删除按钮点击事件
  handleDeleteButtonClick = id => {
    const { remove } = this.props;
    remove({ id }, success => {
      if (success) {
        message.success('删除成功');
        this.reload();
      } else {
        message.error('删除失败，请稍后重试或联系管理人员！');
      }
    });
  };

  // 确认发布
  handlePublishConfirm = id => {
    const { publish } = this.props;
    publish(
      {
        id,
      },
      success => {
        if (success) {
          message.success('发布成功！');
          this.reload();
        } else {
          message.error('发布失败，请稍后重试或联系管理人员！');
        }
      }
    );
  };

  // 审核通过
  handleAuditConfirm = id => {
    const { audit } = this.props;
    audit(
      {
        id,
        status: 2,
      },
      success => {
        if (success) {
          message.success('审核成功！');
          this.reload();
        } else {
          message.error('审核失败，请稍后重试或联系管理人员！');
        }
      }
    );
  };

  // 审核不通过
  handleAuditCancel = id => {
    const { audit } = this.props;
    audit(
      {
        id,
        status: 3,
      },
      success => {
        if (success) {
          message.success('审核成功！');
          this.reload();
        } else {
          message.error('审核失败，请稍后重试或联系管理人员！');
        }
      }
    );
  };

  // 历史版本按钮点击
  handleHistoryButtonClick = data => {
    const { getHistoryList } = this.props;
    this.setState({
      historyVisible: true,
      data,
    });
    getHistoryList({
      id: data.id,
    });
  };

  // 查询
  handleSearch = values => {
    const {
      safetySystem: { list: { pagination: { pageSize = getPageSize() } = {} } = {} },
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
      safetySystem: { list: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {} },
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

  // 历史版本弹出框cancel
  handleModalCancel = () => {
    this.setState({
      historyVisible: false,
    });
  };

  // 历史版本表格chagne
  handleHistoryTableChange = ({ current, pageSize }) => {
    const {
      safetySystem: { list: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {} },
      getHistoryList,
    } = this.props;
    const { data } = this.state;
    getHistoryList({
      id: data.id,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    });
    prevPageSize !== pageSize && setPageSize(pageSize);
  };

  // 打开审核意见弹窗
  handleViewReviewModal = ruleId => {
    this.setState({ ruleId, reviewModalVisible: true });
  };

  // 提交审核意见
  handleSubmitReview = values => {
    const { dispatch } = this.props;
    const { ruleId } = this.state;
    if (!ruleId) {
      message.error('参数planId不存在');
      return;
    }
    const payload = { ...values, ruleId };
    dispatch({
      type: 'safetySystem/submitReview',
      payload,
      callback: res => {
        if (res && res.code === 200) {
          message.success('审核成功！');
          this.setState({ reviewModalVisible: false });
          this.reload();
        } else {
          message.warning('审核失败，请稍后重试');
        }
      },
    });
  };

  // 历史版本
  renderHistory() {
    const {
      safetySystem: {
        historyList: { list = [], pagination: { total, pageSize, pageNum } = {} },
      },
      loadingHistory,
    } = this.props;
    const { historyVisible } = this.state;
    const columns = [
      {
        title: '版本号',
        dataIndex: 'versionCode',
        render: value => `V${value}`,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: value => STATUSES_MAPPER[value],
        align: 'center',
      },
      {
        title: '编制人',
        dataIndex: 'compaileName',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: time => time && moment(time).format(DEFAULT_FORMAT2),
        align: 'center',
      },
      {
        title: '审核人',
        dataIndex: 'approveBy',
        align: 'center',
      },
      {
        title: '审核通过时间',
        dataIndex: 'approveDate',
        render: time => time && moment(time).format(DEFAULT_FORMAT2),
        align: 'center',
      },
      {
        title: '发布人',
        dataIndex: 'publishBy',
        align: 'center',
      },
      {
        title: '发布时间',
        dataIndex: 'publishDate',
        render: time => time && moment(time).format(DEFAULT_FORMAT2),
        align: 'center',
      },
      {
        title: '详情',
        dataIndex: 'operation',
        fixed: 'right',
        render: (_, { id }) => (
          <AuthA code={DETAIL_CODE} onClick={this.handleDetailButtonClick} data-id={id}>
            查看
          </AuthA>
        ),
        width: 80,
        align: 'center',
      },
    ];

    return (
      <Modal
        title="历史版本"
        visible={historyVisible}
        onCancel={this.handleModalCancel}
        footer={null}
        width="60%"
        className={styles.modal}
        zIndex={1009}
      >
        <Table
          className={styles.table}
          dataSource={list}
          columns={columns}
          rowKey="id"
          loading={loadingHistory}
          onChange={this.handleHistoryTableChange}
          scroll={{
            x: true,
          }}
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
      </Modal>
    );
  }

  renderForm() {
    const {
      user: {
        currentUser: { unitType, permissionCodes },
      },
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);

    const fields = [
      ...(isNotCompany
        ? [
            {
              id: 'companyName',
              label: '单位名称',
              transform: value => value.trim(),
              render: ({ handleSearch }) => (
                <Input placeholder="请输入单位名称" onPressEnter={handleSearch} maxLength={50} />
              ),
            },
          ]
        : []),
      {
        id: 'safetyName',
        label: '安全制度名称',
        transform: value => value.trim(),
        render: ({ handleSearch }) => (
          <Input placeholder="请输入安全制度名称" onPressEnter={handleSearch} maxLength={50} />
        ),
      },
      {
        id: 'compaileName',
        label: '编制人/联系电话',
        render: ({ handleSearch }) => (
          <Input placeholder="请选择编制人/联系电话" onPressEnter={handleSearch} maxLength={50} />
        ),
      },
      {
        id: 'paststatus',
        label: '到期状态',
        render: () => (
          <SelectOrSpan list={EXPIRE_STATUSES} placeholder="请选择到期状态" allowClear />
        ),
      },
      {
        id: 'status',
        label: '审核状态',
        render: () => <SelectOrSpan list={STATUSES} placeholder="请选择审核状态" allowClear />,
      },
    ];

    return (
      <Card className={styles.card} bordered={false}>
        <CustomForm
          fields={fields}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          action={
            <Button type="primary" onClick={this.handleAddButtonClick} disabled={!hasAddAuthority}>
              新增
            </Button>
          }
          ref={this.setFormReference}
        />
      </Card>
    );
  }

  renderTable() {
    const {
      safetySystem: { list: { list = [], pagination: { total, pageNum, pageSize } = {} } = {} },
      user: {
        currentUser: { permissionCodes, unitType },
      },
      loading = false,
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasAuditAuthority = permissionCodes.includes(AUDIT_CODE);
    const hasPublishAuthority = permissionCodes.includes(PUBLISH_CODE);
    const columns = [
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
        title: '安全制度名称',
        dataIndex: 'safetyName',
        align: 'center',
      },
      {
        title: '编制人',
        dataIndex: 'compaileName',
        render: (_, { compaileName, telephone }) => (
          <div className={styles.multi}>
            <div>
              <span className={styles.label}>姓名：</span>
              {compaileName}
            </div>
            <div>
              <span className={styles.label}>联系电话：</span>
              {telephone}
            </div>
          </div>
        ),
        align: 'center',
      },
      {
        title: '时间',
        dataIndex: 'time',
        render: (_, { startDate, endDate }) => (
          <div className={styles.multi}>
            <div>
              <span className={styles.label}>开始日期：</span>
              {startDate && moment(startDate).format(DEFAULT_FORMAT)}
            </div>
            <div>
              <span className={styles.label}>结束日期：</span>
              {endDate && moment(endDate).format(DEFAULT_FORMAT)}
            </div>
          </div>
        ),
        align: 'center',
      },
      {
        title: '到期状态',
        dataIndex: 'paststatus',
        render: value => {
          const { value: label, color } =
            EXPIRE_STATUSES.find(({ key }) => key === `${value}`) || {};
          return <span style={{ color }}>{label}</span>;
        },
        align: 'center',
      },
      {
        title: '附件',
        dataIndex: 'otherFileList',
        render: value => <CustomUpload className={styles.fileList} value={value} type="span" />,
        align: 'center',
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        render: value => <SelectOrSpan list={STATUSES} value={value} type="span" />,
        align: 'center',
      },
      {
        title: '历史版本',
        dataIndex: 'versionCount',
        width: 88,
        fixed: list && list.length > 0 ? 'right' : false,
        render: (value, data) => (
          <span
            className={value > 0 ? styles.operation : undefined}
            onClick={value > 0 ? () => this.handleHistoryButtonClick(data) : undefined}
          >
            {value > 0 ? value : '—'}
          </span>
        ),
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: 120,
        align: 'center',
        fixed: list && list.length > 0 ? 'right' : false,
        render: (_, { id, status }) => (
          <div style={{ textAlign: 'left' }}>
            <AuthA code={DETAIL_CODE} onClick={this.handleDetailButtonClick} data-id={id}>
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA
              hasAuthFn={() => +status === 1 && hasAuditAuthority}
              onClick={() => this.handleViewReviewModal(id)}
            >
              审核
            </AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              title="你确定要发布吗?"
              authority={+status === 2 && hasPublishAuthority}
              onConfirm={() => this.handlePublishConfirm(id)}
            >
              发布
            </AuthPopConfirm>
            {(+status === 3 || +status === 4) && (
              <Fragment>
                <Divider type="vertical" />
                <AuthA code={EDIT_CODE} onClick={this.handleEditButtonClick} data-id={id}>
                  编辑
                </AuthA>
              </Fragment>
            )}
          </div>
        ),
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
  }

  render() {
    const {
      user: {
        currentUser: { unitType },
      },
      safetySystem: { list: { a = 0 } = {} },
    } = this.props;
    const { reviewModalVisible } = this.state;
    const isNotCompany = unitType !== 4;
    const reviewModalProps = {
      visible: reviewModalVisible,
      onOk: this.handleSubmitReview,
      onCancel: () => {
        this.setState({ reviewModalVisible: false });
      },
    };
    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        content={isNotCompany && <span className={styles.count}>{`单位数量：${a}`}</span>}
      >
        {this.renderForm()}
        {this.renderTable()}
        {this.renderHistory()}
        {/* 审核提示弹窗 */}
        <ReviewModal {...reviewModalProps} />
      </PageHeaderLayout>
    );
  }
}
