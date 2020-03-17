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
  Tooltip,
  Upload,
  Icon,
  Radio,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import styles from './CompanyList.less';
import router from 'umi/router';
import { getToken } from '@/utils/authority';
import { phoneReg } from '@/utils/validate';
import PIC from '@/assets/picExample.png';

const FormItem = Form.Item;

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
const colLayout = { lg: 8, md: 12, sm: 24 };

@Form.create()
@connect(({ realNameCertification, user, loading }) => ({
  realNameCertification,
  user,
  submitting:
    loading.effects['realNameCertification/addPerson'] ||
    loading.effects['realNameCertification/editPerson'],
}))
export default class PersonnelAdd extends PureComponent {
  state = {
    diplomaLoading: false, // 学历证书是否上传中
    photoLoading: false, // 人脸照片是否上传中
    // 详情
    detail: {
      photoDetails: [],
    },
    sexValue: '0',
    perType: '1', // 人员选择类型
    curCompanyName: '', // 当前单位
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { companyName: routerCompanyName },
      },
      user: {
        currentUser: { companyName },
      },
      form: { setFieldsValue },
    } = this.props;

    this.setState({ curCompanyName: companyName || routerCompanyName });
    if (id) {
      // 如果编辑
      dispatch({
        type: 'realNameCertification/fetchDetail',
        payload: { id, pageNum: 1, pageSize: 0 },
        callback: detail => {
          this.setState({ detail, perType: detail.personType });
          const photoDetails = detail.photoDetails || [];
          setFieldsValue({
            photoDetails: photoDetails.map(item => ({ ...item, uid: item.id, url: item.webUrl })),
          });
        },
      });
    }
  }

  // 提交
  handleSubmit = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { validateFieldsAndScroll },
      location: {
        query: { companyId },
      },
    } = this.props;
    const { diplomaLoading, detail, photoLoading, curCompanyName } = this.state;
    if (diplomaLoading || photoLoading) {
      message.warning('上传暂未结束');
      return;
    }
    const tag = id ? '编辑' : '新增';
    const callback = (success, msg) => {
      if (success) {
        message.success(`${tag}人员成功`);
        router.push(
          `/real-name-certification/personnel-management/person-list/${companyId}?companyName=${curCompanyName}`
        );
      } else {
        message.error(msg || `${tag}人员失败`);
      }
    };
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (!companyId) return;
      const { ...resValues } = values;
      const payload = {
        ...resValues,
        companyId,
      };
      // console.log('payload', payload);
      if (id) {
        // 如果编辑
        dispatch({
          type: 'realNameCertification/editPerson',
          payload: { ...payload, id, employeeId: detail.employeeId },
          callback,
        });
      } else {
        dispatch({
          type: 'realNameCertification/addPerson',
          payload,
          callback,
        });
      }
    });
  };

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
  };

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
  };

  // 人脸照片上传
  handlePhotoUploadChange = ({ file, fileList }) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const error = () => {
      this.setState({ photoLoading: false });
      setFieldsValue({ photoDetails: [] });
    };
    if (file.status === 'uploading') {
      this.setState({ photoLoading: true });
      setFieldsValue({ photoDetails: fileList });
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        setFieldsValue({
          photoDetails: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...result,
                uid: item.uid,
                url: result.webUrl,
              };
            }
            return item;
          }),
        });
      } else {
        error();
      }
      this.setState({ photoLoading: false });
    } else if (file.status === 'removed') {
      setFieldsValue({
        photoDetails: fileList.filter(item => {
          return item.status !== 'removed';
        }),
      });
      this.setState({ photoLoading: false });
    } else {
      error();
    }
  };

  // validatePhoto = (rule, value, callback) => {
  //   if (value && value.length) {
  //     callback();
  //   } else callback('请上传人脸照片');
  // };

  handleSexTypeChange = i => {
    this.setState({ sexValue: i });
  };

  handlePersonType = id => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { curCompanyName } = this.state;
    this.setState({ perType: id });
    setFieldsValue({ personCompany: id !== '1' ? undefined : curCompanyName });
  };
  // validateSN = (rule, value, callback) => {
  //   if (value && value.length === 12 && snRe.test(value)) {
  //     callback();
  //   } else callback('长度必须是12');
  // };

  render() {
    const {
      submitting, // 提交状态
      match: {
        params: { id },
      },
      location: {
        query: { companyName: routerCompanyName, companyId },
      },
      user: {
        currentUser: { companyName },
      },
      form: { getFieldDecorator, getFieldValue },
      realNameCertification: { personTypeDict },
    } = this.props;

    const { photoLoading, sexValue, detail, perType, curCompanyName } = this.state;

    const photoDetails = getFieldValue('photoDetails') || [];
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
        href: `/real-name-certification/personnel-management/person-list/${companyId}?companyName=${routerCompanyName ||
          companyName}`,
      },
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card title="基本信息">
          <Form layout="vertical">
            <Row gutter={16}>
              <Col {...colLayout}>
                <FormItem label="姓名">
                  {getFieldDecorator('name', {
                    initialValue: id ? detail.name : undefined,
                    rules: [{ required: true, message: '请输入姓名' }],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="手机号">
                  {getFieldDecorator('telephone', {
                    initialValue: id ? detail.telephone : undefined,
                    rules: [
                      { whitespace: true },
                      { pattern: phoneReg, message: '联系电话格式不正确' },
                    ],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="性别">
                  {getFieldDecorator('sex', {
                    initialValue: id ? detail.sex : sexValue,
                    rules: [{ required: true, message: '请选择性别' }],
                  })(
                    <Radio.Group onChange={this.handleSexTypeChange} buttonStyle="solid">
                      <Radio.Button value="0">男</Radio.Button>
                      <Radio.Button value="1">女</Radio.Button>
                    </Radio.Group>
                  )}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem label="人员类型">
                  {getFieldDecorator('personType', {
                    initialValue: id ? detail.personType : perType,
                    rules: [{ required: true, message: '请选择人员类型' }],
                  })(
                    <Select placeholder="请选择" onSelect={this.handlePersonType}>
                      {personTypeDict.map(({ key, label }) => (
                        <Select.Option key={key} value={key}>
                          {label}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              {perType === '1' && (
                <Col {...colLayout}>
                  <FormItem label="单位名称">
                    {getFieldDecorator('personCompany', {
                      initialValue: curCompanyName,
                      rules: [{ required: true, message: '请输入单位名称' }],
                    })(<Input disabled placeholder="请输入" />)}
                  </FormItem>
                </Col>
              )}
              {perType !== '1' && (
                <Col {...colLayout}>
                  <FormItem label="单位名称">
                    {getFieldDecorator('personCompany', {
                      initialValue: id ? detail.personCompany : undefined,
                      rules: [{ required: true, message: '请输入单位名称' }],
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
              )}
            </Row>
          </Form>
        </Card>
        <Card title="卡号信息" style={{ marginTop: 5 }}>
          <Form>
            <Row gutter={16}>
              <Col {...colLayout}>
                <FormItem label="IC卡号">
                  {getFieldDecorator('icnumber', {
                    initialValue: id ? detail.icnumber : undefined,
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col {...colLayout}>
                <FormItem
                  label={
                    <span>
                      SN卡号&nbsp;
                      <Tooltip title="人员定位使用">
                        <Icon style={{ color: '#1890ff' }} type="question-circle" />
                      </Tooltip>
                    </span>
                  }
                >
                  {getFieldDecorator('entranceNumber', {
                    initialValue: id ? detail.entranceNumber : undefined,
                    // rules: [{ pattern: /^[0-9a-fA-F]$/, message: '请输入数字' }],
                  })(<Input placeholder="请输入" maxLength={12} />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem
                  label={
                    <span>
                      人脸照&nbsp;&nbsp;
                      <span className={styles.labelColor}>
                        （确保照片是正脸，且足够清晰，最多3张同一人员注册照）
                      </span>
                    </span>
                  }
                >
                  {getFieldDecorator('photoDetails', {
                    //rules: [{ validator: this.validatePhoto }],
                  })(
                    <Fragment>
                      <Upload
                        name="files"
                        listType="picture-card"
                        headers={{ 'JA-Token': getToken() }}
                        accept=".jpg,.png" // 接收的文件格式
                        data={{ folder: 'realName' }} // 附带的参数
                        fileList={photoDetails}
                        action={uploadAction} // 上传地址
                        beforeUpload={this.handleBeforeUploadPhoto}
                        onChange={this.handlePhotoUploadChange}
                      >
                        {photoDetails.length < 3 ? (
                          <div>
                            <Icon type={photoLoading ? 'loading' : 'plus'} />
                            <div className="ant-upload-text">上传</div>
                          </div>
                        ) : null}
                      </Upload>
                    </Fragment>
                  )}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label="注册照片示例">
                  <Fragment>
                    <img src={PIC} width="50%" height="25%" alt="" />
                  </Fragment>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div style={{ textAlign: 'center' }}>
            <Button
              onClick={() => {
                router.goBack();
              }}
              style={{ marginRight: '24px' }}
            >
              返回
            </Button>
            <Button disabled={submitting} type="primary" onClick={this.handleSubmit}>
              {submitting && <Icon type="loading" />}
              确定
            </Button>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
