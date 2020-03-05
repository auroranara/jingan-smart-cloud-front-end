import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import { TYPEDICT, JUDGEDICT, COERCIONDEGREEDICT, RESULTDICT } from '../List';
import moment from 'moment';
// import styles from './index.less';

export default class OperationRecordOther extends Component {
  initialize = ({
    companyId,
    companyName,
    code,
    classify,
    coerciveProcedure,
    organization,
    releaseDate,
    commissionDate,
    regulations,
    abolishDate,
    identifyDate,
    digest,
    correspondingActivities,
    result,
    remark,
    accessoryDetails,
    name,
  }) => ({
    company: companyId ? { key: companyId, label: companyName } : undefined,
    name: name || undefined,
    code: code || undefined,
    classify: classify || undefined,
    coerciveProcedure: coerciveProcedure || undefined,
    organization: organization || undefined,
    releaseDate: releaseDate ? moment(releaseDate) : undefined,
    commissionDate: commissionDate ? moment(commissionDate) : undefined,
    regulations: regulations || undefined,
    abolishDate: abolishDate ? moment(abolishDate) : undefined,
    identifyDate: identifyDate ? moment(identifyDate) : undefined,
    digest: digest || undefined,
    correspondingActivities: correspondingActivities || undefined,
    result: result || undefined,
    remark: remark || undefined,
    accessoryDetails: accessoryDetails || undefined,
  });

  transform = ({ unitId, company, publishDate, enforceDate, ...rest }) => ({
    companyId: unitId || company.key,
    // publishDate: publishDate && publishDate.format(DEFAULT_FORMAT),
    // enforceDate: enforceDate && enforceDate.format(DEFAULT_FORMAT),
    // publishDate: +publishDate,
    // enforceDate: +enforceDate,
    ...rest,
  });

  getFields = ({ unitId, regulations }) => [
    ...(!unitId
      ? [
        {
          id: 'company',
          label: '单位名称',
          required: true,
          component: 'CompanySelect',
        },
      ]
      : []),
    {
      id: 'name',
      label: '文件名称',
      required: true,
      component: 'Input',
    },
    {
      id: 'code',
      label: '法规编号',
      required: true,
      component: 'Input',
    },
    {
      id: 'classify',
      label: '分类',
      required: true,
      component: 'Select',
      props: {
        list: TYPEDICT,
      },
    },
    {
      id: 'coerciveProcedure',
      label: '强制程度',
      required: true,
      component: 'Select',
      props: {
        list: COERCIONDEGREEDICT,
      },
    },
    {
      id: 'organization',
      label: '发布机构',
      required: true,
      component: 'Input',
    },
    {
      id: 'releaseDate',
      label: '发布日期',
      required: true,
      component: 'DatePicker',
    },
    {
      id: 'commissionDate',
      label: '启用日期',
      required: true,
      component: 'DatePicker',
    },
    {
      id: 'regulations',
      label: '现行法规',
      required: true,
      component: 'Select',
      props: {
        list: JUDGEDICT,
      },
      refreshEnable: true,
    },
    ...(+regulations === 0 ? [{
      id: 'abolishDate',
      label: '废止日期',
      required: true,
      component: 'DatePicker',
    }] : []),
    {
      id: 'identifyDate',
      label: '辨识日期',
      required: true,
      component: 'DatePicker',
    },
    {
      id: 'digest',
      label: '摘要',
      required: true,
      component: 'TextArea',
    },
    {
      id: 'correspondingActivities',
      label: '对应活动',
      component: 'TextArea',
    },
    {
      id: 'result',
      label: '评价结果',
      required: true,
      component: 'Radio',
      props: {
        list: RESULTDICT,
      },
    },
    {
      id: 'remark',
      label: '备注',
      component: 'TextArea',
    },
    {
      id: 'accessoryDetails',
      label: '附件',
      component: 'CustomUpload',
    },
  ];

  render () {
    const props = {
      initialize: this.initialize,
      transform: this.transform,
      fields: this.getFields,
      ...this.props,
    };

    return <ThreeInOnePage {...props} />;
  }
}
