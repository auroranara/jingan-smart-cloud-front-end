import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Empty, Table } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { PAGE_SIZE, COLUMNS, getSearchFields } from '../ChangeWarning/utils';
import { BREADCRUMBLIST } from './utils';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';

@connect(({ user, changeWarning, loading }) => ({
  user,
  changeWarning,
  loading: loading.models.changeWarning,
}))
export default class TableList extends PureComponent {
  state = { current: 1 };
  values = {};
  empty = true;

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
      [vals.startDate, vals.endDate] = range.map(m => m.format('YYYY-MM-DD HH:mm:ss'));

    dispatch({
      type: 'changeWarning/fetchWarningList',
      payload: { pageNum, pageSize: PAGE_SIZE, ...vals },
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

  getRangeFromEvent = range => {
    const empty = !(range && range.length);
    const result = this.empty && !empty ? [range[0].startOf('day'), range[1].endOf('day')] : range;
    this.empty = empty;
    return result;
  };

  render() {
    const {
      loading,
      user: { currentUser: { unitType } },
      changeWarning: { list, total },
    } = this.props;
    const { current } = this.state;
    const isComUser = isCompanyUser(unitType);
    const fields = getSearchFields(this.getRangeFromEvent, isComUser);
    const columns = isComUser ? COLUMNS.filter(({ dataIndex }) => dataIndex !== 'companyName') : COLUMNS;

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
            fields={fields}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 8, sm: 12, xs: 24 }}
          />
        </Card>
        <div className={styles1.container}>
          {list.length ? (
            <Table
              rowKey="id"
              loading={loading}
              columns={columns}
              dataSource={list}
              onChange={this.onTableChange}
              scroll={{ x: 1400 }} // 项目不多时注掉
              pagination={{ pageSize: PAGE_SIZE, total: total, current }}
            />
          ) : <Empty />}
        </div>
      </PageHeaderLayout>
    );
  }
}
