import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Table } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { BREADCRUMBLIST, LIST, PAGE_SIZE, ROUTER, SEARCH_FIELDS as FIELDS, TABLE_COLUMNS as COLUMNS } from './utils';

@connect(({ cardsInfo, loading }) => ({
  cardsInfo,
  loading: loading.models.cardsInfo,
}))
export default class TableList extends PureComponent {
  state = { current: 1 };
  values = {};

  componentDidMount() {
    this.getList();
  }

  getList = (pageNum=1) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'cardsInfo/fetchCommitList',
      payload: { pageNum, pageSize: PAGE_SIZE, ...this.values },
    });
  };

  handleSearch = values => {
    this.values = values;
    this.getList();
  };

  handleReset = () => {
    this.values = {};
    this.getList();
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  onTableChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    this.setState({ current });
    this.getList(current);
  };

  render() {
    const {
      loading,
      cardsInfo: { commitList, commitTotal },
    } = this.props;
    const { current } = this.state;

    const list = commitList;
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
            共计：1
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
            rowKey="id"
            loading={loading}
            columns={COLUMNS}
            dataSource={list}
            onChange={this.onTableChange}
            scroll={{ x: 1500 }} // 项目不多时注掉
            pagination={{ pageSize: PAGE_SIZE, total: commitTotal, current }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
