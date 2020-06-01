import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import '@ant-design/compatible/assets/index.css';
import { Card, Table, message, Input, Spin, Pagination } from 'antd';
import InlineForm from '@/pages/BaseInfo/Company/InlineForm';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

/* 去除两边空格 */
const transform = value => value.trim();

@connect(({ company, user, loading }) => ({
  company,
  user,
  loading: loading.effects['company/fetchModelList'],
}))
export default class CompanyList extends PureComponent {
  state = {
    formData: {},
  };

  pageNum = 1;
  pageSize = 10;

  componentDidMount() {
    this.fetchList();
  }

  fetchList = (pageNum = 1, pageSize = 10, filters = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'company/fetchModelList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
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

  renderForm = () => {
    const fields = [
      {
        id: 'name',
        render() {
          return <Input placeholder="请输入单位名称" />;
        },
        transform,
      },
    ];

    return (
      <Card>
        <InlineForm
          fields={fields}
          gutter={{ lg: 48, md: 24 }}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
        />
      </Card>
    );
  };

  // 表格改变触发，包含分页变动
  handleTableChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  handleClickSubmit = () => {
    const {
      dispatch,
      app: {
        data: { pagination },
      },
    } = this.props;
    const { selectedRowKeys } = this.state;
    dispatch({
      type: 'app/update',
      payload: {
        selectedRowKeys,
      },
      pagination,
      callback: (code, msg) => {
        if (code === 200) {
          message.success('修改成功');
        } else {
          message.error(`修改失败`);
        }
      },
    });
  };

  goEdit = id => {
    const { handleParentChange } = this.props;
    handleParentChange({ companyId: id });
  };

  render() {
    const {
      company: {
        companyModal: {
          list,
          pagination: { pageNum, pageSize, total },
        },
      },
      loading,
    } = this.props;
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '社会信用代码',
        dataIndex: 'code',
        key: 'code',
        width: 300,
      },
      {
        title: '操作',
        dataIndex: 'opration',
        key: 'opration',
        width: 200,
        render: (_, record) => <a onClick={() => this.goEdit(record.id)}>身份鉴别</a>,
      },
    ];

    return (
      <PageHeaderLayout title="身份鉴别">
        {this.renderForm()}
        {list && list.length ? (
          <Card style={{ marginTop: '24px' }}>
            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={list}
              pagination={false}
              // scroll={{ x: 'max-content' }}
            />
            <Pagination
              style={{ marginTop: '20px', float: 'right' }}
              showQuickJumper
              showSizeChanger
              pageSize={pageSize}
              current={pageNum}
              total={total}
              onChange={this.handleTableChange}
              onShowSizeChange={this.handleTableChange}
            />
          </Card>
        ) : (
          <Spin spinning={loading}>
            <Card style={{ marginTop: '20px', textAlign: 'center' }}>
              <span>暂无数据</span>
            </Card>
          </Spin>
        )}
      </PageHeaderLayout>
    );
  }
}
