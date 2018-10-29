import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button } from 'antd';
import moment from 'moment';
import { routerRedux } from 'dva/router';

import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

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
// const getEmptyData = () => {
//   return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
// };

@connect(({ lawDatabase, user, loading }) => ({
  lawDatabase,
  user,
  loading: loading.models.lawDatabase,
}))
@Form.create()
export default class LawDatabaseDetail extends PureComponent {
  /* 生命周期函数 */
  componentDidMount() {}

  /* 渲染详情 */
  renderDetail() {
    return (
      <Card title="法律法规详情" bordered={false}>
        <DescriptionList col={1} style={{ marginBottom: 16 }}>
          <Description term="业务分类" />
          <Description term="所属法律法规" />
          <Description term="所属条款" />
          <Description term="法律法规内容" />
        </DescriptionList>
        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            // onClick={() => {
            //   goToEdit(id);
            // }}
          >
            编辑
          </Button>
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
