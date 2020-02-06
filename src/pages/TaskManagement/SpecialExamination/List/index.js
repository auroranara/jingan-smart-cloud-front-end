import React, { Component } from 'react';
import { Card, Button, Input, message, Popconfirm } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import InfiniteList from '@/jingan-components/InfiniteList';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import classNames from 'classnames';
import styles from './index.less';

export const TITLE = '专项检查';
export const LIST_PATH = '/task-management/special-examination/list';
export const ADD_PATH = '/task-management/special-examination/add';
export const EDIT_PATH = '/task-management/special-examination/edit';
export const DETAIL_PATH = '/task-management/special-examination/detail';
export const ADD_CODE = 'taskManagement.specialExamination.add';
export const EDIT_CODE = 'taskManagement.specialExamination.edit';
export const DETAIL_CODE = 'taskManagement.specialExamination.detail';
export const DELETE_CODE = 'taskManagement.specialExamination.delete';
export const EmptyData = () => <span className={styles.emptyData}>暂无数据</span>;
export const STATUSES = [
  {
    key: '0',
    value: '未开始',
  },
  {
    key: '1',
    value: '进行中',
  },
  {
    key: '2',
    value: '已过期',
  },
];
const DEFAULT_FORMAT = 'YYYY-MM-DD';
const GET_LIST = 'specialExamination/getList';
const REMOVE = 'specialExamination/remove';
const BREADCRUMB_LIST = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '任务管理',
    name: '任务管理',
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const FIELDS = [
  {
    id: 'name',
    label: '任务标题',
    transform: value => value.trim(),
    render: ({ handleSearch }) => (
      <Input placeholder="请输入任务标题" onPressEnter={handleSearch} maxLength={50} />
    ),
  },
  {
    id: 'status',
    label: '任务状态',
    render: () => <SelectOrSpan placeholder="请选择任务状态" list={STATUSES} allowClear />,
  },
];
const PAGE_SIZE = 18;

@connect(
  ({ specialExamination: { list }, user, loading }) => ({
    list,
    user,
    loading: loading.effects[GET_LIST],
  }),
  dispatch => ({
    getList(payload, callback) {
      dispatch({
        type: GET_LIST,
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
export default class SpecialExamination extends Component {
  state = {
    reloading: false,
  };

  prevValues = null;

  getList = (pageNum = 1, callback) => {
    const {
      prevValues,
      props: { getList },
    } = this;
    getList(
      {
        ...prevValues,
        pageNum,
        pageSize: PAGE_SIZE,
      },
      callback
    );
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
  };

  setFormReference = form => {
    this.form = form;
  };

  // 查看按钮点击事件
  handleDetailButtonClick = ({
    currentTarget: {
      dataset: { id },
    },
  }) => {
    router.push(`${DETAIL_CODE}/${id}`);
  };

  // 新增按钮点击事件
  handleAddButtonClick = () => {
    router.push(ADD_PATH);
  };

  // 编辑按钮点击事件
  handleEditButtonClick = ({
    currentTarget: {
      dataset: { id },
    },
  }) => {
    router.push(`${EDIT_CODE}/${id}`);
  };

  // 删除按钮点击事件
  handleDeleteButtonClick = id => {
    const { remove } = this.props;
    remove({ id }, isSuccess => {
      if (isSuccess) {
        message.success('删除成功');
        const {
          list: {
            pagination: { pageNum },
          },
        } = this.props;
        this.getList(pageNum);
      } else {
        message.error('删除失败，请稍后重试！');
      }
    });
  };

  // 查询
  handleSearch = values => {
    const { getList } = this.props;
    this.prevValues = values;
    this.setState({
      reloading: true,
    });
    getList(
      {
        ...values,
        pageNum: 1,
        pageSize: PAGE_SIZE,
      },
      () => {
        this.setState({
          reloading: false,
        });
      }
    );
  };

  // 重置
  handleReset = values => {
    this.handleSearch(values);
  };

  renderForm() {
    const {
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);

    return (
      <Card className={styles.card} bordered={false}>
        <CustomForm
          fields={FIELDS}
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

  renderList() {
    const {
      user: {
        currentUser: { permissionCodes },
      },
      list,
      loading,
    } = this.props;
    const { reloading } = this.state;
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDeleteAuthority = permissionCodes.includes(DELETE_CODE);

    return (
      <InfiniteList
        className={styles.list}
        list={list}
        getList={this.getList}
        loading={loading}
        reloading={reloading}
        renderItem={({ id, name, startDate, endDate, content, completeNumber, total, status }) => (
          <Card
            className={styles.item}
            title={name}
            hoverable
            actions={[
              <span
                className={classNames(styles.operation, !hasDetailAuthority && styles.disabled)}
                data-id={id}
                onClick={hasDetailAuthority ? this.handleDetailButtonClick : undefined}
              >
                查看
              </span>,
              <span
                className={classNames(styles.operation, !hasEditAuthority && styles.disabled)}
                data-id={id}
                onClick={hasEditAuthority ? this.handleEditButtonClick : undefined}
              >
                编辑
              </span>,
              hasDeleteAuthority ? (
                <Popconfirm
                  title="您确定要删除吗？"
                  onConfirm={() => this.handleDeleteButtonClick(id)}
                >
                  <span className={styles.operation}>删除</span>
                </Popconfirm>
              ) : (
                <span className={classNames(styles.operation, styles.disabled)}>删除</span>
              ),
            ]}
          >
            <div>
              任务时间：
              {startDate || endDate ? (
                `${startDate ? moment(startDate).format(DEFAULT_FORMAT) : '?'} 至 ${
                  endDate ? moment(endDate).format(DEFAULT_FORMAT) : '?'
                }`
              ) : (
                <EmptyData />
              )}
            </div>
            <div>
              完成进度：
              {status > 0 ? `${completeNumber || 0}/${total || 0}` : '——'}
            </div>
            <div>
              任务内容：
              {content || <EmptyData />}
            </div>
            <div className={styles[`mark${status}`]}>{(STATUSES[status] || {}).value}</div>
          </Card>
        )}
      />
    );
  }

  render() {
    const { list: { pagination: { total } = {} } = {} } = this.props;

    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        content={
          <span>
            专项检查总数：
            {total}
          </span>
        }
      >
        {this.renderForm()}
        {this.renderList()}
      </PageHeaderLayout>
    );
  }
}
