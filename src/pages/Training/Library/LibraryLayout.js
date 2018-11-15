import React, { PureComponent } from 'react';
import { Card, Button, Row, Col, Tabs, Tree, Spin } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Questions from './Questions/QuestionsList';
import Article from './Article/ArticleList';
import Courseware from './Courseware/CoursewareList';

const { TabPane } = Tabs
const { TreeNode } = Tree

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '培训', name: '培训' },
  { title: '题库', name: '题库' },
]

// tabs配置
const tabsInfo = [
  { label: '试题', key: 'questions' },
  { label: '文章', key: 'article' },
  { label: '课件', key: 'courseware' },
]

@connect(({ resourceManagement, loading }) => ({
  resourceManagement,
  treeLoading: loading.effects['resourceManagement/fetchKnowledgeTree'],
}))
export default class LibraryLayout extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      activeKey: null,
    }
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { type = 'questions' } },
    } = this.props
    this.setState({ activeKey: type })
    // 获取知识点树
    dispatch({ type: 'resourceManagement/fetchKnowledgeTree' })
  }

  // 切换tab
  handleTabChange = (key) => {
    this.setState({ activeKey: key }, () => {
      router.push(`/training/library/${key}/list`)
    })
  }

  // 点击知识点
  handleSelectTree = (keys) => {
    const { activeKey } = this.state
    const {
      dispatch,
    } = this.props
    const [selected] = keys
    if (activeKey === 'questions') {
      console.log('1');

      dispatch({
        type: 'resourceManagement/fetchQuestions',
        payload: {
          pageNum: 1,
          pageSize: 10,
          knowledgeId: selected,
        },
      })
    } else if (activeKey === 'article') {
      console.log('1');

    } else if (activeKey === 'courseware') {
      console.log('1');
    }

  }

  // 渲染树节点
  renderTreeNodes = (data) => {
    return data.map(item => {
      if (item.children && Array.isArray(item.children)) {
        return (
          <TreeNode title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        )
      } else return (
        <TreeNode title={item.name} key={item.id}>
        </TreeNode>
      )
    })
  }

  // 渲染左侧知识点树
  renderTree = () => {
    const {
      treeLoading,
      resourceManagement: {
        knowledgeTree,
      },
    } = this.props

    if (knowledgeTree && knowledgeTree.length) {
      return (
        <Spin spinning={treeLoading}>
          <Tree showLine onSelect={this.handleSelectTree}>
            {this.renderTreeNodes(knowledgeTree)}
          </Tree>
        </Spin>
      )
    } else return (
      <div style={{ textAlign: 'center' }}><span>暂无数据</span></div>
    )
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
              {this.renderTree()}
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
                    {activeKey === 'questions' && <Questions /> || activeKey === 'article' && <Article /> || activeKey === 'courseware' && <Courseware />}
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
