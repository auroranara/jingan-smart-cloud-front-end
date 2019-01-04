import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { routerRedux } from 'dva/router';
import { Button, Card, Col, Form, Icon, Input, Upload, Select, InputNumber } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

// import urls from 'utils/urls';
import { getToken } from 'utils/authority';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '人员定位',
    name: '人员定位',
  },
  {
    title: '建筑物信息列表',
    name: '建筑物信息列表',
  },
  {
    title: '新增建筑物',
    name: '新增建筑物',
  },
];

const { TextArea } = Input;
const { Item: FormItem } = Form;
const { Option } = Select;

// const UPLOADERS = ['companyLogo', 'reachGradeAccessory'];
// const UPLOADERS = ['companyLogo', 'reachGradeAccessory', 'safetyFourPicture'];
// const UPLOADERS_MAP = { companyLogo: 'logoList', reachGradeAccessory: 'standardList' };

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'safetyInfo';

const UploadIcon = <Icon type="upload" />;

const defaultUploadProps = {
  name: 'files',
  data: { folder },
  multiple: true,
  action: uploadAction,
  headers: { 'JA-Token': getToken() },
};

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
    sm: { span: 18 },
  },
};

function generateRules(cName, msg = '输入', ...rules) {
  return [{ required: true, message: `请${msg}${cName}` }, ...rules];
}

function getOptions(options = []) {
  return options.map(({ id, label }) => (
    <Option key={id} value={id}>
      {label}
    </Option>
  ));
}

@connect(({ buildingsInfo, loading }) => ({ buildingsInfo, loading: loading.models.buildingsInfo }))
@Form.create()
export default class BuildingInfoEdit extends PureComponent {
  state = {};

  componentDidMount() {
    const { dispatch } = this.props;
    // 获取建筑物类型字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
      payload: {
        type: 'buildingType',
      },
    });
    // 获取火灾危险等级字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
      payload: {
        type: 'fireDangerType',
      },
    });
    // 获取耐火等级字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
      payload: {
        type: 'fireRating',
      },
    });
    // 获取建筑结构字典
    dispatch({
      type: 'buildingsInfo/fetchDict',
      payload: {
        type: 'floorNumber',
      },
    });
  }

  handleSubmit = e => {};

  // 渲染表单
  renderFormItems(items) {
    const { getFieldDecorator } = this.props.form;
    return items.map(
      ({ name, cName, span = 12, formItemLayout = itemLayout, rules, component }) => (
        <Col span={span} key={name}>
          <FormItem label={cName} {...formItemLayout}>
            {getFieldDecorator(name, { rules })(component)}
          </FormItem>
        </Col>
      )
    );
  }

  render() {
    const {
      location: {
        query: { name: company_name },
      },
      form: { getFieldDecorator },
      buildingsInfo: { buildingType = [], fireDangerType = [], fireRating = [], floorNumber = [] },
    } = this.props;

    const defaultItems = [
      {
        name: 'CompanyName',
        cName: '企业名称',
        component: (
          <div>
            {company_name ? (
              <div>
                {getFieldDecorator('companyId', { initialValue: company_name })(
                  <Input disabled placeholder="请输入企业名称" />
                )}
              </div>
            ) : (
              ''
            )}
          </div>
        ),
      },
      {
        name: 'buildingType',
        cName: '建筑物类型',
        rules: generateRules('建筑物类型'),
        component: <Select placeholder="请选择建筑物类型">{getOptions(buildingType)}</Select>,
      },
      {
        name: 'buildingName',
        cName: '建筑物名称',
        rules: generateRules('建筑物名称'),
        component: <Input placeholder="请输入建筑物名称" />,
      },
      {
        name: 'contaction',
        cName: '建筑结构',
        rules: generateRules('建筑结构'),
        component: <Select placeholder="请选择建筑结构">{getOptions(floorNumber)}</Select>,
      },
      {
        name: 'dangerousType',
        cName: '火灾危险性分类',
        rules: generateRules('火灾危险性分类'),
        component: <Select placeholder="请选择火灾危险性分类">{getOptions(fireDangerType)}</Select>,
      },
      {
        name: 'buildingArea',
        cName: '建筑面积(㎡)',
        component: <InputNumber style={{ width: '100%' }} />,
      },
      {
        name: 'level',
        cName: '耐火等级',
        rules: generateRules('耐火等级'),
        component: <Select placeholder="请选择耐火等级">{getOptions(fireRating)}</Select>,
      },
      {
        name: 'safetyFourPicture',
        cName: '现场照片',
        span: 24,
        formItemLayout: itemLayout1,
        component: (
          <Upload {...defaultUploadProps} onChange={this.handleSafeChange}>
            <Button type="primary">
              {UploadIcon}
              选择图片
            </Button>
          </Upload>
        ),
      },
      {
        name: 'companyLogo',
        cName: '图纸附件',
        span: 24,
        formItemLayout: itemLayout1,
        component: (
          <Upload {...defaultUploadProps} onChange={this.handleLogoChange}>
            <Button type="primary">
              {UploadIcon}
              选择文件
            </Button>
          </Upload>
        ),
      },
      {
        name: 'level',
        cName: '备注',
        span: 24,
        formItemLayout: itemLayout1,
        rules: generateRules('备注'),
        component: <TextArea placeholder="请输入备注" rows={3} maxLength="5000" />,
      },
    ];

    const formItems = [...defaultItems];

    return (
      <PageHeaderLayout title="新增建筑物" breadcrumbList={breadcrumbList}>
        <Card>
          <Form>
            {this.renderFormItems(formItems)}
            <Col span={24}>
              <FormItem wrapperCol={{ xs: { span: 24, offset: 0 }, sm: { span: 13, offset: 11 } }}>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
                <Button type="primary" style={{ marginLeft: '10px' }}>
                  返回
                </Button>
              </FormItem>
            </Col>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
