import React, { PureComponent } from 'react';
import { Card, Row, Col, Divider } from 'antd';
// import connect from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import moment from 'moment';

import styles from './Courseware.less';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '学习管理', name: '学习管理', href: '/training/learning/courseware/list' },
  { title: '课件学习', name: '课件学习' },
];

function getTime(t) {
  return moment(t).format('YYYY-MM-DD HH:mm:ss ');
}

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

export default class LearningLayout extends PureComponent {
  render() {
    return (
      <PageHeaderLayout title="课件学习" breadcrumbList={breadcrumbList}>
        <Row gutter={16}>
          <Col>
            <Card>
              <div className={styles.detailFirst}>
                <div className={styles.detailTitle}>{'发自内心的文章致敬所有消防员！'}</div>
              </div>
              <div className={styles.detailSecond}>
                <span>发布时间 : {getTime()}</span>
                <Divider type="vertical" />
                <span>阅读人数：100 人</span>
                <Divider type="vertical" />
                <span>阅读次数：1000 次</span>
              </div>
              <div className={styles.detailMain}>
                <h3>
                  课件内容：
                  <a>预览附件</a>
                </h3>
                <h3>
                  详细内容：
                  {getEmptyData()}
                </h3>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
