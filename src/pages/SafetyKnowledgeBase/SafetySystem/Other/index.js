import React, { Component, Fragment } from 'react';
import { Button, Spin, message, Card } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import Text from '@/jingan-components/Text';
import {
  TITLE,
  LIST_PATH,
  EDIT_PATH,
  EDIT_CODE,
  DEFAULT_FORMAT,
} from '../List';
import styles from './index.less';
import { genGoBack } from '@/utils/utils';

const GET_DETAIL = 'safetySystem/getDetail';
const ADD = 'safetySystem/add';
const EDIT = 'safetySystem/edit';
const SPAN = { span: 24 };
const LABEL_COL = { span: 6 };
const STATUS_OPTIONS = [
  { label: '通过', status: 2, color: '#06cb06' },
  { label: '不通过', status: 3, color: 'red' },
]

const VERSION_TYPE_MAPPER = value => ({
  1: '创建',
  2: '修订',
})[value];
const VERSION_CODE_MAPPER = value => `V${value}`;

@connect(({
  user,
  safetySystem,
  loading,
}) => ({
  user,
  safetySystem,
  loading: loading.effects[GET_DETAIL],
}), (dispatch) => ({
  getDetail (payload, callback) {
    dispatch({
      type: GET_DETAIL,
      payload,
      callback,
    });
  },
  setDetail () {
    dispatch({
      type: 'safetySystem/save',
      payload: {
        detail: {},
      },
    });
  },
  add (payload, callback) {
    dispatch({
      type: ADD,
      payload,
      callback,
    });
  },
  edit (payload, callback) {
    dispatch({
      type: EDIT,
      payload,
      callback,
    });
  },
}))
export default class SafetySystemOther extends Component {
  constructor(props) {
    super(props);
    this.goBack = genGoBack(props, LIST_PATH);
  }

  state = {
    submitting: false,
  }

  componentDidMount () {
    const { getDetail, setDetail, match: { params: { id } } } = this.props;
    const navigation = this.getNavigation();
    setDetail();
    if (id) {
      getDetail({
        id,
      }, (success, data) => {
        if (success) {
          const {
            companyId,
            companyName,
            safetyName,
            versionType,
            versionCode,
            status,
            compaileName,
            telephone,
            startDate,
            endDate,
            otherFile,
          } = data;
          this.form && this.form.setFieldsValue({
            company: companyId ? { key: companyId, label: companyName } : undefined,
            safetyName: safetyName || undefined,
            versionType: navigation !== 'detail' && +status === 4 ? '2' : versionType || '1',
            versionCode: navigation !== 'detail' && +status === 4 ? (+versionCode + 0.01).toFixed(2) : versionCode || '1.00',
            compaileName: compaileName || undefined,
            telephone: telephone || undefined,
            expireDate: startDate && endDate ? [moment(startDate), moment(endDate)] : [],
            otherFile: otherFile || [],
          });
        } else {
          message.error('获取详情失败，请稍后重试或联系管理人员！');
        }
      });
    }
  }

  componentWillUnmount () {
    const { setDetail } = this.props;
    setDetail();
  }

  getNavigation = () => {
    const {
      route: {
        name,
      },
    } = this.props;
    return name;
  }

  getTitle = (type) => {
    return ({
      add: '新增安全制度',
      edit: '编辑安全制度',
      detail: '安全制度详情',
    })[type];
  }

  getBreadcrumbList = (title) => {
    return [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '安全生产制度法规',
        name: '安全生产制度法规',
      },
      {
        title: TITLE,
        name: TITLE,
        href: LIST_PATH,
      },
      {
        title: title,
        name: title,
      },
    ];
  }

  setFormReference = form => {
    this.form = form;
  }

  // 返回按钮点击事件
  // handleBackButtonClick = () => {
  //   router.goBack();
  // }

  // 提交按钮点击事件
  handleSubmitButtonClick = () => {
    const {
      add,
      edit,
      user: {
        currentUser: {
          unitType,
          unitId,
        },
      },
      safetySystem: {
        detail: {
          id,
          status,
          historyType,
        } = {},
      },
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { company, expireDate: [startDate, endDate] = [], otherFile, ...rest } = values;
        const payload = {
          id,
          companyId: +unitType !== 4 ? company.key : unitId,
          startDate: startDate && +startDate.startOf('day'),
          endDate: endDate && +endDate.endOf('day'),
          otherFile: otherFile && otherFile.length > 0 ? JSON.stringify(otherFile) : undefined,
          status,
          historyType,
          ...rest,
        };
        this.setState({
          submitting: true,
        });
        (id ? edit : add)(payload, (success) => {
          if (success) {
            message.success(`${id ? '编辑' : '新增'}成功！`);
            // router.push(LIST_PATH);
            setTimeout(this.goBack, 1000);
          } else {
            message.error(`${id ? '编辑' : '新增'}失败，请稍后重试！`);
            this.setState({
              submitting: false,
            });
          }
        });
      }
    });
  }

  // 编辑按钮点击事件
  handleEditButtonClick = () => {
    const { match: { params: { id } } } = this.props;
    router.push(`${EDIT_PATH}${EDIT_PATH.endsWith('/') ? id : `/${id}`}`);
    window.scrollTo(0, 0);
  }

  // 上传前
  handleBeforeUpload = (file) => {
    const isJpgOrPng = file.type.includes('word') || file.type.includes('pdf');
    if (!isJpgOrPng) {
      message.error('文件上传只支持Word文档或PDF格式文件!');
    }
    // const isLt2M = file.size / 1024 / 1024 <= 2;
    // if (!isLt2M) {
    //   message.error('文件上传最大支持2MB!');
    // }
    return isJpgOrPng;
  }

  render () {
    const {
      user: {
        currentUser: {
          permissionCodes,
          unitType,
        },
      },
      safetySystem: {
        detail: {
          status,
          approveList = [],
        } = {},
      },
      loading = false,
    } = this.props;
    const { submitting } = this.state;
    const isNotCompany = unitType !== 4;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const navigation = this.getNavigation();
    const title = this.getTitle(navigation);
    const breadcrumbList = this.getBreadcrumbList(title);
    const isNotDetail = navigation !== 'detail';
    const isEdit = navigation === 'edit';
    const fields = [
      {
        key: '1',
        fields: [
          ...(isNotCompany ? [{
            id: 'company',
            label: '单位名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <CompanySelect className={styles.item} disabled={isEdit} type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '单位名称不能为空',
                  transform: value => value && value.label,
                },
              ] : undefined,
            },
          }] : []),
          {
            id: 'safetyName',
            label: '安全制度名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入安全制度名称" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '安全制度名称不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'versionType',
            label: '版本类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <Text transform={VERSION_TYPE_MAPPER} />,
            options: {
              initialValue: '1',
            },
          },
          {
            id: 'versionCode',
            label: '版本号',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <Text transform={VERSION_CODE_MAPPER} />,
            options: {
              initialValue: '1.00',
            },
          },
          {
            id: 'compaileName',
            label: '编制人',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入编制人" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '编制人不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'telephone',
            label: '联系电话',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入联系电话" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '联系电话不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'expireDate',
            label: '有效期',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <DatePickerOrSpan className={styles.item} placeholder={['开始日期', '结束日期']} format={DEFAULT_FORMAT} separator=" 至 " unknown="?" type={isNotDetail ? 'RangePicker' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  type: 'array',
                  required: true,
                  len: 2,
                  transform: value => value && value.filter(v => v),
                  message: '有效期不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'otherFile',
            label: '附件',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <CustomUpload folder="safetySystem" beforeUpload={this.handleBeforeUpload} type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  type: 'boolean',
                  required: true,
                  transform: value => value && value.every(({ status }) => status === 'done'),
                  message: '附件不能为空',
                },
              ] : undefined,
            },
          },
        ],
      },
    ];


    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading}>
          <Card title="基础信息" bordered={false}>
            <CustomForm
              mode="multiple"
              fields={fields}
              searchable={false}
              resetable={false}
              refresh={this.refresh}
              // action={(
              //   <Fragment>
              //     <Button onClick={this.handleBackButtonClick}>返回</Button>
              //     {isNotDetail ? (
              //       <Button type="primary" onClick={this.handleSubmitButtonClick} loading={submitting}>提交</Button>
              //     ) : (+status === 3 || +status === 4) && (
              //       <Button type="primary" onClick={this.handleEditButtonClick} disabled={!hasEditAuthority}>编辑</Button>
              //     )}
              //   </Fragment>
              // )}
              ref={this.setFormReference}
            />
            {!isNotDetail && approveList && approveList.length > 0 && (
              <Card title="审批信息" bordered={false} style={{ marginTop: '24px' }}>
                {approveList.map(({ status, firstApproveBy, secondApproveBy, threeApproveBy, approveBy, otherFileList }, index) => (
                  <Card title={`第${index + 1}条信息`} type="inner" key={index} style={{ marginTop: index === 0 ? 'inherit' : '15px' }}>
                    <p>审核意见：<span style={{ color: STATUS_OPTIONS[+status - 2].color }}>{STATUS_OPTIONS[+status - 2].label}</span></p>
                    <p>一级审批人：{firstApproveBy || ''}</p>
                    <p>二级审批人：{secondApproveBy || ''}</p>
                    <p>三级审批人：{threeApproveBy || ''}</p>
                    <p>经办人：{approveBy || ''}</p>
                    <div style={{ display: 'flex' }}>
                      <span>附件：</span>
                      <div>{otherFileList.map(({ id, fileName, webUrl }) => (
                        <div key={id}><a href={webUrl} target="_blank" rel="noopener noreferrer">{fileName}</a></div>
                      ))}</div>
                    </div>
                  </Card>
                ))}
              </Card>
            )}
            <div style={{ textAlign: 'center' }}>
              <Button
                style={{ marginRight: '10px' }}
                // onClick={this.handleBackButtonClick}
                onClick={this.goBack}
              >
                返回
              </Button>
              {isNotDetail ? (
                <Button type="primary" onClick={this.handleSubmitButtonClick} loading={submitting}>提交</Button>
              ) : (+status === 3 || +status === 4) && (
                <Button type="primary" onClick={this.handleEditButtonClick} disabled={!hasEditAuthority}>编辑</Button>
              )}
            </div>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
