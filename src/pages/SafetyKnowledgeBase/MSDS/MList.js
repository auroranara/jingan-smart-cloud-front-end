import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import Ellipsis from '@/components/Ellipsis';
import { Button, Card, Input, Select } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './MList.less';
import { RISK_CATEGORIES } from './utils';

const { Option } = Select;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '安全生产知识库', name: '安全生产知识库' },
  { title: '化学品安全说明书', name: '化学品安全说明书' },
  { title: '列表', name: '列表' },
];

const NO_DATA = '暂无信息';
const PAGE_SIZE = 18;
const LIST = [];

const SPAN = { md: 8, sm: 12, xs: 24 };
const FIELDS = [
  {
    id: 'name1',
    label: '中文名称一：',
    span: SPAN,
    render: () => <Input placeholder="请输入中文名称一" />,
    transform: v => v.trim(),
  },
  {
    id: 'name2',
    label: '中文名称二：',
    span: SPAN,
    render: () => <Input placeholder="请输入中文名称二" />,
    transform: v => v.trim(),
  },
  {
    id: 'type',
    label: '危险品类别',
    span: SPAN,
    render: () => <Select placeholder="请选择危险性类别">{RISK_CATEGORIES.map((r, i) => <Option key={i}>{r}</Option>)}</Select>,
  },
  {
    id: 'CAS',
    label: 'CAS号：',
    span: SPAN,
    render: () => <Input placeholder="CAS号" />,
    transform: v => v.trim(),
  },
];

// @connect(({ checkPoint, loading }) => ({ checkPoint, loading: loading.effects['checkPoint/fetchCheckList'] }))
export default class MList extends PureComponent {
  handleSearch = vals => {

  };

  handleReset = () => {
  };

  handleAdd = () => {
    // const { match: { params: { companyId } } } = this.props;
    router.push(`/safety-knowledge-base/msds/add`);
  };

  render() {
    const {
      loading,
      // checkPoint: { lists },
    } = this.props;

    const list = LIST;
    const toolBarAction = (
      <Button type="primary" onClick={this.handleAdd} style={{ marginTop: '8px' }}>
        新增MSDS
      </Button>
    );

    return (
      <PageHeaderLayout
        title="化学品安全说明书(MSDS)"
        breadcrumbList={breadcrumbList}
        content={
          <p className={styles.total}>
            共计：
            {list.length}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={FIELDS}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 16, sm: 12, xs: 24 }}
          />
        </Card>
        {/* <Table /> */}
      </PageHeaderLayout>
    );
  }
}
