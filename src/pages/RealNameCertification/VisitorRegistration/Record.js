import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Empty, Modal, Table, message } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { AuthButton } from '@/utils/customAuth';
import { hasAuthority } from '@/utils/customAuth';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { BREADCRUMBLIST, ROUTER, RECORD_FIELDS, getRecordColumns } from './utils';
import codes from '@/utils/codes';
import styles from './Record.less';

// 权限
const {
  realNameCertification: {
    visitorRegistration: { add: addCode, record: recordCode },
  },
} = codes;

@connect(({ user, realNameCertification, loading }) => ({
  user,
  realNameCertification,
  loading: loading.models.realNameCertification,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.pageNum = 1;
    this.pageSize = 10;
    this.state = {
      formData: {},
      modalTitle: '', // 弹窗标题
      modalStatus: '', // 弹窗状态
      modalVisible: false, // 弹窗是否可见
      detail: {}, // 详情
      expend: false,
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  setFormReference = toobar => {
    this.form = toobar && toobar.props && toobar.props.form;
  };

  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'realNameCertification/fetchTagCardList',
      payload: {
        ...params,
        pageSize,
        pageNum,
      },
    });
  };

  handleSearch = () => {
    const values = this.form.getFieldsValue();
    this.fetchList(1, this.pageSize, { ...values });
  };

  handleReset = () => {
    this.form.resetFields();
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

  render() {
    const {
      loading,
      user: {
        currentUser: { unitType },
      },
      realNameCertification: {
        tagCardData: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props;

    const { expand } = this.state;

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });

    const columns = getRecordColumns();

    const fields = expand ? RECORD_FIELDS : RECORD_FIELDS.slice(0, 3);

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
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
              dataSource={list}
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
