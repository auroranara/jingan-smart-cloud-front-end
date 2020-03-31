import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, Card, Popover, Select, message, Table, Radio } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { RISK_CATEGORIES } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
// 选择储罐弹窗
import TankSelectModal from './Sections/TankSelectModal';
// 选择装卸危险化学品种类弹窗
import ChemicalsSelectModal from './Sections/ChemicalsSelectModal';

import styles from './Edit.less';

const { Option } = Select;
const FormItem = Form.Item;
const { Group: RadioGroup } = Radio;

// 编辑页面标题
const editTitle = '编辑储罐区';
// 添加页面标题
const addTitle = '新增储罐区';

const RISKLVL = ['一级', '二级', '三级', '四级'];
const materialForms = ['固态', '液态', '气态', '等离子态'];

// 表单标签
const fieldLabels = {};

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
    render: data => RISKLVL[data - 1],
  },
  {
    title: '单元内涉及的危险化学品',
    dataIndex: 'unitChemiclaNumDetail',
    key: 'unitChemiclaNumDetail',
    render: data => {
      return data
        .map(item => {
          const { chineName, unitChemiclaNum, unitChemiclaNumUnit } = item;
          return chineName + ' ' + (unitChemiclaNum || '') + (unitChemiclaNumUnit || '');
        })
        .join(', ');
    },
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
    title: '物质形态',
    dataIndex: 'materialForm',
    key: 'materialForm',
    render: data => materialForms[data - 1],
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

@connect(({ loading, company, storehouse, materials, user, baseInfo }) => ({
  company,
  storehouse,
  materials,
  companyLoading: loading.effects['company/fetchModelList'],
  dangerSourceLoading: loading.effects['storehouse/fetchDangerSourceModel'],
  materialsLoading: loading.effects['materials/fetchMaterialsList'],
  user,
  baseInfo,
}))
@Form.create()
export default class Edit extends PureComponent {
  state = {
    companyModalVisible: false,
    selectedCompany: {},
    cofferAreaVisible: false,
    dangerSourceModalVisible: false,
    materialsModalVisible: false,
    selectedMaterials: [],
    selectedDangerSource: [],
    dangerUnitVisible: false,
    companySelectVisible: false,
    tankModalVisible: false, // 选择储罐弹窗
    chemicalModalVisible: false, // 选择装卸危险化学品种类弹窗
    selectedTemp: [],
    selectedTank: [], // 已选择储罐
    selectedChemical: [], // 已选择装卸危险化学品种类
  };

  // 挂载后
  componentDidMount() {
    const {
      user: { currentUser, isCompany },
      form: { setFieldsValue },
      match: { params: { id = null } = {} },
    } = this.props;
    if (id) {
      this.fetchList(1, 10, { id }, res => {
        const {
          list: [
            {
              companyId,
              companyName,
              code, //统一编码
              areaName, //储罐区名称
              location, //在厂区的位置
              environmentArea, //所处环境功能区
              safeSpace, //周边安全防护间距
              spaceArea, //储罐区面积
              hasCoffer, //有无围堰
              cofferArea, //围堰所围面积
              // tankCount, //储罐个数
              // storeMaterial, //存储物质
              areaVolume, //储罐区总容积
              commonStore, //常规存储量
              minSpace, //两罐间最小间距
              hasPassage, //有无消防通道
              loadType, //装卸方式
              dangerType, //装卸危险化学品种类
              // isDanger, //是否构成重大危险源
              // dangerUnit, //所属危险化学品重大危险源单元
              // companyName,
              // chineName,//品名
              // chineNameList, //存储介质列表
              tankIds, // 绑定的储罐
              tankNames, // 储罐名称数组
              dangerTypeList, // 装卸危险化学品种类的品名数组
            },
          ],
        } = res.data;
        setFieldsValue({
          companyId,
          code, //统一编码
          areaName, //储罐区名称
          location, //在厂区的位置
          environmentArea, //所处环境功能区
          safeSpace, //周边安全防护间距
          spaceArea, //储罐区面积
          hasCoffer, //有无围堰
          // cofferArea, //围堰所围面积
          // tankCount, //储罐个数
          // storeMaterial, //存储物质
          areaVolume, //储罐区总容积
          commonStore, //常规存储量
          minSpace, //两罐间最小间距
          hasPassage, //有无消防通道
          loadType, //装卸方式
          dangerType, //装卸危险化学品种类
          // isDanger, //是否构成重大危险源
          // dangerUnit, //所属危险化学品重大危险源单元
          newTankId: Array.isArray(tankIds) ? tankIds.join(',') : undefined,
        });
        const dangerTypes = dangerType ? dangerType.split(',') : [];
        this.setState(
          {
            selectedCompany: { id: companyId, name: companyName },
            // selectedMaterials: storeMaterial
            //   .split(',')
            //   .map((item, index) => ({ id: item, chineName: chineNameList[index] })),
            // selectedDangerSource: dangerUnit
            //   .split(',')
            //   .map((item, index) => ({ id: item, name: chineNameList[index] })),
            cofferAreaVisible: +hasCoffer === 1,
            // dangerUnitVisible: +isDanger === 1,
            selectedTank: Array.isArray(tankIds)
              ? tankIds.map((id, i) => ({ id, tankName: tankNames[i] }))
              : [],
            selectedChemical: Array.isArray(dangerTypes)
              ? dangerTypes.map((storageId, i) => ({ storageId, chineName: dangerTypeList[i] }))
              : [],
          },
          () => {
            setFieldsValue({ cofferArea });
          }
        );
        // 获取存储物质及常规存储量
        this.fetchChemicalList({
          payload: { pageNum: 1, pageSize: 0 },
          callback: ({ list }) => {
            setFieldsValue({ storageList: list });
          },
        });
      });
    } else if (isCompany) {
      // 如果是企业登录
      this.setState({
        selectedCompany: { id: currentUser.companyId, name: currentUser.companyName },
      });
    }
  }

  fetchList = (pageNum = 1, pageSize = 10, filters = {}, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storageAreaManagement/fetchTankAreaList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
      },
      callback,
    });
  };

  fetchCompany = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'company/fetchModelList', payload });
  };

  handleSelectCompany = selectedCompany => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({
      selectedCompany,
      companyModalVisible: false,
      selectedTank: [], // 已选择储罐
      selectedChemical: [], // 已选择装卸危险化学品种类
    });
    // 清空包含的储罐、
    setFieldsValue({
      companyId: selectedCompany.id,
      newTankId: undefined,
      storageList: [],
      dangerType: undefined,
    });
  };

  handleViewCompanyModal = () => {
    this.setState({ companyModalVisible: true });
    this.fetchCompany({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  fetchDangerSource = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'storehouse/fetchDangerSourceModel', payload });
  };

  // 获取储罐列表
  fetchTankList = actions => {
    const { dispatch } = this.props;
    const { selectedCompany } = this.state;
    if (selectedCompany && selectedCompany.id) {
      dispatch({
        type: 'baseInfo/fetchStorageTankForPage',
        ...actions,
        payload: { ...actions.payload, tankArea: '', companyId: selectedCompany.id },
      });
    } else {
      message.error('请先选择单位');
      return;
    }
  };

  // 获取装卸危险化学品种类列表
  fetchChemicalList = actions => {
    const {
      dispatch,
      form: { getFieldValue },
      match: {
        params: { id },
      },
    } = this.props;
    const newTankId = getFieldValue('newTankId');
    dispatch({
      type: 'storehouse/fetchChemicalList',
      ...actions,
      payload: { ...actions.payload, newTankId, id },
    });
  };

  handleSelectDangerSource = selectedDangerSource => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedDangerSource, dangerSourceModalVisible: false });
    setFieldsValue({ dangerUnit: selectedDangerSource.map(item => item.id).join(',') });
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

  fetchMaterials = ({ payload }) => {
    const { dispatch } = this.props;
    const { selectedCompany } = this.state;
    dispatch({
      type: 'materials/fetchMaterialsList',
      payload: { ...payload, companyId: selectedCompany.id },
    });
  };

  handleSelectMaterials = selectedMaterials => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedMaterials, materialsModalVisible: false });
    setFieldsValue({
      storeMaterial: selectedMaterials.map(item => item.id).join(','),
    });
  };

  handleMaterialsModal = () => {
    this.setState({ materialsModalVisible: true });
    this.fetchMaterials({
      payload: {
        pageSize: 10,
        pageNum: 1,
      },
    });
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  goBack = () => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/major-hazard-info/storage-area-management/list`));
  };

  handleClickValidate = () => {
    const {
      user: {
        currentUser: { unitType, companyId },
      },
      dispatch,
      form: { validateFields },
      match: {
        params: { id },
      },
    } = this.props;
    validateFields((error, formData) => {
      if (!error) {
        const storageList = formData.storageList;
        if (storageList && storageList.length && storageList.some(item => !item.nomalStorage)) {
          message.warning('请输入常规存储量');
          return;
        }
        const payload = {
          ...formData,
          companyId: unitType === 4 ? companyId : formData.companyId,
        };
        const success = () => {
          message.success(id ? '编辑成功！' : '新增成功！');
          dispatch(routerRedux.push(`/major-hazard-info/storage-area-management/list`));
        };
        const error = () => {
          message.error(id ? '编辑失败' : '新增失败！');
        };
        if (id) {
          dispatch({
            type: 'storageAreaManagement/editTankArea',
            payload: { ...payload, id },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'storageAreaManagement/addTankArea',
            payload,
            success,
            error,
          });
        }
      }
    });
  };

  handleChangeHasCoffer = e => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const {
      target: { value },
    } = e;
    setFieldsValue({ cofferArea: undefined });
    this.setState({ cofferAreaVisible: value === '1' });
  };

  handleChangeIsDanger = val => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ dangerUnitVisible: val === '1', selectedDangerSource: [] });
    setFieldsValue({ dangerUnit: undefined });
  };

  // 打开选择储罐弹窗
  handleViewTankModal = () => {
    const { selectedTank, selectedCompany } = this.state;
    if (selectedCompany && selectedCompany.id) {
      this.fetchTankList({ payload: { pageNum: 1, pageSize: 10 } });
      this.setState({ tankModalVisible: true, selectedTemp: selectedTank });
    } else {
      message.error('请先选择单位');
      return;
    }
  };

  // 选择储罐
  handleSelectTank = () => {
    const { selectedTemp } = this.state;
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ newTankId: selectedTemp.map(item => item.id).join(',') });
    this.setState({ selectedTank: selectedTemp, tankModalVisible: false });
    // 获取存储物质及常规存储量
    this.fetchChemicalList({
      payload: { pageNum: 1, pageSize: 10 },
      callback: ({ list }) => {
        setFieldsValue({ storageList: list });
      },
    });
  };

  // 打开选择装卸危险化学品种类弹窗
  handleViewChemicalModal = () => {
    const { selectedChemical } = this.state;
    this.fetchChemicalList({ payload: { pageNum: 1, pageSize: 10 } });
    this.setState({ chemicalModalVisible: true, selectedTemp: selectedChemical });
  };

  // 选择装卸危险化学品种类
  handleSelectChemical = () => {
    const { selectedTemp } = this.state;
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({ dangerType: selectedTemp.map(item => item.storageId).join(',') });
    this.setState({ selectedChemical: selectedTemp, chemicalModalVisible: false });
  };

  // 存储物质及常规存储量--常规储量改变
  handleNomalStorageChange = (value, key) => {
    if (isNaN(value)) return;
    const {
      form: { getFieldValue, setFieldsValue },
    } = this.props;
    const storageList = getFieldValue('storageList');
    setFieldsValue({
      storageList: storageList.map(
        item => (item.storageId === key ? { ...item, nomalStorage: value } : item)
      ),
    });
  };

  renderInfo() {
    const {
      user: {
        currentUser: { unitType },
      },
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const { selectedCompany, cofferAreaVisible, selectedTank, selectedChemical } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const itemStyles = { style: { width: '70%', marginRight: '10px' } };
    const storageList = getFieldValue('storageList');
    return (
      <Card className={styles.card} bordered={false}>
        <Form style={{ marginTop: 8 }}>
          {unitType !== 4 && (
            <FormItem {...formItemLayout} label="单位名称">
              {getFieldDecorator('companyId', {
                rules: [
                  {
                    required: true,
                    message: '请选择单位',
                  },
                ],
              })(
                <Fragment>
                  <Input
                    {...itemStyles}
                    disabled
                    value={selectedCompany.name}
                    placeholder="请选择单位"
                  />
                  <Button type="primary" onClick={this.handleViewCompanyModal}>
                    选择单位
                  </Button>
                </Fragment>
              )}
            </FormItem>
          )}
          <FormItem {...formItemLayout} label="统一编码">
            {getFieldDecorator('code', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入统一编码',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入统一编码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐区名称">
            {getFieldDecorator('areaName', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入储罐区名称',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入储罐区名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="区域位置">
            {getFieldDecorator('location', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入区域位置',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入区域位置" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐区面积（㎡）">
            {getFieldDecorator('spaceArea', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入储罐区面积',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入储罐区面积（㎡）" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储罐区总容积（m³）">
            {getFieldDecorator('areaVolume', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入储罐区总容积（m³）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入储罐区总容积（m³）" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="所处环境功能区">
            {getFieldDecorator('environmentArea', {
              rules: [
                {
                  required: true,
                  message: '请选择所处环境功能区',
                },
              ],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">一类区</Radio>
                <Radio value="2">二类区</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="选择包含的储罐">
            {getFieldDecorator('newTankId', {
              rules: [{ required: true, message: '请选择包含的储罐' }],
            })(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  value={selectedTank.map(item => item.tankName).join('、')}
                  placeholder="请选择包含的储罐"
                />
                <Button type="primary" onClick={this.handleViewTankModal}>
                  选择
                </Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="两罐间最小间距（m）">
            {getFieldDecorator('minSpace', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入两罐间最小间距（m）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入两罐间最小间距（m）" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="有无围堰">
            {getFieldDecorator('hasCoffer', {
              rules: [
                {
                  required: true,
                  message: '请选择有无围堰',
                },
              ],
            })(
              <Radio.Group {...itemStyles} onChange={this.handleChangeHasCoffer}>
                <Radio value="0">无</Radio>
                <Radio value="1">有</Radio>
              </Radio.Group>
            )}
          </FormItem>
          {cofferAreaVisible && (
            <FormItem {...formItemLayout} label="围堰所围面积（㎡）">
              {getFieldDecorator('cofferArea', {
                getValueFromEvent: this.handleTrim,
                rules: [
                  {
                    required: true,
                    message: '请输入围堰所围面积',
                  },
                ],
              })(<Input {...itemStyles} placeholder="请输入围堰所围面积" />)}
            </FormItem>
          )}

          <FormItem {...formItemLayout} label="周边安全防护间距（m）">
            {getFieldDecorator('safeSpace', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入周边安全防护间距（m）',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入周边安全防护间距（m）" />)}
          </FormItem>

          {/* <FormItem {...formItemLayout} label="常规存储量">
            {getFieldDecorator('commonStore', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入常规存储量',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入常规存储量" />)}
          </FormItem> */}

          <FormItem {...formItemLayout} label="有无消防通道">
            {getFieldDecorator('hasPassage', {
              rules: [
                {
                  required: true,
                  message: '请选择有无消防通道',
                },
              ],
            })(
              <Radio.Group {...itemStyles}>
                <Radio value="0">无</Radio>
                <Radio value="1">有</Radio>
              </Radio.Group>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="装卸危险化学品种类">
            {getFieldDecorator('dangerType', {
              rules: [{ required: true, message: '请选择装卸危险化学品种类' }],
            })(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  value={selectedChemical.map(item => item.chineName).join('、')}
                  placeholder="请选择装卸危险化学品种类"
                />
                <Button type="primary" onClick={this.handleViewChemicalModal}>
                  选择
                </Button>
              </Fragment>
            )}
          </FormItem>

          <FormItem {...formItemLayout} label="装卸方式">
            {getFieldDecorator('loadType', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入装卸方式',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入装卸方式" />)}
          </FormItem>

          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="存储物质及常规存储量">
            {getFieldDecorator('storageList')(
              <Fragment>
                {storageList && storageList.length ? (
                  <Table
                    rowKey="storageId"
                    dataSource={storageList}
                    bordered
                    columns={[
                      {
                        title: '统一编码',
                        dataIndex: 'code',
                        align: 'center',
                        width: 200,
                      },
                      {
                        title: '品名',
                        dataIndex: 'chineName',
                        align: 'center',
                        width: 200,
                      },
                      {
                        title: 'CAS号',
                        dataIndex: 'casNo',
                        align: 'center',
                        width: 200,
                      },
                      {
                        title: <span className={styles.requiredText}>常规存储量（t）</span>,
                        dataIndex: 'nomalStorage',
                        align: 'center',
                        width: 200,
                        render: (val, row) => (
                          <Input
                            value={val}
                            onChange={e =>
                              this.handleNomalStorageChange(e.target.value, row.storageId)
                            }
                          />
                        ),
                      },
                    ]}
                    pagination={false}
                  />
                ) : (
                  '请选择包含的储罐'
                )}
              </Fragment>
            )}
          </FormItem>

          {/* <FormItem {...formItemLayout} label="是否构成重大危险源">
            {getFieldDecorator('isDanger', {
              rules: [
                {
                  required: true,
                  message: '请选择是否构成重大危险源',
                },
              ],
            })(
              <Select
                {...itemStyles}
                allowClear
                placeholder="请选择是否构成重大危险源"
                onChange={this.handleChangeIsDanger}
              >
                <Option value="1">是</Option>
                <Option value="0">否</Option>
              </Select>
            )}
          </FormItem>
          {dangerUnitVisible && (
            <FormItem {...formItemLayout} label="所属危险化学品重大危险源单元">
              {getFieldDecorator('dangerUnit', {
                getValueFromEvent: this.handleTrim,
              })(
                <Fragment>
                  <Input
                    {...itemStyles}
                    disabled
                    value={selectedDangerSource.map(item => item.name).join(', ')}
                    placeholder="请选择所属危险化学品重大危险源单元"
                  />
                  <Button type="primary" onClick={this.handleDangerSourceModal}>
                    选择
                  </Button>
                </Fragment>
              )}
            </FormItem>
          )} */}
        </Form>
      </Card>
    );
  }

  /* 渲染错误信息 */
  renderErrorInfo() {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <LegacyIcon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <LegacyIcon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button type="primary" size="large" onClick={this.handleClickValidate}>
          提交
        </Button>
        <Button type="primary" size="large" onClick={this.goBack}>
          返回
        </Button>
      </FooterToolbar>
    );
  }

  // 渲染页面所有信息
  render() {
    const {
      match: {
        params: { id },
      },
      company: { companyModal },
      companyLoading,
      dangerSourceLoading,
      materialsLoading,
      materials: materialsModal,
      storehouse: { dangerSourceModal, chemical },
      baseInfo: { storageTank },
    } = this.props;
    const {
      companyModalVisible,
      dangerSourceModalVisible,
      materialsModalVisible,
      tankModalVisible,
      chemicalModalVisible,
      selectedTemp,
    } = this.state;
    const title = id ? editTitle : addTitle;

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '基本信息',
        name: '基本信息',
      },
      {
        title: '储罐区管理',
        name: '储罐区管理',
        href: '/major-hazard-info/storage-area-management/list',
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        {this.renderInfo()}
        {this.renderFooterToolbar()}
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
          rowSelection={{ type: 'checkbox' }}
          columns={dangerSourceColumns}
          field={dangerSourceFields}
          butonStyles={{ width: 'auto' }}
          loading={dangerSourceLoading}
          visible={dangerSourceModalVisible}
          modal={dangerSourceModal}
          fetch={this.fetchDangerSource}
          onSelect={this.handleSelectDangerSource}
          onClose={() => {
            this.setState({ dangerSourceModalVisible: false });
          }}
        />
        {/* 贮存物质 */}
        <CompanyModal
          title="选择贮存物质"
          multiSelect
          rowSelection={{ type: 'checkbox' }}
          columns={materialsColumns}
          field={materialsFields}
          butonStyles={{ width: 'auto' }}
          loading={materialsLoading}
          visible={materialsModalVisible}
          modal={materialsModal}
          fetch={this.fetchMaterials}
          onSelect={this.handleSelectMaterials}
          onClose={() => {
            this.setState({ materialsModalVisible: false });
          }}
        />
        <TankSelectModal
          title="选择包含的储罐"
          visible={tankModalVisible}
          onCancel={() => {
            this.setState({ tankModalVisible: false });
          }}
          fetch={this.fetchTankList}
          model={storageTank}
          rowSelection={{
            selectedRowKeys: selectedTemp.map(item => item.id),
            onChange: (keys, rows) => {
              this.setState({ selectedTemp: rows });
            },
          }}
          handleSelect={this.handleSelectTank}
        />
        <ChemicalsSelectModal
          title="选择装卸危险化学品种类"
          visible={chemicalModalVisible}
          onCancel={() => {
            this.setState({ chemicalModalVisible: false });
          }}
          fetch={this.fetchChemicalList}
          model={chemical}
          rowSelection={{
            selectedRowKeys: selectedTemp.map(item => item.storageId),
            onChange: (keys, rows) => {
              this.setState({ selectedTemp: rows });
            },
          }}
          handleSelect={this.handleSelectChemical}
        />
      </PageHeaderLayout>
    );
  }
}
