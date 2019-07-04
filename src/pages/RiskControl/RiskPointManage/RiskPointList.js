import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './CheckContent.less';
import CheckContent from './CheckContent';
import codesMap from '@/utils/codes';
import { AuthButton } from '@/utils/customAuth';

// 默认页面显示数量
const pageSize = 18;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险管控', name: '风险管控' },
  { title: '风险点管理', name: '风险点管理', href: '/risk-control/risk-point-manage/index' },
  { title: '单位风险点', name: '单位风险点' },
];

@connect(({ riskPointManage, user, loading }) => ({
  user,
  riskPointManage,
  loading: loading.models.riskPointManage,
}))
export default class riskPointList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: null,
      visible: false,
    };
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      match: {
        params: { type = 'all' },
      },
    } = this.props;
    this.setState({ activeKey: type });
    this.getRiskList(type);
  }

  // 获取列表
  getRiskList = type => {
    const {
      match: {
        params: { id: companyId },
      },
      dispatch,
    } = this.props;
    if (type === 'all') {
      dispatch({
        type: 'riskPointManage/fetchRiskList',
        payload: {
          companyId: companyId,
          pageSize,
          pageNum: 1,
        },
      });
    } else {
      dispatch({
        type: 'riskPointManage/fetchRiskList',
        payload: {
          companyId: companyId,
          realCheckCycle: type,
          pageSize,
          pageNum: 1,
        },
      });
    }

    dispatch({
      type: 'riskPointManage/fetchRiskCount',
      payload: {
        companyId: companyId,
      },
    });
    dispatch({
      type: 'riskPointManage/fetchLecDict',
    });
  };

  /**
   * 切换tab
   */
  handleTabChange = key => {
    const {
      match: {
        params: { id },
      },
      location: {
        query: { companyName },
      },
    } = this.props;
    this.setState({ activeKey: key }, () => {
      router.push(
        `/risk-control/risk-point-manage/${key}/list/${id}?companyId=${id}&&companyName=${companyName}`
      );
    });
    this.getRiskList(key);
  };

  // 渲染页面
  render() {
    const {
      loading,
      riskPointManage: {
        riskPointData: { list: riskPointList },
        riskCountData: { list = [] },
        lecData,
      },
      match: {
        params: { id: companyId },
      },
      location: {
        query: { companyName },
      },
      user: {
        currentUser: { permissionCodes: codes },
      },
    } = this.props;

    const { activeKey } = this.state;

    const count = list.map(item => item.pointCount);

    const tabList = [
      {
        key: 'all',
        tab: `全部(${count[0]})`,
      },
      {
        key: 'every_day',
        tab: `日检查点(${count[1]})`,
      },
      {
        key: 'every_week',
        tab: `周检查点(${count[2]})`,
      },
      {
        key: 'every_month',
        tab: `月检查点(${count[3]})`,
      },
      {
        key: 'every_quarter',
        tab: `季度检查点(${count[4]})`,
      },
      {
        key: 'every_half_year',
        tab: `半年检查点(${count[5]})`,
      },
      {
        key: 'every_year',
        tab: `年检查点(${count[6]})`,
      },
    ];

    return (
      <PageHeaderLayout
        className={styles.header}
        title="单位风险点"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>{companyName}</span>
            <span style={{ paddingLeft: 15 }}>
              风险点总数：
              {count[0]}
            </span>
            <AuthButton
              code={codesMap.riskControl.riskPointManage.add}
              style={{ position: 'absolute', right: '66px', top: '209px' }}
              codes={codes}
              type="primary"
              href={`#/risk-control/risk-point-manage/risk-point-add?companyId=${companyId}&companyName=${companyName}`}
            >
              新增
            </AuthButton>
          </div>
        }
        tabList={tabList}
        tabActiveKey={activeKey}
        onTabChange={this.handleTabChange}
      >
        <Spin spinning={!!loading}>
          <CheckContent
            riskPointList={riskPointList}
            companyId={companyId}
            companyName={companyName}
            tabActiveKey={activeKey}
            lecData={lecData}
          />
        </Spin>
      </PageHeaderLayout>
    );
  }
}
