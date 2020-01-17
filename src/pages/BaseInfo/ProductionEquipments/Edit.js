import { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Form, Input, Radio, Select, message, InputNumber } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import router from 'umi/router';
import { BREADCRUMBLIST, LIST_URL } from './utils';
import CompanySelect from '@/jingan-components/CompanySelect';
import CompanyModal from '../../BaseInfo/Company/CompanyModal';
import { RISK_CATEGORIES } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { AutoList } from './utils';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const itemStyles = { style: { width: 'calc(70%)', marginRight: '10px' } };

@Form.create()
@connect(({ productionEquipments, materials, user, loading }) => ({
  productionEquipments,
  materials,
  user,
  loading: loading.models.productionEquipments,
  technologyLoading: loading.effects['productionEquipments/fetchHighRiskProcessList'],
  materialsLoading: loading.effects['materials/fetchMaterialsList'],
}))
export default class Edit extends PureComponent {
  state = {
    technologyVisible: false, // 危险化工工艺弹框是否可见
    materialsVisible: false, // 贮存物质弹框是否可见
    selectedCompany: {}, // 选中的company
    selectedMaterials: [], // 选中的贮存物质
    materialsNum: {}, // 危化品数量
    dangerTechnologyId: '', // 选中的高危工艺Id
    detailList: {},
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
        type: 'productionEquipments/fetchProEquipList',
        payload: {
          pageSize: 48,
          pageNum: 1,
        },
        callback: res => {
          const {
            data: { list },
          } = res;
          const currentList = list.find(item => item.id === id) || {};
          const {
            companyId,
            companyName,
            dangerTechnologyList,
            unitChemiclaNumDetail,
          } = currentList;
          this.setState({
            detailList: currentList,
            dangerTechnologyId: dangerTechnologyList.map(item => item.id).join(','),
            selectedCompany: { key: companyId, label: companyName },
            selectedMaterials: unitChemiclaNumDetail.map(item => ({
              ...item,
              id: item.materialId,
            })),
            materialsNum: unitChemiclaNumDetail.reduce((prev, next) => {
              const { materialId, unitChemiclaNum } = next;
              prev[materialId] = unitChemiclaNum;
              return prev;
            }, {}),
          });
        },
      });
    } else {
      dispatch({
        type: 'productionEquipments/clearDetail',
      });
    }
  }

  goBack = () => {
    router.push(`${LIST_URL}`);
  };

  // 去除左右两边空白
  handleTrim = e => e.target.value.trim();

  // 选择企业
  onChangeComapny = item => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedCompany: item, selectedMaterials: [] });
    setFieldsValue({ dangerTechnologyName: '', unitChemicla: '' });
  };

  // 打开高危工艺弹框
  handleTechnologyModal = () => {
    const {
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { selectedCompany } = this.state;
    const fixCompanyId = selectedCompany.key || companyId;
    if (fixCompanyId) {
      this.setState({ technologyVisible: true });
      const payload = { pageSize: 10, pageNum: 1 };
      this.fetchTechnologyList({ payload });
    } else {
      message.warning('请先选择单位！');
    }
  };

  // 获取高危工艺列表
  fetchTechnologyList = ({ payload }) => {
    const { selectedCompany } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'productionEquipments/fetchHighRiskProcessList',
      payload: { ...payload, companyId: selectedCompany.key },
    });
  };

  // 选择高危工艺
  handleTechnologySelect = item => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ dangerTechnologyName: item.map(item => item.processName).join(',') });
    this.setState({
      technologyVisible: false,
      dangerTechnologyId: item.map(item => item.id).join(','),
    });
  };

  // 打开贮存物质弹框
  handleMaterialsModal = () => {
    const {
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { selectedCompany } = this.state;
    const fixCompanyId = selectedCompany.key || companyId;
    if (fixCompanyId) {
      this.setState({ materialsVisible: true });
      const payload = { pageSize: 10, pageNum: 1 };
      this.fetchMaterialsList({ payload });
    } else {
      message.warning('请先选择单位！');
    }
  };

  // 获取贮存物质列表
  fetchMaterialsList = ({ payload }) => {
    const { dispatch } = this.props;
    const { selectedCompany } = this.state;
    dispatch({
      type: 'materials/fetchMaterialsList',
      payload: { ...payload, companyId: selectedCompany.key },
    });
  };

  // 选择贮存物质
  handleMaterialsSelect = selectedMaterials => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { materialsNum } = this.state;
    this.setState({ selectedMaterials, materialsVisible: false });
    setFieldsValue({
      unitChemicla: JSON.stringify(
        selectedMaterials.map(item => ({
          chineName: item.chineName,
          materialId: item.id,
          unitChemiclaNum: materialsNum[item.id],
        }))
      ),
    });
  };

  handleSubmit = () => {
    const {
      match: {
        params: { id },
      },
      dispatch,
      form: { validateFieldsAndScroll },
      user: {
        currentUser: { companyId, unitType },
      },
    } = this.props;
    const { selectedCompany, dangerTechnologyId } = this.state;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const {
          code,
          name,
          model,
          location,
          keyDevice,
          environment,
          deviceFunction,
          deviceStatus,
          deviceProduct,
          pressure,
          deviceEnergyConsumption,
          deviceTechnology,
          automaticControl,
          unitChemicla,
        } = values;
        const payload = {
          id,
          companyId: unitType === 4 ? companyId : selectedCompany.key,
          code,
          name,
          model,
          location,
          keyDevice,
          dangerTechnology: dangerTechnologyId,
          environment,
          deviceFunction,
          deviceStatus,
          deviceProduct,
          pressure,
          deviceEnergyConsumption,
          deviceTechnology,
          automaticControl,
          unitChemicla,
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
            type: 'productionEquipments/fetchProEquipEdit',
            payload,
            success,
            error,
          });
        } else {
          dispatch({
            type: 'productionEquipments/fetchProEquipAdd',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      form: { getFieldDecorator },
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const { detailList, selectedMaterials, materialsNum } = this.state;

    const { autoList = AutoList } = {};

    const {
      companyName,
      companyId,
      code,
      name,
      model,
      location,
      keyDevice,
      dangerTechnologyList,
      environment,
      deviceFunction,
      deviceStatus,
      deviceProduct,
      pressure,
      deviceEnergyConsumption,
      deviceTechnology,
      automaticControl,
      unitChemicla,
    } = detailList;

    return (
      <Card>
        <Form>
          {unitType !== 4 && (
            <FormItem label="单位名称" {...formItemLayout}>
              {getFieldDecorator('companyId', {
                initialValue: companyId ? { key: companyId, label: companyName } : undefined,
                rules: [
                  {
                    required: true,
                    message: '请选择',
                    transform: value => value && value.label,
                  },
                ],
              })(
                <CompanySelect
                  {...itemStyles}
                  placeholder="请选择"
                  onChange={this.onChangeComapny}
                />
              )}
            </FormItem>
          )}

          <FormItem label="装置编号" {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: code,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="装置名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: name,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="设备型号" {...formItemLayout}>
            {getFieldDecorator('model', {
              initialValue: model,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="装置位置" {...formItemLayout}>
            {getFieldDecorator('location', {
              initialValue: location,
              rules: [{ required: true, message: '请输入' }],
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="是否关键装置" {...formItemLayout}>
            {getFieldDecorator('keyDevice', {
              initialValue: keyDevice ? +keyDevice : undefined,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Radio.Group {...itemStyles}>
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            )}
            <div style={{ color: '#999999' }}>
              说明：在易燃、易爆、有毒、有害、易腐蚀、高温、高压、真空、深冷、等条件下进行工艺操作的生产装置。
            </div>
          </FormItem>

          <FormItem label="设计压力（KPa）" {...formItemLayout}>
            {getFieldDecorator('pressure', {
              initialValue: pressure,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="装置状态" {...formItemLayout}>
            {getFieldDecorator('deviceStatus', {
              initialValue: deviceStatus ? +deviceStatus : undefined,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Radio.Group>
                <Radio value={1}>正常</Radio>
                <Radio value={2}>维检</Radio>
                <Radio value={3}>报废</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="所属危险化工工艺" {...formItemLayout}>
            {getFieldDecorator('dangerTechnologyName', {
              initialValue: dangerTechnologyList
                ? dangerTechnologyList.map(item => item.processName).join(',')
                : undefined,
              rules: [{ required: true, message: '请选择' }],
            })(<Input placeholder="请选择" disabled {...itemStyles} />)}
            <Button type="primary" onClick={this.handleTechnologyModal}>
              选择
            </Button>
          </FormItem>

          <FormItem label="主要危化品及数量" {...formItemLayout}>
            {getFieldDecorator('unitChemicla', {
              initialValue: unitChemicla,
              rules: [{ required: true, message: '请选择' }],
            })(
              <Fragment>
                <TextArea
                  {...itemStyles}
                  rows={4}
                  placeholder="请选择"
                  value={selectedMaterials
                    .map(
                      item => item.chineName + (materialsNum[item.id] ? materialsNum[item.id] : '')
                    )
                    .join('，')}
                  disabled
                />
                <Button type="primary" onClick={this.handleMaterialsModal}>
                  选择
                </Button>
              </Fragment>
            )}
          </FormItem>

          <FormItem label="装置生产能力" {...formItemLayout}>
            {getFieldDecorator('deviceProduct', {
              initialValue: deviceProduct,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="装置能耗" {...formItemLayout}>
            {getFieldDecorator('deviceEnergyConsumption', {
              initialValue: deviceEnergyConsumption,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="装置技术条件" {...formItemLayout}>
            {getFieldDecorator('deviceTechnology', {
              initialValue: deviceTechnology,
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入' }],
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="自动化控制方式" {...formItemLayout}>
            {getFieldDecorator('automaticControl', {
              initialValue: automaticControl,
            })(
              <Select {...itemStyles} allowClear placeholder="请选择">
                {autoList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>

          <FormItem label="装置功能" {...formItemLayout}>
            {getFieldDecorator('deviceFunction', {
              initialValue: deviceFunction,
              rules: [{ required: true, message: '请输入' }],
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>

          <FormItem label="周围环境" {...formItemLayout}>
            {getFieldDecorator('environment', {
              initialValue: environment,
              rules: [{ required: true, message: '请输入' }],
              getValueFromEvent: this.handleTrim,
            })(<Input placeholder="请输入" {...itemStyles} />)}
          </FormItem>
        </Form>
      </Card>
    );
  };

  render() {
    const {
      technologyLoading,
      materialsLoading,
      match: {
        params: { id },
      },
      materials,
      productionEquipments: { highRiskProcess },
    } = this.props;

    const { technologyVisible, materialsVisible, materialsNum, selectedMaterials } = this.state;

    const title = id ? '编辑' : '新增';
    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title, name: title });

    const materialsModal = {
      ...materials,
      list: materials.list.map(item => {
        const material = selectedMaterials.find(material => material.materialId === item.id) || {};
        return { ...item, unitChemiclaNum: material.unitChemiclaNum };
      }),
    };

    const technologyFields = [
      {
        id: 'processName',
        render() {
          return <Input placeholder="请输入高危工艺名称" />;
        },
      },
      {
        id: 'unifiedCode',
        render() {
          return <Input placeholder="请输入统一编码" />;
        },
      },
      {
        id: 'reactionType',
        render() {
          return <Input placeholder="请输入反应类型" />;
        },
      },
    ];

    const technologyColumns = [
      {
        title: '高危工艺名称',
        dataIndex: 'processName',
        key: 'processName',
        align: 'center',
      },
      {
        title: '统一编码',
        dataIndex: 'unifiedCode',
        key: 'unifiedCode',
        align: 'center',
      },
      {
        title: '反应类型',
        dataIndex: 'reactionType',
        key: 'reactionType',
        align: 'center',
      },
    ];

    const materialsFields = [
      {
        id: 'casNo',
        render() {
          return <Input placeholder="CAS号" />;
        },
        transform(value) {
          return value.trim();
        },
      },
      {
        id: 'chineName',
        render() {
          return <Input placeholder="品名" />;
        },
        transform(value) {
          return value.trim();
        },
      },
    ];

    const materialsColumns = [
      {
        title: '统一编码',
        dataIndex: 'unifiedCode',
        key: 'unifiedCode',
        align: 'center',
      },
      {
        title: '品名',
        dataIndex: 'chineName',
        key: 'chineName',
        align: 'center',
      },
      {
        title: 'CAS号',
        dataIndex: 'casNo',
        key: 'casNo',
        align: 'center',
      },
      {
        title: '危险性类别',
        dataIndex: 'riskCateg',
        key: 'riskCateg',
        align: 'center',
        render: data => RISK_CATEGORIES[data],
      },
      {
        title: '危化品数量(t)',
        dataIndex: 'unitChemiclaNum',
        key: 'unitChemiclaNum',
        align: 'center',
        render: (data, row) => (
          <InputNumber
            placeholder="危化品数量"
            min={0}
            ref={node => (this.input = node)}
            onBlur={e => {
              this.setState({
                materialsNum: {
                  ...materialsNum,
                  [row.id]: e.target.value,
                },
              });
            }}
            defaultValue={data}
            formatter={value => (!value || isNaN(value) ? '' : value)}
            parser={value => (!value || isNaN(value) ? '' : value)}
            style={{ width: '100%' }}
          />
        ),
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderForm()}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span>
            <Button
              style={{ marginLeft: '50%', transform: 'translateX(-50%)', marginTop: '24px' }}
              type="primary"
              size="large"
              onClick={this.handleSubmit}
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

        {/** 选择高危工艺 */}
        <CompanyModal
          title="选择高危工艺"
          multiSelect
          rowSelection={{ type: 'checkbox' }}
          loading={technologyLoading}
          visible={technologyVisible}
          modal={highRiskProcess}
          columns={technologyColumns}
          field={technologyFields}
          fetch={this.fetchTechnologyList}
          onSelect={this.handleTechnologySelect}
          onClose={() => {
            this.setState({ technologyVisible: false });
          }}
        />

        {/** 选择贮存物质 */}
        <CompanyModal
          title="选择贮存物质"
          multiSelect
          rowSelection={{ type: 'checkbox' }}
          butonStyles={{ width: 'auto' }}
          loading={materialsLoading}
          visible={materialsVisible}
          modal={materialsModal}
          columns={materialsColumns}
          field={materialsFields}
          fetch={this.fetchMaterialsList}
          onSelect={this.handleMaterialsSelect}
          onClose={() => {
            this.setState({ materialsVisible: false });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
