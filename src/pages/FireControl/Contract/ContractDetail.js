import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Spin } from 'antd';
import moment from 'moment';
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
    name: '首页',
    href: '/',
  },
  {
    title: '消防维保',
    name: '消防维保',
  },
  {
    title: '维保合同管理',
    name: '维保合同管理',
    href: backUrl,
  },
  {
    title,
    name: title,
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
        type: 'contract/fetchContract',
        ...action,
      });
    },
    /* 返回 */
    goBack() {
      dispatch(routerRedux.push(backUrl));
    },
    /* 跳转到编辑页面 */
    goToEdit(id) {
      dispatch(routerRedux.push(editUrl + id));
    },
    /* 异常 */
    goToException() {
      dispatch(routerRedux.push('/exception/500'));
    },
  })
)
@Form.create()
export default class ContractDetail extends PureComponent {
  /* 生命周期函数 */
  componentDidMount() {
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
    const {
      goBack,
      goToEdit,
      contract: {
        detail: {
          contractCode,
          signingDate,
          startTime,
          endTime,
          signingAddr,
          serviceContent,
          contractAppendix,
          maintenanceName,
          companyName,
        },
      },
      match: {
        params: { id },
      },
    } = this.props;

    const period = `${(startTime && moment(+startTime).format('YYYY-MM-DD')) || '?'} ~ ${(endTime &&
      moment(+endTime).format('YYYY-MM-DD')) ||
      '?'}`;
      const contractAppendixList = contractAppendix && contractAppendix.startsWith('[') ? JSON.parse(contractAppendix) : [];

    return (
      <Card title="合同详情" className={styles.card} bordered={false}>
        <DescriptionList col={3} style={{ marginBottom: 16 }}>
          <Description term="合同编号">{contractCode || getEmptyData()}</Description>
          <Description term="维保单位">{maintenanceName || getEmptyData()}</Description>
          <Description term="服务单位">{companyName || getEmptyData()}</Description>
          <Description term="签订日期">
            {signingDate ? moment(+signingDate).format('YYYY-MM-DD') : getEmptyData()}
          </Description>
          <Description term="签订地点">{signingAddr || getEmptyData()}</Description>
          <Description term="服务期限">{period || getEmptyData()}</Description>
        </DescriptionList>
        <DescriptionList col={1} style={{ marginBottom: 16 }}>
          <Description term="服务内容">
            {serviceContent ? (
              <pre style={{ margin: '0', color: 'inherit', font: 'inherit', whiteSpace: 'pre-wrap' }}>{serviceContent}</pre>
            ) : (
              getEmptyData()
            )}
          </Description>
          <Description term="合同附件">
            {contractAppendixList.length !== 0
              ? contractAppendixList.map(({ webUrl }, index) => (
                <a style={{ display: 'block' }} href={webUrl} target="_blank" rel="noopener noreferrer" key={webUrl}>
                  {`合同附件${index + 1}`}
                </a>
                ))
              : getEmptyData()}
          </Description>
        </DescriptionList>
        <div style={{ textAlign: 'center' }}>
          <Button
            onClick={() => {
              goBack();
            }}
            style={{ marginRight: '24px' }}
          >
            返回
          </Button>
          <Button
            type="primary"
            onClick={() => {
              goToEdit(id);
            }}
          >
            编辑
          </Button>
        </div>
      </Card>
    );
  }

  render() {
    const { loading } = this.props;
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Spin spinning={loading}>{this.renderDetail()}</Spin>
      </PageHeaderLayout>
    );
  }
}
