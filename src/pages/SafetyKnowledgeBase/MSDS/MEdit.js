import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, Input, Select } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
// import styles from './MEdit.less';
import { RISK_CATEGORIES } from './utils';

const { Option } = Select;

const NO_DATA = '暂无信息';
const PAGE_SIZE = 18;

// @connect(({ checkPoint, loading }) => ({ checkPoint, loading: loading.effects['checkPoint/fetchCheckList'] }))
export default class MEdit extends PureComponent {
  handleAdd = () => {
    // const { match: { params: { companyId } } } = this.props;
    router.push(`/safety-knowledge-base/msds/add`);
  };

  render() {
    const {
      loading,
      // checkPoint: { lists },
    } = this.props;

    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '安全生产知识库', name: '安全生产知识库' },
      { title: '化学品安全说明书', name: '化学品安全说明书' },
      { title: '新增', name: '新增' },
    ];

    return (
      <PageHeaderLayout
        title="新增MSDS"
        breadcrumbList={breadcrumbList}
      >
        <Card style={{ marginBottom: 15 }}>
          {}
        </Card>
      </PageHeaderLayout>
    );
  }
}
