import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import router from 'umi/router';
// import Link from 'umi/link';
import moment from 'moment';
import { Card, Table, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { BREADCRUMBLIST, DETAIL_COLUMNS as COLUMNS, ExamModal } from './utils';
@connect(({ targetResponsibility, user, loading }) => ({
  targetResponsibility,
  user,
  loading: loading.models.targetResponsibility,
}))
export default class CheckDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, // 弹窗是否可见
      currentId: '', // 表单当前id
      isopen: false,
      time: null,
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    this.fetchList();
  }

  // 获取列表
  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchExamDetail',
      payload: {
        id,
        ...params,
        pageSize,
        pageNum,
      },
    });
  };

  onTableChange = (pageNum, pageSize) => {
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize);
  };

  handleShowModal = id => {
    this.setState({ modalVisible: true, currentId: id });
  };

  handleModalAdd = formData => {
    const {
      time,
      fieldsValue: { actualValue, checkFrequency },
      goalDutyId,
      targetId,
    } = formData;
    const { dispatch } = this.props;

    dispatch({
      type: 'targetResponsibility/fetchExamAdd',
      payload: {
        goalDutyId,
        targetId,
        examtime: checkFrequency ? checkFrequency : moment(time).format('YYYY'),
        actualValue: actualValue,
      },
      callback: response => {
        if (response && response.code === 200) {
          this.handleModalClose();
          this.setState({ time: '' });
          this.fetchList();
          message.success('新建成功！');
        } else message.error(response.msg);
      },
    });
  };

  handlePanelChange = v => {
    this.setState({ time: v, isopen: false });
  };

  handleOpenChange = s => {
    if (s) {
      this.setState({ isopen: true });
    } else {
      this.setState({ isopen: false });
    }
  };

  clearDateValue = () => {
    this.setState({ time: null });
  };

  handleModalClose = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const {
      loading = false,
      targetResponsibility: {
        examDetail: {
          data: {
            list = [],
            // pagination: { total, pageNum, pageSize },
          },
        },
      },
    } = this.props;

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '考核详情', name: '考核详情' });

    const extraColumns = [
      {
        title: '详情',
        dataIndex: 'view',
        key: 'view',
        align: 'center',
        render: (val, text) => {
          return <a onClick={() => this.handleShowModal(text.targetId)}>添加考核结果</a>;
        },
      },
    ];

    const modalData = {
      ...this.state,
      handleModalClose: this.handleModalClose,
      handleModalAdd: this.handleModalAdd,
      handlePanelChange: this.handlePanelChange,
      handleOpenChange: this.handleOpenChange,
      clearDateValue: this.clearDateValue,
      list,
    };

    return (
      <PageHeaderLayout
        title={'考核详情'}
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles1.total}>
            共计：
            {list.length}
          </p>
        }
      >
        <div className={styles1.container}>
          {list.length > 0 ? (
            <Table
              bordered
              rowKey="targetId"
              loading={loading}
              columns={[...COLUMNS, ...extraColumns]}
              dataSource={list}
              onChange={this.onTableChange}
              // pagination={false}
              // pagination={{
              //   current: pageNum,
              //   pageSize,
              //   total,
              //   showQuickJumper: true,
              //   showSizeChanger: true,
              //   pageSizeOptions: ['5', '10', '15', '20'],
              //   onChange: this.handlePageChange,
              //   onShowSizeChange: (num, size) => {
              //     this.handlePageChange(1, size);
              //   },
              // }}
            />
          ) : (
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <span>暂无数据</span>
            </Card>
          )}
        </div>
        <ExamModal {...modalData} />
      </PageHeaderLayout>
    );
  }
}
