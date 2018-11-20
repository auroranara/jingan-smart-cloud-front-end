import React, { PureComponent } from 'react';
import { Card, Row, Col, Divider } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Resource from '@/components/Resource';
import moment from 'moment';

import style from './Courseware.less';

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

@connect(({ learning }) => ({
  learning,
}))
export default class LearningLayout extends PureComponent {
  state = {
    // visible: false,
    numPages: null,
    pageNumber: 1,
    pdfSrc: 'http://data.jingan-china.cn/%E6%BC%94%E7%A4%BA%E6%96%87%E6%A1%A3.pdf',
    pptSrc:
      'http://data.jingan-china.cn/%E4%BD%A0%E5%8F%AF%E8%83%BD%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84X%E6%88%98%E8%AD%A62.pptx',
    styles: {
      width: 1026,
      height: '100vh',
    },
  };

  handleContent = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const { pdfSrc, styles } = this.state;
    return (
      <PageHeaderLayout title="课件学习" breadcrumbList={breadcrumbList}>
        <Row gutter={16}>
          <Col>
            <Card>
              <div className={style.detailFirst}>
                <div className={style.detailTitle}>{'发自内心的文章致敬所有消防员！'}</div>
              </div>
              <div className={style.detailSecond}>
                <span>发布时间 : {getTime()}</span>
                <Divider type="vertical" />
                <span>阅读人数：100 人</span>
                <Divider type="vertical" />
                <span>阅读次数：1000 次</span>
              </div>
              <div className={style.detailMain}>
                <div className={style.resource}>
                  <Resource src={pdfSrc} styles={styles} extension="pdf" />
                </div>
                <div>
                  <h3>
                    详细内容：
                    {getEmptyData()}
                  </h3>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
