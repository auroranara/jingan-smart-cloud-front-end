import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Table } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import {
  BREADCRUMBLIST,
  LIST,
  PAGE_SIZE,
  ROUTER,
  SEARCH_FIELDS as FIELDS,
  TABLE_COLUMNS as COLUMNS,
} from './utils';

export default class TableList extends PureComponent {
  handleSearch = values => {
    return;
  };

  handleReset = () => {
    return;
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  onTableChange = (pagination, filters, sorter) => {
    return;
  };

  render() {
    const { loading = false } = this.props;

    const list = LIST;
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });
    const toolBarAction = (
      <Button type="primary" style={{ marginTop: '8px' }}>
        同步数据
      </Button>
    );

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles1.total}>
            共计：
            {PAGE_SIZE}
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
            bordered
            rowKey="id"
            loading={loading}
            columns={COLUMNS}
            dataSource={list}
            onChange={this.onTableChange}
            scroll={{ x: 1500 }} // 项目不多时注掉
            pagination={{ pageSize: PAGE_SIZE, total: PAGE_SIZE, current: 1 }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
