import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message, Button, Card, Col, DatePicker, Form, Icon, Input, Modal, Upload, Select } from 'antd';
// import FooterToolbar from 'components/FooterToolbar';

import { getToken } from 'utils/authority';

const { RangePicker } = DatePicker;
const { Item: FormItem } = Form;
const { Option } = Select;

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'fireControl';

const UploadIcon = <Icon type="upload" />;

const defaultUploadProps = { data: { folder }, multiple: true, action: uploadAction, headers: { 'JA-Token': getToken() } };
// console.log(uploadAction);

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

const ITEMS = ['gridId', 'industryCategory', 'standardLevel', 'reachLevel', 'administratiRelation', 'regulatoryOrganization', 'validity', 'companyLogo'];
const MORE_ITEMS = ['gridId', 'industryCategory', 'standardLevel', 'reachLevel', 'administratiRelation', 'regulatoryOrganization', 'validity', 'reachGradeAccessory', 'safetyFourPicture', 'companyLogo'];

function generateRules(cName, msg="输入") {
  return [{ required: true, message: `请${msg}${cName}` }];
}

function getOptions(options = []) {
  // console.log(options);
  return options.map(({ value, label }) => <Option key={value} value={value}>{label}</Option>);
}

// function handleDetail(detail, items) {
//   const result = {};
//   items.forEach(key => {
//     const val = detail[key];
//     if (val === undefined || val === null)
//       return;

//     if (key === 'undoTime')
//       // validity对应undoTime
//       result.validity = val.split(',').map(timestamp => moment(Number.parseInt(timestamp, 10)));
//     else
//       result[key] = val;
//   });
//   return result;
// }

function handleDetail(detail, items) {
  return items.reduce((prev, next) => {
    const val = detail[next];
    if (val === undefined || val === null || val === 'endTime')
      return prev;

    if (next === 'startTime')
      prev.validity = [detail.startTime, detail.endTime].map(timestamp => moment(Number.parseInt(timestamp, 10)));
    else
      prev[next] = val;

    return prev;
  }, {});
}

@connect(({ safety, loading }) => ({ safety, loading: loading.models.safety }))
@Form.create()
export default class Safety extends PureComponent {
  state = {
    showMore: false,
    submitting: false,
    logoLoading: false,
    logoList: [],
    standardLoading: false,
    standardList: [],
    safeLoading: false,
    safeList: [],
  };

  componentDidMount() {
    const that = this;
    const { dispatch, companyId, operation, form: { setFieldsValue } } = this.props;
    dispatch({
      type: 'safety/fetchMenus',
      // callback(menus) {
      //   if (operation === 'add')
      //     return;

      //   // 编辑页面就请求detail，由于渲染时需要先知道menus.standardLevel[0].id，所以有个先后顺序，不然不好判断
      //   dispatch({
      //     type: 'safety/fetch',
      //     payload: companyId,
      //     callback(detail = {}) {
      //       // 若标准化达标等级不为未评级，则先把那两个item渲染出来，再设初值
      //       if (detail.reachLevel !== undefined && detail.reachLevel !== menus.reachLevel[4].value)
      //         that.setState({ showMore: true }, () => {
      //           setFieldsValue(handleDetail(detail, MORE_ITEMS));
      //         });
      //       else {
      //         setFieldsValue(handleDetail(detail, ITEMS));
      //       }
      //     },
      //   });
      // },
    });

    if (operation === 'add')
      return;

    dispatch({
      type: 'safety/fetch',
      payload: companyId,
      callback(detail = {}) {
        // 若标准化达标等级不为未评级，则先把那两个item渲染出来，再设初值
        if (detail.reachLevel !== undefined && detail.reachLevel !== '5')
          that.setState({ showMore: true }, () => {
            setFieldsValue(handleDetail(detail, MORE_ITEMS));
          });
        else {
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

      // RangePicker中对应的validity [moment1, moment2] => [timestamp1,timestamp2]
      const timestampArray = fieldsValue.validity.map(m => +m);
      const formValues = { ...fieldsValue };
      delete formValues.validity;
      [formValues.startTime, formValues.endTime] = timestampArray;

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
    // const { safety: { menus } } = this.props;
    // console.log(value, typeof value);

    // 若选中未评级选项
    // if (value === menus.standardLevel[4].value)
    if (value === '5')
      this.setState({ showMore: false });
    else
      this.setState({ showMore: true });
  };

  // 只能有一个文件
  handleLogoChange = ({ file, fileList, event }) => {
    // console.log(file.status, file, fileList, event);
    const { logoLoading } = this.state;
    const { status, response } = file;

    // 文件在上传时，且logoLoading为false，避免重复设值
    if (status === 'uploading' && !logoLoading)
      this.setState({ logoLoading: true });
    else // 其余情况，done,error,removed时均表示loading已结束
      this.setState({ logoLoading: false });

    // 让列表只显示一个文件，当删除文件时,removed，file为删除的文件，fileList中已不包含当前file，此处为空数组
    this.setState({ logoList: fileList.slice(-1) });

    // 上传成功且code为200时提示成功，上传失败或上传成功而code不为200时提示失败，还剩一种情况就是removed，这时不需要提示
    if (status === 'done' && response.code === 200)
      message.success('上传成功');
    else if (status === 'error' || status === 'done' && response.code !== 200)
      message.error('上传失败');
  };

  // 同上
  handleStandardChange = ({ file, fileList, event }) => {
    // console.log(file.status, file, fileList, event);
    const { standardLoading } = this.state;
    const { status, response } = file;

    if (status === 'uploading' && !standardLoading)
      this.setState({ standardLoading: true });
    else
      this.setState({ standardLoading: false });

    this.setState({ standard: fileList.slice(-1) });

    if (status === 'done' && response.code === 200)
      message.success('上传成功');
    else if (status === 'error' || status === 'done' && response.code !== 200)
      message.error('上传失败');
  };

  // 可以上传多个文件
  handleSafeChange = ({ file, fileList, event }) => {
    const { safeLoading } = this.state;

    console.log(file.status, file, fileList, event);
    const { status } = file;

    if (status === 'uploading' && !safeLoading)
      this.setState({ safeLoading: true });

    // 所有文件都已上传
    if (status !== 'removed' && fileList.every(({ status }) => status === 'done' || status === 'error')) {
      // console.log('done');
      this.setState({ safeLoading: false });
      const successFileList = fileList.filter(f => f.status === 'done' && f.response.code === 200);
      const failFileList = fileList.filter(f => f.status !== 'done' || f.response.code !== 200);
      if (successFileList.length === fileList.length)
        message.success('所有文件都已上传成功');
      else
        message.error(`${failFileList.map(f => f.name).join(',')}文件上传失败，请重新上传`);
    }

    const newList = fileList.filter(f => {
      if (f.response)
        return f.response.code === 200;

      return true;
    });

    this.setState({ safeList: newList });
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
    const { showMore, submitting, standardLoading, standardList, safeLoading, safeList, logoLoading, logoList } = this.state;

    const defaultItems = [
      {
        name: 'gridId',
        cName: '所属网格',
        rules: generateRules('所属网格'),
        component: <Select placeholder="请输入所属网格">{getOptions(menus.gridId)}</Select>,
      }, {
        name: 'industryCategory',
        cName: '监管分类',
        rules: generateRules('监管分类'),
        component: <Select placeholder="请输入监管分类">{getOptions(menus.industryCategory)}</Select>,
      }, {
        name: 'standardLevel',
        cName: '安全监管等级',
        rules: generateRules('安全监管等级'),
        component: <Select placeholder="请输入安全监管等级">{getOptions(menus.standardLevel)}</Select>,
      }, {
        name: 'reachLevel',
        cName: '标准化达标等级',
        rules: generateRules('标准化达标等级'),
        component: <Select placeholder="请输入标准化达标等级" onSelect={this.handleStandardSelect}>{getOptions(menus.reachLevel)}</Select>,
      }, {
        name: 'administratiRelation',
        cName: '企业行政隶属关系',
        rules: generateRules('企业行政隶属关系'),
        component: <Select placeholder="请输入企业行政隶属关系">{getOptions(menus.administratiRelation)}</Select>,
      }, {
        name: 'regulatoryOrganization',
        cName: '属地安监机构',
        rules: generateRules('属地安监机构'),
        component: <Input placeholder="请输入属地安监机构" />,
      }, {
        name: 'validity',
        cName: '服务有效期',
        rules: generateRules('服务有效期'),
        span: 24,
        formItemLayout: itemLayout1,
        component: <RangePicker />,
      }, {
        name: 'companyLogo',
        cName: '单位LOGO',
        span: 24,
        formItemLayout: itemLayout1,
        component: <Upload {...defaultUploadProps} fileList={logoList} onChange={this.handleLogoChange}><Button loading={logoLoading} type="primary">{UploadIcon}上传图片</Button></Upload>,
      },
    ];

    const moreItems = [
      {
        name: 'reachGradeAccessory',
        cName: '标准化达标等级附件',
        rules: generateRules('标准化达标等级附件', '上传'),
        span: 24,
        formItemLayout: itemLayout1,
        component: <Upload {...defaultUploadProps} fileList={standardList} onChange={this.handleStandardChange}><Button loading={standardLoading} type="primary">{UploadIcon}上传附件</Button></Upload>,
      }, {
        name: 'safetyFourPicture',
        cName: '安全四色图',
        rules: generateRules('安全四色图', '上传'),
        span: 24,
        formItemLayout: itemLayout1,
        component: <Upload {...defaultUploadProps} fileList={safeList} onChange={this.handleSafeChange}><Button loading={safeLoading} type="primary">{UploadIcon}上传图片</Button></Upload>,
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
