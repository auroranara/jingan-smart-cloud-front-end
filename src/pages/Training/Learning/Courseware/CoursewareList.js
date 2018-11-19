import React, { PureComponent } from 'react';
import { connect } from 'dva';
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
} from 'antd';
// import moment from 'moment';

import styles from './Courseware.less';

const ListItem = List.Item;
const FormItem = Form.Item;
const Option = Select.Option;

// 筛选栏grid配置
const colWrapper = {
  xl: 8,
  md: 12,
  sm: 24,
  xs: 24,
};

// 默认表单值
const defaultFormData = {
  title: undefined,
};

// function getTime(t) {
//   return moment(t).format('YYYY-MM-DD HH:mm:ss ');
// }

const data = [
  {
    title: '消防应急操作指南指导消防应急操作指南指导 ',
    id: '001',
  },
  {
    title: '消防应急操作指南指导fsdfvsd',
    status: '已学习',
    id: '002',
  },
  {
    title: '消防应急操作指南指导东方闪电',
    id: '003',
  },
];

@connect(({ learning }) => ({
  learning,
}))
@Form.create()
export default class CoursewareList extends PureComponent {
  constructor(props) {
    super(props);
    this.formData = defaultFormData;
  }

  // 挂载后
  // componentDidMount() {
  //   const {
  //     dispatch,
  //     learning: {
  //       data: {
  //         pagination: { pageSize },
  //       },
  //     },
  //   } = this.props;
  //   // 获取文章列表
  //   dispatch({
  //     type: 'learning/fetch',
  //     payload: {
  //       pageSize,
  //       pageNum: 1,
  //     },
  //   });
  // }

  /* 查询按钮点击事件 */
  handleQuery = () => {
    const {
      form: { getFieldsValue },
      learning: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;

    const data = getFieldsValue();
    const { releaseTime, ...restValues } = data;
    const time = releaseTime && releaseTime.length > 0 ? releaseTime[0] : undefined;

    // 修改表单数据
    this.formData = data;
    // 重新请求数据
    this.props.dispatch({
      type: 'learning/fetch',
      payload: {
        ...restValues,
        startTime: time && time.format('YYYY/M/D HH:mm:ss'),
        pageSize,
        pageNum: 1,
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

  // 渲染
  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <div>
        <Row gutter={8}>
          <Form>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('title', {
                  initialValue: defaultFormData.title,
                  getValueFromEvent: e => e.target.value.trim(),
                })(<Input placeholder="请输入视频名称" />)}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('status')(
                  <Select placeholder="请选择发布状态">
                    <Option value="已发布">已发布</Option>
                    <Option value="未发布">未发布</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('releaseTime')(
                  <DatePicker
                    style={{ width: 340 }}
                    format="YYYY-MM-DD HH:mm:ss"
                    placeholder="请选择发布时间"
                    showTime
                  />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem>
                {getFieldDecorator('knowledge')(<Select placeholder="请选择知识点" />)}
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
          dataSource={data}
          renderItem={item => {
            const { title, status } = item;
            // const { title, status, time, view, user } = item;
            return (
              <ListItem>
                <Card className={styles.cardContainer}>
                  <div className={styles.firstLine}>
                    <div className={styles.title}>{title}</div>
                  </div>
                  <Tag className={styles.tags}>知识点一</Tag>
                  <Tag className={styles.tags} color={status ? 'blue' : 'grey'}>
                    {item.status ? '已学习' : '未学习'}
                  </Tag>
                  <div className={styles.introduction}>
                    <span className={styles.grey}>{' 发布于 '}</span>
                    {/* <span>{getTime(time)}</span> */}
                    <span>2018-11-11 13:00:00</span>
                  </div>
                  <div className={styles.statistics}>
                    <span>
                      <Icon className={styles.icon} type="eye" />
                      {/* <span>{item.view}</span> */}
                      {'1111'}
                    </span>
                    <Divider type="vertical" />
                    <span>
                      <Icon className={styles.icon} type="user" />
                      {/* <span>{item.user}</span> */}
                      {'1111'}
                    </span>
                    <Divider type="vertical" />
                    <span>
                      <a style={{ width: '20px' }} href="#/training/learning/courseware/detail">
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
