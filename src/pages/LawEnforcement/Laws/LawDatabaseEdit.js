import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Col, Switch, Select, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './LawDatabase.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

// 编辑页面标题
const editTitle = '编辑法律法规';
// 添加页面标题
const addTitle = '新增法律法规';

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
export default class LawDatabaseEdit extends PureComponent {
  state = {
    submitting: false,
  };

  // 返回到列表页面
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/law-enforcement/laws/list`));
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    if (id) {
      // 根据id获取详情
      dispatch({
        type: 'lawDatabase/fetchLawsDetail',
        payload: {
          id,
        },
      });
    } else {
      // 清空详情
      dispatch({
        type: 'lawDatabase/clearDetail',
      });
    }
    // 获取初始化选项
    dispatch({
      type: 'lawDatabase/fetchOptions',
    });
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  // 点击提交按钮验证表单信息
  handleClickValidate = () => {
    const {
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });
        const { businessType, lawType, article, content, status } = values;
        const payload = {
          id,
          businessType,
          lawType,
          article,
          content,
          status: +status,
        };
        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };
        const error = () => {
          const msg = id ? '编辑失败' : '新增失败';
          message.error(msg, 1);
          this.setState({
            submitting: false,
          });
        };
        // 如果id存在的话，为编辑
        if (id) {
          dispatch({
            type: 'lawDatabase/editLaws',
            payload: {
              id,
              ...payload,
            },
            success,
            error,
          });
        }
        // 不存在id,则为新增
        else {
          dispatch({
            type: 'lawDatabase/insertLaws',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  // 渲染信息
  renderLawsInfo() {
    const {
      form: { getFieldDecorator },
      lawDatabase: {
        detail: { businessType, lawType, article, content, status },
        businessTypes,
        lawTypes,
      },
    } = this.props;

    const { submitting } = this.state;

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
              {getFieldDecorator('businessType', {
                initialValue: businessType,
                rules: [
                  {
                    required: true,
                    message: '请选择业务分类',
                  },
                ],
              })(
                <Select placeholder="请选择业务分类">
                  {businessTypes.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </Col>
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.lawsRegulations}>
            {getFieldDecorator('lawType', {
              initialValue: lawType,
              rules: [
                {
                  required: true,
                  message: '请选择法律法规',
                },
              ],
            })(
              <Select placeholder="请选择法律法规">
                {lawTypes.map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.subClause}>
            {getFieldDecorator('article', {
              initialValue: article,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入所属条款',
                  whitespace: true,
                },
              ],
            })(<Input placeholder="请输入所属条款" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.lawsRegulationsInput}>
            {getFieldDecorator('content', {
              initialValue: content,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入法律法规内容', whitespace: true }],
            })(<TextArea rows={4} placeholder="请输入法律法规内容" maxLength="2000" />)}
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.isUse}>
            {getFieldDecorator('status', {
              valuePropName: 'checked',
              initialValue: +status,
            })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
          </FormItem>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            loading={submitting}
            size="large"
            onClick={this.handleClickValidate}
          >
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
        title: '法律法规库',
        name: '法律法规库',
        href: '/law-enforcement/laws/list',
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
