import React, { Component, Fragment } from 'react';
import { Input, Select, Spin, Card, Button, Table, Modal, Popconfirm, message } from 'antd'
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import CustomUpload from '@/jingan-components/CustomUpload';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;
const title = '安全生产培训计划';
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '教育培训',
    name: '教育培训',
  },
  {
    title,
    name: title,
  },
];
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 10;
const DETAIL_CODE = 'training.trainingProgram.detail';
const ADD_CODE = 'training.trainingProgram.add';
const EDIT_CODE = 'training.trainingProgram.edit';
const DELETE_CODE = 'training.trainingProgram.delete';
const STATUSES = [
  {
    key: '0',
    value: '未执行',
  },
  {
    key: '1',
    value: '已执行',
  },
];
const LEVELS = [
  {
    key: '1',
    value: '厂级',
  },
  {
    key: '2',
    value: '车间级',
  },
  {
    key: '3',
    value: '班组级',
  },
];
const SPAN = {
  sm: 24,
  xs: 24,
};
const LABEL_COL = { span: 6 };

@connect(({
  trainingProgram,
  user,
  loading,
}) => ({
  trainingProgram,
  user,
  loaidng: loading.effects['trainingProgram/fetchList'],
  executing: loading.effects['trainingProgram/execute'],
}), (dispatch) => ({
  getList(payload, callback) {
    dispatch({
      type: 'trainingProgram/fetchList',
      payload: {
        pageNum: DEFAULT_PAGE_NUM,
        pageSize: DEFAULT_PAGE_SIZE,
        ...payload,
      },
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
}))
export default class TrainingProgramList extends Component {
  state = {
    visible: false,
    data: undefined,
  }

  componentDidMount() {
    const { getList } = this.props;
    // getList();
  }

  setFormReference = form => {
    this.form = form;
  }

  setForm2Reference = form2 => {
    this.form2 = form2;
  }

  // 查询按钮点击事件
  handleSearch = (values) => {
    const { getList } = this.props;
    getList(values);
  }

  // 重置按钮点击事件
  handleReset = (values) => {
    this.handleSearch(values);
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

  // 新增按钮点击事件
  handleAddClick = () => {
    router.push('/training/training-program/add');
  }

  // 编辑按钮点击事件
  handleEditClick = (e) => {
    const { id } = e.currentTarget.dataset;
    router.push(`/training/training-program/edit/${id}`);
  }

  // 查看按钮点击事件
  handleViewClick = (e) => {
    const { id } = e.currentTarget.dataset;
    router.push(`/training/training-program/detail/${id}`);
  }

  // 删除按钮点击事件
  handleDeleteClick = (id) => {
    const { remove } = this.props;
    remove({ id }, (isSuccess, msg) => {
      if (isSuccess) {
        const { trainingProgram: { list: { pagination: { pageNum, pageSize } } } } = this.props;
        message.success('删除成功');
        this.handleListChange(pageNum, pageSize);
      } else {
        message.error(msg || '删除失败，请稍后重试！');
      }
    });
  }

  // 执行按钮点击事件
  handleExecuteClick = (data) => {
    this.setState({
      visible: true,
      data,
    });
  }

  // 模态框取消事件
  handleModalCancel = () => {
    this.setState({
      visible: false,
    });
  }

  // 模态框确定事件
  handleModalConfirm = () => {
    const { execute } = this.props;
    const { data: { id } } = this.state;
    const { validateFieldsAndScroll } = this.form2;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        execute({
          id,
          ...values,
        }, (isSuccess) => {
          if (isSuccess) {
            message.success(`关联成功！`);
          } else {
            message.error(`关联失败，请稍后重试！`);
          }
          this.setState({
            visible: false,
          });
        });
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
        label: '单位名称',
        transform: value => value.trim(),
        render: _this => <Input placeholder="请输入单位名称" onPressEnter={_this.handleSearch} maxLength={50} />,
      }] : []),
      {
        id: 'name',
        label: '培训计划名称',
        transform: value => value.trim(),
        render: _this => <Input placeholder="请输入培训计划名称" onPressEnter={_this.handleSearch} maxLength={50} />,
      },
      {
        id: 'type',
        label: '培训类型',
        render: _this => <Input placeholder="请输入培训类型" onPressEnter={_this.handleSearch} maxLength={50} />,
      },
      {
        id: 'level',
        label: '培训分级',
        render: () => (
          <Select placeholder="请选择培训分级" allowClear>
            {LEVELS.map(({ key, value }) => <Option key={key}>{value}</Option>)}
          </Select>
        ),
      },
      {
        id: 'status',
        label: '计划状态',
        render: () => (
          <Select placeholder="请选择计划状态" allowClear>
            {STATUSES.map(({ key, value }) => <Option key={key}>{value}</Option>)}
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
          action={<Button type="primary" onClick={this.handleAddClick} disabled={!hasAddAuthority}>新增</Button>}
          ref={this.setFormReference}
        />
      </Card>
    );
  }

  renderTable = () => {
    const {
      trainingProgram: {
        list: {
          // list=[],
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
      loading,
    } = this.props;
    const isNotCompany = unitType !== 4;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    const hasDeleteAuthority = permissionCodes.includes(DELETE_CODE);
    const list = [{
      id: 1,
      name: '213',
      status: '0',
    }];

    const COLUMNS = (isNotCompany ? [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
      },
    ] : []).concat([
      {
        title: '培训计划名称',
        dataIndex: 'name',
        align: 'center',
      },
      {
        title: '培训类型',
        dataIndex: 'type',
        align: 'center',
      },
      {
        title: '培训形式',
        dataIndex: 'form',
        align: 'center',
      },
      {
        title: '培训分级',
        dataIndex: 'level',
        align: 'center',
      },
      {
        title: '计划状态',
        dataIndex: 'status',
        render: (status) => {
          status = STATUSES.filter(({ key }) => key === status)[0];
          return status && status.value;
        },
        align: 'center',
      },
      {
        title: '培训学时（h）',
        dataIndex: 'period',
        align: 'center',
      },
      {
        title: '开始时间',
        dataIndex: 'startDate',
        render: (time) => time && moment(time).format(DEFAULT_FORMAT),
        align: 'center',
      },
      {
        title: '结束时间',
        dataIndex: 'endDate',
        render: (time) => time && moment(time).format(DEFAULT_FORMAT),
        align: 'center',
      },
      {
        title: '计划扫描件',
        dataIndex: 'fileList',
        render: (fileList) => (
          <Fragment>
            {fileList && fileList.map(({ webUrl, fileName }, index) => (
              <div key={index}>
                <a className={styles.clickable} href={webUrl} target="_blank" rel="noopener noreferrer">{fileName}</a>
              </div>
            ))}
          </Fragment>
        ),
        align: 'center',
      },
      {
        title: '培训结果',
        dataIndex: 'result',
        render: (result) => (
          <Fragment>
            {result && result.map(({ webUrl, fileName }, index) => (
              <div key={index}>
                <a className={styles.clickable} href={webUrl} target="_blank" rel="noopener noreferrer">{fileName}</a>
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
          const { id, status } = data;
          return (
            <Fragment>
              {+status === 0 && <Button type='link' className={styles.operation} onClick={() => this.handleExecuteClick(data)} disabled={!hasEditAuthority}>执行</Button>}
              {<Button type='link' className={styles.operation} onClick={this.handleViewClick} data-id={id} disabled={!hasDetailAuthority}>查看</Button>}
              {+status === 0 && <Button type='link' className={styles.operation} onClick={this.handleEditClick} data-id={id} disabled={!hasEditAuthority}>编辑</Button>}
              {+status === 0 && (hasDeleteAuthority ? (
                <Popconfirm title="你确定要删除吗?" onConfirm={() => this.handleDeleteClick(id)}>
                  <Button type='link' className={styles.operation}>删除</Button>
                </Popconfirm>
              ) : (
                <Button type='link' className={styles.operation} disabled>删除</Button>
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

  renderModal() {
    const { visible, data } = this.state;
    const { name } = data || {};
    const fields = [
      {
        id: 'name',
        label: '培训计划名称',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{name}</span>,
      },
      {
        id: 'result',
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
      trainingProgram: {
        list: {
          pagination: {
            total=0,
          }={},
        }={},
      }={},
      user: {
        currentUser: {
          unitType,
        },
      },
    } = this.props;
    const isNotCompany = +unitType !== 4;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <Fragment>
            {isNotCompany && <span className={styles.companyNumber}>{`单位数量：${0}`}</span>}
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
