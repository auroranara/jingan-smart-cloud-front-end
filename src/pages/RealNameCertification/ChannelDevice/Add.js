import React, { Component } from 'react';
import { Button, Spin, message, Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import CompanySelect from '@/jingan-components/CompanySelect';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import router from 'umi/router';
import { connect } from 'dva';
import {
  LIST_PATH,
} from './List';
import { AuthButton } from '@/utils/customAuth';
import codes from '@/utils/codes'
import styles from './Add.less';

const SPAN = { span: 24 };
const LABEL_COL = { span: 6 };

@connect(({ safetyProductionRegulation, user }) => ({
  safetyProductionRegulation,
  user,
}))
export default class ChannelDeviceAdd extends Component {

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
    } = this.props;
    const isNotDetail = !location.href.includes('detail');
    if (id) {
      // dispatch({
      //   type: 'safetyProductionRegulation/fetchOperatingProcedureDetail',
      //   payload: { id },
      //   callback: (success, detail) => {
      //     if (success) {
      //       const {
      //         companyId,
      //         companyName,
      //         name,
      //         phone,
      //         accessoryContent,
      //         startDate,
      //         endDate,
      //         status,
      //         historyType,
      //         editionCode,
      //         operatingName,
      //       } = detail;
      //       this.form && this.form.setFieldsValue({
      //         company: companyId ? { key: companyId, label: companyName } : undefined,
      //         operatingName: operatingName || undefined,
      //         historyType: isNotDetail && +status === 4 ? '1' : historyType || '0',
      //         editionCode: isNotDetail && +status === 4 ? (+editionCode + 0.01).toFixed(2) : editionCode || '1.00',
      //         name: name || undefined,
      //         phone: phone || undefined,
      //         expireDate: startDate && endDate ? [moment(startDate), moment(endDate)] : [],
      //         accessoryContent: accessoryContent ? accessoryContent.map((item) => ({ ...item, uid: item.id, url: item.webUrl, status: 'done' })) : [],
      //       });
      //     } else {
      //       message.error('获取详情失败，请稍后重试或联系管理人员！');
      //     }
      //   },
      // })
    }
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
        // dispatch({
        //   type: 'safetyProductionRegulation/editOperatingProcedure',
        //   payload: { ...payload, id },
        //   callback,
        // })
      } else {
        // dispatch({
        //   type: 'safetyProductionRegulation/addOperatingProcedure',
        //   payload,
        //   callback,
        // })
      }
    })
  }

  setFormReference = form => {
    this.form = form;
  }

  render () {
    const {
      submitting = false,
      user: { isCompany },
      safetyProductionRegulation: {
        operatingProceduresDetail: { hgOperatingInstructionApproveList: approvalList = [] } = {},
      },
    } = this.props;
    const href = location.href;
    const isNotDetail = !href.includes('detail');
    const isEdit = href.includes('edit');
    const title = (href.includes('add') && '新增操作规程') || (href.includes('edit') && '编辑操作规程') || (href.includes('detail') && '查看操作规程');
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
        title: '操作规程',
        name: '操作规程',
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
            id: 'name',
            label: '设备名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入设备名称" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '设备名称不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'num',
            label: '设备序列号',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入设备序列号" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '设备序列号不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'appID',
            label: 'appID',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入appID" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: 'appID不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'appKey',
            label: 'appKey',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入appKey" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: 'appKey不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'appSecret',
            label: 'appSecret',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入appSecret" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: 'appSecret不能为空',
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
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button style={{ marginRight: '10px' }} onClick={() => { router.goBack() }}>返回</Button>
            {isNotDetail ? (
              <Button type="primary" onClick={this.handleSubmitButtonClick} loading={submitting}>提交</Button>
            ) : (
                <AuthButton code={codes.realNameCertification.channelDevice.edit} type="primary" onClick={this.handleEditButtonClick}>编辑</AuthButton>
              )}
          </div>
        </Spin>
      </PageHeaderLayout>
    )
  }
}
