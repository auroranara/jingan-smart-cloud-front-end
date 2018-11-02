import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Form,
  Input,
  Button,
  Card,
  Col,
  Switch,
  Select,
  // message,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './IllegalDatabase.less';

const FormItem = Form.Item;
const { TextArea } = Input;

// 编辑页面标题
const editTitle = '编辑违法行为库';
// 添加页面标题
const addTitle = '新增违法行为库';

// 表单标签
const fieldLabels = {
  businessClassify: '所属业务分类',
  lawsRegulations: '所属法律法规',
  subClause: '所属条款',
  lawsRegulationsInput: '法律法规内容',
  isUse: '是否启用',
};

@connect(({ lawDatabase, user, loading }) => ({
  lawDatabase,
  user,
  loading: loading.models.lawDatabase,
}))
@Form.create()
export default class IllegalDatabaseEdit extends PureComponent {
  state = {};

  // 返回到列表页面
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/law-enforcement/illegal/list`));
  };

  // 挂载后
  componentDidMount() {
    // const {
    //   dispatch,
    //   match: {
    //     params: { id },
    //   },
    // } = this.props;
    // if (id) {
    //   // 根据id获取详情
    //   dispatch({
    //     type: 'lawDatabase/',
    //     payload: {
    //       id,
    //     },
    //   });
    // } else {
    //   // 清空详情
    //   dispatch({
    //     type: 'lawDatabase/clearDetail',
    //   });
    // }
  }

  // 获取所属业务和法律法规

  // 点击提交按钮验证表单信息
  handleClickValidate = () => {
    // const {
    //   form: { validateFieldsAndScroll },
    //   match: {
    //     params: { id },
    //   },
    //   dispatch,
    // } = this.props;
    // validateFieldsAndScroll((error, values) => {
    //   if (!error) {
    //     this.setState({
    //       submitting: true,
    //     });
    //     const {
    //       businessClassify,
    //       lawsRegulations,
    //       subClause,
    //       lawsRegulationsInput,
    //       isUse,
    //     } = values;
    //     const payload = {
    //       id,
    //       businessClassify,
    //       lawsRegulations,
    //       subClause,
    //       lawsRegulationsInput,
    //       isUse:+isUse,
    //     };
    //     const success = () => {
    //       const msg = id ? '编辑成功' : '新增成功';
    //       message.success(msg,1,this.goBack());
    //     };
    //     const error = () => {
    //       const msg = id ? '编辑失败' : '新增失败';
    //       message.error(msg, 1);
    //       this.setState({
    //         submitting: false,
    //       });
    //     };
    //     // 如果id存在的话，为编辑
    //     if (id) {
    //       dispatch({
    //         type: 'lawDatabase/update',
    //         payload: {
    //           id,
    //           ...payload,
    //         },
    //         success,
    //         error,
    //       });
    //     }
    //     // 不存在id,则为新增
    //     else {
    //       dispatch({
    //         type: 'lawDatabase/fetch',
    //         payload,
    //         success,
    //         error,
    //       });
    //     }
    //   }
    // });
  };

  // 渲染信息
  renderLawsInfo() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <Card className={styles.card} bordered={false}>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={fieldLabels.businessClassify}>
            <Col span={24}>
              {getFieldDecorator('businessClassify', {
                // initialValue:
                rules: [
                  {
                    required: true,
                    message: '请选择业务分类',
                  },
                ],
              })(<Select placeholder="请选择业务分类">{}</Select>)}
            </Col>
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.lawsRegulations}>
            {getFieldDecorator('lawsRegulations', {
              // initialValue:
              rules: [
                {
                  required: true,
                  message: '请选择法律法规',
                },
              ],
            })(<Select placeholder="请选择法律法规" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.subClause}>
            {getFieldDecorator('subClause', {
              rules: [
                {
                  required: true,
                  message: '请输入所属条款',
                },
              ],
            })(<Input placeholder="请输入所属条款" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.lawsRegulationsInput}>
            {getFieldDecorator('lawsRegulationsInput', {
              rules: [{ required: true, message: '请输入法律法规内容', whitespace: true }],
            })(<TextArea rows={4} placeholder="请输入法律法规内容" maxLength="2000" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.isUse}>
            {getFieldDecorator('isUse', {
              valuePropName: 'checked',
              // initialValue: !!isUse,
            })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
          </FormItem>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Button type="primary" size="large" onClick={this.handleClickValidate}>
            提交
          </Button>
        </div>
      </Card>
    );
  }

  // 渲染页面所有信息
  render() {
    const {
      match: {
        params: { id },
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
        title: '执法检查',
        name: '执法检查',
      },
      {
        title: '违法行为库',
        name: '违法行为库',
        href: '/law-enforcement/illegal/list',
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderLawsInfo()}
      </PageHeaderLayout>
    );
  }
}
