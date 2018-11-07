import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Badge } from 'antd';
import { routerRedux } from 'dva/router';

import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codesMap from '@/utils/codes';
import { AuthButton } from '@/utils/customAuth';

const { Description } = DescriptionList;

// 标题
const title = '查看法律法规库';

// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '执法检查',
    name: '执法检查',
  },
  {
    title: '法律法规库',
    name: '法律法规库',
    href: '/law-enforcement/laws/list',
  },
  {
    title,
    name: title,
  },
];
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ lawDatabase, user, loading }) => ({
  lawDatabase,
  user,
  loading: loading.models.lawDatabase,
}))
@Form.create()
export default class LawDatabaseDetail extends PureComponent {
  /* 生命周期函数 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取详情
    dispatch({
      type: 'lawDatabase/fetchLawsDetail',
      payload: {
        id,
      },
    });
  }

  // 返回到编辑页面
  goToEdit = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/law-enforcement/laws/edit/${id}`));
  };

  /* 渲染详情 */
  renderDetail() {
    const {
      match: {
        params: { id },
      },
      lawDatabase: {
        detail: { businessTypeName, lawTypeName, article, content, status },
      },
    } = this.props;
    console.log(this.props);
    return (
      <Card title="法律法规详情" bordered={false}>
        <DescriptionList col={1} style={{ marginBottom: 16 }}>
          <Description term="业务分类">{businessTypeName || getEmptyData()}</Description>
          <Description term="所属法律法规">{lawTypeName || getEmptyData()}</Description>
          <Description term="所属条款">{article || getEmptyData()}</Description>
          <Description term="法律法规内容">{content || getEmptyData()}</Description>
          <Description term="是否启用">
            {+status === 1 ? (
              <span>
                <Badge status="success" />
                启用
              </span>
            ) : (
              (
                <span>
                  <Badge status="error" />
                  禁用
                </span>
              ) || getEmptyData()
            )}
          </Description>
        </DescriptionList>
        <div style={{ textAlign: 'center' }}>
          <AuthButton
            type="primary"
            size="large"
            code={codesMap.lawEnforcement.laws.edit}
            onClick={() => {
              this.goToEdit(id);
            }}
          >
            编辑
          </AuthButton>
        </div>
      </Card>
    );
  }

  render() {
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderDetail()}
      </PageHeaderLayout>
    );
  }
}
