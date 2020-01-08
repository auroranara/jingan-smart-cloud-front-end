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
    unifiedCode,
    name,
    number,
    ability,
    length,
    material,
    method,
    isPress,
    pressLevel,
    press,
    status,
    medium,
    isRisk,
    time,
  }) => ({
    company: companyId ? { key: companyId, label: companyName } : undefined,
    unifiedCode: unifiedCode || undefined,
    name: name || undefined,
    number: number || undefined,
    ability: ability || undefined,
    length: length || undefined,
    material: material || undefined,
    method: method ? `${method}` : undefined,
    isPress: isPress ? `${isPress}` : undefined,
    pressLevel: pressLevel ? `${pressLevel}` : undefined,
    press: press || undefined,
    status: status ? `${status}` : undefined,
    medium: medium || undefined,
    isRisk: isRisk ? `${isRisk}` : undefined,
    time: time ? moment(time) : undefined,
  });

  transform = ({ unitId, company, medium, time, ...rest }) => ({
    companyId: unitId || company.key,
    mediumId: medium && medium.id,
    time: time && time.format('YYYY-MM-DD'),
    ...rest,
  });

  getFields = ({ unitId, company, isPress }) => [
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
      id: 'unifiedCode',
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
      id: 'ability',
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
      id: 'material',
      label: '管道材质',
      required: true,
      component: 'Input',
    },
    {
      id: 'method',
      label: '架设方式',
      required: true,
      component: 'Select',
      props: {
        list: METHODS,
      },
    },
    {
      id: 'isPress',
      label: '是否压力管道',
      required: true,
      component: 'Select',
      props: {
        list: CHOICES,
      },
      refreshEnable: true,
    },
    ...(+isPress
      ? [
          {
            id: 'pressLevel',
            label: '压力等级',
            required: true,
            component: 'Select',
            props: {
              list: LEVELS,
            },
          },
          {
            id: 'press',
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
      id: 'medium',
      label: '输送介质',
      required: true,
      component: MediumModal,
      props: {
        companyId: unitId || (company && company.key !== company.label ? company.key : undefined),
      },
      options: {
        rules: [{ required: true, type: 'object', message: '输送介质不能为空' }],
      },
    },
    {
      id: 'isRisk',
      label: '是否危化品管道',
      required: true,
      component: 'Select',
      props: {
        list: CHOICES,
      },
    },
    {
      id: 'time',
      label: '投产日期',
      required: true,
      component: 'DatePicker',
    },
  ];

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
