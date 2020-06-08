import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Table, message } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { BREADCRUMBLIST, PAGE_SIZE, ROUTER, SEARCH_FIELDS as FIELDS, getColumns } from './utils';
import { genOperateCallback } from '@/pages/PersonnelManagement/CheckPoint/utils';
import ImagePreview from '@/jingan-components/ImagePreview';

@connect(({ loading, user, riskFlags }) => ({
  loading: loading.models.riskFlags,
  user,
  riskFlags,
}))
export default class TableList extends PureComponent {
  state = {
    currentPage: 1,
    formVals: null,
    imgs: [],
    pageSize: PAGE_SIZE,
  };

  componentDidMount() {
    this.fetchTableList(1, PAGE_SIZE);
  }

  handleSearch = values => {
    const { pageSize } = this.state;
    this.setState({ formVals: values });
    this.fetchTableList(1, values, (code, msg) => this.setPage(code, 1, pageSize, msg));
  };

  handleReset = () => {
    const { pageSize } = this.state;
    this.setState({ formVals: {} });
    this.fetchTableList(1, null, (code, msg) => this.setPage(code, 1, pageSize, msg));
  };

  fetchTableList = (pageNum, pageSize, values, callback) => {
    const { dispatch } = this.props;
    let payload = { pageSize, pageNum };
    if (values) payload = { ...payload, ...values };
    dispatch({
      type: 'riskFlags/fetchList',
      payload,
      callback,
    });
  };

  getCurrentList = () => {
    const { currentPage, pageSize, formVals } = this.state;
    this.fetchTableList(currentPage, pageSize, formVals);
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  setPage = (code, current, pageSize, msg) => {
    if (code === 200) this.setState({ currentPage: current, pageSize });
    else if (msg) message.error(msg);
  };

  onTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    const { formVals } = this.state;
    this.fetchTableList(current, pageSize, formVals, (code, msg) => this.setPage(code, current, pageSize, msg));
  };

  genHandleDelete = id => e => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskFlags/delete',
      payload: id,
      callback: genOperateCallback('', () => this.getCurrentList()),
    });
  };

  handleClick = url => {
    url && this.setState({ imgs: [url] });
  };

  render() {
    const {
      loading,
      riskFlags: { total, list },
    } = this.props;

    const { currentPage, pageSize, imgs } = this.state;

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
            columns={getColumns(this.genHandleDelete, this.handleClick)}
            dataSource={list}
            onChange={this.onTableChange}
            pagination={{ pageSize, total, current: currentPage }}
          />
        </div>
        <ImagePreview images={imgs} />
      </PageHeaderLayout>
    );
  }
}
