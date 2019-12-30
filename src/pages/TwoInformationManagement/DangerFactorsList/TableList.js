import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Table, message, Popconfirm, Divider } from 'antd';
import Link from 'umi/link';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
// import Map from '@/pages/RiskControl/FourColorImage/Map';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
import {
  BREADCRUMBLIST,
  ROUTER,
  SEARCH_FIELDS as FIELDS,
  SEARCH_FIELDS_COMPANY as COMPANYFIELDS,
  TABLE_COLUMNS as COLUMNS,
  TABLE_COLUMNS_COMPANY as COMPANYCOLUMNS,
} from './utils';

// 权限
const {
  twoInformManagement: {
    dangerFactorsList: { view: viewAuth, delete: deleteAuth, sync: syncAuth },
  },
} = codes;

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
    dispatch({
      type: 'twoInformManagement/fetchDagerList',
      payload: {
        ...params,
        pageSize,
        pageNum,
      },
    });
  };

  handleSearch = values => {
    this.setState({ formData: { ...values } });
    this.fetchList(1, this.pageSize, { ...values });
  };

  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  handleDeleteClick = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchDangerDel',
      payload: { ids: id },
      success: () => {
        this.fetchList();
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };

  handleClickSync = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'twoInformManagement/fetchDangerSync',
      success: () => {
        dispatch({
          type: 'twoInformManagement/fetchDagerList',
          payload: {
            pageSize: 10,
            pageNum: 1,
          },
        });
        message.success('同步成功！');
      },
      error: () => {
        message.error('同步失败！');
      },
    });
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  handlePageChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  render() {
    const {
      loading = false,
      twoInformManagement: {
        dangerData: {
          list = [],
          pagination: { pageNum, pageSize, total },
        },
        msgDanger,
      },
      user: {
        currentUser: { permissionCodes, unitType },
      },
    } = this.props;

    // 权限
    const viewCode = hasAuthority(viewAuth, permissionCodes);
    const deleteCode = hasAuthority(deleteAuth, permissionCodes);
    const syncCode = hasAuthority(syncAuth, permissionCodes);

    const extraColumns = [
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        align: 'center',
        fixed: 'right',
        width: 200,
        render: (val, text) => {
          return (
            <Fragment>
              {viewCode ? (
                <Link to={`${ROUTER}/danger-factors-list/view/${text.id}`}>导入数据</Link>
              ) : (
                <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>查看</span>
              )}
              <Divider type="vertical" />
              {deleteCode ? (
                <Popconfirm
                  title="确定删除当前该内容吗？"
                  onConfirm={() => this.handleDeleteClick(text.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <span className={styles1.delete}>删除</span>
                </Popconfirm>
              ) : (
                <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>删除</span>
              )}
            </Fragment>
          );
        },
      },
    ];

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });

    const toolBarAction = (
      <Button
        type="primary"
        style={{ marginTop: '8px' }}
        disabled={!syncCode}
        onClick={this.handleClickSync}
      >
        下载模板
      </Button>
    );

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles1.total}>
            单位数量：
            {msgDanger}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={unitType === 4 ? [...FIELDS] : [...COMPANYFIELDS, ...FIELDS]}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 8, sm: 12, xs: 24 }}
          />
        </Card>
        <div className={styles1.container}>
          {list.length > 0 ? (
            <Table
              bordered
              rowKey="id"
              loading={loading}
              columns={
                unitType === 4
                  ? [...COLUMNS, ...extraColumns]
                  : [...COMPANYCOLUMNS, ...COLUMNS, ...extraColumns]
              }
              dataSource={list}
              onChange={this.onTableChange}
              scroll={{ x: 1440 }} // 项目不多时注掉
              pagination={{
                current: pageNum,
                pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: ['5', '10', '15', '20'],
                onChange: this.handlePageChange,
                onShowSizeChange: (num, size) => {
                  this.handlePageChange(1, size);
                },
              }}
            />
          ) : (
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <span>暂无数据</span>
            </Card>
          )}
        </div>
      </PageHeaderLayout>
    );
  }
}
