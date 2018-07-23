import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Link } from 'react-router-dom';
import { Form, Card, Button } from 'antd';
import { routerRedux } from 'dva/router';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const { Description } = DescriptionList;

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '消防维保',
    name: '消防维保',
  },
  {
    title: '维保公司',
    name: '维保公司',
    href: '/fire-control/maintenance-company/list',
  },
  {
    title: '维保单位详情',
    name: '维保单位详情',
  },
];

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ maintenanceCompany, loading }) => ({
  maintenanceCompany,
  loading: loading.models.maintenanceCompany,
}))
@Form.create()
export default class MaintenanceCmpanyDetail extends PureComponent {
  state = {
    hasSubCompany: false,
  };

  /* 生命周期函数 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    // 获取维保单位详情
    dispatch({
      type: 'maintenanceCompany/fetchDetail',
      payload: {
        id,
      },
      callback: ({ isBranch }) => {
        this.setState({ hasSubCompany: !!isBranch });
      },
    });
  }

  // 跳转到编辑页面
  goToEdit = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/fire-control/maintenance-company/edit/${id}`));
  };

  // 渲染单位详情
  render() {
    const {
      match: {
        params: { id },
      },
      maintenanceCompany: { detail: data },
    } = this.props;

    const { hasSubCompany } = this.state;

    return (
      <PageHeaderLayout title="维保公司详情" breadcrumbList={breadcrumbList}>
        <Card title="单位详情" bordered={false}>
          <DescriptionList col={3}>
            <Description term="维保单位">{data.companyName || getEmptyData()}</Description>
            <Description term="主要负责人">{data.principalName || getEmptyData()}</Description>
            <Description term="联系电话">{data.principalPhone || getEmptyData()}</Description>
            <Description term="是否为分公司">
              {data.isBranch === 1 ? '是' : '否' || getEmptyData()}
            </Description>
            {hasSubCompany && (
              <Description term="所属总公司"> {data.parnetUnitName || getEmptyData()}</Description>
            )}
          </DescriptionList>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <Button
              type="primary"
              onClick={() => {
                this.goToEdit(id);
              }}
            >
              编辑
            </Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
