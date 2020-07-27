import { PureComponent, Fragment } from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Checkbox, Input, Select, Button, Radio, Row, message, InputNumber, Upload } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { getToken } from 'utils/authority';
import { RISK_CATEGORIES, getRiskCategoryLabel } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { CONTROL_OPTIONS, MOINTOR_TYPES, TECHNICAL_OPTIONS, getTypeLabel } from '../utils';

const { Group: CheckboxGroup } = Checkbox;
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const { Group: RadioGroup } = Radio;

/* root下的div */
// const getRootChild = () => document.querySelector('#root>div');
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
@connect(({ sensor, majorHazardInfo, materials, user, loading }) => ({
  sensor,
  majorHazardInfo,
  materials,
  user,
  companyLoading: loading.effects['sensor/fetchModelList'],
  middleLoading: loading.effects['materials/fetchMaterialsList'],
  monitorLoading: loading.effects['materials/fetchMonitorList'],
}))
export default class EmergencySuppliesHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 选中的企业
      selectedCompany: {},
      rawModalVisible: false,
      // 中间产品弹窗可见
      middleModalVisible: false,
      // 最终产品弹窗可见
      finalModalVisible: false,
      monitorModalVisible: false,
      selectedRaw: [],
      // 选中的中间产品
      selectedMiddle: [],
      // 选中的最终产品
      selectedFinal: [],
      selectedTemp: [],
      selectedMonitor: [],
      selectedMonitorTemp: [],
      // 带控制点的工艺流程图
      flowChartList: [],
      // 设备一览表
      equipmentList: [],
      // 设备布置图
      equipmentLayoutList: [],
      flowChartLoading: false,
      equipmentListLoading: false,
      equipmentLayoutLoading: false,
    };
  }

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
      user: { isCompany, currentUser },
    } = this.props;
    if (id) {
      // 如果编辑
      dispatch({
        type: 'majorHazardInfo/fetchHighRiskProcessDetail',
        payload: { id },
        callback: ({
          companyId,
          companyName,
          rawList,
          middleList,
          finalList,
          keyMonitoringUnitList,
          flowChartControlPointDetails,
          equipmentListDetails,
          equipmentLayoutDetails,
          iskeySupervisionProcess,
          keySupervisionProcess,
        }) => {
          !isCompany && setFieldsValue({ companyId });
          +iskeySupervisionProcess === 1 && setFieldsValue({ keySupervisionProcess });
          this.setState({
            selectedCompany: { id: companyId, name: companyName },
            selectedRaw: rawList || [],
            selectedMiddle: middleList || [],
            selectedFinal: finalList || [],
            selectedMonitor: keyMonitoringUnitList || [],
            flowChartList: flowChartControlPointDetails ? flowChartControlPointDetails.map(item => ({
              ...item,
              uid: item.id,
              url: item.webUrl,
              name: item.fileName,
            })) : [],
            equipmentList: equipmentListDetails ? equipmentListDetails.map(item => ({
              ...item,
              uid: item.id,
              url: item.webUrl,
              name: item.fileName,
            })) : [],
            equipmentLayoutList: equipmentLayoutDetails ? equipmentLayoutDetails.map(item => ({
              ...item,
              uid: item.id,
              url: item.webUrl,
              name: item.fileName,
            })) : [],
          });
        },
      })
    } else if (isCompany) {
      this.setState({ selectedCompany: { id: currentUser.companyId, name: currentUser.companyName } });
    }
  }

  /**
   * 获取企业列表（弹窗）
   */
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'sensor/fetchModelList', payload });
  };

  // 获取物料列表
  fetchMaterials = ({ payload }) => {
    const { dispatch } = this.props;
    const { selectedCompany } = this.state;
    dispatch({
      type: 'materials/fetchMaterialsList',
      payload: { ...payload, companyId: selectedCompany.id },
    });
  };

  fetchMonitors = ({ payload }) => {
    const {
      dispatch,
      match: { params: { id } },
    } = this.props;
    const { selectedCompany } = this.state;

    const pl = { ...payload };
    if (Array.isArray(payload.types))
      pl.types = payload.types.join(',');
    else
      pl.types = '302,311';
    dispatch({
      type: 'materials/fetchMonitorList',
      payload: { ...pl, companyId: selectedCompany.id, bindTechnologyId: id || '-1' },
    });
  };

  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props;
    const {
      // 带控制点的工艺流程图
      flowChartList,
      // 设备一览表
      equipmentList,
      // 设备布置图
      equipmentLayoutList,
      selectedCompany,
    } = this.state;
    if (!selectedCompany || !selectedCompany.id) {
      message.warn('companyId缺失');
      return;
    }
    validateFields((err, formData) => {
      if (err) return;
      const { controlMode } = formData;
      const payload = {
        ...formData,
        companyId: selectedCompany.id,
        flowChartControlPoint: JSON.stringify(flowChartList),
        equipmentList: JSON.stringify(equipmentList),
        equipmentLayout: JSON.stringify(equipmentLayoutList),
        controlMode: controlMode.join(','),
      }
      // console.log('提交', payload)
      const success = () => {
        message.success(id ? '编辑成功！' : '新增成功！');
        setTimeout(this.goBack, 1000);
      };
      const error = () => {
        message.error(id ? '编辑失败' : '新增失败！');
      };
      if (id) {
        dispatch({
          type: 'majorHazardInfo/editHighRiskProcess',
          payload: { ...payload, id },
          success,
          error,
        });
      } else {
        dispatch({
          type: 'majorHazardInfo/addHighRiskProcess',
          payload,
          success,
          error,
        });
      }
    });
  };

  goBack = () => {
    const { match: { params: { id } } } = this.props;
    if (id)
      window.close();
    else
      router.push('/major-hazard-info/high-risk-process/list');
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

  handleViewRaw = () => {
    this.setState(({ selectedRaw }) => ({ rawModalVisible: true, selectedTemp: selectedRaw }));
    this.fetchMaterials({
      payload: {
        pageSize: 10,
        pageNum: 1,
        type: 1,
      },
    });
  }

  // 点击打开选择中间产品弹窗
  handleViewMiddle = () => {
    this.setState(({ selectedMiddle }) => ({ middleModalVisible: true, selectedTemp: selectedMiddle }))
    this.fetchMaterials({
      payload: {
        pageSize: 10,
        pageNum: 1,
        type: 2,
      },
    });
  }

  // 点击打开选择最终产品弹窗
  handleViewFinal = () => {
    this.setState(({ selectedFinal }) => ({ finalModalVisible: true, selectedTemp: selectedFinal }))
    this.fetchMaterials({
      payload: {
        pageSize: 10,
        pageNum: 1,
        type: 3,
      },
    });
  }

  handleViewMonitor = () => {
    this.setState(({ selectedMonitor }) => ({ monitorModalVisible: true, selectedMonitorTemp: selectedMonitor }));
    this.fetchMonitors({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  // 验证是否数字
  validateNumber = (rule, value, callback) => {
    if (value && !isNaN(value)) {
      callback();
    } else callback('请输入数字')
  }

  handleFileUploadChange = ({ file, fileList }, listTag, loadingTag) => {
    let newState = {};
    if (file.status === 'uploading') {
      newState[loadingTag] = true;
      newState[listTag] = fileList;
    } else if (file.status === 'done') {
      if (file.response && file.response.code === 200) {
        const result = file.response.data.list[0]
        const list = fileList.map((item, index) => {
          if (index === fileList.length - 1) {
            return {
              ...result,
              uid: item.uid,
              url: result.webUrl,
              name: result.fileName,
            }
          } else return item
        })
        newState[loadingTag] = false;
        newState[listTag] = list;
      } else {
        message.error('上传失败！');
        newState[listTag] = fileList.filter(item => {
          return !item.response || item.response.code !== 200;
        });
      }
      newState[loadingTag] = false;
    } else if (file.status === 'removed') {
      // 删除
      newState[loadingTag] = false;
      newState[listTag] = fileList.filter(item => {
        return item.status !== 'removed';
      });
    } else {
      message.error('上传失败')
      newState[loadingTag] = false;
    }
    this.setState(newState)
  }

  handleSelectRaw = () => {
    const { setFieldsValue } = this.props.form;
    const { selectedTemp } = this.state;
    const selectedTmp = Array.isArray(selectedTemp) ? selectedTemp.filter(({ type }) => +type === 1) : []; // 处理以前的数据
    this.setState({ selectedRaw: selectedTmp, rawModalVisible: false });
    setFieldsValue({ rawId: selectedTmp.map((item) => item.id).join(',') });
  };

  handleSelectMiddle = () => {
    const { setFieldsValue } = this.props.form;
    const { selectedTemp } = this.state;
    const selectedTmp = Array.isArray(selectedTemp) ? selectedTemp.filter(({ type }) => +type === 2) : [];
    this.setState({ selectedMiddle: selectedTmp, middleModalVisible: false })
    setFieldsValue({ middleId: selectedTmp.map((item) => item.id).join(',') })
  }

  handleSelectFinal = () => {
    const { setFieldsValue } = this.props.form;
    const { selectedTemp } = this.state;
    const selectedTmp = Array.isArray(selectedTemp) ? selectedTemp.filter(({ type }) => +type === 3) : [];
    this.setState({ selectedFinal: selectedTmp, finalModalVisible: false })
    setFieldsValue({ finalId: selectedTmp.map((item) => item.id).join(',') })
  }

  handleSelectMonitor = () => {
    const { setFieldsValue } = this.props.form;
    const { selectedMonitorTemp } = this.state;
    this.setState({ selectedMonitor: selectedMonitorTemp, monitorModalVisible: false });
    setFieldsValue({ keyMonitoringUnit: selectedMonitorTemp.map((item) => item.id).join(',') });
  };

  trim = e => e.target.value.replace(/\s/, '');

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator, getFieldValue },
      match: { params: { id } },
      majorHazardInfo: {
        // 详情
        highRiskProcessDetail: detail,
        // 重点监管危险化工工艺选项
        keySupervisionProcessOptions,
        qualificationLevelDict,
        SILLevelDict,
      },
      user: { isCompany },
    } = this.props;
    // 是否是详情
    const isDetail = /detail/i.test(window.location.href);
    const {
      selectedCompany,
      selectedRaw,
      selectedMiddle,
      selectedFinal,
      selectedMonitor,
      // 带控制点的工艺流程图
      flowChartList,
      // 设备一览表
      equipmentList,
      // 设备布置图
      equipmentLayoutList,
      flowChartLoading,
      equipmentListLoading,
      equipmentLayoutLoading,
    } = this.state;
    const iskeySupervisionProcess = getFieldValue('iskeySupervisionProcess');
    return (
      <Card>
        <Form>
          {!isCompany && (
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
          )}
          <FormItem label="工艺编码" {...formItemLayout}>
            {getFieldDecorator('unifiedCode', {
              initialValue: id ? detail.unifiedCode : undefined,
              rules: [
                { required: true, message: '请输入工艺编码' },
                { max: 12, message: '请输入不超过12个字符' },
              ],
              getValueFromEvent: this.trim,
            })(<Input placeholder="请输入工艺编码" {...itemStyles} />)}
          </FormItem>
          <FormItem label="生产工艺名称" {...formItemLayout}>
            {getFieldDecorator('processName', {
              initialValue: id ? detail.processName : undefined,
              rules: [
                { required: true, message: '请输入生产工艺名称' },
                { max: 50, message: '请输入不超过50个字符' },
              ],
              getValueFromEvent: this.trim,
            })(<Input placeholder="请输入生产工艺名称" {...itemStyles} />)}
          </FormItem>
          <FormItem label="是否重点监管危险化工工艺" {...formItemLayout}>
            {getFieldDecorator('iskeySupervisionProcess', {
              initialValue: id ? detail.iskeySupervisionProcess : undefined,
              rules: [{ required: true, message: '请选择是否重点监管危险化工工艺' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {+iskeySupervisionProcess === 1 && (
            <FormItem label="重点监管危险化工工艺" {...formItemLayout}>
              {getFieldDecorator('keySupervisionProcess')(
                <Select placeholder="重点监管危险化工工艺" {...itemStyles}>
                  {keySupervisionProcessOptions.map(({ value, label }) => (
                    <Option key={value} value={value}>{label}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
          )}
          <FormItem label="反应类型" {...formItemLayout}>
            {getFieldDecorator('reactionType', {
              initialValue: id ? detail.reactionType : undefined,
              rules: [
                { required: true, message: '请输入反应类型' },
                { max: 12, message: '请输入不超过12个字符' },
              ],
              getValueFromEvent: this.trim,
            })(<Input placeholder="请输入反应类型" {...itemStyles} />)}
          </FormItem>
          <FormItem label="生产原料" {...formItemLayout}>
            {getFieldDecorator('rawId', {
              initialValue: id && detail.rawList ? detail.rawList.map(item => item.id).join(',') : undefined,
              rules: [{ required: true, message: '请选择生产原料' }],
            })(
              <Fragment>
                <TextArea
                  value={selectedRaw && selectedRaw.length ? selectedRaw.map(({ chineName }) => chineName).join('、') : undefined}
                  {...itemStyles}
                  disabled
                  rows={4}
                  placeholder="请选择生产原料" />
                <Button type="primary" onClick={this.handleViewRaw}>选择</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="中间产品" {...formItemLayout}>
            {getFieldDecorator('middleId', {
              initialValue: id && detail.middleList ? detail.middleList.map(item => item.id).join(',') : undefined,
              rules: [{ required: true, message: '请选择中间产品' }],
            })(
              <Fragment>
                <TextArea
                  value={selectedMiddle && selectedMiddle.length ? selectedMiddle.map(({ chineName }) => chineName).join('、') : undefined}
                  {...itemStyles}
                  disabled
                  rows={4}
                  placeholder="请选择中间产品" />
                <Button type="primary" onClick={this.handleViewMiddle}>选择</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="最终产品" {...formItemLayout}>
            {getFieldDecorator('finalId', {
              initialValue: id && detail.finalList ? detail.finalList.map(item => item.id).join(',') : undefined,
              rules: [{ required: true, message: '请选择最终产品' }],
            })(
              <Fragment>
                <TextArea
                  value={selectedFinal && selectedFinal.length ? selectedFinal.map(({ chineName }) => chineName).join('、') : undefined}
                  {...itemStyles}
                  disabled
                  rows={4}
                  placeholder="请选择最终产品" />
                <Button type="primary" onClick={this.handleViewFinal}>选择</Button>
              </Fragment>
            )}
          </FormItem>
          {/* <FormItem label="重点监控单元" {...formItemLayout}>
            {getFieldDecorator('keyMonitoringUnit', {
              initialValue: id ? detail.keyMonitoringUnit : undefined,
              rules: [{ required: true, message: '请输入重点监控单元' }],
              getValueFromEvent: this.trim,
            })(
              <TextArea rows={4} placeholder="请输入重点监控单元" {...itemStyles} />
            )}
          </FormItem> */}
          <FormItem label="重点监控单元" {...formItemLayout}>
            {getFieldDecorator('keyMonitoringUnit', {
              initialValue: id ? detail.keyMonitoringUnit : undefined,
              rules: [{ required: true, message: '请选择重点监控单元' }],
              getValueFromEvent: this.trim,
            })(
              <Fragment>
                <TextArea
                  value={selectedMonitor && selectedMonitor.length ? selectedMonitor.map(({ name }) => name).join('、') : undefined}
                  {...itemStyles}
                  disabled
                  rows={4}
                  placeholder="请选择重点监控单元" />
                <Button type="primary" onClick={this.handleViewMonitor}>选择</Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="工艺危险特点" {...formItemLayout}>
            {getFieldDecorator('dangerousCharacter', {
              initialValue: id ? detail.dangerousCharacter : undefined,
              rules: [{ required: true, message: '请输入工艺危险特点' }],
              getValueFromEvent: this.trim,
            })(
              <TextArea rows={4} placeholder="请输入工艺危险特点"  {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="工艺系统简况" {...formItemLayout}>
            {getFieldDecorator('processBrief', {
              initialValue: id ? detail.processBrief : undefined,
              rules: [
                { required: true, message: '请输入工艺系统简况' },
                { max: 50, message: '请输入不超过50个字符' },
              ],
              getValueFromEvent: this.trim,
            })(
              <TextArea rows={4} placeholder="请输入工艺系统简况" {...itemStyles} />
            )}
          </FormItem>
          {/* <FormItem label="最高温度（℃）" {...formItemLayout}>
            {getFieldDecorator('maxTemperature', {
              initialValue: id ? detail.maxTemperature : undefined,
              rules: [{ required: true, validator: this.validateNumber }],
              getValueFromEvent: this.trim,
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="最高压力（KPa）" {...formItemLayout}>
            {getFieldDecorator('maxPressure', {
              initialValue: id ? detail.maxPressure : undefined,
              rules: [{ required: true, validator: this.validateNumber }],
              getValueFromEvent: this.trim,
            })(
              <Input placeholder="请输入" {...itemStyles} />
            )}
          </FormItem> */}
          <FormItem label="岗位操作人数" {...formItemLayout}>
            {getFieldDecorator('operationNumber', {
              initialValue: id ? detail.operationNumber : undefined,
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
            {getFieldDecorator('certificatesNum', {
              initialValue: id ? detail.certificatesNum : undefined,
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
          {/* <FormItem label="技术来源" {...formItemLayout}>
            {getFieldDecorator('technicalSource', {
              initialValue: id ? detail.technicalSource : undefined,
              getValueFromEvent: this.trim,
              rules: [{ max: 50, message: '请输入不超过50个字符' }],
            })(
              <TextArea rows={4} placeholder="请输入技术来源"  {...itemStyles} />
            )}
          </FormItem> */}
          <FormItem label="技术来源" {...formItemLayout}>
            {getFieldDecorator('technicalSource', {
              initialValue: id ? detail.technicalSource : undefined,
            })(
              <RadioGroup options={TECHNICAL_OPTIONS} />
            )}
          </FormItem>
          <FormItem label="设计单位" {...formItemLayout}>
            {getFieldDecorator('designUnit', {
              initialValue: id ? detail.designUnit : undefined,
              getValueFromEvent: this.trim,
              rules: [{ max: 50, message: '请输入不超过50个字符' }],
            })(
              <TextArea rows={4} placeholder="请输入设计单位" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="设计单位资质等级" {...formItemLayout}>
            {getFieldDecorator('qualificationGrade', {
              initialValue: id ? detail.qualificationGrade : undefined,
              rules: [{ required: true, message: '请选择设计单位资质等级' }],
            })(
              // <Select placeholder="请选择设计单位资质等级" {...itemStyles}>
              //   {qualificationLevelDict.map(({ value, label }) => (
              //     <Option key={value} value={value}>{label}</Option>
              //   ))}
              // </Select>
              <RadioGroup options={qualificationLevelDict} />
            )}
          </FormItem>
          <FormItem label="是否满足国家规定的要求" {...formItemLayout}>
            {getFieldDecorator('nationalRegulations', {
              initialValue: id ? detail.nationalRegulations : undefined,
              rules: [{ required: true, message: '请选择是否满足国家规定的要求' }],
            })(
              <RadioGroup>
                <Radio value={0}>否</Radio>
                <Radio value={1}>是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {/* <FormItem label="资质等级描述" {...formItemLayout}>
            {getFieldDecorator('qualifGradeDescription', {
              initialValue: id ? detail.qualifGradeDescription : undefined,
              rules: [
                { required: true, message: '请输入资质等级描述' },
                { max: 50, message: '请输入不超过50个字符' },
              ],
              getValueFromEvent: this.trim,
            })(
              <TextArea rows={4} placeholder="请输入资质等级描述" {...itemStyles} />
            )}
          </FormItem> */}
          <FormItem label="安全控制基本要求" {...formItemLayout}>
            {getFieldDecorator('basicControlRequire', {
              initialValue: id ? detail.basicControlRequire : undefined,
              rules: [
                { required: true, message: '请输入安全控制基本要求' },
                { max: 50, message: '请输入不超过50个字符' },
              ],
              getValueFromEvent: this.trim,
            })(
              <TextArea
                rows={4}
                placeholder="请输入安全控制基本要求"
                {...itemStyles}
              />
            )}
          </FormItem>
          <FormItem label="控制方式" {...formItemLayout}>
            {getFieldDecorator('controlMode', {
              initialValue: id && detail.controlMode ? detail.controlMode.split(',').filter(s => s) : undefined,
              rules: [
                { required: true, message: '请选择控制方式' },
              ],
            })(
              <CheckboxGroup options={CONTROL_OPTIONS} />
            )}
          </FormItem>
          <FormItem label="自动控制措施" {...formItemLayout}>
            {getFieldDecorator('autoControl', {
              initialValue: id ? detail.autoControl : undefined,
              getValueFromEvent: this.trim,
              rules: [{ max: 50, message: '请输入不超过50个字符' }],
            })(
              <TextArea rows={4} placeholder="如：PLC自动控制"  {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="安全仪表系统" {...formItemLayout}>
            {getFieldDecorator('sis', {
              initialValue: id ? detail.sis : undefined,
              rules: [
                // { required: true, message: '请输入安全仪表系统' },
                { max: 50, message: '请输入不超过50个字符' },
              ],
              getValueFromEvent: this.trim,
            })(
              <TextArea rows={4} placeholder="请输入安全仪表系统"  {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="SIL等级" {...formItemLayout}>
            {getFieldDecorator('sisLevel', {
              initialValue: id ? detail.sisLevel : undefined,
              // rules: [{ required: true, message: '请选择SIL等级' }],
            })(
              // <Select placeholder="请选择SIL等级" {...itemStyles}>
              //   {SILLevelDict.map(({ value, label }) => (
              //     <Option key={value} value={value}>{label}</Option>
              //   ))}
              // </Select>
              <RadioGroup options={SILLevelDict} />
            )}
          </FormItem>
          {/* <FormItem label="安全阀/爆破片" {...formItemLayout}>
            {getFieldDecorator('safetyValve', {
              initialValue: id ? detail.safetyValve : undefined,
              rules: [
                { required: true, message: '请输入安全阀/爆破片' },
                { max: 50, message: '请输入不超过50个字符' },
              ],
              getValueFromEvent: this.trim,
            })(
              <TextArea
                rows={4}
                placeholder="请输入安全阀/爆破片"
                {...itemStyles}
              />
            )}
          </FormItem> */}
          <FormItem label="带控制点的工艺流程图" {...formItemLayout}>
            {getFieldDecorator('flowChartControlPoint')(
              <Fragment>
                <Upload
                  {...defaultUploadProps}
                  fileList={flowChartList}
                  disabled={flowChartLoading}
                  accept="image/*" // 接收的文件格式
                  onChange={(info) => this.handleFileUploadChange(info, 'flowChartList', 'flowChartLoading')}
                >
                  <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                    <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                    <div style={{ marginTop: '8px' }}>点击上传</div>
                  </Button>
                </Upload>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="设备一览表" {...formItemLayout}>
            {getFieldDecorator('equipmentList')(
              <Fragment>
                <Upload
                  {...defaultUploadProps}
                  fileList={equipmentList}
                  disabled={equipmentListLoading}
                  onChange={(info) => this.handleFileUploadChange(info, 'equipmentList', 'equipmentListLoading')}
                >
                  <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                    <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                    <div style={{ marginTop: '8px' }}>点击上传</div>
                  </Button>
                </Upload>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="设备布置图" {...formItemLayout}>
            {getFieldDecorator('equipmentLayout')(
              <Fragment>
                <Upload
                  {...defaultUploadProps}
                  fileList={equipmentLayoutList}
                  disabled={equipmentLayoutLoading}
                  accept="image/*" // 接收的文件格式
                  onChange={(info) => this.handleFileUploadChange(info, 'equipmentLayoutList', 'equipmentLayoutLoading')}
                >
                  <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                    <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                    <div style={{ marginTop: '8px' }}>点击上传</div>
                  </Button>
                </Upload>
              </Fragment>
            )}
          </FormItem>
        </Form>
        <Row justify="center" style={{ textAlign: 'center', marginTop: '24px' }}>
          {isDetail ? (
            // <Button type="primary" onClick={e => router.push(`/major-hazard-info/high-risk-process/edit/${id}`)}>
            //   编辑
            // </Button>
            null
          ) : (
            <Button type="primary" onClick={this.handleSubmit}>
              提交
          </Button>
          )}
          <Button style={{ marginLeft: 20 }} onClick={this.goBack}>返回</Button>
        </Row>
      </Card>
    );
  };

  render () {
    const {
      middleLoading,
      companyLoading,
      monitorLoading,
      match: { params: { id = null } = {} },
      sensor: { companyModal },
      materials,
    } = this.props;
    const {
      companyModalVisible,
      rawModalVisible,
      middleModalVisible,
      finalModalVisible,
      selectedTemp,
      monitorModalVisible,
      selectedMonitorTemp,
    } = this.state;

    const { monitorModal } = materials;
    const isDetail = /detail/i.test(window.location.href); // 是否是详情
    const title = id ? isDetail ? '工艺流程详情' : '编辑工艺流程' : '新增工艺流程';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '基本信息', name: '基本信息' },
      { title: '工艺流程', name: '工艺流程', href: '/major-hazard-info/high-risk-process/list' },
      { title, name: title },
    ];
    const materialsColumns = [
      {
        title: '统一编码',
        dataIndex: 'unifiedCode',
        key: 'unifiedCode',
      },
      {
        title: '品名',
        dataIndex: 'chineName',
        key: 'chineName',
      },
      {
        title: 'CAS号',
        dataIndex: 'casNo',
        key: 'casNo',
      },
      {
        title: '危险性类别',
        dataIndex: 'riskCateg',
        key: 'riskCateg',
        // render: data => RISK_CATEGORIES[data],
        render: data => getRiskCategoryLabel(data, RISK_CATEGORIES),
      },
    ];
    const materialsFields = [
      {
        id: 'casNo',
        render () {
          return <Input placeholder="CAS号" />;
        },
        transform (value) {
          return value.trim();
        },
      },
      {
        id: 'chineName',
        render () {
          return <Input placeholder="品名" />;
        },
        transform (value) {
          return value.trim();
        },
      },
    ];
    const monitorColumns = [
      {
        title: '类别',
        dataIndex: 'type',
        key: 'type',
        render: t => getTypeLabel(t, MOINTOR_TYPES),
      },
      {
        title: '编号',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
    ];
    const monitorFields = [
      {
        id: 'types',
        render () {
          return (
            <Select placeholder="请选择单元类别" mode="multiple" allowClear>
              {MOINTOR_TYPES.map(({ value, label }) => <Option key={value} value={value}>{label}</Option>)}
            </Select>
          );
        },
      },
      // {
      //   id: 'chineName',
      //   render () {
      //     return <Input placeholder="品名" />;
      //   },
      //   transform (value) {
      //     return value.trim();
      //   },
      // },
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
        <CompanyModal
          title="选择生产原料"
          multiSelect
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedTemp.map(item => item.id),
            onChange: (keys, rows) => { this.setState({ selectedTemp: rows }) },
          }}
          columns={materialsColumns}
          field={materialsFields}
          butonStyles={{ width: 'auto' }}
          loading={middleLoading}
          visible={rawModalVisible}
          modal={materials}
          fetch={this.fetchMaterials}
          extraFetchParams={{ type: 1 }}
          onSelect={this.handleSelectRaw}
          onClose={() => { this.setState({ rawModalVisible: false }) }}
        />
        {/* 选择中间产品弹窗 */}
        <CompanyModal
          title="选择中间产品"
          multiSelect
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedTemp.map(item => item.id),
            onChange: (keys, rows) => { this.setState({ selectedTemp: rows }) },
          }}
          columns={materialsColumns}
          field={materialsFields}
          butonStyles={{ width: 'auto' }}
          loading={middleLoading}
          visible={middleModalVisible}
          modal={materials}
          fetch={this.fetchMaterials}
          extraFetchParams={{ type: 2 }}
          onSelect={this.handleSelectMiddle}
          onClose={() => { this.setState({ middleModalVisible: false }) }}
        />
        {/* 选择最终产品弹窗 */}
        <CompanyModal
          title="选择最终产品"
          multiSelect
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedTemp.map(item => item.id),
            onChange: (keys, rows) => { this.setState({ selectedTemp: rows }) },
          }}
          columns={materialsColumns}
          field={materialsFields}
          butonStyles={{ width: 'auto' }}
          loading={middleLoading}
          visible={finalModalVisible}
          modal={materials}
          fetch={this.fetchMaterials}
          extraFetchParams={{ type: 3 }}
          onSelect={this.handleSelectFinal}
          onClose={() => { this.setState({ finalModalVisible: false }) }}
        />
        <CompanyModal
          title="选择重点监控单元"
          multiSelect
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedMonitorTemp.map(item => item.id),
            onChange: (keys, rows) => { this.setState({ selectedMonitorTemp: rows }) },
          }}
          columns={monitorColumns}
          field={monitorFields}
          butonStyles={{ width: 'auto' }}
          loading={monitorLoading}
          visible={monitorModalVisible}
          modal={monitorModal}
          fetch={this.fetchMonitors}
          onSelect={this.handleSelectMonitor}
          onClose={() => { this.setState({ monitorModalVisible: false }) }}
        />
      </PageHeaderLayout>
    );
  }
}
