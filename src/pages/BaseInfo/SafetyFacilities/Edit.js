import { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Form,
  Input,
  Radio,
  Cascader,
  Select,
  Upload,
  DatePicker,
  Icon,
  message,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import router from 'umi/router';
import moment from 'moment';
import { getToken } from 'utils/authority';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';

const FormItem = Form.Item;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };

// 获取根节点
const getRootChild = () => document.querySelector('#root>div');

// 上传文件夹
const folder = 'dangerChemicalsInfo';
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

// 权限
const {
  baseInfo: {
    safetyFacilities: { edit: editAuth },
  },
} = codes;

@Form.create()
@connect(({ safeFacilities, user, videoMonitor, loading }) => ({
  safeFacilities,
  videoMonitor,
  user,
  loading: loading.models.safeFacilities,
}))
export default class Edit extends PureComponent {
  state = {
    companyVisible: false, // 弹框是否显示
    uploading: false, // 上传是否加载
    photoUrl: [], // 上传照片
    detailList: {},
    facNameList: [],
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      safeFacilities: { facNameList = [] },
    } = this.props;

    if (id) {
      dispatch({
        type: 'safeFacilities/fetchSafeFacList',
        payload: {
          pageSize: 48,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const { photoList } = currentList;
          this.setState({
            detailList: currentList,
            photoUrl: photoList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
          });
        },
      });
      this.setState({ facNameList: facNameList });
    } else {
      dispatch({
        type: 'safeFacilities/clearSafeFacDetail',
      });
    }
  }

  goBack = () => {
    router.push('/base-info/safety-facilities/list');
  };

  isDetail = () => {
    const {
      match: { url },
    } = this.props;
    return url && url.includes('view');
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  handleSubmit = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { validateFieldsAndScroll },
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { photoUrl } = this.state;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const {
          category,
          safeFacilitiesName,
          specifications,
          processFacilitiesInvolved,
          equipNumber,
          equipStatus,
          productFactory,
          leaveFactoryDate,
          useYear,
          notes,
        } = values;
        const payload = {
          id,
          companyId: this.companyId || companyId,
          category: category.join(','),
          safeFacilitiesName,
          specifications,
          processFacilitiesInvolved,
          equipNumber,
          equipStatus,
          productFactory,
          leaveFactoryDate: leaveFactoryDate ? leaveFactoryDate.format('YYYY-MM-DD') : undefined,
          useYear,
          notes,
          photo: photoUrl.length>0
            ? JSON.stringify(photoUrl.map(({ name, url, dbUrl }) => ({ name, webUrl: url, dbUrl })))
            : undefined,
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
            type: 'safeFacilities/fetchSafeFacEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'safeFacilities/fetchSafeFacAdd',
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
    } else if (file.status === 'removed') {
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

  onChangeCascader = val => {
    const {
      safeFacilities: { facNameList = [] },
    } = this.props;
    this.setState({ facNameList: facNameList });
  };

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator },
      safeFacilities: { categoryList = [] },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const { uploading, photoUrl, detailList, facNameList } = this.state;

    const {
      companyName,
      category,
      safeFacilitiesName,
      specifications,
      processFacilitiesInvolved,
      equipNumber,
      equipStatus,
      productFactory,
      leaveFactoryDate,
      useYear,
      notes,
      // photo,
    } = detailList;
    return (
      <Card>
        <Form>
          {unitType !== 4 && (
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
              {!this.isDetail() && (
                <Button type="primary" onClick={this.handleCompanyModal}>
                  选择单位
                </Button>
              )}
            </FormItem>
          )}
          <FormItem label="分类" {...formItemLayout}>
            {getFieldDecorator('category', {
              initialValue: category ? [category.split(',')[0], category.split(',')[1]] : [],
              rules: [
                {
                  required: true,
                  message: '请选择分类',
                },
              ],
            })(
              <Cascader
                {...itemStyles}
                placeholder="请选择"
                options={categoryList}
                allowClear
                changeOnSelect
                notFoundContent
                onChange={this.onChangeCascader}
                getPopupContainer={getRootChild}
              />
            )}
          </FormItem>
          <FormItem label="安全设施名称" {...formItemLayout}>
            {getFieldDecorator('safeFacilitiesName', {
              initialValue: safeFacilitiesName,
              rules: [{ required: true, message: '请输入安全设施名称' }],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择安全设施名称">
                {facNameList.map(({ key, label }) => (
                  <Select.Option key={key} value={key}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="规格型号" {...formItemLayout}>
            {getFieldDecorator('specifications', {
              initialValue: specifications,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入规格型号' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="涉及工艺设施" {...formItemLayout}>
            {getFieldDecorator('processFacilitiesInvolved', {
              initialValue: processFacilitiesInvolved,
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="设备数量" {...formItemLayout}>
            {getFieldDecorator('equipNumber', {
              initialValue: equipNumber,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入设备数量' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="设备状态" {...formItemLayout}>
            {getFieldDecorator('equipStatus', {
              initialValue: +equipStatus,
              rules: [{ required: true, message: '请选择设备状态' }],
            })(
              <Radio.Group>
                <Radio value={1}>正常</Radio>
                <Radio value={2}>维检</Radio>
                <Radio value={3}>报废</Radio>
                <Radio value={4}>使用中</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="生产厂家" {...formItemLayout}>
            {getFieldDecorator('productFactory', {
              initialValue: productFactory,
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="出厂日期" {...formItemLayout}>
            {getFieldDecorator('leaveFactoryDate', {
              initialValue: leaveFactoryDate ? moment(+leaveFactoryDate) : undefined,
            })(<DatePicker placeholder="请选择" format="YYYY-MM-DD" {...itemStyles} />)}
          </FormItem>
          <FormItem label="使用年限" {...formItemLayout}>
            {getFieldDecorator('useYear', {
              initialValue: useYear,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  message: '请输入使用年限，只能输入正整数',
                  pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                },
              ],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="备注" {...formItemLayout}>
            {getFieldDecorator('notes', {
              initialValue: notes,
              getValueFromEvent: this.handleTrim,
            })(<TextArea {...itemStyles} placeholder="请输入" />)}
          </FormItem>
          <FormItem label="图片" {...formItemLayout}>
            {getFieldDecorator('photo', {
              initialValue: photoUrl,
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
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const { uploading } = this.state;
    const title = this.isDetail() ? '详情' : id ? '编辑' : '新增';
    const editCode = hasAuthority(editAuth, permissionCodes);

    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
      },
      {
        title: '一企一档',
        name: '一企一档',
      },
      {
        title: '安全设施',
        name: '安全设施',
        href: '/base-info/safety-facilities/list',
      },
      {
        title,
        name: title,
      },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
        {!this.isDetail() && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span>
              <Button
                style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
                type="primary"
                size="large"
                onClick={this.handleSubmit}
                loading={uploading}
              >
                提交
              </Button>
            </span>

            <span style={{ marginLeft: 10 }}>
              <Button
                style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
                size="large"
                href={`#/base-info/safety-facilities/list`}
              >
                返回
              </Button>
            </span>
          </div>
        )}

        {this.isDetail() && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <span>
              <Button
                style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
                type="primary"
                size="large"
                disabled={!editCode}
                href={`#/base-info/safety-facilities/edit/${id}`}
              >
                编辑
              </Button>
            </span>

            <span style={{ marginLeft: 10 }}>
              <Button
                style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
                size="large"
                href={`#/base-info/safety-facilities/list`}
              >
                返回
              </Button>
            </span>
          </div>
        )}

        {this.renderModal()}
      </PageHeaderLayout>
    );
  }
}
