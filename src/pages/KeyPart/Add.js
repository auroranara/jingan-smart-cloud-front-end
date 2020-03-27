import React, { Component } from 'react';
import { Button, Spin, message, Card, TreeSelect } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import router from 'umi/router';
import { connect } from 'dva';
import { AuthButton } from '@/utils/customAuth';
import codes from '@/utils/codes'
import styles from './Add.less';
import { treeData, partClassification } from './List.js';

const SPAN = { span: 24 };
const LABEL_COL = { span: 6 };
const LIST_PATH = '/facility-management/key-part/list';

@connect(({ safetyProductionRegulation, user, account, keyPart }) => ({
  safetyProductionRegulation,
  user,
  account,
  keyPart,
}))
export default class AddOperatingProdures extends Component {

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
      user: { isCompany, currentUser },
    } = this.props;
    if (id) {
      dispatch({
        type: 'keyPart/fetchKeyPartDetail',
        payload: { id },
        callback: (success, detail) => {
          if (success) {
            const {
              companyName,
              facilityName,
              department,
              location,
              name,
              linkman,
              type,
              contingencyPlanContent,
              dangerFactor,
              risk,
              disposalMeasures,
              accessoryContent,
              remark,
            } = detail;
            const companyId = isCompany ? currentUser.companyId : detail.companyId;
            this.form && this.form.setFieldsValue({
              company: companyId ? { key: companyId, label: companyName } : undefined,
              facilityName: facilityName || undefined,
              // department: department || undefined,
              location: location || undefined,
              name,
              linkman,
              type,
              contingencyPlanContent: contingencyPlanContent ? contingencyPlanContent.map(item => ({ ...item, uid: item.id, url: item.webUrl })) : [],
              dangerFactor: dangerFactor || undefined,
              risk,
              disposalMeasures,
              accessoryContent: accessoryContent ? accessoryContent.map(item => ({ ...item, uid: item.id, url: item.webUrl })) : [],
              remark: remark || undefined,
            });
            this.fetchDepartmentList({
              payload: { companyId },
              callback: () => {
                setTimeout(() => {
                  this.form && this.form.setFieldsValue({ department });
                }, 0);
              },
            });
          } else {
            message.error('获取详情失败，请稍后重试或联系管理人员！');
          }
        },
      })
    } else if (isCompany) {
      this.fetchDepartmentList({ payload: { companyId: currentUser.companyId } });
    } else {
      this.resetDepartment();
    }
  }

  // 获取部门列表
  fetchDepartmentList = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchDepartmentList',
      ...actions,
    })
  }

  // 清空部门列表
  resetDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/queryDepartment',
      payload: [],
    })
  }

  // 上传前
  handleBeforeUpload = (file) => {
    const isJpgOrPng = file.type.includes('image') || file.type.includes('pdf');
    if (!isJpgOrPng) {
      message.error('文件上传只支持Word文档或PDF格式文件!');
    }
    // const isLt2M = file.size / 1024 / 1024 <= 2;
    // if (!isLt2M) {
    //   message.error('文件上传最大支持2MB!');
    // }
    return isJpgOrPng;
  }

  handleBeforeUploadImage = file => {
    const isJpgOrPng = file.type.includes('image');
    if (!isJpgOrPng) {
      message.error('文件上传只支持图片!');
    }
    return isJpgOrPng;
  }

  // 跳转到编辑页面
  handleEditButtonClick = () => {
    const { match: { params: { id } } } = this.props;
    router.push(`/safety-production-regulation/operating-procedures/edit/${id}`)
  }

  // 提交
  handleSubmitButtonClick = () => {
    const {
      dispatch,
      match: { params: { id } },
      user: { isCompany, currentUser },

    } = this.props;
    const { validateFieldsAndScroll } = this.form;
    validateFieldsAndScroll((err, values) => {
      if (err) return;
      const {
        company,
        ...resValues
      } = values;
      const payload = {
        ...resValues,
        companyId: isCompany ? currentUser.companyId : company.key,
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
          type: 'keyPart/editKeyPart',
          payload: { ...payload, id },
          callback,
        })
      } else {
        dispatch({
          type: 'keyPart/addKeyPart',
          payload,
          callback,
        })
      }
    })
  }

  // 企业发生变化
  handleCompanyChange = company => {
    if (company && company.key !== company.label) {
      this.fetchDepartmentList({ payload: { companyId: company.key } });
      this.form && this.form.setFieldsValue({ department: undefined });
    }
  }

  setFormReference = form => {
    this.form = form;
  }

  render () {
    const {
      submitting = false,
      user: { isCompany },
      account: { departments },
      keyPart: { detail = {} },
    } = this.props;
    const href = location.href;
    const isNotDetail = !href.includes('detail');
    const isEdit = href.includes('edit');
    const title = (href.includes('add') && '新增关键装置重点部位') || (href.includes('edit') && '编辑关键装置重点部位') || (href.includes('detail') && '查看关键装置重点部位');
    const treeList = treeData(departments);
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '设备设施管理',
        name: '设备设施管理',
      },
      {
        title: '关键装置重点部位',
        name: '关键装置重点部位',
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
            render: () => (
              <CompanySelect
                className={styles.item}
                disabled={isEdit}
                type={isNotDetail || 'span'}
                onChange={this.handleCompanyChange}
              />
            ),
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
            id: 'facilityName',
            label: '装置/部位名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入装置/部位名称" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '装置/部位名称不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'department',
            label: '所属部门',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => isNotDetail ? (
              <TreeSelect
                className={styles.item}
                allowClear
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择所属部门"
              >
                {treeList}
              </TreeSelect>
            ) : <span>{detail.departmentName}</span>,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '所属部门不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'location',
            label: '具体位置',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入具体位置" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '具体位置不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'name',
            label: '负责人姓名',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入负责人姓名" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '负责人姓名不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'linkman',
            label: '联系人',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入联系人" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '联系人不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'type',
            label: '装置部位分类',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择装置部位分类"
                type={isNotDetail ? 'Select' : 'span'}
                list={partClassification}
              />
            ),
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '装置部位分类不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'contingencyPlanContent',
            label: '相关应急预案',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <CustomUpload folder="operationProdures" type={isNotDetail || 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  type: 'boolean',
                  required: true,
                  transform: value => value && value.every(({ status }) => status === 'done'),
                  message: '相关应急预案不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'dangerFactor',
            label: '主要危险有害因素',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入主要危险有害因素"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '主要危险有害因素不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'risk',
            label: '易导致风险',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入易导致风险"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '易导致风险不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'disposalMeasures',
            label: '应急处置措施',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <InputOrSpan
                className={styles.item}
                placeholder="请输入应急处置措施"
                type={isNotDetail ? 'TextArea' : 'span'}
                autosize={{ minRows: 3 }}
              />
            ),
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '应急处置措施不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'accessoryContent',
            label: '现场照片',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <CustomUpload folder="operationProdures" beforeUpload={this.handleBeforeUploadImage} type={isNotDetail || 'span'} />,
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
