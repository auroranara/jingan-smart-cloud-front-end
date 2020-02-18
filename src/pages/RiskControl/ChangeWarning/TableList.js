import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Empty, Modal, Table, message } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { BREADCRUMBLIST, PAGE_SIZE, getColumns, getSearchFields } from './utils';
import { isCompanyUser } from '@/pages/RoleAuthorization/Role/utils';

const { confirm } = Modal;

@connect(({ user, changeWarningNew, loading }) => ({
  user,
  changeWarning: changeWarningNew,
  loading: loading.models.changeWarningNew,
}))
export default class TableList extends PureComponent {
  state = { current: 1 };
  values = {};
  empty = true;

  componentDidMount() {
    this.getList();
  }

  getList = pageNum => {
    const { dispatch } = this.props;
    const { companyId } = this.values;
    const vals = { ...this.values };
    if (companyId)
      vals.companyId = companyId.key;

    if (!pageNum) { // pageNum不存在，则为初始化
      pageNum = 1;
      this.setState({ current: 1 });
      this.getZones(vals.companyId);
    }

    dispatch({
      type: 'changeWarningNew/fetchWarningNewList',
      payload: { pageNum, pageSize: PAGE_SIZE, ...vals },
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

  onTableChange = (pagination, filters, sorter) => {
    const { current } = pagination;
    this.setState({ current });
    this.getList(current);
  };

  genConfirmEvaluate = id => e => {
    confirm({
      title: '审批',
      content: '请保证已对变更影响的区域进行风险评价，且制定了相应的风险管控措施！确定标为已评价？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.handleEvaluate(id);
      },
    });
  };

  handleEvaluate = id => {
    const { dispatch } = this.props;
    const { current } = this.state;
    dispatch({
      type: 'changeWarningNew/postEvaluate',
      payload: { id, status: '1' },
      callback: (code, msg) => {
        if (code === 200)
          this.getList(current);
        else
          message.error(msg);
      },
    })
  };

  getZones = id => { // id不存在时清空
    const {
      dispatch,
      user: { currentUser: { unitType } },
    } = this.props;
    const isComUser = isCompanyUser(unitType);

    if (isComUser || id) // id存在时或者当前用户为企业用户，companyId不需要
      dispatch({
        type: 'changeWarningNew/fetchZoneList',
        payload: { companyId: id, pageSize: 0, pageNum: 1 },
      });
    else
      dispatch({
        type: 'changeWarningNew/saveZoneList',
        payload: [],
      });
  };

  handleCompanyChange = c => {
    const { key, label } = c || {};
    if (!key)
      this.getZones();
    if (key !== label) // key === label 时，为键盘输入的值，不相等时是选取到的值
      this.getZones(key);
  };

  render() {
    const {
      loading,
      user: { currentUser: { unitType } },
      changeWarning: { total, list, zoneList },
    } = this.props;
    const { current } = this.state;
    const isComUser = isCompanyUser(unitType);
    const fields = getSearchFields(isComUser, zoneList, this.handleCompanyChange);
    const cols = getColumns(this.genConfirmEvaluate);
    const columns = isComUser ? cols.filter(({ dataIndex }) => dataIndex !== 'companyName') : cols;

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length -1].title}
        breadcrumbList={BREADCRUMBLIST}
        content={
          <Fragment>
            <p className={styles1.total}>
              共计：{total}
            </p>
            <p style={{ margin: 0, color: '#F00' }}>
              请对变更所属的风险区域重新进行风险评价，评价完成后可对变更进行审批（
              <a href={`${window.publicPath}#/risk-control/change-management/list`} target="_blank" rel="noopener noreferrer">变更管理</a>
              ）
            </p>
          </Fragment>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={fields}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
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
              scroll={{ x: 1400 }} // 项目不多时注掉
              pagination={{ pageSize: PAGE_SIZE, total: total, current }}
            />
          ) : <Empty />}
        </div>
      </PageHeaderLayout>
    );
  }
}
