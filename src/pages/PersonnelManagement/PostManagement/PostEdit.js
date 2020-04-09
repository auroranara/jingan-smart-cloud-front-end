import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, message, Radio, Input, TimePicker } from 'antd';
import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import moment from 'moment';
import styles from './PostList.less';

import helmet1 from './imgs/helmet-1.png';
import helmet2 from './imgs/helmet-2.png';
import helmet3 from './imgs/helmet-3.png';
import helmet4 from './imgs/helmet-4.png';
import helmet5 from './imgs/helmet-5.png';
import helmet6 from './imgs/helmet-6.png';

// 标题
const addTitle = '新增岗位';
const editTitle = '编辑岗位';
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: '70%', marginRight: '10px' } };
const mapIcons = [
  { key: '1', value: helmet1 },
  { key: '2', value: helmet2 },
  { key: '3', value: helmet3 },
  { key: '4', value: helmet4 },
  { key: '5', value: helmet5 },
  { key: '6', value: helmet6 },
];

// 上传文件地址

@connect(({ postManagement, loading, user }) => ({
  postManagement,
  user,
  loading: loading.models.postManagement,
}))
@Form.create()
export default class PostEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      detailList: {}, // 当前详情列表
      startTime: undefined,
      endTime: undefined,
    };
  }

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
    } = this.props;
    if (id) {
      // 获取岗位列表
      dispatch({
        type: 'postManagement/fetchPostDetail',
        payload: { id },
        callback: res => {
          const {
            data: { jobName, jobSite, startTime, endTime, iconID },
          } = res;
          setFieldsValue({
            jobName,
            jobSite,
            iconID,
          });
          this.setState({
            startTime: startTime && moment(startTime),
            endTime: endTime && moment(endTime),
          });
        },
      });
    }
  }

  // 返回
  goBack = () => {
    router.goBack();
  };

  goPostList = () => {
    const {
      match: {
        params: { unitId },
      },
    } = this.props;
    router.push(`/personnel-management/post-management/${unitId}/list`);
  };

  // 去除左右两边空白
  handleTrim = e => e.target.value.trim();

  // 提交
  handleSubmit = () => {
    const {
      dispatch,
      match: {
        params: { id, unitId: companyId },
      },
      form: { validateFieldsAndScroll, setFields },
    } = this.props;

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { startTime, endTime } = this.state;
        if ((!startTime && endTime) || (!endTime && startTime)) {
          setFields({
            time: {
              value: undefined,
              errors: [new Error('请选择' + (!startTime ? '开始时间' : '结束时间'))],
            },
          });
          return;
        } else {
          setFields({ time: { value: undefined } });
        }
        this.setState({ submitting: true });
        const payload = {
          companyId,
          ...values,
          startTime,
          endTime,
        };

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goPostList());
          this.setState({ submitting: false });
        };

        const error = () => {
          message.success(id ? '编辑失败' : '新增失败');
          this.setState({ submitting: false });
        };

        if (id) {
          dispatch({
            type: 'postManagement/fetchPostEdit',
            payload: {
              id,
              ...payload,
            },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'postManagement/fetchPostAdd',
            payload: {
              ...payload,
            },
            success,
            error,
          });
        }
      }
    });
  };

  onTimeChange = ({ time, order = 0 }) => {
    const {
      form: { setFields },
    } = this.props;
    const { startTime } = this.state;
    this.setState({ [order === 0 ? 'startTime' : 'endTime']: time });
    if (order === 1 && !time) {
      setFields({
        time: {
          value: undefined,
        },
      });
    }
    if (order === 1 && time && !startTime) {
      setFields({
        time: {
          value: undefined,
          errors: [new Error('请选择开始时间')],
        },
      });
    }
  };

  /* 渲染详情 */
  renderDetail() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { submitting, startTime, endTime } = this.state;

    return (
      <Card bordered={false}>
        <Form>
          <Form.Item label="岗位名称" {...formItemLayout}>
            {getFieldDecorator('jobName', {
              rules: [{ required: true, message: '请输入岗位名称', whitespace: true }],
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入岗位名称" maxLength={100} {...itemStyles} />)}
          </Form.Item>
          <Form.Item label="岗位地点" {...formItemLayout}>
            {getFieldDecorator('jobSite', {
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入岗位地点" maxLength={100} {...itemStyles} />)}
          </Form.Item>
          <Form.Item label="岗位时间" {...formItemLayout}>
            {getFieldDecorator('time', {})(
              <div {...formItemLayout}>
                <TimePicker
                  format={'HH:mm'}
                  onChange={time => this.onTimeChange({ time, order: 0 })}
                  value={startTime}
                />
                ~
                <TimePicker
                  format={'HH:mm'}
                  onChange={time => this.onTimeChange({ time, order: 1 })}
                  value={endTime}
                />
              </div>
            )}
          </Form.Item>
          <Form.Item label="地图上展示图标" {...formItemLayout}>
            {getFieldDecorator('iconID', {
              rules: [{ required: true, message: '请选择地图上展示图标' }],
            })(
              <Radio.Group {...itemStyles}>
                {mapIcons.map(({ key, value }) => (
                  <Radio key={key} value={key}>
                    <div className={styles.stylesImg}>
                      <img src={value} alt="" />
                      <div className={styles.label}>{key}</div>
                    </div>
                  </Radio>
                ))}
              </Radio.Group>
            )}
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Button onClick={this.goBack} style={{ marginRight: '24px' }}>
            返回
          </Button>
          <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
            确定
          </Button>
        </div>
      </Card>
    );
  }

  render() {
    const {
      match: {
        params: { id, unitId: companyId },
      },
      user: {
        currentUser: { unitType },
      },
      location: {
        query: { companyList },
      },
    } = this.props;
    const title = id ? editTitle : addTitle;

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '人员在岗在位管理',
        name: '人员在岗在位管理',
      },
      ...(unitType === 4
        ? []
        : [
            {
              title: '企业列表',
              name: '企业列表',
              href: '/personnel-management/post-management/company-list',
            },
          ]),
      ...(companyList
        ? []
        : [
            {
              title: '岗位信息列表',
              name: '岗位信息列表',
              href: `/personnel-management/post-management/${companyId}/list`,
            },
          ]),
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderDetail()}
      </PageHeaderLayout>
    );
  }
}
