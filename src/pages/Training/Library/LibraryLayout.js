import React, { PureComponent, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Row, Col, Tabs, Tree, Spin, Input, Button } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Questions from './Questions/QuestionsList';
import Article from './Article/ArticleList';
import Courseware from './Courseware/CoursewareList';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import Ellipsis from '@/components/Ellipsis';
import styles from './LibraryLayout.less';

const { TabPane } = Tabs;
const { TreeNode } = Tree;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '资源管理', name: '资源管理' },
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
      selectedKeys: [], // 知识树选中的知识点keys
      company: undefined, // 左上角选择的单位信息
      visible: false, // 控制选择单位弹窗显示
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { type = 'questions' },
      },
      resourceManagement: { searchInfo = {} },
    } = this.props;
    const company = { id: searchInfo.id, name: searchInfo.name };
    // 获取知识点树
    dispatch({
      type: 'resourceManagement/fetchKnowledgeTree',
      payload: { companyId: searchInfo.id },
    });
    this.setState({ activeKey: type, company });
  }

  // 获取单位列表
  fetchCompanyList = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'resourceManagement/fetchCompanyList', ...action });
  };

  // 获取试题列表
  fetchQuestions = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'resourceManagement/fetchQuestions', ...action });
  };

  // 获取文章列表
  fetchArticles = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'resourceManagement/fetchArticles', ...action });
  };
  // 获取课件列表
  fetchCourseWare = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'resourceManagement/fetchCourseWare', ...action });
  };

  // 切换tab
  handleTabChange = key => {
    this.setState({ activeKey: key }, () => {
      router.push(`/training/library/${key}/list`);
    });
  };

  // 选择单位
  handleSelectCompany = company => {
    const { dispatch } = this.props;
    const { activeKey } = this.state;
    this.setState({ company, visible: false, selectedKeys: [], knowledgeId: null });
    // 更新知识点树
    dispatch({
      type: 'resourceManagement/fetchKnowledgeTree',
      payload: {
        companyId: company.id,
      },
    });
    // 获取当前tab下的列表数据
    this.getCurrentList({ activeKey, company });
    // 保存企业信息，方便返回该页面显示
    dispatch({
      type: 'resourceManagement/saveSearchInfo',
      payload: company,
    });
  };

  // 选择单位弹窗关闭
  handleModalCLose = () => {
    this.setState({ visible: false });
  };

  // 点击知识点
  handleSelectTree = keys => {
    const { activeKey, company } = this.state;
    const [selected] = keys;
    this.setState({ knowledgeId: selected, selectedKeys: keys });
    // 获取当前tab下的列表
    this.getCurrentList({ activeKey, knowledgeId: selected, company });
  };

  // 获取当前tab下的列表 （区分试题、文章、课件）
  getCurrentList = ({ activeKey = null, knowledgeId = null, company = {} }) => {
    const {
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const notCompany = unitType === 2 || unitType === 3;
    if (activeKey === 'questions') {
      // 清空试题筛选数据
      this.refs.questions && this.refs.questions.resetFields();
      // 获取试题列表 Tips：user为政府人员需要传companyId，来看所有试题
      this.fetchQuestions({
        payload: {
          pageNum: 1,
          pageSize: defaultPageSize,
          knowledgeId,
          companyId: company && notCompany ? company.id : null,
        },
      });
    } else if (activeKey === 'article') {
      this.refs.questions && this.refs.article.resetFields();
      this.fetchArticles({
        payload: {
          pageNum: 1,
          pageSize: defaultPageSize,
          type: '1', // type 1文章
          knowledgeId,
          companyId: company && notCompany ? company.id : null,
        },
      });
    } else if (activeKey === 'courseware') {
      this.refs.questions && this.refs.courseware.resetFields();
      this.fetchCourseWare({
        payload: {
          pageNum: 1,
          pageSize: defaultPageSize,
          type: '2', // type '1'文章 '2' 课件
          knowledgeId,
          companyId: company && notCompany ? company.id : null,
        },
      });
    }
  };

  // 渲染树节点
  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children && Array.isArray(item.children)) {
        return (
          <TreeNode
            title={
              <Ellipsis length={10} tooltip>
                {item.name}
              </Ellipsis>
            }
            key={item.id}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      } else
        return (
          <TreeNode
            title={
              <Ellipsis length={10} tooltip>
                {item.name}
              </Ellipsis>
            }
            key={item.id}
          />
        );
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

  //点击选择企业
  handleViewModal = () => {
    this.fetchCompanyList({
      payload: { pageNum: 1, pageSize: defaultPageSize },
      callback: () => {
        this.setState({ visible: true });
      },
    });
  };

  render() {
    const {
      companyLoading,
      resourceManagement: { companyList },
      user: {
        currentUser: { unitType, companyId },
      },
    } = this.props;
    const { activeKey, knowledgeId, company = {}, visible } = this.state;
    const notCompany = unitType === 2 || unitType === 3;
    const data = { knowledgeId, companyId: company.id || companyId, unitType, notCompany };
    return (
      <PageHeaderLayout
        title="资源管理"
        breadcrumbList={breadcrumbList}
        content={
          notCompany && (
            <Fragment>
              <Input
                disabled
                style={{ width: '300px' }}
                placeholder={'请选择单位'}
                value={company.name}
              />
              <Button type="primary" style={{ marginLeft: '5px' }} onClick={this.handleViewModal}>
                选择单位
              </Button>
            </Fragment>
          )
        }
      >
        <div className={styles.libraryLayout}>
          {!company.id && notCompany ? (
            <div style={{ textAlign: 'center' }}>请先选择单位</div>
          ) : (
            <Row gutter={16}>
              <Col span={6}>
                <Card title="知识点">{this.renderTree()}</Card>
              </Col>
              <Col span={18} className={styles.libraryListContainer}>
                <Card>
                  <Tabs activeKey={activeKey} animated={false} onChange={this.handleTabChange}>
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
          )}
          <CompanyModal
            title="选择单位"
            loading={companyLoading}
            visible={visible}
            modal={companyList}
            fetch={this.fetchCompanyList}
            onSelect={this.handleSelectCompany}
            onClose={this.handleModalCLose}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
