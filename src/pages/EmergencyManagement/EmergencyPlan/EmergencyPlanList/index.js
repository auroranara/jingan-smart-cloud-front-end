import React, { Component, Fragment } from 'react';
import { Card, Input, Select, Button, Table, Popconfirm, Modal, Spin, message } from 'antd';
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
  SECRET_CODES,
  STATUSES,
} from './config';
import styles from './index.less';

const { Option } = Select;

@connect(({ emergencyPlan, user, loading }) => ({
  emergencyPlan,
  user,
  loadingList: loading.effects['emergencyPlan/fetchList'],
  loadingHistory: loading.effects['emergencyPlan/fetchHistory'],
  auditing: loading.effects['emergencyPlan/audit'],
  publishing: loading.effects['emergencyPlan/publish'],
}))
export default class EmergencyPlanList extends Component {
  state = {
    historyVisible: false,
    history: undefined,
    currentAuditStatus: undefined,
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

  getHistory = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyPlan/fetchHistory',
      payload: {
        pageNum: DEFAULT_PAGE_NUM,
        pageSize: DEFAULT_PAGE_SIZE,
        ...payload,
      },
    });
  }

  setFormReference = form => {
    this.form = form;
  }

  // 显示历史版本
  showHistory = (history) => {
    this.getHistory({ id: history.id });
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
    const { auditStatus, publishStatus, ...rest } = values;
    let status;
    if (!auditStatus && !publishStatus) {
      status = undefined;
    } else if (auditStatus === '0' && !publishStatus) {
      status = '1';
    } else if (auditStatus === '-1' && !publishStatus){
      status = '3';
    } else if ((auditStatus === '1' || !auditStatus) && publishStatus === '0') {
      status = '2';
    } else if ((auditStatus === '1' || !auditStatus) && publishStatus === '1') {
      status = '4';
    } else {
      status = '-1';
    }
    this.getList({ ...rest, status });
  }

  // 重置按钮点击事件
  handleReset = (values) => {
    const { auditStatus } = values;
    this.handleSearch(values);
    this.setState({
      currentAuditStatus: auditStatus,
    });
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
    const { history: { id } } = this.state;
    this.getHistory({
      id,
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
    const { id } = e.currentTarget.dataset;
    router.push(`/emergency-management/emergency-plan/edit/${id}`);
  }

  // 查看按钮点击事件
  handleViewClick = (e) => {
    const { id } = e.currentTarget.dataset;
    router.push(`/emergency-management/emergency-plan/detail/${id}`);
  }

  // 确认发布
  handlePublishConfirm = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyPlan/publish',
      payload: {
        id,
      },
      callback: (isSuccess) => {
        if (isSuccess) {
          message.success('发布成功！');
          const {
            emergencyPlan: {
              list: {
                pagination: {
                  pageSize=DEFAULT_PAGE_SIZE,
                }={},
              },
            },
          } = this.props;
          this.handleListChange(DEFAULT_PAGE_NUM, pageSize);
        } else {
          message.error('发布失败，请稍后重试！');
        }
      },
    });
  }

  // 审核通过
  handleAuditConfirm = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyPlan/audit',
      payload: {
        id,
        status: 2,
      },
      callback: (isSuccess) => {
        if (isSuccess) {
          message.success('审核成功！');
          const {
            emergencyPlan: {
              list: {
                pagination: {
                  pageSize=DEFAULT_PAGE_SIZE,
                }={},
              },
            },
          } = this.props;
          this.handleListChange(DEFAULT_PAGE_NUM, pageSize);
        } else {
          message.error('审核失败，请稍后重试！');
        }
      },
    });
  }

  // 审核不通过
  handleAuditCancel = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyPlan/audit',
      payload: {
        id,
        status: 3,
      },
      callback: (isSuccess) => {
        if (isSuccess) {
          message.success('审核成功！');
          const {
            emergencyPlan: {
              list: {
                pagination: {
                  pageSize=DEFAULT_PAGE_SIZE,
                }={},
              },
            },
          } = this.props;
          this.handleListChange(DEFAULT_PAGE_NUM, pageSize);
        } else {
          message.error('审核失败，请稍后重试！');
        }
      },
    });
  }

  handleAuditStatusChange = (currentAuditStatus) => {
    this.setState({
      currentAuditStatus,
    });
  }

  renderForm() {
    const {
      user: {
        currentUser: {
          permissionCodes,
        },
      },
    } = this.props;
    const { currentAuditStatus } = this.state;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);

    const FIELDS = [
      {
        id: 'name',
        label: '预案名称',
        transform: value => value.trim(),
        render: _this => <Input placeholder="请输入预案名称" onPressEnter={_this.handleSearch} maxLength={50} />,
      },
      {
        id: 'lxLevelCode',
        label: '预案类型代码',
        render: () => (
          <Select placeholder="请选择预案类型代码" allowClear>
            {TYPE_CODES.map(({ key, value }) => <Option key={key}>{value}</Option>)}
          </Select>
        ),
      },
      {
        id: 'isRecord',
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
          <Select placeholder="请选择审核状态" allowClear onChange={this.handleAuditStatusChange}>
            {AUDIT_STATUSES.map(({ key, value }) => <Option key={key}>{value}</Option>)}
          </Select>
        ),
      },
      ...(+currentAuditStatus === 1 ? [{
        id: 'publishStatus',
        label: '发布状态',
        render: () => (
          <Select placeholder="请选择发布状态" allowClear>
            {PUBLISH_STATUSES.map(({ key, value }) => <Option key={key}>{value}</Option>)}
          </Select>
        ),
      }] : []),
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
          ref={this.setFormReference}
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
      loadingList,
      auditing,
      publishing,
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
        render: (_, { name, isMajorHazard, applicationArea, editionType, editionCode }) => (
          <div className={styles.multi}>
            <div>预案名称：{name}</div>
            <div>重大危险源：{+isMajorHazard ? '是' : '否'}</div>
            <div>使用领域：{applicationArea}</div>
            <div>{+editionType !== 2 ? '创建' : '修订'}，{`V${editionCode}`}</div>
          </div>
        ),
        align: 'center',
      },
      {
        title: '有效期至',
        dataIndex: 'endDate',
        render: endDate => endDate && moment(endDate).format('YYYY.M.D'),
        align: 'center',
      },
      {
        title: '代码',
        dataIndex: 'code',
        render: (_, { lxLevelCode, mjLevelCode }) => {
          lxLevelCode = TYPE_CODES.filter(({ key }) => key === lxLevelCode)[0];
          mjLevelCode = SECRET_CODES.filter(({ key }) => key === mjLevelCode)[0];
          return (
            <div className={styles.multi}>
              <div>类型代码：{lxLevelCode && lxLevelCode.value}</div>
              <div>密级代码：{mjLevelCode && mjLevelCode.value}</div>
            </div>
          );
        },
        align: 'center',
      },
      {
        title: '备案',
        dataIndex: 'record',
        render: (_, { isRecord, recordCode, recordDate, recordCertificateList }) => isRecord > 0 ? (
          <div className={styles.multi}>
            <div>已备案</div>
            <div>备案编号：{recordCode}</div>
            <div>备案日期：{moment(recordDate).format('YYYY.M.D')}</div>
            <div>备案证明：
              {recordCertificateList && recordCertificateList.map(({ webUrl, fileName }, index) => (
                <div key={index}>
                  <a className={styles.clickable} href={webUrl} target="_blank" rel="noopener noreferrer">{fileName}</a>
                </div>
              ))}
            </div>
          </div>
        ) : '未备案',
        align: 'center',
      },
      {
        title: '预案附件',
        dataIndex: 'emergencyFilesList',
        render: (emergencyFilesList) => (
          <Fragment>
            {emergencyFilesList && emergencyFilesList.map(({ webUrl, fileName }, index) => (
              <div key={index}>
                <a className={styles.clickable} href={webUrl} target="_blank" rel="noopener noreferrer">{fileName}</a>
              </div>
            ))}
          </Fragment>
        ),
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (status) => {
          status = STATUSES.filter(({ key }) => key === status)[0];
          return status && status.value;
        },
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: list && list.length > 0 ? 'right' : false,
        render: (_, { id, status }) => (
          <Fragment>
            {hasDetailAuthority && <span className={classNames(styles.clickable, styles.operation)} onClick={this.handleViewClick} data-id={id}>查看</span>}
            {hasAuditAuthority && +status === 1 && (
              <Popconfirm title="是否通过这个应急预案?" onConfirm={() => this.handleAuditConfirm(id)} onCancel={() => this.handleAuditCancel(id)} okText="通过" cancelText="不通过">
                <span className={classNames(styles.clickable, styles.operation)}>审核</span>
              </Popconfirm>
            )}
            {hasPublishAuthority && +status === 2 && (
              <Popconfirm title="你确定要发布这个应急预案吗?" onConfirm={() => this.handlePublishConfirm(id)}>
                <span className={classNames(styles.clickable, styles.operation)}>发布</span>
              </Popconfirm>
            )}
            {hasEditAuthority && (+status === 3 || +status === 4) && <span className={classNames(styles.clickable, styles.operation)} onClick={this.handleEditClick} data-id={id}>编辑</span>}
          </Fragment>
        ),
        align: 'center',
      },
      {
        title: '历史版本',
        dataIndex: 'versionCount',
        fixed: list && list.length > 0 ? 'right' : false,
        render: (versionCount, item) => (
          <span className={classNames(styles.clickable, styles.operation)} onClick={() => this.showHistory(item)}>{versionCount || 1}</span>
        ),
        align: 'center',
      },
    ]);

    return (
      <Card className={styles.card} bordered={false}>
        <Spin spinning={loadingList || auditing || publishing || false}>
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
        </Spin>
      </Card>
    );
  }

  // 历史版本
  renderHistory() {
    const {
      emergencyPlan: {
        history: {
          list=[],
          pagination: {
            total=0,
            pageSize=0,
            pageNum=0,
          }={},
        },
      },
      loadingHistory,
    } = this.props;
    const { historyVisible } = this.state;
    const COLUMNS = [
      {
        title: '版本号',
        dataIndex: 'editionCode',
        render: (editionCode) => `V${editionCode}`,
        width: 128,
        align: 'center',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: (status) => {
          status = STATUSES.filter(({ key }) => key === status)[0];
          return status && status.value;
        },
        width: 128,
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'createDate',
        render: (time) => time && moment(time).format('YYYY.M.D'),
        width: 128,
        align: 'center',
      },
      {
        title: '创建人',
        dataIndex: 'createName',
        align: 'center',
      },
      {
        title: '审核通过时间',
        dataIndex: 'approveDate',
        render: (time) => time && moment(time).format('YYYY.M.D'),
        width: 128,
        align: 'center',
      },
      {
        title: '审核人',
        dataIndex: 'approveName',
        align: 'center',
      },
      {
        title: '发布时间',
        dataIndex: 'publishDate',
        render: (time) => time && moment(time).format('YYYY.M.D'),
        width: 128,
        align: 'center',
      },
      {
        title: '发布人',
        dataIndex: 'publishName',
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
        width="60%"
        className={styles.modal}
        zIndex={9999}
      >
        <Spin spinning={!!loadingHistory}>
          <Table
            className={styles.table}
            dataSource={list || []}
            columns={COLUMNS}
            rowKey="id"
            scroll={{
              x: true,
              // x: 976,
              // y: 300,
            }}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              pageSizeOptions: ['5', '10', '15', '20'],
              // showTotal: total => `共 ${total} 条`,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: this.handleHistoryChange,
              onShowSizeChange: (num, size) => {
                this.handleHistoryChange(1, size);
              },
            }}
          />
        </Spin>
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
