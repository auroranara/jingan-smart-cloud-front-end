import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import moment from 'moment';
import { DEFAULT_FORMAT, RESULTS } from '../List';
import styles from './index.less';

export default class OperationRecordOther extends Component {
  initialize = ({
    companyId,
    companyName,
    lawName,
    number,
    publishDate,
    enforceDate,
    publishUnit,
    content,
    activity,
    evaluatResult,
    note,
    otherFileList,
  }) => ({
    company: companyId ? { key: companyId, label: companyName } : undefined,
    lawName: lawName || undefined,
    number: number || undefined,
    publishDate: publishDate ? moment(publishDate) : undefined,
    enforceDate: enforceDate ? moment(enforceDate) : undefined,
    publishUnit: publishUnit || undefined,
    content: content || undefined,
    activity: activity || undefined,
    evaluatResult: evaluatResult ? `${evaluatResult}` : undefined,
    note: note || undefined,
    otherFileList: otherFileList || undefined,
  });

  transform = ({ unitId, company, publishDate, enforceDate, ...rest }) => ({
    companyId: unitId || company.key,
    // publishDate: publishDate && publishDate.format(DEFAULT_FORMAT),
    // enforceDate: enforceDate && enforceDate.format(DEFAULT_FORMAT),
    publishDate: +publishDate,
    enforceDate: +enforceDate,
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
      id: 'lawName',
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
      id: 'enforceDate',
      label: '实施日期',
      required: true,
      component: 'DatePicker',
    },
    {
      id: 'publishUnit',
      label: '发布机关',
      component: 'Input',
    },
    {
      id: 'content',
      label: '内容摘要',
      component: 'TextArea',
    },
    {
      id: 'activity',
      label: '对应活动',
      component: 'TextArea',
    },
    {
      id: 'evaluatResult',
      label: '评价结果',
      required: true,
      component: 'Radio',
      props: {
        list: RESULTS,
      },
    },
    {
      id: 'note',
      label: '备注',
      component: 'TextArea',
    },
    {
      id: 'otherFileList',
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
