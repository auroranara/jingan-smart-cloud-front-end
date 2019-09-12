import React, { Component, Fragment } from 'react';
import { Spin, Card, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import {
  TITLE,
  BREADCRUMB_LIST,
} from './config';
import {
  SPAN,
  LABEL_COL,
  BUTTON_WRAPPER_SPAN,
  VERSION_TYPE_MAPPER,
  TYPE_MAPPER,
  VERSION_MAPPER,
  LEVEL_CODE_MAPPER,
} from '../EmergencyPlanHandler/config';
import styles from './index.less';

@connect(({ emergencyPlan, loading }) => ({
  emergencyPlan,
  loading: loading.effects['emergencyPlan/fetchDetail'],
}))
export default class EmergencyPlanDetail extends Component {
  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const { dispatch, match: { params: { id } } } = this.props;
    dispatch({
      type: 'emergencyPlan/fetchDetail',
      payload: {
        id,
      },
    });
  }

  // 编辑按钮点击事件
  handleEditButtonClick = () => {
    const { match: { params: { id } } } = this.props;
    router.push(`/emergency-management/emergency-plan/edit/${id}`);
  }

  // 返回按钮点击事件
  handleBackButtonClick = () => {
    router.goBack();
  }

  render() {
    const {
      emergencyPlan: {
        detail: {
          companyName,
          name,
          versionType,
          version,
          majorHazard,
          applyArea,
          abstract,
          content,
          keyword,
          startExpiryDate,
          endExpiryDate,
          typeCode,
          secretCode,
          recordStatus,
          recordNumber,
          recordDate,
          recordCredential,
          attachment,
          remark,
        }={},
      },
      loading,
    } = this.props;

    const FIELDS = [
      {
        id: 'companyName',
        label: '单位名称',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{companyName}</span>,
      },
      {
        id: 'name',
        label: '预案名称',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{name}</span>,
      },
      {
        id: 'type',
        label: '预案类型',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{TYPE_MAPPER(0)}</span>,
      },
      {
        id: 'versionType',
        label: '版本类',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{versionType && VERSION_TYPE_MAPPER(versionType)}</span>,
      },
      {
        id: 'version',
        label: '版本号',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{version && VERSION_MAPPER(version)}</span>,
      },
      {
        id: 'majorHazard',
        label: '是否重大危险源',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{+majorHazard ? '是' : '否'}</span>,
      },
      {
        id: 'applyArea',
        label: '适用领域',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{applyArea}</span>,
      },
      {
        id: 'abstract',
        label: '预案摘要',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{abstract}</span>,
      },
      {
        id: 'content',
        label: '预案内容',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{content}</span>,
      },
      {
        id: 'keyword',
        label: '关键字',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{keyword}</span>,
      },
      {
        id: 'expiryDate',
        label: '预案有效期',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{(startExpiryDate || endExpiryDate) && `${startExpiryDate ? moment(startExpiryDate).format('YYYY-MM-DD') : '?'} ~ ${endExpiryDate ? moment(endExpiryDate).format('YYYY-MM-DD') : '?'}`}</span>,
      },
      {
        id: 'levelCode',
        label: '预案级别代码',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{LEVEL_CODE_MAPPER(0)}</span>,
      },
      {
        id: 'typeCode',
        label: '预案类型代码',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{typeCode}</span>,
      },
      {
        id: 'secretCode',
        label: '预案密级代码',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{secretCode}</span>,
      },
      {
        id: 'recordStatus',
        label: '是否已备案',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{recordStatus}</span>,
      },
      ...(recordStatus > 0 ? [{
        id: 'recordNumber',
        label: '备案编号',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{recordNumber}</span>,
      },
      {
        id: 'recordDate',
        label: '备案日期',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{recordDate && moment(recordDate).format('YYYY-MM-DD')}</span>,
      },
      {
        id: 'recordCredential',
        label: '备案证明',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{recordCredential}</span>,
      }] : []),
      {
        id: 'attachment',
        label: '应急预案附件',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{attachment}</span>,
      },
      {
        id: 'remark',
        label: '备注',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{remark}</span>,
      },
    ];

    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
      >
        <Spin spinning={loading}>
          <Card bordered={false}>
            <CustomForm
              buttonWrapperSpan={BUTTON_WRAPPER_SPAN}
              buttonWrapperClassName={styles.buttonWrapper}
              fields={FIELDS}
              searchable={false}
              resetable={false}
              action={
                <Fragment>
                  <Button onClick={this.handleBackButtonClick}>返回</Button>
                  <Button type="primary" onClick={this.handleEditButtonClick}>编辑</Button>
                </Fragment>
              }
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
