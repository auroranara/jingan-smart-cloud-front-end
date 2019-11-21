import React, { PureComponent } from 'react';
import { connect } from 'dva';
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

@connect(({ twoInformManagement, user, loading }) => ({
  twoInformManagement,
  user,
  loading: loading.models.twoInformManagement,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
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
    // dispatch({
    //   type: 'twoInformManagement/fetchSafetyList',
    //   payload: {
    //     ...params,
    //     pageSize,
    //     pageNum,
    //   },
    // });
  };

  handleSearch = values => {
    this.setState({ formData: { ...values } });
    this.fetchList(1, this.pageSize, { ...values });
  };

  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  onTableChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
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
            scroll={{ x: 'max-content' }}
            pagination={{ pageSize: PAGE_SIZE, total: PAGE_SIZE, current: 1 }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
