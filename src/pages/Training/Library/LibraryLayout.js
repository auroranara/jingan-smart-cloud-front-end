import React, { PureComponent, Fragment } from 'react';
import { Card, Row, Col, Tabs, Tree, Spin, AutoComplete, Form, Select, Input } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Questions from './Questions/QuestionsList';
import Article from './Article/ArticleList';
import Courseware from './Courseware/CoursewareList';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import styles from './LibraryLayout.less';

const { TabPane } = Tabs
const { TreeNode } = Tree

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '培训', name: '培训' },
  { title: '题库', name: '题库' },
];

// 默认页大小
const defaultPageSize = 10;

@Form.create()
@connect(({ resourceManagement, user, loading }) => ({
  resourceManagement,
  user,
  treeLoading: loading.effects['resourceManagement/fetchKnowledgeTree'],
  companyLoading: loading.effects['resourceManagement/fetchCompanyList'],
}))
export default class LibraryLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null, // 当前tabs的值
      knowledgeId: null, // 点击保存的知识点id
      selectedKeys: [],   // 知识树选中的知识点keys
      company: undefined,  // 左上角选择的企业信息
      visible: false, // 控制选择企业弹窗显示
    }
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { type = 'questions' },
      },
    } = this.props;
    this.setState({ activeKey: type });
    // 获取知识点树
    dispatch({ type: 'resourceManagement/fetchKnowledgeTree' });
  }

  // 获取企业列表
  fetchCompanyList = (action) => {
    const { dispatch } = this.props
    dispatch({ type: 'resourceManagement/fetchCompanyList', ...action })
  }

  // 获取试题列表
  fetchQuestions = (action) => {
    const { dispatch } = this.props
    dispatch({ type: 'resourceManagement/fetchQuestions', ...action })
  }

  // 获取文章列表
  // 获取试题列表
  fetchArticles = (action) => {
    const { dispatch } = this.props
    dispatch({ type: 'resourceManagement/fetchArticles', ...action })
  }
  // 获取课件列表
  // 获取试题列表
  fetchCourseWare = (action) => {
    const { dispatch } = this.props
    dispatch({ type: 'resourceManagement/fetchCourseWare', ...action })
  }

  // 切换tab
  handleTabChange = (key) => {
    this.setState({ activeKey: key }, () => {
      router.push(`/training/library/${key}/list`)
    })
  }

  // 选择企业
  handleSelectCompany = (company) => {
    const { dispatch } = this.props;
    const { activeKey } = this.state
    this.setState({ company, visible: false, selectedKeys: [], knowledgeId: null });
    // 更新知识点树
    dispatch({
      type: 'resourceManagement/fetchKnowledgeTree',
      payload: {
        companyId: company.id,
      },
    });
    if (activeKey === 'questions') {
      // 清空试题筛选数据
      this.refs.questions && this.refs.questions.resetFields();
      // 获取试题列表
      this.fetchQuestions({
        payload: {
          pageNum: 1,
          pageSize: defaultPageSize,
          companyId: company.id,
        },
      });
    } else if (activeKey === 'article') {
      this.refs.questions && this.refs.article.resetFields()
      this.fetchArticles({
        payload: {
          pageNum: 1,
          pageSize: defaultPageSize,
          type: '1', // type 1文章
          companyId: company.id,
        },
      })
    } else if (activeKey === 'courseware') {
      this.refs.questions && this.refs.courseware.resetFields()
      this.fetchCourseWare({
        payload: {
          pageNum: 1,
          pageSize: defaultPageSize,
          type: '2', // type '1'文章 '2' 课件
          companyId: company.id,
        },
      })
    }
  };


  // 选择企业弹窗关闭
  handleModalCLose = () => {
    this.setState({ visible: false })
  }

  // 点击知识点
  handleSelectTree = (keys) => {
    const { activeKey, company } = this.state
    const {
      user: {
        currentUser: { unitType },
      },
    } = this.props
    const [selected] = keys
    const notCompany = unitType === 2 || unitType === 3

    this.setState({ knowledgeId: selected, selectedKeys: keys })
    if (activeKey === 'questions') {
      // 获取试题列表 Tips：user为政府人员需要传companyId，来看所有试题
      this.fetchQuestions({
        payload: {
          pageNum: 1,
          pageSize: defaultPageSize,
          knowledgeId: selected,
          companyId: company && notCompany ? company.id : null,
        },
      });
    } else if (activeKey === 'article') {
      this.fetchArticles({
        payload: {
          pageNum: 1,
          pageSize: defaultPageSize,
          type: '1', // type 1文章
          knowledgeId: selected,
          companyId: company && notCompany ? company.id : null,
        },
      })
    } else if (activeKey === 'courseware') {
      this.fetchCourseWare({
        payload: {
          pageNum: 1,
          pageSize: defaultPageSize,
          type: '2', // type '1'文章 '2' 课件
          knowledgeId: selected,
          companyId: company && notCompany ? company.id : null,
        },
      })
    }
  };

  // 渲染树节点
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children && Array.isArray(item.children)) {
        return (
          <TreeNode title={item.name} key={item.id}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      } else return <TreeNode title={item.name} key={item.id} />;
    });
  };

  // 渲染左侧知识点树
  renderTree = () => {
    const {
      treeLoading,
      resourceManagement: { knowledgeTree },
    } = this.props;
    const { selectedKeys } = this.state;

    if (knowledgeTree && knowledgeTree.length) {
      return (
        <Spin spinning={treeLoading}>
          <Tree selectedKeys={selectedKeys} showLine onSelect={this.handleSelectTree}>
            {this.renderTreeNodes(knowledgeTree)}
          </Tree>
        </Spin>
      );
    } else
      return (
        <div style={{ textAlign: 'center' }}>
          <span>暂无数据</span>
        </div>
      );
  };

  handleFocus = e => {
    e.target.blur();
    this.fetchCompanyList({
      payload: { pageNum: 1, pageSize: defaultPageSize },
      callback: () => {
        this.setState({ visible: true });
      },
    })
  };

  // 渲染单位选择
  renderSelect = () => {
    const { user: { currentUser: { unitType } } } = this.props;
    const { company } = this.state;
    const notCompany = unitType === 2 || unitType === 3;
    // 当账户为政府或运营时可以选择企业
    return notCompany && (
      <Input
        placeholder="请选择企业单位"
        style={{ marginBottom: 8, width: 256 }}
        onFocus={this.handleFocus}
        value={company && company.name}
        readOnly
      />
    );
  }

  render() {
    const {
      companyLoading,
      resourceManagement: {
        companyList,
      },
      user: {
        currentUser: { unitType },
      },
    } = this.props
    const { activeKey, knowledgeId, company = {}, visible } = this.state
    const data = { knowledgeId, companyId: company.id || null, unitType, notCompany: unitType === 2 || unitType === 3 }
    return (
      <PageHeaderLayout
        title="题库"
        breadcrumbList={breadcrumbList}
        content={(
          <Fragment>
            {this.renderSelect()}
          </Fragment>
        )}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Card title="知识点">{this.renderTree()}</Card>
          </Col>
          <Col span={18}>
            <Card>
              <Tabs
                activeKey={activeKey}
                animated={false}
                onChange={this.handleTabChange}
              >
                <TabPane tab="试题" key="questions">
                  {activeKey === 'questions' && <Questions ref="questions" {...data} />}
                </TabPane>
                <TabPane tab="文章" key="article">
                  {activeKey === 'article' && <Article ref="article" {...data} />}
                </TabPane>
                <TabPane tab="课件" key="courseware">
                  {activeKey === 'courseware' && <Courseware ref="courseware" {...data} />}
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
        <CompanyModal
          title="选择企业单位"
          loading={companyLoading}
          visible={visible}
          modal={companyList}
          fetch={this.fetchCompanyList}
          onSelect={this.handleSelectCompany}
          onClose={this.handleModalCLose}
        />
      </PageHeaderLayout>
    );
  }
}
