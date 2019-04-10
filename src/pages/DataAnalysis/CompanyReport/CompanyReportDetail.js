import React, { PureComponent, Fragment } from 'react';
import { Card, Spin, Table } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import hiddenIcon from '@/assets/hiddenIcon.png';

import styles from './CompanyReport.less';
const title = '企业自查报表详情';

/* 面包屑 */
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '数据分析',
    name: '数据分析',
  },
  {
    title: '企业自查报表',
    name: '企业自查报表',
    href: '/data-analysis/company-report/list',
  },
  {
    title,
    name: '企业自查报表详情',
  },
];
/* 头部标签列表 */
const tabList = [
  {
    key: '1',
    tab: '详情',
  },
];

/* 根据status获取名称 */
const getLabelByStatus = function(status) {
  switch (+status) {
    case 1:
      return '正常';
    case 2:
      return '异常';
    default:
      return '';
  }
};

/**
 * 企业自查报表详情
 */
@connect(({ companyReport, user, loading }) => ({
  companyReport,
  user,
  loading: loading.models.companyReport,
}))
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tab: '1',
    };
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    // const {
    //   dispatch,
    //   match: {
    //     params: { id },
    //   },
    // } = this.props;
    // 获取详情
    // dispatch({
    //   type: 'companyReport/fetchDetail',
    //   payload: {
    //     id,
    //   },
    // });
  }

  /**
   * 切换头部标签
   */
  handleTabChange = tab => {
    this.setState({ tab });
  };

  /**
   * 渲染函数
   */
  render() {
    const {
      user: {
        currentUser: { unitType },
      },
      loading,
    } = this.props;
    const list = [];
    const { tab } = this.state;
    /* 当前账号是否是企业 */
    const isCompany = unitType === 4;

    const columns = [
      {
        title: '检查项',
        dataIndex: 'check_type',
      },
      {
        title: '业务分类',
        dataIndex: 'bussiness_type',
      },
      {
        title: '检查内容',
        dataIndex: 'check_content',
      },
      {
        title: '检查结果',
        dataIndex: 'check_result',
        render: val => {
          return val && val.length > 0
            ? val.map((v, i) => {
                return <div key={i}> {v.userName}</div>;
              })
            : '';
        },
      },
      {
        title: '相关隐患',
        dataIndex: 'about_hiddenDanger',
      },
    ];
    return (
      <PageHeaderLayout
        title={
          <Fragment>
            {`风险点：`}
            {!isCompany && <div className={styles.content}>{`单位名称：`}</div>}
            {!isCompany && <div className={styles.content}>{`检查人：`}</div>}
            {!isCompany && <div className={styles.content}>{`检查时间：`}</div>}
          </Fragment>
        }
        logo={<img alt="" src={hiddenIcon} />}
        action={
          <div>
            <div className={styles.textSecondary}>状态</div>
            <div className={styles.heading}>{getLabelByStatus(status)}</div>
          </div>
        }
        tabList={tabList}
        tabActiveKey={tab}
        onTabChange={this.handleTabChange}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={!!loading}>
          {tab === '1' && (
            <Card title="检查内容" className={styles.card}>
              <Table
                className={styles.table}
                dataSource={list}
                columns={columns}
                rowKey="id"
                scroll={{
                  x: true,
                }}
              />
            </Card>
          )}
          {/* {tab === '2'} */}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
