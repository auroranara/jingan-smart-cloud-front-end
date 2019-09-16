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
const { RangePicker } = DatePicker;

const {
  home: homeUrl,
  baseInfo: {
    dangerChemicalsPermit: { list: listUrl },
  },
} = urls;

const {
  home: homeTitle,
  dangerChemicalsPermit: { menu: menuTitle, list: listTitle },
} = titles;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');
const dateFormat = 'YYYY/MM/DD';
// 证书种类
const typeList = [
  { key: '1', label: '生产' },
  { key: '2', label: '经营' },
  { key: '3', label: '使用' },
]
// 到期状态
const expirationStatusList = [
  { key: '1', label: '未到期' },
  { key: '2', label: '即将到期' },
  { key: '3', label: '已过期' },
]
// 证书状态
const permitStatusList = [
  { key: '1', label: '现用' },
  { key: '2', label: '吊销' },
  { key: '3', label: '注销' },
  { key: '4', label: '暂扣' },
  { key: '5', label: '曾用' },
]

@Form.create()
@connect(({ baseInfo }) => ({
  baseInfo,
}))
export default class dangerChemicalsPermitHandle extends PureComponent {

  state = {
    uploading: false, // 上传是否加载
    photoUrl: '', // 上传照片
  }

  /**
  * 提交表单
  */
  handleSubmit = () => {
    router.push(listUrl)
  }

  handleUploadChange = () => { }

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = this.props
    const { uploading, photoUrl } = this.state
    const uploadButton = (
      <div>
        <Icon type={uploading ? 'loading' : 'plus'} />
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
                  placeholder="请选择"
                />
                <Button type="primary">
                  选择单位
            </Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="证书种类" {...formItemLayout}>
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '请选择证书种类' }],
            })(
              <Select placeholder="请选择" {...itemStyles}>
                {typeList.map((key, label) => (
                  <Select.Option key={key} label={label}>{label}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="证书状态" {...formItemLayout}>
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择证书状态' }],
            })(
              <Select placeholder="请选择" {...itemStyles}>
                {permitStatusList.map((key, label) => (
                  <Select.Option key={key} label={label}>{label}</Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="发证机关" {...formItemLayout}>
            {getFieldDecorator('issueAuthority', {
              rules: [{ required: true, message: '请输入发证机关' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="发证日期" {...formItemLayout}>
            {getFieldDecorator('issueDate', {
              rules: [{ required: true, message: '请选择发证日期' }],
            })(
              <DatePicker
                placeholder="请选择"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="发证编号" {...formItemLayout}>
            {getFieldDecorator('issueNum', {
              rules: [{ required: true, message: '请输入发证编号' }],
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="证书有效期" {...formItemLayout}>
            {getFieldDecorator('validityPeriod', {
              rules: [{ required: true, message: '请选择证书有效期' }],
            })(
              <RangePicker
                format={dateFormat}
              />
            )}
          </FormItem>
          <FormItem label="许可范围" {...formItemLayout}>
            {getFieldDecorator('licenseRange', {
              rules: [{ required: true, message: '请输入许可范围' }],
            })(
              <TextArea rows={5} placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="证书附件" {...formItemLayout}>
            {getFieldDecorator('photo', {
              rules: [{ required: true, message: '请上传证书附件' }],
            })(
              <Fragment>
                <Upload
                  name="front"
                  listType="picture-card"
                  showUploadList={false}
                  action=""
                  onChange={this.handleUploadChange}
                >
                  {photoUrl ? <img src={photoUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
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
    const title = id ? "编辑许可证" : "新增许可证"
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
