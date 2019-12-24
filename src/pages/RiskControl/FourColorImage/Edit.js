import { connect } from 'dva';
import React, { Fragment } from 'react';
import { Button, Row, Col, Form, Input, Card, Select, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { phoneReg } from '@/utils/validate';
import router from 'umi/router';
import styles from './TableList.less';
import Map from './Map';

const FormItem = Form.Item;

const title = '风险四色图管理';
//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '风险分级管控',
    name: '风险分级管控',
  },
  {
    title,
    name: '风险四色图管理',
    href: '/risk-control/four-color-image/list',
  },
];

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const itemStyles = {
  style: {
    width: 'calc(70%)',
    marginRight: '10px',
  },
};
@Form.create()
@connect(({ fourColorImage, user, loading }) => ({
  fourColorImage,
  user,
  loading: loading.models.fourColorImage,
}))
export default class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      detailList: {},
      points: [],
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    if (id) {
      dispatch({
        type: 'fourColorImage/fetchList',
        payload: {
          id,
          pageSize: 10,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          this.setState({ detailList: currentList });
        },
      });
    }
  }

  handleReset = e => {};

  renderDrawButton = () => {
    const { isDrawing } = this.state;
    return (
      <Fragment>
        <Button
          style={{ marginLeft: 40 }}
          onClick={() => {
            this.setState({ isDrawing: !isDrawing });
          }}
        >
          {!isDrawing ? '开始画' : '结束画'}
        </Button>
        <Button style={{ marginLeft: 10 }} onClick={this.handleReset}>
          重置
        </Button>
      </Fragment>
    );
  };

  goBack = () => {
    router.push('/risk-control/four-color-image/list');
  };

  // 获取地图上的坐标
  getPoints = points => {
    console.log('points', points);

    this.setState({ points });
  };

  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll },
      match: {
        params: { id },
      },
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { points } = this.state;

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const payload = {
          id,
          companyId,
          coordinate:
            points.length > 0
              ? JSON.stringify(points.map(({ x, y, z, groupID }) => ({ x, y, z, groupID })))
              : undefined,
          groupId: 1,
          ...values,
        };
        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };

        const error = () => {
          message.error(id ? '编辑失败' : '新增失败');
        };

        if (id) {
          dispatch({
            type: 'fourColorImage/fetchEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'fourColorImage/fetchAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  render() {
    const {
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
    } = this.props;

    const { isDrawing, detailList } = this.state;

    const editTitle = id ? '编辑' : '新增';

    const {
      zoneCode,
      zoneName,
      zoneLevel,
      zoneType,
      zoneCharger,
      phoneNumber,
      checkCircle,
    } = detailList;
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Card title="地图" bordered={false}>
              {this.renderDrawButton()}
              <Map isDrawing={isDrawing} onRef={this.onRef} getPoints={this.getPoints} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title={editTitle} bordered={false}>
              <FormItem label="区域编号" {...formItemLayout}>
                {getFieldDecorator('zoneCode', {
                  initialValue: zoneCode,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              <FormItem label="区域名称" {...formItemLayout}>
                {getFieldDecorator('zoneName', {
                  initialValue: zoneName,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              <FormItem label="风险分级" {...formItemLayout}>
                {getFieldDecorator('zoneLevel', {
                  initialValue: zoneLevel ? +zoneLevel : undefined,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Select placeholder="请选择" {...itemStyles} allowClear>
                    {['红', '橙', '黄', '蓝'].map((item, index) => (
                      <Select.Option key={index + 1} value={index + 1}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="所属图层" {...formItemLayout}>
                {getFieldDecorator('zoneType', {
                  initialValue: zoneType,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              <FormItem label="区域负责人" {...formItemLayout}>
                {getFieldDecorator('zoneCharger', {
                  initialValue: zoneCharger,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              <FormItem label="联系电话" {...formItemLayout}>
                {getFieldDecorator('phoneNumber', {
                  initialValue: phoneNumber,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: true, message: '请输入' },
                    { pattern: phoneReg, message: '联系电话格式不正确' },
                  ],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              <FormItem label="复评周期(月)" {...formItemLayout}>
                {getFieldDecorator('checkCircle', {
                  initialValue: checkCircle,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              {/* <FormItem label="关联内容" {...formItemLayout}>
                {getFieldDecorator('conetnt', {
                  initialValue: '',
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem> */}
              <FormItem {...formItemLayout}>
                <div style={{ textAlign: 'center' }}>
                  <Button style={{ marginRight: 10 }} onClick={this.handleSubmit}>
                    提交
                  </Button>
                  <Button href={'#/risk-control/four-color-image/list'}>返回</Button>
                </div>
              </FormItem>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
