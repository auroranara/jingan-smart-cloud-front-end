import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import { Card, Input, List } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './ExamList.less';

import InlineForm from '@/pages/BaseInfo/Company/InlineForm';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '我的考试', name: '我的考试' },
];

const NO_DATA = '暂无信息';

const FIELDS = [
  {
    id: 'title',
    wrapperCol: { span: 20 },
    inputSpan: { lg: 8, md: 16, sm: 24 },
    render: () => <Input placeholder="请输入试卷标题" />,
    transform: v => v.trim(),
  },
];

const LIST = [...Array(10).keys()].map(i => ({ id: i, name: `试卷${i}`, limit: '2000 -> 2100', time: 90, percent: '50%' }));

export default class ExamList extends PureComponent {
  render() {
    const list = LIST;

    return (
      <PageHeaderLayout
        title="我的考试"
        breadcrumbList={breadcrumbList}
        // content={}
      >
        <Card style={{ marginBottom: 15 }}>
          <InlineForm
            fields={FIELDS}
            buttonSpan={{ xl: 6, md: 12, sm: 24 }}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          />
        </Card>
        {/* <div className={styles.cardList}> */}
          <List
            rowKey="id"
            // loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={list}
            renderItem={item => {
              const {
                id,
                name,
                limit,
                time,
                percent,
              } = item;

            const action = <Link to={`/training/my-exam/examing/${id}`}>开始考试</Link>;

              return (
                <List.Item key={id}>
                  <Card className={styles.card} title={name} actions={[action]}>
                    <p>
                      考试期限：
                      {limit || NO_DATA}
                    </p>
                    <p>
                      考试时长：
                      {time || NO_DATA}
                    </p>
                    <p>
                      合格率：
                      {percent || NO_DATA}
                    </p>
                    {/* <div className={styles.quantityContainer}>
                      <div className={styles.quantity}>{transmissionCount}</div>
                      <p className={styles.quantityDescrip}>传输装置数</p>
                    </div> */}
                  </Card>
                </List.Item>
              );
            }}
          />
        {/* </div> */}
      </PageHeaderLayout>
    );
  }
}
