import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Table } from 'antd';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { getPageSize, setPageSize } from '@/utils/utils';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { BREADCRUMBLIST, LIST, PAGE_SIZE, ROUTER, SEARCH_FIELDS as FIELDS, TABLE_COLUMNS as COLUMNS } from './utils';

const GET_LIST = 'accidentReport/getList';

@connect(({
  user,
  accidentReport,
  loading,
}) => ({
  user,
  accidentReport,
  loading: loading.effetcs[GET_LIST],
}), (dispatch) => ({
  getList(payload, callback) {
    dispatch({
      type: GET_LIST,
      payload,
      callback,
    });
  },
}))
export default class TableList extends PureComponent {
  componentDidMount() {
    this.getList();
  }

  getList = (payload) => {
    const {
      accidentReport: {
        list: {
          pagination: {
            pageSize: prevPageSize=getPageSize(),
          }={},
        }={},
      },
      getList,
    } = this.props;
    const { current=1, pageSize=getPageSize() } = payload || {};
    const values = this.form && this.form.getFieldsValue();
    getList({
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
      ...values,
      ...payload,
    });
    setPageSize(pageSize);
  }

  reload = () => {
    const {
      accidentReport: {
        list: {
          pagination: {
            pageNum=1,
          }={},
        }={},
      },
    } = this.props;
    this.getList({
      current: pageNum,
    });
  }

  handleSearch = values => {
    this.getList(values);
  };

  handleReset = (values) => {
    this.getList(values);
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  render() {
    const { loading=false } = this.props;

    const list = LIST;
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
            pagination={{ pageSize: PAGE_SIZE, total: PAGE_SIZE, current: 1 }}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
