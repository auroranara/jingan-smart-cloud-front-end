import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  List,
  Card,
  Row,
  Button,
  Tag,
  Select,
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
  readStatus: undefined,
};

// 学习状态选项
const statusStudy = [{ value: '1', label: '未学习' }, { value: '0', label: '已学习' }];

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
    // 获取课件列表
    dispatch({
      type: 'learning/fetchCoursewareList',
      payload: {
        pageSize,
        pageNum: 1,
        type: '2', // 课件类型为2
        status: '1', // 发布状态为1
        companyId,
      },
    });
  }

  // 跳转到详情
  goToDetail = id => {
    const { dispatch, companyId } = this.props;
    // dispatch(routerRedux.push(`/training/learning/courseware/detail/${id}?companyId=${companyId}`));
    window.open(`${window.publicPath}#/training/learning/courseware/detail/${id}?companyId=${companyId}`);
  };

  /**
   * 查询
   */
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
        type: '2', // 课件类型为2
        status: '1', // 发布状态为1
        companyId,
        ...query,
      },
    });
  };

  /**
   * 重置
   */
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
    // 重新请求
    dispatch({
      type: 'learning/fetchCoursewareList',
      payload: {
        pageSize,
        pageNum: 1,
        type: '2', // 课件类型为2
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
        type: '2', // 课件类型为2
        ...query,
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
      form: { getFieldDecorator },
      learning: {
        data: { list },
        treeData: { knowledgeList },
      },
    } = this.props;

    const treeList = treeData(knowledgeList);

    return (
      <div className={styles.learningCourseWare}>
        <Form>
          <Row gutter={8}>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('name', {
                  initialValue: defaultFormData.name,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入课件名称" />)}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('readStatus')(
                  <Select allowClear placeholder="请选择学习状态">
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
                        moment('23:59:59', 'HH:mm:ss'),
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
        </Form>

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
                    <span className={styles.grey}>{' 创建于 '}</span>
                    <span>{getTime(createTime)}</span>
                  </div>
                  <div className={styles.statistics}>
                    <span>
                      <LegacyIcon className={styles.icon} type="eye" />
                      <span>{totalRead}</span>
                    </span>
                    <Divider type="vertical" />
                    <span>
                      <LegacyIcon className={styles.icon} type="user" />
                      <span>{totalPerson}</span>
                    </span>
                    <Divider type="vertical" />
                    <span>
                      <a style={{ width: '20px' }} onClick={() => this.goToDetail(id)}>
                        <LegacyIcon className={styles.icon} type="read" />
                        {'开始学习'}
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
