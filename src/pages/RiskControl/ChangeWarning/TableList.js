import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Card, Table, message } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './TableList.less';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { BREADCRUMBLIST, PAGE_SIZE, SEARCH_FIELDS as FIELDS, COLUMNS } from './utils';

@connect(({ changeWarning, loading }) => ({
  changeWarning,
  loading: loading.models.changeWarning,
}))
export default class TableList extends PureComponent {
  state = { current: 1 };
  values = {};

  componentDidMount() {
    this.getList();
  }

  getList = pageNum => {
    const { dispatch } = this.props;
    if (!pageNum) { // pageNum不存在，则为初始化
      pageNum = 1;
      this.setState({ current: 1 });
    }

    const { companyId, range } = this.values;
    const vals = { ...this.values };
    delete vals.range;
    if (companyId)
      vals.companyId = companyId.key;
    if (range)
      [vals.startDate, vals.endDate] = range.map(t => +t);

    dispatch({
      type: 'changeWarning/fetchWarningList',
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

  onTableChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    this.setState({ current });
    this.getList(current);
  };

  render() {
    const {
      loading,
      changeWarning: { list, total },
    } = this.props;
    const { current } = this.state;

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length -1].title}
        breadcrumbList={BREADCRUMBLIST}
        content={
          <p className={styles1.total}>
            共计：{total}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={FIELDS}
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
            scroll={{ x: 1400 }} // 项目不多时注掉
            pagination={{ pageSize: PAGE_SIZE, total: total, current }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
