import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Form,
  Input,
  Button,
  Card,
  Select,
  message,
  DatePicker,
  Upload,
  Icon,
  Radio,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { getToken } from 'utils/authority';
import moment from 'moment';
import styles from './LawDatabase.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Group: RadioGroup } = Radio;

// 编辑页面标题
const editTitle = '编辑法律法规';
// 添加页面标题
const addTitle = '新增法律法规';

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'safetyinfo';
const defaultUploadProps = {
  name: 'files',
  data: { folder },
  multiple: true,
  action: uploadAction,
  headers: { 'JA-Token': getToken() },
};
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

@connect(({ lawDatabase, user, loading }) => ({
  lawDatabase,
  user,
  submitting: loading.effects['lawDatabase/addLaw'] || loading.effects['lawDatabase/editLaw'],
}))
@Form.create()
export default class LawDatabaseEdit extends PureComponent {
  state = {
    fileList: [],
    uploading: false,
  };

  // 返回到列表页面
  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/safety-production-regulation/laws/list`));
  };

  // 挂载后
  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
    } = this.props;
    if (id) {
      // 根据id获取详情
      dispatch({
        type: 'lawDatabase/fetchLawDetail',
        payload: { id, pageNum: 1, pageSize: 0 },
        callback: ({
          regulations, // 是否现行法规
          abolishDate,// 废止日期
          accessoryDetails,
        }) => {
          setFieldsValue({ regulations });
          this.setState({ fileList: Array.isArray(accessoryDetails) ? accessoryDetails.map(item => ({ ...item, uid: item.id, url: item.webUrl })) : [] });
          if (+regulations === 0) {
            setTimeout(() => {
              setFieldsValue({ abolishDate: abolishDate ? moment(abolishDate) : undefined });
            }, 0);
          }
        },
      });
    }
  }

  // 点击提交按钮验证表单信息
  handleClickValidate = () => {
    const {
      form: { validateFieldsAndScroll },
      match: { params: { id } },
      dispatch,
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (error) return;
      const { fileList } = this.state;
      const {
        releaseDate,// 发布日期
        commissionDate, // 启用日期
        abolishDate, // 废止日期
        ...resValues
      } = values;
      const payload = {
        ...resValues,
        releaseDate: this.generateTimeStamp(releaseDate),
        commissionDate: this.generateTimeStamp(commissionDate),
        abolishDate: this.generateTimeStamp(abolishDate),
        accessoryDetails: fileList,
      };
      const tag = id ? '编辑' : '新增';
      const callback = (success, msg) => {
        if (success) {
          message.success(`${tag}法律法规成功`);
          this.goBack();
        } else {
          message.error(msg || `${tag}法律法规失败`)
        }
      };
      // console.log('payload', payload);
      // 如果id存在的话，为编辑
      if (id) {
        dispatch({
          type: 'lawDatabase/editLaw',
          payload: { ...payload, id },
          callback,
        });
      }
      // 不存在id,则为新增
      else {
        dispatch({
          type: 'lawDatabase/addLaw',
          payload,
          callback,
        });
      }
    });
  };

  // 将moment转化为时间戳
  generateTimeStamp = obj => obj ? obj.unix() * 1000 : undefined

  trim = e => e.target.value.replace(/\s/, '')

  handleFileUploadChange = ({ file, fileList }, listTag, loadingTag) => {
    let newState = {};
    if (file.status === 'uploading') {
      newState[loadingTag] = true;
      newState[listTag] = fileList;
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const result = file.response.data.list[0]
        const list = fileList.map((item, index) => {
          if (index === fileList.length - 1) {
            return {
              ...result,
              uid: item.uid,
              url: result.webUrl,
              name: result.fileName,
            }
          } else return item
        })
        newState[loadingTag] = false;
        newState[listTag] = list;
      } else {
        message.error('上传失败！');
        newState[listTag] = fileList.filter(item => {
          return !item.response || item.response.code !== 200;
        });
      }
      newState[loadingTag] = false;
    } else if (file.status === 'removed') {
      // 删除
      newState[loadingTag] = false;
      newState[listTag] = fileList.filter(item => {
        return item.status !== 'removed';
      });
    } else {
      message.error('上传失败')
      newState[loadingTag] = false;
    }
    this.setState(newState)
  }

  // 渲染信息
  renderLawsInfo () {
    const {
      submitting,
      form: { getFieldDecorator, getFieldValue },
      match: { params: { id } },
      lawDatabase: {
        detail = {},
        typeDict,
        coercionDegreeDict,
      },
    } = this.props;
    const regulations = getFieldValue('regulations');
    const { fileList, uploading } = this.state;

    return (
      <Card className={styles.card} bordered={false}>
        <Form style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="文件名称">
            {getFieldDecorator('name', {
              initialValue: id ? detail.name : undefined,
              rules: [{ required: true, message: '请输入文件名称' }],
              getValueFromEvent: this.trim,
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="法规编号">
            {getFieldDecorator('code', {
              initialValue: id ? detail.code : undefined,
              rules: [{ required: true, message: '请输入法规编号' }],
              getValueFromEvent: this.trim,
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="分类">
            {getFieldDecorator('classify', {
              initialValue: id ? detail.classify : undefined,
              rules: [{ required: true, message: '请选择分类' }],
            })(
              <Select placeholder="请选择">
                {typeDict.map(({ value, label }) => (
                  <Select.Option value={value} key={value}>{label}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="强制程度">
            {getFieldDecorator('coerciveProcedure', {
              initialValue: id ? detail.coerciveProcedure : undefined,
              rules: [{ required: true, message: '请选择强制程度' }],
            })(
              <Select placeholder="请选择">
                {coercionDegreeDict.map(({ value, label }) => (
                  <Select.Option value={value} key={value}>{label}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="发布机构">
            {getFieldDecorator('organization', {
              initialValue: id ? detail.organization : undefined,
              rules: [{ required: true, message: '请输入法规编号' }],
              getValueFromEvent: this.trim,
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="发布日期">
            {getFieldDecorator('releaseDate', {
              initialValue: id && detail.releaseDate ? moment(detail.releaseDate) : undefined,
              rules: [{ required: true, message: '请选择发布日期' }],
            })(
              <DatePicker />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="启用日期">
            {getFieldDecorator('commissionDate', {
              initialValue: id && detail.commissionDate ? moment(detail.commissionDate) : undefined,
              rules: [{ required: true, message: '请选择启用日期' }],
            })(
              <DatePicker />
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="现行法规">
            {getFieldDecorator('regulations', {
              rules: [{ required: true, message: '请选择是否现行法规' }],
            })(
              <RadioGroup>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </RadioGroup>
            )}
          </FormItem>

          {+regulations === 0 && (
            <FormItem {...formItemLayout} label="废止日期">
              {getFieldDecorator('abolishDate', {
                rules: [{ required: true, message: '请选择废止日期' }],
              })(
                <DatePicker />
              )}
            </FormItem>
          )}

          <FormItem {...formItemLayout} label="备注">
            {getFieldDecorator('remark', {
              initialValue: id ? detail.remark : undefined,
              getValueFromEvent: this.trim,
              rules: [{ max: 100, message: '请输入不超过50个字符' }],
            })(
              <TextArea rows={3} placeholder="请输入" />
            )}
          </FormItem>

          <FormItem label="附件" {...formItemLayout}>
            {getFieldDecorator('accessoryDetails')(
              <Fragment>
                <Upload
                  {...defaultUploadProps}
                  fileList={fileList}
                  disabled={uploading}
                  // accept="image/*" // 接收的文件格式
                  onChange={(info) => this.handleFileUploadChange(info, 'fileList', 'uploading')}
                >
                  <Button type="primary">
                    {uploading ? <Icon type="loading" /> : <Icon type="upload" />}
                    点击上传
                  </Button>
                </Upload>
              </Fragment>
            )}
          </FormItem>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            loading={submitting}
            disabled={uploading}
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
  render () {
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
        title: '安全生产制度法规',
        name: '安全生产制度法规',
      },
      {
        title: '法律法规库',
        name: '法律法规库',
        href: '/safety-production-regulation/laws/list',
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
