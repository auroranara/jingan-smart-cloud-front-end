import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Table, message } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { BREADCRUMBLIST, PAGE_SIZE, ROUTER, SEARCH_FIELDS as FIELDS, getColumns } from './utils';
import { genOperateCallback } from '@/pages/PersonnelManagement/CheckPoint/utils';

@connect(({ loading, user, riskFlags }) => ({
  loading: loading.models.riskFlags,
  user,
  riskFlags,
}))
export default class TableList extends PureComponent {
  state = {
    currentPage: 1,
    formVals: null,
  }

  componentDidMount() {
    this.fetchTableList(1);
  }

  handleSearch = values => {
    this.setState({ formVals: values });
    this.fetchTableList(1, values, (code, msg) => this.setPage(code, 1, msg));
  };

  handleReset = () => {
    this.setState({ formVals: {} });
    this.fetchTableList(1, null, (code, msg) => this.setPage(code, 1, msg));
  };

  fetchTableList = (pageNum, values, callback) => {
    const { dispatch } = this.props;
    let payload = { pageSize: PAGE_SIZE, pageNum };
    if (values) payload = { ...payload, ...values };
    dispatch({
      type: 'riskFlags/fetchList',
      payload,
      callback,
    });
  };

  getCurrentList = () => {
    const { currentPage, formVals } = this.state;
    this.fetchTableList(currentPage, formVals);
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  setPage = (code, current, msg) => {
    if (code === 200) this.setState({ currentPage: current });
    else if (msg) message.error(msg);
  };

  onTableChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    const { formVals } = this.state;
    this.fetchTableList(current, formVals, (code, msg) => this.setPage(code, current, msg));
  };

  genHandleDelete = id => e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskFlags/delete',
      payload: id,
      callback: genOperateCallback('', () => this.getCurrentList()),
    });
  };

  render() {
    const {
      loading,
      riskFlags: { total, list },
    } = this.props;

    const { currentPage } = this.state;

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });
    const toolBarAction = (
      <Button type="primary" onClick={this.handleAdd} style={{ marginTop: '8px' }}>
        新增
      </Button>
    );

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length -1].title}
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles1.total}>
            共计：{total}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={FIELDS}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 8, sm: 12, xs: 24 }}
          />
        </Card>
        <div className={styles1.container}>
          <Table
            rowKey="signId"
            loading={loading}
            columns={getColumns(this.genHandleDelete)}
            dataSource={list}
            onChange={this.onTableChange}
            pagination={{ pageSize: PAGE_SIZE, total: PAGE_SIZE, current: currentPage }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
