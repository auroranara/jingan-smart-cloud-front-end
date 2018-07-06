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
  },
  {
    title: '权限管理',
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
  loginName: '用户名',
  password: '密码',
  userName: '姓名',
  phoneNumber: '手机号',
  unitType: '单位类型',
  unitId: '所属单位',
  accountStatus: '账号状态',
};

const UnitTypes = ['', '维保企业', '政府机构', '运营企业', '一般企业'];

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(
  ({ accountManagement, loading }) => ({
    accountManagement,
    loading: loading.models.accountManagement,
  }),
  dispatch => ({
    // 查看详情
    fetchAccountDetail(action) {
      dispatch({
        type: 'accountManagement/fetchAccountDetail',
        ...action,
      });
    },

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
export default class accountManagementDetail extends PureComponent {
  /* 生命周期函数 */
  componentWillMount() {
    const {
      fetchAccountDetail,
      match: {
        params: { id },
      },
      goToException,
    } = this.props;
    // 获取详情
    fetchAccountDetail({
      payload: {
        id,
      },
      error: () => {
        goToException();
      },
    });
  }

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      accountManagement: {
        detail: {
          data: { loginName, userName, phoneNumber, unitType, unitName, accountStatus },
        },
      },
    } = this.props;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <DescriptionList col={3}>
          <Description term={fieldLabels.loginName}>{loginName || getEmptyData()}</Description>
          <Description term={fieldLabels.userName}>{userName || getEmptyData()}</Description>
          <Description term={fieldLabels.phoneNumber}>{phoneNumber || getEmptyData()}</Description>
          <Description term={fieldLabels.unitType}>
            {UnitTypes[unitType] || getEmptyData()}
          </Description>
          <Description term={fieldLabels.unitId}>{unitName || getEmptyData()}</Description>
          <Description term={fieldLabels.accountStatus}>
            {accountStatus === 1 ? '启用' : '禁用' || getEmptyData()}
          </Description>
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
