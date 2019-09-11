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
  TextArea,
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
@connect(({ EmergencyEquipment, loading }) => ({
  EmergencyEquipment,
  companyLoading: loading.effects['sensor/fetchModelList'],
}))
export default class EmergencyEquipmentHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
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

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      form: { setFieldsValue },
    } = this.props;
    this.fetchMonitoringTypeDict();
    // this.fetchSensorBrandDict()
    // 如果编辑
    if (id) {
      // 获取传感器详情
      dispatch({
        type: 'sensor/fetchSensorDetail',
        payload: { id },
        callback: response => {
          const {
            companyId,
            companyName,
            monitoringParameters,
            monitoringTypeId,
            typeId,
            brandName,
            deviceName,
            relationDeviceId,
            area,
            location,
          } = response.data;
          setFieldsValue({
            companyId,
            monitoringTypeId,
            typeId,
            brandName,
            deviceName,
            relationDeviceId,
            area,
            location,
          });
          this.setState({
            selectedCompany: { id: companyId, name: companyName },
          });
          this.fetchSensorTypeDict({ payload: { monitoringTypeId } });
          dispatch({
            type: 'sensor/saveState',
            payload: { key: 'monitoringParameters', value: monitoringParameters },
          });
        },
      });
    } else {
      // 如果新增
      this.saveTypeDict();
    }
  }

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
    const { selectedCompany, uploading } = this.state;

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
          <FormItem label="计划名称" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入计划名称' }],
            })(<Input placeholder="请输入计划名称" {...itemStyles} />)}
          </FormItem>
          <FormItem label="版本号" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId')(
              <Input placeholder="请输入版本号" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="计划状态" {...formItemLayout}>
            {getFieldDecorator('importantHost', {
              rules: [{ required: true, message: '请选择计划状态' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">已执行</Radio>
                <Radio value="0">未执行</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="制定人" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入制定人' }],
            })(<Input placeholder="请输入制定人" {...itemStyles} />)}
          </FormItem>
          <FormItem label="制定日期" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId')(
              <DatePicker
                placeholder="请选择制定日期"
                getCalendarContainer={getRootChild}
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="上报人" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入上报人' }],
            })(<Input placeholder="请输入上报人" {...itemStyles} />)}
          </FormItem>
          <FormItem label="演练名称" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入演练名称' }],
            })(<Input placeholder="请输入演练名称" {...itemStyles} />)}
          </FormItem>
          <FormItem label="演练类型" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请选择演练类型' }],
            })(
              <Cascader
                options={[]}
                fieldNames={{
                  value: 'id',
                  label: 'name',
                  children: 'children',
                  isLeaf: 'isLeaf',
                }}
                loadData={selectedOptions => {
                  this.handleLoadData(['registerAddress'], selectedOptions);
                }}
                changeOnSelect
                placeholder="请选择演练类型"
                allowClear
                getPopupContainer={getRootChild}
              />
            )}
          </FormItem>
          <p>演练类型代码:</p>
          <FormItem label="演练背景" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId')(
              <Input placeholder="请输入演练背景" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="演练编号" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入演练编号' }],
            })(<Input placeholder="请输入演练编号" {...itemStyles} />)}
          </FormItem>
          <FormItem label="演练地点" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入演练地点' }],
            })(<Input placeholder="请输入演练地点" {...itemStyles} />)}
          </FormItem>
          <FormItem label="演练目的" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入演练目的' }],
            })(<TextArea rows={4} placeholder="请输入演练目的" maxLength="500" />)}
          </FormItem>
          <FormItem label="演练要求" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入演练要求' }],
            })(<TextArea rows={4} placeholder="请输入演练要求" maxLength="500" />)}
          </FormItem>
          <FormItem label="演练内容" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId', {
              rules: [{ required: true, message: '请输入演练内容' }],
            })(<TextArea rows={4} placeholder="请输入演练内容" maxLength="500" />)}
          </FormItem>
          <FormItem label="关键字" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId')(
              <Input placeholder="请输入关键字" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="经费预算（元）" {...formItemLayout}>
            {getFieldDecorator('relationDeviceId')(
              <InputNumber
                {...itemStyles}
                min={0}
                placeholder="请输入经费预算"
                formatter={value => (!value || isNaN(value) ? '' : Math.round(100 * value) / 100)}
                parser={value => (!value || isNaN(value) ? '' : Math.round(100 * value) / 100)}
              />
            )}
          </FormItem>
        </Form>
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button
            onClick={() => {
              router.push('/device-management/sensor/list');
            }}
          >
            取消
          </Button>
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
      { title: '应急装备', name: '应急装备', href: '/device-management/sensor/list' },
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
