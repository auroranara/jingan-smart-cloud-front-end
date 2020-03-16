import React, { Component } from 'react';
import { Button, Spin, message, Card } from 'antd';
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

const SPAN = { span: 24 };
const LABEL_COL = { span: 6 };
const LIST_PATH = '/real-name-certification/channel/list';

@connect(({ realNameCertification, user }) => ({
  realNameCertification,
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

  // 上传前
  handleBeforeUpload = (file) => {
    const isJpgOrPng = file.type.includes('image');
    if (!isJpgOrPng) {
      message.error('文件上传只支持图片!');
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
    router.push(`/real-name-certification/channel/edit/${id}`)
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
      // const payload = {
      //   ...resValues,
      //   companyId: isCompany ? currentUser.companyId : company.key,
      // };
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
      realNameCertification: {
        channelTypeDict,
      },
    } = this.props;
    const href = location.href;
    const isNotDetail = !href.includes('detail');
    const isEdit = href.includes('edit');
    const title = (href.includes('add') && '新增通道') || (href.includes('edit') && '编辑通道') || (href.includes('detail') && '查看通道');
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '实名制认证系统',
        name: '实名制认证系统',
      },
      {
        title: '通道管理',
        name: '通道管理',
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
            label: '通道名称',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入通道名称" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '通道名称不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'location',
            label: '通道位置',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan className={styles.item} placeholder="请输入通道位置" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '通道位置不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'type',
            label: '通道类型',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => (
              <SelectOrSpan
                className={styles.item}
                placeholder="请选择通道类型"
                type={isNotDetail ? 'Select' : 'span'}
                list={channelTypeDict}
              />
            ),
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '通道类型不能为空',
                },
              ] : undefined,
            },
          },
          {
            id: 'accessoryContent',
            label: '通道照片',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <CustomUpload folder="operationProdures" beforeUpload={this.handleBeforeUpload} type={isNotDetail || 'span'} />,
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
                <AuthButton code={codes.realNameCertification.channel.edit} type="primary" onClick={this.handleEditButtonClick}>编辑</AuthButton>
              )}
          </div>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
