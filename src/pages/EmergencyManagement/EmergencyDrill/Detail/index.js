import React, { Component, Fragment } from 'react';
import { Spin, Card, Button } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';

import styles from './index.less';

const listUrl = '/emergency-management/emergency-drill/list';
const HEADER = '应急演练计划';
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
  { id: 'projectName', label: '计划名称' },
  { id: 'projectCode', label: '版本号' },
  { id: 'projectStatus', label: '计划状态' },
  { id: 'draftBy', label: '制定人' },
  { id: 'draftDate', label: '制定日期' },
  { id: 'reportBy', label: '上报人' },
  { id: 'planName', label: '演练名称' },
  { id: 'planType', label: '演练类型' },
  { id: 'typeCode', label: '演练类型代码' },
  { id: 'planBack', label: '演练背景' },
  { id: 'planCode', label: '演练编号' },
  { id: 'planLocation', label: '演练地点' },
  { id: 'planGoal', label: '演练目的' },
  { id: 'planClaim', label: '演练要求' },
  { id: 'planContent', label: '演练内容' },
  { id: 'keyword', label: '关键字' },
  { id: 'budget', label: '经费预算（元）' },
];

const Statuss = ['未执行', '已执行'];

@connect(({ emergencyManagement, loading, user }) => ({
  emergencyManagement,
  user,
  loading: loading.models.emergencyManagement,
}))
export default class EmergencyDrillDetail extends Component {
  componentDidMount() {
    this.fetchDict({ type: 'emergencyDrill' });
    this.getDetail();
  }

  getDetail = () => {
    const {
      dispatch,
      match: { params: { id = null } = {} },
    } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchDrillList',
      payload: {
        pageNum: 1,
        pageSize: 10,
        id,
      },
    });
  };

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

  handleBackButtonClick = () => {
    router.push(listUrl);
  };

  render() {
    const {
      emergencyManagement: {
        drill: { list = [{}] },
        emergencyDrill = [],
      },
      loading,
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    const detail = list[0] || {};
    const fields = dspItems.map(item => {
      const { id } = item;
      const data = detail[id];
      let renderItem = <span>{data || NO_DATA}</span>;
      if (id === 'projectStatus') {
        renderItem = <span>{Statuss[+data] || NO_DATA}</span>;
      } else if (id === 'draftDate') {
        renderItem = <span>{data ? moment(data).format('YYYY-MM-DD') : NO_DATA}</span>;
      } else if (id === 'planType') {
        let treeData = emergencyDrill;
        const string = data
          .split(',')
          .map(id => {
            const val = treeData.find(item => item.id === id) || {};
            treeData = val.children;
            return val.label;
          })
          .join('/');
        renderItem = <span>{string || NO_DATA}</span>;
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
