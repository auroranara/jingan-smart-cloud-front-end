import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Button, Card, Empty, Modal, Table, message } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './TableList.less';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { BREADCRUMBLIST, PAGE_SIZE, ROUTER, getSearchFields, getTableColumns } from './utils';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';

// 权限
const {
  cardsInfo: {
    commitmentCard: { add: addCode },
  },
} = codes;
@connect(({ user, cardsInfo, loading }) => ({
  user,
  cardsInfo,
  loading: loading.models.cardsInfo,
}))
export default class TableList extends PureComponent {
  state = { companyTotal: '', current: 1, pageSize: PAGE_SIZE, modalVisible: false, modalItem: {} };
  values = {};

  componentDidMount() {
    this.getList(null, PAGE_SIZE);
  }

  getList = (pageNum, pageSize=PAGE_SIZE) => {
    const { dispatch } = this.props;

    if (!pageNum) {
      // pageNum不存在，则为初始化
      pageNum = 1;
      this.setState({ current: 1 });
    }

    dispatch({
      type: 'cardsInfo/fetchCommitList',
      payload: { pageNum, pageSize, ...this.values },
      callback: (res, msg) => {
        this.setState({ companyTotal: msg });
      },
    });
  };

  handleSearch = values => {
    const { pageSize } = this.state;
    this.values = values;
    this.getList(null, pageSize);
  };

  handleReset = () => {
    const { pageSize } = this.state;
    this.values = {};
    this.getList(null, pageSize);
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  onTableChange = (pagination, filters, sorter) => {
    const { current, pageSize } = pagination;
    this.setState({ current, pageSize });
    this.getList(current, pageSize);
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    const { current, pageSize } = this.state;
    dispatch({
      type: 'cardsInfo/deleteCommitCard',
      payload: id,
      callback: (code, msg) => {
        if (code === 200) {
          message.success('删除成功');
          this.getList(current, pageSize);
        } else message.error(msg);
      },
    });
  };

  showModal = item => {
    this.setState({ modalVisible: true, modalItem: item });
  };

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  renderModal() {
    const { modalVisible, modalItem } = this.state;
    const { name, content, acceptor, time } = modalItem;

    return (
      <Modal width="60%" visible={modalVisible} onCancel={this.hideModal} footer={null}>
        <div className={styles.container}>
          <h2 className={styles.title}>{name}</h2>
          <div className={styles.content}>{content}</div>
          <p className={styles.man}>{`承诺人：${acceptor}`}</p>
          <p className={styles.time}>{moment(time).format('YYYY-MM-DD')}</p>
        </div>
      </Modal>
    );
  }

  render() {
    const {
      loading,
      user: {
        currentUser: { permissionCodes, unitType },
      },
      cardsInfo: { commitList, commitTotal },
    } = this.props;

    const { current, pageSize, companyTotal } = this.state;

    const addAuth = hasAuthority(addCode, permissionCodes);

    const list = commitList;
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });

    const toolBarAction = (
      <Button
        disabled={!addAuth}
        type="primary"
        onClick={this.handleAdd}
        style={{ marginTop: '8px' }}
      >
        新增
      </Button>
    );
    const fields = getSearchFields(unitType);
    const columns = getTableColumns(this.handleDelete, this.showModal, unitType);

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles1.total}>
            单位数量：
            {companyTotal}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={fields}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            // buttonStyle={{ textAlign: 'right' }}
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
              scroll={{ x: 'max-content' }}
              pagination={{ pageSize, total: commitTotal, current, showSizeChanger: true }}
            />
          ) : (
            <Empty />
          )}
        </div>
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
