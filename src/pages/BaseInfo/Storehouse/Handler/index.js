import { PureComponent, Fragment } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Radio,
  Row,
  message,
  InputNumber,
  DatePicker,
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
// import { RISK_CATEGORIES } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import router from 'umi/router';
import moment from 'moment';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
// import styles from './index.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Group: RadioGroup } = Radio;
/* root下的div */
const getRootChild = () => document.querySelector('#root>div');
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
const listUrl = '/major-hazard-info/storehouse/list';

const itemStyles = { style: { width: '70%', marginRight: '10px' } };

const regionColumns = [
  {
    title: '库区编号',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: '库区名称',
    dataIndex: 'name',
    key: 'name',
  },
];
const regionFields = [
  {
    id: 'number',
    render () {
      return <Input placeholder="库区编号" />;
    },
    transform (value) {
      return value.trim();
    },
  },
  {
    id: 'name',
    render () {
      return <Input placeholder="库区名称" />;
    },
    transform (value) {
      return value.trim();
    },
  },
];

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
    render () {
      return <Input placeholder="统一编码" />;
    },
    transform (value) {
      return value.trim();
    },
  },
  {
    id: 'name',
    render () {
      return <Input placeholder="危险源名称" />;
    },
    transform (value) {
      return value.trim();
    },
  },
];

@Form.create()
@connect(({ company, storehouse, materials, loading, user }) => ({
  company,
  storehouse,
  materials,
  user,
  companyLoading: loading.effects['company/fetchModelList'],
  regionLoading: loading.effects['storehouse/fetchRegionModel'],
  dangerSourceLoading: loading.effects['storehouse/fetchDangerSourceModel'],
  materialsLoading: loading.effects['materials/fetchMaterialsList'],
}))
export default class StorehouseHandler extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dangerSourceUnitVisible: false,
      // 选择企业弹窗
      compayModalVisible: false,
      // 选中的企业
      selectedCompany: {},
      regionModalVisible: false,
      selectedRegion: {},
      dangerSourceModalVisible: false,
      selectedDangerSource: {},
      materialsModalVisible: false,
      selectedMaterials: [],
      materialsNum: {},
    };
  }

  componentDidMount () {
    const {
      form: { setFieldsValue },
      match: { params: { id = null } = {} },
      // storehouse: { detail: { companyId, companyName } = {} },
    } = this.props;
    if (id) {
      this.fetchList(1, 10, { id }, res => {
        const {
          list: [
            {
              companyId,
              companyName,
              areaId, //库区id
              code, //库房编码
              number, //库房序号
              name, //库房名称
              position, //区域位置
              area, //库房面积
              firewall, //有无防火墙
              style, //库房形式
              dangerLevel, // 火灾危险性等级
              materialsName, //贮存物质名称
              dangerWarehouse, //是否危化品仓库
              toxicWarehouse, //是否剧毒化学品仓库
              produceDate, //* 投产日期
              spary, //是否设置自动喷淋
              lowTemperature, //是否低温仓储仓库
              // dangerSource, //是否构成重大危险源
              // dangerSourceUnit, //所属危险化学品重大危险源单元
              // unitCode, //所属重大危险源单元编号
              anumber, //库区编号
              aname, //库区名
              // dangerSourceMessage,
            },
          ],
        } = res.data;

        setFieldsValue({
          companyId,
          areaId, //库区id
          code, //库房编码
          number, //库房序号
          name, //库房名称
          position, //区域位置
          area, //库房面积
          firewall, //有无防火墙
          style, //库房形式
          dangerLevel, // 火灾危险性等级
          materialsName, //贮存物质名称
          dangerWarehouse, //是否危化品仓库
          toxicWarehouse, //是否剧毒化学品仓库
          produceDate: moment(produceDate), //* 投产日期
          spary, //是否设置自动喷淋
          lowTemperature, //是否低温仓储仓库
          // dangerSource, //是否构成重大危险源
          // dangerSourceUnit, //所属危险化学品重大危险源单元
          // unitCode, //所属重大危险源单元编号
          // anumber, //库区编号
          // aname, //库区名
        });
        this.setState({
          selectedCompany: { id: companyId, name: companyName },
          selectedRegion: { id: areaId, name: aname, number: anumber },
          // dangerSourceUnitVisible: dangerSource === '1',
          // selectedDangerSource: { ...dangerSourceMessage },
          selectedMaterials: JSON.parse(materialsName).map(item => ({
            ...item,
            id: item.materialId,
          })),
          materialsNum: JSON.parse(materialsName).reduce((prev, next) => {
            const { materialId, unitChemiclaNum } = next;
            prev[materialId] = unitChemiclaNum;
            return prev;
          }, {}),
        });
      });
    }
  }

  fetchList = (pageNum, pageSize = 10, filters = {}, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'storehouse/fetchStorehouseList',
      payload: {
        pageNum,
        pageSize,
        ...filters,
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

  fetchRegion = ({ payload }) => {
    const { dispatch } = this.props;
    const { selectedCompany } = this.state;
    dispatch({
      type: 'storehouse/fetchRegionModel',
      payload: { ...payload, companyId: selectedCompany.id },
    });
  };

  fetchDangerSource = ({ payload }) => {
    const { dispatch } = this.props;
    dispatch({ type: 'storehouse/fetchDangerSourceModel', payload });
  };

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
          router.push(listUrl);
        };
        const error = () => {
          message.error(id ? '编辑失败' : '新增失败！');
        };
        if (id) {
          dispatch({
            type: 'storehouse/editStorehouse',
            payload: { ...payload, id },
            success,
            error,
          });
        } else {
          dispatch({
            type: 'storehouse/addStorehouse',
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
    this.setState({
      selectedCompany,
      companyModalVisible: false,
      selectedMaterials: [],
      selectedRegion: {},
    });
    setFieldsValue({ companyId: selectedCompany.id });
  };

  handleSelectRegion = selectedRegion => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedRegion, regionModalVisible: false });
    setFieldsValue({ areaId: selectedRegion.id });
  };

  handleSelectDangerSource = selectedDangerSource => {
    const {
      form: { setFieldsValue },
    } = this.props;
    this.setState({ selectedDangerSource, dangerSourceModalVisible: false });
    setFieldsValue({ dangerSourceUnit: selectedDangerSource.id });
  };

  handleSelectMaterials = selectedMaterials => {
    const {
      form: { setFieldsValue },
    } = this.props;
    const { materialsNum } = this.state;
    this.setState({ selectedMaterials, materialsModalVisible: false });
    const isToxicChem = selectedMaterials.map(item => item.highlyToxicChem);
    const isChemcataSn = selectedMaterials.map(item => item.dangerChemcataSn);
    if (isChemcataSn.join(',') !== '') {
      setFieldsValue({ dangerWarehouse: '1' });
    } else {
      setFieldsValue({ dangerWarehouse: undefined });
    }
    if (isToxicChem.includes('1')) {
      setFieldsValue({ toxicWarehouse: '1' });
    } else {
      setFieldsValue({ toxicWarehouse: undefined });
    }
    setFieldsValue({
      materialsName: JSON.stringify(
        selectedMaterials.map(item => ({
          chineName: item.chineName,
          materialId: item.id,
          unitChemiclaNum: materialsNum[item.id],
        }))
      ),
    });
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

  handleViewRegionModal = () => {
    const {
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { selectedCompany } = this.state;
    const fixCompanyId = selectedCompany.id || companyId;
    if (fixCompanyId) {
      this.setState({ regionModalVisible: true });
      this.fetchRegion({
        payload: {
          pageSize: 10,
          pageNum: 1,
        },
      });
    } else {
      message.warning('请先选择单位！');
    }
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

  handleMaterialsModal = () => {
    const {
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    const { selectedCompany } = this.state;
    const fixCompanyId = selectedCompany.id || companyId;
    if (fixCompanyId) {
      this.setState({ materialsModalVisible: true });
      this.fetchMaterials({
        payload: {
          pageSize: 10,
          pageNum: 1,
        },
      });
    } else {
      message.warning('请先选择单位！');
    }
  };

  handleChangeDangerSource = e => {
    this.setState({ dangerSourceUnitVisible: e.target.value === '1', selectedDangerSource: {} });
  };

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  // 清空库区名称
  handleResetArea = () => {
    this.props.form.setFieldsValue({ areaId: undefined });
    this.setState({ selectedRegion: {} });
  }

  /**
   * 渲染表单
   */
  renderForm = () => {
    const {
      user: {
        currentUser: { unitType },
      },
      form: { getFieldDecorator },
    } = this.props;
    const {
      selectedCompany,
      // dangerSourceUnitVisible,
      selectedRegion,
      // selectedDangerSource,
      selectedMaterials,
      materialsNum,
    } = this.state;

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
          <FormItem label="库房编码" {...formItemLayout}>
            {getFieldDecorator('code', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入库房编码' }],
            })(<Input placeholder="请输入库房编码" {...itemStyles} />)}
          </FormItem>
          <FormItem label="库房序号" {...formItemLayout}>
            {getFieldDecorator('number', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入库房序号' }],
            })(<Input placeholder="请输入库房序号" {...itemStyles} />)}
          </FormItem>
          <FormItem label="库房名称" {...formItemLayout}>
            {getFieldDecorator('name', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入库房名称' }],
            })(<Input placeholder="请输入库房名称" {...itemStyles} />)}
          </FormItem>
          <FormItem label="库区名称" {...formItemLayout}>
            {getFieldDecorator('areaId', {})(
              <Fragment>
                <Input
                  {...itemStyles}
                  disabled
                  value={selectedRegion.name}
                  placeholder="请选择库区名称"
                />
                <Button style={{ marginRight: '10px' }} type="primary" onClick={this.handleViewRegionModal}>
                  选择
                </Button>
                <Button type="primary" onClick={this.handleResetArea}>
                  清空
                </Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="库区编号" {...formItemLayout}>
            {getFieldDecorator('anumber')(<span>{selectedRegion.number || ''}</span>)}
          </FormItem>
          <FormItem label="区域位置" {...formItemLayout}>
            {getFieldDecorator('position', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请输入区域位置' }],
            })(<Input placeholder="请输入区域位置" {...itemStyles} />)}
          </FormItem>
          <FormItem label="库房面积（㎡）" {...formItemLayout}>
            {getFieldDecorator('area', {
              // getValueFromEvent: this.handleTrim,
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
          <FormItem label="库房形式" {...formItemLayout}>
            {getFieldDecorator('style', {
              rules: [{ required: true, message: '请选择库房形式' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="1">封闭式</Radio>
                <Radio value="2">半封闭式</Radio>
                <Radio value="3">露天</Radio>
              </RadioGroup>
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
          <FormItem label="贮存物质名称" {...formItemLayout}>
            {getFieldDecorator('materialsName', {
              getValueFromEvent: this.handleTrim,
              rules: [{ required: true, message: '请选择贮存物质名称' }],
            })(
              <Fragment>
                <TextArea
                  {...itemStyles}
                  disabled
                  rows={4}
                  placeholder="请选择贮存物质名称"
                  value={selectedMaterials
                    .map(
                      item =>
                        item.chineName + (materialsNum[item.id] ? materialsNum[item.id] + '吨' : '')
                    )
                    .join('，')}
                />
                <Button type="primary" onClick={this.handleMaterialsModal}>
                  选择
                </Button>
              </Fragment>
            )}
          </FormItem>
          <FormItem label="是否危化品仓库" {...formItemLayout}>
            {getFieldDecorator('dangerWarehouse', {
              rules: [{ required: true, message: '请选择是否危化品仓库' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="是否剧毒化学品仓库" {...formItemLayout}>
            {getFieldDecorator('toxicWarehouse', {
              rules: [{ required: true, message: '请选择是否剧毒化学品仓库' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="火灾危险性等级" {...formItemLayout}>
            {getFieldDecorator('dangerLevel', {
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
          <FormItem label="有无防火墙" {...formItemLayout}>
            {getFieldDecorator('firewall', {
              rules: [{ required: true, message: '请选择有无防火墙' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="0">无</Radio>
                <Radio value="1">有</Radio>
              </RadioGroup>
            )}
          </FormItem>

          <FormItem label="是否设置自动喷淋" {...formItemLayout}>
            {getFieldDecorator('spary', {
              rules: [{ required: true, message: '请选择是否设置自动喷淋' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          <FormItem label="是否低温仓储仓库" {...formItemLayout}>
            {getFieldDecorator('lowTemperature', {
              rules: [{ required: true, message: '请选择是否低温仓储仓库' }],
            })(
              <RadioGroup {...itemStyles}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {/* <FormItem label="是否构成重大危险源" {...formItemLayout}>
            {getFieldDecorator('dangerSource', {
              rules: [{ required: true, message: '请选择是否构成重大危险源' }],
            })(
              <RadioGroup onChange={this.handleChangeDangerSource} {...itemStyles}>
                <Radio value="0">否</Radio>
                <Radio value="1">是</Radio>
              </RadioGroup>
            )}
          </FormItem>
          {dangerSourceUnitVisible && (
            <Fragment>
              <FormItem label="所属危险化学品重大危险源单元" {...formItemLayout}>
                {getFieldDecorator('dangerSourceUnit')(
                  <Fragment>
                    <Input
                      {...itemStyles}
                      disabled
                      value={selectedDangerSource.name}
                      placeholder="请选择所属危险化学品重大危险源单元"
                    />
                    <Button type="primary" onClick={this.handleDangerSourceModal}>
                      选择
                    </Button>
                  </Fragment>
                )}
              </FormItem>
              <FormItem label="所属重大危险源单元编号" {...formItemLayout}>
                {getFieldDecorator('dangerSourceCode')(<span>{selectedDangerSource.code}</span>)}
              </FormItem>
            </Fragment>
          )} */}
        </Form>
        <Row style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button type="primary" style={{ marginLeft: '10px' }} onClick={this.handleSubmit}>
            提交
          </Button>
          <Button style={{ marginLeft: '10px' }} href={`#${listUrl}`}>
            返回
          </Button>
        </Row>
      </Card>
    );
  };

  render () {
    const {
      companyLoading,
      regionLoading,
      dangerSourceLoading,
      materialsLoading,
      match: { params: { id = null } = {} },
      company: { companyModal },
      storehouse: { regionModal, dangerSourceModal },
      materials,
      // form: { getFieldValue },
    } = this.props;
    const {
      companyModalVisible,
      regionModalVisible,
      dangerSourceModalVisible,
      materialsModalVisible,
      selectedMaterials,
      materialsNum,
      selectedRegion,
    } = this.state;
    const title = id ? '编辑库房' : '新增库房';
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '基本信息', name: '基本信息' },
      { title: '库房管理', name: '库房管理', href: listUrl },
      { title, name: title },
    ];

    const materialsModal = {
      ...materials,
      list: materials.list.map(item => {
        const material = selectedMaterials.find(material => material.materialId === item.id) || {};
        return { ...item, unitChemiclaNum: material.unitChemiclaNum };
      }),
    };

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
      // {
      //   title: '危险性类别',
      //   dataIndex: 'riskCateg',
      //   key: 'riskCateg',
      //   render: data => RISK_CATEGORIES[data],
      // },
      {
        title: '设计储量（吨）',
        dataIndex: 'unitChemiclaNum',
        key: 'unitChemiclaNum',
        render: (data, row) => (
          <InputNumber
            placeholder="请输入设计储量（吨）"
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
        <CompanyModal
          title="选择库区"
          columns={regionColumns}
          field={regionFields}
          butonStyles={{ width: 'auto' }}
          loading={regionLoading}
          visible={regionModalVisible}
          modal={regionModal}
          fetch={this.fetchRegion}
          onSelect={this.handleSelectRegion}
          onClose={() => {
            this.setState({ regionModalVisible: false });
          }}
        // rowSelection={{
        //   selectedRowKeys: selectedRegion && selectedRegion.id ? [selectedRegion.id] : [],
        // }}
        />
        {/* 重大危险源 */}
        <CompanyModal
          title="选择重大危险源"
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
