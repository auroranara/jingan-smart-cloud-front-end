import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
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
    emergencyCard: { add: addCode },
  },
} = codes;

@connect(({ user, cardsInfo, loading }) => ({
  user,
  cardsInfo,
  loading: loading.models.cardsInfo,
}))
export default class TableList extends PureComponent {
  state = { current: 1, pageSize: PAGE_SIZE, modalVisible: false, modalItem: {}, companyTotal: '' };
  values = {};

  componentDidMount() {
    this.getList(null, PAGE_SIZE);
  }

  getList = (pageNum, pageSize) => {
    const { dispatch } = this.props;
    if (!pageNum) {
      // pageNum不存在，则为初始化
      pageNum = 1;
      this.setState({ current: 1 });
    }

    dispatch({
      type: 'cardsInfo/fetchEmergencyList',
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
      type: 'cardsInfo/deleteEmergencyCard',
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

  // 替换换行字符
  handleLineFeed = str => {
    return <div dangerouslySetInnerHTML={{ __html: str.replace(/\n/g, '<br>') }} />;
  };

  renderModal() {
    const { modalVisible, modalItem } = this.state;
    const {
      name,
      equipmentName,
      riskWarning,
      emergency,
      needAttention,
      safetyNum,
      telNum,
    } = modalItem;

    return (
      <Modal width="60%" visible={modalVisible} onCancel={this.hideModal} footer={null}>
        <table className={styles.table}>
          <tr>
            <th colspan="2" className={styles.th}>
              {name}
            </th>
          </tr>
          <tr>
            <td className={styles.td}>作业/设备名称</td>
            <td>{equipmentName}</td>
          </tr>
          <tr>
            <td className={styles.td}>风险提示</td>
            <td>{riskWarning ? this.handleLineFeed(riskWarning) : ''}</td>
          </tr>
          <tr>
            <td className={styles.td}>应急处置方法</td>
            <td>{emergency ? this.handleLineFeed(emergency) : ''}</td>
          </tr>
          <tr>
            <td className={styles.td}>注意事项</td>
            <td>{needAttention ? this.handleLineFeed(needAttention) : ''}</td>
          </tr>
          <tr>
            <td colspan="2" className={styles.td1}>
              应急联系方式
            </td>
          </tr>
          <tr>
            <td className={styles.td}>内部</td>
            <td>{`${safetyNum} ${telNum}`}</td>
          </tr>
          <tr>
            <td className={styles.td}>外部</td>
            <td>火警：119 医疗救护：120</td>
          </tr>
        </table>
      </Modal>
    );
  }

  render() {
    const {
      loading,
      user: {
        currentUser: { permissionCodes, unitType },
      },
      cardsInfo: { emergencyList, emergencyTotal },
    } = this.props;

    const addAuth = hasAuthority(addCode, permissionCodes);
    const { current, pageSize, companyTotal } = this.state;

    const list = emergencyList;
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
              scroll={{ x: 2000 }}
              pagination={{ pageSize, total: emergencyTotal, current, showSizeChanger: true }}
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
