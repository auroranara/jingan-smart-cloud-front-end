import React from 'react';
import FormPage from '@/jingan-components/Page/Form';
import moment from 'moment';
import { CATEGORIES, FORMAT } from '../config';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../../Contractor/config';
// import styles from './index.less';

const WarningSignForm = ({ route, match, location }) => {
  const props = {
    route,
    match,
    location,
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 12,
    },
    initialize({
      companyId,
      name,
      category,
      model,
      area,
      location,
      installDate,
      installNum,
      completionPeople,
      completionDate,
      remarks,
      signFileList,
    }) {
      return {
        companyId: companyId || undefined,
        name: name || undefined,
        category: category ? `${category}` : undefined,
        model: model || undefined,
        area: area || undefined,
        location: location || undefined,
        installDate: installDate ? moment(installDate) : undefined,
        installNum: installNum || undefined,
        completionPeople: completionPeople || undefined,
        completionDate: completionDate ? moment(completionDate) : undefined,
        remarks: remarks || undefined,
        signFileList: signFileList
          ? signFileList.map((item, index) => ({
              ...item,
              uid: -1 - index,
              status: 'done',
              name: item.fileName,
              url: item.webUrl,
              type: undefined, // 这个很关键
            }))
          : undefined,
      };
    },
    transform({
      isUnit,
      unitId,
      companyId,
      name,
      category,
      model,
      area,
      location,
      installDate,
      installNum,
      completionPeople,
      completionDate,
      remarks,
      signFileList,
    }) {
      return {
        companyId: isUnit ? unitId : companyId,
        name,
        category,
        model,
        area,
        location,
        installDate: installDate && installDate.format(FORMAT),
        installNum,
        completionPeople,
        completionDate: completionDate && completionDate.format(FORMAT),
        remarks,
        signFileList,
      };
    },
    fields: [
      {
        name: 'companyId',
        label: '单位名称',
        component: 'Select',
        props({ mode }) {
          return {
            fieldNames: COMPANY_FIELDNAMES,
            mapper: COMPANY_MAPPER,
            showSearch: true,
            filterOption: false,
            disabled: mode === 'edit',
          };
        },
        hide({ isUnit }) {
          return isUnit;
        },
        enableDefaultRules: true,
      },
      {
        name: 'name',
        label: '警示牌名称',
        component: 'Input',
        enableDefaultRules: true,
      },
      {
        name: 'category',
        label: '警示牌类别',
        component: 'Radio',
        props: {
          list: CATEGORIES,
        },
        enableDefaultRules: true,
      },
      {
        name: 'model',
        label: '规格型号',
        component: 'Input',
      },
      {
        name: 'area',
        label: '配备地点',
        component: 'Input',
      },
      {
        name: 'location',
        label: '具体位置',
        component: 'Input',
      },
      {
        name: 'installDate',
        label: '安装日期',
        component: 'DatePicker',
      },
      {
        name: 'installNum',
        label: '安装数量',
        component: 'InputNumber',
        props: {
          min: 1,
          precision: 0,
        },
      },
      {
        name: 'completionPeople',
        label: '填写人',
        component: 'Input',
      },
      {
        name: 'completionDate',
        label: '填写日期',
        component: 'DatePicker',
      },
      {
        name: 'remarks',
        label: '备注',
        component: 'Input',
      },
      {
        name: 'signFileList',
        label: '警示牌图片',
        component: 'Upload',
        props: {
          listType: 'picture-card',
          limitLength: 1,
          limitType: ['JPG', 'PNG'],
        },
      },
    ],
  };
  return <FormPage {...props} />;
};

export default WarningSignForm;
