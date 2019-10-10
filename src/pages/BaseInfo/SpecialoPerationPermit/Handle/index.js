import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Upload,
  DatePicker,
  Icon,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import router from 'umi/router';

const FormItem = Form.Item;
const { TextArea } = Input;

const {
  home: homeUrl,
  baseInfo: {
    specialoPerationPermit: { list: listUrl },
  },
} = urls;

const {
  home: homeTitle,
  specialoPerationPermit: { menu: menuTitle, list: listTitle },
} = titles;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');

@Form.create()
@connect(({ baseInfo }) => ({
  baseInfo,
}))
export default class SpecialoPerationPermitHandle extends PureComponent {

  state = {
    frontPhoto: '', // 操作证正面
    backPhoto: '', // 操作证反面
    forntLoading: false,
    backLoading: false,
  }

  /**
   * 提交表单
   */
  handleSubmit = () => {
    router.push(listUrl)
  }

  handleFrontChange = () => { }

  handleBackChange = () => { }

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props
    const { frontPhoto, backPhoto } = this.state
    const uploadButton = (key) => (
      <div>
        <Icon type={this.state[key] ? 'loading' : 'plus'} />
      </div>
    );
    return (
      <Card>
        <Form>
          <FormItem label="单位名称" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择单位名称' }],
            })(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  placeholder="请选择单位名称"
                />
                <Button type="primary">
                  选择单位
              </Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="姓名" {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入计划名称' }],
            })(
              <Input placeholder="请输入计划名称" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="性别" {...formItemLayout}>
            {getFieldDecorator('gender', {
              rules: [{ required: true, message: '请输入性别' }],
            })(
              <Select placeholder="请选择" {...itemStyles}>
                {[{ key: '1', label: '男' }, { key: '2', label: '女' }].map((key, label) => (
                  <Select.Option key={key} label={label}>{label}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="出生年月" {...formItemLayout}>
            {getFieldDecorator('birthDay', {
              rules: [{ required: true, message: '请选择出生年月' }],
            })(
              <DatePicker
                placeholder="请选择"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="联系电话" {...formItemLayout}>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: '请输入联系电话' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="作业类别" {...formItemLayout}>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择作业类别' }],
            })(
              <Select placeholder="请选择" {...itemStyles}>
                {[].map((key, label) => (
                  <Select.Option key={key} label={label}>{label}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="连续从事本工作时间" {...formItemLayout}>
            {getFieldDecorator('workTime')(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="准操项目" {...formItemLayout}>
            {getFieldDecorator('aa', {
              rules: [{ required: true, message: '请选输入准操项目' }],
            })(
              <TextArea rows={5} placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="操作证证号" {...formItemLayout}>
            {getFieldDecorator('num', {
              rules: [{ required: true, message: '请输入操作证证号' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="初领日期" {...formItemLayout}>
            {getFieldDecorator('initialDate')(
              <DatePicker
                placeholder="请选择"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="有效日期" {...formItemLayout}>
            {getFieldDecorator('effectiveDate', {
              rules: [{ required: true, message: '请选择有效日期' }],
            })(
              <DatePicker
                placeholder="请选择"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="复审日期" {...formItemLayout}>
            {getFieldDecorator('reviewDate')(
              <DatePicker
                placeholder="请选择"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="操作证正面扫描件" {...formItemLayout}>
            {getFieldDecorator('frontPhoto')(
              <Fragment>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  showUploadList={false}
                  action=""
                  onChange={this.handleFrontChange}
                >
                  {frontPhoto ? <img src={frontPhoto} alt="avatar" style={{ width: '100%' }} /> : uploadButton('forntLoading')}
                </Upload>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="操作证反面扫描件" {...formItemLayout}>
            {getFieldDecorator('backPhoto')(
              <Fragment>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  showUploadList={false}
                  action=""
                  onChange={this.handleFrontChange}
                >
                  {backPhoto ? <img src={backPhoto} alt="avatar" style={{ width: '100%' }} /> : uploadButton('backLoading')}
                </Upload>
              </Fragment>
            )}
          </FormItem>
        </Form>
      </Card>
    )
  }

  render() {
    const {
      match: { params: { id } },
    } = this.props
    const title = id ? "编辑操作证人员" : "新增操作证人员"
    const breadcrumbList = [
      {
        title: homeTitle,
        name: homeTitle,
        href: homeUrl,
      },
      {
        title: menuTitle,
        name: menuTitle,
      },
      {
        title: listTitle,
        name: listTitle,
        href: listUrl,
      },
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        {this.renderForm()}
        <Button style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }} type="primary" onClick={this.handleSubmit}>提交</Button>
      </PageHeaderLayout>
    )
  }
}
