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
  Select,
  Form,
  Col,
  Input,
  Divider,
  DatePicker,
  TreeSelect,
} from 'antd';
import moment from 'moment';

import styles from './Courseware.less';

const ListItem = List.Item;
const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const TreeNode = TreeSelect.TreeNode;

// 筛选栏grid配置
const colWrapper = {
  xl: 8,
  md: 12,
  sm: 24,
  xs: 24,
};

// 默认表单值
const defaultFormData = {
  name: undefined,
};

// 发布状态选项
const statusStudy = [{ value: '1', label: '发布' }, { value: '0', label: '未发布' }];

function getTime(t) {
  return moment(t).format('YYYY-MM-DD HH:mm:ss ');
}

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

@connect(({ learning, user, loading }) => ({
  learning,
  user,
  initLoading: loading.effects['learning/fetchCoursewareList'],
  moreLoading: loading.effects['learning/fetchCoursewareList'],
}))
@Form.create()
export default class CoursewareList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      learning: {
        data: {
          pagination: { pageSize },
        },
      },
      // companyId,
    } = this.props;
    // 获取文章列表
    dispatch({
      type: 'learning/fetchCoursewareList',
      payload: {
        pageSize,
        pageNum: 1,
        type: '2',
        // companyId,
      },
    });
  }

  // 跳转到详情
  goToDetail = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/training/learning/courseware/detail/${id}`));
  };

  /* 查询按钮点击事件 */
  handleQuery = () => {
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
    const { timeRange: [start, end] = [], ...others } = getFieldsValue();
    const query = {
      ...others,
      startTime: start && moment(start).format('YYYY-MM-DD HH:mm:ss.SSS'),
      endTime: end && moment(end).format('YYYY-MM-DD HH:mm:ss.SSS'),
    };
    // 重新请求数据
    dispatch({
      type: 'learning/fetchCoursewareList',
      payload: {
        pageNum: 1,
        pageSize,
        type: '2',
        companyId,
        ...query,
      },
    });
  };

  /* 重置按钮点击事件 */
  handleReset = () => {
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
      type: 'learning/fetchCoursewareList',
      payload: {
        pageSize,
        pageNum: 1,
        type: '2',
        companyId,
      },
    });
  };

  // 点击加载更多
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
    const { timeRange: [start, end] = [], ...others } = getFieldsValue();
    const query = {
      ...others,
      startTime: start && moment(start).format('YYYY-MM-DD HH:mm:ss.SSS'),
      endTime: end && moment(end).format('YYYY-MM-DD HH:mm:ss.SSS'),
    };
    // 获取更多课件
    dispatch({
      type: 'learning/fetchCoursewareList',
      payload: {
        pageNum: pageNum + 1,
        pageSize: 10,
        type: '2', // type 2课件
        ...query,
        companyId,
      },
    });
  };

  // 点击知识点获取对应的课件
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
      form: { getFieldDecorator },
      learning: {
        data: { list },
        treeData: { knowledgeList },
      },
    } = this.props;

    const treeList = treeData(knowledgeList);

    return (
      <div>
        <Row gutter={8}>
          <Form>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('name', {
                  initialValue: defaultFormData.name,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入视频名称" />)}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('status')(
                  <Select allowClear placeholder="请选择发布状态">
                    {statusStudy.map(({ value, label }) => (
                      <Option key={value} value={value}>
                        {label}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('timeRange')(
                  <RangePicker
                    showTime={{
                      hideDisabledOptions: true,
                      defaultValue: [
                        moment('00:00:00', 'HH:mm:ss'),
                        moment('11:59:59', 'HH:mm:ss'),
                      ],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: '100%' }}
                  />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
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
          <Col {...colWrapper}>
            <FormItem>
              <Button type="primary" onClick={this.handleQuery}>
                查询
              </Button>
              <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleReset}>
                重置
              </Button>
            </FormItem>
          </Col>
        </Row>

        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              name,
              knowledgeName,
              readStatus,
              createTime,
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
                    {+readStatus === 0 ? '已学习' : '未学习'}
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
                        {'开始学习'}
                      </a>
                    </span>
                    ,
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
