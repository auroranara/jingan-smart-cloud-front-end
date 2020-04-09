import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Empty, Modal, Table, message } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { BREADCRUMBLIST_OTHER, ROUTER, LIST_URL, RECORD_FIELDS, getRecordColumns } from './utils';
import styles from './Record.less';
// import moment from 'moment';

@connect(({ user, visitorRegistration, loading }) => ({
  user,
  visitorRegistration,
  loading: loading.models.visitorRegistration,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.pageNum = 1;
    this.pageSize = 10;
    this.state = {
      currentPage: 1,
    };
  }

  componentDidMount() {
    this.fetchList(1, 10);
  }

  hanldleBack = () => {
    router.push(`${LIST_URL}`);
  };
  setFormReference = toobar => {
    this.form = toobar && toobar.props && toobar.props.form;
  };

  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'visitorRegistration/fetchVisitorList',
      payload: {
        ...params,
        pageSize,
        pageNum,
        companyId: id,
      },
    });
  };

  handleSearch = () => {
    const { registrationDate, ...values } = this.form.getFieldsValue();
    const [start_time, end_time] = registrationDate || [];
    this.fetchList(1, this.pageSize, {
      ...values,
      startDate: start_time && `${start_time.format('YYYY-MM-DD HH:mm:ss')}`,
      endDate: end_time && `${end_time.format('YYYY-MM-DD HH:mm:ss')}`,
    });
  };

  handleReset = () => {
    this.form.resetFields();
    this.form.setFieldsValue({ registrationDate: [] });
    this.fetchList(1, this.pageSize);
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  handlePageChange = (pageNum, pageSize) => {
    const values = this.form.getFieldsValue();
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...values });
  };

  handleExpand = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  handleTableData = (list = [], indexBase) => {
    return list.map((item, index) => {
      return {
        ...item,
        index: indexBase + index + 1,
      };
    });
  };

  render() {
    const {
      loading,
      visitorRegistration: {
        registrationData: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props;

    const { expand, currentPage } = this.state;

    const indexBase = (currentPage - 1) * 10;

    const breadcrumbList = Array.from(BREADCRUMBLIST_OTHER);
    breadcrumbList.push({ title: '列表', name: '列表' });

    const columns = getRecordColumns();

    const fields = expand ? RECORD_FIELDS : RECORD_FIELDS.slice(0, 3);

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST_OTHER[BREADCRUMBLIST_OTHER.length - 1].title}
        breadcrumbList={breadcrumbList}
        action={
          <div style={{ float: 'right' }}>
            <Button type="primary" onClick={this.hanldleBack}>
              返回
            </Button>
          </div>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={fields}
            searchable={false}
            resetable={false}
            wrappedComponentRef={this.setFormReference}
          />
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: '10px' }} type="primary" onClick={this.handleSearch}>
              查询
            </Button>
            <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
              重置
            </Button>
            <span className={styles.iconContainer} onClick={() => this.handleExpand()}>
              <a>{expand ? '收起' : '展开'}</a>
              <LegacyIcon className={expand ? styles.expandIcon : styles.icon} type="down" />
            </span>
          </div>
        </Card>
        <Card title="记录列表">
          {list.length ? (
            <Table
              rowKey="id"
              bordered
              loading={loading}
              columns={columns}
              dataSource={this.handleTableData(list, indexBase)}
              onChange={this.onTableChange}
              scroll={{ x: 'max-content' }}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: t => `共 ${t} 条记录`,
                pageSizeOptions: ['5', '10', '15', '20'],
                onChange: this.handlePageChange,
                onShowSizeChange: (num, size) => {
                  this.handlePageChange(1, size);
                },
              }}
            />
          ) : (
            <Empty />
          )}
        </Card>
      </PageHeaderLayout>
    );
  }
}
