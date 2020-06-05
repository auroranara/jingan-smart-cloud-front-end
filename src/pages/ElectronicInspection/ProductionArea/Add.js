import React, { Component } from 'react';
import { Button, Spin, message, Card, TreeSelect } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import { AuthButton } from '@/utils/customAuth';
import codes from '@/utils/codes'
import { treeData } from './List.js';
import PersonSelect from '../PersonSelect';
import { genGoBack } from '@/utils/utils';

const SPAN = { span: 24 };
const LABEL_COL = { span: 6 };
const LIST_PATH = '/electronic-inspection/production-area/list';

@connect(({ safetyProductionRegulation, user, account, electronicInspection }) => ({
  safetyProductionRegulation,
  user,
  account,
  electronicInspection,
}))
export default class ProductionAreaAdd extends Component {
  constructor(props) {
    super(props);
    this.goBack = genGoBack(props, LIST_PATH);
  }

  state = {
    selectedKeys: [],
    principalName: '',
    detail: {},
  }

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
      user: { isCompany, currentUser },
    } = this.props;
    if (id) {
      dispatch({
        type: 'electronicInspection/fetchProductionAreaDetail',
        payload: { id },
        callback: (success, detail) => {
          if (success) {
            const {
              companyName,
              areaName,
              department,
              areaNumber,
              areaLevel,
              remark,
              principal,
              principalContent,
            } = detail;
            const companyId = isCompany ? currentUser.companyId : detail.companyId;
            this.form && this.form.setFieldsValue({
              company: companyId ? { key: companyId, label: companyName } : undefined,
              areaName: areaName || undefined,
              areaNumber,
              areaLevel,
              remark,
              principal: principal ? [principal] : [],
            });
            this.fetchDepartmentList({
              payload: { companyId },
              callback: (list) => {
                setTimeout(() => {
                  const temp = list && list.length ? this.expandTree(list) : [];
                  if (temp.findIndex(item => item.id === department) > -1) {
                    this.form && this.form.setFieldsValue({ department: department || undefined });
                  } else message.warning('请重新选择部门')
                }, 0);
              },
            });
            this.setState({ principalName: principalContent ? principalContent.userName : '', detail, selectedKeys: [principal] })
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

  expandTree = (list) => {
    if (!list || list.length === 0) return []
    let arr = []
    let temp = []
    temp = [...list]
    while (temp.length) {
      const { children, ...res } = temp.shift()
      arr.push(res)
      if (children && children.length) {
        temp = [...temp, ...children]
      }
    }
    return arr
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

  // 获取负责人员列表
  fetchReevaluatorList = (payload = {}) => {
    const { dispatch, user: { isCompany, currentUser } } = this.props;
    const company = this.form && this.form.getFieldValue('company');
    dispatch({
      type: 'electronicInspection/fetchPersonList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        companyId: isCompany ? currentUser.companyId : company ? company.key : undefined,
        ...payload,
      },
    });
  }

  // 跳转到编辑页面
  handleEditButtonClick = () => {
    const { match: { params: { id } } } = this.props;
    router.push(`/electronic-inspection/production-area/edit/${id}`)
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
        principal,
        ...resValues
      } = values;
      const payload = {
        ...resValues,
        companyId: isCompany ? currentUser.companyId : company.key,
        principal: Array.isArray(principal) && principal.length ? principal[0] : undefined,
      };

      const callback = (success, msg) => {
        if (success) {
          message.success('操作成功');
          // router.push(LIST_PATH);
          setTimeout(this.goBack, 1000);
        } else {
          message.error(msg || '操作失败');
        }
      }
      if (id) {
        // 如果编辑
        dispatch({
          type: 'electronicInspection/editProductionArea',
          payload: { ...payload, id },
          callback,
        })
      } else {
        dispatch({
          type: 'electronicInspection/addProductionArea',
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
      this.form && this.form.setFieldsValue({ department: undefined, principal: [] });
      this.setState({ selectedKeys: [], principalName: '' });
    }
  }

  // 选择负责人
  handleSelectPerson = (keys, rows) => {
    if (keys[0] === this.state.selectedKeys[0]) return;
    // this.form && this.form.setFieldsValue({ principal: keys })
    this.setState({ principalName: rows.map(item => item.name).join('、'), selectedKeys: keys });
  }

  setFormReference = form => {
    this.form = form;
  }

  validatePrincipal = (rule, value, callback) => {
    if (Array.isArray(value) && value.length) {
      callback()
    } else callback('请选择负责人')
  }

  render () {
    const {
      submitting = false,
      user: { isCompany },
      account: { departments },
      electronicInspection: { person },
    } = this.props;
    const { principalName, detail, selectedKeys } = this.state;
    const href = location.href;
    const isNotDetail = !href.includes('view');
    const isEdit = href.includes('edit');
    const title = (href.includes('add') && '新增生产区域') || (href.includes('edit') && '编辑生产区域') || (href.includes('view') && '查看生产区域');
    // const treeList = treeData(departments);
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '电子巡查',
        name: '电子巡查',
      },
      {
        title: '生产区域',
        name: '生产区域',
        href: LIST_PATH,
      },
      {
        title: title,
        name: title,
      },
    ];
    const fields = [
      ...isCompany ? [] : [{
        id: 'company',
        label: '单位名称',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => (
          <CompanySelect
            style={{ width: '60%' }}
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
        id: 'areaName',
        label: '区域名称',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <InputOrSpan style={{ width: '60%' }} placeholder="请输入区域名称" type={isNotDetail ? 'Input' : 'span'} />,
        options: {
          rules: isNotDetail ? [
            {
              required: true,
              whitespace: true,
              message: '区域名称不能为空',
            },
            { max: 50, message: '请输入不超过50个字符' },
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
            style={{ width: '60%' }}
            allowClear
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="请选择所属部门"
          >
            {treeData(departments)}
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
        id: 'areaNumber',
        label: '区域位号',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <InputOrSpan style={{ width: '60%' }} placeholder="请输入区域位号" type={isNotDetail ? 'Input' : 'span'} />,
        options: {
          rules: isNotDetail ? [
            {
              required: true,
              whitespace: true,
              message: '区域位号不能为空',
            },
            { max: 50, message: '请输入不超过50个字符' },
          ] : undefined,
        },
      },
      {
        id: 'areaLevel',
        label: '区域等级',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <InputOrSpan style={{ width: '60%' }} placeholder="请输入区域等级" type={isNotDetail ? 'Input' : 'span'} />,
        options: {
          rules: isNotDetail ? [
            {
              required: true,
              whitespace: true,
              message: '区域等级不能为空',
            },
            { max: 50, message: '请输入不超过50个字符' },
          ] : undefined,
        },
      },
      {
        id: 'principal',
        label: '负责人',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => isNotDetail ? (
          <PersonSelect
            style={{ width: '60%' }}
            data={person}
            onOk={this.handleSelectPerson}
            fetch={this.fetchReevaluatorList}
            label={principalName}
            selectedKeys={selectedKeys}
          />
        ) : <span>{principalName}</span>,
        options: {
          rules: isNotDetail ? [
            {
              required: true,
              validator: this.validatePrincipal,
            },
          ] : undefined,
        },
      },
      {
        id: 'remark',
        label: '备注',
        span: SPAN,
        labelCol: LABEL_COL,
        options: {
          rules: [{ max: 50, message: '请输入不超过50个字符' }],
        },
        render: () => (
          <InputOrSpan
            style={{ width: '60%' }}
            placeholder="请输入备注"
            type={isNotDetail ? 'TextArea' : 'span'}
            autosize={{ minRows: 3 }}
          />
        ),
      },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={false}>
          <Card bordered={false}>
            <CustomForm
              fields={fields}
              searchable={false}
              resetable={false}
              refresh={this.refresh}
              ref={this.setFormReference}
            />
            <div style={{ textAlign: 'center' }}>
              <Button
                style={{ marginRight: '10px' }}
                // onClick={() => { router.goBack() }}
                onClick={this.goBack}
              >
                返回
              </Button>
              {isNotDetail ? (
                <Button type="primary" onClick={this.handleSubmitButtonClick} loading={submitting}>提交</Button>
              ) : (
                <AuthButton code={codes.electronicInspection.productionArea.edit} type="primary" onClick={this.handleEditButtonClick}>编辑</AuthButton>
              )}
            </div>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
