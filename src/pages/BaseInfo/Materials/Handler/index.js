import { PureComponent, Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Input, Select, Button, Radio, Row, message, InputNumber } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
// import { KEYSUPERVISION } from '../utils.js';
import { RISK_CATEGORIES, getRiskCategoryLabel } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { genGoBack } from '@/utils/utils';

import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
const { Group: RadioGroup } = Radio;
// const NO_DATA = '暂无数据';
/* root下的div */
// const getRootChild = () => document.querySelector('#root>div');
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const listUrl = '/major-hazard-info/materials/list';

const itemStyles = { style: { width: '70%', marginRight: '10px' } };
const unitLayout = {
  label: '',
  colon: false,
  labelCol: { span: 0 },
  wrapperCol: { span: 14 },
  style: { position: 'absolute', left: '78%', top: 0, width: '20%' },
};

const unitOptions = [{ value: '1', label: 't' }, { value: '2', label: 'm³' }];

const dangerSourceColumns = [
  {
    title: '统一编码',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '危险源名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '重大危险源等级',
    dataIndex: 'dangerLevel',
    key: 'dangerLevel',
  },
  {
    title: '单元内涉及的危险化学品',
    dataIndex: 'unitChemicla',
    key: 'unitChemicla',
  },
];
const dangerSourceFields = [
  {
    id: 'code',
    render() {
      return <Input placeholder="统一编码" />;
    },
    transform(value) {
      return value.trim();
    },
  },
  {
    id: 'name',
    render() {
      return <Input placeholder="危险源名称" />;
    },
    transform(value) {
      return value.trim();
    },
  },
];

const msdsColumns = [
  {
    title: '中文名称',
    dataIndex: 'chineName',
    key: 'chineName',
  },
  {
    title: '英文名称',
    dataIndex: 'engName',
    key: 'engName',
  },
  {
    title: 'CAS号',
    dataIndex: 'casNo',
    key: 'casNo',
  },
];
const msdsFields = [
  {
    id: 'chineName',
    render() {
      return <Input placeholder="中文名称" />;
    },
    transform(value) {
      return value.trim();
    },
  },
  {
    id: 'casNo',
    render() {
      return <Input placeholder="CAS号" />;
    },
    transform(value) {
      return value.trim();
    },
  },
];

@Form.create()
@connect(({ company, materials, loading, user }) => ({
  materials,
  company,
  user,
  companyLoading: loading.effects['company/fetchModelList'],
  dangerSourceLoadinng: loading.effects['materials/fetchDangerSourceModel'],
  msdsLoading: loading.effects['materials/fetchMsdsModel'],
}))
export default class MaterialsHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // 选择企业弹窗
      compayModalVisible: false,
      // 选中的企业
      selectedCompany: {},
      isProduct: false, // 物料类型是否是中间产品或最终产品（物料类型 ：type '1' 生产原料, '2' 中间产品，'3' 最终产品，'4' 辅料）
      majorHazardVisible: false,
      keySupervisionVisible: false,
      selectedMsds: {},
      selectedDangerSource: {},
      dangerSourceModalVisible: false,
      msdsModalVisible: false,
      dangerSources: [], // 重大危险源
    };
    this.goBack = genGoBack(props, listUrl);
  }

  componentDidMount() {
    const {
      form: { setFieldsValue },
      match: { params: { id = null } = {} },
    } = this.props;
    if (id) {
      this.fetchList(res => {
        const {
          list: [
            {
              companyId,
              companyName,
              type, //类型
              unifiedCode, // 统一编码
              dangerChemcataSn, //危险化学品目录序号
              materialForm, //物质形态
              superviseChemicals, //是否重点监管的危险化学品
              msds, //msds
              annualConsumption, //年消耗量
              annualConsumptionUnit, //年消耗量单位
              maxStoreDay, //最大存储量
              maxStoreDayUnit, //最大存储量单位
              // actualReserves, //实际存储量
              // actualReservesUnit, //实际存储量单位
              annualThroughput, //年产量
              annualThroughputUnit, //年产量单位
              // reservesLocation, //存储场所
              // highRiskStorefacil, //是否属于高危储存设施
              // majorHazard, //是否构成危险化学品重大危险源
              // dangerId, //所属危险源id
              // technologyId, //所在工艺流程id
              keySupervisionProcess, //所在工艺流程是否属于重点监管危险化工工艺
              // keySupervision, //重点监管危险化工工艺
              highRiskChemicals, //高危化学品种类
              highlyToxicChem, //是否剧毒化学品
              safetyMeasures, //安全措施
              emergencyMeasure, //应急处置措施
              easyMakePoison, //是否易制毒
              easyMakeExplode, //是否易制爆
              chineName, //品名
              casNo, //cas
              riskCateg, //危险性类别
              dangerSources,
              chineName2, // 化学品中文名称
              isDangerChemicals, // 是否高危化学品
            },
          ],
        } = res.data;

        setFieldsValue({
          companyId,
          type, //类型
          unifiedCode, //编码
          dangerChemcataSn, //危险化学品目录序号
          materialForm, //物质形态
          superviseChemicals, //是否重点监管的危险化学品
          msds, //msds
          // reservesLocation, //存储场所
          // highRiskStorefacil, //是否属于高危储存设施
          // majorHazard, //是否构成危险化学品重大危险源
          // technologyId, //所在工艺流程id
          // keySupervisionProcess, //所在工艺流程是否属于重点监管危险化工工艺
          highlyToxicChem, //是否剧毒化学品
          safetyMeasures, //安全措施
          emergencyMeasure, //应急处置措施
          easyMakePoison, //是否易制毒
          easyMakeExplode, //是否易制爆
          isDangerChemicals, // 是否高危化学品
        });
        this.setState(
          {
            selectedCompany: { id: companyId, name: companyName },
            isProduct: ['2', '3'].includes(type),
            // majorHazardVisible: majorHazard === '1',
            keySupervisionVisible: keySupervisionProcess === '1',
            selectedMsds: { id: msds, chineName, riskCateg, casNo, chineName2 },
            dangerSources,
          },
          () => {
            let newFields = {
              maxStoreDay, //最大存储量
              maxStoreDayUnit, //最大存储量单位
              // actualReserves, //实际存储量
              // actualReservesUnit, //实际存储量单位
              // keySupervision: +keySupervision,
            };
            if (this.state.isProduct) {
              // 如果是产品
              newFields = {
                ...newFields,
                annualThroughput, //年产量
                annualThroughputUnit, //年产量单位
              };
            } else {
              newFields = {
                ...newFields,
                annualConsumption, //年消耗量
                annualConsumptionUnit, //年消耗量单位
              };
            }
            setFieldsValue(newFields);
          }
        );
        setTimeout(() => {
          //高危化学品种类
          setFieldsValue({ highRiskChemicals });
        }, 0);
      });
    }
  }

  fetchList = callback => {
    const {
      dispatch,
      match: { params: { id = null } = {} },
    } = this.props;
    dispatch({
      type: 'materials/fetchMaterialsList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        id,
      },
      callback,
    });
  };

  /**
   * 获取企业列表（弹窗）
   */
  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'company/fetchModelList', payload });
  };

  fetchDangerSource = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'materials/fetchDangerSourceModel', payload });
  };

  fetchMsds = ({ payload }) => {
    const { dispatch } = this.props;
    const { selectedCompany } = this.state;
    dispatch({
      type: 'materials/fetchMsdsModel',
      payload: { ...payload, companyId: selectedCompany.id },
    });
  };

  // 根据CAS号获取信息
  fetchInfoByCas = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'materials/fetchInfoByCas',
      ...actions,
    });
  };

  handleSubmit = () => {
    const {
      dispatch,
      user: {
        currentUser: { unitType, companyId },
      },
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props;

    validateFields((error, formData) => {
      if (!error) {
        const payload = { ...formData, companyId: unitType === 4 ? companyId : formData.companyId };
        const success = () => {
          message.success(id ? '编辑成功！' : '新增成功！');
          // if (id)
          //   setTimeout(() => window.close(), 1000);
          // else
          //   router.push(listUrl);
          setTimeout(this.goBack, 1000);
        };
        const error = () => {
          message.error(id ? '编辑失败' : '新增失败！');
        };
        if (id) {
          dispatch({
            type: 'materials/editMaterials',
            payload: { ...payload, id },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'materials/addMaterials',
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

  handleSelectDangerSource = selectedDangerSource => {
    // console.log('selectedDangerSource', selectedDangerSource);
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedDangerSource, dangerSourceModalVisible: false });
    setFieldsValue({ dangerId: selectedDangerSource.id });
  };

  // 选择品名
  handleSelectMsds = selectedMsds => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedMsds, msdsModalVisible: false });
    setFieldsValue({ msds: selectedMsds.id });
    // 如果存在CAS号 带入危险化学品目录序号
    const casNumber = selectedMsds ? selectedMsds.casNo : undefined;
    const isDangerChemical = selectedMsds ? selectedMsds.isDangerChemical : undefined;
    setFieldsValue({
      dangerChemcataSn: casNumber,
      isDangerChemicals: isDangerChemical || '0',
    });
    if (casNumber) {
      // 是否重点监管危险化学品
      this.fetchInfoByCas({
        payload: { casNumber, type: '1' },
        callback: value => {
          setFieldsValue({ superviseChemicals: value });
        },
      });
      // 是否易制爆危险化学品
      this.fetchInfoByCas({
        payload: { casNumber, type: '2' },
        callback: value => {
          setFieldsValue({ easyMakeExplode: value });
        },
      });
      // 是否剧毒化学品
      this.fetchInfoByCas({
        payload: { casNumber, type: '3' },
        callback: value => {
          setFieldsValue({ highlyToxicChem: value });
        },
      });
      // 是否危险化学品
      // this.fetchInfoByCas({
      //   payload: { casNumber, type: '4' },
      //   callback: value => {
      //     setFieldsValue({ isDangerChemicals: value });
      //   },
      // });
      // 是否易制毒化学品
      this.fetchInfoByCas({
        payload: { casNumber, type: '5' },
        callback: value => {
          setFieldsValue({ easyMakePoison: value });
        },
      });
    }
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

  handleDangerSourceModal = () => {
    this.setState({ dangerSourceModalVisible: true });
    this.fetchDangerSource({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  handleViewMsdsModal = () => {
    this.setState({ msdsModalVisible: true });
    this.fetchMsds({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  handleTypeChange = e => {
    this.setState({ isProduct: ['2', '3'].includes(e.target.value) });
  };

  handleMajorHazardChange = e => {
    this.setState({ majorHazardVisible: e.target.value === '1' });
  };

  handleKeySupervisionChange = e => {
    this.setState({ keySupervisionVisible: e.target.value === '1' });
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      user: {
        currentUser: { unitType },
      },
      form: { getFieldDecorator, getFieldValue },
      // match: {
      //   params: { id },
      // },
      materials: { materialTypeOptions },
    } = this.props;
    const {
      selectedCompany,
      isProduct,
      // majorHazardVisible,
      // keySupervisionVisible,
      selectedMsds,
      // selectedDangerSource,
      // dangerSources,
    } = this.state;
    // 是否高危化学品
    // const isDangerChemicals = getFieldValue('isDangerChemicals');
    return (
      <Card>
        <Form>
          {unitType !== 4 && (
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
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入统一编码' }],
            })(<Input placeholder="请输入统一编码" {...itemStyles} />)}
          </FormItem>
          <FormItem label="品名" {...formItemLayout}>
            {getFieldDecorator('msds', {
              rules: [{ required: true, message: '请选择品名' }],
            })(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  value={selectedMsds.chineName}
                  placeholder="请选择品名"
                />
                <Button type="primary" onClick={this.handleViewMsdsModal}>
                  选择
                </Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="化学品中文名称2" {...formItemLayout}>
            {getFieldDecorator('chineName2')(<span>{selectedMsds.chineName2 || ''}</span>)}
          </FormItem>
          <FormItem label="CAS号" {...formItemLayout}>
            {getFieldDecorator('casNo')(<span>{selectedMsds.casNo || ''}</span>)}
          </FormItem>
          <FormItem label="危险性类别" {...formItemLayout}>
            {getFieldDecorator('riskCateg')(
              // <span>{selectedMsds.riskCateg ? RISK_CATEGORIES[selectedMsds.riskCateg] : ''}</span>
              <span>{getRiskCategoryLabel(selectedMsds.riskCateg, RISK_CATEGORIES)}</span>
            )}
          </FormItem>
          <FormItem label="是否为危化品" {...formItemLayout}>
            {getFieldDecorator('isDangerChemicals', {
              rules: [{ required: true, message: '请选择是否为危化品' }],
            })(
              <Radio.Group {...itemStyles}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {/* <FormItem label="统一编码" {...formItemLayout}>
            {getFieldDecorator('unifiedCode')(<span>{selectedMsds.casNo}</span>)}
          </FormItem> */}
          {/* {id &&
            dangerSources &&
            dangerSources.length > 0 && (
              <Fragment>
                <FormItem label="是否构成危险化学品重大危险源" {...formItemLayout}>
                  {getFieldDecorator('isDangerSource')(<span>{'是'}</span>)}
                </FormItem>
                <FormItem label="所属危险源名称" {...formItemLayout}>
                  {getFieldDecorator('casNo')(
                    <span>{dangerSources.map(item => item.name).join('，')}</span>
                  )}
                </FormItem>
              </Fragment>
            )} */}
          <FormItem label="危险化学品目录序号" {...formItemLayout}>
            {getFieldDecorator('dangerChemcataSn', { getValueFromEvent: this.handleTrim })(
              <Input placeholder="请输入危险化学品目录序号" {...itemStyles} />
            )}
          </FormItem>
          <FormItem label="是否剧毒化学品" {...formItemLayout}>
            {getFieldDecorator('highlyToxicChem', {
              rules: [{ required: true, message: '请选择是否剧毒化学品' }],
            })(
              <Radio.Group {...itemStyles}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="是否易制毒" {...formItemLayout}>
            {getFieldDecorator('easyMakePoison', {
              rules: [{ required: true, message: '请选择是否易制毒' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="是否易制爆" {...formItemLayout}>
            {getFieldDecorator('easyMakeExplode', {
              rules: [{ required: true, message: '请选择是否易制爆' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="是否重点监管的危险化学品" {...formItemLayout}>
            {getFieldDecorator('superviseChemicals', {
              rules: [{ required: true, message: '请选择是否重点监管的危险化学品' }],
            })(
              <Radio.Group {...itemStyles}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {/* <FormItem label="是否高危化学品" {...formItemLayout}>
            {getFieldDecorator('isDangerChemicals', {
              rules: [{ required: true, message: '请选择是否高危化学品' }],
            })(
              <Radio.Group {...itemStyles}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {isDangerChemicals === '1' && (
            <FormItem label="高危化学品种类" {...formItemLayout}>
              {getFieldDecorator('highRiskChemicals', {
                rules: [{ required: true, message: '请选择高危化学品种类' }],
              })(
                <Select placeholder="请选择高危化学品种类" {...itemStyles}>
                  <Option value={'0'}>硝酸铵</Option>
                  <Option value={'1'}>硝化棉</Option>
                  <Option value={'2'}>氰化钠</Option>
                </Select>
              )}
            </FormItem>
          )} */}
          <FormItem label="物质形态" {...formItemLayout}>
            {getFieldDecorator('materialForm', {
              initialValue: '1',
              rules: [{ required: true, message: '请选择物质形态' }],
            })(
              <Radio.Group {...itemStyles} buttonStyle="solid">
                <Radio.Button value="1">固态</Radio.Button>
                <Radio.Button value="2">液态</Radio.Button>
                <Radio.Button value="3">气态</Radio.Button>
                <Radio.Button value="4">等离子态</Radio.Button>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label="物料类型" {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: '4',
              rules: [{ required: true, message: '请选择物料类型' }],
            })(
              <RadioGroup {...itemStyles} onChange={this.handleTypeChange} buttonStyle="solid">
                {materialTypeOptions.map(({ value, label }) => (
                  <Radio.Button value={value} key={value}>
                    {label}
                  </Radio.Button>
                ))}
              </RadioGroup>
            )}
          </FormItem>
          {isProduct ? (
            <div className={styles.unitWrapper}>
              <FormItem label="年产量" {...formItemLayout}>
                {getFieldDecorator('annualThroughput', {
                  // getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入年产量' }],
                })(<InputNumber {...itemStyles} min={0} placeholder="请输入年产量" />)}
              </FormItem>
              <FormItem {...unitLayout}>
                {getFieldDecorator('annualThroughputUnit', {
                  rules: [{ required: true, message: '请输入单位' }],
                })(
                  <Select placeholder="单位">
                    {unitOptions.map(({ value, label }) => (
                      <Option value={value} key={value}>
                        {label}
                      </Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </div>
          ) : (
            <Fragment>
              <div className={styles.unitWrapper}>
                <FormItem label="年消耗量" {...formItemLayout}>
                  {getFieldDecorator('annualConsumption', {
                    rules: [{ required: true, message: '请输年消耗量' }],
                  })(<InputNumber {...itemStyles} min={0} placeholder="请输年消耗量" />)}
                </FormItem>
                <FormItem {...unitLayout}>
                  {getFieldDecorator('annualConsumptionUnit', {
                    rules: [{ required: true, message: '请输入单位' }],
                  })(
                    <Select placeholder="单位">
                      {unitOptions.map(({ value, label }) => (
                        <Option value={value} key={value}>
                          {label}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </div>
            </Fragment>
          )}
          <div className={styles.unitWrapper}>
            <FormItem label="最大存储量" {...formItemLayout}>
              {getFieldDecorator('maxStoreDay', {
                rules: [{ required: true, message: '请输入最大存储量' }],
              })(<InputNumber {...itemStyles} min={0} placeholder="请输入最大存储量" />)}
            </FormItem>
            <FormItem {...unitLayout}>
              {getFieldDecorator('maxStoreDayUnit', {
                rules: [{ required: true, message: '请输入单位' }],
              })(
                <Select placeholder="单位">
                  {unitOptions.map(({ value, label }) => (
                    <Option value={value} key={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </div>
          {/* <div className={styles.unitWrapper}>
            <FormItem label="实际存储量" {...formItemLayout}>
              {getFieldDecorator('actualReserves', {
                // getValueFromEvent: this.handleTrim,
                rules: [{ required: true, message: '请输入实际存储量' }],
              })(<InputNumber {...itemStyles} min={0} placeholder="请输入实际存储量" />)}
            </FormItem>
            <FormItem {...unitLayout}>
              {getFieldDecorator('actualReservesUnit', {
                getValueFromEvent: this.handleTrim,
                rules: [{ required: true, message: '请输入单位' }],
              })(<Input placeholder="单位" />)}
            </FormItem>
          </div> */}
          {/* <FormItem label="存储场所" {...formItemLayout}>
            {getFieldDecorator('reservesLocation', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入存储场所' }],
            })(<Input placeholder="请输入存储场所" {...itemStyles} />)}
          </FormItem> */}
          {/*<FormItem label="是否属于高危储存设施" {...formItemLayout}>
            {getFieldDecorator('highRiskStorefacil', {
              rules: [{ required: true, message: '请选择是否属于高危储存设施' }],
            })(
              <Radio.Group {...itemStyles}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            )}
          </FormItem> */}
          {/* <FormItem label="是否构成危险化学品重大危险源" {...formItemLayout}>
            {getFieldDecorator('majorHazard', {
              rules: [{ required: true, message: '请选择是否构成危险化学品重大危险源' }],
            })(
              <RadioGroup {...itemStyles} onChange={this.handleMajorHazardChange}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {majorHazardVisible && (
            <Fragment>
              <FormItem label="所属危险源名称" {...formItemLayout}>
                {getFieldDecorator('dangerId')(
                  <Fragment>
                    <Input
                      {...itemStyles}
                      disabled
                      value={selectedDangerSource.name}
                      placeholder="请选择所属危险源名称"
                    />
                    <Button type="primary" onClick={this.handleDangerSourceModal}>
                      选择
                    </Button>
                  </Fragment>
                )}
              </FormItem>
              <FormItem label="危险化学品重大危险源等级" {...formItemLayout}>
                {getFieldDecorator('equipCode')(<span>{selectedDangerSource.dangerLevel}</span>)}
              </FormItem>
            </Fragment>
          )} */}
          {/* <FormItem label="所在工艺流程" {...formItemLayout}>
            {getFieldDecorator('technologyId')(
              <Fragment>
                <Input {...itemStyles} disabled value={''} placeholder="请选择所在工艺流程" />
                <Button type="primary">选择</Button>
              </Fragment>
            )}
          </FormItem> */}
          {/* <FormItem label="是否属于重点监管危险化工工艺" {...formItemLayout}>
            {getFieldDecorator('keySupervisionProcess', {
              rules: [{ required: true, message: '所在工艺流程是否属于重点监管危险化工工艺' }],
            })(
              <Radio.Group {...itemStyles} onChange={this.handleKeySupervisionChange}>
                <Radio value="1">是</Radio>
                <Radio value="0">否</Radio>
              </Radio.Group>
            )}
          </FormItem> */}
          {/* {keySupervisionVisible && (
            <FormItem label="重点监管危险化工工艺" {...formItemLayout}>
              {getFieldDecorator('keySupervision', {
                rules: [{ required: true, message: '请选择重点监管危险化工工艺' }],
              })(
                <Select placeholder="请选择重点监管危险化工工艺" {...itemStyles}>
                  {KEYSUPERVISION.map((item, index) => (
                    <Option value={index} key={index}>
                      {item}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          )} */}
          <FormItem label="安全措施" {...formItemLayout}>
            {getFieldDecorator('safetyMeasures', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入安全措施' }],
            })(<TextArea rows={4} placeholder="请输入安全措施" maxLength="500" {...itemStyles} />)}
          </FormItem>
          <FormItem label="应急处置措施" {...formItemLayout}>
            {getFieldDecorator('emergencyMeasure', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入应急处置措施' }],
            })(
              <TextArea rows={4} placeholder="请输入应急处置措施" maxLength="500" {...itemStyles} />
            )}
          </FormItem>
        </Form>
        <Row justify="center" style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button type="primary" style={{ marginRight: 20 }} onClick={this.handleSubmit}>
            提交
          </Button>
          <Button onClick={this.goBack}>
            返回
          </Button>
        </Row>
      </Card>
    );
  };

  render() {
    const {
      companyLoading,
      dangerSourceLoading,
      msdsLoading,
      match: { params: { id = null } = {} },
      company: { companyModal },
      materials: { dangerSourceModal, msdsModal },
    } = this.props;
    const { companyModalVisible, dangerSourceModalVisible, msdsModalVisible } = this.state;
    const title = id ? '编辑物料' : '新增物料';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '基本信息', name: '基本信息' },
      { title: '物料信息', name: '物料信息', href: listUrl },
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
        {/* 重大危险源 */}
        <CompanyModal
          title="选择重大危险源"
          multiSelect
          columns={dangerSourceColumns}
          field={dangerSourceFields}
          butonStyles={{ width: 'auto' }}
          rowSelection={{ type: 'checkbox' }}
          loading={dangerSourceLoading}
          visible={dangerSourceModalVisible}
          modal={dangerSourceModal}
          fetch={this.fetchDangerSource}
          onSelect={this.handleSelectDangerSource}
          onClose={() => {
            this.setState({ dangerSourceModalVisible: false });
          }}
        />
        {/* msds */}
        <CompanyModal
          title="选择MSDS"
          columns={msdsColumns}
          field={msdsFields}
          butonStyles={{ width: 'auto' }}
          loading={msdsLoading}
          visible={msdsModalVisible}
          modal={msdsModal}
          fetch={this.fetchMsds}
          onSelect={this.handleSelectMsds}
          onClose={() => {
            this.setState({ msdsModalVisible: false });
          }}
        />
      </PageHeaderLayout>
    );
  }
}
