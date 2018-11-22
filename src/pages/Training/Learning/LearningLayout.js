import React, { PureComponent } from 'react';
import { Card, Row, Col, Tabs, Input, Form } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Courseware from './Courseware/CoursewareList';
import Article from './Article/ArticleList';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '教育培训', name: '教育培训' },
  { title: '学习管理', name: '学习管理' },
];

// tabs配置
const tabsInfo = [{ label: '文章', key: 'article' }, { label: '课件', key: 'courseware' }];

const PAGE_SIZE = 10;
@connect(({ learning, user, loading }) => ({
  user,
  learning,
  loading: loading.models.knowledgeTree,
}))
export default class LearningLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      visible: false,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { type = 'article' },
      },
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const payload = { pageSize: PAGE_SIZE, pageNum: 1 };
    if (!companyId) this.fetchCompany({ payload });
    this.fetchCompany({ payload });

    this.setState({ activeKey: type });
  }

  // 获取企业
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'learning/fetchCompanies', payload });
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

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
  };

  // 切换tab
  handleTabChange = key => {
    this.setState({ activeKey: key }, () => {
      router.push(`/training/learning/${key}/list`);
    });
    this.companyName = undefined;
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
            <FormItem>
              <Input
                onClick={() => {
                  this.setState({ visible: true });
                }}
                style={{ width: '300px', cursor: 'pointer' }}
                placeholder={'请选择企业'}
                value={this.companyName}
              />
            </FormItem>
          )
        }
      >
        <Row gutter={16}>
          <Col>
            <Card>
              <Tabs activeKey={activeKey} onChange={this.handleTabChange}>
                {tabsInfo.map(item => (
                  <TabPane tab={item.label} key={item.key}>
                    {(activeKey === 'courseware' && (
                      <Courseware handleCoursewareList={this.handleCoursewareList} />
                    )) ||
                      (activeKey === 'article' && (
                        <Article handleArticleList={this.handleArticleList} />
                      ))}
                  </TabPane>
                ))}
              </Tabs>
            </Card>
          </Col>
        </Row>
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
