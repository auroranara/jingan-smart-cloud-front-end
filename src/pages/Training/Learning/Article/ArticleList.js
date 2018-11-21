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
} from 'antd';
import moment from 'moment';

import styles from './Article.less';

const ListItem = List.Item;
const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;

// 默认表单值
const defaultFormData = {
  title: undefined,
};

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

@connect(({ learning }) => ({
  learning,
}))
@Form.create()
export default class ArticleList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }
  state = {
    knowledgeId: null, // 点击保存的知识点id
    selectedKeys: [],
  };

  // 跳转到详情页面
  goToDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/training/learning/article/detail/${id}`));
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      learning: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 获取文章列表
    dispatch({
      type: 'learning/fetch',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
    // 获取知识点树
    dispatch({
      type: 'learning/fetchTree',
    });
  }

  // 查询
  handleArticleQuery = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      learning: {
        data: {
          pagination: { pageSize },
        },
      },
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
        ...data,
      },
    });
  };

  // 重置
  handleArticleReset = () => {
    const {
      dispatch,
      form: { resetFields },
      learning: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 清除筛选条件
    resetFields();
    this.formData = defaultFormData;
    dispatch({
      type: 'learning/fetch',
      payload: {
        pageSize,
        pageNum: 1,
      },
    });
  };

  // 点击知识点
  handleSelectTree = keys => {
    const { dispatch } = this.props;
    const [selected] = keys;
    this.setState({ knowledgeId: selected, selectedKeys: keys });
    dispatch({
      type: 'learning/fetch',
      payload: {
        pageNum: 1,
        pageSize: 5,
        knowledgeId: selected,
      },
    });
  };

  // 渲染
  render() {
    const {
      form: { getFieldDecorator },
      learning: {
        data: { list },
        treeData: { knowledgeList },
      },
    } = this.props;

    const treeList = treeData(knowledgeList);

    const { selectedKeys } = this.state;

    return (
      <div>
        <Row gutter={8}>
          <Form>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('title', {
                  initialValue: defaultFormData.title,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入文章标题" />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择阅读状态">
                    <Option value="已读">已读</Option>
                    <Option value="未读">未读</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('knowledge')(
                  <TreeSelect
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    selectedKeys={selectedKeys}
                    allowClear
                    placeholder="请选择知识点"
                    onSelect={this.handleSelectTree}
                  >
                    >{treeList}
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
          renderItem={item => {
            const { id, name, knowledgeId, createTime, status, totalRead, totalPerson } = item;
            return (
              <ListItem key={id}>
                <Card className={styles.cardContainer}>
                  <div className={styles.firstLine}>
                    <div className={styles.title}>{name}</div>
                  </div>
                  <Tag className={styles.tags}>{knowledgeId}</Tag>
                  <Tag className={styles.tags} color={+status === 0 ? 'blue' : 'grey'}>
                    {+status === 0 ? '已读' : '未读'}
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
