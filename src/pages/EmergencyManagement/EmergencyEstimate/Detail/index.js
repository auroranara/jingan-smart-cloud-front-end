import React, { Component, Fragment } from 'react';
import { Spin, Card, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';

import styles from './index.less';

const listUrl = '/emergency-management/emergency-estimate/list';
const HEADER = '应急演练评估';
const TITLE = HEADER + '详情';
const BREADCRUMB = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '应急管理',
    name: '应急管理',
  },
  {
    title: HEADER,
    name: HEADER,
    href: listUrl,
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const BUTTON_WRAPPER_SPAN = {
  sm: 24,
  xs: 24,
};
const SPAN = { sm: 24, xs: 24 };
const LABELCOL = { span: 6 };
const WRAPPERCOL = { span: 13 };
const NO_DATA = '暂无数据';

const dspItems = [
  { id: 'companyName', label: '单位名称' },
  { id: 'assessName', label: '演练计划名称' },
  { id: 'assessUnit', label: '评估单位' },
  { id: 'assessDate', label: '评估日期' },
  { id: 'assessMem', label: '演练人员' },
  { id: 'realizatin', label: '演练目标实现' },
  { id: 'orgProcess', label: '演练组织情况' },
  { id: 'conclusion', label: '评估总结' },
  { id: 'drillReportList', label: '演练评估报告' },
];

@connect(({ emergencyManagement, loading, user }) => ({
  emergencyManagement,
  user,
  loading: loading.models.emergencyManagement,
}))
export default class EmergencyEstimateDetail extends Component {
  componentDidMount() {
    this.getDetail();
  }

  getDetail = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchEstimateDetail',
      payload: { id },
    });
  };

  handleBackButtonClick = () => {
    // router.push(listUrl);
    window.close();
  };

  render() {
    const {
      emergencyManagement: {
        estimate: { detail = {} },
      },
      user: {
        currentUser: { unitType },
      },
      loading,
    } = this.props;
    const fields = dspItems.map(item => {
      const { id } = item;
      const data = detail[id];
      let renderItem = <span>{data || NO_DATA}</span>;
      if (id === 'assessDate') {
        renderItem = <span>{moment(data).format('YYYY-MM-DD') || NO_DATA}</span>;
      } else if (id === 'drillReportList') {
        renderItem = (
          <div>
            {!data || data.length === 0
              ? NO_DATA
              : data.map((img, i) => (
                  <div key={i}>
                    <a
                      className={styles.clickable}
                      href={img.webUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {img.fileName}
                    </a>
                  </div>
                ))}
          </div>
        );
      }
      return {
        ...item,
        span: SPAN,
        labelCol: LABELCOL,
        wrapperCol: WRAPPERCOL,
        render: () => {
          return renderItem;
        },
      };
    });

    return (
      <PageHeaderLayout title={TITLE} breadcrumbList={BREADCRUMB}>
        <Spin spinning={loading}>
          <Card bordered={false}>
            <CustomForm
              buttonWrapperSpan={BUTTON_WRAPPER_SPAN}
              buttonWrapperStyle={{ textAlign: 'center' }}
              fields={unitType === 4 ? fields.slice(1, fields.length) : fields}
              searchable={false}
              resetable={false}
              action={
                <Fragment>
                  <Button onClick={this.handleBackButtonClick}>返回</Button>
                </Fragment>
              }
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
