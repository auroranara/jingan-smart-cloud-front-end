import React, { Component, Fragment } from 'react';
import { Button, Spin, message, Input, Select, Form, DatePicker, Radio } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import CustomUpload from '@/jingan-components/CustomUpload';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import BuildingFloorSelect from './BuildingFloorSelect';
import styles from './index.less';

const { Option } = Select;
const LIST_PATH = '/device-management/gateway/list';
const EDIT_PATH = '/device-management/gateway/edit';
const EDIT_CODE = 'deviceManagement.gateway.edit';
const ADD_CODE = 'deviceManagement.gateway.add';
const DETAIL_CODE = 'deviceManagement.gateway.detail';
const SPAN = { span: 24 };
const LABEL_COL = { span: 4 };
const DEFAULT_FORMAT = 'YYYY-MM-DD';

@connect(({
  gateway,
  user,
  loading,
}) => ({
  gateway,
  user,
  loading: loading.effects['gateway/fetchDetail'],
  adding: loading.effects['gateway/add'],
  editing: loading.effects['gateway/edit'],
}), (dispatch) => ({
  getDetail(payload, callback) {
    dispatch({
      type: 'gateway/fetchDetail',
      payload,
      callback,
    });
  },
  getTypeList() {
    dispatch({
      type: 'gateway/fetchTypeList',
    });
  },
  getProtocolList() {
    dispatch({
      type: 'gateway/fetchProtocolList',
    });
  },
  getNetworkingList() {
    dispatch({
      type: 'gateway/fetchNetworkingList',
    });
  },
  getBrandList() {
    dispatch({
      type: 'gateway/fetchBrandList',
    });
  },
  getModelList(payload) {
    dispatch({
      type: 'gateway/fetchModelList',
      payload,
    });
  },
  getOperatorList() {
    dispatch({
      type: 'gateway/fetchOperatorList',
    });
  },
  setDetail() {
    dispatch({
      type: 'gateway/save',
      payload: {
        detail: {},
      },
    });
  },
  add(payload, callback) {
    dispatch({
      type: 'gateway/add',
      payload,
      callback,
    });
  },
  edit(payload, callback) {
    dispatch({
      type: 'gateway/add',
      payload,
      callback,
    });
  },
}))
@Form.create()
export default class GatewayOther extends Component {
  componentDidMount() {
    const {
      match: {
        params: {
          type,
          id,
        },
      },
      user: {
        currentUser: {
          permissionCodes,
        },
      },
      getDetail,
      getTypeList,
      getProtocolList,
      getNetworkingList,
      getBrandList,
      getModelList,
      getOperatorList,
      setDetail,
    } = this.props;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    if ((type === 'add' && hasAddAuthority) || (type === 'edit' && hasEditAuthority) || (type === 'detail' && hasDetailAuthority)) {
      setDetail();
      getTypeList();
      getProtocolList();
      getNetworkingList();
      getBrandList();
      getModelList();
      getOperatorList();
      if (type !== 'add') { // 不考虑id不存在的情况，由request来跳转到500
        getDetail && getDetail({ id }, () => {
          this.refresh();
        });
      }
    } else {
      router.replace('/404');
    }
  }

  componentWillUnmount() {
    const { setDetail } = this.props;
    setDetail && setDetail({});
  }

  getTitle = () => {
    const { match: { params: { type } } } = this.props;
    return ({ add: '新增网关设备', detail: '网关设备详情', edit: '编辑网关设备' })[type];
  }

  getBreadcrumbList = (title) => {
    return [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '设备管理',
        name: '设备管理',
      },
      {
        title: '单位网关设备管理',
        name: '单位网关设备管理',
        href: LIST_PATH,
      },
      {
        title,
        name: title,
      },
    ];
  }

  getFields = () => {
    const {
      match: {
        params: {
          type,
        },
      },
      user: {
        currentUser: {
          unitType,
          unitId,
        },
      },
      gateway: {
        detail: {
          companyId,
          companyName,
          equipmentType,
          brand,
          model,
          name,
          code,
          protocolName,
          networking,
          operator,
          cardNumber,
          expiryDate,
          pluggable,
          manufacturer,
          manufacturerTelephone,
          productionDate,
          lifetime,
          entryForm,
          detailedLocation,
          area,
          location,
          building,
          floor,
          installer,
          installerPhone,
          installDate,
          installPictures,
        }={},
        typeList=[],
        protocolList=[],
        networkingList=[],
        brandList=[],
        modelList=[],
        operatorList=[],
      },
    } = this.props;
    const isNotCompany = +unitType !== 4;
    const values = this.form && this.form.getFieldsValue() || {};
    const isNotDetail = type !== 'detail';
    const showMoreNetworkingInfo = networkingList.filter(({ desc }) => ['2G/3G/4G/5G', 'GPRS', 'NB-IoT'].includes(desc)).map(({ value }) => `${value}`).includes(values.networking);
    const realCompanyId = values.company && values.company.key !== values.company.label ? values.company.key : undefined;

    return [
      {
        title: '基本信息',
        fields: [
          ...(isNotCompany ? [{
            id: 'company',
            label: '单位名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <CompanySelect className={styles.item} /> : <span>{companyName}</span>,
            options: {
              initialValue: companyId && { key: companyId, label: companyName },
              rules: [
                {
                  required: true,
                  message: '单位名称不能为空',
                  transform: value => value && value.label,
                },
              ],
            },
          }] : []),
          {
            id: 'equipmentType',
            label: '设备类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? (
              <Select className={styles.item} placeholder="请选择设备类型" onChange={this.handleTypeChange}>
                {typeList.map(({ id, name }) => <Option key={id}>{name}</Option>)}
              </Select>
            ) : <span>{equipmentType}</span>,
            options: {
              initialValue: equipmentType,
              rules: [
                {
                  required: true,
                  message: '设备类型不能为空',
                },
              ],
            },
          },
          {
            id: 'brand',
            label: '品牌',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? (
              <Select className={styles.item} placeholder="请选择品牌" onChange={this.handleBrandChange}>
                {brandList.map(({ id, name }) => <Option key={id}>{name}</Option>)}
              </Select>
            ) : <span>{brand}</span>,
            options: {
              initialValue: brand,
              rules: [
                {
                  required: true,
                  message: '品牌不能为空',
                },
              ],
            },
          },
          {
            id: 'model',
            label: '型号',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? (
              <Select className={styles.item} placeholder="请选择型号" onChange={this.handleModelChange}>
                {modelList.map((data) => <Option key={data.id} data={data}>{data.name}</Option>)}
              </Select>
            ) : <span>{model}</span>,
            options: {
              initialValue: model,
              rules: [
                {
                  required: true,
                  message: '型号不能为空',
                },
              ],
            },
          },
          {
            id: 'name',
            label: '设备名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <Input className={styles.item} placeholder="请输入设备名称" maxLength={50} /> : <span>{name}</span>,
            options: {
              initialValue: name,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '单位名称不能为空',
                },
              ],
            },
          },
          {
            id: 'code',
            label: '设备编号',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <Input className={styles.item} placeholder="请输入设备编号" maxLength={50} /> : <span>{code}</span>,
            options: {
              initialValue: code,
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '单位名称不能为空',
                },
              ],
            },
          },
        ],
      },
      {
        title: '联网信息',
        fields: [
          {
            id: 'protocolName',
            label: '协议名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? (
              <Select className={styles.item} placeholder="请选择协议名称" allowClear>
                {protocolList.map(({ value, desc }) => <Option key={`${value}`}>{desc}</Option>)}
              </Select>
            ) : <span>{protocolName}</span>,
            options: {
              initialValue: protocolName && `${protocolName}`,
            },
          },
          {
            id: 'networking',
            label: '联网方式',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? (
              <Select className={styles.item} placeholder="请选择联网方式">
                {networkingList.map(({ value, desc }) => <Option key={`${value}`}>{desc}</Option>)}
              </Select>
            ) : <span>{networking}</span>,
            options: {
              initialValue: networking && `${networking}`,
              rules: [
                {
                  required: true,
                  message: '联网方式不能为空',
                },
              ],
            },
          },
          ...(showMoreNetworkingInfo ? [
            {
              id: 'operator',
              label: '运营商',
              span: SPAN,
              labelCol: LABEL_COL,
              render: () => isNotDetail ? (
                <Select className={styles.item} placeholder="请选择运营商" allowClear>
                  {operatorList.map(({ value, desc }) => <Option key={`${value}`}>{desc}</Option>)}
                </Select>
              ) : <span>{operator}</span>,
              options: {
                initialValue: operator,
              },
            },
            {
              id: 'cardNumber',
              label: '上网卡卡号',
              span: SPAN,
              labelCol: LABEL_COL,
              render: () => isNotDetail ? <Input className={styles.item} placeholder="请输入上网卡卡号" maxLength={50} /> : <span>{cardNumber}</span>,
              options: {
                initialValue: cardNumber,
              },
            },
            {
              id: 'expiryDate',
              label: '卡失效日期',
              span: SPAN,
              labelCol: LABEL_COL,
              render: () => isNotDetail ? <DatePicker className={styles.item} placeholder="请选择卡失效日期" allowClear /> : <span>{expiryDate && moment(expiryDate).format(DEFAULT_FORMAT)}</span>,
              options: {
                initialValue: expiryDate && moment(expiryDate),
              },
            },
            {
              id: 'pluggable',
              label: '卡是否可插拔',
              span: SPAN,
              labelCol: LABEL_COL,
              render: () => isNotDetail ? (
                <Radio.Group>
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              ) : <span>{['否', '是'][pluggable]}</span>,
              options: {
                initialValue: pluggable && `${pluggable}`,
              },
            },
          ] : []),
        ],
      },
      {
        title: '生产信息',
        fields: [
          {
            id: 'manufacturer',
            label: '生产厂家',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <Input className={styles.item} placeholder="请输入生产厂家" maxLength={50} /> : <span>{manufacturer}</span>,
            options: {
              initialValue: manufacturer,
            },
          },
          {
            id: 'manufacturerTelephone',
            label: '生产厂家电话',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <Input className={styles.item} placeholder="请输入生产厂家电话" maxLength={50} /> : <span>{manufacturerTelephone}</span>,
            options: {
              initialValue: manufacturerTelephone,
            },
          },
          {
            id: 'productionDate',
            label: '生产日期',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <DatePicker className={styles.item} placeholder="请选择生产日期" allowClear /> : <span>{productionDate && moment(productionDate).format(DEFAULT_FORMAT)}</span>,
            options: {
              initialValue: productionDate && moment(productionDate),
            },
          },
          {
            id: 'lifetime',
            label: '使用期限（月）',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <Input className={styles.item} placeholder="请输入使用期限（月）" maxLength={50} /> : <span>{lifetime}</span>,
            options: {
              initialValue: lifetime,
            },
          },
        ],
      },
      {
        title: '区域-位置',
        fields: [
          {
            id: 'entryForm',
            label: '录入方式',
            extra: '（如果单位设备较多，且该设备在建筑物内，推荐选择建筑物-楼层）',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? (
              <Radio.Group>
                <Radio value="0">选择建筑物-楼层</Radio>
                <Radio value="1">手填</Radio>
              </Radio.Group>
            ) : <span>{['选择建筑物-楼层', '手填'][entryForm]}</span>,
            options: {
              initialValue: entryForm && `${entryForm}` || '0',
              rules: [
                {
                  required: true,
                  message: '录入方式不能为空',
                },
              ],
            },
          },
          ...(values.entryForm === '0' ? [
            {
              id: 'buildingFloor',
              label: '所属建筑物楼层',
              span: SPAN,
              labelCol: LABEL_COL,
              render: () => isNotDetail ? <BuildingFloorSelect onHelpChange={this.handleHelpChange} companyId={unitId || realCompanyId} /> : <span>{[building, floor].filter(v => v).join('')}</span>,
              options: {
                initialValue: [building, floor],
                rules: [
                  {
                    required: true,
                    message: '所属建筑物楼层不能为空',
                    transform: (value) => value && value[0] && value[1],
                  },
                ],
              },
            },
            {
              id: 'detailedLocation',
              label: '详细位置',
              span: SPAN,
              labelCol: LABEL_COL,
              render: () => isNotDetail ? <Input className={styles.item} placeholder="请输入详细位置" maxLength={50} /> : <span>{detailedLocation}</span>,
              options: {
                initialValue: detailedLocation,
              },
            },
          ] : [
            {
              id: 'area',
              label: '所在区域',
              span: SPAN,
              labelCol: LABEL_COL,
              render: () => isNotDetail ? <Input className={styles.item} placeholder="请输入所在区域" maxLength={50} /> : <span>{area}</span>,
              options: {
                initialValue: area,
                rules: [
                  {
                    required: true,
                    message: '所在区域不能为空',
                  },
                ],
              },
            },
            {
              id: 'location',
              label: '位置详情',
              span: SPAN,
              labelCol: LABEL_COL,
              render: () => isNotDetail ? <Input className={styles.item} placeholder="请输入位置详情" maxLength={50} /> : <span>{location}</span>,
              options: {
                initialValue: location,
                rules: [
                  {
                    required: true,
                    message: '位置详情不能为空',
                  },
                ],
              },
            },
          ]),
        ],
      },
      {
        title: '施工信息',
        fields: [
          {
            id: 'installer',
            label: '安装人',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <Input className={styles.item} placeholder="请输入安装人" maxLength={50} /> : <span>{installer}</span>,
            options: {
              initialValue: installer,
            },
          },
          {
            id: 'installerPhone',
            label: '安装人电话',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <Input className={styles.item} placeholder="请输入安装人电话" maxLength={50} /> : <span>{installerPhone}</span>,
            options: {
              initialValue: installerPhone,
            },
          },
          {
            id: 'installDate',
            label: '安装日期',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <DatePicker className={styles.item} placeholder="请选择安装日期" allowClear /> : <span>{installDate && moment(installDate).format(DEFAULT_FORMAT)}</span>,
            options: {
              initialValue: installDate && moment(installDate),
            },
          },
          {
            id: 'installPictures',
            label: '施工照片',
            extra: '（施工前后、进线位置等）',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <CustomUpload folder="emergencyPlan" /> : (
              <div>
                {installPictures && installPictures.map(({ webUrl, name }, index) => (
                  <div key={index}>
                    <a className={styles.clickable} href={webUrl} target="_blank" rel="noopener noreferrer">{name}</a>
                  </div>
                ))}
              </div>
            ),
            options: {
              initialValue: installPictures || [],
            },
          },
        ],
      },
    ];
  }

  setFormReference = form => {
    this.form = form;
  }

  refresh = () => {
    setTimeout(() => {
      this.forceUpdate();
    }, 0);
  }

  handleTypeChange = (equipmentType) => {
    const { getModelList } = this.props;
    const { getFieldValue, setFieldsValue } = this.form;
    const brand = getFieldValue('brand');
    setFieldsValue({
      model: undefined,
    });
    getModelList({
      equipmentType,
      brand,
    });
  }

  handleBrandChange = (brand) => {
    const { getModelList } = this.props;
    const { getFieldValue, setFieldsValue } = this.form;
    const equipmentType = getFieldValue('equipmentType');
    setFieldsValue({
      model: undefined,
    });
    getModelList({
      equipmentType,
      brand,
    });
  }

  handleModelChange = (value, { props: { data: { equipmentType, brand } } }) => {
    const { setFieldsValue } = this.form;
    setFieldsValue({
      equipmentType,
      brand,
    });
  }

  // 返回按钮点击事件
  handleBackButtonClick = () => {
    router.goBack();
  }

  // 提交按钮点击事件
  handleSubmitButtonClick = () => {
    const {
      add,
      edit,
      match: {
        params: {
          id,
        },
      },
      user: {
        currentUser: {
          unitId,
        },
      },
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      console.log(values);
      if (!errors) {
        // (id ? edit : add)(values, (isSuccess) => {
        //   if (isSuccess) {
        //     message.success(`${id ? '编辑' : '新增'}成功！`);
        //     router.push(LIST_PATH);
        //   } else {
        //     message.error(`${id ? '编辑' : '新增'}失败，请稍后重试！`);
        //   }
        // });
      }
    });
  }

  // 编辑按钮点击事件
  handleEditButtonClick = () => {
    const { match: { params: { id } } } = this.props;
    router.push(`${EDIT_PATH}${EDIT_PATH.endsWith('/') ? id : `/${id}`}`);
  }

  handleHelpChange = (showError) => {
    const { setFields, getFieldError } = this.form;
    const error = getFieldError('buildingFloor');
    if (showError || (error && error[0] === '请先选择单位名称')) {
      setFields({
        buildingFloor: {
          errors: showError ? [new Error('请先选择单位名称')] : undefined,
        },
      });
    }
  }

  render() {
    const {
      match: {
        params: {
          type,
        },
      },
      user: {
        currentUser: {
          permissionCodes,
        },
      },
      loading,
      adding,
      editing,
    } = this.props;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const title = this.getTitle();
    const breadcrumbList = this.getBreadcrumbList(title);
    const fields = this.getFields();

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading || adding || editing || false}>
          <CustomForm
            mode="multiple"
            fields={fields}
            searchable={false}
            resetable={false}
            ref={this.setFormReference}
            refresh={this.refresh}
            action={
              <Fragment>
                <Button onClick={this.handleBackButtonClick}>返回</Button>
                {type !== 'detail' ? (
                  <Button type="primary" onClick={this.handleSubmitButtonClick}>提交</Button>
                ) : (
                  hasEditAuthority && <Button type="primary" onClick={this.handleEditButtonClick}>编辑</Button>
                )}
              </Fragment>
            }
          />
        </Spin>
      </PageHeaderLayout>
    );
  }
}
