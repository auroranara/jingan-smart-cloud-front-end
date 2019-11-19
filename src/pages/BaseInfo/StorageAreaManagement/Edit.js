import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Card, Icon, Popover, Select, message } from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { RISK_CATEGORIES } from '@/pages/SafetyKnowledgeBase/MSDS/utils';

import styles from './Edit.less';

const { Option } = Select;
const FormItem = Form.Item;

// 编辑页面标题
const editTitle = '编辑储罐区';
// 添加页面标题
const addTitle = '新增储罐区';

const envirTypeList = [
  { key: '1', value: '一类区' },
  { key: '2', value: '二类区' },
  { key: '3', value: '三类区' },
];

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

@connect(({ loading, company, storehouse, materials, user }) => ({
  company,
  storehouse,
  materials,
  companyLoading: loading.effects['company/fetchModelList'],
  dangerSourceLoading: loading.effects['storehouse/fetchDangerSourceModel'],
  materialsLoading: loading.effects['materials/fetchMaterialsList'],
  user,
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
  };

  // 挂载后
  componentDidMount() {
    const {
      user: {
        currentUser: {
          unitType,
          // companyId,
          // companyName,
        },
      },
      form: { setFieldsValue },
      match: { params: { id = null } = {} },
    } = this.props;
    if (!id) return;
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
            tankCount, //储罐个数
            storeMaterial, //存储物质
            areaVolume, //储罐区总容积
            commonStore, //常规存储量
            minSpace, //两罐间最小间距
            hasPassage, //有无消防通道
            loadType, //装卸方式
            dangerType, //装卸危险化学品种类
            isDanger, //是否构成重大危险源
            dangerUnit, //所属危险化学品重大危险源单元
            // companyName,
            // chineName,//品名
            chineNameList, //存储介质列表
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
        tankCount, //储罐个数
        storeMaterial, //存储物质
        areaVolume, //储罐区总容积
        commonStore, //常规存储量
        minSpace, //两罐间最小间距
        hasPassage, //有无消防通道
        loadType, //装卸方式
        dangerType, //装卸危险化学品种类
        // isDanger, //是否构成重大危险源
        // dangerUnit, //所属危险化学品重大危险源单元
      });
      this.setState(
        {
          selectedCompany: { id: companyId, name: companyName },
          selectedMaterials: storeMaterial
            .split(',')
            .map((item, index) => ({ id: item, chineName: chineNameList[index] })),
          selectedDangerSource: dangerUnit
            .split(',')
            .map((item, index) => ({ id: item, name: chineNameList[index] })),
          cofferAreaVisible: +hasCoffer === 1,
          // dangerUnitVisible: +isDanger === 1,
        },
        () => {
          setFieldsValue({ cofferArea });
        }
      );
    });
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
    this.setState({ selectedCompany, companyModalVisible: false });
    setFieldsValue({ companyId: selectedCompany.id });
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
    dispatch({ type: 'materials/fetchMaterialsList', payload });
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
    dispatch(routerRedux.push(`/base-info/storage-area-management/list`));
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
        const payload = { ...formData, companyId: unitType === 4 ? companyId : formData.companyId };
        const success = () => {
          message.success(id ? '编辑成功！' : '新增成功！');
          dispatch(routerRedux.push(`/base-info/storage-area-management/list`));
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

  handleChangeHasCoffer = val => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ cofferAreaVisible: val === '1' });
    setFieldsValue({ cofferArea: undefined });
  };

  handleChangeIsDanger = val => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ dangerUnitVisible: val === '1', selectedDangerSource: [] });
    setFieldsValue({ dangerUnit: undefined });
  };

  renderInfo() {
    const {
      user: {
        currentUser: { unitType },
      },
      form: { getFieldDecorator },
    } = this.props;
    const {
      selectedCompany,
      cofferAreaVisible,
      selectedMaterials,
      selectedDangerSource,
      dangerUnitVisible,
      companySelectVisible,
    } = this.state;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const itemStyles = { style: { width: '70%', marginRight: '10px' } };
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
          <FormItem {...formItemLayout} label="在厂区的位置">
            {getFieldDecorator('location', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入在厂区的位置',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入在厂区的位置" />)}
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
              <Select {...itemStyles} allowClear placeholder="请选择所处环境功能区">
                {envirTypeList.map(({ key, value }) => (
                  <Option key={key} value={key}>
                    {value}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
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
          <FormItem {...formItemLayout} label="有无围堰">
            {getFieldDecorator('hasCoffer', {
              rules: [
                {
                  required: true,
                  message: '请选择有无围堰',
                },
              ],
            })(
              <Select
                {...itemStyles}
                allowClear
                placeholder="请选择有无围堰"
                onChange={this.handleChangeHasCoffer}
              >
                <Option value="0">无</Option>
                <Option value="1">有</Option>
              </Select>
            )}
          </FormItem>
          {cofferAreaVisible && (
            <FormItem {...formItemLayout} label="围堰所围面积">
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
          <FormItem {...formItemLayout} label="储罐个数">
            {getFieldDecorator('tankCount', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入储罐个数',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入储罐个数" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="储存物质">
            {getFieldDecorator('storeMaterial', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入储存物质',
                },
              ],
            })(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  value={selectedMaterials.map(item => item.chineName).join(', ')}
                  placeholder="请选择储存物质"
                />
                <Button type="primary" onClick={this.handleMaterialsModal}>
                  选择
                </Button>
              </Fragment>
            )}
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
          <FormItem {...formItemLayout} label="常规存储量">
            {getFieldDecorator('commonStore', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入常规存储量',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入常规存储量" />)}
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
          <FormItem {...formItemLayout} label="有无消防通道">
            {getFieldDecorator('hasPassage', {
              rules: [
                {
                  required: true,
                  message: '请选择有无消防通道',
                },
              ],
            })(
              <Select {...itemStyles} allowClear placeholder="请选择有无消防通道">
                <Option value="1">有</Option>
                <Option value="0">无</Option>
              </Select>
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
          <FormItem {...formItemLayout} label="装卸危险化学品种类">
            {getFieldDecorator('dangerType', {
              getValueFromEvent: this.handleTrim,
              rules: [
                {
                  required: true,
                  message: '请输入危险化学品性质',
                },
              ],
            })(<Input {...itemStyles} placeholder="请输入装卸危险化学品种类" />)}
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
          <Icon type="cross-circle-o" className={styles.errorIcon} />
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
          <Icon type="exclamation-circle" />
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
      storehouse: { dangerSourceModal },
    } = this.props;
    const { companyModalVisible, dangerSourceModalVisible, materialsModalVisible } = this.state;
    const title = id ? editTitle : addTitle;

    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '一企一档',
        name: '一企一档',
      },
      {
        title: '储罐区管理',
        name: '储罐区管理',
        href: '/base-info/storage-area-management/list',
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
      </PageHeaderLayout>
    );
  }
}
