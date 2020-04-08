import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Empty, Table, message } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './index.less';
import { AuthButton } from '@/utils/customAuth';
import {
  BREADCRUMBLIST,
  ROUTER,
  getSearchFields,
  getTableColumns,
  EditModal,
} from '../other/utils';
import codes from '@/utils/codes';

// 权限
const {
  personnelManagement: {
    tagCardManagement: { visitorCardAdd: addCode },
  },
} = codes;

@connect(({ user, visitorRegistration, loading }) => ({
  user,
  visitorRegistration,
  loading: loading.models.visitorRegistration,
}))
export default class index extends PureComponent {
  state = {
    expand: false,
    editVisible: false,
    editDetail:{},
  };
  values = {};

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {};

  handleSearch = () => {};

  handleReset = () => {};

  handleAdd = () => {
    router.push(`${ROUTER}/visitor-card-add`);
  };

  handlePageChange = () => {};

  handleExpand = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  handleDelete = id => {};

  // 编辑弹框显示
  handleEditModal = (row) => {
    this.setState({ editVisible: true,editDetail:{...row} });
  };

  handleModalEdit =(formData)=>{
    
  }

  // 编辑弹框关闭
  handleModalClose  = ()=>{
    this.setState({ editVisible: false });
  }

  render() {
    const {
      loading,
      user: {
        currentUser: { unitType },
      },
      // visitorRegistration: {
      //   // registrationData: { list },
      // },
    } = this.props;

    const { expand } = this.state;
    const list = [
      {
        companyName: '1111',
        name: '卡一',
      },
    ];
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });

    const fields = getSearchFields(unitType);
    const columns = getTableColumns(this.handleDelete, this.handleEditModal, unitType);
    const filterField = expand ? fields : fields.slice(0, 3);

    const modalData = {
      ...this.state,
      handleModalClose: this.handleModalClose,
      handleModalEdit: this.handleModalEdit,
      list,
    };
    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={filterField}
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
        <Card
          title="访客卡列表"
          extra={
            <AuthButton
              code={addCode}
              type="primary"
              style={{ marginRight: '10px' }}
              onClick={this.handleAdd}
            >
              新增
            </AuthButton>
          }
        >
          {list.length ? (
            <Table
              rowKey="id"
              bordered
              loading={loading}
              columns={columns}
              dataSource={list}
              pagination={{
                // current: pageNum,
                // pageSize,
                // total,
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
        <EditModal {...modalData} />
      </PageHeaderLayout>
    );
  }
}
