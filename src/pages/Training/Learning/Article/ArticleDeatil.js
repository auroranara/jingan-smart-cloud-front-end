import React, { PureComponent } from 'react';
import { Card, Row, Col, Divider } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import moment from 'moment';

import styles from './Article.less';

function getTime(t) {
  return moment(t).format('YYYY-MM-DD HH:mm:ss ');
}

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '学习管理', name: '学习管理', href: '/training/learning/article/list' },
  { title: '文章阅读', name: '文章阅读' },
];

@connect(({ learning }) => ({
  learning,
}))
export default class ArticleDeatil extends PureComponent {
  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    // 获取详情
    dispatch({
      type: 'learning/fetch',
      payload: {
        id,
      },
    });
  }

  render() {
    const {
      match: {
        params: { id },
      },
      learning: {
        data: { list },
      },
    } = this.props;

    const detail = list.find(d => d.id === id) || {};

    const { name, createTime, totalPerson, totalRead, content } = detail;

    return (
      <PageHeaderLayout title="文章阅读" breadcrumbList={breadcrumbList}>
        <Row gutter={16}>
          <Col>
            <Card>
              <div className={styles.detailFirst}>
                <div className={styles.detailTitle}>{name}</div>
              </div>
              <div className={styles.detailSecond}>
                <span>
                  发布时间：
                  {getTime(createTime)}
                </span>
                <Divider type="vertical" />
                <span>
                  阅读人数：
                  {totalPerson}
                </span>
                <Divider type="vertical" />
                <span>
                  阅读次数：
                  {totalRead}
                </span>
              </div>
              <div className={styles.detailMain}>
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
