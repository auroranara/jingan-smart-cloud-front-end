import React, { Component, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Button, Spin, message, TreeSelect, Upload, Popover } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import debounce from 'lodash-decorators/debounce';
import bind from 'lodash-decorators/bind';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import RadioOrSpan from '@/jingan-components/RadioOrSpan';
import FooterToolbar from '@/components/FooterToolbar';
import { getToken } from 'utils/authority';
import { getFileList } from '@/pages/BaseInfo/utils';
import { isNumber } from '@/utils/utils';
import {
  EDIT_CODE,
  ADD_CODE,
  DETAIL_CODE,
  LIST_PATH,
  EDIT_PATH,
  TRUE_OR_FALSE,
  NO_DATA,
  LIFE_CYCLE,
} from '../List';
import styles from './index.less';
import { genGoBack } from '@/utils/utils';

const { TreeNode } = TreeSelect;
const SPAN = { span: 24 };
const LABEL_COL = { span: 4 };
const GET_DETAIL = 'productionFacility/getDetail';
const ADD = 'productionFacility/add';
const EDIT = 'productionFacility/edit';
const GET_COMPANY = 'productionFacility/getCompany';
const DEFAULT_FORMAT = 'YYYY-MM-DD';

// 上传文件地址
const uploadAction = '/acloud_new/v2/uploadFile';
// 上传文件夹
const folder = 'productionFacility';
const defaultUploadProps = {
  name: 'files',
  data: { folder },
  multiple: true,
  action: uploadAction,
  headers: { 'JA-Token': getToken() },
};
// 表单标签
const fieldLabels = {};
@connect(
  ({ productionFacility, user, loading }) => ({
    productionFacility,
    user,
    loading: loading.effects[GET_DETAIL],
  }),
  dispatch => ({
    getDetail (payload, callback) {
      dispatch({
        type: GET_DETAIL,
        payload,
        callback,
      });
    },
    setDetail () {
      dispatch({
        type: 'productionFacility/save',
        payload: {
          detail: {},
        },
      });
    },
    add (payload, callback) {
      dispatch({
        type: ADD,
        payload: {
          ...payload,
        },
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
    getCompany (payload, callback) {
      dispatch({
        type: GET_COMPANY,
        payload,
        callback,
      });
    },
    fetchDepartmentDict (payload, callback) {
      dispatch({
        type: 'productionFacility/fetchDepartmentDict',
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
    partName: '',
    headPartName: '',
    checkPartName: '',
    uploading: false,
  };

  componentDidMount () {
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
      if (type !== 'add') {
        // 不考虑id不存在的情况，由request来跳转到500
        getDetail &&
          getDetail({ id }, (success, data) => {
            if (success) {
              const {
                companyId,
                companyName,
                facilitiesName, //设施名称
                facilitiesNumber, //设施位号
                facilitiesUse, //设施用途
                facilitiesModel, //设施型号
                type, //类型
                part, //部门
                partName,
                usePart, //设置部位
                productDate, //生产时间
                usePeriod, //使用期限
                useDate, //投入时间
                head, //负责人
                headPart, //负责人部门
                headPartName,
                supplier, //供应商
                // useFile, //使用文件
                useFileList,
                isCheck, //是否检查 0 否 1：是
                checkDay, //检查周期
                checkRemind, //检查前提醒
                checkReason, //检查内容
                checkPart, //检查部门
                checkPartName,
                checkGoal, //检查指标
                isExam, //是否检测 0 否 1是
                examDay, //检测时间
                examRemind, //检测前提醒
                isMiantain, //是否保养 0 否  1：是
                status, //是否报废  1：是
                scrapDate, //报废时间
                realityScrapDate, //实际报废时间
                scrapReason, //报废原因
                gridIdList,
                lifeCycle, // 0：未使用 1：已使用 2：报废
                checkCount,
              } = data || {};
              this.form &&
                this.form.setFieldsValue({
                  company: companyId ? { key: companyId, label: companyName } : undefined,
                  facilitiesName, //设施名称
                  facilitiesNumber, //设施位号
                  facilitiesUse, //设施用途
                  facilitiesModel, //设施型号
                  type, //类型
                  part, //部门
                  // partName,
                  usePart, //设置部位
                  productDate: productDate ? moment(productDate) : undefined, //生产时间
                  usePeriod: isNumber(usePeriod) ? `${usePeriod}` : undefined, //使用期限
                  useDate: useDate ? moment(useDate) : undefined, //投入时间
                  head, //负责人
                  headPart, //负责人部门
                  // headPartName,
                  supplier, //供应商
                  // useFile, //使用文件
                  // useFileList,
                  isCheck: /0|1/.test(isCheck) ? isCheck : undefined, //是否检查 0 否 1：是
                  checkDay: isNumber(checkDay) ? `${checkDay}` : undefined, //检查周期
                  checkRemind: isNumber(checkRemind) ? `${checkRemind}` : undefined, //检查前提醒
                  checkReason, //检查内容
                  checkPart, //检查部门
                  // checkPartName,
                  checkGoal, //检查指标
                  isExam: /0|1/.test(isExam) ? isExam : undefined, //是否检测 0 否 1是
                  examDay: isNumber(examDay) ? `${examDay}` : undefined, //检测时间
                  examRemind: isNumber(examRemind) ? `${examRemind}` : undefined, //检测前提醒
                  isMiantain: /0|1/.test(isMiantain) ? isMiantain : undefined, //是否保养 0 否  1：是
                  status, //是否报废  1：是
                  gridIdList,
                  // lifeCycle, // 0：未使用 1：已使用 2：报废
                  checkCount,
                });
              setTimeout(() => {
                this.form.setFieldsValue({
                  lifeCycle,
                  scrapDate: scrapDate ? moment(scrapDate) : undefined, //报废时间
                  realityScrapDate: realityScrapDate ? moment(realityScrapDate) : undefined, //实际报废时间
                  scrapReason, //报废原因
                  checkDay: isNumber(checkDay) ? `${checkDay}` : undefined, //检查周期
                  checkRemind: isNumber(checkRemind) ? `${checkRemind}` : undefined, //检查前提醒
                  checkReason, //检查内容
                  checkPart, //检查部门
                  // checkPartName,
                  checkGoal, //检查指标
                  examDay: isNumber(examDay) ? `${examDay}` : undefined, //检测时间
                  examRemind: isNumber(examRemind) ? `${examRemind}` : undefined, //检测前提醒
                });
              }, 0);
              this.setState({
                // partName: partName || NO_DATA,
                // headPartName: headPartName || NO_DATA,
                // checkPartName: checkPartName || NO_DATA,
                partName,
                headPartName,
                checkPartName,
                fileList: useFileList.map(({ id, dbUrl, webUrl, fileName }, index) => ({
                  uid: id || index,
                  fileName,
                  status: 'done',
                  name: fileName,
                  url: webUrl,
                  dbUrl,
                })),
              });
              fetchDepartmentDict({ companyId });
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

  componentWillUnmount () {
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
    return { add: '新增生产设施', detail: '生产设施详情', edit: '编辑生产设施' }[type];
  };

  getBreadcrumbList = title => {
    return [
      { title: '首页', name: '首页', href: '/' },
      { title: '设备设施管理', name: '设备设施管理' },
      { title: '生产设施', name: '生产设施', href: LIST_PATH },
      { title, name: title },
    ];
  };

  setFormReference = form => {
    this.form = form;
  };

  @bind()
  @debounce(300)
  refresh () {
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
      productionFacility: { detail: { id } = {} },
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    const { fileList } = this.state;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { company, ...rest } = values;
        const payload = {
          id,
          companyId: +unitType !== 4 ? company.key : unitId,
          useFileList: fileList.map(({ name, url, dbUrl }) => ({
            fileName: name,
            webUrl: url,
            dbUrl,
            name,
          })),
          ...rest,
          useFile: undefined,
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

  renderForm () {
    const {
      user: {
        currentUser: { unitType },
      },
      productionFacility: { detail: { companyName, status } = {}, departmentDict },
    } = this.props;
    const { fileList, partName, headPartName, checkPartName } = this.state;
    const type = this.getType();
    const isNotCompany = +unitType !== 4;
    const isEdit = type === 'edit';
    const isNotDetail = type !== 'detail';
    const values = (this.form && this.form.getFieldsValue()) || {};
    const { isCheck, isExam } = values;

    const fields = [
      {
        key: 1,
        title: '基本信息',
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
            id: 'facilitiesName',
            label: '装置设施名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入装置设施名称"
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
                    message: '装置设施名称不能为空',
                  },
                ]
                : undefined,
            },
          },
          {
            id: 'facilitiesNumber',
            label: '装置设施位号',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入装置设施位号"
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
                    message: '装置设施位号不能为空',
                  },
                ]
                : undefined,
            },
          },
          {
            id: 'facilitiesUse',
            label: '装置设施用途',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入装置设施用途"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
          },
          {
            id: 'facilitiesModel',
            label: '装置设施型号',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入装置设施型号"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
          },
          {
            id: 'type',
            label: '类型/类别',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入类型/类别"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
          },
          {
            id: 'part',
            label: '单位部门',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <TreeSelect
                  placeholder="请选择单位部门"
                  allowClear
                  className={styles.item}
                  dropdownClassName={styles.treeSelectDropDown}
                >
                  {this.renderTreeNodes(departmentDict)}
                </TreeSelect>
              ) : (
                  <span>{partName}</span>
                ),
          },
          {
            id: 'usePart',
            label: '设置部位',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入设置部位"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
          },
          {
            id: 'productDate',
            label: '生产日期',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <DatePickerOrSpan
                className={styles.item}
                type={isNotDetail ? 'DatePicker' : 'span'}
                format={DEFAULT_FORMAT}
                placeholder="请选择生产日期"
                allowClear={false}
                unknown={NO_DATA}
              />
            ),
          },
          {
            id: 'usePeriod',
            label: '使用期限（个月）',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入使用期限（个月）"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              getValueFromEvent: e =>
                e.target.value && e.target.value.replace(/\D*(\d*\.?\d*).*/, '$1'),
            },
          },
          {
            id: 'useDate',
            label: '投用日期',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <DatePickerOrSpan
                className={styles.item}
                type={isNotDetail ? 'DatePicker' : 'span'}
                format={DEFAULT_FORMAT}
                placeholder="请选择投用日期"
                allowClear={false}
                unknown={NO_DATA}
              />
            ),
          },
          ...(!isNotDetail
            ? [
              {
                id: 'lifeCycle',
                label: '生命周期',
                span: SPAN,
                labelCol: LABEL_COL,
                render: () => <SelectOrSpan list={LIFE_CYCLE} type="span" />,
              },
              ...(status === '1'
                ? [
                  {
                    id: 'scrapDate',
                    label: '报废填报日期',
                    span: SPAN,
                    labelCol: LABEL_COL,
                    render: () => (
                      <DatePickerOrSpan
                        className={styles.item}
                        type={isNotDetail ? 'DatePicker' : 'span'}
                        format={DEFAULT_FORMAT}
                        placeholder="请选择报废填报日期"
                        allowClear={false}
                        unknown={NO_DATA}
                      />
                    ),
                  },
                  {
                    id: 'realityScrapDate',
                    label: '实际报废日期',
                    span: SPAN,
                    labelCol: LABEL_COL,
                    render: () => (
                      <DatePickerOrSpan
                        className={styles.item}
                        type={isNotDetail ? 'DatePicker' : 'span'}
                        format={DEFAULT_FORMAT}
                        placeholder="请选择实际报废日期"
                        allowClear={false}
                        unknown={NO_DATA}
                      />
                    ),
                  },
                  {
                    id: 'scrapReason',
                    label: '报废理由',
                    span: SPAN,
                    labelCol: LABEL_COL,
                    render: () => (
                      <InputOrSpan
                        className={styles.item}
                        placeholder="请输入报废理由"
                        type={isNotDetail ? 'TextArea' : 'span'}
                        autosize={{ minRows: 3 }}
                      />
                    ),
                  },
                ]
                : []),
            ]
            : []),
          {
            id: 'head',
            label: '负责人',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入负责人"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
          },
          {
            id: 'headPart',
            label: '负责人部门',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <TreeSelect
                  placeholder="请选择负责人部门"
                  allowClear
                  className={styles.item}
                  dropdownClassName={styles.treeSelectDropDown}
                >
                  {this.renderTreeNodes(departmentDict)}
                </TreeSelect>
              ) : (
                  <span>{headPartName}</span>
                ),
          },
          {
            id: 'supplier',
            label: '供应商',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入供应商"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
          },
          {
            id: 'useFile',
            label: '使用说明',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <div>
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
                  {/* <div>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div> */}
                </div>
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
      {
        key: 2,
        title: '检查检测信息',
        fields: [
          {
            id: 'isCheck',
            label: '是否检查',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <RadioOrSpan list={TRUE_OR_FALSE} type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail
                ? [
                  {
                    required: true,
                    message: '是否检查不能为空',
                  },
                ]
                : undefined,
            },
          },
          ...(isCheck === '1'
            ? [
              {
                id: 'checkDay',
                label: '检查周期（天）',
                span: SPAN,
                labelCol: LABEL_COL,
                render: () => (
                  <InputOrSpan
                    className={styles.item}
                    placeholder="请输入检查周期（天）"
                    maxLength={50}
                    type={isNotDetail ? 'Input' : 'span'}
                  />
                ),
                options: {
                  getValueFromEvent: e =>
                    e.target.value && e.target.value.replace(/\D*(\d*\.?\d*).*/, '$1'),
                },
              },
              {
                id: 'checkRemind',
                label: '检查提前提醒（天）',
                span: SPAN,
                labelCol: LABEL_COL,
                render: () => (
                  <InputOrSpan
                    className={styles.item}
                    placeholder="请输入检查提前提醒（天）"
                    maxLength={50}
                    type={isNotDetail ? 'Input' : 'span'}
                  />
                ),
                options: {
                  getValueFromEvent: e =>
                    e.target.value && e.target.value.replace(/\D*(\d*\.?\d*).*/, '$1'),
                },
              },
              {
                id: 'checkReason',
                label: '检查内容',
                span: SPAN,
                labelCol: LABEL_COL,
                render: () => (
                  <InputOrSpan
                    className={styles.item}
                    placeholder="请输入检查内容"
                    type={isNotDetail ? 'TextArea' : 'span'}
                    autosize={{ minRows: 3 }}
                  />
                ),
              },
              {
                id: 'checkPart',
                label: '检查负责部门',
                span: SPAN,
                labelCol: LABEL_COL,
                render: () =>
                  isNotDetail ? (
                    <TreeSelect
                      placeholder="请选择检查负责部门"
                      allowClear
                      className={styles.item}
                      dropdownClassName={styles.treeSelectDropDown}
                    >
                      {this.renderTreeNodes(departmentDict)}
                    </TreeSelect>
                  ) : (
                      <span>{checkPartName}</span>
                    ),
              },
              {
                id: 'checkGoal',
                label: '检查指标',
                span: SPAN,
                labelCol: LABEL_COL,
                render: () => (
                  <InputOrSpan
                    className={styles.item}
                    placeholder="请输入检查指标"
                    maxLength={50}
                    type={isNotDetail ? 'Input' : 'span'}
                  />
                ),
              },
            ]
            : []),
          {
            id: 'isExam',
            label: '是否检测',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <RadioOrSpan list={TRUE_OR_FALSE} type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail
                ? [
                  {
                    required: true,
                    message: '是否检测不能为空',
                  },
                ]
                : undefined,
            },
          },
          ...(isExam === '1'
            ? [
              {
                id: 'examDay',
                label: '检测周期（天）',
                span: SPAN,
                labelCol: LABEL_COL,
                render: () => (
                  <InputOrSpan
                    className={styles.item}
                    placeholder="请输入检查周期（天）"
                    maxLength={50}
                    type={isNotDetail ? 'Input' : 'span'}
                  />
                ),
                options: {
                  getValueFromEvent: e =>
                    e.target.value && e.target.value.replace(/\D*(\d*\.?\d*).*/, '$1'),
                },
              },
              {
                id: 'examRemind',
                label: '检测提前提醒（天）',
                span: SPAN,
                labelCol: LABEL_COL,
                render: () => (
                  <InputOrSpan
                    className={styles.item}
                    placeholder="请输入检查提前提醒（天）"
                    maxLength={50}
                    type={isNotDetail ? 'Input' : 'span'}
                  />
                ),
                options: {
                  getValueFromEvent: e =>
                    e.target.value && e.target.value.replace(/\D*(\d*\.?\d*).*/, '$1'),
                },
              },
            ]
            : []),
          {
            id: 'isMiantain',
            label: '是否保养',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <RadioOrSpan list={TRUE_OR_FALSE} type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail
                ? [
                  {
                    required: true,
                    message: '是否保养不能为空',
                  },
                ]
                : undefined,
            },
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
        showButtons={false}
      // action={
      //   <Fragment>
      //     <Button onClick={this.handleBackButtonClick}>返回</Button>
      //     {type !== 'detail' ? (
      //       <Button type="primary" onClick={this.handleSubmitButtonClick} loading={uploading}>
      //         提交
      //       </Button>
      //     ) : (
      //       <Button
      //         type="primary"
      //         onClick={this.handleEditButtonClick}
      //         disabled={!hasEditAuthority}
      //         loading={uploading}
      //       >
      //         编辑
      //       </Button>
      //     )}
      //   </Fragment>
      // }
      />
    );
  }

  // 渲染错误信息
  renderErrorInfo () {
    if (!this.form) return null;
    const { getFieldsError } = this.form;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <LegacyIcon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <LegacyIcon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
    );
  }

  // 渲染底部工具栏
  renderFooterToolbar (isDetail, id) {
    const {
      user: {
        currentUser: { permissionCodes },
      },
      productionFacility: { detail: { status } = {} },
    } = this.props;
    const { submitting, uploading } = this.state;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);

    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button
          size="large"
          // onClick={this.handleBackButtonClick}
          onClick={this.goBack}
        >
          返回
        </Button>
        {isDetail ? (
          status !== '1' && (
            <Button
              type="primary"
              size="large"
              onClick={e => router.push(`/facility-management/production-facility/edit/${id}`)}
              disabled={!hasEditAuthority}
            >
              编辑
            </Button>
          )
        ) : (
            <Button
              type="primary"
              size="large"
              loading={submitting || uploading}
              onClick={this.handleSubmitButtonClick}
            >
              提交
            </Button>
          )}
      </FooterToolbar>
    );
  }

  render () {
    const {
      loading,
      match: {
        params: { id },
      },
      route: { name },
    } = this.props;
    const { submitting } = this.state;
    const type = this.getType();
    const title = this.getTitle(type);
    const breadcrumbList = this.getBreadcrumbList(title);
    const isDetail = name === 'detail';

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList} key={type}>
        <Spin spinning={loading || submitting || false}>{this.renderForm()}</Spin>
        {this.renderFooterToolbar(isDetail, id)}
      </PageHeaderLayout>
    );
  }
}
