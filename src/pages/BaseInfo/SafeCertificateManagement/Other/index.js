import React, { Component, Fragment } from 'react';
import { Button, Spin, message, Upload, Icon } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import RadioOrSpan from '@/jingan-components/RadioOrSpan';
import { getToken } from 'utils/authority';
import { getFileList } from '@/pages/BaseInfo/utils';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import debounce from 'lodash-decorators/debounce';
import bind from 'lodash-decorators/bind';
import {
  EDIT_CODE,
  ADD_CODE,
  DETAIL_CODE,
  LIST_PATH,
  EDIT_PATH,
  QUALIFICATION_TYPES,
  SEX,
  CERTIFICATE_UNIT_TYPES,
} from '../List';
import styles from './index.less';
import { genGoBack } from '@/utils/utils';

const SPAN = { span: 24 };
const LABEL_COL = { span: 4 };
const GET_DETAIL = 'safeCertificateManagement/getDetail';
const ADD = 'safeCertificateManagement/add';
const EDIT = 'safeCertificateManagement/edit';
const GET_COMPANY = 'safeCertificateManagement/getCompany';
const DEFAULT_FORMAT = 'YYYY-MM-DD';

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'safeCertificateManagement';
const defaultUploadProps = {
  name: 'files',
  data: { folder },
  multiple: true,
  action: uploadAction,
  headers: { 'JA-Token': getToken() },
};

@connect(
  ({ safeCertificateManagement, user, loading }) => ({
    safeCertificateManagement,
    user,
    loading: loading.effects[GET_DETAIL],
  }),
  dispatch => ({
    getDetail(payload, callback) {
      dispatch({
        type: GET_DETAIL,
        payload,
        callback,
      });
    },
    setDetail() {
      dispatch({
        type: 'safeCertificateManagement/save',
        payload: {
          detail: {},
        },
      });
    },
    add(payload, callback) {
      dispatch({
        type: ADD,
        payload: {
          ...payload,
        },
        callback,
      });
    },
    edit(payload, callback) {
      dispatch({
        type: EDIT,
        payload,
        callback,
      });
    },
    getCompany(payload, callback) {
      dispatch({
        type: GET_COMPANY,
        payload,
        callback,
      });
    },
  })
)
export default class InjuryReportOther extends Component {
  constructor(props) {
    super(props);
    this.goBack = genGoBack(props, LIST_PATH);
  }

  state = {
    submitting: false,
    fileList: [],
    uploading: false,
  };

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      user: {
        currentUser: { unitType, unitId, permissionCodes },
      },
      getDetail,
      setDetail,
    } = this.props;
    const type = this.getType();
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
        getDetail &&
          getDetail({ id }, (success, data) => {
            if (success) {
              const {
                companyId,
                companyName,
                name,
                sex,
                birthday,
                certificateUnitType,
                qualificationType,
                certificateNumber,
                startDate,
                endDate,
                telephone,
                certificateFileList = [],
              } = data || {};
              this.form &&
                this.form.setFieldsValue({
                  company: companyId ? { key: companyId, label: companyName } : undefined,
                  name,
                  sex,
                  telephone,
                  birthday: birthday && moment(birthday),
                  certificateUnitType,
                  qualificationType,
                  certificateNumber,
                  time: startDate ? [moment(startDate), moment(endDate)] : [],
                });
              this.setState({
                fileList: certificateFileList.map(({ id, dbUrl, webUrl, fileName }, index) => ({
                  uid: id || index,
                  fileName,
                  status: 'done',
                  name: fileName,
                  url: webUrl,
                  dbUrl,
                })),
              });
            } else {
              message.error('获取详情失败，请稍后重试或联系管理人员');
            }
          });
      } else if (+unitType === 4) {
        this.handleCompanyChange({ key: unitId });
      }
    } else {
      router.replace('/404');
    }
  }

  componentWillUnmount() {
    const { setDetail } = this.props;
    setDetail && setDetail();
  }

  getType = () => {
    const {
      route: { name },
    } = this.props;

    return name;
  };

  getTitle = type => {
    return { add: '新增安全生产资格证', detail: '安全生产资格证详情', edit: '编辑安全生产资格证' }[
      type
    ];
  };

  getBreadcrumbList = title => {
    return [
      { title: '首页', name: '首页', href: '/' },
      { title: '基本数据管理', name: '基本数据管理' },
      { title: '安全生产资格证管理', name: '安全生产资格证管理', href: LIST_PATH },
      { title, name: title },
    ];
  };

  setFormReference = form => {
    this.form = form;
  };

  @bind()
  @debounce(300)
  refresh() {
    this.forceUpdate();
  }

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
      safeCertificateManagement: { detail: { id } = {} },
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    const { fileList } = this.state;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { company, time, ...rest } = values;
        const [startDate, endDate] = time;
        const payload = {
          id,
          companyId: +unitType !== 4 ? company.key : unitId,
          certificateFileList: fileList.map(({ name, url, dbUrl }) => ({
            fileName: name,
            webUrl: url,
            dbUrl,
            name,
          })),
          startDate: startDate.format(DEFAULT_FORMAT),
          endDate: endDate.format(DEFAULT_FORMAT),
          ...rest,
          time: undefined,
          files: undefined,
        };
        this.setState({ submitting: true });
        (id ? edit : add)(payload, success => {
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

  // 企业发生变化
  handleCompanyChange = company => {
    if (company && company.key !== company.label) {
      const { getCompany } = this.props;
      getCompany({
        id: company.key,
      });
    }
  };

  // 上传附件
  handleFileChange = ({ fileList, file }) => {
    if (file.status === 'done') {
      let fList = [...fileList];
      if (file.response.code === 200) {
        message.success('上传成功');
      } else {
        message.error('上传失败');
        fList.splice(-1, 1);
      }
      fList = getFileList(fList);
      this.setState({ fileList: fList, uploading: false });
    } else {
      if (file.status === 'uploading') this.setState({ uploading: true });
      // 其他情况，直接用原文件数组
      fileList = getFileList(fileList);
      this.setState({ fileList });
    }
    return fileList;
  };

  renderForm() {
    const {
      user: {
        currentUser: { unitType, permissionCodes },
      },
      safeCertificateManagement: { detail: { companyName } = {} },
    } = this.props;
    const { fileList, uploading } = this.state;
    const type = this.getType();
    const isNotCompany = +unitType !== 4;
    const isEdit = type === 'edit';
    const isNotDetail = type !== 'detail';
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);

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
            id: 'name',
            label: '姓名',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入姓名"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '姓名不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'sex',
            label: '性别',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <RadioOrSpan list={SEX} type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '性别不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'birthday',
            label: '出生年月',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <DatePickerOrSpan
                className={styles.item}
                type={isNotDetail ? 'MonthPicker' : 'span'}
                format={'YYYY-MM'}
                placeholder="请选择出生年月"
                allowClear={false}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      type: 'object',
                      message: '出生年月不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'telephone',
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
            id: 'certificateUnitType',
            label: '证书单位类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择证书单位类型"
                list={CERTIFICATE_UNIT_TYPES}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '证书单位类型不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'qualificationType',
            label: '资格类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择资格类型"
                list={QUALIFICATION_TYPES}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '资格类型不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'certificateNumber',
            label: '安全生产资格证编号',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入安全生产资格证编号"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '安全生产资格证编号不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'time',
            label: '证书有效日期',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <DatePickerOrSpan
                type={isNotDetail ? 'RangePicker' : 'span'}
                format={DEFAULT_FORMAT}
                allowClear={false}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '证书有效日期不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'files',
            label: '证书附件',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <Upload
                  {...defaultUploadProps}
                  fileList={fileList}
                  onChange={this.handleFileChange}
                >
                  <Button
                    type="dashed"
                    style={{ width: '96px', height: '96px' }}
                    disabled={uploading}
                  >
                    <Icon type="plus" style={{ fontSize: '32px' }} />
                    <div style={{ marginTop: '8px' }}>点击上传</div>
                  </Button>
                </Upload>
              ) : (
                <Fragment>
                  {fileList.map(item => {
                    const { fileName, url, id } = item;
                    const fileNames = fileName.split('.');
                    const name = fileNames.slice(0, fileNames.length - 1).join('.');
                    return (
                      <div key={id}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {name}
                        </a>
                      </div>
                    );
                  })}
                </Fragment>
              ),
          },
        ],
      },
    ];

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
            {type !== 'detail' ? (
              <Button type="primary" onClick={this.handleSubmitButtonClick} loading={uploading}>
                提交
              </Button>
            ) : (
              // <Button
              //   type="primary"
              //   onClick={this.handleEditButtonClick}
              //   disabled={!hasEditAuthority}
              //   loading={uploading}
              // >
              //   编辑
              // </Button>
              null
            )}
            <Button
              // onClick={this.handleBackButtonClick}
              onClick={this.goBack}
            >
              返回
            </Button>
          </Fragment>
        }
      />
    );
  }

  render() {
    const { loading } = this.props;
    const { submitting } = this.state;
    const type = this.getType();
    const title = this.getTitle(type);
    const breadcrumbList = this.getBreadcrumbList(title);

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList} key={type}>
        <Spin spinning={loading || submitting || false}>{this.renderForm()}</Spin>
      </PageHeaderLayout>
    );
  }
}
