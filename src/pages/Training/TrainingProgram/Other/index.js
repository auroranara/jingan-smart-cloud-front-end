import React, { Component, Fragment } from 'react';
import { Button, Radio, Spin, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
// import debounce from 'lodash-decorators/debounce';
// import bind from 'lodash-decorators/bind';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import CustomUpload from '@/jingan-components/CustomUpload';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import TrainingObjectSelect2 from './TrainingObjectSelect2';
import {
  EDIT_CODE,
  ADD_CODE,
  DETAIL_CODE,
  LIST_PATH,
  EDIT_PATH,
  DEFAULT_FORMAT,
  SPAN,
  LABEL_COL,
  FORMS,
  LEVELS,
  TrainingType,
} from '../const';
import styles from './index.less';
import { genGoBack } from '@/utils/utils';

const USER_ID_TYPES = ['', 'userIds', 'userInput'];
@connect(
  ({ trainingProgram, user, loading }) => ({
    trainingProgram,
    user,
    loading: loading.effects['trainingProgram/fetchDetail'],
    adding: loading.effects['trainingProgram/add'],
    editing: loading.effects['trainingProgram/edit'],
  }),
  dispatch => ({
    getDetail(payload, callback) {
      dispatch({
        type: 'trainingProgram/fetchDetail',
        payload,
        callback,
      });
    },
    setDetail() {
      dispatch({
        type: 'trainingProgram/save',
        payload: {
          detail: {},
        },
      });
    },
    add(payload, callback) {
      dispatch({
        type: 'trainingProgram/add',
        payload,
        callback,
      });
    },
    edit(payload, callback) {
      dispatch({
        type: 'trainingProgram/edit',
        payload,
        callback,
      });
    },
  })
)
export default class TrainingProgramOther extends Component {
  constructor(props) {
    super(props);
    this.goBack = genGoBack(props, LIST_PATH);
    this.state = { userIdType: '2' }; // 1 手填 2 选择
  }

  componentDidMount() {
    const {
      match: {
        params: { type, id },
      },
      user: {
        currentUser: { permissionCodes },
      },
      getDetail,
      setDetail,
    } = this.props;
    const hasAddAuthority = permissionCodes.includes(ADD_CODE);
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const hasDetailAuthority = permissionCodes.includes(DETAIL_CODE);
    if (
      (type === 'add' && hasAddAuthority) ||
      (type === 'edit' && hasEditAuthority) ||
      (type === 'detail' && hasDetailAuthority)
    ) {
      setDetail();
      if (type !== 'add') {
        // 不考虑id不存在的情况，由request来跳转到500
        getDetail && getDetail({ id }, ({ userIdType }) => {
          userIdType && this.setState({ userIdType })
        });
      }
    } else {
      router.replace('/404');
    }
  }

  componentWillUnmount() {
    const { setDetail } = this.props;
    setDetail && setDetail({});
  }

  getTitle = () => {
    const {
      match: {
        params: { type },
      },
    } = this.props;
    return { add: '新增培训计划', detail: '培训计划详情', edit: '编辑培训计划' }[type];
  };

  getBreadcrumbList = title => {
    return [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '教育培训',
        name: '教育培训',
      },
      {
        title: '安全生产培训计划',
        name: '安全生产培训计划',
        href: LIST_PATH,
      },
      {
        title,
        name: title,
      },
    ];
  };

  setFormReference = form => {
    this.form = form;
  };

  // @bind()
  // @debounce(300)
  // refresh() {
  //   this.forceUpdate();
  // }

  // 返回按钮点击事件
  // handleBackButtonClick = () => {
  //   router.goBack();
  // };

  // 提交按钮点击事件
  handleSubmitButtonClick = () => {
    const {
      add,
      edit,
      user: {
        currentUser: { unitType, unitId },
      },
      trainingProgram: { detail: { id } = {} },
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const {
          company,
          range: [trainingStartTime, trainingEndTime],
          trainingType,
          trainingWay,
          ...rest
        } = values;
        const payload = {
          id,
          companyId: +unitType !== 4 ? company.key : unitId,
          trainingStartTime,
          trainingEndTime,
          trainingType: trainingType.join(','),
          trainingWay: trainingWay.join(','),
          ...rest,
        };
        (id ? edit : add)(payload, isSuccess => {
          if (isSuccess) {
            message.success(`${id ? '编辑' : '新增'}成功！`);
            // router.push(LIST_PATH);
            setTimeout(this.goBack, 1000);
          } else {
            message.error(`${id ? '编辑' : '新增'}失败，请稍后重试！`);
          }
        });
      }
    });
  };

  // 编辑按钮点击事件
  handleEditButtonClick = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`${EDIT_PATH}${EDIT_PATH.endsWith('/') ? id : `/${id}`}`);
    window.scrollTo(0, 0);
  };

  // handleBeforeUpload = (file) => {
  //   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  //   if (!isJpgOrPng) {
  //     message.error('文件上传只支持JPG/PNG格式!');
  //   }
  //   // const isLt2M = file.size / 1024 / 1024 <= 2;
  //   // if (!isLt2M) {
  //   //   message.error('文件上传最大支持2MB!');
  //   // }
  //   return isJpgOrPng;
  // }

  handlePeriodValidate = (rule, value, callback) => {
    if (!value) {
      callback('培训学时不能为空');
    } else if (value > 0) {
      callback();
    } else {
      callback('培训学时必须大于0');
    }
  };

  handleCompanyChange = company => {
    if (!company || company.key !== company.label) {
      setTimeout(() => {
        this.forceUpdate();
      });
    }
  };

  handlePlanFileListChange = () => {
    setTimeout(() => {
      this.forceUpdate();
    });
  };

  handleUserIdTypeChange = e => {
    this.setState({ userIdType: e.target.value })
  };

  renderForm() {
    const {
      match: {
        params: { type },
      },
      user: {
        currentUser: { unitType, unitId, unitName, permissionCodes },
      },
      trainingProgram: {
        detail: {
          companyId,
          companyName,
          trainingPlanName,
          trainingType,
          trainingWay,
          trainingLevel,
          chargePerson,
          chargePersonPhone,
          themeCode,
          trainingDuration,
          trainingStartTime,
          trainingEndTime,
          trainingAddress,
          trainingContent,
          planFileList,
          userIdType,
          userInput,
          userIds,
          planStatus,
          resultFileList,
        } = {},
      },
    } = this.props;
    const isNotCompany = +unitType !== 4;
    const isEdit = type === 'edit';
    const isNotDetail = type !== 'detail';
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const values = (this.form && this.form.getFieldsValue()) || {};
    const { realCompanyId, realCompanyName } = isNotCompany
      ? values.company && values.company.key !== values.company.label
        ? { realCompanyId: values.company.key, realCompanyName: values.company.label }
        : { realCompanyId: companyId, realCompanyName: companyName }
      : { realCompanyId: unitId, realCompanyName: unitName };
    const uploading = (values.planFileList || []).some(({ status }) => status === 'uploading');

    const fields = [
      {
        key: 1,
        fields: [
          ...(isNotCompany
            ? [
                {
                  id: 'company',
                  label: '单位名称',
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () =>
                    isNotDetail ? (
                      <CompanySelect
                        disabled={isEdit}
                        className={styles.item}
                        onChange={this.handleCompanyChange}
                      />
                    ) : (
                      <span>{companyName}</span>
                    ),
                  options: {
                    initialValue: companyId && { key: companyId, label: companyName },
                    rules: isNotDetail
                      ? [
                          {
                            required: true,
                            message: '单位名称不能为空',
                            transform: value => value && value.label,
                          },
                        ]
                      : undefined,
                  },
                },
              ]
            : []),
          {
            id: 'trainingPlanName',
            label: '培训计划名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入培训计划名称"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              initialValue: trainingPlanName,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '培训计划名称不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'trainingType',
            label: '培训类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                mode="multiple"
                className={styles.item}
                placeholder="请选择培训类型"
                list={TrainingType}
                type={isNotDetail ? 'select' : 'span'}
              />
            ),
            options: {
              // initialValue: trainingType && `${trainingType}`,
              initialValue: trainingType ? trainingType.toString().split(',') : [],
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      // whitespace: true,
                      message: '培训类型不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'trainingWay',
            label: '培训形式',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                mode="multiple"
                className={styles.item}
                placeholder="请选择培训形式"
                list={FORMS}
                type={isNotDetail ? 'select' : 'span'}
              />
            ),
            options: {
              // initialValue: trainingWay && `${trainingWay}`,
              initialValue: trainingWay ? trainingWay.toString().split(',') : [],
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '培训形式不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'trainingLevel',
            label: '培训分级',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择培训分级"
                list={LEVELS}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              initialValue: trainingLevel && `${trainingLevel}`,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '培训分级不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'chargePerson',
            label: '经办人',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入经办人姓名"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              initialValue: chargePerson,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '经办人不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'chargePersonPhone',
            label: '联系电话',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入联系电话"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              initialValue: chargePersonPhone,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '联系电话不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'themeCode',
            label: '主题词',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入主题词"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              initialValue: themeCode,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '主题词不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'trainingDuration',
            label: '培训学时（h）',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入培训学时"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              initialValue: trainingDuration,
              getValueFromEvent: e =>
                e.target.value && e.target.value.replace(/\D*(\d*\.?\d*).*/, '$1'),
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      validator: this.handlePeriodValidate,
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'range',
            label: '培训时间',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <DatePickerOrSpan
                className={styles.item}
                type={isNotDetail ? 'RangePicker' : 'span'}
                unknown="?"
                separator={isNotDetail ? undefined : ' 至 '}
                format={DEFAULT_FORMAT}
                placeholder={['开始时间', '结束时间']}
                showTime
                allowClear={false}
              />
            ),
            options: {
              initialValue: [
                trainingStartTime && moment(trainingStartTime),
                trainingEndTime && moment(trainingEndTime),
              ],
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      type: 'object',
                      transform: v => v && v[0] && v[1],
                      message: '培训时间不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'trainingAddress',
            label: '培训地点',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入培训地点"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              initialValue: trainingAddress,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '培训地点不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'trainingContent',
            label: '培训内容',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入培训内容"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
            options: {
              initialValue: trainingContent,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '培训内容不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'userIdType',
            label: '培训对象输入模式',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <Radio.Group onChange={this.handleUserIdTypeChange}>
                <Radio key="0" value="2">选择</Radio>
                <Radio key="1" value="1">输入</Radio>
              </Radio.Group>
            ),
            options: { initialValue: userIdType || '2' },
          },
          {
            id: 'userInput',
            label: '培训对象',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入培训对象"
                type={isNotDetail ? 'Input' : 'span'}
                maxLength={50}
              />
            ),
            options: {
              initialValue: userInput,
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '培训对象不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'userIds',
            label: '培训对象',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <TrainingObjectSelect2
                className={styles.item}
                companyId={realCompanyId}
                companyName={realCompanyName}
                disabled={!isNotDetail}
              />
            ),
            options: {
              initialValue: userIds || [],
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '培训对象不能为空',
                      type: 'array',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'planFileList',
            label: '计划扫描件',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <CustomUpload
                folder="trainingProgram"
                onChange={this.handlePlanFileListChange}
                type={isNotDetail || 'span'}
              />
            ),
            options: {
              initialValue: planFileList || [],
              // rules: isNotDetail
              //   ? [
              //       {
              //         required: true,
              //         type: 'array',
              //         min: 1,
              //         message: '计划扫描件不能为空',
              //       },
              //     ]
              //   : undefined,
            },
          },
          ...(!isNotDetail && +planStatus === 1
            ? [
                {
                  id: 'resultFileList',
                  label: '执行结果',
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () => (
                    <div className={styles.fileList}>
                      {resultFileList &&
                        resultFileList.map(({ webUrl, fileName }, index) => (
                          <div key={index}>
                            <a
                              className={styles.clickable}
                              href={webUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {fileName}
                            </a>
                          </div>
                        ))}
                    </div>
                  ),
                },
              ]
            : []),
        ],
      },
    ];

    fields[0].fields = fields[0].fields.filter(({ id }) => id !== USER_ID_TYPES[this.state.userIdType]);
    if (!isNotDetail)
      fields[0].fields = fields[0].fields.filter(({ id }) => id !== 'userIdType')

    return (
      <CustomForm
        mode="multiple"
        fields={fields}
        searchable={false}
        resetable={false}
        ref={this.setFormReference}
        refresh={this.refresh}
        action={
          <Fragment>
            <Button onClick={this.goBack}>返回</Button>
            {type !== 'detail' ? (
              <Button type="primary" onClick={this.handleSubmitButtonClick} loading={uploading}>
                提交
              </Button>
            ) : (
              +planStatus === 0 && (
                <Button
                  type="primary"
                  onClick={this.handleEditButtonClick}
                  disabled={!hasEditAuthority}
                  loading={uploading}
                >
                  编辑
                </Button>
              )
            )}
          </Fragment>
        }
      />
    );
  }

  render() {
    const {
      match: {
        params: { type },
      },
      loading,
      adding,
      editing,
    } = this.props;
    const title = this.getTitle();
    const breadcrumbList = this.getBreadcrumbList(title);

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList} key={type}>
        <Spin spinning={loading || adding || editing || false}>{this.renderForm()}</Spin>
      </PageHeaderLayout>
    );
  }
}
