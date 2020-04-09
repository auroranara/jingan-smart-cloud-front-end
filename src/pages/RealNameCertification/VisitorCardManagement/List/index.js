import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Empty, Table, message } from 'antd';
import { Icon as LegacyIcon } from '@ant-design/compatible';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './index.less';
import { AuthButton } from '@/utils/customAuth';
import { Form } from '@ant-design/compatible';
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
@Form.create()
export default class index extends PureComponent {
  state = {
    expand: false,
    editVisible: false,
    editDetail: {},
  };
  componentDidMount() {
    this.handleQuery();
  }

  setFormReference = toobar => {
    this.form = toobar && toobar.props && toobar.props.form;
  };

  handlRecordPage = (id, num) => {
    router.push(`/real-name-certification/visitor-registration/record/${id}?num=${num}`);
  };

  handleQuery = () => {
    const { dispatch } = this.props;
    const values = this.form.getFieldsValue();
    dispatch({
      type: 'visitorRegistration/fetchCardList',
      payload: { ...values, pageNum: 1, pageSize: 10 },
    });
  };

  handleReset = () => {
    this.form.resetFields();
    this.handleQuery();
  };

  handleAdd = () => {
    router.push(`${ROUTER}/visitor-card-add`);
  };

  handlePageChange = (pageNum, pageSize) => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    const values = this.form.getFieldsValue();
    dispatch({
      type: 'visitorRegistration/fetchCardList',
      payload: {
        ...values,
        pageSize,
        pageNum,
        companyId,
      },
    });
  };

  handleExpand = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'visitorRegistration/fetchCardDel',
      payload: { id },
      callback: success => {
        if (success) {
          message.success('删除卡成功');
          this.handleQuery();
        } else {
          message.error('删除卡失败');
        }
      },
    });
  };

  // 编辑弹框显示
  handleEditModal = row => {
    this.setState({ editVisible: true, editDetail: { ...row } });
  };

  handleModalEdit = formData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'visitorRegistration/fetchCardEdit',
      payload: { ...formData },
      callback: response => {
        if (response && response.code === 200) {
          this.handleModalClose();
          this.handleQuery();
          message.success('编辑成功！');
        } else message.error(response.msg);
      },
    });
  };

  // 编辑弹框关闭
  handleModalClose = () => {
    this.setState({ editVisible: false });
  };

  render() {
    const {
      loading,
      user: {
        currentUser: { unitType },
      },
      visitorRegistration: {
        cardData: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props;
    const { expand } = this.state;
    const breadcrumbList = Array.from(BREADCRUMBLIST);

    const fields = getSearchFields(unitType);
    const columns = getTableColumns(
      this.handleDelete,
      this.handleEditModal,
      unitType,
      this.handlRecordPage
    );
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
            <Button style={{ marginRight: '10px' }} type="primary" onClick={this.handleQuery}>
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
        <EditModal {...modalData} />
      </PageHeaderLayout>
    );
  }
}
