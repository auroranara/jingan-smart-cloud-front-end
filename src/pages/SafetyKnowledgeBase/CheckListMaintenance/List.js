import React, { Component, Fragment } from 'react';
import {
  Button,
  Input,
  Card,
  Table,
  message,
  Modal,
  Divider,
  Form,
  Row,
  Col,
  Select,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import codes from '@/utils/codes'
import styles from './List.less';
// 审核弹窗
import ReviewModal from '@/pages/EmergencyManagement/EmergencyPlan/ReviewModal';
import { AuthPopConfirm, AuthA, AuthButton } from '@/utils/customAuth';

export const LIST_PATH = '/safety-production-regulation/check-list-maintenance/list';
export const ADD_PATH = '/safety-production-regulation/check-list-maintenance/add'
// 到期状态
export const EXPIRE_STATUSES = [
  { key: '0', value: '未到期' /* , color: '#52c41a' */ },
  { key: '1', value: '即将到期', color: '#faad14' },
  { key: '2', value: '已过期', color: '#f5222d' },
];
// 审核状态
export const STATUSES = [
  { key: '1', value: '待审核' },
  { key: '2', value: '审核通过待发布' },
  { key: '3', value: '审核不通过' },
  { key: '4', value: '审核通过已发布' },
];
// 检查类型
export const CHECK_TYPES = [
  { key: '1', value: '综合性检查' },
  { key: '2', value: '专业性检查' },
  { key: '3', value: '季节性检查' },
  { key: '4', value: '日常性检查' },
  { key: '5', value: '节假日检查' },
  { key: '6', value: '外部检查' },
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
const FormItem = Form.Item;

const {
  checkListMaintenance: {
    view: viewCode,
    add: addCode,
    edit: editCode,
    review: reviewCode,
    publish: publishCode,
  },
} = codes;

const TITLE = '检查表维护';
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

const colWrapper = {
  md: 8,
  sm: 12,
};
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };

@connect(({ user, safetyProductionRegulation }) => ({
  user,
  safetyProductionRegulation,
}))
@Form.create()
export default class CheckListMaintenance extends Component {

  state = {
    historyVisible: false,
    reviewModalVisible: false,
    detail: null,
    planId: null,
  }

  componentDidMount () {
    this.handleQuery();
  }

  setFormReference = form => {
    this.form = form;
  };

  // 查询列表
  handleQuery = (payload = {}) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const values = getFieldsValue();
    dispatch({
      type: 'safetyProductionRegulation/fetchCheckList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        ...payload,
        ...values,
      },
    })
  }

  handleReset = () => {
    const { resetFields } = this.props;
    resetFields();
    this.handleQuery();
  }

  // 获取历史
  fetchHistory = (payload = {}) => {
    const {
      dispatch,
    } = this.props;
    const { detail } = this.state;
    dispatch({
      type: 'safetyProductionRegulation/fetchCheckListHistory',
      payload: {
        pageNum: 1,
        pageSize: 10,
        relationId: detail.relationId,
        ...payload,
      },
    })
  }

  handleToAdd = () => { router.push(ADD_PATH) }

  // 点击打开历史版本
  handleHistoryButtonClick = detail => {
    this.setState({
      historyVisible: true,
      detail,
    }, () => {
      this.fetchHistory();
    });
  }

  // 发布操作
  handlePublishConfirm = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'safetyProductionRegulation/publishCheckList',
      payload: { id },
      callback: (success, msg) => {
        if (success) {
          message.success('发布成功！');
          this.handleQuery();
        } else { message.error(msg || '发布失败，请稍后重试或联系管理人员！') }
      },
    })
  }

  // 点击查看
  handleView = id => {
    router.push(`/safety-production-regulation/check-list-maintenance/detail/${id}`)
  }

  // 点击编辑
  handleEdit = id => {
    router.push(`/safety-production-regulation/check-list-maintenance/edit/${id}`)
  }

  // 点击打开审核弹窗
  handleViewReviewModal = (planId) => {
    this.setState({ planId, reviewModalVisible: true })
  }

  // 提交审核
  handleSubmitReview = values => {
    const { dispatch } = this.props;
    const { planId } = this.state;
    if (!planId) {
      message.error('参数planId不存在');
      return;
    }
    const { otherFile, ...resValues } = values;
    const payload = {
      ...resValues,
      planId,
      approveAccessoryContent: otherFile ? JSON.parse(otherFile) : undefined,
    };
    // console.log('审核', payload);
    dispatch({
      type: 'safetyProductionRegulation/reviewCheckList',
      payload: payload,
      callback: (success, msg) => {
        if (success) {
          message.success('审核成功！');
          this.setState({ reviewModalVisible: false });
          this.handleQuery();
        } else {
          message.error(msg || '审核失败，请稍后重试或联系管理人员！')
        }
      },
    })
  }

  renderForm = () => {
    const {
      user: { isCompany },
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card bordered={false}>
        <Form>
          <Row gutter={30}>
            {!isCompany && (
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('companyName')(
                    <Input placeholder="请输入单位名称" />
                  )}
                </FormItem>
              </Col>
            )}
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('type')(
                  <Select placeholder="请选择检查类型">
                    {CHECK_TYPES.map(({ key, value }) => (
                      <Select.Option key={key} value={key}>{value}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="请输入编制人" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('phone')(
                  <Input placeholder="请输入联系电话" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('paststatus')(
                  <Select placeholder="请选择到期状态">
                    {EXPIRE_STATUSES.map(({ key, value }) => (
                      <Select.Option key={key} value={key}>{value}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择审核状态">
                    {STATUSES.map(({ key, value }) => (
                      <Select.Option key={key} value={key}>{value}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>
                  查询
                </Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                  重置
                </Button>
                <AuthButton code={addCode} type="primary" onClick={this.handleToAdd}>
                  新增
                </AuthButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  renderTable = () => {
    const {
      user: { isCompany, currentUser: { permissionCodes } },
      safetyProductionRegulation: {
        checkList: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      },
    } = this.props;
    const hasReviewAuthority = permissionCodes.includes(reviewCode);
    const hasPublishAuthority = permissionCodes.includes(publishCode);
    const columns = [
      ...isCompany ? [] : [{
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 250,
      }],
      {
        title: '检查类型',
        dataIndex: 'type',
        align: 'center',
        width: 150,
        render: (val) => {
          const target = CHECK_TYPES.find(item => item.key === val);
          return target ? target.value : '';
        },
      },
      {
        title: '编制人',
        dataIndex: 'compaileName',
        width: 200,
        render: (_, { name, phone }) => (
          <div className={styles.multi}>
            <div>
              <span className={styles.label}>姓名：</span>
              {name}
            </div>
            <div>
              <span className={styles.label}>联系电话：</span>
              {phone}
            </div>
          </div>
        ),
        align: 'center',
      },
      {
        title: '时间',
        dataIndex: 'time',
        width: 200,
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
        width: 150,
        render: value => {
          const { value: label, color } =
            EXPIRE_STATUSES.find(({ key }) => key === `${value}`) || {};
          return <span style={{ color }}>{label}</span>;
        },
        align: 'center',
      },
      {
        title: '附件',
        dataIndex: 'accessoryContent',
        render: value => <CustomUpload className={styles.fileList} value={value} type="span" />,
        align: 'center',
        width: 200,
      },
      {
        title: '审核状态',
        dataIndex: 'status',
        render: value => <SelectOrSpan list={STATUSES} value={value} type="span" />,
        align: 'center',
        width: 150,
      },
      {
        title: '历史版本',
        dataIndex: 'versionCount',
        width: 100,
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
        width: 200,
        align: 'center',
        fixed: list && list.length > 0 ? 'right' : false,
        render: (_, { id, status }) => (
          <div style={{ textAlign: 'left' }}>
            <AuthA code={viewCode} onClick={() => this.handleView(id)} data-id={id}>
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA
              hasAuthFn={() => +status === 1 && hasReviewAuthority}
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
                <AuthA code={editCode} onClick={() => this.handleEdit(id)} data-id={id}>
                  编辑
                </AuthA>
              </Fragment>
            )}
          </div>
        ),
      },
    ];
    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          // loading={loading}
          columns={columns}
          dataSource={list}
          bordered
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: (pageNum, pageSize) => {
              this.handleQuery({ pageNum, pageSize });
            },
            onShowSizeChange: (pageNum, pageSize) => {
              this.handleQuery({ pageNum, pageSize });
            },
          }}
        />
      </Card>
    ) : (
        <div style={{ textAlign: 'center', padding: '70px' }}> 暂无数据</div>
      );
  }

  // 历史版本
  renderHistory () {
    const {
      safetyProductionRegulation: {
        checkListHistory: { list = [], pagination: { total, pageSize, pageNum } = {} },
      },
    } = this.props;
    const { historyVisible } = this.state;
    const columns = [
      {
        title: '版本号',
        dataIndex: 'editionCode',
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
        dataIndex: 'name',
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
    ];

    return (
      <Modal
        title="历史版本"
        visible={historyVisible}
        onCancel={() => { this.setState({ historyVisible: false }) }}
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
          // loading={loadingHistory}
          scroll={{
            x: true,
          }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: (pageNum, pageSize) => {
              this.fetchHistory({ pageNum, pageSize });
            },
            onShowSizeChange: (pageNum, pageSize) => {
              this.fetchHistory({ pageNum, pageSize });
            },
          }}
        />
      </Modal>
    );
  }

  render () {
    const { reviewModalVisible } = this.state;
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
      // content={!isCompany && <span className={styles.count}>{`单位数量：${a}`}</span>}
      >
        {this.renderForm()}
        {this.renderTable()}
        {this.renderHistory()}
        {/* 审核提示弹窗 */}
        <ReviewModal {...reviewModalProps} />
      </PageHeaderLayout>
    )
  }
}
