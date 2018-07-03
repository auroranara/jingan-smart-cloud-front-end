import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button } from 'antd';
import { routerRedux } from 'dva/router';

import DescriptionList from 'components/DescriptionList';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout.js';

import styles from './AccountManagementEdit.less';

const { Description } = DescriptionList;

// 标题
const title = '查看账号';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '权限管理',
    href: '/',
  },
  {
    title: '账号管理',
    href: '/role-authorization/account-management/list',
  },
  {
    title,
  },
];

/* 表单标签 */
const fieldLabels = {
  user: '用户名',
  name: '姓名',
  phone: '手机号',
  unitType: '单位类型',
  hasUnit: '所属单位',
  status: '账号状态',
};

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(
  ({ accountmanagement, loading }) => ({
    accountmanagement,
    loading: loading.models.accountmanagement,
  }),
  dispatch => ({
    // 获取详情

    // 跳转到编辑页面
    goToEdit(id) {
      dispatch(routerRedux.push(`/role-authorization/account-management/edit/${id}`));
    },
    // 异常
    goToException() {
      dispatch(routerRedux.push('/exception/500'));
    },
  })
)
@Form.create()
export default class AccountManagementDetail extends PureComponent {
  /* 生命周期函数 */
  componentWillMount() {}

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      accountmanagement: { detail: data },
    } = this.props;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <DescriptionList col={3}>
          <Description term={fieldLabels.user}>{data.user || getEmptyData()}</Description>
          <Description term={fieldLabels.name}>{data.name || getEmptyData()}</Description>
          <Description term={fieldLabels.phone}>{data.phone || getEmptyData()}</Description>
          <Description term={fieldLabels.unitType}>{data.unitType || getEmptyData()}</Description>
          <Description term={fieldLabels.hasUnit}>{data.hasUnit || getEmptyData()}</Description>
          <Description term={fieldLabels.status}>{data.status || getEmptyData()}</Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const {
      goToEdit,
      match: {
        params: { id },
      },
    } = this.props;
    return (
      <FooterToolbar>
        <Button
          type="primary"
          onClick={() => {
            goToEdit(id);
          }}
        >
          编辑
        </Button>
      </FooterToolbar>
    );
  }

  render() {
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
      >
        {this.renderBasicInfo()}
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
