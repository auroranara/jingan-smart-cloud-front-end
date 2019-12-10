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
  DatePicker,
  AutoComplete,
  Spin,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import router from 'umi/router';
import CompanySelect from '@/jingan-components/CompanySelect';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import { getToken } from 'utils/authority';
import debounce from 'lodash/debounce';
import moment from 'moment';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
import { BREADCRUMBLIST, LIST_URL, ROUTER } from './utils';

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
  constructor(props) {
    super(props);
    this.handlePersonSearch = debounce(this.handlePersonSearch, 800);
    this.state = {
      uploading: false, // 上传是否加载
      photoUrl: [], // 上传照片
      indexVisible: false, // 指标弹框是否可见
      dutyStatus: '', // 责任主体选择key
      detailList: {},
      safetyIndexList: [],
      isopen: false,
      departmentId: '', // 部门id
      personId: {}, // 个人id
    };
  }

  // 挂载后
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      user: {
        currentUser: { companyId: unitId, unitType },
      },
    } = this.props;

    if (id) {
      dispatch({
        type: 'targetResponsibility/fetchSettingDetail',
        payload: {
          id,
        },
        callback: res => {
          const { data } = res;
          const {
            companyId,
            dutyMajorId,
            dutyMajor,
            otherFileList,
            safeProductGoalValueList,
            name: personName,
          } = data;
          this.setState(
            {
              photoUrl: Array.isArray(otherFileList)
                ? otherFileList.map(({ dbUrl, webUrl }, index) => ({
                    uid: index,
                    status: 'done',
                    name: `附件${index + 1}`,
                    url: webUrl,
                    dbUrl,
                  }))
                : [],
              safetyIndexList: Array.isArray(safeProductGoalValueList)
                ? safeProductGoalValueList
                : [],
              dutyStatus: dutyMajor.substr(0, 1),
              departmentId: dutyMajorId,
              personId: { key: dutyMajorId, label: personName },
            },
            () => {
              if (+dutyMajor.substr(0, 1) === 2) {
                dispatch({
                  type: 'department/fetchDepartmentList',
                  payload: { companyId: unitType === 4 ? unitId : companyId },
                });
              } else if (+dutyMajor.substr(0, 1) === 3) {
                dispatch({
                  type: 'account/fetch',
                  payload: {
                    unitId: unitType === 4 ? unitId : companyId,
                    pageSize: 10,
                    pageNum: 1,
                  },
                });
              }
            }
          );
        },
      });
    } else {
      dispatch({
        type: 'targetResponsibility/clearSettingDetail',
      });
    }
  }

  goBack = () => {
    router.push(`${LIST_URL}`);
  };

  // 当前页面是否为详情页面
  isDetail = () => {
    const {
      match: { url },
    } = this.props;
    return url && url.includes('detail');
  };

  // 提交
  handleSubmit = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { validateFieldsAndScroll },
      user: {
        currentUser: { companyId: unitId, unitType },
      },
    } = this.props;
    const { photoUrl, safetyIndexList, dutyStatus, departmentId, personId } = this.state;

    const departmentValue = dutyStatus + ',' + departmentId;
    const personValue = dutyStatus + ',' + personId.key;

    const indexValue = safetyIndexList
      .map(item => item.indexValue)
      .concat(safetyIndexList.map(item => item.symbolValue));

    if (indexValue.indexOf(undefined) >= 0 || indexValue.indexOf('') >= 0)
      return message.warning('请先填写安全生产目标数值，不能为空！');

    if (+dutyStatus === 3 && !personId.key) {
      return message.warning(`个人选项不能为空！`);
    }

    if (+dutyStatus === 2 && !departmentId) {
      return message.warning(`部门选项不能为空！`);
    }

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { companyId, goalYear } = values;
        const payload = {
          id,
          companyId: unitType === 4 ? unitId : companyId.key,
          goalYear: moment(goalYear).format('YYYY'),
          dutyMajor:
            +dutyStatus === 1 ? dutyStatus : +dutyStatus === 2 ? departmentValue : personValue,
          safeProductGoalValueList: safetyIndexList,
          otherFile:
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
    const { safetyIndexList } = this.state;
    const fixId = safetyIndexList.map(item => item.id);
    const filterItem = item.filter(item => fixId.indexOf(item.id) < 0);

    this.setState({ safetyIndexList: safetyIndexList.concat([...filterItem]) });
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
      safetyIndexList: safetyIndexList.filter((item, i) => {
        return i !== index;
      }),
    });
  };

  // 验证指标输入
  validatorID = (rule, value, callback) => {
    const chineseRe = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
    const patterDot = new RegExp(
      "[`~!@#$^&*()=|{}':;',\\[\\]<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]"
    );
    if (value) {
      if (
        chineseRe.test(value) ||
        /[a-z]/.test(value) ||
        /[A-Z]/.test(value) ||
        patterDot.test(value)
      ) {
        callback('注：只能输入数字');
      } else {
        callback();
      }
    }
  };

  // 渲染指标列表
  renderIndexForm() {
    const {
      form: { getFieldDecorator },
      targetResponsibility: { targetValueList = [] },
    } = this.props;
    const { safetyIndexList } = this.state;

    return (
      <Row
        gutter={{ lg: 24, md: 12 }}
        style={{ position: 'relative', marginTop: '-35px', marginBottom: '20px' }}
      >
        {safetyIndexList.map((item, index) => {
          const { targetName, checkFrequency, symbolValue, indexValue } = item;
          return (
            <Col span={24} key={index} style={{ marginTop: '10px' }}>
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
                    value={symbolValue}
                    placeholder="请选择"
                    style={{ width: '100%' }}
                    allowClear
                    onChange={e => {
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
                  <Form.Item style={{ marginTop: '-4px', marginBottom: '-13px' }}>
                    {getFieldDecorator(`indexValue${index}`, {
                      initialValue: indexValue,
                      getValueFromEvent: e => e.target.value.trim(),
                      rules: [
                        {
                          message: '只能输入数字或者百分数',
                        },
                        {
                          validator: this.validatorID,
                        },
                      ],
                    })(
                      <Input
                        placeholder="请输入指标值"
                        onChange={e => {
                          this.handleChangeIndexValue(item, e.target.value, index, 'indexValue');
                        }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Popconfirm
                    title="确认要删除该内容吗？"
                    onConfirm={() => this.handleIndexForm(index)}
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

  // 单位名称切换，清空责任主体
  onChangeComapny = () => {
    this.setState({ dutyStatus: '', departmentId: '', personId: {} });
  };

  // 责任主体key切换
  handleDutySelect = key => {
    const {
      dispatch,
      form: { getFieldsValue },
      user: {
        currentUser: { companyId: unitId, unitType },
      },
    } = this.props;
    const { companyId } = getFieldsValue();

    this.setState({ dutyStatus: key, departmentId: '', personId: {} });
    if (+key === 2) {
      dispatch({
        type: 'department/fetchDepartmentList',
        payload: { companyId: companyId ? companyId.key : unitType === 4 ? unitId : undefined },
      });
    }
    if (+key === 3) {
      dispatch({
        type: 'account/fetch',
        payload: {
          unitId: companyId ? companyId.key : unitType === 4 ? unitId : undefined,
          pageSize: 10,
          pageNum: 1,
        },
      });
    }
  };

  // 模糊搜索个人列表
  handlePersonSearch = value => {
    const { dispatch } = this.props;
    // 根据输入值获取列表
    dispatch({
      type: 'account/fetch',
      payload: {
        userName: value && value.trim(),
        pageNum: 1,
        pageSize: 18,
      },
    });
  };

  // 个人选择框切换
  handlePersonChange = e => {
    this.setState({ personId: { key: e.key, label: e.label } });
  };

  // 个人选择框失去焦点
  handlePersonBlur = value => {
    if (value.key && value.key === value.label) {
      this.setState({ personId: '' });
    }
  };

  // 责任主体类型切换
  handleDutyChange = e => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ dutyMajor: e });
    this.setState({ dutyStatus: e });
  };

  handleIdChange = e => {
    this.setState({ departmentId: e });
  };

  // 切换日历面板
  handlePanelChange = v => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ goalYear: v });
    this.setState({ isopen: false });
  };

  // 弹出日历和关闭日历
  handleOpenChange = s => {
    if (s) {
      this.setState({ isopen: true });
    } else {
      this.setState({ isopen: false });
    }
  };

  // 清除日历面板输入框的值
  clearDateValue = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ goalYear: '' });
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

  // 渲染
  renderForm = () => {
    const {
      loading,
      form: { getFieldDecorator },
      targetResponsibility: {
        dutyMajorList = [],
        settingDetail: { data },
      },
      user: {
        currentUser: { unitType },
      },
      department: {
        data: { list: departmentList = [] },
      },
      account: { list: personList = [] },
    } = this.props;

    const { companyId, companyName, goalYear, dutyMajor } = data || {};

    const { uploading, photoUrl, dutyStatus, departmentId, personId, isopen } = this.state;

    return (
      <Card>
        <Form>
          {unitType !== 4 && (
            <FormItem label="单位名称" {...formItemLayout}>
              {getFieldDecorator('companyId', {
                initialValue: { key: companyId, label: companyName },
                rules: [{ required: true, message: '请选择单位名称' }],
              })(
                <CompanySelect
                  {...itemStyles}
                  placeholder="请选择"
                  onChange={this.onChangeComapny}
                />
              )}
            </FormItem>
          )}
          <FormItem label="目标年份" {...formItemLayout}>
            {getFieldDecorator('goalYear', {
              initialValue: goalYear ? moment(goalYear) : '',
              rules: [{ required: true, message: '请输入目标年份' }],
            })(
              <DatePicker
                {...itemStyles}
                placeholder="请选择"
                open={isopen}
                onOpenChange={s => this.handleOpenChange(s)}
                onChange={this.clearDateValue}
                onPanelChange={v => this.handlePanelChange(v)}
                format="YYYY"
                mode="year"
              />
            )}
          </FormItem>
          <FormItem label="责任主体" {...formItemLayout}>
            {getFieldDecorator('dutyMajor', {
              initialValue: dutyMajor,
              rules: [{ required: true, message: '请选择' }],
            })(
              <div {...itemStyles}>
                <Select
                  {...itemStyles}
                  placeholder="请选择"
                  value={dutyStatus}
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
                    value={departmentId}
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
                  <AutoComplete
                    value={personId}
                    mode="combobox"
                    labelInValue
                    optionLabelProp="children"
                    placeholder="请输入"
                    notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                    onSearch={this.handlePersonSearch}
                    onBlur={this.handlePersonBlur}
                    filterOption={false}
                    {...itemStyles}
                    style={{ width: '50%' }}
                    onChange={e => this.handlePersonChange(e)}
                  >
                    {personList.map(({ users, userName }) => (
                      <Option
                        key={users.map(item => item.id)[0]}
                        value={users.map(item => item.id)[0]}
                      >
                        {userName}
                      </Option>
                    ))}
                  </AutoComplete>
                )}
                {+dutyStatus === 0 && (
                  <Input placeholder="请选择" {...itemStyles} style={{ width: '50%' }} disabled />
                )}
              </div>
            )}
          </FormItem>
          <FormItem label="安全生产目标数值" {...formItemLayout}>
            <Button type="primary" size="small" onClick={this.handleIndexModal}>
              选择指标
            </Button>
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
    breadcrumbList.push({ title, name: title });

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span>
            {this.isDetail() ? (
              <Button
                style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
                type="primary"
                size="large"
                disabled={!editCode}
                href={`#${ROUTER}/edit/${id}`}
              >
                编辑
              </Button>
            ) : (
              <Button
                style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
                type="primary"
                size="large"
                onClick={this.handleSubmit}
                loading={uploading}
              >
                提交
              </Button>
            )}
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
        {this.renderIndexModal()}
      </PageHeaderLayout>
    );
  }
}
