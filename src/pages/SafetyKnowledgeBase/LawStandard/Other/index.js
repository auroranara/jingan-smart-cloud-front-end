import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import moment from 'moment';
import { DEFAULT_FORMAT, RESULTS } from '../List';
import styles from './index.less';

export default class OperationRecordOther extends Component {
  initialize = ({
    companyId,
    companyName,
    name,
    number,
    publishDate,
    implementDate,
    organ,
    synopsis,
    activity,
    result,
    remark,
    attachment,
  }) => ({
    company: companyId ? { key: companyId, label: companyName } : undefined,
    name: name || undefined,
    number: number || undefined,
    publishDate: publishDate ? moment(publishDate) : undefined,
    implementDate: implementDate ? moment(implementDate) : undefined,
    organ: organ || undefined,
    synopsis: synopsis || undefined,
    activity: activity || undefined,
    result: result ? `${result}` : undefined,
    remark: remark || undefined,
    attachment: attachment || undefined,
  });

  transform = ({ unitId, company, publishDate, implementDate, ...rest }) => ({
    companyId: unitId || company.key,
    publishDate: publishDate && publishDate.format(DEFAULT_FORMAT),
    implementDate: implementDate && implementDate.format(DEFAULT_FORMAT),
    ...rest,
  });

  getFields = ({ unitId }) => [
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
      id: 'name',
      label: '法律法规标准名称',
      required: true,
      component: 'Input',
    },
    {
      id: 'number',
      label: '文号',
      required: true,
      component: 'Input',
    },
    {
      id: 'publishDate',
      label: '公布日期',
      required: true,
      component: 'DatePicker',
    },
    {
      id: 'implementDate',
      label: '实施日期',
      required: true,
      component: 'DatePicker',
    },
    {
      id: 'organ',
      label: '发布机关',
      required: true,
      component: 'Input',
    },
    {
      id: 'synopsis',
      label: '内容摘要',
      component: 'TextArea',
    },
    {
      id: 'activity',
      label: '对应活动',
      component: 'TextArea',
    },
    {
      id: 'result',
      label: '评价结果',
      required: true,
      component: 'Radio',
      props: {
        list: RESULTS,
      },
    },
    {
      id: 'remark',
      label: '备注',
      component: 'TextArea',
    },
    {
      id: 'attachment',
      label: '附件',
      component: 'CustomUpload',
    },
  ];

  render() {
    const props = {
      initialize: this.initialize,
      transform: this.transform,
      fields: this.getFields,
      ...this.props,
    };

    return <ThreeInOnePage {...props} />;
  }
}
