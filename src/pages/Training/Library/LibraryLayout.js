import React, { PureComponent } from 'react';
import { Card, Row, Col, Tabs, Tree, Spin, AutoComplete, Form, Select } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Questions from './Questions/QuestionsList';
import Article from './Article/ArticleList';
import Courseware from './Courseware/CoursewareList';
import debounce from 'lodash/debounce';
import styles from './LibraryLayout.less';

const { TabPane } = Tabs;
const { TreeNode } = Tree;
const FormItem = Form.Item;
const { Option } = Select;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '培训', name: '培训' },
  { title: '题库', name: '题库' },
];

// tabs配置
const tabsInfo = [
  { label: '试题', key: 'questions' },
  { label: '文章', key: 'article' },
  { label: '课件', key: 'courseware' },
];

@Form.create()
@connect(({ resourceManagement, user, loading }) => ({
  resourceManagement,
  user,
  treeLoading: loading.effects['resourceManagement/fetchKnowledgeTree'],
}))
export default class LibraryLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null, // 当前tabs的值
      knowledgeId: null, // 点击保存的知识点id
      companyId: null, // 所属单位
      selectedKeys: [],
    };
    this.onSearchUnits = debounce(this.onSearchUnits, 800);
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

  // 切换tab
  handleTabChange = key => {
    this.setState({ activeKey: key }, () => {
      router.push(`/training/library/${key}/list`);
    });
  };

  // 单位下拉框失焦
  handleUnitIdBlur = () => {
    const {
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const value = getFieldValue('unitId');

    // 搜索后没有选择就清空所属单位
    if (value && value.key === value.label) {
      setFieldsValue({ unitId: undefined });
    }
  };

  // 模糊查询单位列表
  onSearchUnits = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'resourceManagement/fetchUnitByName',
      payload: {
        unitName: value && value.trim(),
      },
    });
  };

  // 选择所属单位
  handleUnitIdChange = value => {
    const { dispatch } = this.props;
    const { activeKey } = this.state;
    // 如果输入了搜索内容，则返回
    if (!value || value.key === value.label) return;
    this.setState({ companyId: value.key, selectedKeys: [], knowledgeId: null });
    // 更新知识点树
    dispatch({
      type: 'resourceManagement/fetchKnowledgeTree',
      payload: {
        companyId: value.key,
      },
    });
    if (activeKey === 'questions') {
      // 清空试题筛选数据
      this.refs.questions && this.refs.questions.resetFields();
      // 获取试题列表
      dispatch({
        type: 'resourceManagement/fetchQuestions',
        payload: {
          pageNum: 1,
          pageSize: 5,
          companyId: value.key,
        },
      });
    } else if (activeKey === 'article') {
      this.refs.questions && this.refs.article.resetFields();
    } else if (activeKey === 'courseware') {
      this.refs.questions && this.refs.courseware.resetFields();
    }
  };

  // 点击知识点
  handleSelectTree = keys => {
    const { activeKey, companyId } = this.state;
    const {
      dispatch,
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const [selected] = keys;
    this.setState({ knowledgeId: selected, selectedKeys: keys });
    if (activeKey === 'questions') {
      // 获取试题列表 Tips：user为政府人员需要传companyId，来看所有试题
      dispatch({
        type: 'resourceManagement/fetchQuestions',
        payload: {
          pageNum: 1,
          pageSize: 5,
          knowledgeId: selected,
          companyId: unitType === 2 ? companyId : null,
        },
      });
    } else if (activeKey === 'article') {
      // console.log('article');
    } else if (activeKey === 'courseware') {
      // console.log('courseware');
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

  render() {
    const {
      form: { getFieldDecorator },
      resourceManagement: { units },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const { activeKey, knowledgeId, companyId } = this.state;
    const data = { knowledgeId, companyId, unitType };
    return (
      <PageHeaderLayout
        title="题库"
        breadcrumbList={breadcrumbList}
        content={
          <Form className={styles.libraryLayoutForm}>
            <FormItem>
              {getFieldDecorator('unitId')(
                <AutoComplete
                  labelInValue
                  mode="combobox"
                  optionLabelProp="children"
                  placeholder="请选择所属单位"
                  notFoundContent={/* loading ? <Spin size="small" /> : */ '暂无数据'}
                  onSearch={this.onSearchUnits}
                  onBlur={this.handleUnitIdBlur}
                  onChange={this.handleUnitIdChange}
                  filterOption={false}
                  style={{ width: 230 }}
                >
                  {units.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </AutoComplete>
              )}
            </FormItem>
          </Form>
        }
      >
        <Row gutter={16}>
          <Col span={6}>
            <Card title="知识点">{this.renderTree()}</Card>
          </Col>
          <Col span={18}>
            <Card>
              <Tabs activeKey={activeKey} animated={false} onChange={this.handleTabChange}>
                {tabsInfo.map(item => (
                  <TabPane tab={item.label} key={item.key}>
                    {(activeKey === 'questions' && <Questions ref="questions" {...data} />) ||
                      (activeKey === 'article' && <Article ref="article" {...data} />) ||
                      (activeKey === 'courseware' && <Courseware ref="courseware" {...data} />)}
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
