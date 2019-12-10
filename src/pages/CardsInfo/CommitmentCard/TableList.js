import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Button, Card, Modal, Table, message } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './TableList.less';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { BREADCRUMBLIST, PAGE_SIZE, ROUTER, SEARCH_FIELDS as FIELDS, getTableColumns } from './utils';

@connect(({ cardsInfo, loading }) => ({
  cardsInfo,
  loading: loading.models.cardsInfo,
}))
export default class TableList extends PureComponent {
  state = { current: 1, modalVisible: false, modalItem: {} };
  values = {};

  componentDidMount() {
    this.getList();
  }

  getList = pageNum => {
    const { dispatch } = this.props;
    if (!pageNum) { // pageNum不存在，则为初始化
      pageNum = 1;
      this.setState({ current: 1 });
    }

    dispatch({
      type: 'cardsInfo/fetchCommitList',
      payload: { pageNum, pageSize: PAGE_SIZE, ...this.values },
    });
  };

  handleSearch = values => {
    this.values = values;
    this.getList();
  };

  handleReset = () => {
    this.values = {};
    this.getList();
  };

  handleAdd = () => {
    router.push(`${ROUTER}/add`);
  };

  onTableChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    this.setState({ current });
    this.getList(current);
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    const { current } = this.state;
    dispatch({
      type: 'cardsInfo/deleteCommitCard',
      payload: id,
      callback: (code, msg) => {
        if (code === 200) {
          message.success('删除成功');
          this.getList(current);
        }
        else
          message.error(msg);
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
      <Modal width="60%" visible={modalVisible} onCancel={this.hideModal} footer={null} >
        <div className={styles.container}>
          <h2 className={styles.title}>{name}</h2>
          <pre>{content}</pre>
          <p className={styles.man}>{`承诺人：${acceptor}`}</p>
          <p className={styles.time}>{moment(time).format('YYYY-MM-DD')}</p>
        </div>
      </Modal>
    );
  }

  render() {
    const {
      loading,
      cardsInfo: { commitList, commitTotal },
    } = this.props;
    const { current } = this.state;

    const list = commitList;
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });
    const toolBarAction = (
      <Button type="primary" onClick={this.handleAdd} style={{ marginTop: '8px' }}>
        新增
      </Button>
    );
    const columns = getTableColumns(this.handleDelete, this.showModal);

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length -1].title}
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles1.total}>
            共计：{commitTotal}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={FIELDS}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            // buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 8, sm: 12, xs: 24 }}
          />
        </Card>
        <div className={styles1.container}>
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={list}
            onChange={this.onTableChange}
            scroll={{ x: 1400 }} // 项目不多时注掉
            pagination={{ pageSize: PAGE_SIZE, total: commitTotal, current }}
          />
        </div>
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
