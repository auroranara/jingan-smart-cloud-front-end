import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  List,
  Card,
  Row,
  Button,
  Icon,
  Tag,
  Form,
  Col,
  Input,
  Divider,
  Select,
  TreeSelect,
  Spin,
} from 'antd';
import moment from 'moment';

import styles from './Article.less';

const ListItem = List.Item;
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

// 默认表单值
const defaultFormData = {
  name: undefined,
  readStatus: undefined,
};

// 默认每页显示数量
const defaultPageSize = 10;

// 阅读状态选项
const statusRead = [{ value: '1', label: '未读' }, { value: '0', label: '已读' }];

// 知识点树
const treeData = data => {
  return data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.name} key={item.id} value={item.id}>
          {treeData(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.name} key={item.id} value={item.id} />;
  });
};

function getTime(t) {
  return moment(t).format('YYYY-MM-DD HH:mm:ss ');
}

@connect(({ learning, user, loading }) => ({
  learning,
  user,
  initLoading: loading.effects['learning/fetch'],
  moreLoading: loading.effects['learning/fetch'],
}))
@Form.create()
export default class ArticleList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  state = {
    knowledgeId: null, // 点击保存的知识点id
    value: [],
  };

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      dispatch,
      learning: {
        data: {
          pagination: { pageSize },
        },
      },
      companyId,
    } = this.props;
    // 获取文章列表
    dispatch({
      type: 'learning/fetch',
      payload: {
        pageSize,
        pageNum: 1,
        type: '1',
        status: '1', // 发布状态为1
        companyId,
      },
    });
  }

  // 跳转到详情页面
  goToDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/training/learning/article/detail/${id}`));
  };

  /**
   * 查询
   */
  handleArticleQuery = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      learning: {
        data: {
          pagination: { pageSize },
        },
      },
      companyId,
    } = this.props;
    const data = getFieldsValue();
    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    dispatch({
      type: 'learning/fetch',
      payload: {
        pageSize,
        pageNum: 1,
        type: '1', // 文章类型为1
        status: '1', // 发布状态为1
        companyId,
        ...data,
      },
    });
  };

  /**
   * 重置
   */
  handleArticleReset = () => {
    const {
      dispatch,
      form: { resetFields },
      learning: {
        data: {
          pagination: { pageSize },
        },
      },
      companyId,
    } = this.props;
    // 清除筛选条件
    resetFields();
    this.formData = defaultFormData;
    dispatch({
      type: 'learning/fetch',
      payload: {
        pageSize,
        pageNum: 1,
        type: '1', // 文章类型为1
        status: '1', // 发布状态为1
        companyId,
      },
    });
  };

  /**
   * 加载更多
   */
  handleLoadMore = () => {
    const {
      dispatch,
      companyId,
      form: { getFieldsValue },
      learning: {
        data: {
          pagination: { pageNum },
        },
      },
    } = this.props;
    const data = getFieldsValue();
    // 获取更多文章
    dispatch({
      type: 'learning/fetch',
      payload: {
        pageNum: pageNum + 1,
        pageSize: defaultPageSize,
        type: '1', // type=1文章
        status: '1', // 发布状态为1
        ...data,
        companyId,
      },
    });
  };

  /**
   * 点击知识点获取对应的课件
   */
  // handleSelectTree = value => {
  //   const { dispatch } = this.props;
  //   this.setState({ knowledgeId: value });
  //   dispatch({
  //     type: 'learning/fetch',
  //     payload: {
  //       pageNum: 1,
  //       pageSize: 5,
  //       type: '1',
  //       knowledgeId: value,
  //     },
  //   });
  // };

  // 渲染
  render() {
    const {
      initLoading,
      moreLoading,
      form: { getFieldDecorator },
      learning: {
        data: { list, isLast },
        treeData: { knowledgeList },
      },
    } = this.props;

    const treeList = treeData(knowledgeList);

    return (
      <div>
        <Row gutter={8}>
          <Form>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('name', {
                  initialValue: defaultFormData.name,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入文章标题" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('readStatus')(
                  <Select allowClear placeholder="请选择阅读状态">
                    {statusRead.map(({ value, label }) => (
                      <Option key={value} value={value}>
                        {label}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('knowledgeId')(
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    allowClear
                    placeholder="请选择知识点"
                    onSelect={this.handleSelectTree}
                  >
                    {treeList}
                  </TreeSelect>
                )}
              </FormItem>
            </Col>
          </Form>
          <Col span={4}>
            <FormItem>
              <Button type="primary" onClick={this.handleArticleQuery}>
                查询
              </Button>
              <Button
                type="primary"
                style={{ marginLeft: '10px' }}
                onClick={this.handleArticleReset}
              >
                重置
              </Button>
            </FormItem>
          </Col>
        </Row>

        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={list}
          loading={initLoading}
          loadMore={
            !isLast &&
            !initLoading && (
              <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
                {!moreLoading ? (
                  <Button onClick={this.handleLoadMore}>加载更多</Button>
                ) : (
                  <Spin spinning={moreLoading} />
                )}
              </div>
            )
          }
          renderItem={item => {
            const {
              id,
              name,
              knowledgeName,
              createTime,
              readStatus,
              totalRead,
              totalPerson,
            } = item;
            return (
              <ListItem key={id}>
                <Card className={styles.cardContainer}>
                  <div className={styles.firstLine}>
                    <div className={styles.title}>{name}</div>
                  </div>
                  <Tag className={styles.tags}>{knowledgeName}</Tag>
                  <Tag className={styles.tags} color={+readStatus === 0 ? 'blue' : 'grey'}>
                    {+readStatus === 0 ? '已读' : '未读'}
                  </Tag>
                  <div className={styles.introduction}>
                    <span className={styles.grey}>{' 发布于 '}</span>
                    <span>{getTime(createTime)}</span>
                  </div>
                  <div className={styles.statistics}>
                    <span>
                      <Icon className={styles.icon} type="eye" />
                      <span>{totalRead}</span>
                    </span>
                    <Divider type="vertical" />
                    <span>
                      <Icon className={styles.icon} type="user" />
                      <span>{totalPerson}</span>
                    </span>
                    <Divider type="vertical" />
                    <span>
                      <a style={{ width: '20px' }} onClick={() => this.goToDetail(id)}>
                        <Icon className={styles.icon} type="read" />
                        {'开始阅读'}
                      </a>
                    </span>
                  </div>
                </Card>
              </ListItem>
            );
          }}
        />
      </div>
    );
  }
}
