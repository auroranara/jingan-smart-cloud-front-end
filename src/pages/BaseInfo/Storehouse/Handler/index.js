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
    router.push('/base-info/storehouse/list');
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
          <FormItem label="库房编码" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入库房编码' }],
            })(<Input placeholder="请输入库房编码" {...itemStyles} />)}
          </FormItem>
          <FormItem label="库房序号" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入库房序号' }],
            })(<Input placeholder="请输入库房序号" {...itemStyles} />)}
          </FormItem>
          <FormItem label="库房名称" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入库房名称' }],
            })(<Input placeholder="请输入库房名称" {...itemStyles} />)}
          </FormItem>
          <FormItem label="库区名称" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择库区名称' }],
            })(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  value={selectedCompany.name}
                  placeholder="请选择库区名称"
                />
                <Button type="primary">选择库区名称</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="库区编号" {...formItemLayout}>
            {getFieldDecorator('equipCode')(<span> </span>)}
          </FormItem>
          <FormItem label="区域位置" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入区域位置' }],
            })(<Input placeholder="请输入区域位置" {...itemStyles} />)}
          </FormItem>
          <FormItem label="库房面积（㎡）" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入库房面积' }],
            })(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入库房面积"
                formatter={value => (!value || isNaN(value) ? '' : value)}
                parser={value => (!value || isNaN(value) ? '' : value)}
              />
            )}
          </FormItem>
          <FormItem label="有无防火墙" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请选择有无防火墙' }],
            })(
              <Select placeholder="请选择有无防火墙" {...itemStyles}>
                <Option value={'0'}>无</Option>
                <Option value={'1'}>有</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="库房形式" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择库房形式' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">封闭式</Radio>
                <Radio value="2">半封闭式</Radio>
                <Radio value="3">露天</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="火灾危险性等级" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择火灾危险性等级' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">甲</Radio>
                <Radio value="2">乙</Radio>
                <Radio value="3">丙</Radio>
                <Radio value="4">丁</Radio>
                <Radio value="5">戊</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="贮存物质名称" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择贮存物质名称' }],
            })(
              <Fragment>
                <TextArea
                  {...itemStyles}
                  disabled
                  TextArea
                  rows={4}
                  placeholder="请选择贮存物质名称"
                />
                <Button type="primary">选择贮存物质名称</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="是否危化品仓库" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请选择是否危化品仓库' }],
            })(
              <Select placeholder="请选择是否危化品仓库" {...itemStyles}>
                <Option value={'0'}>否</Option>
                <Option value={'1'}>是</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="是否剧毒化学品仓库" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请选择是否剧毒化学品仓库' }],
            })(
              <Select placeholder="请选择是否剧毒化学品仓库" {...itemStyles}>
                <Option value={'0'}>否</Option>
                <Option value={'1'}>是</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="投产日期" {...formItemLayout}>
            {getFieldDecorator('produceDate', {
              rules: [{ required: true, message: '请选择投产日期' }],
            })(
              <DatePicker
                placeholder="请选择投产日期"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="是否设置自动喷淋" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请选择是否设置自动喷淋' }],
            })(
              <Select placeholder="请选择是否设置自动喷淋" {...itemStyles}>
                <Option value={'0'}>否</Option>
                <Option value={'1'}>是</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="是否低温仓储仓库" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请选择是否低温仓储仓库' }],
            })(
              <Select placeholder="请选择是否低温仓储仓库" {...itemStyles}>
                <Option value={'0'}>否</Option>
                <Option value={'1'}>是</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="是否构成重大危险源" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请选择是否构成重大危险源' }],
            })(
              <Select placeholder="请选择是否构成重大危险源" {...itemStyles}>
                <Option value={'0'}>否</Option>
                <Option value={'1'}>是</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="所属危险化学品重大危险源单元" {...formItemLayout}>
            {getFieldDecorator('companyId')(
              <Fragment>
                <TextArea
                  {...itemStyles}
                  disabled
                  TextArea
                  rows={4}
                  placeholder="请选择所属危险化学品重大危险源单元"
                />
                <Button type="primary">选择</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="所属重大危险源单元编号" {...formItemLayout}>
            {getFieldDecorator('equipCode')(<span> </span>)}
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
