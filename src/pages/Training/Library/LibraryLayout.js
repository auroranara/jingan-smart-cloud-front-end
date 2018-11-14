import React, { PureComponent } from 'react';
import { Card, Button, Row, Col, Tabs } from 'antd';
import connect from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Questions from './Questions/QuestionsList';
import Article from './Article/ArticleList';
import Resource from './Resource/ResourceList';

const TabPane = Tabs.TabPane

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '培训', name: '培训' },
  { title: '题库', name: '题库' },
]

// tabs配置
const tabsInfo = [
  { label: '试题', key: 'questions' },
  { label: '文章', key: 'article' },
  { label: '资源', key: 'resource' },
]

export default class LibraryLayout extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      activeKey: null,
    }
  }

  componentDidMount() {
    const {
      match: { params: { type = 'questions' } },
    } = this.props
    this.setState({ activeKey: type })
  }

  // 切换tab
  handleTabChange = (key) => {
    this.setState({ activeKey: key }, () => {
      router.push(`/training/library/${key}/list`)
    })
  }

  render() {
    const { activeKey } = this.state
    return (
      <PageHeaderLayout
        title="题库"
        breadcrumbList={breadcrumbList}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Card title="知识点">
            </Card>
          </Col>
          <Col span={18}>
            <Card>
              <Tabs
                activeKey={activeKey}
                // animated={false}
                onChange={this.handleTabChange}
              >
                {tabsInfo.map(item => (
                  <TabPane tab={item.label} key={item.key}>
                    {activeKey === 'questions' && <Questions /> || activeKey === 'article' && <Article /> || activeKey === 'resource' && <Resource />}
                  </TabPane>
                ))}
              </Tabs>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    )
  }
}
