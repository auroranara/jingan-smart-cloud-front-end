import React from 'react';
import FormPage from '@/jingan-components/Page/Form';
import { EmptyText } from '@/jingan-components/View';
import Standard from '../components/Standard';
import moment from 'moment';
import { RESULTS, FORMAT } from '../config';
import { isNumber } from '@/utils/utils';
// import styles from './index.less';

const Text = ({ score }) => (isNumber(score) ? <span>{score}</span> : <EmptyText />);

const ContractorForm = ({
  route,
  match,
  location,
  match: {
    params: { id },
  },
}) => {
  const props = {
    key: id,
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
      companyName,
      examTitle,
      examDate,
      examPart,
      examPartName,
      examedPart,
      examedPartName,
      writePerson,
      writePersonName,
      performanceExamList,
      examResult,
      fileList,
      note,
    }) {
      return {
        company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
        examTitle: examTitle || undefined,
        examDate: examDate ? moment(examDate) : undefined,
        examPart: examPart ? { key: examPart, value: examPart, label: examPartName } : undefined,
        examedPart: examedPart
          ? { key: examedPart, value: examedPart, label: examedPartName }
          : undefined,
        writePerson: writePerson ? { id: writePerson, userName: writePersonName } : undefined,
        normList: performanceExamList || [],
        examResult: isNumber(examResult) ? examResult : undefined,
        fileList: fileList
          ? fileList.map((item, index) => ({
              ...item,
              uid: -1 - index,
              status: 'done',
              name: item.fileName,
              url: item.webUrl,
            }))
          : undefined,
        note: note || undefined,
      };
    },
    transform({
      isUnit,
      unitId,
      company,
      examTitle,
      examDate,
      examPart,
      examedPart,
      writePerson,
      normList,
      examResult,
      fileList,
      note,
    }) {
      return {
        companyId: isUnit ? unitId : company && company.key,
        examTitle,
        examDate: examDate && examDate.format(FORMAT),
        examPart: examPart && examPart.key,
        examedPart: examedPart && examedPart.key,
        writePerson: writePerson && writePerson.id,
        normList:
          normList &&
          normList.reduce(
            (result, { id: performanceId, contentList }) =>
              result.concat(
                contentList
                  ? contentList.map(({ id: contentId, pointCase }) => ({
                      performanceId,
                      contentId,
                      pointCase,
                    }))
                  : []
              ),
            []
          ),
        examResult,
        fileList,
        note,
      };
    },
    fields: [
      {
        name: 'company',
        label: '单位名称',
        component: 'Select',
        props({ mode }) {
          return {
            preset: 'company',
            labelInValue: true,
            disabled: mode === 'edit',
          };
        },
        hide({ isUnit }) {
          return isUnit;
        },
        enableDefaultRules: true,
      },
      {
        name: 'examTitle',
        label: '考核标题',
        component: 'TextArea',
        props: {
          maxLength: 100,
        },
        enableDefaultRules: true,
      },
      {
        name: 'examDate',
        label: '考核日期',
        component: 'DatePicker',
        enableDefaultRules: true,
      },
      {
        name: 'examPart',
        label: '考核部门',
        component: 'TreeSelect',
        dependencies: ['company'],
        props({ isUnit, unitId, company }) {
          const companyId = isUnit ? unitId : company && company.key;
          return {
            preset: 'departmentTreeByCompany',
            params: {
              companyId,
            },
            labelInValue: true,
          };
        },
        enableDefaultRules: true,
      },
      {
        name: 'examedPart',
        label: '被考核部门',
        component: 'TreeSelect',
        dependencies: ['company'],
        props({ isUnit, unitId, company }) {
          const companyId = isUnit ? unitId : company && company.key;
          return {
            preset: 'departmentTreeByCompany',
            params: {
              companyId,
            },
            labelInValue: true,
          };
        },
        enableDefaultRules: true,
      },
      {
        name: 'writePerson',
        label: '填报人',
        component: 'SelectModalSelect',
        dependencies: ['company'],
        props({ isUnit, unitId, company }) {
          const companyId = isUnit ? unitId : company && company.key;
          return {
            preset: 'personListByCompany',
            title: '选择责任人',
            params: {
              companyId,
            },
          };
        },
        enableDefaultRules: true,
      },
      {
        name: 'normList',
        label: '考核标准',
        component: Standard,
        dependencies: ['company'],
        props({ isUnit, unitId, company }) {
          const companyId = isUnit ? unitId : company && company.key;
          return {
            params: {
              companyId,
            },
          };
        },
        wrapperCol: {
          span: 18,
        },
      },
      {
        name: 'totalScore',
        label: '总分（分）',
        component: Text,
        dependencies: ['normList'],
        props({ normList }) {
          const { hasScore, score } = (normList || []).reduce(
            (result, { passScore, contentList }) => {
              if (isNumber(passScore)) {
                result.hasScore = true;
              }
              result.score +=
                (passScore || 0) -
                Math.max(
                  Math.min(
                    (contentList || []).reduce(
                      (result, { pointCase }) => result + (+pointCase || 0),
                      0
                    ),
                    passScore || 0
                  ),
                  0
                );
              return result;
            },
            { hasScore: false, score: 0 }
          );
          return {
            score: hasScore && score,
          };
        },
      },
      {
        name: 'examResult',
        label: '考核结果',
        component: 'Radio',
        props: {
          list: RESULTS,
        },
        enableDefaultRules: true,
      },
      {
        name: 'fileList',
        label: '附件',
        component: 'Upload',
      },
      {
        name: 'note',
        label: '备注',
        component: 'TextArea',
        props: {
          maxLength: 100,
          allowClear: true,
        },
      },
    ],
  };
  return <FormPage {...props} />;
};

export default ContractorForm;
