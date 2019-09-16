import { PureComponent, Fragment } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Radio,
  Row,
  Modal,
  Col,
  message,
  InputNumber,
  DatePicker,
  Upload,
  Icon,
  Cascader,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import debounce from 'lodash/debounce';
import { getToken } from 'utils/authority';
import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const { Group: RadioGroup } = Radio;
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'safetyinfo';
const defaultUploadProps = {
  name: 'files',
  data: { folder },
  multiple: true,
  action: uploadAction,
  headers: { 'JA-Token': getToken() },
};

const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };

@Form.create()
@connect(({ sensor, loading }) => ({
  sensor,
  companyLoading: loading.effects['sensor/fetchModelList'],
}))
export default class EmergencySuppliesHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 当前监测参数
      currentParameter: {},
      // 储存配置报警策略
      alarmStrategy: [],
      // 配置报警策略弹窗可见
      alarmStrategyModalVisible: false,
      // 选择企业弹窗
      compayModalVisible: false,
      // 选中的企业
      selectedCompany: {},
    };
  }

  componentDidMount() {}

  /**
   * 获取监测类型列表（字典）
   */
  fetchMonitoringTypeDict = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sensor/fetchMonitoringTypeDict',
      ...actions,
    });
  };

  /**
   * 获取传感器品牌列表（字典）
   */
  fetchSensorBrandDict = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sensor/fetchSensorBrandDict',
      ...actions,
    });
  };

  /**
   * 获取传感器类型列表（字典）
   */
  fetchSensorTypeDict = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sensor/fetchSensorTypeDict',
      ...actions,
    });
  };

  /**
   * 获取企业列表（弹窗）
   */
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sensor/fetchModelList', payload });
  };

  /**
   * 保存型号代码列表
   */
  saveTypeDict = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'sensor/saveTypeDict',
      ...actions,
    });
  };

  handleSubmit = () => {
    router.push('/base-info/materials/list');
    return;
    const {
      dispatch,
      sensor: { monitoringParameters },
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props;

    validateFields((error, { normalLower, normalUpper, ...formData }) => {
      if (!error) {
        const payload = { ...formData, monitoringParameters };
        // console.log('提交',payload)
        const success = () => {
          message.success(id ? '编辑成功！' : '新增成功！');
          router.push('/device-management/sensor/list');
        };
        const error = () => {
          message.error(id ? '编辑失败' : '新增失败！');
        };
        if (id) {
          dispatch({
            type: 'sensor/editSensor',
            payload: { ...payload, deviceId: id },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'sensor/addSensor',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  /**
   * 选择企业
   */
  handleSelectCompany = selectedCompany => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedCompany, companyModalVisible: false });
    setFieldsValue({ companyId: selectedCompany.id });
  };

  /**
   * 打开选择单位弹窗
   */
  handleViewCompanyModal = () => {
    this.setState({ companyModalVisible: true });
    this.fetchCompany({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator, getFieldValue },
      sensor: {
        // 监测类型字典
        monitoringTypeDict = [],
        // 传感器品牌字典
        brandDict = [],
        // 传感器型号字典
        typeDict = [],
        // 监测参数列表
        monitoringParameters = [],
      },
    } = this.props;
    const { selectedCompany } = this.state;

    return (
      <Card>
        <Form>
          <FormItem label="单位名称" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择单位名称' }],
            })(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  value={selectedCompany.name}
                  placeholder="请选择单位名称"
                />
                <Button type="primary" onClick={this.handleViewCompanyModal}>
                  选择单位
                </Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="物料类型" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择物料类型' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">生产原料</Radio>
                <Radio value="2">中间产品</Radio>
                <Radio value="3">最终产品</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="统一编码" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入统一编码' }],
            })(<Input placeholder="请输入统一编码" {...itemStyles} />)}
          </FormItem>

          <FormItem label="危险化学品目录序号" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId')(
              <Input placeholder="请输入危险化学品目录序号" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="物质形态" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择物质形态' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">固态</Radio>
                <Radio value="2">液态</Radio>
                <Radio value="3">气态</Radio>
                <Radio value="4">等离子态</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="是否重点监管的危险化学品" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择是否重点监管的危险化学品' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="品名" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择品名' }],
            })(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  value={selectedCompany.name}
                  placeholder="请选择品名"
                />
                <Button type="primary">选择</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="CAS号" {...formItemLayout}>
            {getFieldDecorator('equipCode')(<span> </span>)}
          </FormItem>
          <FormItem label="危险性类别" {...formItemLayout}>
            {getFieldDecorator('equipCode')(<span> </span>)}
          </FormItem>
          <FormItem label="年消耗量" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输年消耗量' }],
            })(<Input placeholder="请输入年消耗量" {...itemStyles} />)}
          </FormItem>
          <FormItem label="最大存储量" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入最大存储量' }],
            })(<Input placeholder="请输入最大存储量" {...itemStyles} />)}
          </FormItem>
          <FormItem label="实际存储量" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入实际存储量' }],
            })(<Input placeholder="请输入实际存储量" {...itemStyles} />)}
          </FormItem>
          <FormItem label="存储场所" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入存储场所' }],
            })(<Input placeholder="请输入存储场所" {...itemStyles} />)}
          </FormItem>
          <FormItem label="是否属于高危储存设施" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择是否属于高危储存设施' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="是否构成危险化学品重大危险源" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择是否构成危险化学品重大危险源' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="所属危险源名称" {...formItemLayout}>
            {getFieldDecorator('companyId')(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  value={selectedCompany.name}
                  placeholder="请选择所属危险源名称"
                />
                <Button type="primary">选择</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="危险化学品重大危险源等级" {...formItemLayout}>
            {getFieldDecorator('equipCode')(<span> </span>)}
          </FormItem>
          <FormItem label="所在工艺流程" {...formItemLayout}>
            {getFieldDecorator('companyId')(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  value={selectedCompany.name}
                  placeholder="请选择所在工艺流程"
                />
                <Button type="primary">选择</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="是否属于重点监管危险化工工艺" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '所在工艺流程是否属于重点监管危险化工工艺' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="重点监管危险化工工艺" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择重点监管危险化工工艺' }],
            })(
              <Select placeholder="请选择重点监管危险化工工艺" {...itemStyles}>
                <Option value={'0'}>氯化工艺</Option>
                <Option value={'1'}>硝化工艺</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="高危化学品" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择高危化学品' }],
            })(
              <Select placeholder="请选择重点监管危险化工工艺" {...itemStyles}>
                <Option value={'0'}>硝酸铵</Option>
                <Option value={'1'}>硝化棉</Option>
                <Option value={'2'}>氰化钠</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="是否剧毒化学品" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '是否剧毒化学品' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="安全措施" {...formItemLayout}>
            {getFieldDecorator('use', {
              rules: [{ required: true, message: '请输入安全措施' }],
            })(<TextArea rows={4} placeholder="请输入安全措施" maxLength="500" {...itemStyles} />)}
          </FormItem>
          <FormItem label="应急处置措施" {...formItemLayout}>
            {getFieldDecorator('use', {
              rules: [{ required: true, message: '请输入应急处置措施' }],
            })(
              <TextArea rows={4} placeholder="请输入应急处置措施" maxLength="500" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="是否易制毒" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择是否易制毒' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="是否易制爆" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择是否易制爆' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
        </Form>
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleSubmit}>
            提交
          </Button>
        </Row>
      </Card>
    );
  };

  render() {
    const {
      companyLoading,
      match: { prams: { id = null } = {} },
      sensor: { companyModal },
    } = this.props;
    const { companyModalVisible } = this.state;
    const title = id ? '编辑' : '新增';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '应急管理', name: '应急管理' },
      { title: '应急物资', name: '应急物资', href: '/device-management/sensor/list' },
      { title, name: title },
    ];
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
        {/* 选择企业弹窗 */}
        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={companyModalVisible}
          modal={companyModal}
          fetch={this.fetchCompany}
          onSelect={this.handleSelectCompany}
          onClose={() => {
            this.setState({ companyModalVisible: false });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
