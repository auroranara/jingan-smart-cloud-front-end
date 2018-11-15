import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Input, List, Row, Col } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
// import styles from './UserTransmissionDevice.less';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '我的考试', name: '我的考试' },
];

export default class ExamList extends PureComponent {
  render() {
      return (
        <PageHeaderLayout
          title="我的考试"
          // breadcrumbList={breadcrumbList}
          // content={}
        >
          <Row>
            <Col span={6}>答题卡</Col>
            <Col span={18}>试卷内容</Col>
          </Row>
        </PageHeaderLayout>
      );
    }
}
