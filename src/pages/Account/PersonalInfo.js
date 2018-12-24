import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card } from 'antd';
import { routerRedux } from 'dva/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
// import Center from './Center/Projects';

const { Description } = DescriptionList;

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '个人信息',
    name: '个人信息',
  },
];

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

const UnitTypes = ['', '维保企业', '政府机构', '运营企业', '企事业主体'];

const UserTypes = [
  {
    label: '企业法人',
    value: 'company_legal_person',
  },
  {
    label: '企业安全负责人',
    value: 'company_charger',
  },
  {
    label: '企业安全管理员',
    value: 'company_safe_manager',
  },
  {
    label: '企业安全员',
    value: 'company_safer',
  },
];

@connect(({ account, user, loading }) => ({
  account,
  user,
  loading: loading.models.account,
}))
@Form.create()
export default class PersonalInfo extends PureComponent {
  state = {
    companyType: false,
  };

  /* 生命周期函数 */
  componentDidMount() {
    // console.log('props', this.props);
    const {
      dispatch,
      match: {
        params: { id },
      },
      user: { currentUser },
    } = this.props;
    // 获取详情
    dispatch({
      type: 'account/fetchAssociatedUnitDeatil',
      payload: {
        userId: id,
      },
      success: ({ unitType }) => {
        this.setState({
          companyType: unitType === 4,
        });
      },
      error() {
        dispatch(routerRedux.push('/exception/500'));
      },
    });
  }

  // 渲染个人信息
  renderUnitInfo() {
    const {
      account: {
        detail: {
          data: {
            loginName,
            userName,
            phoneNumber,
            unitType,
            unitName,
            departmentName,
            userType,
            roleNames,
          },
        },
      },
    } = this.props;
    const { companyType } = this.state;

    const userTypeObj = UserTypes.find(t => t.value === userType);
    const phone = phoneNumber + '';
    const formatPhone = phone.substr(0, 3) + '****' + phone.substr(7);

    return (
      <Card bordered={false}>
        <DescriptionList
          col={1}
          style={{
            position: 'relative',
            // top: '50%',
            marginLeft: '45%',
          }}
        >
          <Description term="用户名">{loginName || getEmptyData()}</Description>
          <Description term="姓名">{userName || getEmptyData()}</Description>
          <Description term="手机号">{formatPhone || getEmptyData()}</Description>
          <Description term="单位类型">{UnitTypes[unitType] || getEmptyData()}</Description>
          <Description term="所属单位">{unitName || getEmptyData()}</Description>
          <Description term="所属部门">{departmentName || getEmptyData()}</Description>
          {companyType && (
            <Description term="用户类型">
              {userTypeObj ? userTypeObj.label : getEmptyData()}
            </Description>
          )}
          <Description term="角色">
            {roleNames
              ? roleNames.split(',').map(roleName => (
                  <p key={roleName} style={{ margin: 0, padding: 0 }}>
                    {roleName}
                  </p>
                ))
              : getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  render() {
    return (
      <PageHeaderLayout title="个人信息" breadcrumbList={breadcrumbList}>
        {this.renderUnitInfo()}
      </PageHeaderLayout>
    );
  }
}
