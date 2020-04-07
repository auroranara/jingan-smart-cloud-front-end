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

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'realNameCertification/fetchTagCardDel',
      payload: { id: id },
      callback: (success, msg) => {
        if (success) {
          message.success(`删除成功`);
          this.fetchList();
        } else {
          message.error(msg || `删除失败`);
        }
      },
    });
  };

  // 打开新建访客登记弹窗
  handleShowModal = (status, text = {}) => {
    this.setState({
      modalVisible: true,
      modalStatus: status,
      modalTitle: (status === 'add' && '访客登记') || (status === 'edit' && '访客登记'),
      detail: { ...text },
    });
  };

  // 提交
  handleModalAdd = formData => {
    const { dispatch } = this.props;
    dispatch({
      type: '',
      payload: { ...formData },
      callback: response => {
        if (response && response.code === 200) {
          this.handleModalClose();
          this.fetchList();
          message.success('新建成功！');
        } else message.error(response.msg);
      },
    });
  };

  // 关闭弹窗
  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  // 跳转到访客卡列表
  hanldleCardAdd = () => {};

  render() {
    const {
      loading,
      user: {
        currentUser: { permissionCodes, unitType },
      },
      realNameCertification: {
        tagCardData: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props;

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });

    const columns = getTableColumns(this.handleDelete, unitType);

    const recordAuth = hasAuthority(recordCode, permissionCodes);

    const modalData = {
      ...this.state,
      unitType,
      // companyId,
      handleModalClose: this.handleModalClose,
      handleModalAdd: this.handleModalAdd,
      handleModalEdit: this.handleModalEdit,
      hanldleCardAdd: this.hanldleCardAdd,
      list,
    };

    const fields = getSearchFields(unitType);

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        action={
          recordAuth ? (
            <a href={`#/${ROUTER}/record/${1}`}>访客登录记录</a>
          ) : (
            <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>
              访客登录记录
            </span>
          )
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
          </div>
        </Card>
        <Card
          title="访客登记列表"
          extra={
            <AuthButton
              code={addCode}
              type="primary"
              style={{ marginRight: '10px' }}
              onClick={() => {
                this.handleShowModal('add');
              }}
            >
              访客登记
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
        <EditModal {...modalData} />
      </PageHeaderLayout>
    );
  }
}
