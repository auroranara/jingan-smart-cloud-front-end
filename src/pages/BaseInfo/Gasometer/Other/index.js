import React, { Component, Fragment } from 'react';
import { Button, Spin, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import Capacity from './Capacity';
import Medium from './Medium';
import MajorHazard from './MajorHazard';
import router from 'umi/router';
import { connect } from 'dva';
import { bind, debounce } from 'lodash-decorators';
import { isNumber } from '@/utils/utils';
import { TITLE, LIST_PATH, EDIT_PATH, EDIT_CODE, TYPES, MAJOR_HAZARD_STATUSES } from '../List';
import styles from './index.less';

export const LEVELS = [
  {
    key: '1',
    value: '甲',
  },
  {
    key: '2',
    value: '乙',
  },
  {
    key: '3',
    value: '丙',
  },
  {
    key: '4',
    value: '丁',
  },
  {
    key: '5',
    value: '戊',
  },
];
const GET_DETAIL = 'gasometer/getDetail';
const ADD = 'gasometer/add';
const EDIT = 'gasometer/edit';
const SPAN = { span: 24 };
const LABEL_COL = { span: 6 };
const WHETHER_LIST = [{ key: '1', value: '有' }, { key: '0', value: '无' }];

@connect(
  ({ user, gasometer: { detail }, loading }) => ({
    user,
    detail,
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
        type: 'gasometer/save',
        payload: {
          detail: {},
        },
      });
    },
    add(payload, callback) {
      dispatch({
        type: ADD,
        payload,
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
  })
)
export default class GasometerOther extends Component {
  state = {
    submitting: false,
  };

  componentDidMount() {
    const {
      getDetail,
      setDetail,
      match: {
        params: { id },
      },
    } = this.props;
    setDetail();
    if (id) {
      getDetail(
        {
          id,
        },
        (success, data) => {
          if (success) {
            const {
              companyId,
              companyName,
              gasholderType,
              unifiedCode,
              gasholderName,
              designCapacity,
              // designCapacityUnit,
              designKpa,
              chineName,
              storageMedium,
              // majorHazard,
              regionalLocation,
              safeSpace,
              deviceSpace,
              cofferdam,
              cofferdamArea,
              fireHazardRate,
              torch,
              warmCool,
              autoSpray,
              fireWaterFoam,
              scenePhoto,
            } = data;
            this.form &&
              this.form.setFieldsValue({
                company: companyId ? { key: companyId, label: companyName } : undefined,
                gasholderType: isNumber(gasholderType) ? gasholderType : undefined,
                unifiedCode: unifiedCode || undefined,
                gasholderName: gasholderName || undefined,
                designCapacity: designCapacity || undefined,
                designKpa: isNumber(designKpa) ? designKpa : undefined,
                storageMedium: storageMedium ? { id: storageMedium, chineName } : undefined,
                // majorHazard: isNumber(majorHazard) ? majorHazard : undefined,
                regionalLocation: regionalLocation || undefined,
                safeSpace: isNumber(safeSpace) ? safeSpace : undefined,
                deviceSpace: isNumber(deviceSpace) ? deviceSpace : undefined,
                cofferdam: isNumber(cofferdam) ? cofferdam : undefined,
                fireHazardRate: isNumber(fireHazardRate) ? fireHazardRate : undefined,
                torch: isNumber(torch) ? torch : undefined,
                warmCool: isNumber(warmCool) ? warmCool : undefined,
                autoSpray: isNumber(autoSpray) ? autoSpray : undefined,
                fireWaterFoam: isNumber(fireWaterFoam) ? fireWaterFoam : undefined,
                scenePhoto: scenePhoto || [],
              });
            setTimeout(() => {
              this.form &&
                this.form.setFieldsValue({
                  cofferdamArea: isNumber(cofferdamArea) ? cofferdamArea : undefined,
                });
            });
          } else {
            message.error('获取详情失败，请稍后重试或联系管理人员！');
          }
        }
      );
    }
  }

  componentWillUnmount() {
    const { setDetail } = this.props;
    setDetail();
  }

  getNavigation = () => {
    const {
      route: { name },
    } = this.props;
    return name;
  };

  getTitle = type => {
    return {
      add: '新增气柜',
      edit: '编辑气柜',
      detail: '气柜详情',
    }[type];
  };

  getBreadcrumbList = title => {
    return [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '基本信息',
        name: '基本信息',
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
      detail: { id } = {},
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        const { company, storageMedium: { id: storageMedium } = {}, scenePhoto, ...rest } = values;
        const payload = {
          id,
          companyId: +unitType !== 4 ? company.key : unitId,
          storageMedium,
          scenePhoto: scenePhoto && scenePhoto.length > 0 ? JSON.stringify(scenePhoto) : undefined,
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

  // 上传前
  handleBeforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('文件上传只支持JPG/PNG格式!');
    }
    // const isLt2M = file.size / 1024 / 1024 <= 2;
    // if (!isLt2M) {
    //   message.error('文件上传最大支持2MB!');
    // }
    return isJpgOrPng;
  };

  render() {
    const {
      user: {
        currentUser: { permissionCodes, unitType, unitId },
      },
      detail: { companyId } = {},
      loading = false,
    } = this.props;
    const { submitting } = this.state;
    const isNotCompany = unitType !== 4;
    const values = (this.form && this.form.getFieldsValue()) || {};
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);
    const navigation = this.getNavigation();
    const title = this.getTitle(navigation);
    const breadcrumbList = this.getBreadcrumbList(title);
    const isNotDetail = navigation !== 'detail';
    const isEdit = navigation === 'edit';
    const realCompanyId = isNotCompany
      ? values.company && values.company.key !== values.company.label
        ? values.company.key
        : companyId
      : unitId;
    const fields = [
      {
        key: '1',
        fields: [
          ...(isNotCompany
            ? [
                {
                  id: 'company',
                  label: '单位名称',
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () => (
                    <CompanySelect
                      className={styles.item}
                      disabled={isEdit}
                      type={isNotDetail || 'span'}
                    />
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
            id: 'unifiedCode',
            label: '统一编码',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入统一编码"
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '统一编码不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'gasholderName',
            label: '气柜名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入气柜名称"
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '气柜名称不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'gasholderType',
            label: '气柜类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择气柜类型"
                list={TYPES}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '气柜类型不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'regionalLocation',
            label: '区域位置',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入区域位置"
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '区域位置不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'designCapacity',
            label: '设计柜容（m³）',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入设计柜容"
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '设计柜容不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'designKpa',
            label: '设计压力（KPa）',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入设计压力"
                type={isNotDetail ? 'Input' : 'span'}
              />
            ),
            options: {
              getValueFromEvent: e => e.target.value && e.target.value.replace(/\D*(\d*).*/, '$1'),
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      whitespace: true,
                      message: '设计压力不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'storageMedium',
            label: '存储介质',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <Medium
                className={styles.item}
                companyId={realCompanyId}
                placeholder="请选择存储介质"
                type={isNotDetail || 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '存储介质不能为空',
                    },
                  ]
                : undefined,
            },
          },
          // {
          //   id: 'majorHazard',
          //   label: '是否构成重大危险源',
          //   span: SPAN,
          //   labelCol: LABEL_COL,
          //   render: () => <SelectOrSpan className={styles.item} placeholder="请选择是否构成重大危险源" list={MAJOR_HAZARD_STATUSES} type={isNotDetail ? 'Select' : 'span'} />,
          //   options: {
          //     rules: isNotDetail ? [
          //       {
          //         required: true,
          //         message: '是否构成重大危险源不能为空',
          //       },
          //     ] : undefined,
          //   },
          // },
          {
            id: 'safeSpace',
            label: '周边安全防护间距（m）',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入周边安全防护间距"
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
                      whitespace: true,
                      message: '周边安全防护间距不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'deviceSpace',
            label: '与周边装置的距离（m）',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入与周边装置的距离"
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
                      whitespace: true,
                      message: '与周边装置的距离不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'cofferdam',
            label: '有无围堰',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择有无围堰"
                list={WHETHER_LIST}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '有无围堰不能为空',
                    },
                  ]
                : undefined,
            },
          },
          ...(+values.cofferdam
            ? [
                {
                  id: 'cofferdamArea',
                  label: '围堰所围面积（m²）',
                  span: SPAN,
                  labelCol: LABEL_COL,
                  render: () => (
                    <InputOrSpan
                      className={styles.item}
                      placeholder="请输入围堰所围面积"
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
                            whitespace: true,
                            message: '围堰所围面积不能为空',
                          },
                        ]
                      : undefined,
                  },
                },
              ]
            : []),
          {
            id: 'fireHazardRate',
            label: '火灾危险性等级',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择火灾危险性等级"
                list={LEVELS}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '火灾危险性等级不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'torch',
            label: '是否配套火柜',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择是否配套火柜"
                list={MAJOR_HAZARD_STATUSES}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '是否配套火柜不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'warmCool',
            label: '是否设置保温/保冷',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择是否设置保温/保冷"
                list={MAJOR_HAZARD_STATUSES}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '是否设置保温/保冷不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'autoSpray',
            label: '是否设置自动喷淋',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择是否设置自动喷淋"
                list={MAJOR_HAZARD_STATUSES}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '是否设置自动喷淋不能为空',
                    },
                  ]
                : undefined,
            },
          },
          {
            id: 'fireWaterFoam',
            label: '是否设置消防水炮/泡沫炮',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择是否设置消防水炮/泡沫炮"
                list={MAJOR_HAZARD_STATUSES}
                type={isNotDetail ? 'Select' : 'span'}
              />
            ),
            options: {
              rules: isNotDetail
                ? [
                    {
                      required: true,
                      message: '是否设置消防水炮/泡沫炮不能为空',
                    },
                  ]
                : undefined,
            },
          },
          // {
          //   id: 'scenePhoto',
          //   label: '现场照片',
          //   span: SPAN,
          //   labelCol: LABEL_COL,
          //   render: () => (
          //     <CustomUpload
          //       folder="gasometer"
          //       beforeUpload={this.handleBeforeUpload}
          //       type={isNotDetail || 'span'}
          //     />
          //   ),
          // },
        ],
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Spin spinning={loading}>
          <CustomForm
            mode="multiple"
            fields={fields}
            searchable={false}
            resetable={false}
            refresh={this.refresh}
            action={
              <Fragment>
                <Button onClick={this.handleBackButtonClick}>返回</Button>
                {isNotDetail ? (
                  <Button
                    type="primary"
                    onClick={this.handleSubmitButtonClick}
                    loading={submitting}
                  >
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
            ref={this.setFormReference}
          />
        </Spin>
      </PageHeaderLayout>
    );
  }
}
