import React, { Component } from 'react';
import { Button, Spin, message, Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import Text from '@/jingan-components/Text';
import router from 'umi/router';
import { connect } from 'dva';
import {
  LIST_PATH,
  DEFAULT_FORMAT,
  CHECK_TYPES,
} from './List';
import { AuthButton } from '@/utils/customAuth';
import codes from '@/utils/codes'
import { phoneReg } from '@/utils/validate';
import moment from 'moment';
import styles from './Add.less';

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

@connect(({ safetyProductionRegulation, user }) => ({
  safetyProductionRegulation,
  user,
}))
export default class AddOperatingProdures extends Component {

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
    } = this.props;
    const isNotDetail = !location.href.includes('detail');
    if (id) {
      dispatch({
        type: 'safetyProductionRegulation/fetchCheckListDetail',
        payload: { id },
        callback: (success, detail) => {
          if (success) {
            const {
              companyId,
              companyName,
              type,
              checkProject,
              checkWay,
              checkContent,
              checkGist,
              remark,
              name,
              phone,
              accessoryContent,
              startDate,
              endDate,
              status,
              historyType,
              editionCode,
            } = detail;
            this.form && this.form.setFieldsValue({
              company: companyId ? { key: companyId, label: companyName } : undefined,
              type: type || undefined,
              checkProject: checkProject || undefined,
              checkWay: checkWay || undefined,
              checkContent: checkContent || undefined,
              checkGist: checkGist || undefined,
              remark: remark || undefined,
              historyType: isNotDetail && +status === 4 ? '2' : historyType || '1',
              editionCode: isNotDetail && +status === 4 ? (+editionCode + 0.01).toFixed(2) : editionCode || '1.00',
              name: name || undefined,
              phone: phone || undefined,
              expireDate: startDate && endDate ? [moment(startDate), moment(endDate)] : [],
              accessoryContent: accessoryContent ? accessoryContent.map(item => ({ ...item, uid: item.id, url: item.webUrl })) : [],
            });
          } else {
            message.error('获取详情失败，请稍后重试或联系管理人员！');
          }
        },
      })
    }
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

  // 跳转到编辑页面
  handleEditButtonClick = () => {
    const { match: { params: { id } } } = this.props;
    router.push(`/safety-production-regulation/check-list-maintenance/edit/${id}`)
  }

  // 提交
  handleSubmitButtonClick = () => {
    const {
      dispatch,
      match: { params: { id } },
    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      const {
        company,
        expireDate,
        ...resValues
      } = values;
      const [startDate, endDate] = expireDate;
      const payload = {
        ...resValues,
        companyId: company.key,
        startDate: startDate.unix() * 1000,
        endDate: endDate.unix() * 1000,
      };
      const callback = (success, msg) => {
        if (success) {
          message.success('操作成功');
          router.push(LIST_PATH);
        } else {
          message.error(msg || '操作失败');
        }
      }
      if (id) {
        // 如果编辑
        dispatch({
          type: 'safetyProductionRegulation/editCheckList',
          payload: { ...payload, id },
          callback,
        })
      } else {
        dispatch({
          type: 'safetyProductionRegulation/addCheckList',
          payload,
          callback,
        })
      }
    })
  }

  setFormReference = form => {
    this.form = form;
  }

  render () {
    const {
      submitting = false,
      match: { params: { id } },
      user: { isCompany },
      safetyProductionRegulation: {
        checkListDetail: { hgCheckListApproveList = [] } = {},
      },
    } = this.props;
    const href = location.href;
    const isNotDetail = !href.includes('detail');
    const isEdit = href.includes('edit');
    const title = (href.includes('add') && '新增检查表维护') || (href.includes('edit') && '编辑检查表维护') || (href.includes('detail') && '查看检查表维护');
    const breadcrumbList = [
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
        title: '检查表维护',
        name: '检查表维护',
        href: LIST_PATH,
      },
      {
        title: title,
        name: title,
      },
    ];
    const fields = [
      {
        key: '1',
        fields: [
          ...isCompany ? [] : [{
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
          }],
          {
            id: 'type',
            label: '检查类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择检查类型"
                type={isNotDetail ? 'Select' : 'span'}
                list={CHECK_TYPES}
              />
            ),
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '检查类型不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'checkProject',
            label: '检查项目',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入检查项目"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '检查项目不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'checkWay',
            label: '检查方式',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入检查方式"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '检查方式不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'checkContent',
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
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '检查内容不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'checkGist',
            label: '检查依据',
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
          {
            id: 'historyType',
            label: '版本类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <Text transform={VERSION_TYPE_MAPPER} />,
            options: {
              initialValue: '1',
            },
          },
          {
            id: 'editionCode',
            label: '版本号',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <Text transform={VERSION_CODE_MAPPER} />,
            options: {
              initialValue: '1.00',
            },
          },
          {
            id: 'name',
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
            id: 'phone',
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
                { pattern: phoneReg, message: '联系电话格式不正确' },
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
            id: 'accessoryContent',
            label: '附件',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <CustomUpload folder="operationProdures" beforeUpload={this.handleBeforeUpload} type={isNotDetail || 'span'} />,
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
        <Spin spinning={false}>
          <Card title="基础信息" bordered={false}>
            <CustomForm
              mode="multiple"
              fields={fields}
              searchable={false}
              resetable={false}
              refresh={this.refresh}
              ref={this.setFormReference}
            />
          </Card>
          {!isNotDetail && hgCheckListApproveList && hgCheckListApproveList.length > 0 && (
            <Card title="审批信息" bordered={false} style={{ marginTop: '24px' }}>
              {hgCheckListApproveList.map(({ status, firstApproveBy, secondApproveBy, threeApproveBy, approveBy, approveAccessoryContent }, index) => (
                <Card title={`第${index + 1}条信息`} type="inner" key={index} style={{ marginTop: index === 0 ? 'inherit' : '15px' }}>
                  <p>审核意见：<span style={{ color: STATUS_OPTIONS[+status - 2].color }}>{STATUS_OPTIONS[+status - 2].label}</span></p>
                  <p>一级审批人：{firstApproveBy || ''}</p>
                  <p>二级审批人：{secondApproveBy || ''}</p>
                  <p>三级审批人：{threeApproveBy || ''}</p>
                  <p>经办人：{approveBy || ''}</p>
                  <div style={{ display: 'flex' }}>
                    <span>附件：</span>
                    <div>{approveAccessoryContent.map(({ id, fileName, webUrl }) => (
                      <div key={id}><a href={webUrl} target="_blank" rel="noopener noreferrer">{fileName}</a></div>
                    ))}</div>
                  </div>
                </Card>
              ))}
            </Card>
          )}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button style={{ marginRight: '10px' }} onClick={() => { router.goBack() }}>返回</Button>
            {isNotDetail ? (
              <Button type="primary" onClick={this.handleSubmitButtonClick} loading={submitting}>提交</Button>
            ) : (+status === 3 || +status === 4) && (
              <AuthButton code={codes.operatingProcedures.edit} type="primary" onClick={this.handleEditButtonClick}>编辑</AuthButton>
            )}
          </div>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
