import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
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

export default class VehicleOther extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  initialize = ({
    品牌,
    型号,
    当前状态,
    押运员,
    押运员联系电话,
    生产日期,
    购买日期,
    车牌号,
    车牌类型,
    车辆类型,
    载重,
    驾驶员,
    驾驶员联系电话,
    车辆照片,
  }) => ({
    品牌: 品牌 || undefined,
    型号: 型号 || undefined,
    当前状态: isNumber(当前状态) ? `${当前状态}` : undefined,
    押运员: 押运员 || undefined,
    押运员联系电话: 押运员联系电话 || undefined,
    生产日期: 生产日期 ? moment(生产日期) : undefined,
    购买日期: 购买日期 ? moment(购买日期) : undefined,
    车牌号: 车牌号 || undefined,
    车牌类型: isNumber(车牌类型) ? `${车牌类型}` : undefined,
    车辆类型: isNumber(车辆类型) ? `${车辆类型}` : undefined,
    载重: 载重 ? +载重 : undefined,
    驾驶员: 驾驶员 || undefined,
    驾驶员联系电话: 驾驶员联系电话 || undefined,
    车辆照片: 车辆照片 || [],
  });

  transform = ({ unitId, 生产日期, 购买日期, ...payload }) => {
    return {
      unitId, // 这里接接口的时候重点关注一下
      生产日期: 生产日期 && 生产日期.format('YYYY-MM-DD'),
      购买日期: 购买日期 && 购买日期.format('YYYY-MM-DD'),
      ...payload,
    };
  };

  getBreadcrumbList = ({ isUnit, unitId, title }) =>
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

  getFields = () => [
    {
      key: '车辆基本信息',
      title: '车辆基本信息',
      fields: [
        {
          id: '车牌号',
          label: '车牌号',
          required: true,
          component: 'Input',
          span: SPAN,
        },
        {
          id: '品牌',
          label: '品牌',
          component: 'Input',
          span: SPAN,
        },
        {
          id: '型号',
          label: '型号',
          component: 'Input',
          span: SPAN,
        },
        {
          id: '车辆类型',
          label: '车辆类型',
          required: true,
          component: 'Select',
          span: SPAN,
          props: {
            list: VEHICLE_TYPES,
          },
        },
        {
          id: '车牌类型',
          label: '车牌类型',
          required: true,
          component: 'Select',
          span: SPAN,
          props: {
            list: LICENCE_PLATE_TYPES,
          },
        },
        {
          id: '生产日期',
          label: '生产日期',
          component: 'DatePicker',
          span: SPAN,
        },
        {
          id: '载重',
          label: '载重',
          component: 'Input',
          span: SPAN,
          props: {
            type: 'InputNumber',
            min: 1,
          },
        },
        {
          id: '购买日期',
          label: '购买日期',
          component: 'DatePicker',
          span: SPAN,
        },
        {
          id: '当前状态',
          label: '当前状态',
          required: true,
          component: 'Switch',
          span: SPAN,
          props: {
            list: STATUSES,
          },
          options: {
            initialValue: STATUSES[0].key,
          },
        },
        {
          id: '车辆照片',
          label: '车辆照片',
          component: 'CustomUpload',
          props: {
            length: 1,
            types: ['JPG', 'PNG'],
          },
        },
      ],
    },
    {
      key: '人员信息',
      title: '人员信息',
      fields: [
        {
          id: '驾驶员',
          label: '驾驶员',
          required: true,
          component: 'Input',
          span: SPAN,
        },
        {
          id: '驾驶员联系电话',
          label: '联系电话',
          required: true,
          component: 'Input',
          span: SPAN2,
          props: {
            className: styles.phoneInput,
          },
        },
        {
          id: '押运员',
          label: '押运员',
          component: 'Input',
          span: SPAN,
        },
        {
          id: '押运员联系电话',
          label: '联系电话',
          component: 'Input',
          span: SPAN2,
          props: {
            className: styles.phoneInput,
          },
        },
      ],
    },
  ];

  render() {
    return (
      <ThreeInOnePage
        breadcrumbList={this.getBreadcrumbList}
        fields={this.getFields}
        initialize={this.initialize}
        transform={this.transform}
        mapper={MAPPER}
        layout="vertical"
        {...this.props}
      />
    );
  }
}