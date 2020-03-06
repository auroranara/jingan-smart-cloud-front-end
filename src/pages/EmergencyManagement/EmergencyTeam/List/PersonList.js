import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
import { Button, Empty, Table, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { BREADCRUMBLISTPER, EditModal, getPersonColumns, getLevel } from '../Other/utils';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';

// 权限
const {
  emergencyManagement: {
    emergencyTeam: { addTeamPerson: addCode },
  },
} = codes;

@connect(({ user, emergencyTeam, loading }) => ({
  user,
  emergencyTeam,
  loading: loading.models.emergencyTeam,
}))
export default class PersonList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalTitle: '', // 弹窗标题
      modalStatus: '', // 弹窗状态
      modalVisible: false, // 弹窗是否可见
      detail: {}, // 详情
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'emergencyTeam/fetchTeamPersonList',
      payload: {
        ...params,
        treamId: id,
        pageSize,
        pageNum,
      },
    });
  };

  handleShowModal = (status, text = {}) => {
    this.setState({
      modalVisible: true,
      modalStatus: status,
      modalTitle: (status === 'add' && '新建人员') || (status === 'edit' && '编辑人员'),
      detail: { ...text },
    });
  };

  // 新建人员
  handleModalAdd = formData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyTeam/fetchTeamPersonAdd',
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

  // 编辑人员
  handleModalEdit = formData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyTeam/fetchTeamPersonEdit',
      payload: { ...formData },
      callback: response => {
        if (response && response.code === 200) {
          this.handleModalClose();
          this.fetchList();
          message.success('编辑成功！');
        } else message.error(response.msg);
      },
    });
  };

  // 关闭弹窗
  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  handlePageChange = (pageNum, pageSize) => {
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize);
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyTeam/fetchTeamPersonDel',
      payload: { id: id },
      success: () => {
        this.fetchList();
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };

  render() {
    const {
      loading,
      user: {
        currentUser: { permissionCodes },
      },
      emergencyTeam: {
        personData: {
          treamName,
          treamLevel,
          treamPersList: {
            list = [],
            pagination: { total, pageNum, pageSize },
          },
        },
      },
      match: {
        params: { id },
      },
    } = this.props;

    const addAuth = hasAuthority(addCode, permissionCodes);

    const breadcrumbList = Array.from(BREADCRUMBLISTPER);

    const columns = getPersonColumns(this.handleDelete, this.handleShowModal);

    const modalData = {
      ...this.state,
      id,
      handleModalClose: this.handleModalClose,
      handleModalAdd: this.handleModalAdd,
      handleModalEdit: this.handleModalEdit,
      list,
    };

    return (
      <PageHeaderLayout
        title={BREADCRUMBLISTPER[BREADCRUMBLISTPER.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>队伍名称 ：{treamName}</span>
            <span style={{ paddingLeft: 20 }}>队伍级别 : {getLevel[treamLevel]}</span>
            <Button
              disabled={!addAuth}
              type="primary"
              onClick={() => this.handleShowModal('add')}
              style={{ marginTop: '8px', float: 'right' }}
            >
              新增
            </Button>
          </div>
        }
      >
        <div className={styles1.container}>
          {list.length ? (
            <Table
              rowKey="id"
              bordered
              loading={loading}
              columns={columns}
              dataSource={list}
              onChange={this.onTableChange}
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
            <Empty />
          )}
        </div>
        <EditModal {...modalData} />
      </PageHeaderLayout>
    );
  }
}
