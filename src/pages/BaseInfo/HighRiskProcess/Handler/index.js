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
    router.push('/base-info/high-risk-process/list');
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
    const { selectedCompany, uploading = false } = this.state;

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
          >
          <FormItem label="统一编码" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入统一编码' }],
            })(<Input placeholder="请输入统一编码" {...itemStyles} />)}
          </FormItem>
          <FormItem label="生产工艺名称" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入生产工艺名称' }],
            })(<Input placeholder="请输入生产工艺名称" {...itemStyles} />)}
          </FormItem>
          <FormItem label="反应类型" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入反应类型' }],
            })(<Input placeholder="请输入反应类型" {...itemStyles} />)}
          </FormItem>
          <FormItem label="中间产品" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择中间产品' }],
            })(
              <Fragment>
                <TextArea {...itemStyles} disabled TextArea rows={4} placeholder="请选择中间产品" />
                <Button type="primary">选择</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="最终产品" {...formItemLayout}>
            {getFieldDecorator('companyId', {
              rules: [{ required: true, message: '请选择最终产品' }],
            })(
              <Fragment>
                <TextArea {...itemStyles} disabled TextArea rows={4} placeholder="请选择最终产品" />
                <Button type="primary">选择</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="重点监控单元" {...formItemLayout}>
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入重点监控单元' }],
            })(
              <TextArea rows={4} placeholder="请输入重点监控单元" maxLength="500" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="工艺危险特点" {...formItemLayout}>
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入工艺危险特点' }],
            })(
              <TextArea rows={4} placeholder="请输入工艺危险特点" maxLength="500" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="安全控制基本要求" {...formItemLayout}>
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入安全控制基本要求' }],
            })(
              <TextArea
                rows={4}
                placeholder="请输入安全控制基本要求"
                maxLength="500"
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="是否重点监管危险化工工艺" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择是否重点监管危险化工工艺' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">是</Radio>
                <Radio value="2">否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="重点监管危险化工工艺" {...formItemLayout}>
            {getFieldDecorator('importantHost')(
              <Select placeholder="请选择规格型号" {...itemStyles}>
                <Option value={'0'}>氯化工艺</Option>
                <Option value={'1'}>硝化工艺</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="岗位操作人数" {...formItemLayout}>
            {getFieldDecorator('daySpace', {
              rules: [{ required: true, message: '请输入岗位操作人数' }],
            })(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入岗位操作人数"
                formatter={value => (!value || isNaN(value) ? '' : Math.round(value))}
                parser={value => (!value || isNaN(value) ? '' : Math.round(value))}
              />
            )}
          </FormItem>
          <FormItem label="持证人数" {...formItemLayout}>
            {getFieldDecorator('daySpace', {
              rules: [{ required: true, message: '请输入持证人数' }],
            })(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入持证人数"
                formatter={value => (!value || isNaN(value) ? '' : Math.round(value))}
                parser={value => (!value || isNaN(value) ? '' : Math.round(value))}
              />
            )}
          </FormItem>
          <FormItem label="技术来源" {...formItemLayout}>
            {getFieldDecorator('remark')(
              <TextArea rows={4} placeholder="请输入技术来源" maxLength="500" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="设计单位" {...formItemLayout}>
            {getFieldDecorator('remark')(
              <TextArea rows={4} placeholder="请输入设计单位" maxLength="500" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="工艺系统简况" {...formItemLayout}>
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入工艺系统简况' }],
            })(
              <TextArea rows={4} placeholder="请输入工艺系统简况" maxLength="500" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="设计单位资质等级" {...formItemLayout}>
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入设计单位资质等级' }],
            })(
              <TextArea
                rows={4}
                placeholder="请输入设计单位资质等级"
                maxLength="500"
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="自动控制措施" {...formItemLayout}>
            {getFieldDecorator('remark')(
              <TextArea rows={4} placeholder="请输入自动控制措施" maxLength="500" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="安全仪表系统" {...formItemLayout}>
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入安全仪表系统' }],
            })(
              <TextArea rows={4} placeholder="请输入安全仪表系统" maxLength="500" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="SIL等级" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择SIL等级' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">1级</Radio>
                <Radio value="2">2级</Radio>
                <Radio value="3">3级</Radio>
                <Radio value="4">4级</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="资质等级描述" {...formItemLayout}>
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入资质等级描述' }],
            })(
              <TextArea rows={4} placeholder="请输入资质等级描述" maxLength="500" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="安全阀/爆破片" {...formItemLayout}>
            {getFieldDecorator('remark', {
              rules: [{ required: true, message: '请输入安全阀/爆破片' }],
            })(
              <TextArea
                rows={4}
                placeholder="请输入安全阀/爆破片"
                maxLength="500"
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="带控制点的工艺流程图" {...formItemLayout}>
            {getFieldDecorator('picture')(
              <Upload
                {...defaultUploadProps}
                fileList={[]}
                onChange={this.handleSafeChange}
                disabled={uploading}
              >
                <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                  <Icon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="设备一览表" {...formItemLayout}>
            {getFieldDecorator('picture')(
              <Upload
                {...defaultUploadProps}
                fileList={[]}
                onChange={this.handleSafeChange}
                disabled={uploading}
              >
                <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                  <Icon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
            )}
          </FormItem>
          <FormItem label="设备布置图" {...formItemLayout}>
            {getFieldDecorator('picture')(
              <Upload
                {...defaultUploadProps}
                fileList={[]}
                onChange={this.handleSafeChange}
                disabled={uploading}
              >
                <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                  <Icon type="plus" style={{ fontSize: '32px' }} />
                  <div style={{ marginTop: '8px' }}>点击上传</div>
                </Button>
              </Upload>
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
