import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Spin } from 'antd';
// import moment from 'moment';
import { routerRedux } from 'dva/router';

import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

import styles from './Contract.less';

const { Description } = DescriptionList;

// 标题
const title = '查看维保合同';
// 返回地址
const backUrl = '/fire-control/contract/list';
/* 编辑页面地址 */
const editUrl = '/fire-control/contract/edit/';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '消防维保',
  },
  {
    title: '维保合同管理',
    href: backUrl,
  },
  {
    title,
  },
];
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(
  ({ contract, loading }) => ({
    contract,
    loading: loading.models.contract,
  }),
  dispatch => ({
    /* 获取详情 */
    fetchContract(action) {
      dispatch({
        type: 'company/fetchContract',
        ...action,
      });
    },
    /* 返回 */
    goBack() {
      dispatch(routerRedux.push(backUrl));
    },
    /* 跳转到编辑页面 */
    goToEdit(id) {
      dispatch(routerRedux.push(editUrl+id));
    },
    /* 异常 */
    goToException() {
      dispatch(routerRedux.push('/exception/500'));
    },
  })
)
@Form.create()
export default class CompanyDetail extends PureComponent {
  /* 生命周期函数 */
  componentWillMount() {
    const {
      fetchContract,
      match: {
        params: { id },
      },
      goToException,
    } = this.props;
    // 获取详情
    fetchContract({
      payload: {
        id,
      },
      error: () => {
        goToException();
      },
    });
  }

  /* 渲染详情 */
  renderDetail() {
    const { goBack, goToEdit, contract: { detail: { number, maintanceName, serviceName, signDate, signPlace, servicePeriod, serviceContent, contract } } } = this.props;

    return (
      <Card title="合同详情" className={styles.card} bordered={false}>
        <DescriptionList col={3} style={{ marginBottom: 16 }}>
          <Description term="合同编号">
            {number || getEmptyData()}
          </Description>
          <Description term="维保单位">
            {maintanceName || getEmptyData()}
          </Description>
          <Description term="服务单位">
            {serviceName || getEmptyData()}
          </Description>
          <Description term="签订日期">
            {signDate || getEmptyData()}
          </Description>
          <Description term="签订地点">
            {signPlace || getEmptyData()}
          </Description>
          <Description term="服务期限">
            {servicePeriod || getEmptyData()}
          </Description>
        </DescriptionList>
        <DescriptionList col={1} style={{ marginBottom: 16 }}>
          <Description term="服务内容">
            {serviceContent || getEmptyData()}
          </Description>
          <Description term="合同附件">
            {contract || getEmptyData()}
          </Description>
        </DescriptionList>
        <div style={{ textAlign: 'center' }}>
          <Button onClick={()=>{goBack()}} style={{ marginRight: '24px' }}>返回</Button>
          <Button type="primary" onClick={()=>{goToEdit()}}>编辑</Button>
        </div>
      </Card>
    );
  }

  render() {
    const { loading } = this.props;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading}>
          {this.renderDetail()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
