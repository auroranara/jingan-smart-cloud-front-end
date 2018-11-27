import React, { PureComponent } from 'react';
import { Card, Row, Col, Tabs, Input } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Courseware from './Courseware/CoursewareList';
import Article from './Article/ArticleList';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';

const TabPane = Tabs.TabPane;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '学习管理', name: '学习管理' },
];

// 默认每页显示数量
const defaultPageSize = 10;

// tabs配置
const tabsInfo = [{ label: '文章', key: 'article' }, { label: '课件', key: 'courseware' }];

@connect(({ learning, user, loading }) => ({
  user,
  learning,
  loading: loading.models.learning,
}))
export default class LearningLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      visible: false,
    };
  }

  // 挂载后
  componentDidMount() {
    const {
      match: {
        params: { type = 'article' },
      },
      user: {
        currentUser: { companyId },
      },
      dispatch,
    } = this.props;
    this.companyId = companyId;
    const payload = { pageSize: defaultPageSize, pageNum: 1 };
    if (!companyId) this.fetchCompany({ payload });
    // 获取知识点树
    dispatch({
      type: 'learning/fetchTree',
      payload: {
        companyId: this.companyId,
      },
    });
    this.setState({ activeKey: type });
  }

  // 显示企业弹出框
  handleFocus = e => {
    e.target.blur();
    const { dispatch } = this.props;
    this.setState({ visible: true });
    dispatch({
      type: 'learning/fetchCompanies',
      payload: {
        pageSize: defaultPageSize,
        pageNum: 1,
      },
    });
  };

  // 获取企业
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'learning/fetchCompanies', payload });
  };

  // 关闭企业弹出框
  handleClose = () => {
    this.setState({ visible: false });
  };

  // 选择企业
  handleSelect = item => {
    const {
      match: {
        params: { type },
      },
    } = this.props;
    const { id, name } = item;
    this.companyId = id;
    this.companyName = name;
    if (type === 'article') {
      this.handleArticleList();
    } else {
      this.handleCoursewareList();
    }
    this.handleClose();
  };

  // 获取文章列表
  handleArticleList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'learning/fetch',
      payload: {
        type: '1',
        companyId: this.companyId,
      },
    });
    // 获取知识点树
    dispatch({
      type: 'learning/fetchTree',
      payload: {
        companyId: this.companyId,
      },
    });
  };

  // 获取课件列表
  handleCoursewareList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'learning/fetchCoursewareList',
      payload: {
        type: '2',
        companyId: this.companyId,
      },
    });
    // 获取知识点树
    dispatch({
      type: 'learning/fetchTree',
      payload: {
        companyId: this.companyId,
      },
    });
  };

  // 切换tab
  handleTabChange = key => {
    this.setState({ activeKey: key }, () => {
      router.push(`/training/learning/${key}/list`);
    });
  };

  // 渲染企业模态框
  renderModal() {
    const {
      learning: { modal },
      loading,
    } = this.props;
    const { visible } = this.state;
    return (
      <CompanyModal
        loading={loading}
        visible={visible}
        modal={modal}
        fetch={this.fetchCompany}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
      />
    );
  }

  render() {
    const { activeKey } = this.state;
    const {
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    return (
      <PageHeaderLayout
        title="学习管理"
        breadcrumbList={breadcrumbList}
        content={
          !companyId && (
            <div>
              <Input
                style={{ width: '300px' }}
                placeholder={'请选择单位'}
                value={this.companyName}
                onClick={this.handleFocus}
              />
            </div>
          )
        }
      >
        <Row gutter={16}>
          <Col>
            <Card>
              {this.companyId ? (
                <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
                  <TabPane tab="文章" key="article">
                    {activeKey === 'article' && (
                      <Article
                        handleArticleList={this.handleArticleList}
                        companyId={this.companyId}
                      />)}
                  </TabPane>
                  <TabPane tab="课件" key="courseware">
                    {activeKey === 'courseware' && (
                      <Courseware
                        handleCoursewareList={this.handleCoursewareList}
                        companyId={this.companyId}
                      />)}
                  </TabPane>
                </Tabs>
              ) : (
                  <div style={{ textAlign: 'center' }}>{'请先选择单位'}</div>
                )}
            </Card>
          </Col>
        </Row>
        {!companyId && this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
