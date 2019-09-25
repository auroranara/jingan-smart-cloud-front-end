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
import {
  EDIT_CODE,
  TYPE_CODES,
  SECRET_CODES,
} from '../EmergencyPlanList/config';
import styles from './index.less';

@connect(({ emergencyPlan, user, loading }) => ({
  emergencyPlan,
  user,
  loading: loading.effects['emergencyPlan/fetchDetail'],
}))
export default class EmergencyPlanDetail extends Component {
  componentDidMount() {
    this.getDetail();
  }

  componentWillUnmount() {
    this.clearDetail();
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

  clearDetail = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyPlan/save',
      payload: {
        detail: {},
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
          planType,
          editionType,
          editionCode,
          isMajorHazard,
          applicationArea,
          emergencyMain,
          emergencyAll,
          keyword,
          startDate,
          endDate,
          jbLevelCode,
          lxLevelCode,
          mjLevelCode,
          isRecord,
          recordCode,
          recordDate,
          recordCertificateList,
          emergencyFilesList,
          remark,
          historyType,
          status,
        }={},
      },
      user: {
        currentUser: {
          unitType,
          permissionCodes,
        },
      },
      loading,
    } = this.props;
    const isNotCompany = +unitType !== 4;
    const hasEditAuthority = permissionCodes.includes(EDIT_CODE);

    const FIELDS = [
      ...(isNotCompany ? [{
        id: 'companyName',
        label: '单位名称',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{companyName}</span>,
      }] : []),
      {
        id: 'name',
        label: '预案名称',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{name}</span>,
      },
      {
        id: 'planType',
        label: '预案类型',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{planType && TYPE_MAPPER(planType)}</span>,
      },
      {
        id: 'editionType',
        label: '版本类',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{editionType && VERSION_TYPE_MAPPER(editionType)}</span>,
      },
      {
        id: 'editionCode',
        label: '版本号',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{editionCode && VERSION_MAPPER(editionCode)}</span>,
      },
      {
        id: 'isMajorHazard',
        label: '是否重大危险源',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{+isMajorHazard ? '是' : '否'}</span>,
      },
      {
        id: 'applicationArea',
        label: '适用领域',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{applicationArea}</span>,
      },
      {
        id: 'emergencyMain',
        label: '预案摘要',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{emergencyMain}</span>,
      },
      {
        id: 'emergencyAll',
        label: '预案内容',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{emergencyAll}</span>,
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
        render: () => <span>{(startDate || endDate) && `${startDate ? moment(startDate).format('YYYY.M.D') : '?'} ~ ${endDate ? moment(endDate).format('YYYY.M.D') : '?'}`}</span>,
      },
      {
        id: 'jbLevelCode',
        label: '预案级别代码',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{jbLevelCode && LEVEL_CODE_MAPPER(jbLevelCode)}</span>,
      },
      {
        id: 'lxLevelCode',
        label: '预案类型代码',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => {
          const typeCode = TYPE_CODES.filter(({ key }) => key === lxLevelCode)[0];
          return <span>{typeCode && typeCode.value}</span>
        },
      },
      {
        id: 'mjLevelCode',
        label: '预案密级代码',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => {
          const secretCode = SECRET_CODES.filter(({ key }) => key === mjLevelCode)[0];
          return <span>{secretCode && secretCode.value}</span>
        },
      },
      {
        id: 'isRecord',
        label: '是否已备案',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{+isRecord ? '是' : '否'}</span>,
      },
      ...(isRecord > 0 ? [{
        id: 'recordCode',
        label: '备案编号',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{recordCode}</span>,
      },
      {
        id: 'recordDate',
        label: '备案日期',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => <span>{recordDate && moment(recordDate).format('YYYY.M.D')}</span>,
      },
      {
        id: 'recordCertificateList',
        label: '备案证明',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => (
          <div>
            {recordCertificateList && recordCertificateList.map(({ webUrl, name }, index) => (
              <div key={index}>
                <a className={styles.clickable} href={webUrl} target="_blank" rel="noopener noreferrer">{name}</a>
              </div>
            ))}
          </div>
        ),
      }] : []),
      {
        id: 'emergencyFilesList',
        label: '应急预案附件',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => (
          <div>
            {emergencyFilesList && emergencyFilesList.map(({ webUrl, name }, index) => (
              <div key={index}>
                <a className={styles.clickable} href={webUrl} target="_blank" rel="noopener noreferrer">{name}</a>
              </div>
            ))}
          </div>
        ),
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
                  {hasEditAuthority && +historyType === 1 && (+status === 3 || +status === 4) && <Button type="primary" onClick={this.handleEditButtonClick}>编辑</Button>}
                </Fragment>
              }
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
