import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import MediumModal from '../components/MediumModal';
import moment from 'moment';
import { CHOICES, STATUSES } from '../List';
import styles from './index.less';

const METHODS = [{ key: '1', value: '埋地' }, { key: '2', value: '架空' }];
const LEVELS = [
  { key: '1', value: '低压' },
  { key: '2', value: '中压' },
  { key: '3', value: '高压' },
  { key: '4', value: '超高压' },
];

export default class OperationRecordOther extends Component {
  setPageReference = page => {
    this.page = page && page.getWrappedInstance();
  };

  initialize = ({
    companyId,
    companyName,
    code,
    name,
    number,
    transport,
    length,
    texture,
    setUp,
    pressure,
    pressureClass,
    designPressure,
    status,
    material,
    dangerPipeline,
    productDate,
    chineName,
  }) => ({
    company: companyId ? { key: companyId, label: companyName } : undefined,
    code: code || undefined,
    name: name || undefined,
    number: number || undefined,
    transport: transport || undefined,
    length: length || undefined,
    texture: texture || undefined,
    setUp: setUp ? `${setUp}` : undefined,
    pressure: pressure ? `${pressure}` : undefined,
    pressureClass: pressureClass ? `${pressureClass}` : undefined,
    designPressure: designPressure || undefined,
    status: status ? `${status}` : undefined,
    material: material ? { id: material, chineName } : undefined,
    dangerPipeline: dangerPipeline ? `${dangerPipeline}` : undefined,
    productDate: productDate ? moment(productDate) : undefined,
  });

  transform = ({ unitId, company, material, productDate, ...rest }) => ({
    companyId: unitId || company.key,
    material: material && material.id,
    productDate: productDate && productDate.format('YYYY-MM-DD'),
    ...rest,
  });

  getFields = ({ unitId, company, pressure }) => [
    ...(!unitId
      ? [
          {
            id: 'company',
            label: '单位名称',
            required: true,
            component: 'CompanySelect',
            refreshEnable: true,
          },
        ]
      : []),
    {
      id: 'code',
      label: '统一编码',
      required: true,
      component: 'Input',
    },
    {
      id: 'name',
      label: '管道名称',
      required: true,
      component: 'Input',
    },
    {
      id: 'number',
      label: '管道编号',
      required: true,
      component: 'Input',
    },
    {
      id: 'transport',
      label: '输送能力',
      required: true,
      component: 'Input',
    },
    {
      id: 'length',
      label: '总长度（m）',
      required: true,
      component: 'Input',
    },
    {
      id: 'texture',
      label: '管道材质',
      required: true,
      component: 'Input',
    },
    {
      id: 'setUp',
      label: '架设方式',
      required: true,
      component: 'Select',
      props: {
        list: METHODS,
      },
    },
    {
      id: 'pressure',
      label: '是否压力管道',
      required: true,
      component: 'Select',
      props: {
        list: CHOICES,
      },
      refreshEnable: true,
    },
    ...(+pressure
      ? [
          {
            id: 'pressureClass',
            label: '压力等级',
            required: true,
            component: 'Select',
            props: {
              list: LEVELS,
            },
          },
          {
            id: 'designPressure',
            label: '设计压力（KPa）',
            required: true,
            component: 'Input',
          },
        ]
      : []),
    {
      id: 'status',
      label: '目前状态',
      required: true,
      component: 'Select',
      props: {
        list: STATUSES,
      },
    },
    {
      id: 'material',
      label: '输送介质',
      required: true,
      component: MediumModal,
      props: {
        companyId: unitId || (company && company.key !== company.label ? company.key : undefined),
        onChange: this.handleMeterialChange,
      },
      options: {
        rules: [{ required: true, type: 'object', message: '输送介质不能为空' }],
      },
    },
    {
      id: 'dangerPipeline',
      label: '是否危化品管道',
      required: true,
      component: 'Select',
      props: {
        list: CHOICES,
      },
    },
    {
      id: 'productDate',
      label: '投产日期',
      required: true,
      component: 'DatePicker',
    },
  ];

  handleMeterialChange = material => {
    if (material) {
      const { form } = this.page || {};
      form &&
        form.setFieldsValue({
          dangerPipeline: `${material.superviseChemicals || 0}`,
        });
    }
  };

  render() {
    const props = {
      initialize: this.initialize,
      transform: this.transform,
      fields: this.getFields,
      ref: this.setPageReference,
      ...this.props,
    };

    return <ThreeInOnePage {...props} />;
  }
}
