import React, { Component, Fragment } from 'react';
import { Button, Spin, message, Input, Select, DatePicker, Radio, InputNumber } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import CustomUpload from '@/jingan-components/CustomUpload';
import { connect } from 'dva';
import moment from 'moment';
// import router from 'umi/router';
import BuildingFloorSelect from '@/pages/DeviceManagement/Gateway/Other/BuildingFloorSelect';
// import MarkerSelect from '@/pages/DeviceManagement/Gateway/Other/MarkerSelect';
// 地图定位
import MapMarkerSelect from '@/components/MapMarkerSelect';
import styles from '@/pages/DeviceManagement/Gateway/Other/index.less';
import { genGoBack } from '@/utils/utils';

const { Option } = Select;
const LIST_PATH = '/device-management/user-transmission-device/list';
const SPAN = { span: 24 };
const LABEL_COL = { span: 4 };
const DEFAULT_FORMAT = 'YYYY-MM-DD';

@connect(
  ({ gateway, user, loading }) => ({
    gateway,
    user,
    loading: loading.effects['gateway/fetchDetail'],
    adding: loading.effects['gateway/add'],
    editing: loading.effects['gateway/edit'],
  }),
  dispatch => ({
    getDetail(payload, callback) {
      dispatch({
        type: 'gateway/fetchDetail',
        payload,
        callback,
      });
    },
    getTypeList(payload, callback) {
      dispatch({
        type: 'gateway/fetchTypeList',
        payload,
        callback,
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
    getBrandList(payload, callback) {
      dispatch({
        type: 'gateway/fetchBrandList',
        payload,
        callback,
      });
    },
    getModelList(payload, callback) {
      dispatch({
        type: 'gateway/fetchModelList',
        payload,
        callback,
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
        type: 'gateway/edit',
        payload,
        callback,
      });
    },
  })
)
export default class GatewayOther extends Component {
  constructor(props) {
    const { location: { query: { companyId } } } = props;
    super(props);
    this.goBack = genGoBack(props, `/device-management/user-transmission-device/${companyId}/detail`);
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      user: { isCompany },
      getDetail,
      getTypeList,
      getProtocolList,
      getNetworkingList,
      getBrandList,
      getModelList,
      getOperatorList,
      setDetail,
    } = this.props;
    setDetail();
    getTypeList();
    getProtocolList();
    getNetworkingList();
    getOperatorList();
    if (!window.location.href.includes('add')) {
      // 不考虑id不存在的情况，由request来跳转到500
      getDetail &&
        getDetail({ id }, ({ equipmentType, brand, companyId, companyName, pointFixInfoList }) => {
          isCompany &&
            this.form.setFieldsValue({ company: { key: companyId, label: companyName } });
          getBrandList(
            {
              equipmentType,
            },
            () => {
              this.refresh();
            }
          );
          getModelList(
            {
              equipmentType,
              brand,
            },
            () => {
              this.refresh();
            }
          );
          if (pointFixInfoList && pointFixInfoList.length) {
            let { xnum, ynum, znum, groupId, areaId } = pointFixInfoList[0];
            const coord = { x: +xnum, y: +ynum, z: +znum };
            groupId = +groupId;
            setTimeout(() => {
              this.form.setFieldsValue({ mapLocation: { groupId, coord, areaId } });
            }, 0);
          }
        });
    } else {
      getBrandList();
      getModelList();
    }
  }

  componentWillUnmount() {
    const { setDetail } = this.props;
    setDetail && setDetail({});
  }

  getFields = () => {
    const {
      // 如果url中传递参数设备类型 equipmentType，则此选项不可编辑
      location: {
        query: { equipmentType: initialEquipmentType },
        query,
      },
      user: {
        currentUser: { unitType, unitId },
        currentUser,
      },
      gateway: {
        detail: {
          companyId,
          companyName,
          equipmentType,
          equipmentTypeName,
          brand,
          brandName,
          model,
          modelName,
          name,
          code,
          agreementType,
          agreementTypeName,
          networkingType,
          networkingTypeName,
          operator,
          operatorName,
          cardNum,
          cardExpireDate,
          cardSfp,
          productCompany,
          productCompanyPhone,
          productDate,
          serviceLife,
          locationType,
          location,
          area,
          buildingId,
          buildingName,
          floorId,
          floorName,
          installer,
          installerPhone,
          installDate,
          installPhotoList,
          marker,
        } = {},
        typeList = [],
        protocolList = [],
        networkingList = [],
        brandList = [],
        modelList = [],
        operatorList = [],
      },
    } = this.props;
    const href = window.location.href;
    const isNotCompany = +unitType !== 4;
    const isEdit = href.includes('edit');
    const values = (this.form && this.form.getFieldsValue()) || {};
    const isNotDetail = !href.includes('detail');
    const showMoreNetworkingInfo = networkingList
      .filter(({ desc }) => ['2G/3G/4G/5G', 'GPRS', 'NB_IoT'].includes(desc))
      .map(({ value }) => `${value}`)
      .includes(values.networkingType);
    const isBuildingFloorEntryForm = !values.locationType || values.locationType === '0';
    const realCompanyId =
      values.company && values.company.key !== values.company.label
        ? values.company.key
        : undefined;
    // 设备类型 201 数据处理设备
    const isDataProcessingType = values && values.equipmentType === '201';

    return [
      {
        title: '基本信息',
        fields: [
          {
            id: 'company',
            label: '单位名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <CompanySelect
                  disabled={isEdit || !!query.companyId || !isNotCompany}
                  className={styles.item}
                />
              ) : (
                <span>{companyName}</span>
              ),
            options: {
              initialValue:
                (companyId && { key: companyId, label: companyName }) ||
                (query.companyId && { key: query.companyId, label: query.companyName }) ||
                (!isNotCompany && { key: currentUser.companyId, label: currentUser.companyName }) ||
                undefined,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '单位名称不能为空',
                      transform: value => value && value.label,
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'equipmentType',
            label: '设备类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Select
                  className={styles.item}
                  placeholder="请选择设备类型"
                  onChange={this.handleTypeChange}
                  allowClear
                  disabled={!!initialEquipmentType || isEdit}
                >
                  {typeList.map(({ id, name }) => (
                    <Option key={id}>{name}</Option>
                  ))}
                </Select>
              ) : (
                <span>{equipmentTypeName}</span>
              ),
            options: {
              initialValue: initialEquipmentType || equipmentType,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '设备类型不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'brand',
            label: '品牌',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Select
                  className={styles.item}
                  placeholder="请选择品牌"
                  onChange={this.handleBrandChange}
                  allowClear
                >
                  {brandList.map(({ id, name }) => (
                    <Option key={id}>{name}</Option>
                  ))}
                </Select>
              ) : (
                <span>{brandName}</span>
              ),
            options: {
              initialValue: brand,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '品牌不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'model',
            label: '型号',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Select
                  className={styles.item}
                  placeholder="请选择型号"
                  onChange={this.handleModelChange}
                  allowClear
                >
                  {modelList.map(data => (
                    <Option key={data.id} data={data}>
                      {data.name}
                    </Option>
                  ))}
                </Select>
              ) : (
                <span>{modelName}</span>
              ),
            options: {
              initialValue: model,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '型号不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'name',
            label: '设备名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Input className={styles.item} placeholder="请输入设备名称" maxLength={50} />
              ) : (
                <span>{name}</span>
              ),
            options: {
              initialValue: name,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '设备名称不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'code',
            label: '设备编号',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Input className={styles.item} placeholder="请输入设备编号" maxLength={50} />
              ) : (
                <span>{code}</span>
              ),
            options: {
              initialValue: code,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '设备编号不能为空',
                    },
                    isDataProcessingType ? { pattern: /^\d*$/, message: '请输入数字' } : {},
                  ]
                : undefined,
            },
          },
        ],
      },
      {
        title: '联网信息',
        fields: [
          {
            id: 'agreementType',
            label: '协议名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Select className={styles.item} placeholder="请选择协议名称" allowClear>
                  {protocolList.map(({ value, desc }) => (
                    <Option key={`${value}`}>{desc}</Option>
                  ))}
                </Select>
              ) : (
                <span>{agreementTypeName}</span>
              ),
            options: {
              initialValue: agreementType && `${agreementType}`,
            },
          },
          {
            id: 'networkingType',
            label: '联网方式',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Select className={styles.item} placeholder="请选择联网方式">
                  {networkingList.map(({ value, desc }) => (
                    <Option key={`${value}`}>{desc}</Option>
                  ))}
                </Select>
              ) : (
                <span>{networkingTypeName}</span>
              ),
            options: {
              initialValue: networkingType && `${networkingType}`,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '联网方式不能为空',
                    },
                  ]
                : undefined,
            },
          },
          ...(showMoreNetworkingInfo
            ? [
                {
                  id: 'operator',
                  label: '运营商',
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () =>
                    isNotDetail ? (
                      <Select className={styles.item} placeholder="请选择运营商" allowClear>
                        {operatorList.map(({ value, desc }) => (
                          <Option key={`${value}`}>{desc}</Option>
                        ))}
                      </Select>
                    ) : (
                      <span>{operatorName}</span>
                    ),
                  options: {
                    initialValue: operator && `${operator}`,
                  },
                },
                {
                  id: 'cardNum',
                  label: '上网卡卡号',
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () =>
                    isNotDetail ? (
                      <Input
                        className={styles.item}
                        placeholder="请输入上网卡卡号"
                        maxLength={50}
                      />
                    ) : (
                      <span>{cardNum}</span>
                    ),
                  options: {
                    initialValue: cardNum,
                  },
                },
                {
                  id: 'cardExpireDate',
                  label: '卡失效日期',
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () =>
                    isNotDetail ? (
                      <DatePicker
                        className={styles.item}
                        placeholder="请选择卡失效日期"
                        allowClear
                      />
                    ) : (
                      <span>{cardExpireDate && moment(cardExpireDate).format(DEFAULT_FORMAT)}</span>
                    ),
                  options: {
                    initialValue: cardExpireDate && moment(cardExpireDate),
                  },
                },
                {
                  id: 'cardSfp',
                  label: '卡是否可插拔',
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () =>
                    isNotDetail ? (
                      <Radio.Group>
                        <Radio value="1">是</Radio>
                        <Radio value="0">否</Radio>
                      </Radio.Group>
                    ) : (
                      <span>{['否', '是'][cardSfp]}</span>
                    ),
                  options: {
                    initialValue: cardSfp && `${cardSfp}`,
                  },
                },
              ]
            : []),
        ],
      },
      {
        title: '生产信息',
        fields: [
          {
            id: 'productCompany',
            label: '生产厂家',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Input className={styles.item} placeholder="请输入生产厂家" maxLength={50} />
              ) : (
                <span>{productCompany}</span>
              ),
            options: {
              initialValue: productCompany,
            },
          },
          {
            id: 'productCompanyPhone',
            label: '生产厂家电话',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Input className={styles.item} placeholder="请输入生产厂家电话" maxLength={50} />
              ) : (
                <span>{productCompanyPhone}</span>
              ),
            options: {
              initialValue: productCompanyPhone,
            },
          },
          {
            id: 'productDate',
            label: '生产日期',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <DatePicker className={styles.item} placeholder="请选择生产日期" allowClear />
              ) : (
                <span>{productDate && moment(productDate).format(DEFAULT_FORMAT)}</span>
              ),
            options: {
              initialValue: productDate && moment(productDate),
            },
          },
          {
            id: 'serviceLife',
            label: '使用期限（月）',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <InputNumber
                  min={1}
                  precision={0}
                  className={styles.item}
                  placeholder="请输入使用期限（月）"
                  maxLength={50}
                />
              ) : (
                <span>{serviceLife}</span>
              ),
            options: {
              initialValue: serviceLife,
            },
          },
        ],
      },
      ...(realCompanyId
        ? [
            {
              title: '区域-位置',
              fields: [
                {
                  id: 'locationType',
                  label: '录入方式',
                  extra: isNotDetail
                    ? '（如果单位设备较多，且该设备在建筑物内，推荐选择建筑物-楼层）'
                    : undefined,
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () =>
                    isNotDetail ? (
                      <Radio.Group>
                        <Radio value="0">选择建筑物-楼层</Radio>
                        <Radio value="1">手填</Radio>
                      </Radio.Group>
                    ) : (
                      <span>{['选择建筑物-楼层', '手填'][locationType]}</span>
                    ),
                  options: {
                    initialValue: (locationType && `${locationType}`) || '0',
                    rules: isNotDetail
                      ? [
                          {
                            required: true,
                            message: '录入方式不能为空',
                          },
                        ]
                      : undefined,
                  },
                },
                ...(isBuildingFloorEntryForm
                  ? [
                      {
                        id: 'buildingFloor',
                        label: '所属建筑物楼层',
                        span: SPAN,
                        labelCol: LABEL_COL,
                        render: () =>
                          isNotDetail ? (
                            <BuildingFloorSelect
                              companyId={unitId || realCompanyId}
                              marker={values.marker}
                            />
                          ) : (
                            <span>{[buildingName, floorName].filter(v => v).join('')}</span>
                          ),
                        options: {
                          initialValue: [buildingId, floorId],
                          rules: isNotDetail
                            ? [
                                {
                                  required: true,
                                  validator: this.validateBuildingFloor,
                                },
                              ]
                            : undefined,
                        },
                      },
                      {
                        id: 'location',
                        label: '详细位置',
                        span: SPAN,
                        labelCol: LABEL_COL,
                        render: () =>
                          isNotDetail ? (
                            <Input
                              className={styles.item}
                              placeholder="请输入详细位置"
                              maxLength={50}
                            />
                          ) : (
                            <span>{location}</span>
                          ),
                        options: {
                          initialValue: location,
                        },
                      },
                    ]
                  : [
                      {
                        id: 'area',
                        label: '所在区域',
                        span: SPAN,
                        labelCol: LABEL_COL,
                        render: () =>
                          isNotDetail ? (
                            <Input
                              className={styles.item}
                              placeholder="请输入所在区域"
                              maxLength={50}
                            />
                          ) : (
                            <span>{area}</span>
                          ),
                        options: {
                          initialValue: area,
                          rules: isNotDetail
                            ? [
                                {
                                  required: true,
                                  message: '所在区域不能为空',
                                },
                              ]
                            : undefined,
                        },
                      },
                      {
                        id: 'location',
                        label: '位置详情',
                        span: SPAN,
                        labelCol: LABEL_COL,
                        render: () =>
                          isNotDetail ? (
                            <Input
                              className={styles.item}
                              placeholder="请输入位置详情"
                              maxLength={50}
                            />
                          ) : (
                            <span>{location}</span>
                          ),
                        options: {
                          initialValue: location,
                          rules: isNotDetail
                            ? [
                                {
                                  required: true,
                                  message: '位置详情不能为空',
                                },
                              ]
                            : undefined,
                        },
                      },
                    ]),
              ],
            },
            {
              title: '地图定位',
              fields: [
                {
                  id: 'mapLocation',
                  label: '地图定位',
                  extra: isNotDetail ? '（用于在驾驶舱展示）' : undefined,
                  span: SPAN,
                  labelCol: LABEL_COL,
                  // render: () => <MarkerSelect companyId={unitId || realCompanyId} isBuildingFloorEntryForm={isBuildingFloorEntryForm} buildingFloor={values.buildingFloor} readonly={!isNotDetail} />,
                  render: () => <MapMarkerSelect companyId={unitId || realCompanyId} />,
                  options: {
                    // initialValue: marker || [],
                    rules: isNotDetail
                      ? [
                          {
                            required: true,
                            validator: this.validateMarker,
                          },
                        ]
                      : undefined,
                  },
                },
              ],
            },
          ]
        : []),
      {
        title: '施工信息',
        fields: [
          {
            id: 'installer',
            label: '安装人',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Input className={styles.item} placeholder="请输入安装人" maxLength={50} />
              ) : (
                <span>{installer}</span>
              ),
            options: {
              initialValue: installer,
            },
          },
          {
            id: 'installerPhone',
            label: '安装人电话',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Input className={styles.item} placeholder="请输入安装人电话" maxLength={50} />
              ) : (
                <span>{installerPhone}</span>
              ),
            options: {
              initialValue: installerPhone,
            },
          },
          {
            id: 'installDate',
            label: '安装日期',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <DatePicker className={styles.item} placeholder="请选择安装日期" allowClear />
              ) : (
                <span>{installDate && moment(installDate).format(DEFAULT_FORMAT)}</span>
              ),
            options: {
              initialValue: installDate && moment(installDate),
            },
          },
          {
            id: 'installPhotoList',
            label: '施工照片',
            extra: isNotDetail ? '（施工前后、进线位置等）' : undefined,
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <CustomUpload folder="emergencyPlan" beforeUpload={this.handleBeforeUpload} />
              ) : (
                <div>
                  {installPhotoList &&
                    installPhotoList.map(({ webUrl, name }, index) => (
                      <div key={index}>
                        <a
                          className={styles.clickable}
                          href={webUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {name}
                        </a>
                      </div>
                    ))}
                </div>
              ),
            options: {
              initialValue: installPhotoList || [],
            },
          },
        ],
      },
    ];
  };

  setFormReference = form => {
    this.form = form;
  };

  refresh = () => {
    setTimeout(() => {
      this.forceUpdate();
    }, 0);
  };

  validateBuildingFloor = (rule, value, callback) => {
    const [buildingId, floorId] = value || [];
    if (!value) {
      callback('所属建筑物楼层不能为空');
      return;
    } else if (!buildingId) {
      callback('请选择建筑物名称');
      return;
    } else if (!floorId) {
      callback('请选择楼层名称');
      return;
    }
    callback();
  };

  // validateMarker = (rule, value, callback) => {
  //   if (!value || value.length === 0) {
  //     callback('平面图标注不能为空');
  //     return;
  //   } else if (value.some(({ ichnographyType }) => !ichnographyType)) {
  //     callback('请选择平面图类型');
  //     return;
  //   } else if (value.some(({ ichnographyType, buildingId }) => ichnographyType === '2' && !buildingId)) {
  //     const { getFieldValue } = this.form;
  //     const locationType = getFieldValue('locationType');
  //     callback(!locationType || locationType === '0' ? '请从区域-位置中选择建筑物名称' : '请选择建筑物名称');
  //     return;
  //   } else if (value.some(({ ichnographyType, floorId }) => ichnographyType === '2' && !floorId)) {
  //     const { getFieldValue } = this.form;
  //     const locationType = getFieldValue('locationType');
  //     callback(!locationType || locationType === '0' ? '请从区域-位置中选择楼层名称' : '请选择楼层名称');
  //     return;
  //   } else if (value.some(({ id }) => !id)) {
  //     callback('请获取定位坐标');
  //     return;
  //   } else if (value.some(({ editing }) => editing)) {
  //     callback('请保存');
  //     return;
  //   }
  //   callback();
  // }

  validateMarker = (rule, value, callback) => {
    if (value && value.groupId && value.coord) {
      callback();
    } else callback('请标注地图定位');
  };

  handleTypeChange = equipmentType => {
    const { getModelList, getBrandList } = this.props;
    const { getFieldValue, setFieldsValue } = this.form;
    const brandId = getFieldValue('brand');
    getBrandList(
      {
        equipmentType,
      },
      list => {
        const brand = list.filter(({ id }) => id === brandId).length > 0 ? brandId : undefined;
        setFieldsValue({
          model: undefined,
          brand,
        });
        getModelList({
          equipmentType,
          brand,
        });
      }
    );
  };

  handleBrandChange = brand => {
    const { getModelList, getTypeList } = this.props;
    const { getFieldValue, setFieldsValue } = this.form;
    const equipmentTypeId = getFieldValue('equipmentType');
    getTypeList(
      {
        brand,
      },
      list => {
        const equipmentType =
          list.findIndex(({ id }) => id === equipmentTypeId) > -1 ? equipmentTypeId : undefined;
        setFieldsValue({
          model: undefined,
          equipmentType,
        });
        getModelList({
          equipmentType,
          brand,
        });
      }
    );
  };

  handleModelChange = (
    value,
    {
      props: {
        data: { equipmentType, brand },
      },
    }
  ) => {
    const { setFieldsValue } = this.form;
    setFieldsValue({
      equipmentType,
      brand,
    });
  };

  // 返回按钮点击事件
  // handleBackButtonClick = () => {
  //   router.goBack();
  // };

  // 提交按钮点击事件
  handleSubmitButtonClick = () => {
    const {
      add,
      edit,
      user: {
        currentUser: { unitType, unitId },
      },
      gateway: { detail: { id } = {} },
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const {
          company,
          marker,
          buildingFloor,
          installDate,
          cardExpireDate,
          productDate,
          mapLocation,
          ...rest
        } = values;
        // const [buildingId, floorId] = buildingFloor || marker.reduce((result, { ichnographyType, buildingId, floorId }) => {
        //   if (ichnographyType === '2') {
        //     result[0] = buildingId;
        //     result[1] = floorId;
        //   }
        //   return result;
        // }, []);
        const [buildingId, floorId] = buildingFloor || ['', ''];
        const payload = {
          ...rest,
          id,
          companyId: +unitType !== 4 ? company.key : unitId,
          buildingId,
          floorId,
          installDate: installDate ? moment(installDate).startOf('day') : undefined,
          cardExpireDate: cardExpireDate ? moment(cardExpireDate).startOf('day') : undefined,
          productDate: productDate ? moment(productDate).startOf('day') : undefined,
          // pointFixInfoList: marker.map(({ id: fixImgId, ichnographyType: imgType, xNum: xnum, yNum: ynum }) => ({ fixImgId, imgType, xnum, ynum })),
          pointFixInfoList: [],
        };
        if (
          mapLocation &&
          (mapLocation.groupId || mapLocation.groupId === 0) &&
          mapLocation.coord
        ) {
          const { coord, ...resMap } = mapLocation;
          payload.pointFixInfoList = [
            { imgType: 5, xnum: coord.x, ynum: coord.y, znum: coord.z, ...resMap },
          ];
        }
        (id ? edit : add)(payload, (isSuccess, res) => {
          if (isSuccess) {
            message.success(`${id ? '编辑' : '新增'}成功！`);
            // if (window.history.length > 1) {
            //   router.goBack();
            // } else router.push(LIST_PATH);
            setTimeout(this.goBack, 1000);
          } else {
            message.error(res ? res.msg : `${id ? '编辑' : '新增'}失败，请稍后重试！`);
          }
        });
      }
    });
  };

  handleBeforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('文件上传只支持JPG/PNG格式!');
    }
    // const isLt2M = file.size / 1024 / 1024 <= 2;
    // if (!isLt2M) {
    //   message.error('文件上传最大支持2MB!');
    // }
    return isJpgOrPng;
  };

  render() {
    const { loading, adding, editing } = this.props;
    const href = window.location.href;
    const title =
      (href.includes('add') && '新增用户传输装置') || (href.includes('edit') && '编辑用户传输装置');
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '物联设备管理',
        name: '物联设备管理',
      },
      {
        title: '用户传输装置',
        name: '用户传输装置',
        href: LIST_PATH,
      },
      {
        title,
        name: title,
      },
    ];
    const fields = this.getFields();

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
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
                <Button type="primary" onClick={this.handleSubmitButtonClick}>
                  提交
                </Button>
                <Button onClick={this.goBack}>返回</Button>
              </Fragment>
            }
          />
        </Spin>
      </PageHeaderLayout>
    );
  }
}
