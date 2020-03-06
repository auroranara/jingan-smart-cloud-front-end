import React, { Component, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button, Spin, message, TreeSelect, Upload } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import RadioOrSpan from '@/jingan-components/RadioOrSpan';
import AreaSelect from '@/jingan-components/AreaSelect';
import MapCoordinate from '@/jingan-components/MapCoordinate';
import TypeSelect from '../../components/TypeSelect';
import AccidentInfo from '../components/AccidentInfo';
import { getToken } from 'utils/authority';
import { getFileList } from '@/pages/BaseInfo/utils';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import debounce from 'lodash-decorators/debounce';
import bind from 'lodash-decorators/bind';
import { isNumber } from '@/utils/utils';
import {
  EDIT_CODE,
  ADD_CODE,
  DETAIL_CODE,
  LIST_PATH,
  EDIT_PATH,
  LEVELS,
  PROCESS_TYPES,
  INJURY_TYPES,
  REPORT_STATUSES,
  SEX,
} from '../List';
import styles from './index.less';

const { TreeNode } = TreeSelect;
const SPAN = { span: 24 };
const LABEL_COL = { span: 4 };
const GET_DETAIL = 'injuryReport/getDetail';
const ADD = 'injuryReport/add';
const EDIT = 'injuryReport/edit';
const GET_COMPANY = 'injuryReport/getCompany';
const GET_COMPANY_TYPE_LIST = 'injuryReport/getCompanyTypeList';
const DEFAULT_FORMAT = 'YYYY-MM-DD';

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'injuryReport';
const defaultUploadProps = {
  name: 'files',
  data: { folder },
  multiple: true,
  action: uploadAction,
  headers: { 'JA-Token': getToken() },
};

const ISALL = [{ key: '0', value: '否' }, { key: '1', value: '是' }];
@connect(
  ({ injuryReport, user, loading, accidentReport }) => ({
    injuryReport,
    user,
    loading: loading.effects[GET_DETAIL],
    accidentReport,
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
        type: 'injuryReport/save',
        payload: {
          detail: {},
        },
      });
    },
    add(payload, callback) {
      dispatch({
        type: ADD,
        payload: {
          // type: '1',
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
    getCompanyTypeList(payload, callback) {
      dispatch({
        type: GET_COMPANY_TYPE_LIST,
        payload,
        callback,
      });
    },
    fetchDepartmentDict(payload, callback) {
      dispatch({
        type: 'injuryReport/fetchDepartmentDict',
        payload,
        callback,
      });
    },
  })
)
export default class InjuryReportOther extends Component {
  state = {
    submitting: false,
    selectedAccidentName: '',
    fileList: [],
    departmentName: '',
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
      fetchDepartmentDict,
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
      // getCompanyTypeList();
      if (type !== 'add') {
        // 不考虑id不存在的情况，由request来跳转到500
        getDetail &&
          getDetail({ id }, (success, data) => {
            if (success) {
              const {
                companyId,
                companyName,
                accidentTitle,
                declarePerson,
                sex,
                departmentId,
                accidentId,
                injuryType,
                declareDate,
                loseTime,
                hospitalName,
                hospitalResult,
                attention,
                isAll,
                remark,
                fileList = [],
                departmentName,
              } = data || {};
              fetchDepartmentDict({ companyId });
              this.form &&
                this.form.setFieldsValue({
                  company: companyId ? { key: companyId, label: companyName } : undefined,
                  declarePerson,
                  sex,
                  departmentId,
                  accidentId,
                  injuryType,
                  declareDate: declareDate ? moment(declareDate) : undefined,
                  loseTime: isNumber(loseTime) ? `${loseTime}` : undefined,
                  hospitalName,
                  hospitalResult,
                  attention,
                  isAll,
                  remark,
                });
              this.setState({
                selectedAccidentName: accidentTitle,
                departmentName,
                fileList: fileList.map(({ id, dbUrl, webUrl, fileName }, index) => ({
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
        fetchDepartmentDict({ companyId: unitId });
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
    return { add: '新增工伤申报', detail: '工伤申报详情', edit: '编辑工伤申报' }[type];
  };

  getBreadcrumbList = title => {
    return [
      { title: '首页', name: '首页', href: '/' },
      { title: '事故管理', name: '事故管理' },
      { title: '工伤申报', name: '工伤申报', href: LIST_PATH },
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
  handleBackButtonClick = () => {
    router.goBack();
  };

  // 提交按钮点击事件
  handleSubmitButtonClick = () => {
    const {
      add,
      edit,
      user: {
        currentUser: { unitType, unitId },
      },
      injuryReport: { detail: { id } = {} },
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    const { fileList } = this.state;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { company, ...rest } = values;
        const payload = {
          id,
          companyId: +unitType !== 4 ? company.key : unitId,
          fileList: fileList.map(({ name, url, dbUrl }) => ({
            fileName: name,
            webUrl: url,
            dbUrl,
            name,
          })),
          ...rest,
        };
        this.setState({ submitting: true });
        (id ? edit : add)(payload, success => {
          if (success) {
            message.success(`${id ? '编辑' : '新增'}成功！`);
            router.push(LIST_PATH);
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
      const { getCompany, fetchDepartmentDict } = this.props;
      getCompany(
        {
          id: company.key,
        },
        (success, data) => {
          if (success) {
            fetchDepartmentDict({ companyId: company.key });
          }
          // 如果失败怎么办，还没有想好
        }
      );
    }
  };

  handleQuickReportSelect = id => {
    const {
      accidentReport: { list: { list = [] } = {} },
    } = this.props;
    const data = list.find(item => item.id === id);
    const { accidentTitle } = data || {};
    this.setState({ selectedAccidentName: accidentTitle });
    this.form.setFieldsValue({ accidentId: id });
  };

  renderTreeNodes = dict =>
    dict.map(
      ({ key, value, children }) =>
        children ? (
          <TreeNode title={value} key={key} value={key}>
            {this.renderTreeNodes(children)}
          </TreeNode>
        ) : (
          <TreeNode title={value} key={key} value={key} />
        )
    );

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
        currentUser: { unitType, unitId, permissionCodes },
      },
      injuryReport: { detail: { companyId, companyName } = {}, departmentDict },
    } = this.props;
    const { selectedAccidentName, fileList, departmentName } = this.state;
    const type = this.getType();
    const isNotCompany = +unitType !== 4;
    const isEdit = type === 'edit';
    const isNotDetail = type !== 'detail';
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const values = (this.form && this.form.getFieldsValue()) || {};
    const realCompanyId = isNotCompany
      ? values.company && values.company.key !== values.company.label
        ? values.company.key
        : companyId
      : unitId;

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
            id: 'declarePerson',
            label: '申报人姓名',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入申报人姓名"
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
                      message: '申报人姓名不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'sex',
            label: '申报人性别',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <RadioOrSpan list={SEX} type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '申报人性别不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'departmentId',
            label: '申报人部门',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <TreeSelect
                  placeholder="请选择申报人部门"
                  allowClear
                  className={styles.item}
                  dropdownClassName={styles.treeSelectDropDown}
                >
                  {this.renderTreeNodes(departmentDict)}
                </TreeSelect>
              ) : (
                <span>{departmentName}</span>
              ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '申报人部门不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'accidentId',
            label: '事故名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <div>
                <InputOrSpan
                  disabled
                  className={styles.item}
                  placeholder="请选择事故"
                  maxLength={50}
                  type={isNotDetail ? 'Input' : 'span'}
                  value={selectedAccidentName}
                />
                {isNotDetail && (
                  <AccidentInfo
                    companyId={realCompanyId}
                    onChange={this.handleQuickReportSelect}
                    className={styles.accidentInfo}
                  />
                )}
              </div>
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '事故名称不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'injuryType',
            label: '工伤类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择工伤类型"
                list={INJURY_TYPES}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '工伤类型不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'declareDate',
            label: '申报日期',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <DatePickerOrSpan
                className={styles.item}
                type={isNotDetail ? 'DatePicker' : 'span'}
                format={DEFAULT_FORMAT}
                placeholder="请选择申报日期"
                allowClear={false}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      type: 'object',
                      message: '申报日期不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'loseTime',
            label: '损失工时（h）',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入损失工时（h）"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              getValueFromEvent: e =>
                e.target.value && e.target.value.replace(/\D*(\d*\.?\d*).*/, '$1'),
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '损失工时不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'hospitalName',
            label: '就诊医院',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入就诊医院"
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
                      message: '就诊医院不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'hospitalResult',
            label: '就诊结果',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入就诊结果"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
          },
          {
            id: 'files',
            label: '相关附件',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <div>
                  <div>（就医资料，工伤报告，其他材料等）</div>
                  <Upload
                    {...defaultUploadProps}
                    fileList={fileList}
                    onChange={this.handleFileChange}
                  >
                    <Button type="dashed" style={{ width: '96px', height: '96px' }}>
                      <LegacyIcon type="plus" style={{ fontSize: '32px' }} />
                      <div style={{ marginTop: '8px' }}>点击上传</div>
                    </Button>
                  </Upload>
                </div>
              ) : (
                <Fragment>
                  {fileList.map(item => {
                    const { fileName, webUrl, id } = item;
                    const fileNames = fileName.split('.');
                    const name = fileNames.slice(0, fileNames.length - 1).join('.');
                    return (
                      <div key={id}>
                        <a href={webUrl} target="_blank" rel="noopener noreferrer">
                          {name}
                        </a>
                      </div>
                    );
                  })}
                </Fragment>
              ),
          },
          {
            id: 'attention',
            label: '注意事项',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入注意事项"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
          },
          {
            id: 'isAll',
            label: '材料是否齐全',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <RadioOrSpan list={ISALL} type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '材料是否齐全不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'remark',
            label: '备注',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入备注"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
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
            <Button onClick={this.handleBackButtonClick}>返回</Button>
            {type !== 'detail' ? (
              <Button type="primary" onClick={this.handleSubmitButtonClick}>
                提交
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={this.handleEditButtonClick}
                disabled={!hasEditAuthority}
              >
                编辑
              </Button>
            )}
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
