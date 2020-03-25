import React, { Component, Fragment } from 'react';
import { Icon, Tooltip } from 'antd';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import AsyncSelect from '@/jingan-components/AsyncSelect';
import ChannelAuthorization from './components/ChannelAuthorization2';
import moment from 'moment';
import { isNumber } from '@/utils/utils';
import { BREADCRUMB_LIST, STATUSES, VEHICLE_TYPES, LICENCE_PLATE_TYPES } from '../List';
import styles from './index.less';

const SPAN = {
  xl: 8,
  lg: 12,
  sm: 24,
  xs: 24,
};
const SPAN2 = {
  xl: 16,
  lg: 12,
  sm: 24,
  xs: 24,
};
const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  detail: 'vehicleDetail',
  getDetail: 'getVehicleDetail',
  add: 'addVehicle',
  edit: 'editVehicle',
};
const DEFAULT_FORMAT = 'YYYY-MM-DD';
const TYPES = [{ key: '0', value: '本单位' }, { key: '1', value: '运输公司' }];
const MAPPER2 = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'transportCompanyList',
  getList: 'getTransportCompanyList',
};
const FIELDNAMES = {
  key: 'id',
  value: 'transitCompanyName',
};
const MAPPER3 = {
  namespace: 'realNameCertification',
  list: 'tagCardData',
  getList: 'fetchTagCardList',
};
const FIELDNAMES2 = {
  key: 'id',
  value: 'snNumber',
};
export default class VehicleOther extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  setPageReference = page => {
    this.page = page && page.getWrappedInstance();
  };

  initialize = ({
    carNumber,
    brand,
    model,
    carType,
    ownerType,
    ownerCompanyId,
    ownerCompanyName,
    load,
    byDate,
    produceDate,
    cardType,
    startDate,
    validDate,
    locationCardId,
    carPhotoList,
    driver,
    driverTel,
    driverPhotoList,
    supercargo,
    supercargoTel,
    supercargoPhotoList,
    grantList,
    snNumber,
    labelId,
  }) => ({
    carNumber: carNumber || undefined,
    brand: brand || undefined,
    model: model || undefined,
    carType: isNumber(carType) ? `${carType}` : undefined,
    ownerType: isNumber(ownerType) ? `${ownerType}` : undefined,
    ownerCompany: ownerCompanyId ? { key: ownerCompanyId, label: ownerCompanyName } : undefined,
    snNumber: labelId ? { key: labelId, label: snNumber } : undefined,
    load: load || undefined,
    byDate: byDate ? moment(byDate) : undefined,
    produceDate: produceDate ? moment(produceDate) : undefined,
    cardType: isNumber(cardType) ? `${cardType}` : undefined,
    startDate: startDate ? moment(startDate) : undefined,
    validDate: validDate ? moment(validDate) : undefined,
    locationCardId: locationCardId || undefined,
    carPhotoList: carPhotoList || [],
    driver: driver || undefined,
    driverTel: driverTel || undefined,
    driverPhotoList: driverPhotoList || [],
    supercargo: supercargo || undefined,
    supercargoTel: supercargoTel || undefined,
    supercargoPhotoList: supercargoPhotoList || [],
    grantList: grantList
      ? grantList.map(({ parkId, grantState, gateGrantList }) => ({
          id: `${parkId}`,
          type: `${grantState}`,
          children: gateGrantList
            ? gateGrantList.map(({ gateId, gateIdNew }) => ({ id: gateIdNew, gateId }))
            : [],
        }))
      : [],
  });

  transform = ({
    unitId,
    ownerCompany,
    byDate,
    produceDate,
    startDate,
    validDate,
    grantList,
    snNumber,
    ...payload
  }) => {
    return {
      companyId: unitId,
      ownerCompanyId: ownerCompany && ownerCompany.key,
      byDate: byDate && byDate.format(DEFAULT_FORMAT),
      produceDate: produceDate && produceDate.format(DEFAULT_FORMAT),
      startDate: startDate && startDate.format(DEFAULT_FORMAT),
      validDate: validDate && validDate.format(DEFAULT_FORMAT),
      snNumber: snNumber ? snNumber.label : undefined,
      grantList:
        grantList &&
        grantList.map(({ id, type, children }) => ({
          parkId: id,
          grantState: type,
          gateGrantList: children
            ? children.map(({ id, gateId }) => ({ gateIdNew: id, gateId }))
            : [],
        })),
      ...payload,
    };
  };

  getBreadcrumbList = ({ isUnit, title }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && {
          title: '单位车辆信息',
          name: '单位车辆信息',
          href: this.props.route.path.replace(/:unitId.*/, 'list'),
        },
        {
          title: '车辆信息',
          name: '车辆信息',
          href: this.props.location.pathname.replace(
            new RegExp(`${this.props.route.name}.*`),
            'list'
          ),
        },
        { title, name: title },
      ].filter(v => v)
    );

  getFields = ({ unitId, ownerType, cardType, startDate, isDetail }) => [
    {
      key: '车辆基本信息',
      title: '车辆基本信息',
      fields: [
        {
          id: 'carNumber',
          label: '车牌号',
          required: true,
          component: 'Input',
          span: SPAN,
          options: {
            rules: [
              { required: true, whitespace: true, message: '车牌号不能为空' },
              {
                pattern: /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/,
                message: '车牌号格式不正确',
              },
            ],
          },
        },
        {
          id: 'brand',
          label: '品牌',
          component: 'Input',
          span: SPAN,
        },
        {
          id: 'model',
          label: '型号',
          component: 'Input',
          span: SPAN,
        },
        {
          id: 'carType',
          label: '车辆类型',
          required: true,
          component: 'Select',
          span: SPAN,
          props: {
            list: VEHICLE_TYPES,
          },
        },
        {
          id: 'ownerType',
          label: '所属单位',
          required: true,
          refreshEnable: true,
          component: 'Select',
          span: SPAN,
          props: {
            list: TYPES,
          },
        },
        ...(ownerType === TYPES[1].key
          ? [
              {
                id: 'ownerCompany',
                label: '单位名称',
                required: true,
                component: AsyncSelect,
                span: SPAN,
                props: {
                  mapper: MAPPER2,
                  fieldNames: FIELDNAMES,
                  placeholder: '请选择单位名称',
                  params: {
                    companyId: unitId,
                  },
                },
                options: {
                  rules: [
                    {
                      type: 'object',
                      required: true,
                      message: '单位名称不能为空',
                    },
                  ],
                },
              },
            ]
          : []),
        {
          id: 'load',
          label: '载重（吨）',
          component: 'Input',
          span: SPAN,
          props: {
            type: 'InputNumber',
            min: 1,
          },
        },
        {
          id: 'byDate',
          label: '购买日期',
          component: 'DatePicker',
          span: SPAN,
          props: {
            unknown: '',
          },
        },
        {
          id: 'produceDate',
          label: '生产日期',
          component: 'DatePicker',
          span: SPAN,
          props: {
            unknown: '',
          },
        },
        {
          id: 'cardType',
          label: '车牌有效期',
          required: true,
          refreshEnable: true,
          component: 'Select',
          span: SPAN,
          props: {
            list: LICENCE_PLATE_TYPES,
          },
        },
        ...(cardType === LICENCE_PLATE_TYPES[1].key
          ? [
              {
                id: 'startDate',
                label: '生效日期',
                required: true,
                refreshEnable: true,
                component: 'DatePicker',
                span: SPAN,
                props: {
                  disabledDate: current => +current - moment().startOf('day') < 0,
                  unknown: '',
                  onChange: this.handleChange,
                },
              },
              {
                id: 'validDate',
                label: '截止日期',
                required: true,
                component: 'DatePicker',
                span: SPAN,
                props: {
                  disabledDate: current => +current - (startDate || moment()).startOf('day') < 0,
                  unknown: '',
                },
              },
            ]
          : []),
        {
          id: 'snNumber',
          label: '定位卡号',
          component: AsyncSelect,
          props: {
            mapper: MAPPER3,
            fieldNames: FIELDNAMES2,
            placeholder: '请选择定位卡号',
            params: {
              companyId: unitId,
              status: 1,
              personCar: 0,
            },
          },
          span: SPAN,
        },
        {
          id: 'carPhotoList',
          label: '车辆照片',
          component: 'CustomUpload',
          props: {
            types: ['JPG', 'PNG'],
          },
        },
      ],
    },
    {
      key: '人员信息',
      fields: [
        {
          id: 'driver',
          label: '驾驶员',
          required: true,
          component: 'Input',
          span: SPAN,
        },
        {
          id: 'driverTel',
          label: '联系电话',
          required: true,
          component: 'Input',
          span: SPAN2,
          props: {
            className: styles.phoneInput,
          },
        },
        {
          id: 'driverPhotoList',
          label: '证照附件',
          component: 'CustomUpload',
        },
        {
          id: 'supercargo',
          label: '押运员',
          component: 'Input',
          span: SPAN,
        },
        {
          id: 'supercargoTel',
          label: '联系电话',
          component: 'Input',
          span: SPAN2,
          props: {
            className: styles.phoneInput,
          },
        },
        {
          id: 'supercargoPhotoList',
          label: '证照附件',
          component: 'CustomUpload',
        },
      ],
    },
    {
      key: '车场通道授权',
      title: isDetail ? (
        <Fragment>
          <span style={{ marginRight: 8 }}>车场通道授权</span>
          <Tooltip
            placement="bottom"
            title="选中车场会将车辆信息同步至车场，全部通道表示该车可以在选中车场的全部通道口进出；部分通道表示只能在选择的通道进出，未选通道不得进出。"
          >
            <Icon style={{ color: '#f5222d', verticalAlign: 'baseline' }} type="question-circle" />
          </Tooltip>
        </Fragment>
      ) : (
        undefined
      ),
      fields: [
        {
          id: 'grantList',
          label: !isDetail ? (
            <Fragment>
              <span style={{ marginRight: 8 }}>车场通道授权</span>
              <Tooltip
                placement="bottom"
                title="选中车场会将车辆信息同步至车场，全部通道表示该车可以在选中车场的全部通道口进出；部分通道表示只能在选择的通道进出，未选通道不得进出。"
              >
                <Icon
                  style={{ color: '#f5222d', verticalAlign: 'baseline' }}
                  type="question-circle"
                />
              </Tooltip>
            </Fragment>
          ) : (
            undefined
          ),
          required: true,
          component: ChannelAuthorization,
          props: {
            unitId,
          },
          options: {
            rules: [{ required: true, type: 'array', min: 1, message: '车场通道授权不能为空' }],
          },
        },
      ],
    },
  ];

  handleChange = value => {
    const { getFieldValue, setFieldsValue } = this.page && this.page.form && this.page.form;
    const validDate = getFieldValue('validDate');
    if (+validDate - value.startOf(moment) < 0) {
      setFieldsValue({
        validDate: undefined,
      });
    }
  };

  render() {
    const {
      route,
      location,
      match,
      match: {
        params: { id },
      },
    } = this.props;
    console.log('1221', this.transform);
    const props = {
      key: id,
      breadcrumbList: this.getBreadcrumbList,
      fields: this.getFields,
      initialize: this.initialize,
      transform: this.transform,
      mapper: MAPPER,
      layout: 'vertical',
      error: 1,
      ref: this.setPageReference,
      route,
      location,
      match,
    };

    return <ThreeInOnePage {...props} />;
  }
}
