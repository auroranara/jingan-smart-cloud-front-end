import React, { Component } from 'react';
import { message, Spin, Card, Row, Col, Form, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Upload from '@/jingan-components/Form/Upload';
import Select from '@/jingan-components/Form/Select';
import Input from '@/jingan-components/Form/Input';
import TextArea from '@/jingan-components/Form/TextArea';
import DatePicker from '@/jingan-components/Form/DatePicker';
import RangePicker from '@/jingan-components/Form/RangePicker';
import TreeSelect from '@/jingan-components/Form/TreeSelect';
import SafetyMeasure from './components/SafetyMeasure';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  NAMESPACE,
  DETAIL_API,
  ADD_API,
  EDIT_API,
  REAPPLY_API,
  SAVE_API,
  EDIT_CODE,
  BREADCRUMB_LIST_PREFIX,
  GUTTER,
  DAY_FORMAT,
  MINUTE_FORMAT,
  TYPES,
  HOT_WORK_TYPES,
  HIGH_WORK_TYPES,
  HOISTING_WORK_TYPES,
  BLIND_PLATE_WORK_TYPES,
  UNIT_TYPES,
  WORKING_STATUSES,
  PLAN_TYPES,
  TYPE_MAP_SAFETY_MEASURES,
  COMPANY_LIST_MAPPER,
  COMPANY_LIST_FIELDNAMES,
  DEPARTMENT_LIST_MAPPER,
  DEPARTMENT_LIST_FIELDNAMES,
  PERSON_MAPPER,
  PERSON_FILEDNAMES,
  APPROVE_STATUSES,
} from '../config';
import styles from './index.less';

@connect(
  ({
    user: {
      currentUser: { unitType, unitId, unitName, permissionCodes },
    },
    [NAMESPACE]: { detail },
    loading: {
      effects: {
        [DETAIL_API]: loading,
        [ADD_API]: adding,
        [EDIT_API]: editing,
        [REAPPLY_API]: reapplying,
      },
    },
  }) => ({
    isUnit: unitType === 4,
    unitId,
    unitName,
    detail,
    loading,
    submitting: adding || editing || reapplying,
    hasEditAuthority: permissionCodes.includes(EDIT_CODE),
  }),
  null,
  (
    stateProps,
    { dispatch },
    {
      match: {
        params: { id, type: t },
      },
      route: { path, name },
      location: { pathname },
    }
  ) => {
    const title = {
      detail: '作业票详情',
      add: '新增作业票',
      edit: '编辑作业票',
      reapply: '重新申请作业票',
    }[name];
    const goBack = () => {
      router.push(pathname.replace(new RegExp(`${name}.*`), 'list'));
    };
    const type = TYPES.find(({ key }) => key === t) ? t : TYPES[0].key;
    return {
      ...stateProps,
      type,
      mode: name,
      breadcrumbList: BREADCRUMB_LIST_PREFIX.concat([
        {
          title: '作业票管理',
          name: '作业票管理',
          href: path.replace(/:type\?.*/, 'list'),
        },
        {
          title,
          name: title,
        },
      ]),
      getDetail(payload, callback) {
        if (id) {
          dispatch({
            type: DETAIL_API,
            payload: {
              id,
            },
            callback: (success, data) => {
              if (!success) {
                message.error('获取列表数据失败，请稍后重试！');
              }
              callback && callback(success, data);
            },
          });
        } else {
          dispatch({
            type: SAVE_API,
            payload: {
              detail: {},
            },
          });
          setTimeout(callback);
        }
      },
      add(payload, callback) {
        dispatch({
          type: ADD_API,
          payload,
          callback: (success, data) => {
            if (success) {
              message.success('新增成功！');
              goBack();
            } else {
              message.error(`新增失败，${data}！`);
            }
            callback && callback(success, data);
          },
        });
      },
      edit(payload, callback) {
        dispatch({
          type: EDIT_API,
          payload: {
            id,
            ...payload,
          },
          callback: (success, data) => {
            if (success) {
              message.success('编辑成功！');
              goBack();
            } else {
              message.error(`编辑失败，${data}！`);
            }
            callback && callback(success, data);
          },
        });
      },
      reapply(payload, callback) {
        dispatch({
          type: REAPPLY_API,
          payload: {
            overId: id,
            ...payload,
          },
          callback: (success, data) => {
            if (success) {
              message.success('重新申请成功！');
              goBack();
            } else {
              message.error(`重新申请失败，${data}！`);
            }
            callback && callback(success, data);
          },
        });
      },
      goBack,
      goToEdit() {
        router.push(pathname.replace(`${name}`, 'edit'));
      },
    };
  }
)
@Form.create()
export default class WorkingBillOther extends Component {
  componentDidMount() {
    const { getDetail } = this.props;
    getDetail({}, () => {
      setTimeout(() => {
        this.forceUpdate();
      });
    });
  }

  validateSafetyMeasure = (rule, value, callback) => {
    if (
      !value ||
      !value.length ||
      value.every(item => Object.values(item).every(v => (v ? !v.trim() : true)))
    ) {
      callback('安全措施不能为空');
    } else if (value.every(({ confirmer }) => (confirmer ? !confirmer.trim() : true))) {
      callback('安全措施确认人不能为空');
    } else {
      callback();
    }
  };

  handleSubmit = () => {
    const {
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const { unitId, mode, [mode]: submit } = this.props;
        const {
          company,
          applyDate,
          range: [workingStartDate, workingEndDate] = [],
          workingPersonnel,
          finishDate,
          safetyMeasures,
          recoveryDate,
          ...fields
        } = values;
        const payload = {
          ...fields,
          companyId: company ? company.key : unitId,
          applyDate: applyDate && applyDate.format(`YYYY/MM/DD`),
          workingStartDate: workingStartDate && workingStartDate.format(`YYYY/MM/DD HH:mm:00`),
          workingEndDate: workingEndDate && workingEndDate.format(`YYYY/MM/DD HH:mm:00`),
          workingPersonnel: workingPersonnel && workingPersonnel.join(','),
          finishDate: finishDate && finishDate.format(`YYYY/MM/DD HH:mm:00`),
          recoveryDate: recoveryDate && recoveryDate.format(`YYYY/MM/DD HH:mm:00`),
          safetyMeasures: safetyMeasures && JSON.stringify(safetyMeasures),
        };
        submit(payload);
      }
    });
  };

  handleCompanySelect = (
    _,
    {
      props: {
        data: { name },
      },
    }
  ) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    if (name) {
      setFieldsValue({
        applyCompanyName: name,
      });
    }
  };

  handlePersonSelect = (
    _,
    {
      props: {
        data: { departmentId },
      },
    }
  ) => {
    const {
      form: { setFieldsValue },
    } = this.props;
    setFieldsValue({
      applyDepartmentId: departmentId || undefined,
    });
  };

  getWorkingPersonnelFromEvent = value => {
    return value && value.filter(v => v.trim());
  };

  render() {
    const {
      isUnit,
      unitId,
      unitName,
      type,
      breadcrumbList,
      mode,
      detail = {},
      loading = false,
      submitting = false,
      hasEditAuthority,
      goBack,
      goToEdit,
      form: { getFieldDecorator, getFieldsValue },
    } = this.props;
    const isNotDetail = mode !== 'detail';
    const values = getFieldsValue();
    const uploading =
      (values.certificatesFileList || []).some(({ status }) => status !== 'done') ||
      (values.applyFileList || []).some(({ status }) => status !== 'done') ||
      (values.locationFileList || []).some(({ status }) => status !== 'done');
    const fields = [
      {
        key: '作业票信息',
        title: '作业票信息',
        fields: [
          ...(isUnit
            ? []
            : [
                {
                  key: 'company',
                  label: '单位名称',
                  component: (
                    <Select
                      async
                      mapper={COMPANY_LIST_MAPPER}
                      fieldNames={COMPANY_LIST_FIELDNAMES}
                      disabled={mode !== 'add'}
                      mode={mode}
                      onSelect={this.handleCompanySelect}
                    />
                  ),
                  options: {
                    initialValue: detail.company,
                    rules: [{ type: 'object', required: true, message: '单位名称不能为空' }],
                  },
                },
              ]),
          {
            key: 'billType',
            label: '作业证名称',
            component: <Select list={TYPES} disabled={mode !== 'add'} mode={mode} />,
            options: {
              initialValue: detail.billType || type,
              rules: [{ required: true, message: '作业证名称不能为空' }],
            },
          },
          ...([TYPES[6].key].includes(values.billType)
            ? [
                {
                  key: 'billLevel',
                  label: '盲板作业类型',
                  component: <Select list={BLIND_PLATE_WORK_TYPES} mode={mode} />,
                  options: {
                    initialValue: detail.billLevel,
                    rules: [{ required: true, message: '盲板作业类型不能为空' }],
                  },
                },
              ]
            : []),
          ...(isUnit || (values.company && values.company.key)
            ? [
                {
                  key: 'applyUserId',
                  label: '申请人',
                  component: (
                    <Select
                      key={isUnit ? unitId : values.company.key}
                      showSearch
                      params={{ unitId: isUnit ? unitId : values.company.key }}
                      mapper={PERSON_MAPPER}
                      fieldNames={PERSON_FILEDNAMES}
                      mode={mode}
                      onSelect={this.handlePersonSelect}
                    />
                  ),
                  options: {
                    initialValue: detail.applyUserId,
                    rules: [{ required: true, message: '申请人不能为空' }],
                  },
                },
              ]
            : []),
          ...([
            TYPES[2].key,
            TYPES[3].key,
            TYPES[4].key,
            TYPES[5].key,
            TYPES[6].key,
            TYPES[7].key,
            TYPES[8].key,
          ].includes(values.billType)
            ? [
                {
                  key: 'applyCompanyName',
                  label: '申请单位',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.applyCompanyName || (isUnit ? unitName : undefined),
                    rules: [{ required: true, message: '申请单位不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...(isUnit || (values.company && values.company.key)
            ? [
                {
                  key: 'applyDepartmentId',
                  label: '申请部门',
                  component: (
                    <TreeSelect
                      key={isUnit ? unitId : values.company.key}
                      params={{ companyId: isUnit ? unitId : values.company.key }}
                      mapper={DEPARTMENT_LIST_MAPPER}
                      fieldNames={DEPARTMENT_LIST_FIELDNAMES}
                      mode={mode}
                    />
                  ),
                  options: {
                    initialValue: detail.applyDepartmentId,
                    rules: [{ required: true, message: '申请部门不能为空' }],
                  },
                },
              ]
            : []),
          {
            key: 'applyDate',
            label: '申请日期',
            component: <DatePicker format={DAY_FORMAT} mode={mode} />,
            options: {
              initialValue: detail.applyDate || moment(),
              rules: [{ type: 'object', required: true, message: '申请日期不能为空' }],
            },
          },
          ...([TYPES[6].key].includes(values.billType)
            ? [
                {
                  key: 'range',
                  label: '作业期限',
                  component: <RangePicker format={MINUTE_FORMAT} mode={mode} />,
                  options: {
                    initialValue: detail.range,
                    rules: [{ type: 'array', len: 2, required: true, message: '作业期限不能为空' }],
                  },
                },
              ]
            : []),
          ...([TYPES[2].key].includes(values.billType)
            ? [
                {
                  key: 'billLevel',
                  label: '作业证类型',
                  component: <Select list={HIGH_WORK_TYPES} mode={mode} />,
                  options: {
                    initialValue: detail.billLevel,
                    rules: [{ required: true, message: '作业证类型不能为空' }],
                  },
                },
              ]
            : []),
          ...([TYPES[3].key].includes(values.billType)
            ? [
                {
                  key: 'billLevel',
                  label: '作业证类型',
                  component: <Select list={HOISTING_WORK_TYPES} mode={mode} />,
                  options: {
                    initialValue: detail.billLevel,
                    rules: [{ required: true, message: '作业证类型不能为空' }],
                  },
                },
              ]
            : []),
          {
            key: 'billCode',
            label: '作业证编号',
            component: <Input mode={mode} />,
            options: {
              initialValue: mode !== 'reapply' ? detail.billCode : undefined,
              rules: [{ required: true, message: '作业证编号不能为空', whitespace: true }],
            },
          },
          ...([TYPES[6].key].includes(values.billType)
            ? [
                {
                  key: 'equipmentPipelineName',
                  label: '设备管线名称',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.equipmentPipelineName,
                    rules: [{ required: true, message: '设备管线名称不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[7].key].includes(values.billType)
            ? [
                {
                  key: 'location',
                  label: '断路作业地段',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.location,
                    rules: [{ required: true, message: '断路作业地段不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'address',
                  label: '断路作业地点',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.address,
                    rules: [{ required: true, message: '断路作业地点不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'workingContent',
                  label: '断路作业原因',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingContent,
                    rules: [{ required: true, message: '断路作业原因不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'agent',
                  label: '待办人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.agent,
                    rules: [{ required: true, message: '待办人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),

          ...([TYPES[8].key].includes(values.billType)
            ? [
                {
                  key: 'address',
                  label: '动土地点',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.address,
                    rules: [{ required: true, message: '动土地点不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'agent',
                  label: '待办人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.agent,
                    rules: [{ required: true, message: '待办人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[2].key].includes(values.billType)
            ? [
                {
                  key: 'height',
                  label: '作业高度（米）',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.height,
                    rules: [{ required: true, message: '作业高度不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[2].key].includes(values.billType)
            ? [
                {
                  key: 'address',
                  label: '作业地点',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.address,
                    rules: [{ required: true, message: '作业地点不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[3].key].includes(values.billType)
            ? [
                {
                  key: 'workingCompanyType',
                  label: '作业单位类型',
                  component: <Select list={UNIT_TYPES} mode={mode} />,
                  options: {
                    initialValue: detail.workingCompanyType,
                    rules: [{ required: true, message: '作业单位类型不能为空' }],
                  },
                },
                ...(values.workingCompanyType === UNIT_TYPES[1].key
                  ? [
                      {
                        key: 'workingCompanyName',
                        label: '作业单位名称',
                        component: <Input mode={mode} />,
                        options: {
                          initialValue: detail.workingCompanyName,
                          rules: [
                            {
                              required: true,
                              message: '作业单位名称不能为空',
                              whitespace: true,
                            },
                          ],
                        },
                      },
                    ]
                  : []),
                {
                  key: 'address',
                  label: '吊装地点',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.address,
                    rules: [{ required: true, message: '吊装地点不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[4].key].includes(values.billType)
            ? [
                {
                  key: 'address',
                  label: '用电区域',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.address,
                    rules: [{ required: true, message: '用电区域不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[3].key].includes(values.billType)
            ? [
                {
                  key: 'tool',
                  label: '吊装工具',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.tool,
                    rules: [{ required: true, message: '吊装工具不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[0].key].includes(values.billType)
            ? [
                {
                  key: 'billLevel',
                  label: '动火作业级别（动火证类型）',
                  component: <Select list={HOT_WORK_TYPES} mode={mode} />,
                  options: {
                    initialValue: detail.billLevel,
                    rules: [{ required: true, message: '动火作业级别（动火证类型）不能为空' }],
                  },
                },
              ]
            : []),
          ...([TYPES[0].key].includes(values.billType)
            ? [
                {
                  key: 'supervisor',
                  label: '监火人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.supervisor,
                    rules: [{ required: true, message: '监火人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[0].key].includes(values.billType)
            ? [
                {
                  key: 'supervisorPosition',
                  label: '监火人岗位',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.supervisorPosition,
                    rules: [{ required: true, message: '监火人岗位不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[0].key].includes(values.billType)
            ? [
                {
                  key: 'manager',
                  label: '负责人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.manager,
                    rules: [{ required: true, message: '负责人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[5].key].includes(values.billType)
            ? [
                {
                  key: 'manager',
                  label: '检修负责人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.manager,
                    rules: [{ required: true, message: '检修负责人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[0].key].includes(values.billType)
            ? [
                {
                  key: 'range',
                  label: '动火时间',
                  component: <RangePicker format={MINUTE_FORMAT} mode={mode} />,
                  options: {
                    initialValue: detail.range,
                    rules: [{ type: 'array', len: 2, required: true, message: '动火时间不能为空' }],
                  },
                },
              ]
            : []),
          ...([TYPES[5].key].includes(values.billType)
            ? [
                {
                  key: 'range',
                  label: '检修期限',
                  component: <RangePicker format={MINUTE_FORMAT} mode={mode} />,
                  options: {
                    initialValue: detail.range,
                    rules: [{ type: 'array', len: 2, required: true, message: '检修期限不能为空' }],
                  },
                },
              ]
            : []),
          ...([TYPES[0].key].includes(values.billType)
            ? [
                {
                  key: 'workingContent',
                  label: '动火内容',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingContent,
                    rules: [{ required: true, message: '动火内容不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[3].key].includes(values.billType)
            ? [
                {
                  key: 'workingContent',
                  label: '吊装内容',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingContent,
                    rules: [{ required: true, message: '吊装内容不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[4].key].includes(values.billType)
            ? [
                {
                  key: 'workingContent',
                  label: '临时用电原因',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingContent,
                    rules: [{ required: true, message: '临时用电原因不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[0].key].includes(values.billType)
            ? [
                {
                  key: 'workingWay',
                  label: '动火方式',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingWay,
                    rules: [{ required: true, message: '动火方式不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[0].key, TYPES[4].key, TYPES[7].key, TYPES[8].key].includes(values.billType)
            ? [
                {
                  key: 'workingProject',
                  label: '施工项目',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingProject,
                    rules: [{ required: true, message: '施工项目不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[4].key, TYPES[7].key, TYPES[8].key].includes(values.billType)
            ? [
                {
                  key: 'range',
                  label: '作业期限',
                  component: <RangePicker format={MINUTE_FORMAT} mode={mode} />,
                  options: {
                    initialValue: detail.range,
                    rules: [{ type: 'array', len: 2, required: true, message: '作业期限不能为空' }],
                  },
                },
              ]
            : []),
          ...([TYPES[1].key].includes(values.billType)
            ? [
                {
                  key: 'workingProject',
                  label: '受限空间（设备）名称',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingProject,
                    rules: [
                      {
                        required: true,
                        message: '受限空间（设备）名称不能为空',
                        whitespace: true,
                      },
                    ],
                  },
                },
              ]
            : []),
          ...([TYPES[2].key, TYPES[5].key, TYPES[6].key].includes(values.billType)
            ? [
                {
                  key: 'agent',
                  label: '待办人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.agent,
                    rules: [{ required: true, message: '待办人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[6].key].includes(values.billType)
            ? [
                {
                  key: 'supervisor',
                  label: '监护人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.supervisor,
                    rules: [{ required: true, message: '监护人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[6].key].includes(values.billType)
            ? [
                {
                  key: 'supervisorPosition',
                  label: '监护人岗位',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.supervisorPosition,
                    rules: [{ required: true, message: '监护人岗位不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[6].key].includes(values.billType)
            ? [
                {
                  key: 'mainMedium',
                  label: '主要介质',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.mainMedium,
                    rules: [{ required: true, message: '主要介质不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'temperature',
                  label: '温度（℃）',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.temperature,
                    rules: [{ required: true, message: '温度不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'pressure',
                  label: '压力（Pa）',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.pressure,
                    rules: [{ required: true, message: '压力不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'material',
                  label: '盲板材质',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.material,
                    rules: [{ required: true, message: '盲板材质不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'specs',
                  label: '盲板规格',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.specs,
                    rules: [{ required: true, message: '盲板规格不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'location',
                  label: '盲板位置',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.location,
                    rules: [{ required: true, message: '盲板位置不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'blindPlateCode',
                  label: '盲板编号',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.blindPlateCode,
                    rules: [{ required: true, message: '盲板编号不能为空', whitespace: true }],
                  },
                },
                ...(values.billLevel === BLIND_PLATE_WORK_TYPES[0].key
                  ? [
                      {
                        key: 'constructionManager',
                        label: '装盲板负责人',
                        component: <Input mode={mode} />,
                        options: {
                          initialValue: detail.constructionManager,
                          rules: [
                            {
                              required: true,
                              message: '装盲板负责人不能为空',
                              whitespace: true,
                            },
                          ],
                        },
                      },
                      {
                        key: 'recoveryDate',
                        label: '装盲板时间',
                        component: <DatePicker format={MINUTE_FORMAT} mode={mode} />,
                        options: {
                          initialValue: detail.recoveryDate || moment(),
                          rules: [
                            { type: 'object', required: true, message: '装盲板时间不能为空' },
                          ],
                        },
                      },
                    ]
                  : []),
                ...(values.billLevel === BLIND_PLATE_WORK_TYPES[1].key
                  ? [
                      {
                        key: 'constructionManager',
                        label: '拆盲板负责人',
                        component: <Input mode={mode} />,
                        options: {
                          initialValue: detail.constructionManager,
                          rules: [
                            {
                              required: true,
                              message: '拆盲板负责人不能为空',
                              whitespace: true,
                            },
                          ],
                        },
                      },
                      {
                        key: 'recoveryDate',
                        label: '拆盲板时间',
                        component: <DatePicker format={MINUTE_FORMAT} mode={mode} />,
                        options: {
                          initialValue: detail.recoveryDate || moment(),
                          rules: [
                            { type: 'object', required: true, message: '拆盲板时间不能为空' },
                          ],
                        },
                      },
                    ]
                  : []),

                {
                  key: 'workingProject',
                  label: '施工项目',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingProject,
                    rules: [{ required: true, message: '施工项目不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([
            TYPES[0].key,
            TYPES[1].key,
            TYPES[2].key,
            TYPES[4].key,
            TYPES[7].key,
            TYPES[8].key,
          ].includes(values.billType)
            ? [
                {
                  key: 'workingCompanyType',
                  label: '作业单位类型',
                  component: <Select list={UNIT_TYPES} mode={mode} />,
                  options: {
                    initialValue: detail.workingCompanyType,
                    rules: [{ required: true, message: '作业单位类型不能为空' }],
                  },
                },
              ]
            : []),
          ...([TYPES[5].key].includes(values.billType)
            ? [
                {
                  key: 'workingCompanyType',
                  label: '维修单位类型',
                  component: <Select list={UNIT_TYPES} mode={mode} />,
                  options: {
                    initialValue: detail.workingCompanyType,
                    rules: [{ required: true, message: '维修单位类型不能为空' }],
                  },
                },
              ]
            : []),
          ...(values.workingCompanyType === UNIT_TYPES[1].key &&
          [
            TYPES[0].key,
            TYPES[1].key,
            TYPES[2].key,
            TYPES[4].key,
            TYPES[7].key,
            TYPES[8].key,
          ].includes(values.billType)
            ? [
                {
                  key: 'workingCompanyName',
                  label: '作业单位名称',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingCompanyName,
                    rules: [{ required: true, message: '作业单位名称不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...(values.workingCompanyType === UNIT_TYPES[1].key &&
          [TYPES[5].key].includes(values.billType)
            ? [
                {
                  key: 'workingCompanyName',
                  label: '维修单位名称',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingCompanyName,
                    rules: [{ required: true, message: '作业单位名称不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...(values.workingCompanyType && [TYPES[1].key].includes(values.billType)
            ? [
                {
                  key: 'workingDepartment',
                  label: '作业部门',
                  component:
                    values.workingCompanyType === UNIT_TYPES[0].key ? (
                      <TreeSelect
                        key={isUnit ? unitId : values.company.key}
                        params={{ companyId: isUnit ? unitId : values.company.key }}
                        mapper={DEPARTMENT_LIST_MAPPER}
                        fieldNames={DEPARTMENT_LIST_FIELDNAMES}
                        mode={mode}
                      />
                    ) : (
                      <Input mode={mode} />
                    ),
                  options: {
                    initialValue: detail.workingDepartment,
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        message: '作业部门不能为空',
                      },
                    ],
                  },
                },
              ]
            : []),
          ...([TYPES[5].key].includes(values.billType)
            ? [
                {
                  key: 'workingProject',
                  label: '维修项目名称',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingProject,
                    rules: [{ required: true, message: '维修项目名称不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[0].key].includes(values.billType)
            ? [
                {
                  key: 'workingManager',
                  label: '动火负责人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingManager,
                    rules: [{ required: true, message: '动火负责人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[2].key, TYPES[4].key, TYPES[8].key].includes(values.billType)
            ? [
                {
                  key: 'workingManager',
                  label: '作业负责人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingManager,
                    rules: [{ required: true, message: '作业负责人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[5].key].includes(values.billType)
            ? [
                {
                  key: 'workingManager',
                  label: '维修负责人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingManager,
                    rules: [{ required: true, message: '维修负责人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[5].key].includes(values.billType)
            ? [
                {
                  key: 'address',
                  label: '维修地点',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.address,
                    rules: [{ required: true, message: '维修地点不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[5].key].includes(values.billType)
            ? [
                {
                  key: 'workingContent',
                  label: '维修内容',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingContent,
                    rules: [{ required: true, message: '维修内容不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[0].key].includes(values.billType)
            ? [
                {
                  key: 'workingPersonnel',
                  label: '动火人',
                  component: (
                    <Select
                      placeholder="请输入"
                      originalMode="tags"
                      notFoundContent={null}
                      showArrow={false}
                      filterOption={false}
                      mode={mode}
                    />
                  ),
                  options: {
                    initialValue: isNotDetail
                      ? detail.workingPersonnel
                      : detail.workingPersonnel
                        ? detail.workingPersonnel.join(',')
                        : undefined,
                    getValueFromEvent: this.getWorkingPersonnelFromEvent,
                    rules: [{ required: true, message: '动火人不能为空' }],
                  },
                  grid: {
                    xl: 12,
                    sm: 24,
                    xs: 24,
                  },
                  standalone: true,
                },
              ]
            : []),
          ...([TYPES[4].key, TYPES[8].key].includes(values.billType)
            ? [
                {
                  key: 'workingPersonnel',
                  label: '作业人',
                  component: (
                    <Select
                      placeholder="请输入"
                      originalMode="tags"
                      notFoundContent={null}
                      showArrow={false}
                      filterOption={false}
                      mode={mode}
                    />
                  ),
                  options: {
                    initialValue: isNotDetail
                      ? detail.workingPersonnel
                      : detail.workingPersonnel
                        ? detail.workingPersonnel.join(',')
                        : undefined,
                    getValueFromEvent: this.getWorkingPersonnelFromEvent,
                    rules: [{ required: true, message: '作业人不能为空' }],
                  },
                  grid: {
                    xl: 12,
                    sm: 24,
                    xs: 24,
                  },
                  standalone: true,
                },
              ]
            : []),
          ...([TYPES[4].key, TYPES[6].key, TYPES[7].key, TYPES[8].key].includes(values.billType)
            ? [
                {
                  key: 'compilingPerson',
                  label: '编制人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.compilingPerson,
                    rules: [{ required: true, message: '编制人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[8].key].includes(values.billType)
            ? [
                {
                  key: 'location',
                  label: '动土范围',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.location,
                    rules: [{ required: true, message: '动土范围不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'workingWay',
                  label: '动土方式',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingWay,
                    rules: [{ required: true, message: '动土方式不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'workingContent',
                  label: '动土内容',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingContent,
                    rules: [{ required: true, message: '动土内容不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'powerAccessPoint',
                  label: '电源接入点',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.powerAccessPoint,
                    rules: [{ required: true, message: '电源接入点不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'voltage',
                  label: '使用电压（V）',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.voltage,
                    rules: [{ required: true, message: '使用电压（V）不能为空', whitespace: true }],
                  },
                },
                {
                  key: 'planType',
                  label: '计划性',
                  component: <Select list={PLAN_TYPES} mode={mode} />,
                  options: {
                    initialValue: detail.planType,
                    rules: [{ required: true, message: '计划性不能为空' }],
                  },
                },
              ]
            : []),
          ...([TYPES[0].key, TYPES[6].key].includes(values.billType)
            ? [
                {
                  key: 'safetyEducator',
                  label: '实施安全教育人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.safetyEducator,
                    rules: [
                      { required: true, message: '实施安全教育人不能为空', whitespace: true },
                    ],
                  },
                },
              ]
            : []),
          ...([TYPES[0].key, TYPES[1].key].includes(values.billType)
            ? [
                {
                  key: 'constructionManager',
                  label: '施工负责人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.constructionManager,
                    rules: [{ required: true, message: '施工负责人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[1].key, TYPES[4].key].includes(values.billType)
            ? [
                {
                  key: 'agent',
                  label: '待办人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.agent,
                    rules: [{ required: true, message: '待办人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[1].key, TYPES[2].key].includes(values.billType)
            ? [
                {
                  key: 'workingPersonnel',
                  label: '作业人',
                  component: (
                    <Select
                      placeholder="请输入"
                      originalMode="tags"
                      notFoundContent={null}
                      showArrow={false}
                      filterOption={false}
                      mode={mode}
                    />
                  ),
                  options: {
                    initialValue: isNotDetail
                      ? detail.workingPersonnel
                      : detail.workingPersonnel
                        ? detail.workingPersonnel.join(',')
                        : undefined,
                    getValueFromEvent: this.getWorkingPersonnelFromEvent,
                    rules: [{ required: true, message: '作业人不能为空' }],
                  },
                  grid: {
                    xl: 12,
                    sm: 24,
                    xs: 24,
                  },
                  standalone: true,
                },
              ]
            : []),
          ...([TYPES[3].key].includes(values.billType)
            ? [
                {
                  key: 'workingPersonnel',
                  label: '吊装人员',
                  component: (
                    <Select
                      placeholder="请输入"
                      originalMode="tags"
                      notFoundContent={null}
                      showArrow={false}
                      filterOption={false}
                      mode={mode}
                    />
                  ),
                  options: {
                    initialValue: isNotDetail
                      ? detail.workingPersonnel
                      : detail.workingPersonnel
                        ? detail.workingPersonnel.join(',')
                        : undefined,
                    getValueFromEvent: this.getWorkingPersonnelFromEvent,
                    rules: [{ required: true, message: '吊装人员不能为空' }],
                  },
                  grid: {
                    xl: 12,
                    sm: 24,
                    xs: 24,
                  },
                  standalone: true,
                },
              ]
            : []),
          ...([TYPES[3].key].includes(values.billType)
            ? [
                {
                  key: 'workingProject',
                  label: '施工项目',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingProject,
                    rules: [{ required: true, message: '施工项目不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[2].key, TYPES[5].key, TYPES[7].key, TYPES[8].key].includes(values.billType)
            ? [
                {
                  key: 'supervisor',
                  label: '监护人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.supervisor,
                    rules: [{ required: true, message: '监护人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[3].key].includes(values.billType)
            ? [
                {
                  key: 'supervisor',
                  label: '安全监护人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.supervisor,
                    rules: [{ required: true, message: '安全监护人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[4].key].includes(values.billType)
            ? [
                {
                  key: 'supervisor',
                  label: '作业监护人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.supervisor,
                    rules: [{ required: true, message: '作业监护人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[2].key, TYPES[3].key, TYPES[4].key, TYPES[7].key, TYPES[8].key].includes(
            values.billType
          )
            ? [
                {
                  key: 'supervisorPosition',
                  label: '监护人岗位',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.supervisorPosition,
                    rules: [{ required: true, message: '监护人岗位不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[1].key, TYPES[2].key, TYPES[3].key].includes(values.billType)
            ? [
                {
                  key: 'range',
                  label: '作业期限',
                  component: <RangePicker format={MINUTE_FORMAT} mode={mode} />,
                  options: {
                    initialValue: detail.range,
                    rules: [{ type: 'array', len: 2, required: true, message: '作业期限不能为空' }],
                  },
                },
              ]
            : []),
          ...([TYPES[2].key, TYPES[3].key].includes(values.billType)
            ? [
                {
                  key: 'compilingPerson',
                  label: '编制人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.compilingPerson,
                    rules: [{ required: true, message: '编制人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[2].key].includes(values.billType)
            ? [
                {
                  key: 'workingProject',
                  label: '施工项目',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.workingProject,
                    rules: [{ required: true, message: '施工项目不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[2].key, TYPES[3].key, TYPES[7].key, TYPES[8].key].includes(values.billType)
            ? [
                {
                  key: 'safetyEducator',
                  label: '实施安全教育人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.safetyEducator,
                    rules: [
                      { required: true, message: '实施安全教育人不能为空', whitespace: true },
                    ],
                  },
                },
              ]
            : []),
          ...([TYPES[3].key].includes(values.billType)
            ? [
                {
                  key: 'manager',
                  label: '负责人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.manager,
                    rules: [{ required: true, message: '负责人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([TYPES[3].key].includes(values.billType)
            ? [
                {
                  key: 'agent',
                  label: '待办人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.agent,
                    rules: [{ required: true, message: '待办人不能为空', whitespace: true }],
                  },
                },
              ]
            : []),
          ...([
            TYPES[0].key,
            TYPES[1].key,
            TYPES[4].key,
            TYPES[5].key,
            TYPES[6].key,
            TYPES[7].key,
          ].includes(values.billType)
            ? [
                {
                  key: 'planType',
                  label: '计划性',
                  component: <Select list={PLAN_TYPES} mode={mode} />,
                  options: {
                    initialValue: detail.planType,
                    rules: [{ required: true, message: '计划性不能为空' }],
                  },
                },
              ]
            : []),
          ...([TYPES[7].key].includes(values.billType)
            ? [
                {
                  key: 'recoveryDate',
                  label: '恢复日期',
                  component: <DatePicker format={MINUTE_FORMAT} mode={mode} />,
                  options: {
                    initialValue: detail.recoveryDate || moment(),
                    rules: [{ type: 'object', required: true, message: '恢复日期不能为空' }],
                  },
                },
              ]
            : []),
          ...([TYPES[4].key].includes(values.billType)
            ? [
                {
                  key: 'safetyEducator',
                  label: '实施安全教育人',
                  component: <Input mode={mode} />,
                  options: {
                    initialValue: detail.safetyEducator,
                    rules: [
                      { required: true, message: '实施安全教育人不能为空', whitespace: true },
                    ],
                  },
                },
              ]
            : []),
          ...(detail.approveStatus === APPROVE_STATUSES[1].key
            ? [
                {
                  key: 'workingStatus',
                  label: '作业状态',
                  component: <Select list={WORKING_STATUSES} mode={mode} />,
                  options: {
                    initialValue: detail.workingStatus || WORKING_STATUSES[0].key,
                    rules: [{ required: true, message: '作业状态不能为空' }],
                  },
                },
              ]
            : []),
          ...(values.workingStatus === WORKING_STATUSES[2].key
            ? [
                {
                  key: 'finishDate',
                  label: '完工时间',
                  component: <DatePicker format={MINUTE_FORMAT} mode={mode} />,
                  options: {
                    initialValue: detail.finishDate || moment(),
                    rules: [{ required: true, message: '完工时间不能为空' }],
                  },
                },
              ]
            : []),
          ...([TYPES[5].key, TYPES[6].key, TYPES[7].key, TYPES[8].key].includes(values.billType)
            ? [
                {
                  key: 'hazardIdentification',
                  label: '危害辨识',
                  component: <TextArea mode={mode} />,
                  options: {
                    initialValue: detail.hazardIdentification,
                    rules: [{ required: true, message: '危害辨识不能为空', whitespace: true }],
                  },
                  grid: {
                    xl: 12,
                    sm: 24,
                    xs: 24,
                  },
                  standalone: true,
                },
              ]
            : []),
          {
            key: 'riskFactors',
            label: '危险因素',
            component: <TextArea mode={mode} />,
            options: {
              initialValue: detail.riskFactors,
              rules: [{ required: true, message: '危险因素不能为空', whitespace: true }],
            },
            grid: {
              xl: 12,
              sm: 24,
              xs: 24,
            },
            standalone: true,
          },
          {
            key: 'safetyMeasures',
            label: '安全措施',
            component: (
              <SafetyMeasure list={TYPE_MAP_SAFETY_MEASURES[values.billType]} mode={mode} />
            ),
            options: {
              initialValue: detail.safetyMeasures,
              rules: [{ type: 'array', required: true, validator: this.validateSafetyMeasure }],
            },
            grid: {
              span: 24,
            },
          },
          {
            key: 'certificatesFileList',
            label: '特殊作业操作证附件',
            component: <Upload mode={mode} />,
            options: {
              initialValue: detail.certificatesFileList,
            },
            grid: {
              span: 24,
            },
          },
          ...([TYPES[6].key].includes(values.billType)
            ? [
                {
                  key: 'locationFileList',
                  label: '盲板位置图附件',
                  component: <Upload mode={mode} />,
                  options: {
                    initialValue: detail.locationFileList,
                  },
                  grid: {
                    span: 24,
                  },
                },
              ]
            : []),
          ...([TYPES[7].key].includes(values.billType)
            ? [
                {
                  key: 'locationFileList',
                  label: '断路地段示意图附件',
                  component: <Upload mode={mode} />,
                  options: {
                    initialValue: detail.locationFileList,
                    rules: [
                      {
                        type: 'array',
                        min: 1,
                        required: true,
                        message: '断路地段示意图附件不能为空',
                      },
                    ],
                  },
                  grid: {
                    span: 24,
                  },
                },
              ]
            : []),
          ...([TYPES[8].key].includes(values.billType)
            ? [
                {
                  key: 'locationFileList',
                  label: '动土地段示意图附件',
                  component: <Upload mode={mode} />,
                  options: {
                    initialValue: detail.locationFileList,
                    rules: [
                      { type: 'array', min: 1, required: true, message: '动土地段示意图附件' },
                    ],
                  },
                  grid: {
                    span: 24,
                  },
                },
              ]
            : []),
          {
            key: 'applyFileList',
            label: '审批附件',
            component: <Upload mode={mode} />,
            options: {
              initialValue: detail.applyFileList,
            },
            grid: {
              span: 24,
            },
          },
        ],
      },
      // {
      //   key: '作业区域划分',
      //   title: '作业区域划分',
      //   fields: [
      //   ],
      // },
    ];

    return (
      <PageHeaderLayout
        className={styles.pageHeader}
        breadcrumbList={breadcrumbList}
        title={breadcrumbList[breadcrumbList.length - 1].title}
      >
        <Spin spinning={loading}>
          {fields.map(({ key, title, fields }) => (
            <Card key={key} className={styles.card} title={title}>
              <Form
                className={isNotDetail ? undefined : styles.detailForm}
                layout={isNotDetail ? 'vertical' : 'horizontal'}
              >
                <Row gutter={24}>
                  {fields.map(
                    ({ key, label, component, options, grid = GUTTER, standalone }) =>
                      standalone ? (
                        <Col span={24} key={key}>
                          <Row gutter={24}>
                            <Col {...grid} key={key}>
                              <Form.Item label={label}>
                                {getFieldDecorator(
                                  key,
                                  isNotDetail ? options : { ...options, rules: undefined }
                                )(component)}
                              </Form.Item>
                            </Col>
                          </Row>
                        </Col>
                      ) : (
                        <Col {...grid} key={key}>
                          <Form.Item label={label}>
                            {getFieldDecorator(
                              key,
                              isNotDetail ? options : { ...options, rules: undefined }
                            )(component)}
                          </Form.Item>
                        </Col>
                      )
                  )}
                </Row>
              </Form>
            </Card>
          ))}
          <Card>
            <div className={styles.buttonContainer}>
              <div className={styles.buttonWrapper}>
                <Button onClick={goBack}>返回</Button>
              </div>
              <div className={styles.buttonWrapper}>
                {isNotDetail ? (
                  <Button
                    type="primary"
                    onClick={this.handleSubmit}
                    loading={uploading || submitting}
                  >
                    提交
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={goToEdit}
                    disabled={!hasEditAuthority || detail.approveStatus === APPROVE_STATUSES[2].key}
                  >
                    编辑
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
