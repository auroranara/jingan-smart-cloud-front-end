import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, DatePicker, Form, Input, message, Col } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import CompanyModal from '../../BaseInfo/Company/CompanyModal';

const { Item: FormItem } = Form;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '设备管理', name: '设备管理' },
  {
    title: '用户传输装置',
    name: '用户传输装置',
    href: '/device-management/user-transmission-device/list',
  },
  { title: '新增', name: '新增' },
];

const PAGE_SIZE = 10;
// const MODAL_WIDTH = 800;
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
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 10,
    },
  },
};

// const COLUMNS = [
//   {
//     title: '企业名称',
//     dataIndex: 'name',
//     key: 'name',
//   },
// ];

function dispatchCallback(code, successMsg, failMsg, msg) {
  if (code === 200) {
    message.success(successMsg);
    router.push('/device-management/user-transmission-device/list');
  } else message.error(msg ? `${failMsg} ${msg}` : failMsg);
}

@connect(({ transmission, videoMonitor, user, loading }) => ({
  transmission,
  user,
  videoMonitor,
  loading: loading.effects['videoMonitor/fetchModelList'],
}))
@Form.create()
export default class TransmissionAdd extends PureComponent {
  state = { visible: false };

  componentDidMount() {
    const payload = { pageSize: PAGE_SIZE, pageNum: 1 };
    this.fetchCompany({ payload });
  }

  companyId = null;

  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'videoMonitor/fetchModelList', payload });
  };

  handleSelect = item => {
    const { setFieldsValue } = this.props.form;
    const { id, name } = item;
    this.companyId = id;
    setFieldsValue({ companyName: name });
    this.handleClose();
  };

  handleClose = () => {
    this.setState({ visible: false });
  };

  renderModal() {
    const {
      videoMonitor: { modal },
      loading,
    } = this.props;
    const { visible } = this.state;
    return (
      <CompanyModal
        // width={MODAL_WIDTH}
        loading={loading}
        visible={visible}
        // columns={COLUMNS}
        modal={modal}
        fetch={this.fetchCompany}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
      />
    );
  }

  handleFocus = e => {
    e.target.blur();
    this.setState({ visible: true });
  };

  handleSubmit = e => {
    const {
      dispatch,
      form: { validateFields },
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    e.preventDefault();
    validateFields((err, values) => {
      // console.log(values);
      if (err) return;

      const vals = { ...values };
      delete vals.compnayName;
      if (values.productionDate) vals.productionDate = values.productionDate.format('YYYY-MM-DD');
      dispatch({
        type: 'transmission/deviceAddAsync',
        payload: { companyId: this.companyId || companyId, data: vals },
        callback: dispatchCallback,
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      user: {
        currentUser: { unitType, companyName: defaultName },
      },
    } = this.props;

    return (
      <PageHeaderLayout title="新增用户传输装置" breadcrumbList={breadcrumbList}>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            {/* <FormItem label="单位名称" {...formItemLayout}>
              {getFieldDecorator('companyName', {
                rules: [{ required: true, message: '请选择单位' }],
              })(<Input placeholder="请选择单位" onFocus={this.handleFocus} />)}
            </FormItem> */}
            <FormItem {...formItemLayout} label="单位名称">
              <Col span={23}>
                {getFieldDecorator('companyName', {
                  initialValue: unitType === 4 || unitType === 1 ? defaultName : undefined,
                  rules: [
                    {
                      required: true,
                      message: '请选择单位',
                    },
                  ],
                })(
                  <Input
                    disabled
                    ref={input => {
                      this.CompanyIdInput = input;
                    }}
                    placeholder="请选择单位"
                  />
                )}
              </Col>
              {defaultName && unitType !== 2 ? null : (
                <Col span={1}>
                  <Button type="primary" onFocus={this.handleFocus} style={{ marginLeft: '10%' }}>
                    选择单位
                  </Button>
                </Col>
              )}
            </FormItem>
            <FormItem label="装置名称" {...formItemLayout}>
              {getFieldDecorator('deviceName', {
                rules: [{ required: true, whitespace: true, message: '请输入用户传输装置名称' }],
              })(<Input placeholder="请输入用户传输装置名称" />)}
            </FormItem>
            <FormItem label="装置编号" {...formItemLayout}>
              {getFieldDecorator('deviceCode', {
                rules: [
                  { required: true, whitespace: true, message: '请输入用户传输装置编号' },
                  { pattern: /^\d+$/, message: '装置编号请输入纯数字' },
                ],
              })(<Input placeholder="请输入用户传输装置编号" />)}
            </FormItem>
            <FormItem label="品牌" {...formItemLayout}>
              {getFieldDecorator('brand', {
                rules: [{ required: true, whitespace: true, message: '请输入用户传输装置品牌' }],
              })(<Input placeholder="请输入用户传输装置品牌" />)}
            </FormItem>
            <FormItem label="型号" {...formItemLayout}>
              {getFieldDecorator('model', {
                rules: [{ required: true, whitespace: true, message: '请输入用户传输装置型号' }],
              })(<Input placeholder="请输入用户传输装置型号" />)}
            </FormItem>
            <FormItem label="安装位置" {...formItemLayout}>
              {getFieldDecorator('installLocation', {
                rules: [
                  { required: true, whitespace: true, message: '请输入用户传输装置安装位置' },
                ],
              })(<Input placeholder="请输入用户传输装置安装位置" />)}
            </FormItem>
            <FormItem label="生产日期" {...formItemLayout}>
              {getFieldDecorator('productionDate', {})(<DatePicker placeholder="请选择日期" />)}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
