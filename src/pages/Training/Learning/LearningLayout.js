import React, { PureComponent } from 'react';
import { Card, Row, Col, Tabs } from 'antd';
// import connect from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Courseware from './Courseware/CoursewareList';
import Article from './Article/ArticleList';

const TabPane = Tabs.TabPane;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '学习管理', name: '学习管理' },
];

// tabs配置
const tabsInfo = [{ label: '文章', key: 'article' }, { label: '课件', key: 'courseware' }];

export default class LearningLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { type = 'article' },
      },
    } = this.props;
    this.setState({ activeKey: type });
  }

  // 切换tab
  handleTabChange = key => {
    this.setState({ activeKey: key }, () => {
      router.push(`/training/learning/${key}/list`);
    });
  };

  render() {
    const { activeKey } = this.state;
    return (
      <PageHeaderLayout title="学习管理" breadcrumbList={breadcrumbList}>
        <Row gutter={16}>
          <Col>
            <Card>
              <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
                {tabsInfo.map(item => (
                  <TabPane tab={item.label} key={item.key}>
                    {(activeKey === 'courseware' && <Courseware />) ||
                      (activeKey === 'article' && <Article />)}
                  </TabPane>
                ))}
              </Tabs>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
