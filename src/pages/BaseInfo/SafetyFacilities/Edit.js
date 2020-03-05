import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Button, Input, Radio, Cascader, Select, Upload, DatePicker, message } from 'antd';
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
const itemsStyle = { style: { width: 'calc(34.5%)', marginRight: '10px' } };
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
@connect(({ safeFacilities, user, baseInfo, videoMonitor, loading }) => ({
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
    categoryOneId: '', // 分类一列表选中Id
    categoryTwoId: '', // 分类二列表选中Id
    categoryOneName: undefined, // 分类一列表选中名称
    categoryTwoName: undefined, // 分类二列表选中名称
    categoryOneList: [], // 分类一列表
    categoryTwoList: [], // 分类二列表
    facilitiesNameList: [], // 安全设施名称列表
    editCompany: '',
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
    } = this.props;

    if (id) {
      dispatch({
        type: 'safeFacilities/fetchSafeFacList',
        payload: {
          id,
          pageSize: 10,
          pageNum: 1,
        },
        callback: res => {
          const { list } = res;
          const currentList = list.find(item => item.id === id) || {};
          const { photoList, category, safeFacilitiesName, companyId, categoryName } = currentList;
          const categoryArray = category ? category.split(',') : '';

          this.setState({
            categoryOneName: categoryName[0],
            categoryTwoName: categoryName[1],
            categoryOneId: categoryArray[0],
            categoryTwoId: categoryArray[1],
            safeFacilitiesNameId: safeFacilitiesName,
            detailList: currentList,
            editCompany: companyId,
            photoUrl: photoList.map(({ dbUrl, webUrl }, index) => ({
              uid: index,
              status: 'done',
              name: `附件${index + 1}`,
              url: webUrl,
              dbUrl,
            })),
          });
          setFieldsValue({ category });
          this.fetchDict({
            payload: { type: 'safeFacilities', parentId: categoryArray[0] },
            callback: list => {
              this.setState({ categoryTwoList: list });
              this.fetchDict({
                payload: { type: 'safeFacilities', parentId: categoryArray[1] },
                callback: list => {
                  this.setState({ facilitiesNameList: list });
                },
              });
            },
          });
        },
      });
    } else {
      dispatch({
        type: 'safeFacilities/clearSafeFacDetail',
      });
    }
    this.fetchDict({
      payload: { type: 'safeFacilities', parentId: 0 },
      callback: list => {
        this.setState({ categoryOneList: list });
      },
    });
  }

  // 获取字典
  fetchDict = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/fetchDict',
      ...actions,
    });
  };

  goBack = () => {
    router.push('/facility-management/safety-facilities/list');
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
    const {
      photoUrl,
      categoryOneId,
      safeFacilitiesNameId,
      editCompany,
      categoryTwoId,
    } = this.state;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const {
          specifications,
          processFacilitiesInvolved,
          equipNumber,
          equipStatus,
          productFactory,
          leaveFactoryDate,
          useYear,
          notes,
          equipName,
          leaveProductNumber,
          installPart,
          useDate,
        } = values;
        const payload = {
          id,
          companyId: this.companyId || companyId || editCompany,
          category: categoryOneId + ',' + categoryTwoId,
          safeFacilitiesName: safeFacilitiesNameId,
          specifications,
          processFacilitiesInvolved,
          equipNumber,
          installPart,
          equipStatus,
          equipName,
          useDate: useDate ? useDate.format('YYYY-MM-DD') : undefined,
          leaveProductNumber,
          productFactory,
          leaveFactoryDate: leaveFactoryDate ? leaveFactoryDate.format('YYYY-MM-DD') : undefined,
          useYear,
          notes,
          photo:
            photoUrl.length > 0
              ? JSON.stringify(
                  photoUrl.map(({ name, url, dbUrl }) => ({ name, webUrl: url, dbUrl }))
                )
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
    } else if (file.status === 'error') {
      this.setState({
        photoUrl: [],
        uploading: false,
      });
    }
  };

  // 上传附件之前的回调
  handleBeforeUpload = file => {
    const { uploading } = this.state;
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (uploading) {
      message.error('尚未上传结束');
    }
    if (!isImage) {
      message.error('上传失败，请上传jpg格式或者png格式图片');
    }
    return isImage && !uploading;
  };

  handleCategoryOneChange = val => {
    const {
      form: { setFieldsValue },
    } = this.props;

    const { categoryOneList } = this.state;
    const typeOneName = categoryOneList.filter(item => item.id === val).map(item => item.label);
    this.setState({ categoryOneName: typeOneName });

    if (val) {
      this.fetchDict({
        payload: { type: 'safeFacilities', parentId: val },
        callback: list => {
          this.setState({ categoryTwoList: list });
        },
      });
    } else this.setState({ categoryOneList: [] });
    this.setState({ categoryOneId: val });
    setFieldsValue({ category: val });
  };

  handleCategoryTwoChange = val => {
    const {
      form: { setFieldsValue },
    } = this.props;

    const { categoryTwoList } = this.state;
    const typeTwoName = categoryTwoList.filter(item => item.id === val).map(item => item.label);
    this.setState({ categoryTwoName: typeTwoName });

    if (val) {
      this.fetchDict({
        payload: { type: 'safeFacilities', parentId: val },
        callback: list => {
          this.setState({ facilitiesNameList: list });
        },
      });
    } else this.setState({ categoryTwoList: [] });
    this.setState({ categoryTwoId: val });
    setFieldsValue({ category: val });
  };

  handleNameChange = id => {
    this.setState({ safeFacilitiesNameId: id });
  };

  handleCategoryOneSelect = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({
      categoryTwoId: '',
      categoryTwoName: '',
      safeFacilitiesNameId: '',
    });
    setFieldsValue({ safeFacilitiesName: '' });
  };

  handleCategoryTwoSelect = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({
      safeFacilitiesNameId: '',
    });
    setFieldsValue({ safeFacilitiesName: '' });
  };

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator, getFieldValue },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const {
      uploading,
      photoUrl,
      detailList,
      categoryOneList,
      categoryTwoList,
      facilitiesNameList,
      categoryOneName,
      categoryTwoName,
    } = this.state;

    const category = getFieldValue('category') || [];

    const {
      companyName,
      safeFacilitiesLabel,
      specifications,
      processFacilitiesInvolved,
      equipStatus,
      productFactory,
      leaveFactoryDate,
      useYear,
      leaveProductNumber,
      installPart,
      equipName,
      useDate,
      notes,
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
              initialValue: category,
              rules: [
                {
                  required: true,
                  message: '请选择分类',
                },
              ],
            })(
              <Fragment>
                <Select
                  value={categoryOneName}
                  placeholder="请选择"
                  {...itemsStyle}
                  onChange={this.handleCategoryOneChange}
                  onSelect={this.handleCategoryOneSelect}
                >
                  {categoryOneList.map(({ id, label }) => (
                    <Select.Option key={id} value={id}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
                <Select
                  value={categoryTwoName}
                  placeholder="请选择"
                  {...itemsStyle}
                  onChange={this.handleCategoryTwoChange}
                  onSelect={this.handleCategoryTwoSelect}
                >
                  {categoryTwoList.map(({ id, label }) => (
                    <Select.Option key={id} value={id}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="安全设施名称" {...formItemLayout}>
            {getFieldDecorator('safeFacilitiesName', {
              initialValue: safeFacilitiesLabel ? safeFacilitiesLabel : undefined,
              rules: [{ required: true, message: '请选择安全设施名称' }],
            })(
              <Select
                {...itemStyles}
                allowClear
                placeholder="请选择"
                onChange={this.handleNameChange}
              >
                {facilitiesNameList.map(({ id, label }) => (
                  <Select.Option key={id} value={id}>
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
          <FormItem label="出厂编号" {...formItemLayout}>
            {getFieldDecorator('leaveProductNumber', {
              initialValue: leaveProductNumber,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入出厂编号' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="设备名称" {...formItemLayout}>
            {getFieldDecorator('equipName', {
              initialValue: equipName,
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="设备状态" {...formItemLayout}>
            {getFieldDecorator('equipStatus', {
              initialValue: equipStatus ? +equipStatus : undefined,
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
          <FormItem label="安装部位" {...formItemLayout}>
            {getFieldDecorator('installPart', {
              initialValue: installPart,
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="涉及工艺设施" {...formItemLayout}>
            {getFieldDecorator('processFacilitiesInvolved', {
              initialValue: processFacilitiesInvolved,
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入" {...itemStyles} />)}
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
          <FormItem label="投入使用日期" {...formItemLayout}>
            {getFieldDecorator('useDate', {
              initialValue: useDate ? moment(+useDate) : undefined,
            })(<DatePicker placeholder="请选择" format="YYYY-MM-DD" {...itemStyles} />)}
          </FormItem>
          <FormItem label="使用期限（月）" {...formItemLayout}>
            {getFieldDecorator('useYear', {
              initialValue: useYear === 0 ? '' : useYear,
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  message: '请输入使用年限，只能输入正整数',
                  pattern: /^[1-9]\d*$/,
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
                beforeUpload={this.handleBeforeUpload}
              >
                <Button
                  type="dashed"
                  style={{ width: '96px', height: '96px' }}
                  disabled={uploading}
                >
                  <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
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
        title: '设备设施管理',
        name: '设备设施管理',
      },
      {
        title: '安全设施',
        name: '安全设施',
        href: '/facility-management/safety-facilities/list',
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
                href={`#/facility-management/safety-facilities/list`}
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
                href={`#/facility-management/safety-facilities/edit/${id}`}
              >
                编辑
              </Button>
            </span>

            <span style={{ marginLeft: 10 }}>
              <Button
                style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
                size="large"
                href={`#/facility-management/safety-facilities/list`}
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
