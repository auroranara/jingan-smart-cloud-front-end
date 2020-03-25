import { PureComponent, Fragment } from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Input, Select, Button, Radio, Row, message, InputNumber, Upload } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { getToken } from 'utils/authority';
import { RISK_CATEGORIES } from '@/pages/SafetyKnowledgeBase/MSDS/utils';

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
}))
export default class EmergencySuppliesHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 选中的企业
      selectedCompany: {},
      // 中间产品弹窗可见
      middleModalVisible: false,
      // 最终产品弹窗可见
      finalModalVisible: false,
      // 选中的中间产品
      selectedMiddle: [],
      // 选中的最终产品
      selectedFinal: [],
      selectedTemp: [],
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
          middleList,
          finalList,
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
            selectedMiddle: middleList || [],
            selectedFinal: finalList || [],
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
      const payload = {
        ...formData,
        companyId: selectedCompany.id,
        flowChartControlPoint: JSON.stringify(flowChartList),
        equipmentList: JSON.stringify(equipmentList),
        equipmentLayout: JSON.stringify(equipmentLayoutList),
      }
      // console.log('提交', payload)
      const success = () => {
        message.success(id ? '编辑成功！' : '新增成功！');
        router.push('/major-hazard-info/high-risk-process/list');
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

  // 点击打开选择中间产品弹窗
  handleViewMiddle = () => {
    this.setState(({ selectedMiddle }) => ({ middleModalVisible: true, selectedTemp: selectedMiddle }))
    this.fetchMaterials({
      payload: {
        pageSize: 10,
        pageNum: 1,
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
      },
    });
  }

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

  handleSelectMiddle = () => {
    const { setFieldsValue } = this.props.form;
    const { selectedTemp } = this.state;
    this.setState({ selectedMiddle: selectedTemp, middleModalVisible: false })
    setFieldsValue({ middleId: selectedTemp.map((item) => item.id).join(',') })
  }

  handleSelectFinal = () => {
    const { setFieldsValue } = this.props.form;
    const { selectedTemp } = this.state;
    this.setState({ selectedFinal: selectedTemp, finalModalVisible: false })
    setFieldsValue({ finalId: selectedTemp.map((item) => item.id).join(',') })
  }

  trim = e => e.target.value.replace(/\s/, '')

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
      selectedMiddle,
      selectedFinal,
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
          <FormItem label="统一编码" {...formItemLayout}>
            {getFieldDecorator('unifiedCode', {
              initialValue: id ? detail.unifiedCode : undefined,
              rules: [
                { required: true, message: '请输入统一编码' },
                { max: 12, message: '请输入不超过12个字符' },
              ],
              getValueFromEvent: this.trim,
            })(<Input placeholder="请输入统一编码" {...itemStyles} />)}
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
          <FormItem label="重点监控单元" {...formItemLayout}>
            {getFieldDecorator('keyMonitoringUnit', {
              initialValue: id ? detail.keyMonitoringUnit : undefined,
              rules: [{ required: true, message: '请输入重点监控单元' }],
              getValueFromEvent: this.trim,
            })(
              <TextArea rows={4} placeholder="请输入重点监控单元" {...itemStyles} />
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
          <FormItem label="最高温度（℃）" {...formItemLayout}>
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
          </FormItem>
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
          <FormItem label="技术来源" {...formItemLayout}>
            {getFieldDecorator('technicalSource', {
              initialValue: id ? detail.technicalSource : undefined,
              getValueFromEvent: this.trim,
              rules: [{ max: 50, message: '请输入不超过50个字符' }],
            })(
              <TextArea rows={4} placeholder="请输入技术来源"  {...itemStyles} />
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
              rules: [{ required: true, message: '请输入设计单位资质等级' }],
            })(
              <Select placeholder="请选择设计单位资质等级" {...itemStyles}>
                {qualificationLevelDict.map(({ value, label }) => (
                  <Option key={value} value={value}>{label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="资质等级描述" {...formItemLayout}>
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
          </FormItem>
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
          <FormItem label="自动控制措施" {...formItemLayout}>
            {getFieldDecorator('autoControl', {
              initialValue: id ? detail.autoControl : undefined,
              getValueFromEvent: this.trim,
              rules: [{ max: 50, message: '请输入不超过50个字符' }],
            })(
              <TextArea rows={4} placeholder="请输入自动控制措施"  {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="安全仪表系统" {...formItemLayout}>
            {getFieldDecorator('sis', {
              initialValue: id ? detail.sis : undefined,
              rules: [
                { required: true, message: '请输入安全仪表系统' },
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
              rules: [{ required: true, message: '请选择SIL等级' }],
            })(
              <Select placeholder="请选择SIL等级" {...itemStyles}>
                {SILLevelDict.map(({ value, label }) => (
                  <Option key={value} value={value}>{label}</Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem label="安全阀/爆破片" {...formItemLayout}>
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
          </FormItem>
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
          <Button style={{ marginRight: '10px' }} onClick={() => { router.push('/major-hazard-info/high-risk-process/list') }}>返回</Button>
          {isDetail ? (
            <Button type="primary" onClick={e => router.push(`/major-hazard-info/high-risk-process/edit/${id}`)}>
              编辑
            </Button>
          ) : (
              <Button type="primary" onClick={this.handleSubmit}>
                提交
            </Button>
            )}
        </Row>
      </Card>
    );
  };

  render () {
    const {
      middleLoading,
      companyLoading,
      match: { params: { id = null } = {} },
      sensor: { companyModal },
      materials,
    } = this.props;
    const {
      companyModalVisible,
      middleModalVisible,
      finalModalVisible,
      selectedTemp,
    } = this.state;
    // 是否是详情
    const isDetail = /detail/i.test(window.location.href);
    const title = id ? isDetail ? '高危工艺流程详情' : '编辑高危工艺流程' : '新增高危工艺流程';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '基本信息', name: '基本信息' },
      { title: '高危工艺流程', name: '高危工艺流程', href: '/major-hazard-info/high-risk-process/list' },
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
        render: data => RISK_CATEGORIES[data],
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
          onSelect={this.handleSelectFinal}
          onClose={() => { this.setState({ finalModalVisible: false }) }}
        />
      </PageHeaderLayout>
    );
  }
}
