import React, { PureComponent } from 'react';
import { Card, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import moment from 'moment';

import styles from './MyFile.less';

function getTime(t) {
  return moment(t).format('YYYY-MM-DD HH:mm:ss ');
}

// 标题
const title = '综合分析报告';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '教育培训',
    name: '教育培训',
  },
  {
    title: '我的档案',
    name: '我的档案',
    href: '/training/myFile/myFileList',
  },
  {
    title,
    name: '综合分析报告',
  },
];

@connect(({ myFile }) => ({
  myFile,
}))
export default class MySynthesis extends PureComponent {
  /**
   * 挂载后
   */
  componentDidMount() {}

  render() {
    return (
      <PageHeaderLayout
        title="综合分析报告"
        breadcrumbList={breadcrumbList}
        content={<div />}
        extraContent={
          <Button className={styles.backBtn} onClick={() => this.goToMySynthesis()}>
            下载
          </Button>
        }
      >
        <Row gutter={16}>
          <Col>
            <Card>
              <div className={styles.detailFirst}>
                <div className={styles.detailTitle}>综合分析报告</div>
              </div>
              <div className={styles.detailSecond}>
                <span>考生：张三</span>
              </div>
              <div className={styles.detailMain} />
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
