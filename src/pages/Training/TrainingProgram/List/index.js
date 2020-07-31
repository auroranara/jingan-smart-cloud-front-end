import React, { Component, Fragment } from 'react';
import { Input, Select, Spin, Card, Button, Table, Modal, Popconfirm, message, Empty } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import CustomUpload from '@/jingan-components/CustomUpload';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import classNames from 'classnames';
import { getPageSize, setPageSize } from '@/utils/utils';
import {
  TITLE,
  BREADCRUMB_LIST,
  DEFAULT_FORMAT,
  DEFAULT_PAGE_NUM,
  DEFAULT_PAGE_SIZE,
  DETAIL_CODE,
  ADD_CODE,
  EDIT_CODE,
  DELETE_CODE,
  FORMS,
  STATUSES,
  LEVELS,
  SPAN,
  LABEL_COL,
  EDIT_PATH,
  ADD_PATH,
  TrainingType,
  DETAIL_PATH,
} from '../const';
import styles from './index.less';

const { Option } = Select;

function getLabels(options, value) {
  if (!value)
    return '';
  
  const map = options.reduce((accum, { key, value }) => {
    accum[key] = value;
    return accum;
  }, {})

  return value.toString().split(',').map(v => map[v]).join('、');
}

@connect(
  ({ trainingProgram, user, loading }) => ({
    trainingProgram,
    user,
    loaidng: loading.effects['trainingProgram/fetchList'],
    executing: loading.effects['trainingProgram/execute'],
  }),
  dispatch => ({
    getList(payload, callback) {
      dispatch({
        type: 'trainingProgram/fetchList',
        payload,
        callback,
      });
    },
    remove(payload, callback) {
      dispatch({
        type: 'trainingProgram/remove',
        payload,
        callback,
      });
    },
    execute(payload, callback) {
      dispatch({
        type: 'trainingProgram/execute',
        payload,
        callback,
      });
    },
  })
)
export default class TrainingProgramList extends Component {
  state = {
    visible: false,
    data: undefined,
  };

  componentDidMount() {
    this.getList();
  }

  setFormReference = form => {
    this.form = form;
  };

  setForm2Reference = form2 => {
    this.form2 = form2;
  };

  getList = payload => {
    const {
      trainingProgram: {
        list: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {},
      },
      getList,
    } = this.props;
    const { current = 1, pageSize = getPageSize() } = payload || {};
    const values = this.form && this.form.getFieldsValue();
    getList({
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
      ...values,
      ...payload,
    });
    setPageSize(pageSize);
  };

  reload = () => {
    const {
      trainingProgram: { list: { pagination: { pageNum = 1 } = {} } = {} },
    } = this.props;
    this.getList({
      current: pageNum,
    });
  };

  // 新增按钮点击事件
  handleAddClick = () => {
    router.push(ADD_PATH);
  };

  // 编辑按钮点击事件
  handleEditClick = e => {
    const { id } = e.currentTarget.dataset;
    // router.push(`${EDIT_PATH}/${id}`);
    window.open(`${window.publicPath}#${EDIT_PATH}/${id}`);
  };

  // 查看按钮点击事件
  handleViewClick = e => {
    const { id } = e.currentTarget.dataset;
    // router.push(`${DETAIL_PATH}/${id}`);
    window.open(`${window.publicPath}#${DETAIL_PATH}/${id}`);
  };

  // 删除按钮点击事件
  handleDeleteClick = id => {
    const { remove } = this.props;
    remove({ id }, (isSuccess, msg) => {
      if (isSuccess) {
        message.success('删除成功');
        this.reload();
      } else {
        message.error(msg || '删除失败，请稍后重试！');
      }
    });
  };

  // 执行按钮点击事件
  handleExecuteClick = data => {
    this.setState({
      visible: true,
      data,
    });
  };

  // 模态框取消事件
  handleModalCancel = () => {
    this.setState({
      visible: false,
    });
    this.form2 && this.form2.resetFields();
  };

  // 模态框确定事件
  handleModalConfirm = () => {
    const { execute } = this.props;
    const {
      data: { id },
    } = this.state;
    const { validateFieldsAndScroll } = this.form2;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        execute(
          {
            id,
            ...values,
          },
          isSuccess => {
            if (isSuccess) {
              message.success(`关联成功！`);
              this.reload();
            } else {
              message.error(`关联失败，请稍后重试！`);
            }
            this.setState({
              visible: false,
            });
            this.form2 && this.form2.resetFields();
          }
        );
      }
    });
  };

  renderForm() {
    const {
      user: {
        currentUser: { unitType, permissionCodes },
      },
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
        id: 'trainingPlanName',
        label: '培训计划名称',
        transform: value => value.trim(),
        render: _this => (
          <Input
            placeholder="请输入培训计划名称"
            onPressEnter={_this.handleSearch}
            maxLength={50}
          />
        ),
      },
      {
        id: 'trainingType',
        label: '培训类型',
        render: () => (
          <Select placeholder="请选择培训类型">
            {TrainingType.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'trainingLevel',
        label: '培训分级',
        render: () => (
          <Select placeholder="请选择培训分级" allowClear>
            {LEVELS.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'planStatus',
        label: '计划状态',
        render: () => (
          <Select placeholder="请选择计划状态" allowClear>
            {STATUSES.map(({ key, value }) => (
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
          onSearch={this.getList}
          onReset={this.getList}
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
      trainingProgram: {
        list: {
          list = [],
          pagination: { pageSize = DEFAULT_PAGE_SIZE, pageNum = DEFAULT_PAGE_NUM, total = 0 } = {},
        } = {},
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
      loading,
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    const hasDeleteAuthority = permissionCodes.includes(DELETE_CODE);

    const COLUMNS = (isNotCompany
      ? [
          {
            title: '单位名称',
            dataIndex: 'companyName',
            align: 'center',
          },
        ]
      : []
    ).concat([
      {
        title: '培训计划名称',
        dataIndex: 'trainingPlanName',
        align: 'center',
      },
      {
        title: '培训类型',
        dataIndex: 'trainingType',
        align: 'center',
        // render: value => <SelectOrSpan list={TrainingType} value={`${value}`} type="span" />,
        render: value => getLabels(TrainingType, value),
      },
      {
        title: '培训形式',
        dataIndex: 'trainingWay',
        // render: value => <SelectOrSpan list={FORMS} value={`${value}`} type="span" />,
        render: value => getLabels(FORMS, value),
        align: 'center',
      },
      {
        title: '培训分级',
        dataIndex: 'trainingLevel',
        render: value => <SelectOrSpan list={LEVELS} value={`${value}`} type="span" />,
        align: 'center',
      },
      {
        title: '计划状态',
        dataIndex: 'planStatus',
        render: value => <SelectOrSpan list={STATUSES} value={`${value}`} type="span" />,
        align: 'center',
      },
      {
        title: '培训学时（h）',
        dataIndex: 'trainingDuration',
        align: 'center',
      },
      {
        title: '开始时间',
        dataIndex: 'trainingStartTime',
        render: time => time && moment(time).format(DEFAULT_FORMAT),
        align: 'center',
      },
      {
        title: '结束时间',
        dataIndex: 'trainingEndTime',
        render: time => time && moment(time).format(DEFAULT_FORMAT),
        align: 'center',
      },
      {
        title: '计划扫描件',
        dataIndex: 'planFileList',
        render: fileList => (
          <Fragment>
            {fileList &&
              fileList.map(({ webUrl, fileName }, index) => (
                <div key={index}>
                  <a
                    className={styles.clickable}
                    href={webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {fileName}
                  </a>
                </div>
              ))}
          </Fragment>
        ),
        align: 'center',
      },
      {
        title: '培训结果',
        dataIndex: 'resultFileList',
        render: (result, { planStatus }) => (
          <Fragment>
            {+planStatus === 1 &&
              result &&
              result.map(({ webUrl, fileName }, index) => (
                <div key={index}>
                  <a
                    className={styles.clickable}
                    href={webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {fileName}
                  </a>
                </div>
              ))}
          </Fragment>
        ),
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: list && list.length > 0 ? 'right' : false,
        render: (_, data) => {
          const { id, planStatus: status } = data;
          return (
            <Fragment>
              {+status === 0 && (
                <span
                  className={classNames(styles.operation, !hasEditAuthority && styles.disabled)}
                  onClick={hasEditAuthority ? () => this.handleExecuteClick(data) : undefined}
                >
                  执行
                </span>
              )}
              {
                <span
                  className={classNames(styles.operation, !hasDetailAuthority && styles.disabled)}
                  onClick={hasDetailAuthority ? this.handleViewClick : undefined}
                  data-id={id}
                >
                  查看
                </span>
              }
              {+status === 0 && (
                <span
                  className={classNames(styles.operation, !hasEditAuthority && styles.disabled)}
                  onClick={hasEditAuthority ? this.handleEditClick : undefined}
                  data-id={id}
                >
                  编辑
                </span>
              )}
              {+status === 0 &&
                (hasDeleteAuthority ? (
                  <Popconfirm title="你确定要删除吗?" onConfirm={() => this.handleDeleteClick(id)}>
                    <span className={styles.operation}>删除</span>
                  </Popconfirm>
                ) : (
                  <span className={classNames(styles.operation, styles.disabled)}>删除</span>
                ))}
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
                // pageSizeOptions: ['5', '10', '15', '20'],
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
  };

  renderModal() {
    const { visible, data } = this.state;
    const { trainingPlanName } = data || {};
    const fields = [
      {
        id: 'trainingPlanName',
        label: '培训计划名称',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{trainingPlanName}</span>,
      },
      {
        id: 'resultFileList',
        label: '关联培训结果',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <CustomUpload folder="trainingProgram" />,
        options: {
          initialValue: [],
          rules: [
            {
              required: true,
              message: '请上传培训结果',
            },
          ],
        },
      },
    ];

    return (
      <Modal
        title="关联培训结果"
        width={800}
        visible={visible}
        onCancel={this.handleModalCancel}
        onOk={this.handleModalConfirm}
        zIndex={1009}
      >
        <CustomForm
          fields={fields}
          searchable={false}
          resetable={false}
          ref={this.setForm2Reference}
        />
      </Modal>
    );
  }

  render() {
    const {
      trainingProgram: { list: { pagination: { total = 0 } = {} } = {} } = {},
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const isNotCompany = +unitType !== 4;

    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        content={
          <Fragment>
            {/* {isNotCompany && <span className={styles.companyNumber}>{`单位数量：${0}`}</span>} */}
            <span>{`计划总数：${total}`}</span>
          </Fragment>
        }
      >
        {this.renderForm()}
        {this.renderTable()}
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
