import React, { Component, Fragment } from 'react';
import { Button, Spin, message } from 'antd';
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
  DEFAULT_FORMAT,
  LEVELS,
  PROCESS_TYPES,
  REPORT_TYPES,
  REPORT_STATUSES,
} from '../List';
import styles from './index.less';

const SPAN = { span: 24 };
const LABEL_COL = { span: 4 };
const GET_DETAIL = 'accidentReport/getDetail';
const ADD = 'accidentReport/add';
const EDIT = 'accidentReport/edit';
const GET_COMPANY = 'accidentReport/getCompany';
const GET_COMPANY_TYPE_LIST = 'accidentReport/getCompanyTypeList';

@connect(
  ({ accidentReport, user, loading }) => ({
    accidentReport,
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
        type: 'accidentReport/save',
        payload: {
          detail: {},
        },
      });
    },
    add(payload, callback) {
      dispatch({
        type: ADD,
        payload: {
          type: '1',
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
  })
)
export default class ReportOther extends Component {
  state = {
    submitting: false,
  };

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
      user: {
        currentUser: { unitType, unitId, permissionCodes },
      },
      getCompanyTypeList,
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
      getCompanyTypeList();
      if (type !== 'add') {
        // 不考虑id不存在的情况，由request来跳转到500
        getDetail &&
          getDetail({ id }, (success, data) => {
            if (success) {
              const {
                accidentCompanyId,
                companyName,
                regulatoryClassification,
                handleType,
                reportCompany,
                reportType,
                reportStatus,
                provinceId,
                cityId,
                districtId,
                townId,
                address,
                longitude,
                latitude,
                accidentTitle,
                happenTime,
                accidentType,
                accidentLevel,
                economicLoss,
                involvedDangerNum,
                deathNum,
                severeWoundNum,
                minorWoundNum,
                trappedNum,
                missingNum,
                accidentReason,
                siteConditions,
                accidentDescription,
                measures,
                remarks,
                videoUrl,
                chargePerson,
                chargePersonPhone,
                sitePerson,
                sitePersonPhone,
              } = data || {};
              this.form &&
                this.form.setFieldsValue({
                  company: accidentCompanyId
                    ? { key: accidentCompanyId, label: companyName }
                    : undefined,
                  regulatoryClassification: isNumber(regulatoryClassification)
                    ? `${regulatoryClassification}`
                    : undefined,
                  handleType: isNumber(handleType) ? `${handleType}` : undefined,
                  reportCompany: reportCompany || undefined,
                  reportType: isNumber(reportType) ? `${reportType}` : undefined,
                  accidentTitle: accidentTitle || undefined,
                  happenTime: happenTime ? moment(happenTime) : undefined,
                  area: [provinceId, cityId, districtId, townId].filter(v => v),
                  address: address || undefined,
                  coordinate: [longitude, latitude].filter(v => isNumber(v)).join(','),
                  accidentType: accidentType || undefined,
                  accidentLevel: isNumber(accidentLevel) ? `${accidentLevel}` : undefined,
                  economicLoss: isNumber(economicLoss) ? `${economicLoss}` : undefined,
                  involvedDangerNum: isNumber(involvedDangerNum)
                    ? `${involvedDangerNum}`
                    : undefined,
                  deathNum: isNumber(deathNum) ? `${deathNum}` : undefined,
                  severeWoundNum: isNumber(severeWoundNum) ? `${severeWoundNum}` : undefined,
                  minorWoundNum: isNumber(minorWoundNum) ? `${minorWoundNum}` : undefined,
                  trappedNum: isNumber(trappedNum) ? `${trappedNum}` : undefined,
                  missingNum: isNumber(missingNum) ? `${missingNum}` : undefined,
                  accidentReason: accidentReason || undefined,
                  siteConditions: siteConditions || undefined,
                  accidentDescription: accidentDescription || undefined,
                  measures: measures || undefined,
                  remarks: remarks || undefined,
                  videoUrl: videoUrl || undefined,
                  chargePerson: chargePerson || undefined,
                  chargePersonPhone: chargePersonPhone || undefined,
                  sitePerson: sitePerson || undefined,
                  sitePersonPhone: sitePersonPhone || undefined,
                });
              setTimeout(() => {
                // 使用异步解决关联问题
                this.form &&
                  this.form.setFieldsValue({
                    reportStatus: isNumber(reportStatus) ? `${reportStatus}` : undefined,
                  });
              }, 0);
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
    return { add: '新增事故报告', detail: '事故报告详情', edit: '编辑事故报告' }[type];
  };

  getBreadcrumbList = title => {
    return [
      { title: '首页', name: '首页', href: '/' },
      { title: '事故管理', name: '事故管理' },
      { title: '事故报告', name: '事故报告', href: LIST_PATH },
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
      accidentReport: { detail: { id } = {} },
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const {
          company,
          area: [provinceId, cityId, districtId, townId],
          coordinate,
          ...rest
        } = values;
        const [longitude, latitude] = (coordinate || '').split(',');
        const payload = {
          id,
          accidentCompanyId: +unitType !== 4 ? company.key : unitId,
          // accidentCompanyId: company.key,
          provinceId,
          cityId,
          districtId,
          townId,
          longitude,
          latitude,
          ...rest,
        };
        this.setState({
          submitting: true,
        });
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
      const { getCompany } = this.props;
      getCompany(
        {
          id: company.key,
        },
        (success, data) => {
          if (success) {
            const {
              practicalProvince: provinceId,
              practicalCity: cityId,
              practicalDistrict: districtId,
              practicalTown: townId,
              practicalAddress: address,
              longitude,
              latitude,
              regulatoryClassification,
            } = data || {};
            this.form &&
              this.form.setFieldsValue({
                area: [provinceId, cityId, districtId, townId].filter(v => v),
                address,
                coordinate: [longitude, latitude].filter(v => isNumber(v)).join(','),
                regulatoryClassification: isNumber(regulatoryClassification)
                  ? `${regulatoryClassification}`
                  : undefined,
              });
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
    const {
      provinceId,
      cityId,
      districtId,
      townId,
      address,
      longitude,
      latitude,
      accidentTitle,
      happenTime,
      accidentType,
      accidentLevel,
      economicLoss,
      involvedDangerNum,
      deathNum,
      severeWoundNum,
      minorWoundNum,
      trappedNum,
      missingNum,
      accidentReason,
      siteConditions,
      accidentDescription,
      measures,
      remarks,
      videoUrl,
      chargePerson,
      chargePersonPhone,
      sitePerson,
      sitePersonPhone,
    } = data || {};
    this.form &&
      this.form.setFieldsValue({
        accidentTitle: accidentTitle || undefined,
        happenTime: happenTime ? moment(happenTime) : undefined,
        area: [provinceId, cityId, districtId, townId].filter(v => v),
        address: address || undefined,
        coordinate: [longitude, latitude].filter(v => isNumber(v)).join(','),
        accidentType: accidentType || undefined,
        accidentLevel: isNumber(accidentLevel) ? `${accidentLevel}` : undefined,
        economicLoss: economicLoss || undefined,
        involvedDangerNum: involvedDangerNum || undefined,
        deathNum: deathNum || undefined,
        severeWoundNum: severeWoundNum || undefined,
        minorWoundNum: minorWoundNum || undefined,
        trappedNum: trappedNum || undefined,
        missingNum: missingNum || undefined,
        accidentReason: accidentReason || undefined,
        siteConditions: siteConditions || undefined,
        accidentDescription: accidentDescription || undefined,
        measures: measures || undefined,
        remarks: remarks || undefined,
        videoUrl: videoUrl || undefined,
        chargePerson: chargePerson || undefined,
        chargePersonPhone: chargePersonPhone || undefined,
        sitePerson: sitePerson || undefined,
        sitePersonPhone: sitePersonPhone || undefined,
      });
  };

  renderForm() {
    const {
      user: {
        currentUser: { unitType, unitId, permissionCodes },
      },
      accidentReport: {
        detail: {
          companyId,
          companyName,
          reportType,
          provinceName,
          cityName,
          districtName,
          townName,
          accidentTypeDesc,
          accidentTypeParentIds,
          accidentType,
        } = {},
        companyTypeList = [],
      },
    } = this.props;
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
    const realReportType = values.reportType || reportType;

    const fields = [
      {
        key: 1,
        fields: [
          ...(isNotCompany
            ? [
                {
                  id: 'company',
                  label: '事故单位',
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
                            message: '事故单位不能为空',
                            transform: value => value && value.label,
                          },
                        ]
                      : undefined,
                  },
                },
              ]
            : []),
          {
            id: 'regulatoryClassification',
            label: '事故企业类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择事故企业类型"
                list={companyTypeList}
                type={isNotDetail ? 'Select' : 'span'}
                disabled
              />
            ),
          },
          {
            id: 'handleType',
            label: '事故处理类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择事故处理类型"
                list={PROCESS_TYPES}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '事故处理类型不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'reportCompany',
            label: '报送单位',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入报送单位"
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
                      message: '报送单位不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'reportType',
            label: '报送类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <RadioOrSpan list={REPORT_TYPES} type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '报送类型不能为空',
                    },
                  ]
                : undefined,
            },
          },
          ...(realReportType === '1'
            ? [
                {
                  id: 'reportStatus',
                  label: '报送状态',
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () => (
                    <SelectOrSpan
                      className={styles.item}
                      placeholder="请选择报送状态"
                      list={REPORT_STATUSES}
                      type={isNotDetail ? 'Select' : 'span'}
                    />
                  ),
                  options: {
                    rules: isNotDetail
                      ? [
                          {
                            required: true,
                            message: '报送状态不能为空',
                          },
                        ]
                      : undefined,
                  },
                },
              ]
            : []),
          ...(isNotDetail
            ? [
                {
                  id: 'accidentInfo',
                  label: '事故信息',
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () => (
                    <AccidentInfo
                      companyId={realCompanyId}
                      onChange={this.handleQuickReportSelect}
                    />
                  ),
                },
              ]
            : []),
          {
            id: 'accidentTitle',
            label: '事故信息标题',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入事故信息标题"
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
                      message: '事故信息标题不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'happenTime',
            label: '事故发生时间',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <DatePickerOrSpan
                className={styles.item}
                type={isNotDetail ? 'DatePicker' : 'span'}
                format={DEFAULT_FORMAT}
                placeholder="请选择事故发生时间"
                showTime
                allowClear={false}
                unknown=""
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      type: 'object',
                      message: '事故发生时间不能为空',
                    },
                  ]
                : undefined,
            },
          },

          {
            id: 'area',
            label: '所在区域',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <AreaSelect className={styles.item} />
              ) : (
                <span>
                  {[provinceName, cityName, districtName, townName].filter(v => v).join('')}
                </span>
              ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      type: 'array',
                      required: true,
                      min: 1,
                      message: '所在区域不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'address',
            label: '事故发生详细地址',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入事故发生详细地址"
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
                      message: '事故发生详细地址不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'coordinate',
            label: '经纬度',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <MapCoordinate className={styles.item} disabled={!isNotDetail} />,
          },
          {
            id: 'accidentType',
            label: '事故类型代码',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () =>
              isNotDetail ? (
                <TypeSelect
                  key={accidentType}
                  parentIds={accidentTypeParentIds}
                  className={styles.item}
                />
              ) : (
                <span>{accidentTypeDesc}</span>
              ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '事故类型代码不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'accidentLevel',
            label: '事故级别',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择事故级别"
                list={LEVELS}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '事故级别不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'economicLoss',
            label: '直接经济损失（万）',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入直接经济损失"
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
            id: 'involvedDangerNum',
            label: '涉险人数',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入涉险人数"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              getValueFromEvent: e => e.target.value && e.target.value.replace(/\D*(\d*).*/, '$1'),
            },
          },
          {
            id: 'deathNum',
            label: '死亡人数',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入死亡人数"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              getValueFromEvent: e => e.target.value && e.target.value.replace(/\D*(\d*).*/, '$1'),
            },
          },
          {
            id: 'severeWoundNum',
            label: '重伤人数',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入重伤人数"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              getValueFromEvent: e => e.target.value && e.target.value.replace(/\D*(\d*).*/, '$1'),
            },
          },
          {
            id: 'minorWoundNum',
            label: '轻伤人数',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入轻伤人数"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              getValueFromEvent: e => e.target.value && e.target.value.replace(/\D*(\d*).*/, '$1'),
            },
          },
          {
            id: 'trappedNum',
            label: '被困人数',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入被困人数"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              getValueFromEvent: e => e.target.value && e.target.value.replace(/\D*(\d*).*/, '$1'),
            },
          },
          {
            id: 'missingNum',
            label: '失踪人数',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入失踪人数"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              getValueFromEvent: e => e.target.value && e.target.value.replace(/\D*(\d*).*/, '$1'),
            },
          },
          {
            id: 'accidentReason',
            label: '事故原因初步分析',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入事故原因初步分析"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
          },
          {
            id: 'siteConditions',
            label: '事故现场情况',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入事故现场情况"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
          },
          {
            id: 'accidentDescription',
            label: '事故简要经过',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入事故简要经过"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
          },
          {
            id: 'measures',
            label: '已采取措施',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入已采取措施"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
          },
          {
            id: 'remarks',
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
          {
            id: 'videoUrl',
            label: '视频链接地址',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入视频链接地址"
                maxLength={256}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
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
          },
          {
            id: 'chargePersonPhone',
            label: '经办人电话',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入经办人电话"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
          },
          {
            id: 'sitePerson',
            label: '现场联络员',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入现场联络员姓名"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
          },
          {
            id: 'sitePersonPhone',
            label: '现场联络员电话',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入现场联络员电话"
                maxLength={50}
                type={isNotDetail ? 'Input' : 'span'}
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
