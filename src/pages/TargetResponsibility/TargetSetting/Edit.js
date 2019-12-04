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
import CompanySelect from '@/jingan-components/CompanySelect';
import moment from 'moment';
import { getToken } from 'utils/authority';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
import { BREADCRUMBLIST, LIST_URL } from './utils';

const FormItem = Form.Item;
const { Option } = Select;

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
@connect(({ targetResponsibility, department, user, loading }) => ({
  targetResponsibility,
  department,
  user,
  loading: loading.models.targetResponsibility,
}))
export default class Edit extends PureComponent {
  state = {
    uploading: false, // 上传是否加载
    photoUrl: [], // 上传照片
    detailList: {},
    facNameList: [],
    dutyStatus: '',
  };

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      targetResponsibility: { facNameList = [] },
    } = this.props;

    if (id) {
      dispatch({
        type: 'targetResponsibility/fetchSafeFacList',
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
        type: 'targetResponsibility/clearSafeFacDetail',
      });
    }
  }

  goBack = () => {
    router.push(`${LIST_URL}`);
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
      console.log('values', values);

      if (!errors) {
        const { category } = values;
        const payload = {
          id,
          companyId: this.companyId || companyId,
          category: category.join(','),
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
            type: 'targetResponsibility/fetchSafeFacEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            // type: 'targetResponsibility/fetchSafeFacAdd',
            // payload,
            // success,
            // error,
          });
        }
      }
    });
  };

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

  // 责任主体key切换
  handleDutySelect = key => {
    this.setState({ dutyStatus: key });
  };

  handleDutyChange = () => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { companyId } = getFieldsValue();
    dispatch({
      type: 'department/fetchDepartmentList',
      payload: { companyId: companyId ? companyId.key : undefined },
    });
  };
  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator },
      targetResponsibility: { dutyMajorList = [] },
      user: {
        currentUser: { unitType },
      },
      match: {
        params: { id },
      },
      department: {
        data: { list: departmentList = [] },
      },
    } = this.props;

    const isDisabled = id ? true : false;

    const { uploading, photoUrl, detailList, dutyStatus } = this.state;

    const { companyName, specifications } = detailList;
    return (
      <Card>
        <Form>
          {unitType !== 4 && (
            <FormItem label="单位名称" {...formItemLayout}>
              {getFieldDecorator('companyId', {
                initialValue: companyName,
                rules: [{ required: true, message: '请选择单位名称' }],
              })(<CompanySelect {...itemStyles} disabled={isDisabled} placeholder="请选择" />)}
            </FormItem>
          )}
          <FormItem label="目标年份" {...formItemLayout}>
            {getFieldDecorator('goalYear', {
              initialValue: specifications,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入规格型号' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
          <FormItem label="责任主体" {...formItemLayout}>
            {getFieldDecorator('dutyMajor', {
              initialValue: specifications,
              rules: [{ required: true, message: '请选择' }],
            })(
              <div {...itemStyles}>
                <Select
                  placeholder="请选择"
                  {...itemStyles}
                  style={{ width: '49%', marginRight: '1%' }}
                  onSelect={this.handleDutySelect}
                  onChange={this.handleDutyChange}
                >
                  {dutyMajorList.map(({ key, value }) => (
                    <Option key={key} value={key}>
                      {value}
                    </Option>
                  ))}
                </Select>
                {+dutyStatus === 1 ? (
                  <Input
                    placeholder="请选择"
                    {...itemStyles}
                    style={{ width: '50%' }}
                    disabled
                    value="本公司"
                  />
                ) : +dutyStatus === 2 || +dutyStatus === 3 ? (
                  <Select placeholder="请选择" {...itemStyles} style={{ width: '50%' }}>
                    {departmentList.map(({ id, name }) => (
                      <Option key={id} value={id}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <Input placeholder="请选择" {...itemStyles} style={{ width: '50%' }} disabled />
                )}
              </div>
            )}
          </FormItem>
          <FormItem label="合同附件" {...formItemLayout}>
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

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '新增', name: '新增' });

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
                href={`#/device-management/safety-facilities/list`}
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
                href={`#/device-management/safety-facilities/edit/${id}`}
              >
                编辑
              </Button>
            </span>

            <span style={{ marginLeft: 10 }}>
              <Button
                style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
                size="large"
                href={`#/device-management/safety-facilities/list`}
              >
                返回
              </Button>
            </span>
          </div>
        )}
      </PageHeaderLayout>
    );
  }
}
