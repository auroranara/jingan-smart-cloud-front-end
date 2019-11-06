import { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Input, Select, Upload, DatePicker, Icon, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import FooterToolbar from '@/components/FooterToolbar';
import router from 'umi/router';
import moment from 'moment';
import { getToken } from 'utils/authority';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };

// 上传文件夹
const folder = 'safetyEngInfo';
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

@Form.create()
@connect(({ reservoirRegion, videoMonitor, loading }) => ({
  reservoirRegion,
  videoMonitor,
  loading: loading.models.reservoirRegion,
}))
export default class RegSafetyEngEdit extends PureComponent {
  state = {
    companyVisible: false, // 弹框是否显示
    requireFilesList: [],
    regFilesList: [],
    reqUploading: false, // 上传是否加载
    regUploading: false,
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
        type: 'reservoirRegion/fetchSafetyEngList',
        payload: {
          pageSize: 48,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const { requirementsFilesList, regFilesList } = currentList;
          this.setState({
            detailList: currentList,
            requireFilesList: requirementsFilesList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
            regFilesList: regFilesList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
          });
        },
      });
    } else {
      dispatch({
        type: 'reservoirRegion/clearSafetyEngDetail',
      });
    }
  }

  goBack = () => {
    router.push('/base-info/registered-engineer-management/list');
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
        const { requireFilesList, regFilesList } = this.state;
        const {
          name,
          sex,
          birth,
          phone,
          level,
          category,
          requirementsCode,
          regDate,
          regCode,
          period: [startTime, endTime],
        } = values;
        const payload = {
          id,
          companyId: this.companyId,
          name,
          sex,
          birth: birth.format('YYYY-MM-DD'),
          phone,
          level,
          category,
          requirementsCode,
          regDate: regDate.format('YYYY-MM-DD'),
          regCode,
          startDate: startTime.format('YYYY-MM-DD'),
          endDate: endTime.format('YYYY-MM-DD'),
          requirementsFilesList: requireFilesList.map(({ name, url, dbUrl }) => ({
            name,
            webUrl: url,
            dbUrl,
          })),
          regFilesList: regFilesList.map(({ name, url, dbUrl }) => ({ name, webUrl: url, dbUrl })),
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
            type: 'reservoirRegion/fetchSafetyEngEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'reservoirRegion/fetchSafetyEngAdd',
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
        requireFilesList: fileList,
        reqUploading: true,
      });
    } else if (file.status === 'done' && file.response.code === 200) {
      const {
        data: {
          list: [result],
        },
      } = file.response;
      if (result) {
        this.setState({
          requireFilesList: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              };
            }
            return item;
          }),
          reqUploading: false,
        });
        message.success('上传成功！');
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        requireFilesList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        reqUploading: false,
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        requireFilesList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        reqUploading: false,
      });
    }
  };

  handleRegUploadChange = ({ file, fileList }) => {
    if (file.status === 'uploading') {
      this.setState({
        regFilesList: fileList,
        regUploading: true,
      });
    } else if (file.status === 'done' && file.response.code === 200) {
      const {
        data: {
          list: [result],
        },
      } = file.response;
      if (result) {
        this.setState({
          regFilesList: fileList.map(item => {
            if (!item.url && item.response) {
              return {
                ...item,
                url: result.webUrl,
                dbUrl: result.dbUrl,
              };
            }
            return item;
          }),
          regUploading: false,
        });
        message.success('上传成功！');
      }
    } else if (file.status === 'removed') {
      // 删除
      this.setState({
        regFilesList: fileList.filter(item => {
          return item.status !== 'removed';
        }),
        regUploading: false,
      });
    } else {
      // error
      message.error('上传失败！');
      this.setState({
        regFilesList: fileList.filter(item => {
          return item.status !== 'error';
        }),
        regUploading: false,
      });
    }
  };

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator },
      reservoirRegion: { sexList, engineerLevelList, specialityList },
    } = this.props;
    const { reqUploading, regUploading, requireFilesList, regFilesList, detailList } = this.state;

    const {
      companyName,
      name,
      sex,
      birth,
      phone,
      level,
      category,
      requirementsCode,
      regDate,
      regCode,
      startDate,
      endDate,
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
                placeholder="请选择单位名称"
              />
            )}
            <Button type="primary" onClick={this.handleCompanyModal}>
              选择单位
            </Button>
          </FormItem>
          <FormItem label="姓名" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入姓名' }],
            })(<Input placeholder="请输入姓名" {...itemStyles} />)}
          </FormItem>
          <FormItem label="性别" {...formItemLayout}>
            {getFieldDecorator('sex', {
              initialValue: sex,
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
            {getFieldDecorator('birth', {
              initialValue: birth ? moment(+birth) : undefined,
              rules: [{ required: true, message: '请选择出生年月' }],
            })(<DatePicker placeholder="请选择出生年月" format="YYYY-MM-DD" {...itemStyles} />)}
          </FormItem>
          <FormItem label="联系电话" {...formItemLayout}>
            {getFieldDecorator('phone', {
              initialValue: phone,
              rules: [{ required: true, message: '请输入联系电话' }],
            })(<Input placeholder="请输入联系电话" {...itemStyles} />)}
          </FormItem>
          <FormItem label="工程师级别" {...formItemLayout}>
            {getFieldDecorator('level', {
              initialValue: level,
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
            {getFieldDecorator('category', {
              initialValue: category,
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
            {getFieldDecorator('requirementsCode', {
              initialValue: requirementsCode,
              rules: [{ required: true, message: '请输入执业资格证书编号' }],
            })(<Input placeholder="请输入执业资格证书编号" {...itemStyles} />)}
          </FormItem>
          <FormItem label="注册日期" {...formItemLayout}>
            {getFieldDecorator('regDate', {
              initialValue: regDate ? moment(+regDate) : undefined,
              rules: [{ required: true, message: '请选择注册日期' }],
            })(<DatePicker placeholder="请选择注册日期" format="YYYY-MM-DD" {...itemStyles} />)}
          </FormItem>
          <FormItem label="注册证书编号" {...formItemLayout}>
            {getFieldDecorator('regCode', {
              initialValue: regCode,
              rules: [{ required: true, message: '请输入注册证书编号' }],
            })(<Input placeholder="请输入注册证书编号" {...itemStyles} />)}
          </FormItem>
          <FormItem label="注册有效日期" {...formItemLayout}>
            {getFieldDecorator('period', {
              initialValue: startDate && endDate ? [moment(+startDate), moment(+endDate)] : [],
              rules: [{ required: true, message: '请选择注册有效日期' }],
            })(<RangePicker {...itemStyles} format="YYYY-MM-DD" />)}
          </FormItem>
          <FormItem label="执业资格证书附件" {...formItemLayout}>
            {getFieldDecorator('requireFilesList', {
              initialValue: requireFilesList,
              // rules: [{ required: true, message: '请上传执业资格证书附件' }],
            })(
              <Upload
                name="files"
                accept=".jpg,.png" // 接受的文件格式
                headers={{ 'JA-Token': getToken() }} // 上传的请求头部
                data={{ folder }} // 附带参数
                action={uploadAction} // 上传地址
                fileList={requireFilesList}
                onChange={this.handleUploadChange}
              >
                <Button
                  type="dashed"
                  style={{ width: '96px', height: '96px' }}
                  disabled={reqUploading}
                >
                  <Icon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="注册证书附件" {...formItemLayout}>
            {getFieldDecorator('regFilesList', {
              initialValue: regFilesList,
              // rules: [{ required: true, message: '请上传注册证书附件' }],
            })(
              <Upload
                name="files"
                accept=".jpg,.png" // 接受的文件格式
                headers={{ 'JA-Token': getToken() }} // 上传的请求头部
                data={{ folder }} // 附带参数
                action={uploadAction} // 上传地址
                fileList={regFilesList}
                onChange={this.handleRegUploadChange}
              >
                <Button
                  type="dashed"
                  style={{ width: '96px', height: '96px' }}
                  disabled={regUploading}
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

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { regUploading, reqUploading } = this.state;
    return (
      <FooterToolbar>
        <Button
          type="primary"
          size="large"
          loading={reqUploading || regUploading}
          onClick={this.handleSubmit}
        >
          提交
        </Button>
        <Button type="primary" size="large" onClick={this.goBack}>
          返回
        </Button>
      </FooterToolbar>
    );
  }

  render() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const title = id ? '编辑人员' : '新增人员';
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '一企一档',
        name: '一企一档',
      },
      {
        title: '注册安全工程师管理',
        name: '注册安全工程师管理',
        href: '/base-info/registered-engineer-management/list',
      },
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
        {this.renderModal()}
        {this.renderFooterToolbar()}{' '}
      </PageHeaderLayout>
    );
  }
}
