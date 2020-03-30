import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, message, Row, Col, Input, Select, Upload } from 'antd';
import router from 'umi/router';
import { getToken } from '@/utils/authority';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { phoneReg } from '@/utils/validate';
const { Option } = Select;

// 标题
const addTitle = '新增人员信息';
const editTitle = '编辑人员信息';

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

@connect(({ personnelInfo, loading }) => ({
  personnelInfo,
  loading: loading.models.personnelInfo,
}))
@Form.create()
export default class PersonnelEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      picLoading: false, // 照片loading
      uploadPic: [], // 上传的照片
      detailList: {}, // 当前详情列表
    };
  }

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { listId },
      },
    } = this.props;
    if (id) {
      // 获取人员列表
      dispatch({
        type: 'personnelInfo/fetchPersonInfoList',
        payload: {
          pageSize: 18,
          pageNum: 1,
          companyId: listId,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const { photoDetails } = currentList;
          this.setState({
            uploadPic: photoDetails,
            detailList: currentList,
          });
        },
      });
    } else {
      dispatch({ type: 'personnelInfo/clearPersonnelDetail' });
    }
  }

  // 返回
  goBack = () => {
    const {
      location: {
        query: { listId },
      },
    } = this.props;
    router.push(`/personnel-management/personnel-info/personnel-list/${listId}`);
  };

  goCompanyList = () => {
    router.push(`/personnel-management/personnel-info/company-list`);
  };

  // 去除左右两边空白
  handleTrim = e => e.target.value.trim();

  // 提交
  handleSubmit = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { companyId, listId },
      },
      form: { validateFieldsAndScroll },
    } = this.props;

    const { uploadPic } = this.state;

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        this.setState({ submitting: true });
        const { name, sex, tel, duty, profession, personType, personCompany, workCode } = values;
        const payload = {
          companyId: companyId || listId,
          name,
          sex,
          tel,
          duty,
          profession,
          personType,
          personCompany,
          workCode,
          photo: JSON.stringify(
            uploadPic.map(({ name, webUrl, dbUrl }) => ({ name, webUrl, dbUrl }))
          ),
        };

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, companyId ? this.goCompanyList() : this.goBack());
          this.setState({ submitting: false });
          if (companyId) {
            // 获取单位列表
            dispatch({
              type: 'personnelInfo/fetchPersonCompanyList',
              payload: {
                pageSize: 18,
                pageNum: 1,
              },
            });
          } else {
            // 获取人员列表
            dispatch({
              type: 'personnelInfo/fetchPersonInfoList',
              payload: {
                companyId: companyId || listId,
                pageSize: 18,
                pageNum: 1,
              },
            });
          }
        };

        const error = () => {
          message.success(id ? '编辑失败' : '新增失败');
          this.setState({ submitting: false });
        };

        if (id) {
          dispatch({
            type: 'personnelInfo/fetchPersonInfoEdit',
            payload: {
              id,
              ...payload,
            },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'personnelInfo/fetchPersonInfoAdd',
            payload: {
              ...payload,
            },
            success,
            error,
          });
        }
      }
    });
  };

  // 上传文件
  handleUrlChange = ({ file, fileList }) => {
    const {
      form: { resetFields },
    } = this.props;
    const error = () => {
      resetFields(['photo']);
    };
    if (file.status === 'uploading') {
      this.setState({ picLoading: true });
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const {
          data: {
            list: [result],
          },
        } = file.response;
        this.setState({
          uploadPic: [{ ...result, webUrl: result.webUrl, dbUrl: result.dbUrl }],
        });
      } else {
        error();
      }
      this.setState({ picLoading: false });
    } else if (file.status === 'removed') {
      resetFields(['photo']);
    } else {
      error();
    }
  };

  // 上传照片之前的回调
  handleBeforeCoverLoad = file => {
    const { picLoading } = this.state;
    // 判断是否图片
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (picLoading) {
      message.error('尚未上传结束');
    }
    if (!isImage) {
      message.error('请上传jpg格式照片');
    }
    return isImage && !picLoading;
  };

  /* 渲染详情 */
  renderDetail() {
    const {
      form: { getFieldDecorator },
      personnelInfo: { sexTypeList, personnelTypeList },
      location: {
        query: { companyId },
      },
    } = this.props;

    const { picLoading, uploadPic, submitting, detailList } = this.state;
    const { name, sex, tel, duty, profession, personType, workCode, personCompany } = detailList;

    const uploadButton = (
      <div>
        <LegacyIcon type={picLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <Card title="人员基本信息" bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="姓名">
                {getFieldDecorator('name', {
                  initialValue: name,
                  rules: [{ required: true, message: '请输入姓名', whitespace: true }],
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入姓名" maxlength={15} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="性别">
                {getFieldDecorator('sex', {
                  initialValue: sex,
                  rules: [
                    {
                      required: true,
                      message: '请选择性别',
                    },
                  ],
                })(
                  <Select placeholder="请选择性别" allowClear>
                    {sexTypeList.map(({ key, value }) => (
                      <Option value={key} key={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col lg={8} md={12} sm={24}>
              <Form.Item label="手机号">
                {getFieldDecorator('tel', {
                  initialValue: tel,
                  rules: [
                    { required: true, message: '请输入手机号', whitespace: true },
                    { pattern: phoneReg, message: '联系电话格式不正确' },
                  ],
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入手机号" maxlength={15} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="职务">
                {getFieldDecorator('duty', {
                  initialValue: duty,
                  rules: [{ message: '请输入职务', whitespace: true }],
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入职务" maxlength={25} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="工种">
                {getFieldDecorator('profession', {
                  initialValue: profession,
                  rules: [{ message: '请输入工种', whitespace: true }],
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入工种" maxlength={25} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="人员类型">
                {getFieldDecorator('personType', {
                  initialValue: personType,
                  rules: [
                    {
                      required: true,
                      message: '请选择人员类型',
                    },
                  ],
                })(
                  <Select placeholder="请选择人员类型" allowClear>
                    {personnelTypeList.map(({ key, value }) => (
                      <Option value={key} key={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="所属单位">
                {getFieldDecorator('personCompany', {
                  initialValue: personCompany,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入所属单位' }],
                })(<Input placeholder="请输入所属单位" maxlength={25} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="作业证书编号">
                {getFieldDecorator('workCode', {
                  initialValue: workCode,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ message: '请输入作业证书编号', whitespace: true }],
                })(<Input placeholder="请输入作业证书编号" maxlength={30} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="照片">
                {getFieldDecorator('photo')(
                  <Upload
                    name="files"
                    listType="picture-card"
                    headers={{ 'JA-Token': getToken() }}
                    accept=".jpg,.png" // 接收的文件格式
                    data={{ folder: 'personnelInfo' }} // 附带的参数
                    showUploadList={false}
                    action={uploadAction} // 上传地址
                    beforeUpload={this.handleBeforeCoverLoad}
                    onChange={this.handleUrlChange}
                  >
                    {uploadPic.length > 0 ? (
                      <img
                        src={uploadPic.map(item => item.webUrl).join('')}
                        alt="照片"
                        style={{ width: '100%' }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Button
            onClick={companyId ? this.goCompanyList : this.goBack}
            style={{ marginRight: '24px' }}
          >
            返回
          </Button>
          <Button type="primary" onClick={this.handleSubmit} loading={submitting || picLoading}>
            确定
          </Button>
        </div>
      </Card>
    );
  }

  render() {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { listId, companyId },
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
        title: '人员在岗在位管理',
        name: '人员在岗在位管理',
      },
      {
        title: companyId ? '企业列表' : '人员基本信息',
        name: companyId ? '企业列表' : '人员基本信息',
        href: companyId
          ? '/personnel-management/personnel-info/company-list'
          : `/personnel-management/personnel-info/personnel-list/${listId}`,
      },
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderDetail()}
      </PageHeaderLayout>
    );
  }
}
