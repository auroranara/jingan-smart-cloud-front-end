import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import moment from 'moment';
import { isNumber } from '@/utils/utils';
import {
  TYPES,
} from '../List';

export default class OperationRecordOther extends Component {
  initialize = ({
    companyId,
    companyName,
    equipType,
    operaDate,
    operaPerson,
    operaEvaluation,
    otherFile,
  }) => ({
    company: companyId ? { key: companyId, label: companyName } : undefined,
    equipType: isNumber(equipType) ? `${equipType}` : undefined,
    operaDate: operaDate ? moment(operaDate) : undefined,
    operaPerson: operaPerson || undefined,
    operaEvaluation: operaEvaluation || undefined,
    otherFile: otherFile || [],
  })

  transform = ({
    unitId,
    company,
    operaDate,
    otherFile,
    ...rest
  }) => ({
    companyId: unitId || company.key,
    operaDate: operaDate && +operaDate,
    otherFile: otherFile && otherFile.length ? JSON.stringify(otherFile) : undefined,
    ...rest,
  })

  render() {
    const fields = [
      {
        id: 'company',
        label: '单位名称',
        required: true,
        component: 'CompanySelect',
        hidden: ({ unitId }) => unitId,
      },
      {
        id: 'equipType',
        label: '设备设施类型',
        required: true,
        component: 'Select',
        props: {
          list: TYPES,
        },
      },
      {
        id: 'operaDate',
        label: '运维时间',
        required: true,
        component: 'DatePicker',
      },
      {
        id: 'operaPerson',
        label: '运维人员',
        required: true,
        component: 'Input',
      },
      {
        id: 'operaEvaluation',
        label: '运维评价',
        required: true,
        component: 'TextArea',
      },
      {
        id: 'otherFile',
        label: '附件',
        component: 'CustomUpload',
        refreshEnable: true,
      },
    ];

    return (
      <ThreeInOnePage
        initialize={this.initialize}
        transform={this.transform}
        fields={fields}
        {...this.props}
      />
    );
  }
}
