import { PureComponent, Fragment } from 'react';
import {
  Row,
  Col,
  Button,
  message,
  Input,
  Select,
  Card,
  Form,
  DatePicker,
  Upload,
  Icon,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import router from 'umi/router';
import moment from 'moment';
import { stringify } from 'qs';
import { getToken } from '@/utils/authority';
import { SEXES } from '@/pages/RoleAuthorization/AccountManagement/utils';
import { phoneReg } from '@/utils/validate';

const FormItem = Form.Item;

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
const colLayout = { lg: 8, md: 12, sm: 24 };
const DEGREES = [
  { key: '0', label: '初中' },
  { key: '1', label: '高中' },
  { key: '2', label: '中专' },
  { key: '3', label: '大专' },
  { key: '4', label: '本科' },
  { key: '5', label: '硕士' },
  { key: '6', label: '博士' },
];

@Form.create()
@connect(({ realNameCertification }) => ({
  realNameCertification,
}))
export default class PersonnelAdd extends PureComponent {

  state = {
    diplomaLoading: false, // 学历证书是否上传中
    photoLoading: false, // 人脸照片是否上传中
    // photoFiles: [], // 人脸照片
    // diplomaFiles: [], // 学历证书
  }

  // 提交
  handleSubmit = () => {
    const {
      dispatch,
      match: { params: { id } },
      form: { validateFieldsAndScroll },
      location: { query: { companyId } },
    } = this.props;
    const tag = id ? '编辑' : '新增';
    const callback = (success) => {
      if (success) {
        message.success(`${tag}人员成功`);
        router.push(`/real-name-certification/personnel-management/person-list/${companyId}`);
      } else {
        message.error(`${tag}人员失败`);
      }
    }
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (!companyId) return;
      const { birthday, ...resValues } = values;
      const payload = {
        ...resValues,
        birthday: birthday ? birthday.unix() * 1000 : undefined,
        companyId,
      };
      // console.log('payload', payload);
      if (id) {
        // 如果编辑
      } else {
        dispatch({
          type: 'realNameCertification/addPerson',
          payload,
          callback,
        })
      }
    });
  }

  // 上传人脸招联前的回调
  handleBeforeUploadPhoto = file => {
    const { photoLoading } = this.state;
    // 判断是否图片
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (photoLoading) {
      message.error('尚未上传结束');
    }
    if (!isImage) {
      message.error('请上传jpg格式照片');
    }
    return isImage && !photoLoading;
  }

  // 上传人脸招联前的回调
  handleBeforeUploadDiploma = file => {
    const { diplomaLoading } = this.state;
    // 判断是否图片
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (diplomaLoading) {
      message.error('尚未上传结束');
    }
    if (!isImage) {
      message.error('请上传jpg格式照片');
    }
    return isImage && !diplomaLoading;
  }

  // 人脸照片上传
  handlePhotoUploadChange = ({ file, fileList }) => {
    const { form: { resetFields, setFieldsValue } } = this.props;
    const error = () => {
      resetFields(['photoDetails']);
    };
    if (file.status === 'uploading') {
      this.setState({ photoLoading: true });
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        setFieldsValue({
          photoDetails: [{ ...result, webUrl: result.webUrl, dbUrl: result.dbUrl }],
        });
      } else {
        error();
      }
      this.setState({ photoLoading: false });
    } else if (file.status === 'removed') {
      resetFields(['photoDetails']);
    } else {
      error();
    }
  };

  // 学历证书上传
  handleDiplomaUploadChange = ({ file, fileList }) => {
    const { form: { resetFields, setFieldsValue } } = this.props;
    const error = () => {
      resetFields(['educationCertificateDetails']);
    };
    if (file.status === 'uploading') {
      this.setState({ diplomaLoading: true });
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        setFieldsValue({
          educationCertificateDetails: [{ ...result, webUrl: result.webUrl, dbUrl: result.dbUrl }],
        });
      } else {
        error();
      }
      this.setState({ diplomaLoading: false });
    } else if (file.status === 'removed') {
      resetFields(['educationCertificateDetails']);
    } else {
      error();
    }
  };


  validatePhoto = (rule, value, callback) => {
    if (value && value.length) {
      callback()
    } else callback('请上传人脸照片')
  }

  render () {
    const {
      match: { params: { id } },
      location: { query: { companyId } },
      form: { getFieldDecorator, getFieldsValue },
      realNameCertification: { personTypeDict, dutyDict },
    } = this.props;
    const { photoLoading, diplomaLoading } = this.state;
    const { photoDetails, educationCertificateDetails } = getFieldsValue();
    const title = id ? '编辑人员信息' : '新增人员信息';
    //面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '实名制认证系统',
        name: '实名制认证系统',
      },
      {
        title: '人员管理',
        name: '人员管理',
        href: `/real-name-certification/personnel-management/person-list/${companyId}`,
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
        <Card>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col {...colLayout}>
                <FormItem label="姓名">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入姓名' }],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="性别">
                  {getFieldDecorator('sex', {
                    rules: [{ required: true, message: '请选择性别' }],
                  })(
                    <Select placeholder="请选择">
                      {SEXES.map(({ key, label }) => (
                        <Select.Option key={key} value={key}>{label}</Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="民族">
                  {getFieldDecorator('ethnic', {
                    rules: [{ required: true, message: '请输入民族' }],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="证件类型">
                  {getFieldDecorator('certificateType', {
                    initialValue: '1',
                  })(
                    <Select placeholder="请选择">
                      {[{ value: '1', label: '身份证' }].map(({ value, label }, index) => (
                        <Select.Option key={value} value={value}>{label}</Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="证件号">
                  {getFieldDecorator('certificateNumber')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="生日">
                  {getFieldDecorator('birthday')(
                    <DatePicker placeholder="请选择生日" format="YYYY-MM-DD" style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="所在地">
                  {getFieldDecorator('location')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="详细地址">
                  {getFieldDecorator('address')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="手机号">
                  {getFieldDecorator('telephone', {
                    rules: [
                      { required: true, message: '请输入手机号', whitespace: true },
                      { pattern: phoneReg, message: '联系电话格式不正确' },
                    ],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="邮箱">
                  {getFieldDecorator('email')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="人员类型">
                  {getFieldDecorator('personType', {
                    rules: [{ required: true, message: '请选择人员类型' }],
                  })(
                    <Select placeholder="请选择">
                      {personTypeDict.map(({ key, label }) => (
                        <Select.Option key={key} value={key}>{label}</Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="单位名称">
                  {getFieldDecorator('personCompany', {
                    rules: [{ required: true, message: '请输入单位名称' }],
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="职务">
                  {getFieldDecorator('duty')(
                    <Select placeholder="请选择">
                      {dutyDict.map(({ key, label }) => (
                        <Select.Option key={key} value={key}>{label}</Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="工种">
                  {getFieldDecorator('workType')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="学历">
                  {getFieldDecorator('education')(
                    <Select placeholder="请选择" allowClear>
                      {DEGREES.map(({ key, label }) => (
                        <Select.Option value={key} key={key}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="专业">
                  {getFieldDecorator('major')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="IC卡号">
                  {getFieldDecorator('icnumber')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="门禁号">
                  {getFieldDecorator('entranceNumber')(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="人脸照片">
                  {getFieldDecorator('photoDetails', {
                    rules: [{ required: true, validator: this.validatePhoto }],
                  })(
                    <Fragment>
                      <Upload
                        name="files"
                        listType="picture-card"
                        headers={{ 'JA-Token': getToken() }}
                        accept=".jpg,.png" // 接收的文件格式
                        data={{ folder: 'realName' }} // 附带的参数
                        showUploadList={false}
                        action={uploadAction} // 上传地址
                        beforeUpload={this.handleBeforeUploadPhoto}
                        onChange={this.handlePhotoUploadChange}
                      >
                        {photoDetails && photoDetails.length > 0 ? (
                          <img
                            src={photoDetails.map(item => item.webUrl).join('')}
                            alt="照片"
                            style={{ width: '100%' }}
                          />
                        ) : (
                            <div>
                              <Icon type={photoLoading ? 'loading' : 'plus'} />
                              <div className="ant-upload-text">上传</div>
                            </div>
                          )}
                      </Upload>
                    </Fragment>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="学历证书">
                  {getFieldDecorator('educationCertificateDetails')(
                    <Fragment>
                      <Upload
                        name="files"
                        listType="picture-card"
                        headers={{ 'JA-Token': getToken() }}
                        accept=".jpg,.png" // 接收的文件格式
                        data={{ folder: 'realName' }} // 附带的参数
                        showUploadList={false}
                        action={uploadAction} // 上传地址
                        beforeUpload={this.handleBeforeUploadDiploma}
                        onChange={this.handleDiplomaUploadChange}
                      >
                        {educationCertificateDetails && educationCertificateDetails.length > 0 ? (
                          <img
                            src={educationCertificateDetails.map(item => item.webUrl).join('')}
                            alt="照片"
                            style={{ width: '100%' }}
                          />
                        ) : (
                            <div>
                              <Icon type={diplomaLoading ? 'loading' : 'plus'} />
                              <div className="ant-upload-text">上传</div>
                            </div>
                          )}
                      </Upload>
                    </Fragment>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={() => { router.goBack() }}
              style={{ marginRight: '24px' }}
            >
              返回
          </Button>
            <Button type="primary" onClick={this.handleSubmit}>
              确定
          </Button>
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}
