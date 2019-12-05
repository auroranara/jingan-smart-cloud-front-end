import { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Upload,
  Icon,
  message,
  Row,
  Col,
  Popconfirm,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import router from 'umi/router';
import CompanySelect from '@/jingan-components/CompanySelect';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';
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

const getFrequency = {
  1: '月',
  2: '季度',
  3: '年',
};

// 上传文件夹
const folder = 'targetSetting';
// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';

// 权限
const {
  baseInfo: {
    safetyFacilities: { edit: editAuth },
  },
} = codes;

@Form.create()
@connect(({ targetResponsibility, account, department, user, loading }) => ({
  targetResponsibility,
  department,
  account,
  user,
  loading: loading.models.targetResponsibility,
}))
export default class Edit extends PureComponent {
  state = {
    uploading: false, // 上传是否加载
    photoUrl: [], // 上传照片
    indexVisible: false, // 指标弹框是否可见
    dutyStatus: '', // 责任主体选择key
    detailList: {},
    safetyIndexList: [],
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

  // 去除左右两边空白
  handleTrim = e => e.target.value.trim();

  // 提交
  handleSubmit = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { validateFieldsAndScroll },
      user: {
        currentUser: { companyId: unitId },
      },
    } = this.props;
    const { photoUrl, safetyIndexList, dutyType, labelId } = this.state;

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { companyId, goalYear } = values;
        const payload = {
          id,
          companyId: companyId.key || unitId,
          goalYear,
          dutyMajor: dutyType + ',' + labelId,
          safeProductGoalValueList: safetyIndexList,
          otherFile:
            photoUrl.length > 0
              ? JSON.stringify(
                  photoUrl.map(({ name, url, dbUrl }) => ({ name, webUrl: url, dbUrl }))
                )
              : undefined,
        };
        console.log('payload', payload);

        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, this.goBack());
        };

        const error = () => {
          message.error(id ? '编辑失败' : '新增失败');
        };

        if (id) {
          dispatch({
            type: 'targetResponsibility/fetchSettingEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'targetResponsibility/fetchSettingAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  // 上传处理
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
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { companyId } = getFieldsValue();

    this.setState({ dutyStatus: key });
    if (+key === 2) {
      dispatch({
        type: 'department/fetchDepartmentList',
        payload: { companyId: companyId ? companyId.key : undefined },
      });
    } else if (+key === 3) {
      dispatch({
        type: 'account/fetch',
        payload: {
          unitId: companyId ? companyId.key : undefined,
          pageSize: 100,
          pageNum: 1,
        },
      });
    }
  };

  // 显示指标弹框
  handleIndexModal = () => {
    this.setState({ indexVisible: true });
    const payload = { pageSize: 10, pageNum: 1 };
    this.fetchIndexList({ payload });
  };

  // 获取指标列表
  fetchIndexList = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'targetResponsibility/fetchIndexManagementList', payload });
  };

  // 选择确定指标
  handleIndexSelect = item => {
    this.setState({ safetyIndexList: item });
    this.handleIndexClose();
  };

  // 关闭指标弹框
  handleIndexClose = () => {
    this.setState({ indexVisible: false });
  };

  // 渲染指标弹框
  renderIndexModal() {
    const {
      targetResponsibility: { indexData },
      loading,
    } = this.props;

    const { indexVisible } = this.state;

    const field = [
      {
        id: 'targetName',
        render() {
          return <Input placeholder="请输入指标名称" />;
        },
      },
    ];

    const columns = [
      {
        title: '指标',
        dataIndex: 'targetName',
        key: 'targetName',
        align: 'center',
      },
      {
        title: '考核频次',
        dataIndex: 'checkFrequency',
        key: 'checkFrequency',
        align: 'center',
        render: val => getFrequency[val],
      },
    ];

    return (
      <CompanyModal
        width={700}
        title={'选择指标'}
        loading={loading}
        visible={indexVisible}
        modal={indexData}
        columns={columns}
        field={field}
        fetch={this.fetchIndexList}
        onSelect={this.handleIndexSelect}
        rowSelection={{ type: 'checkbox ' }}
        onClose={this.handleIndexClose}
        multiSelect={true}
      />
    );
  }

  // 输入指标值改变
  handleChangeIndexValue = (item, value, i, key) => {
    item[key] = value;
    this.setState(({ safetyIndexList }) => {
      let temp = [...safetyIndexList];
      temp.splice(i, 1, item);
      return { safetyIndexList: temp };
    });
  };

  // 删除指标当前列
  handleIndexForm = index => {
    const { safetyIndexList } = this.state;
    this.setState({
      safetyIndexList: safetyIndexList.filter(({ id }) => {
        return id !== index;
      }),
    });
  };

  // 渲染指标列表
  renderIndexForm() {
    const {
      targetResponsibility: { targetValueList = [] },
    } = this.props;
    const { safetyIndexList } = this.state;

    return (
      <Row
        gutter={{ lg: 24, md: 12 }}
        style={{ position: 'relative', marginTop: '-35px', marginBottom: '20px' }}
      >
        {safetyIndexList.map((item, index) => {
          const { id, targetName, checkFrequency, indexValue } = item;
          return (
            <Col span={24} key={id} style={{ marginTop: '10px' }}>
              <Row gutter={12}>
                <Col
                  span={7}
                  style={{ textAlign: 'right', color: 'rgb(0,0,0,0.85)', lineHeight: '32px' }}
                >
                  <span>
                    {targetName} /{getFrequency[checkFrequency]}
                  </span>
                </Col>
                <Col span={4}>
                  <Select
                    placeholder="请选择"
                    style={{ width: '100%' }}
                    allowClear
                    onChange={e => {
                      console.log('33333333', e);
                      this.handleChangeIndexValue(item, e, index, 'symbolValue');
                    }}
                  >
                    {targetValueList.map(({ key, value }) => (
                      <Select.Option key={key} value={key}>
                        {value}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <Input
                    placeholder="请输入指标值"
                    value={indexValue}
                    onChange={e => {
                      this.handleChangeIndexValue(item, e.target.value, index, 'indexValue');
                    }}
                  />
                </Col>
                <Col span={3}>
                  <Popconfirm
                    title="确认要删除该内容吗？"
                    onConfirm={() => this.handleIndexForm(item.id)}
                  >
                    <Button>删除</Button>
                  </Popconfirm>
                </Col>
              </Row>
            </Col>
          );
        })}
      </Row>
    );
  }

  handleDutyChange = e => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ dutyMajor: e });
    this.setState({ dutyType: e });
  };

  handleIdChange = e => {
    this.setState({ labelId: e });
  };

  // 渲染
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
      account: { list: personList = [] },
    } = this.props;

    const { uploading, photoUrl, detailList, dutyStatus } = this.state;

    const isDisabled = id ? true : false;

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
                  onChange={e => this.handleDutyChange(e)}
                >
                  {dutyMajorList.map(({ key, value }) => (
                    <Option key={key} value={key}>
                      {value}
                    </Option>
                  ))}
                </Select>
                {+dutyStatus === 1 && (
                  <Input
                    placeholder="请选择"
                    {...itemStyles}
                    style={{ width: '50%' }}
                    disabled
                    value="本公司"
                  />
                )}
                {+dutyStatus === 2 && (
                  <Select
                    placeholder="请选择"
                    {...itemStyles}
                    style={{ width: '50%' }}
                    onChange={e => this.handleIdChange(e)}
                  >
                    {departmentList.map(({ id, name }) => (
                      <Option key={id} value={id}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                )}
                {+dutyStatus === 3 && (
                  <Select
                    placeholder="请选择"
                    {...itemStyles}
                    style={{ width: '50%' }}
                    onChange={e => this.handleIdChange(e)}
                  >
                    {personList.map(({ loginId, userName }) => (
                      <Option key={loginId} value={loginId}>
                        {userName}
                      </Option>
                    ))}
                  </Select>
                )}
                {+dutyStatus === 0 && (
                  <Input placeholder="请选择" {...itemStyles} style={{ width: '50%' }} disabled />
                )}
              </div>
            )}
          </FormItem>
          <FormItem label="安全生产目标数值" {...formItemLayout}>
            {getFieldDecorator('safeProductGoalNumber', {})(
              <Button type="primary" size="small" onClick={this.handleIndexModal}>
                选择指标
              </Button>
            )}
          </FormItem>
          {this.renderIndexForm()}
          <FormItem label="合同附件" {...formItemLayout}>
            {getFieldDecorator('otherFile', {
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
                href={`#${LIST_URL}`}
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
                href={`#${LIST_URL}/edit/${id}`}
              >
                编辑
              </Button>
            </span>

            <span style={{ marginLeft: 10 }}>
              <Button
                style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
                size="large"
                href={`#${LIST_URL}`}
              >
                返回
              </Button>
            </span>
          </div>
        )}
        {this.renderIndexModal()}
      </PageHeaderLayout>
    );
  }
}
