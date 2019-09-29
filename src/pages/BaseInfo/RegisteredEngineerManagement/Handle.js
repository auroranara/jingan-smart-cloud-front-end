import { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Input, Select, Upload, DatePicker, Icon, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import router from 'umi/router';
import moment from 'moment';
import { getToken } from 'utils/authority';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';

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

const dateFormat = 'YYYY-MM-DD';

// 上传文件夹
const folder = 'dangerChemicalsInfo';
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

@Form.create()
@connect(({ reservoirRegion, industrialProductLicence, videoMonitor, loading }) => ({
  reservoirRegion,
  videoMonitor,
  industrialProductLicence,
  loading: loading.models.industrialProductLicence,
}))
export default class industrialEdit extends PureComponent {
  state = {
    companyVisible: false, // 弹框是否显示
    uploading: false, // 上传是否加载
    photoUrl: [], // 上传照片
    detailList: {},
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    if (id) {
      dispatch({
        type: 'reservoirRegion/fetchCertificateList',
        payload: {
          pageSize: 10,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const { certificateFileList } = currentList;
          this.setState({
            detailList: currentList,
            photoUrl: certificateFileList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              webUrl,
              dbUrl,
            })),
          });
        },
      });
    } else {
      dispatch({
        type: 'reservoirRegion/clearCertificateDetail',
      });
    }
  }

  goBack = () => {
    router.push(listUrl);
  };

  handleSubmit = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { photoUrl } = this.state;
        console.log('photoUrl', photoUrl);
        const {
          issuingType,
          certificateState,
          issuingOrgan,
          issuingDate,
          certificateNumber,
          period: [startTime, endTime],
          permissionScope,
        } = values;
        const payload = {
          id,
          companyId: this.companyId,
          issuingType,
          certificateState,
          issuingOrgan,
          issuingDate: issuingDate.format('YYYY-MM-DD'),
          startDate: startTime.format('YYYY-MM-DD'),
          endDate: endTime.format('YYYY-MM-DD'),
          certificateNumber,
          permissionScope,
          certificateFile: JSON.stringify(
            photoUrl.map(({ name, url, dbUrl }) => ({ name, webUrl: url, dbUrl }))
          ),
        };

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };

        const error = () => {
          message.error(id ? '编辑失败' : '新增失败');
        };

        if (id) {
          dispatch({
            type: 'reservoirRegion/fetchCertificateEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'reservoirRegion/fetchCertificateAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  // 显示企业弹框
  handleCompanyModal = () => {
    this.setState({ companyVisible: true });
    const payload = { pageSize: 10, pageNum: 1 };
    this.fetchCompany({ payload });
  };

  // 获取企业列表
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'videoMonitor/fetchModelList', payload });
  };

  // 关闭企业弹框
  handleClose = () => {
    this.setState({ companyVisible: false });
  };

  // 选择企业
  handleSelect = item => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { id, name } = item;
    setFieldsValue({
      companyId: name,
    });
    this.companyId = id;
    this.handleClose();
  };

  // 渲染企业模态框
  renderModal() {
    const {
      videoMonitor: { modal },
      loading,
    } = this.props;
    const { companyVisible } = this.state;
    return (
      <CompanyModal
        loading={loading}
        visible={companyVisible}
        modal={modal}
        fetch={this.fetchCompany}
        onSelect={this.handleSelect}
        onClose={this.handleClose}
      />
    );
  }

  handleUploadChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        photoUrl: fileList,
        uploading: true,
      });
    } else if (file.status === 'done' && file.response.code === 200) {
      const {
        data: {
          list: [result],
        },
      } = file.response;
      if (result) {
        this.setState({
          photoUrl: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              };
            }
            return item;
          }),
          uploading: false,
        });
        message.success('上传成功！');
      }
    } else if (status === 'removed') {
      // 删除
      this.setState({
        photoUrl: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        uploading: false,
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        photoUrl: fileList.filter(item => {
          return item.status !== 'error';
        }),
        uploading: false,
      });
    }
  };

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator },
      industrialProductLicence: { sexList, engineerLevelList, specialityList },
    } = this.props;
    const { uploading, photoUrl, detailList } = this.state;

    const {
      companyName,
      issuingType,
      certificateState,
      issuingOrgan,
      issuingDate,
      startDate,
      endDate,
      certificateNumber,
      permissionScope,
    } = detailList;

    return (
      <Card>
        <Form>
          <FormItem label="单位名称" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              initialValue: companyName,
              rules: [{ required: true, message: '请选择单位名称' }],
            })(
              <Input
                {...itemStyles}
                ref={input => {
                  this.CompanyIdInput = input;
                }}
                disabled
                placeholder="请选择"
              />
            )}
            <Button type="primary" onClick={this.handleCompanyModal}>
              选择单位
            </Button>
          </FormItem>
          <FormItem label="姓名" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: issuingOrgan,
              rules: [{ required: true, message: '请输入姓名' }],
            })(<Input placeholder="请输入姓名" {...itemStyles} />)}
          </FormItem>
          <FormItem label="性别" {...formItemLayout}>
            {getFieldDecorator('issuingType', {
              initialValue: issuingType,
              rules: [{ required: true, message: '请选择性别' }],
            })(
              <Select placeholder="请选择性别" {...itemStyles}>
                {sexList.map(({ key, value }) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="出生年月" {...formItemLayout}>
            {getFieldDecorator('issuingDate', {
              initialValue: issuingDate ? moment(+issuingDate) : '',
              rules: [{ required: true, message: '请选择出生年月' }],
            })(
              <DatePicker
                placeholder="请选择出生年月"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="联系电话" {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: issuingOrgan,
              rules: [{ required: true, message: '请输入联系电话' }],
            })(<Input placeholder="请输入联系电话" {...itemStyles} />)}
          </FormItem>
          <FormItem label="工程师级别" {...formItemLayout}>
            {getFieldDecorator('certificateState', {
              initialValue: certificateState,
              rules: [{ required: true, message: '请选择工程师级别' }],
            })(
              <Select placeholder="请选择工程师级别" {...itemStyles}>
                {engineerLevelList.map(({ key, value }) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="专业类别" {...formItemLayout}>
            {getFieldDecorator('issuingOrgan', {
              initialValue: issuingOrgan,
              rules: [{ required: true, message: '请输入专业类别' }],
            })(
              <Select placeholder="请选择专业类别" {...itemStyles}>
                {specialityList.map(({ key, value }) => (
                  <Select.Option key={key} value={key}>
                    {value}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="执业资格证书编号" {...formItemLayout}>
            {getFieldDecorator('certificateNumber', {
              initialValue: certificateNumber,
              rules: [{ required: true, message: '请输入执业资格证书编号' }],
            })(<Input placeholder="请输入执业资格证书编号" {...itemStyles} />)}
          </FormItem>
          <FormItem label="注册日期" {...formItemLayout}>
            {getFieldDecorator('issuingDate', {
              initialValue: issuingDate ? moment(+issuingDate) : '',
              rules: [{ required: true, message: '请选择注册日期' }],
            })(
              <DatePicker
                placeholder="请选择注册日期"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="注册证书编号" {...formItemLayout}>
            {getFieldDecorator('certificateNumber', {
              initialValue: certificateNumber,
              rules: [{ required: true, message: '请输入注册证书编号' }],
            })(<Input placeholder="请输入注册证书编号" {...itemStyles} />)}
          </FormItem>
          <FormItem label="注册有效日期" {...formItemLayout}>
            {getFieldDecorator('period', {
              initialValue: startDate && endDate ? [moment(+startDate), moment(+endDate)] : [],
              rules: [{ required: true, message: '请选择注册有效日期' }],
            })(
              <RangePicker
                {...itemStyles}
                format={dateFormat}
                getCalendarContainer={getRootChild}
              />
            )}
          </FormItem>
          <FormItem label="执业资格证书附件" {...formItemLayout}>
            {getFieldDecorator('certificateFile', {
              initialValue: photoUrl,
              rules: [{ required: true, message: '请上传执业资格证书附件' }],
            })(
              <Upload
                name="files"
                accept=".jpg,.png" // 接受的文件格式
                headers={{ 'JA-Token': getToken() }} // 上传的请求头部
                data={{ folder }} // 附带参数
                action={uploadAction} // 上传地址
                fileList={photoUrl}
                onChange={this.handleUploadChange}
              >
                <Button
                  type="dashed"
                  style={{ width: '96px', height: '96px' }}
                  disabled={uploading}
                >
                  <Icon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="注册证书附件" {...formItemLayout}>
            {getFieldDecorator('certificateFile', {
              initialValue: photoUrl,
              rules: [{ required: true, message: '请上传注册证书附件' }],
            })(
              <Upload
                name="files"
                accept=".jpg,.png" // 接受的文件格式
                headers={{ 'JA-Token': getToken() }} // 上传的请求头部
                data={{ folder }} // 附带参数
                action={uploadAction} // 上传地址
                fileList={photoUrl}
                onChange={this.handleUploadChange}
              >
                <Button
                  type="dashed"
                  style={{ width: '96px', height: '96px' }}
                  disabled={uploading}
                >
                  <Icon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem>
        </Form>
      </Card>
    );
  };

  render() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const title = id ? '编辑许可证' : '新增许可证';
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
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
        <Button
          style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
          type="primary"
          onClick={this.handleSubmit}
        >
          提交
        </Button>
        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
