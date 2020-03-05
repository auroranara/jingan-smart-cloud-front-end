import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, message, Row, Col, Input, Select, Upload, DatePicker } from 'antd';
import router from 'umi/router';
import { getToken } from '@/utils/authority';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { phoneReg } from '@/utils/validate';
import moment from 'moment';
const { Option } = Select;

// 标题
const addTitle = '新增车辆信息';
const editTitle = '编辑车辆信息';

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

@connect(({ personnelInfo, loading }) => ({
  personnelInfo,
  loading: loading.models.personnelInfo,
}))
@Form.create()
export default class VehicleEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      picLoading: false, // 照片loading
      uploadPic: [], // 上传的照片
      detailList: {},
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
        type: 'personnelInfo/fetchVehicleInfoList',
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
      dispatch({ type: 'personnelInfo/clearVehicleDetail' });
    }
  }

  // 返回
  goBack = () => {
    const {
      location: {
        query: { listId },
      },
    } = this.props;
    router.push(`/personnel-management/vehicle-info/vehicle-list/${listId}`);
  };

  goCompanyList = () => {
    router.push(`/personnel-management/vehicle-info/company-list`);
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
        const {
          number,
          brand,
          model,
          type,
          produceDate,
          buyDate,
          load,
          carCompany,
          driver,
          driverTel,
          supercargo,
          supercargoTel,
          state,
        } = values;
        const payload = {
          companyId: companyId || listId,
          number,
          brand,
          model,
          type,
          produceDate: produceDate && produceDate.format('YYYY-MM-DD'),
          buyDate: buyDate && buyDate.format('YYYY-MM-DD'),
          load,
          carCompany,
          driver,
          driverTel,
          supercargo,
          supercargoTel,
          state,
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
              type: 'personnelInfo/fetchVehicleCompanyList',
              payload: {
                pageSize: 18,
                pageNum: 1,
              },
            });
          } else {
            // 获取人员列表
            dispatch({
              type: 'personnelInfo/fetchVehicleInfoList',
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
            type: 'personnelInfo/fetchVehicleInfoEdit',
            payload: {
              id,
              ...payload,
            },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'personnelInfo/fetchVehiclefoAdd',
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
      personnelInfo: { vehicleType },
      location: {
        query: { companyId },
      },
    } = this.props;

    const { picLoading, uploadPic, submitting, detailList } = this.state;

    const {
      number,
      brand,
      model,
      type,
      produceDate,
      buyDate,
      load,
      carCompany,
      driver,
      driverTel,
      supercargo,
      supercargoTel,
      state,
    } = detailList;

    const uploadButton = (
      <div>
        <LegacyIcon type={picLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <Card title="车辆基本信息" bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="车牌号">
                {getFieldDecorator('number', {
                  initialValue: number,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入车牌号', whitespace: true }],
                })(<Input placeholder="请输入车牌号" maxlength={10} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="品牌">
                {getFieldDecorator('brand', {
                  initialValue: brand,
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入品牌" maxlength={10} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="型号">
                {getFieldDecorator('model', {
                  initialValue: model,
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入型号" maxlength={10} />)}
              </Form.Item>
            </Col>

            <Col lg={8} md={12} sm={24}>
              <Form.Item label="车辆类型">
                {getFieldDecorator('type', {
                  initialValue: type,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入车辆类型', whitespace: true }],
                })(<Input placeholder="请输入车辆类型" maxlength={10} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="生产日期">
                {getFieldDecorator('produceDate', {
                  initialValue: produceDate ? moment(+produceDate) : undefined,
                })(
                  <DatePicker
                    showToday={false}
                    placeholder="请选择生产日期"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="购买日期">
                {getFieldDecorator('buyDate', {
                  initialValue: buyDate ? moment(+buyDate) : undefined,
                })(
                  <DatePicker
                    showToday={false}
                    placeholder="请选择购买日期"
                    style={{ width: '100%' }}
                  />
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="载重">
                {getFieldDecorator('load', {
                  initialValue: load,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入载重', whitespace: true }],
                })(<Input placeholder="请输入载重" maxlength={10} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="所属单位">
                {getFieldDecorator('carCompany', {
                  initialValue: carCompany,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入所属单位', whitespace: true }],
                })(<Input placeholder="请输入所属单位" maxlength={16} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="驾驶员">
                {getFieldDecorator('driver', {
                  initialValue: driver,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入驾驶员姓名', whitespace: true }],
                })(<Input placeholder="请输入驾驶员姓名" maxlength={10} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="联系电话">
                {getFieldDecorator('driverTel', {
                  initialValue: driverTel,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: true, message: '请输入驾驶员联系电话', whitespace: true },
                    { pattern: phoneReg, message: '联系电话格式不正确' },
                  ],
                })(<Input placeholder="请输入驾驶员联系电话" maxlength={12} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="押运员">
                {getFieldDecorator('supercargo', {
                  initialValue: supercargo,
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入押运员" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="联系电话">
                {getFieldDecorator('supercargoTel', {
                  initialValue: supercargoTel,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: false, message: '请输入押运员联系电话', whitespace: true },
                    { pattern: phoneReg, message: '联系电话格式不正确' },
                  ],
                })(<Input placeholder="请输入押运员联系电话" maxlength={12} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="当前状态">
                {getFieldDecorator('state', {
                  initialValue: state,
                  rules: [
                    {
                      required: true,
                      message: '请选择当前状态',
                    },
                  ],
                })(
                  <Select placeholder="请选择当前状态" allowClear>
                    {vehicleType.map(({ key, value }) => (
                      <Option value={key} key={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="车辆照片">
                {getFieldDecorator('photo')(
                  <Upload
                    name="files"
                    listType="picture-card"
                    headers={{ 'JA-Token': getToken() }}
                    accept=".jpg,.png" // 接收的文件格式
                    data={{ folder: 'carInfo' }} // 附带的参数
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
        title: companyId ? '企业列表' : '车辆基本信息',
        name: companyId ? '企业列表' : '车辆基本信息',
        href: companyId
          ? '/personnel-management/vehicle-info/company-list'
          : `/personnel-management/vehicle-info/vehicle-list/${listId}`,
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
