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
import debounce from 'lodash/debounce';
import {
  TITLE,
  LIST_PATH,
  EDIT_PATH,
  EDIT_CODE,
  TYPES,
  MAJOR_HAZARD_STATUSES,
} from '../List';
import styles from './index.less';

export const LEVELS = [
  {
    key: '0',
    value: '甲',
  },
  {
    key: '1',
    value: '乙',
  },
  {
    key: '2',
    value: '丙',
  },
  {
    key: '3',
    value: '丁',
  },
  {
    key: '4',
    value: '戊',
  },
];
const GET_DETAIL = 'gasometer/getDetail';
const ADD = 'gasometer/add';
const EDIT = 'gasometer/edit';
const SPAN = { span: 24 };
const LABEL_COL = { span: 6 };

@connect(({
  user,
  gasometer: {
    detail,
  },
  loading,
}) => ({
  user,
  detail,
  loading: loading.effects[GET_DETAIL],
  adding: loading.effects[ADD],
  editing: loading.effects[EDIT],
}), (dispatch) => ({
  getDetail(payload, callback) {
    dispatch({
      type: GET_DETAIL,
      payload,
      callback,
    });
  },
  setDetail() {
    dispatch({
      type: 'save',
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
}))
export default class GasometerOther extends Component {
  constructor(props) {
    super(props);
    this.debouncedRefresh = debounce(this.refresh, 300);
  }

  componentDidMount() {
    const { getDetail, setDetail, match: { params: { id } } } = this.props;
    setDetail();
    if (id) {
      getDetail({
        id,
      }, this.refresh);
    }
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
      add: '新增气柜',
      edit: '编辑气柜',
      detail: '气柜详情',
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
        title: '重大危险源基本信息',
        name: '重大危险源基本信息',
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

  refresh = () => {
    setTimeout(() => this.forceUpdate(), 0)
    // this.forceUpdate();
  }

  // 返回按钮点击事件
  handleBackButtonClick = () => {
    router.goBack();
  }

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
      detail: {
        id,
      }={},
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((errors, values) => {
      console.log(values);
      if (!errors) {
        const { company, ...rest } = values;
        const payload = {
          id,
          companyId: +unitType !== 4 ? company.key : unitId,
          ...rest,
        };
        (id ? edit : add)(payload, (isSuccess) => {
          if (isSuccess) {
            message.success(`${id ? '编辑' : '新增'}成功！`);
            router.push(LIST_PATH);
          } else {
            message.error(`${id ? '编辑' : '新增'}失败，请稍后重试！`);
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
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('文件上传只支持JPG/PNG格式!');
    }
    // const isLt2M = file.size / 1024 / 1024 <= 2;
    // if (!isLt2M) {
    //   message.error('文件上传最大支持2MB!');
    // }
    return isJpgOrPng;
  }

  render() {
    const {
      user: {
        currentUser: {
          permissionCodes,
          unitType,
        },
      },
      detail: {
        companyId,
        companyName,
        type,
        code,
        name,
        capacity,
        capacityUnit,
        pressure,
        medium,
        isMajorHazard,
        majorHazard,
        address,
        gap,
        distance,
        hasCofferdam,
        area,
        level,
        hasFireTank,
        hasInsulation,
        hasSprinkler,
        hasFireControl,
        fileList,
      }={},
      loading,
      adding,
      editing,
    } = this.props;
    const values = this.form && this.form.getFieldsValue() || {};
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
              initialValue: companyId && { key: companyId, label: companyName },
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
            id: 'type',
            label: '气柜类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <SelectOrSpan className={styles.item} placeholder="请选择气柜类型" list={TYPES} type={isNotDetail ? 'Select' : 'span'} />,
            options: {
              initialValue: type,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '气柜类型不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'code',
            label: '统一编码',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入统一编码" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              initialValue: code,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '统一编码不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'name',
            label: '气柜名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入气柜名称" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              initialValue: name,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '气柜名称不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'capacity',
            label: '设计柜容',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <Capacity className={styles.item} placeholder="请输入设计柜容" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              initialValue: [capacity, capacityUnit || 'L'],
              rules: isNotDetail ? [
                {
                  required: true,
                  transform: value => value && value[0],
                  message: '设计柜容不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'pressure',
            label: '设计压力',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入设计压力" addonAfter="KPa" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              initialValue: pressure,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '设计压力不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'medium',
            label: '存储介质',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <Medium className={styles.item} placeholder="请选择存储介质" type={isNotDetail || 'span'} />,
            options: {
              initialValue: medium,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '存储介质不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'isMajorHazard',
            label: '是否构成重大危险源',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <SelectOrSpan className={styles.item} placeholder="请选择是否构成重大危险源" list={MAJOR_HAZARD_STATUSES} type={isNotDetail ? 'Select' : 'span'} />,
            options: {
              initialValue: isMajorHazard,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '是否构成重大危险源不能为空',
                },
              ] : undefined,
            },
          },
          ...(+values.isMajorHazard ? [
            {
              id: 'majorHazard',
              label: '所属危险化学品重大危险源单元',
              span: SPAN,
              labelCol: LABEL_COL,
              render: () => <MajorHazard className={styles.item} placeholder="请选择所属危险化学品重大危险源单元" type={isNotDetail || 'span'} />,
              options: {
                initialValue: majorHazard,
                rules: isNotDetail ? [
                  {
                    required: true,
                    message: '所属危险化学品重大危险源单元不能为空',
                  },
                ] : undefined,
              },
            },
          ] : []),
          {
            id: 'address',
            label: '区域位置',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入区域位置" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              initialValue: address,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '区域位置不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'gap',
            label: '周边安全防护间距',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入周边安全防护间距" addonAfter="m" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              initialValue: gap,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '周边安全防护间距不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'distance',
            label: '与周边装置的距离',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入与周边装置的距离" addonAfter="m" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              initialValue: distance,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '与周边装置的距离不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'hasCofferdam',
            label: '是否有围堰',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <SelectOrSpan className={styles.item} placeholder="请选择是否有围堰" list={MAJOR_HAZARD_STATUSES} type={isNotDetail ? 'Select' : 'span'} />,
            options: {
              initialValue: hasCofferdam,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '是否有围堰不能为空',
                },
              ] : undefined,
            },
          },
          ...(+values.hasCofferdam ? [
            {
              id: 'area',
              label: '围堰所围面积',
              span: SPAN,
              labelCol: LABEL_COL,
              render: () => <InputOrSpan className={styles.item} placeholder="请输入围堰所围面积" addonAfter="m²" type={isNotDetail ? 'Input' : 'span'} />,
              options: {
                initialValue: area,
                rules: isNotDetail ? [
                  {
                    required: true,
                    message: '围堰所围面积不能为空',
                  },
                ] : undefined,
              },
            },
          ] : []),
          {
            id: 'level',
            label: '火灾危险性等级',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <SelectOrSpan className={styles.item} placeholder="请选择火灾危险性等级" list={LEVELS} type={isNotDetail ? 'Select' : 'span'} />,
            options: {
              initialValue: level,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '火灾危险性等级不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'hasFireTank',
            label: '是否配套火柜',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <SelectOrSpan className={styles.item} placeholder="请选择是否配套火柜" list={MAJOR_HAZARD_STATUSES} type={isNotDetail ? 'Select' : 'span'} />,
            options: {
              initialValue: hasFireTank,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '是否配套火柜不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'hasInsulation',
            label: '是否设置保温/保冷',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <SelectOrSpan className={styles.item} placeholder="请选择是否设置保温/保冷" list={MAJOR_HAZARD_STATUSES} type={isNotDetail ? 'Select' : 'span'} />,
            options: {
              initialValue: hasInsulation,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '是否设置保温/保冷不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'hasSprinkler',
            label: '是否设置自动喷淋',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <SelectOrSpan className={styles.item} placeholder="请选择是否设置自动喷淋" list={MAJOR_HAZARD_STATUSES} type={isNotDetail ? 'Select' : 'span'} />,
            options: {
              initialValue: hasSprinkler,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '是否设置自动喷淋不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'hasFireControl',
            label: '是否设置消防水炮/泡沫炮',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <SelectOrSpan className={styles.item} placeholder="请选择是否设置消防水炮/泡沫炮" list={MAJOR_HAZARD_STATUSES} type={isNotDetail ? 'Select' : 'span'} />,
            options: {
              initialValue: hasFireControl,
              rules: isNotDetail ? [
                {
                  required: true,
                  message: '是否设置消防水炮/泡沫炮不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'fileList',
            label: '现场照片',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? <CustomUpload folder="gasometer" beforeUpload={this.handleBeforeUpload} /> : (
              <div>
                {fileList && fileList.map(({ webUrl, name }, index) => (
                  <div key={index}>
                    <a className={styles.clickable} href={webUrl} target="_blank" rel="noopener noreferrer">{name}</a>
                  </div>
                ))}
              </div>
            ),
            options: {
              initialValue: fileList || [],
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
        <Spin spinning={loading || false}>
          <CustomForm
            mode="multiple"
            fields={fields}
            searchable={false}
            resetable={false}
            refresh={this.debouncedRefresh}
            action={(
              <Fragment>
                <Button onClick={this.handleBackButtonClick}>返回</Button>
                {isNotDetail ? (
                  <Button type="primary" onClick={this.handleSubmitButtonClick} loading={adding || editing || false}>提交</Button>
                ) : (
                  <Button type="primary" onClick={this.handleEditButtonClick} disabled={!hasEditAuthority}>编辑</Button>
                )}
              </Fragment>
            )}
            ref={this.setFormReference}
          />
        </Spin>
      </PageHeaderLayout>
    );
  }
}
