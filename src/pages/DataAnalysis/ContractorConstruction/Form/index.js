import React from 'react';
import FormPage from '@/jingan-components/Page/Form';
import moment from 'moment';
import { YES_OR_NO, CONTRACTOR_FIELDNAMES, CONTRACTOR_MAPPER, FORMAT } from '../config';
import { COMPANY_FIELDNAMES, COMPANY_MAPPER } from '../../Contractor/config';
import { phoneReg, idReg } from '@/utils/validate';
import { isNumber } from '@/utils/utils';
// import styles from './index.less';

const ContractorConstructionForm = ({ route, match, location }) => {
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
      contractorId,
      teamBusinessGrade,
      creditCode,
      businessLicenseCode,
      workCompanyDesc,
      teamManager,
      teamManagerPhone,
      teamManagerCard,
      safetyManager,
      safetyManagerPhone,
      safetyManagerCard,
      specialEquipmentLicense,
      signingDate,
      expireDate,
      enteringDate,
      planAssessDate,
      blacklistStatus,
    }) {
      return {
        companyId: companyId || undefined,
        contractorId: contractorId || undefined,
        teamBusinessGrade: teamBusinessGrade || undefined,
        creditCode: creditCode || undefined,
        businessLicenseCode: businessLicenseCode || undefined,
        workCompanyDesc: workCompanyDesc || undefined,
        teamManager: teamManager || undefined,
        teamManagerPhone: teamManagerPhone || undefined,
        teamManagerCard: teamManagerCard || undefined,
        safetyManager: safetyManager || undefined,
        safetyManagerPhone: safetyManagerPhone || undefined,
        safetyManagerCard: safetyManagerCard || undefined,
        specialEquipmentLicense: specialEquipmentLicense || undefined,
        signingDate: signingDate ? moment(signingDate) : undefined,
        expireDate: expireDate ? moment(expireDate) : undefined,
        enteringDate: enteringDate ? moment(enteringDate) : undefined,
        planAssessDate: planAssessDate ? moment(planAssessDate) : undefined,
        blacklistStatus: isNumber(blacklistStatus) ? `${blacklistStatus}` : undefined,
      };
    },
    transform({
      isUnit,
      unitId,
      companyId,
      contractorId,
      teamBusinessGrade,
      creditCode,
      businessLicenseCode,
      workCompanyDesc,
      teamManager,
      teamManagerPhone,
      teamManagerCard,
      safetyManager,
      safetyManagerPhone,
      safetyManagerCard,
      specialEquipmentLicense,
      signingDate,
      expireDate,
      enteringDate,
      planAssessDate,
      blacklistStatus,
    }) {
      return {
        companyId: isUnit ? unitId : companyId,
        contractorId,
        teamBusinessGrade,
        creditCode,
        businessLicenseCode,
        workCompanyDesc,
        teamManager,
        teamManagerPhone,
        teamManagerCard,
        safetyManager,
        safetyManagerPhone,
        safetyManagerCard,
        specialEquipmentLicense,
        signingDate: signingDate && signingDate.format(FORMAT),
        expireDate: expireDate && expireDate.format(FORMAT),
        enteringDate: enteringDate && enteringDate.format(FORMAT),
        planAssessDate: planAssessDate && planAssessDate.format(FORMAT),
        blacklistStatus,
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
        onChange() {
          return {
            contractorId: undefined,
          };
        },
        enableDefaultRules: true,
      },
      {
        name: 'contractorId',
        label: '所属承包商',
        component: 'Select',
        dependencies: ['companyId'],
        props({ mode, isUnit, unitId, companyId }) {
          const key = isUnit ? unitId : companyId;
          return {
            fieldNames: CONTRACTOR_FIELDNAMES,
            mapper: CONTRACTOR_MAPPER,
            showSearch: true,
            filterOption: false,
            params: {
              companyId: key,
            },
            disabled: mode === 'edit',
            key,
          };
        },
        hide({ isUnit, companyId }) {
          return !isUnit && !companyId;
        },
        enableDefaultRules: true,
      },
      {
        name: 'teamBusinessGrade',
        label: '施工队伍营业等级',
        component: 'Input',
      },
      {
        name: 'creditCode',
        label: '统一社会信用代码',
        component: 'Input',
      },
      {
        name: 'businessLicenseCode',
        label: '营业执照字号',
        component: 'Input',
      },
      {
        name: 'workCompanyDesc',
        label: '施工单位简介',
        component: 'TextArea',
      },
      {
        name: 'teamManager',
        label: '施工队伍负责人',
        component: 'Input',
      },
      {
        name: 'teamManagerPhone',
        label: '施工队伍负责人联系电话',
        component: 'Input',
        rules: [{ pattern: phoneReg, message: '施工队伍负责人联系电话格式不正确' }],
      },
      {
        name: 'teamManagerCard',
        label: '施工队伍负责人身份证',
        component: 'Input',
        rules: [{ pattern: idReg, message: '施工队伍负责人身份证格式不正确' }],
      },
      {
        name: 'safetyManager',
        label: '安全负责人',
        component: 'Input',
      },
      {
        name: 'safetyManagerPhone',
        label: '安全负责人联系电话',
        component: 'Input',
        rules: [{ pattern: phoneReg, message: '安全负责人联系电话格式不正确' }],
      },
      {
        name: 'safetyManagerCard',
        label: '安全负责人身份证',
        component: 'Input',
        rules: [{ pattern: idReg, message: '安全负责人身份证格式不正确' }],
      },
      {
        name: 'specialEquipmentLicense',
        label: '特种设备安装许可证',
        component: 'Input',
      },
      {
        name: 'signingDate',
        label: '责任书签订日期',
        component: 'DatePicker',
        enableDefaultRules: true,
      },
      {
        name: 'expireDate',
        label: '责任书到期日期',
        component: 'DatePicker',
        enableDefaultRules: true,
        dependencies: ['signingDate'],
        rules: [
          ({ getFieldValue }) => ({
            validator(rule, value) {
              const date = getFieldValue('signingDate');
              if (!value || !date || +value.startOf('day') >= +date.startOf('day')) {
                return Promise.resolve();
              }
              return Promise.reject('责任书到期日期必须晚于责任书签订日期');
            },
          }),
        ],
      },
      {
        name: 'enteringDate',
        label: '进场日期',
        component: 'DatePicker',
      },
      {
        name: 'planAssessDate',
        label: '计划考核日期',
        component: 'DatePicker',
      },
      {
        name: 'blacklistStatus',
        label: '是否在黑名单',
        component: 'Radio',
        props: {
          list: YES_OR_NO,
        },
        enableDefaultRules: true,
      },
    ],
  };
  return <FormPage {...props} />;
};

export default ContractorConstructionForm;
