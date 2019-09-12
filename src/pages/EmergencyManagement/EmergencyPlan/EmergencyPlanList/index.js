import React, { Component, Fragment } from 'react';
import { Card, Input, Select, Button, Table, Popconfirm, Modal } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import classNames from 'classnames';
import {
  TITLE,
  BREADCRUMB_LIST,
  TYPE_CODES,
  RECORD_STATUSES,
  AUDIT_STATUSES,
  PUBLISH_STATUSES,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUM,
  ADD_CODE,
  EDIT_CODE,
  DETAIL_CODE,
  AUDIT_CODE,
  PUBLISH_CODE,
} from './config';
import styles from './index.less';

const { Option } = Select;

@connect(({ emergencyPlan, user, loading }) => ({
  emergencyPlan,
  user,
  listLoading: loading.effects['emergencyPlan/fetchList'],
  // historyLoading: loading.effects['emergencyPlan/fetchHistory'],
}))
export default class EmergencyPlanList extends Component {
  state = {
    historyVisible: false,
    history: undefined,
  }

  componentDidMount() {
    this.getList();
  }

  getList = (payload) => {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'emergencyPlan/fetchList',
      payload: {
        pageNum: DEFAULT_PAGE_NUM,
        pageSize: DEFAULT_PAGE_SIZE,
        ...payload,
      },
    });
  }

  // getHistory = (payload) => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'emergencyPlan/fetchHistory',
  //     payload: {
  //       pageNum: DEFAULT_PAGE_NUM,
  //       pageSize: DEFAULT_PAGE_SIZE,
  //       ...payload,
  //     },
  //   });
  // }

  setFormReference = form => {
    this.form = form;
  }

  // 显示历史版本
  showHistory = (history) => {
    this.setState({
      historyVisible: true,
      history,
    });
  }

  // 隐藏历史版本
  hideHistory = () => {
    this.setState({
      historyVisible: false,
    });
  }

  // 查询按钮点击事件
  handleSearch = (values) => {
    this.getList(values);
  }

  // 重置按钮点击事件
  handleReset = (values) => {
    this.getList(values);
  }

  // 列表change事件
  handleListChange = (pageNum, pageSize) => {
    const { getFieldsValue } = this.form;
    const values = getFieldsValue();
    this.getList({
      ...values,
      pageNum,
      pageSize,
    });
  }

  // 历史change事件
  handleHistoryChange = (pageNum, pageSize) => {
    const { historyId } = this.state;
    this.getHistory({
      id: historyId,
      pageNum,
      pageSize,
    });
  }

  // 新增按钮点击事件
  handleAddClick = () => {
    router.push('/emergency-management/emergency-plan/add');
  }

  // 编辑按钮点击事件
  handleEditClick = (e) => {
    const { id } = e.currentTarget.dataset.id;
    router.push(`/emergency-management/emergency-plan/edit/${id}`);
  }

  // 查看按钮点击事件
  handleViewClick = (e) => {
    const { id } = e.currentTarget.dataset.id;
    router.push(`/emergency-management/emergency-plan/detail/${id}`);
  }

  // 确认发布
  handlePublishConfirm = () => {
    alert('确认发布');
  }

  // 审核通过
  handleAuditConfirm = (e) => {
    console.log(e);
    alert('审核通过');
  }

  // 审核不通过
  handleAuditCancel = () => {
    alert('审核不通过');
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

    const FIELDS = [
      {
        id: 'planName',
        label: '预案名称',
        transform: value => value.trim(),
        render: _this => <Input placeholder="请输入预案名称" onPressEnter={_this.handleSearch} maxLength={50} />,
      },
      {
        id: 'code',
        label: '预案类型代码',
        render: () => (
          <Select placeholder="请选择预案类型代码" allowClear>
            {TYPE_CODES.map(({ key, value }) => <Option key={key}>{value}</Option>)}
          </Select>
        ),
      },
      {
        id: 'recordStatus',
        label: '是否已备案',
        render: () => (
          <Select placeholder="请选择是否已备案" allowClear>
            {RECORD_STATUSES.map(({ key, value }) => <Option key={key}>{value}</Option>)}
          </Select>
        ),
      },
      {
        id: 'companyName',
        label: '单位名称',
        transform: value => value.trim(),
        render: _this => <Input placeholder="请输入单位名称" onPressEnter={_this.handleSearch} maxLength={50} />,
      },
      {
        id: 'auditStatus',
        label: '审核状态',
        render: () => (
          <Select placeholder="请选择审核状态" allowClear>
            {AUDIT_STATUSES.map(({ key, value }) => <Option key={key}>{value}</Option>)}
          </Select>
        ),
      },
      {
        id: 'publishStatus',
        label: '发布状态',
        render: () => (
          <Select placeholder="请选择发布状态" allowClear>
            {PUBLISH_STATUSES.map(({ key, value }) => <Option key={key}>{value}</Option>)}
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
          action={hasAddAuthority && (
            <Button type="primary" onClick={this.handleAddClick}>新增</Button>
          )}
          wrappedComponentRef={this.setFormReference}
        />
      </Card>
    );
  }

  renderTable = () => {
    const {
      emergencyPlan: {
        list: {
          list=[],
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
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    const hasAuditAuthority = permissionCodes.includes(AUDIT_CODE);
    const hasPublishAuthority = permissionCodes.includes(PUBLISH_CODE);

    const COLUMNS = (isNotCompany ? [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
      },
    ] : []).concat([
      {
        title: '预案基本信息',
        dataIndex: 'basicInfo',
        render: (_, { name, majorHazard, applicationArea, versionType, version }) => (
          <div className={styles.multi}>
            <div>预案名称：{name}</div>
            <div>重大危险源：{+majorHazard ? '是' : '否'}</div>
            <div>使用领域：{applicationArea}</div>
            <div>{+versionType === 0 ? '创建' : '修订'}，{`V${version}`}</div>
          </div>
        ),
        align: 'center',
      },
      {
        title: '有效期至',
        dataIndex: 'expiryDate',
        render: expiryDate => expiryDate && moment(expiryDate).format('YYYY.M.D'),
        align: 'center',
      },
      {
        title: '代码',
        dataIndex: 'code',
        render: (_, { typeCode, securityCode }) => (
          <div className={styles.multi}>
            <div>类型代码：{typeCode}</div>
            <div>密级代码：{securityCode}</div>
          </div>
        ),
        align: 'center',
      },
      {
        title: '备案',
        dataIndex: 'record',
        render: (_, { recordStatus, recordNumber, recordDate, recordCredential: { webUrl, name } }) => +recordStatus > 0 ? (
          <div className={styles.multi}>
            <div>已备案</div>
            <div>备案编号：{recordNumber}</div>
            <div>备案日期：{moment(recordDate).format('YYYY.M.D')}</div>
            <div>备案证明：<a className={styles.clickable} href={webUrl} target="_blank" rel="noopener noreferrer">{name}</a></div>
          </div>
        ) : '未备案',
        align: 'center',
      },
      {
        title: '预案附件',
        dataIndex: 'attachment',
        render: ({ webUrl, name }) => <a className={styles.clickable} href={webUrl} target="_blank" rel="noopener noreferrer">{name}</a>,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'auditStatus',
        render: (_, { auditStatus, publishStatus }) => {
          if (+auditStatus === 0) {
            return '待审核';
          } else if (auditStatus > 0) {
            if (+publishStatus === 0) {
              return '审核通过待发布';
            } else {
              return '审核通过已发布'
            }
          } else {
            return '审核不通过';
          }
        },
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: list && list.length > 0 ? 'right' : false,
        render: (_, { id, auditStatus, publishStatus }) => (
          <Fragment>
            {hasDetailAuthority && <span className={classNames(styles.clickable, styles.operation)} onClick={this.handleViewClick} data-id={id}>查看</span>}
            {hasAuditAuthority && +auditStatus === 0 && (
              <Popconfirm title="是否通过这个应急预案?" onConfirm={this.handleAuditConfirm} onCancel={this.handleAuditCancel} okText="通过" cancelText="不通过">
                <span className={classNames(styles.clickable, styles.operation)} data-id={id}>审核</span>
              </Popconfirm>
            )}
            {hasPublishAuthority && +auditStatus > 0 && +publishStatus === 0 && (
              <Popconfirm title="你确定要发布这个应急预案吗?" onConfirm={this.handlePublishConfirm}>
                <span className={classNames(styles.clickable, styles.operation)} data-id={id}>发布</span>
              </Popconfirm>
            )}
            {hasEditAuthority && (+auditStatus === -1 || (+auditStatus > 0 && +publishStatus > 0)) && <span className={classNames(styles.clickable, styles.operation)} onClick={this.handleEditClick} data-id={id}>编辑</span>}
          </Fragment>
        ),
        align: 'center',
      },
      {
        title: '历史版本',
        dataIndex: 'history',
        fixed: list && list.length > 0 ? 'right' : false,
        render: history => (
          <span className={classNames(styles.clickable, styles.operation)} onClick={() => this.showHistory(history)}>{history && history.length || 0}</span>
        ),
        align: 'center',
      },
    ]);

    return (
      <Card className={styles.card} bordered={false}>
        <Table
          className={styles.table}
          dataSource={list}
          columns={COLUMNS}
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
      </Card>
    );
  }

  // 历史版本
  renderHistory() {
    const { historyVisible, history } = this.state;
    const COLUMNS = [
      {
        title: '版本号',
        dataIndex: 'version',
        render: (version) => `V${version}`,
        // width: 96,
        width: 128,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (status) => ({ 0: '待审核', 1: '已发布', 2: '已作废' }[status]),
        // width: 96,
        width: 128,
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: (time) => moment(time).format('YYYY.M.D'),
        // width: 96,
        width: 128,
        align: 'center',
      },
      {
        title: '创建人',
        dataIndex: 'createPerson',
        // width: 96,
        align: 'center',
      },
      {
        title: '审核通过时间',
        dataIndex: 'auditPassTime',
        render: (time) => moment(time).format('YYYY.M.D'),
        width: 128,
        align: 'center',
      },
      {
        title: '审核人',
        dataIndex: 'auditPerson',
        // width: 96,
        align: 'center',
      },
      {
        title: '发布时间',
        dataIndex: 'publishTime',
        render: (time) => moment(time).format('YYYY.M.D'),
        // width: 96,
        width: 128,
        align: 'center',
      },
      {
        title: '发布人',
        dataIndex: 'publishPerson',
        // width: 96,
        align: 'center',
      },
      {
        title: '详情',
        dataIndex: 'operation',
        fixed: 'right',
        render: (_, { id }) => <span className={classNames(styles.clickable, styles.operation)} onClick={this.handleViewClick} data-id={id}>查看</span>,
        width: 80,
        align: 'center',
      },
    ];

    return (
      <Modal
        title="历史版本"
        visible={historyVisible}
        onCancel={this.hideHistory}
        footer={null}
        width="50%"
        className={styles.modal}
        zIndex={9999}
      >
        <Table
          // className={styles.table}
          dataSource={history || []}
          columns={COLUMNS}
          rowKey="id"
          scroll={{
            x: 976,
            y: 300,
          }}
          pagination={false}
        />
      </Modal>
    );
  }

  render() {
    const {
      emergencyPlan: {
        list: {
          pagination: {
            total=0,
          }={},
        }={},
      },
      user: {
        currentUser: {
          unitType,
        },
      },
    } = this.props;
    const isNotCompany = unitType !== 4;

    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        content={
          <Fragment>
            {isNotCompany && <span className={styles.companyNumber}>{`单位数量：${0}`}</span>}
            <span>{`预案数量：${total}`}</span>
          </Fragment>
        }
      >
        {this.renderForm()}
        {this.renderTable()}
        {this.renderHistory()}
      </PageHeaderLayout>
    );
  }
}
