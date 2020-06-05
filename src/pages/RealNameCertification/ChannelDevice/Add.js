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
import { genGoBack } from '@/utils/utils';

const SPAN = { span: 24 };
const LABEL_COL = { span: 6 };

@connect(({ realNameCertification, user }) => ({
  realNameCertification,
  user,
}))
export default class ChannelDeviceAdd extends Component {
  constructor(props) {
    super(props);
    this.goBack = genGoBack(this.props, LIST_PATH);
  }

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
      realNameCertification: { deviceSearchInfo: searchInfo = {} },
    } = this.props;
    if (id) {
      dispatch({
        type: 'realNameCertification/fetchDeviceDetail',
        payload: { id },
        callback: (success, detail) => {
          if (success) {
            const {
              companyId,
              companyName,
              deviceName,
              deviceCode,
              // appId,
              // appKey,
              // appSecret,
            } = detail;
            this.form && this.form.setFieldsValue({
              company: companyId ? { key: companyId, label: companyName } : undefined,
              deviceName: deviceName || undefined,
              deviceCode: deviceCode || undefined,
              // appId: appId || undefined,
              // appKey: appKey || undefined,
              // appSecret: appSecret || undefined,
            });
          } else {
            message.error('获取详情失败，请稍后重试或联系管理人员！');
          }
        },
      })
    } else if (searchInfo.company && searchInfo.company.id) {
      // 如果列表页面选择了单位
      const { id, name } = searchInfo.company;
      this.form && this.form.setFieldsValue({ company: { key: id, label: name } });
    }
  }

  // 跳转到编辑页面
  handleEditButtonClick = () => {
    const { match: { params: { id } } } = this.props;
    router.push(`/real-name-certification/channel-device/edit/${id}`)
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
          // router.push(LIST_PATH);
          setTimeout(this.goBack, 1000);
        } else {
          message.error(msg || '操作失败');
        }
      }
      if (id) {
        // 如果编辑
        dispatch({
          type: 'realNameCertification/editChannelDevice',
          payload: { ...payload, id },
          callback,
        })
      } else {
        dispatch({
          type: 'realNameCertification/addChannelDevice',
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
      user: { isCompany },
    } = this.props;
    const href = location.href;
    const isNotDetail = !href.includes('view');
    const isEdit = href.includes('edit');
    const title = (href.includes('add') && '新增通道设备') || (href.includes('edit') && '编辑通道设备') || (href.includes('view') && '查看通道设备');
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
        title: '通道设备',
        name: '通道设备',
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
            id: 'deviceName',
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
            id: 'deviceCode',
            label: '设备序列号',
            span: SPAN,
            labelCol: LABEL_COL,
            render: () => <InputOrSpan disabled={isEdit} className={styles.item} placeholder="请输入设备序列号" type={isNotDetail ? 'Input' : 'span'} />,
            options: {
              rules: isNotDetail ? [
                {
                  required: true,
                  whitespace: true,
                  message: '设备序列号不能为空',
                },
                {
                  pattern: /^[0-9A-Za-z]*$/,
                  message: '请输入英文和数字',
                },
              ] : undefined,
              getValueFromEvent: e => e.target.value.replace(/\s/g, ''),
            },
          },
          // {
          //   id: 'appId',
          //   label: 'appID',
          //   span: SPAN,
          //   labelCol: LABEL_COL,
          //   render: () => <InputOrSpan className={styles.item} placeholder="请输入appID" type={isNotDetail ? 'Input' : 'span'} />,
          //   options: {
          //     rules: isNotDetail ? [
          //       {
          //         required: true,
          //         whitespace: true,
          //         message: 'appID不能为空',
          //       },
          //       {
          //         pattern: /^[0-9A-Za-z]*$/,
          //         message: '请输入英文和数字',
          //       },
          //     ] : undefined,
          //     getValueFromEvent: e => e.target.value.replace(/\s/g, ''),
          //   },
          // },
          // {
          //   id: 'appKey',
          //   label: 'appKey',
          //   span: SPAN,
          //   labelCol: LABEL_COL,
          //   render: () => <InputOrSpan className={styles.item} placeholder="请输入appKey" type={isNotDetail ? 'Input' : 'span'} />,
          //   options: {
          //     rules: isNotDetail ? [
          //       {
          //         required: true,
          //         whitespace: true,
          //         message: 'appKey不能为空',
          //       },
          //       {
          //         pattern: /^[0-9A-Za-z]*$/,
          //         message: '请输入英文和数字',
          //       },
          //     ] : undefined,
          //     getValueFromEvent: e => e.target.value.replace(/\s/g, ''),
          //   },
          // },
          // {
          //   id: 'appSecret',
          //   label: 'appSecret',
          //   span: SPAN,
          //   labelCol: LABEL_COL,
          //   render: () => <InputOrSpan className={styles.item} placeholder="请输入appSecret" type={isNotDetail ? 'Input' : 'span'} />,
          //   options: {
          //     rules: isNotDetail ? [
          //       {
          //         required: true,
          //         whitespace: true,
          //         message: 'appSecret不能为空',
          //       },
          //       {
          //         pattern: /^[0-9A-Za-z]*$/,
          //         message: '请输入英文和数字',
          //       },
          //     ] : undefined,
          //     getValueFromEvent: e => e.target.value.replace(/\s/g, ''),
          //   },
          // },
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
                  <AuthButton code={codes.realNameCertification.channelDevice.edit} type="primary" onClick={this.handleEditButtonClick}>编辑</AuthButton>
                )}
            </div>
          </Card>
        </Spin>
      </PageHeaderLayout>
    )
  }
}
