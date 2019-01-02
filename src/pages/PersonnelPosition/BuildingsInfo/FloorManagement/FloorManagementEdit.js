import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Col, Select } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from '../BuildingsInfo.less';

const FormItem = Form.Item;
const { Option } = Select;

// 编辑页面标题
const editTitle = '编辑楼层';
// 添加页面标题
const addTitle = '新增楼层';

// 表单标签
const fieldLabels = {
  floorName: '楼层名称',
  floorNum: '楼层编号',
  floorPic: '楼层平面图',
};

@connect(({ buildingsInfo, user, loading }) => ({
  buildingsInfo,
  user,
  loading: loading.models.buildingsInfo,
}))
@Form.create()
export default class FloorManagementEdit extends PureComponent {
  state = {
    submitting: false,
  };

  // 返回到列表页面
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(``));
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
    //     type: 'buildingsInfo/fetchLawsDetail',
    //     payload: {
    //       id,
    //     },
    //   });
    // } else {
    //   // 清空详情
    //   dispatch({
    //     type: 'buildingsInfo/clearDetail',
    //   });
    // }
    // // 获取初始化选项
    // dispatch({
    //   type: 'buildingsInfo/fetchOptions',
    // });
  }

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  // 点击提交按钮验证表单信息
  handleClickValidate = () => {};

  // 渲染信息
  renderLawsInfo() {
    const {
      form: { getFieldDecorator },
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
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label={fieldLabels.floorName}>
            <Col span={24}>
              {getFieldDecorator('floorName', {
                rules: [
                  {
                    required: true,
                    message: '请输入楼层名称',
                  },
                ],
              })(<Input placeholder="请输入楼层名称" />)}
            </Col>
          </FormItem>

          <FormItem {...formItemLayout} label={fieldLabels.floorNum}>
            {getFieldDecorator('floorNum', {
              rules: [
                {
                  required: true,
                  message: '请选择楼层编号',
                },
              ],
            })(
              <Select placeholder="请选择楼层编号">
                {[].map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label={fieldLabels.floorNum}>
            {getFieldDecorator('floorNum', {
              rules: [
                {
                  required: true,
                  message: '请选择楼层编号',
                },
              ],
            })(
              <Select placeholder="请选择楼层编号">
                {[].map(item => (
                  <Option value={item.id} key={item.id}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            )}
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
        title: '楼层管理列表',
        name: '楼层管理列表',
      },
      {
        title,
        name: '新增楼层',
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderLawsInfo()}
      </PageHeaderLayout>
    );
  }
}
