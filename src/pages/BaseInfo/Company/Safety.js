import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message, Button, Card, Col, DatePicker, Form, Icon, Modal, Upload, Select } from 'antd';
// import FooterToolbar from 'components/FooterToolbar';

import { getToken } from 'utils/authority';
import { uploadAction, folder } from './CompanyEdit';

const { RangePicker } = DatePicker;
const { Item: FormItem } = Form;
const { Option } = Select;

const UploadIcon = <Icon type="upload" />;

const defaultUploadProps = { data: { folder }, multiple: true, action: uploadAction, headers: { 'JA-Token': getToken() } };

const itemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const itemLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
};

const ITEMS = ['grid', 'category', 'safetyLevel', 'standardLevel', 'relationship', 'organization', 'validity', 'logo'];
const MORE_ITEMS = ['grid', 'category', 'safetyLevel', 'standardLevel', 'relationship', 'organization', 'validity', 'standardAppendix', 'fourColorImage', 'logo'];

function generateRules(cName, msg="输入") {
  return [{ required: true, message: `请${msg}${cName}` }];
}

function getOptions(options = []) {
  // console.log(options);
  return options.map(({ id, label }) => <Option key={id} value={id}>{label}</Option>);
}

function handleDetail(detail, items) {
  const result = {};
  items.forEach(key => {
    const val = detail[key];
    if (val === undefined || val === null)
      return;

    if (key === 'validity')
      result[key] = val.split(',').map(timestamp => moment(Number.parseInt(timestamp, 10)));
    else
      result[key] = val;
  });
  return result;
}

@connect(({ safety, loading }) => ({ safety, loading: loading.models.safety }))
@Form.create()
export default class Safety extends PureComponent {
  state = {
    showMore: false,
    submitting: false,
    standardList: [],
    safeList: [],
    logoList: [],
  };

  componentDidMount() {
    const that = this;
    const { dispatch, companyId, operation, form: { setFieldsValue } } = this.props;
    if (operation === 'add')
      return;

    this.setState({ submitting: true });
    dispatch({
      type: 'safety/fetch',
      payload: companyId,
      callback(menus = {standardLevel: [{id: '@@none'}]}, detail = {}) {
        // 若标准化达标等级不为未评级，则先把那两个item渲染出来，再设初值
        if (menus.standardLevel[0].id !== detail.standardLevel)
          that.setState({ showMore: true, submitting: false }, () => {
            setFieldsValue(handleDetail(detail, MORE_ITEMS));
          });
        else {
          that.setState({ submitting: false });
          setFieldsValue(handleDetail(detail, ITEMS));
        }
      },
    });
  }

  handleSubmit = (e) => {
    const that = this;
    const { form: { validateFields }, dispatch } = this.props;

    e.preventDefault();
    validateFields((err, fieldsValue) => {
      // 获取到的为Option中的value
      // console.log('formValues in Safety', fieldsValue);

      const { operation } = this.props;
      // 在添加页面安监信息都提示要新建企业基本信息后才能添加，当新建企业基本信息成功后，会询问是否添加安监信息，选择添加，则会跳转到编辑页面
      // 也就是说安监信息的添加修改都在编辑页面完成，添加页面的安监信息只是为了让人看下需要添加那些东西
      if (operation === 'add')
        Modal.warning({
          title: '友情提示',
          content: '请在新建企业基本信息成功后，再添加安监信息',
        });

      if (err)
        return;

      // RangePicker中对应的validity [moment1, moment2] => 'timestamp1,timestamp2'
      const formValues = { ...fieldsValue, validity: fieldsValue.validity.map(m => +m).join(',') };

      this.setState({ submitting: true });
      dispatch({
        type: 'safety/update',
        payload: { companyId: 1, formValues },
        callback(code, msg) {
          that.setState({ submitting: false });

          if (code === 200)
            message.success(msg);
          else
            message.error(msg);
        },
      });
    });
  };

  handleStandardSelect = (value) => {
    const { safety: { menus } } = this.props;
    // console.log(value, typeof value);

    // 若选中未评级选项
    if (value === menus.standardLevel[0].id)
      this.setState({ showMore: false });
    else
      this.setState({ showMore: true });
  };

  handleLogoUp = (o) => {
    console.log(o);
  };

  handleStandardUp = (o) => {
    console.log(o);
  };

  handleSafeUp = (o) => {
    console.log(o);
  };

  renderFormItems(items) {
    const { getFieldDecorator } = this.props.form;
    return items.map(({ name, cName, span=12, formItemLayout=itemLayout, rules, component }) => (
      <Col span={span} key={name}>
        <FormItem label={cName} {...formItemLayout}>
          {getFieldDecorator(name, { rules })(component)}
        </FormItem>
      </Col>
    ));
  }

  render() {
    const { safety: { menus }, loading } = this.props;
    const { showMore, submitting, standardList, safeList, logoList } = this.state;

    const defaultItems = [
      {
        name: 'grid',
        cName: '所属网格',
        rules: generateRules('所属网格'),
        component: <Select placeholder="请输入所属网格">{getOptions(menus.grid)}</Select>,
      }, {
        name: 'category',
        cName: '监管分类',
        rules: generateRules('监管分类'),
        component: <Select placeholder="请输入监管分类">{getOptions(menus.category)}</Select>,
      }, {
        name: 'safetyLevel',
        cName: '安全监管等级',
        rules: generateRules('安全监管等级'),
        component: <Select placeholder="请输入安全监管等级">{getOptions(menus.safetyLevel)}</Select>,
      }, {
        name: 'standardLevel',
        cName: '标准化达标等级',
        rules: generateRules('标准化达标等级'),
        component: <Select placeholder="请输入标准化达标等级" onSelect={this.handleStandardSelect}>{getOptions(menus.standardLevel)}</Select>,
      }, {
        name: 'relationship',
        cName: '企业行政隶属关系',
        rules: generateRules('企业行政隶属关系'),
        component: <Select placeholder="请输入企业行政隶属关系">{getOptions(menus.relationship)}</Select>,
      }, {
        name: 'organization',
        cName: '属地安监机构',
        rules: generateRules('属地安监机构'),
        component: <Select placeholder="请输入属地安监机构">{getOptions(menus.organization)}</Select>,
      }, {
        name: 'validity',
        cName: '服务有效期',
        rules: generateRules('服务有效期'),
        span: 24,
        formItemLayout: itemLayout1,
        component: <RangePicker />,
      }, {
        name: 'logo',
        cName: '单位LOGO',
        span: 24,
        formItemLayout: itemLayout1,
        component: <Upload {...defaultUploadProps} fileList={logoList} onChange={this.handleLogoUp}><Button type="primary">{UploadIcon}上传图片</Button></Upload>,
      },
    ];

    const moreItems = [
      {
        name: 'standardAppendix',
        cName: '标准化达标等级附件',
        rules: generateRules('标准化达标等级附件', '上传'),
        span: 24,
        formItemLayout: itemLayout1,
        component: <Upload {...defaultUploadProps} fileList={standardList} onChange={this.handleStandardUp}><Button type="primary">{UploadIcon}上传附件</Button></Upload>,
      }, {
        name: 'fourColorImage',
        cName: '安全四色图',
        rules: generateRules('安全四色图', '上传'),
        span: 24,
        formItemLayout: itemLayout1,
        component: <Upload {...defaultUploadProps} fileList={safeList} onChange={this.handleSafeUp}><Button type="primary">{UploadIcon}上传图片</Button></Upload>,
      },
    ];

    const formItems = [...defaultItems];

    if (showMore)
      formItems.splice(7, 0, ...moreItems);

    return (
        <Card>
          <Form onSubmit={this.handleSubmit}>
            {this.renderFormItems(formItems)}
            <Col span={24}>
              <FormItem wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 13, offset: 11 } }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading || submitting}
                >
                  提交
                </Button>
              </FormItem>
            </Col>
            {/* <FooterToolbar>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={loading || submitting}
              >
                提交
              </Button>
            </FooterToolbar> */}
          </Form>
        </Card>
    );
  }
}
