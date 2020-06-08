import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import { Button, Card, Table, message, Popconfirm, Divider } from 'antd';
// import Link from 'umi/link';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
import {
  BREADCRUMBLIST,
  SEARCH_FIELDS as FIELDS,
  TABLE_COLUMNS as COLUMNS,
  EditModal,
} from './utils';

// 权限
const {
  targetResponsibility: {
    indexManagement: { edit: editAuth, delete: deleteAuth, add: addAuth },
  },
} = codes;

@connect(({ targetResponsibility, user, loading }) => ({
  targetResponsibility,
  user,
  loading: loading.models.targetResponsibility,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      modalTitle: '', // 弹窗标题
      modalStatus: '', // 弹窗状态
      modalVisible: false, // 弹窗是否可见
      detail: {}, // 详情
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    this.fetchList();
  }

  // 获取列表
  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchIndexManagementList',
      payload: {
        ...params,
        pageSize,
        pageNum,
      },
    });
  };

  handleSearch = values => {
    this.setState({ formData: { ...values } });
    this.fetchList(1, this.pageSize, { ...values });
  };

  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  handlePageChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  // 打开新建弹窗 status: add/edit; text: 列表数据
  handleShowModal = (status, text = {}) => {
    this.setState({
      modalVisible: true,
      modalStatus: status,
      modalTitle: (status === 'add' && '新建指标') || (status === 'edit' && '编辑指标'),
      detail: { ...text },
    });
  };

  // 新建指标
  handleModalAdd = formData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchIndexManagementAdd',
      payload: { ...formData },
      callback: response => {
        if (response && response.code === 200) {
          this.handleModalClose();
          this.fetchList();
          message.success('新建成功！');
        } else message.error(response.msg);
      },
    });
  };

  // 编辑指标
  handleModalEdit = formData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchIndexManagementEdit',
      payload: { ...formData },
      callback: response => {
        if (response && response.code === 200) {
          this.handleModalClose();
          this.fetchList();
          message.success('编辑成功！');
        } else message.error(response.msg);
      },
    });
  };

  // 删除
  handleDeleteClick = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchIndexManagementDel',
      payload: { id: id },
      success: () => {
        this.fetchList();
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };

  // 关闭弹窗
  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const {
      loading = false,
      targetResponsibility: {
        indexData: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
      user: {
        currentUser: { unitType, companyId, permissionCodes },
      },
    } = this.props;

    // 权限
    const editCode = hasAuthority(editAuth, permissionCodes);
    const deleteCode = hasAuthority(deleteAuth, permissionCodes);
    const addCode = hasAuthority(addAuth, permissionCodes);

    const extraColumns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        width: 150,
        render: (val, text) => {
          return (
            <Fragment>
              {editCode ? (
                <a onClick={() => this.handleShowModal('edit', text)}>编辑</a>
              ) : (
                <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>编辑</span>
              )}
              <Divider type="vertical" />
              {deleteCode ? (
                <Popconfirm
                  title="确定删除当前该内容吗？"
                  onConfirm={() => this.handleDeleteClick(text.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <span className={styles1.delete}>删除</span>
                </Popconfirm>
              ) : (
                <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>删除</span>
              )}
            </Fragment>
          );
        },
      },
    ];
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });

    const toolBarAction = (
      <Button
        type="primary"
        style={{ marginTop: '8px' }}
        disabled={!addCode}
        onClick={() => this.handleShowModal('add')}
      >
        新增
      </Button>
    );

    const modalData = {
      ...this.state,
      unitType,
      companyId,
      handleModalClose: this.handleModalClose,
      handleModalAdd: this.handleModalAdd,
      handleModalEdit: this.handleModalEdit,
      list,
    };

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles1.total}>
            列表数量：
            {total}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={unitType === 4 ? FIELDS.slice(1, FIELDS.length) : FIELDS}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonSpan={{ xl: 8, sm: 12, xs: 24 }}
          />
        </Card>
        <div className={styles1.container}>
          {list.length > 0 ? (
            <Table
              bordered
              rowKey="id"
              loading={loading}
              columns={
                unitType === 4
                  ? [...COLUMNS.slice(1, COLUMNS.length), ...extraColumns]
                  : [...COLUMNS, ...extraColumns]
              }
              dataSource={list}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                // pageSizeOptions: ['5', '10', '15', '20'],
                onChange: this.handlePageChange,
                onShowSizeChange: (num, size) => {
                  this.handlePageChange(1, size);
                },
              }}
            />
          ) : (
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <span>暂无数据</span>
            </Card>
          )}
        </div>
        <EditModal {...modalData} />
      </PageHeaderLayout>
    );
  }
}
