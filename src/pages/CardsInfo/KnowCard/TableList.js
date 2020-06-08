import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Empty, Modal, Table, message } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { BREADCRUMBLIST, PAGE_SIZE, ROUTER, getSearchFields, getTableColumns } from './utils';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';

// 权限
const {
  cardsInfo: {
    knowCard: { add: addCode },
  },
} = codes;
@connect(({ user, cardsInfo, loading }) => ({
  user,
  cardsInfo,
  loading: loading.models.cardsInfo,
}))
export default class TableList extends PureComponent {
  state = {
    current: 1,
    pageSize: PAGE_SIZE,
    src: '',
    modalVisible: false,
    companyTotal: '',
  };
  values = {};

  componentDidMount() {
    this.getList(null, PAGE_SIZE);
  }

  getList = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    const vals = { ...this.values };
    if (vals.time) vals.time = vals.time.format('YYYY-MM-DD');

    if (!pageNum) {
      // pageNum不存在，则为初始化
      pageNum = 1;
      this.setState({ current: 1 });
    }

    dispatch({
      type: 'cardsInfo/fetchKnowList',
      payload: { pageNum, pageSize, ...vals },
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

  handleReset = (values, form) => {
    const { pageSize } = this.state;
    form.setFieldsValue({ time: null });
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
      type: 'cardsInfo/deleteKnowCard',
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
    this.setState({ modalVisible: true, src: item.contentDetails[0].webUrl });
  };

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const {
      loading,
      user: {
        currentUser: { permissionCodes, unitType },
      },
      cardsInfo: { knowList, knowTotal },
    } = this.props;

    const { modalVisible, current, pageSize, src, companyTotal } = this.state;
    const addAuth = hasAuthority(addCode, permissionCodes);

    const list = knowList;
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
              pagination={{ pageSize, total: knowTotal, current, showSizeChanger: true }}
            />
          ) : (
            <Empty />
          )}
        </div>
        <Modal width="60%" visible={modalVisible} onCancel={this.hideModal} footer={null}>
          <div
            style={{
              height: 700,
              backgroundImage: `url(${src})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '50% 50%',
            }}
          />
          {/* <iframe style={{ width: '100%', height: 700, border: 'none' }} src={src} /> */}
        </Modal>
      </PageHeaderLayout>
    );
  }
}
