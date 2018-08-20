import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { message, Button, Card, Cascader, Col, DatePicker, Form, Icon, Input, Modal, Upload, Select } from 'antd';
// import FooterToolbar from 'components/FooterToolbar';

import urls from 'utils/urls';
import { getToken } from 'utils/authority';

const { RangePicker } = DatePicker;
const { Item: FormItem } = Form;
const { Option } = Select;

const UPLOADERS = ['companyLogo', 'reachGradeAccessory'];
// const UPLOADERS = ['companyLogo', 'reachGradeAccessory', 'safetyFourPicture'];
const UPLOADERS_MAP = { companyLogo: 'logoList', reachGradeAccessory: 'standardList' }

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'safetyInfo';

const UploadIcon = <Icon type="upload" />;

const defaultUploadProps = { name: "files", data: { folder }, multiple: true, action: uploadAction, headers: { 'JA-Token': getToken() } };
// console.log(uploadAction);

// 级联中id => parentIds的映射
const idMap = {};

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

const gridLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
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

const GET_ITEMS = ['gridId', 'regulatoryClassification', 'regulatoryGrade', 'reachGrade', 'subjection', 'regulatoryOrganization', 'startTime',  'safetyFourPicture', 'companyLogo'];
const MORE_GET_ITEMS = ['gridId', 'regulatoryClassification', 'regulatoryGrade', 'reachGrade', 'subjection', 'regulatoryOrganization', 'startTime', 'reachGradeAccessory', 'safetyFourPicture', 'companyLogo'];

function generateRules(cName, msg="输入") {
  return [{ required: true, message: `请${msg}${cName}` }];
}

function getOptions(options = []) {
  // console.log(options);
  return options.map(({ value, label }) => <Option key={value} value={value}>{label}</Option>);
}

// 对fileList进行筛选，剔除同名文件，优先保留最新上传成功的文件，其次保留最新上传的失败文件
function filterUpList(fileList) {
  const names = [];
  const listArray = {};
  fileList.forEach(f => {
    const { name } = f;
    if (names.includes(name))
      listArray[name].push(f);
    else {
      names.push(name);
      listArray[name] = [f];
    }
  });

  return names.map(name => {
    const arr = listArray[name];
    const success = arr.filter(f => f.status === 'done' && f.response.code === 200);
    const fail = arr.filter(f => f.status === 'error' || f.response.code !== 200);
    const successLength = success.length;
    const failLength = fail.length;
    if (successLength)
      return success[successLength - 1];
    else
      return fail[failLength - 1];
  });
}

function addUrl(fileList) {
  fileList.forEach(f => {
    // url不存在且后面这些属性都存在
    if (!f.url && f.response && f.response.data && f.response.data.list) {
      f.url = f.response.data.list[0].webUrl;
      f.dbUrl = f.response.data.list[0].dbUrl;
    }
  });

  return fileList;
}

function handleFormValues(fieldsValue) {
  const formValues = { ...fieldsValue };

  // RangePicker中对应的validity [moment1, moment2] => [timestamp1,timestamp2]
  const timestampArray = fieldsValue.validity.map(m => +m);

  delete formValues.validity;
  [formValues.startTime, formValues.endTime] = timestampArray;

  const ids = formValues.gridId;
  formValues.gridId = ids[ids.length - 1];

  // 处理提交按钮，提交dbUrl即可
  UPLOADERS.forEach(key => {
    if (!formValues[key])
      return;

    const { fileList } = formValues[key];
    const file = fileList[0];
    // 筛选成功上传的文件上传
    if (fileList.length && file.status === 'done' && file.response.code === 200)
      formValues[key] = file.dbUrl;
    else
      formValues[key] = '';
  });

  const { fileList } = formValues.safetyFourPicture;
  // console.log(fileList);
  const newFileList = fileList
    .filter(({ status, response: { code } }) => status === 'done' && code === 200)
    .map(({ name, url, dbUrl }) => ({ fileName: name, dbUrl }));
  formValues.safetyFourPicture = JSON.stringify(newFileList);

  return formValues;
}

function handleGridTree(gridList = [], idMap) {
  let gl = gridList;
  if (typeof gridList === 'string')
    gl = JSON.parse(gl);

  return traverse(gl, idMap);
}

function traverse(gl, idMap) {
  return gl.map(({ id, text, children, nodes, parentIds }) => {
    // parentIds: 'a,b,c,', split之后['a','b','c',''],要把空字符串过滤掉
    idMap[id] = parentIds ? [...parentIds.split(',').filter(item => item), id] : [];
    return ({ value: id, label: text, children: children ? traverse(children, idMap) : undefined })
  });
}

function isJSONStr(str) {
  const first = str[0];
  const last = str[str.length - 1];
  return first === '[' && last === ']' || first === '{' && last === '}';
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
    dispatch({ type: 'safety/fetchMenus', callback({ gridList }) {
      that.gridTree = handleGridTree(gridList, idMap);

      if (operation === 'add')
        return;

      dispatch({
        type: 'safety/fetch',
        payload: companyId,
        callback(detail = {}) {
          // console.log('detail in Safety', detail);
          // 若标准化达标等级不为未评级，则先把那两个item渲染出来，再设初值
          if (detail.reachGrade && detail.reachGrade !== '5')
            that.setState({ showMore: true }, () => {
              setFieldsValue(that.handleDetail(detail, MORE_GET_ITEMS));
            });
          else {
            setFieldsValue(that.handleDetail(detail, GET_ITEMS));
          }
        },
      });
    }});
  }

  gridTree = [];

  handleDetail = (detail, items) => {
    return items.reduce((prev, next) => {
      // console.log(prev, next);
      const val = detail[next];
      if (val === undefined || val === null || val === '')
        return prev;

      if (next === 'startTime')
        prev.validity = [detail.startTime, detail.endTime].map(timestamp => moment(Number.parseInt(timestamp, 10)));
      else if (next === 'gridId')
        prev[next] = idMap[val];
      else if (next === 'safetyFourPicture') {
        let list = JSON.parse(val);
        list = list.map(({ fileName, webUrl, dbUrl }) => ({ name: fileName, uid: Math.random(), url: webUrl, dbUrl, status: 'done', response: { code: 200 } }));
        this.setState({ safeList: list });
        prev[next] = { fileList: list };
      } else if (UPLOADERS.includes(next)) {
        let list = null;
        // 数据库存的是个JSON格式的数组或对象
        if (isJSONStr(val)) {
          list = JSON.parse(val);
          list = Array.isArray(list) ? list : list.fileList;
          // 不加uid属性会报错
          list = list.map(({ name, url }) => ({ name, uid: Math.random(), url, status: 'done', response: { code: 200 } }));
        // 数据库存的只是个链接
        } else
          list = [{name: '已上传文件', url: detail[`${next}Web`], dbUrl: val, uid: Math.random(), status: 'done', response: { code: 200 }}];

        this.setState({ [UPLOADERS_MAP[next]]: list });
        prev[next] = { fileList: list };
        // console.log(list);
      }
      else
        prev[next] = val;

      return prev;
    }, {});
  };

  handleSubmit = (e) => {
    const that = this;
    const { form: { validateFields }, dispatch, companyId } = this.props;

    e.preventDefault();
    validateFields((err, fieldsValue) => {
      // 获取到的为Option中的value
      // console.log('formValues in Safety', fieldsValue);

      const { operation } = this.props;
      // 在添加页面安监信息都提示要新建企业基本信息后才能添加，当新建企业基本信息成功后，会询问是否添加安监信息，选择添加，则会跳转到编辑页面
      // 也就是说安监信息的添加修改都在编辑页面完成，添加页面的安监信息只是为了让人看下需要添加那些东西
      if (operation === 'add') {
        Modal.warning({
          title: '友情提示',
          content: '请在新建企业基本信息成功后，再添加安监信息',
        });

        return;
      }

      // const formValues = handleFormValues(fieldsValue);
      // console.log(formValues);

      if (err)
        return;

      const formValues = handleFormValues(fieldsValue);
      // console.log(formValues);

      this.setState({ submitting: true });
      dispatch({
        type: 'safety/update',
        payload: { companyId, formValues },
        callback(code, msg) {
          that.setState({ submitting: false });

          if (code === 200) {
            message.success(msg);
            dispatch(routerRedux.push(urls.company.list));
          }
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
    this.setState({ logoList: addUrl(fileList.slice(-1)) });

    // 上传成功且code为200时提示成功，上传失败或上传成功而code不为200时提示失败，还剩一种情况就是removed，这时不需要提示
    if (status === 'done' && response.code === 200)
      message.success('上传成功');
    else if (status === 'error' || status === 'done' && response.code !== 200)
      message.error('上传失败，请重新上传');
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

    this.setState({ standardList: addUrl(fileList.slice(-1)) });

    if (status === 'done' && response.code === 200)
      message.success('上传成功');
    else if (status === 'error' || status === 'done' && response.code !== 200)
      message.error('上传失败，请重新上传');
  };

  // 可以上传多个文件
  handleSafeChange = ({ file, fileList, event }) => {
    const { safeLoading } = this.state;

    console.log(file.status, file, fileList, event);
    const { status } = file;

    if (status === 'uploading' && !safeLoading)
      this.setState({ safeLoading: true });

    if (status === 'uploading' || status === 'removed')
      this.setState({ safeList: fileList });

    // 所有文件都已上传
    if (status !== 'removed' && fileList.every(({ status }) => status === 'done' || status === 'error')) {
      // console.log('done');
      this.setState({ safeLoading: false });
      const filteredList = filterUpList(fileList);
      this.setState({ safeList: addUrl(filteredList) });

      // const successFileList = fileList.filter(f => f.status === 'done' && f.response.code === 200);
      // const failFileList = fileList.filter(f => f.status !== 'done' || f.response.code !== 200);
      // if (successFileList.length === fileList.length)
      //   message.success('所有文件都已上传成功');
      // else
      //   message.error(`${failFileList.map(f => f.name).join(',')}文件上传失败，请重新上传`);
    }

    // const newList = fileList.filter(f => {
    //   if (f.response)
    //     return f.response.code === 200;

    //   return true;
    // });
  };

  // 上传一个文件
  // handleSafeChange = ({ file, fileList, event }) => {
  //   const { safeLoading } = this.state;
  //   const { status, response } = file;

  //   if (status === 'uploading' && !safeLoading)
  //     this.setState({ safeLoading: true });
  //   else
  //     this.setState({ safeLoading: false });

  //   this.setState({ safeList: addUrl(fileList.slice(-1)) });

  //   if (status === 'done' && response.code === 200)
  //     message.success('上传成功');
  //   else if (status === 'error' || status === 'done' && response.code !== 200)
  //     message.error('上传失败，请重新上传');
  // };

  // FormItem中的值对应的是组件的onChange函数传入的值，所以对于Upload组件，上传时候的值为 { file: ..., fileList: ... }
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
        span: 24,
        rules: generateRules('所属网格'),
        formItemLayout: gridLayout,
        component: <Cascader options={this.gridTree} placeholder="请输入所属网格" />,
      }, {
        name: 'regulatoryClassification',
        cName: '监管分类',
        rules: generateRules('监管分类'),
        component: <Select placeholder="请输入监管分类">{getOptions(menus.regulatoryClassification)}</Select>,
      }, {
        name: 'regulatoryGrade',
        cName: '安全监管等级',
        rules: generateRules('安全监管等级'),
        component: <Select placeholder="请输入安全监管等级">{getOptions(menus.regulatoryGrade)}</Select>,
      }, {
        name: 'reachGrade',
        cName: '标准化达标等级',
        rules: generateRules('标准化达标等级'),
        component: <Select placeholder="请输入标准化达标等级" onSelect={this.handleStandardSelect}>{getOptions(menus.reachGrade)}</Select>,
      }, {
        name: 'subjection',
        cName: '企业行政隶属关系',
        rules: generateRules('企业行政隶属关系'),
        component: <Select placeholder="请输入企业行政隶属关系">{getOptions(menus.subjection)}</Select>,
      }, {
        name: 'regulatoryOrganization',
        cName: '属地安监机构',
        rules: generateRules('属地安监机构'),
        component: <Input placeholder="请输入属地安监机构" />,
      }, {
        name: 'validity',
        cName: '服务有效期',
        rules: generateRules('服务有效期'),
        component: <RangePicker />,
      }, {
        name: 'safetyFourPicture',
        cName: '安全四色图',
        span: 24,
        rules: generateRules('安全四色图', '上传'),
        formItemLayout: itemLayout1,
        component: <Upload {...defaultUploadProps} fileList={safeList} onChange={this.handleSafeChange}><Button loading={safeLoading} type="primary">{UploadIcon}上传图片</Button></Upload>,
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
        span: 24,
        rules: generateRules('标准化达标等级附件', '上传'),
        formItemLayout: itemLayout1,
        component: <Upload {...defaultUploadProps} fileList={standardList} onChange={this.handleStandardChange}><Button loading={standardLoading} type="primary">{UploadIcon}上传附件</Button></Upload>,
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
