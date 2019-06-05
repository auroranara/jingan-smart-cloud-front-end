import React, { PureComponent, Fragment } from 'react';
import { Card, Spin, Table } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import moment from 'moment';
import Ellipsis from '@/components/Ellipsis';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import hiddenIcon from '@/assets/hiddenIcon.png';

import styles from './GovermentReport.less';
const title = '政府监督报表详情';

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
    title: '政府监督报表',
    name: '政府监督报表',
    href: '/data-analysis/goverment-report/list',
  },
  {
    title,
    name: '政府监督报表详情',
  },
];
/* 头部标签列表 */
const tabList = [
  {
    key: '1',
    tab: '详情',
  },
];

/**
 * 政府监督报表详情
 */
@connect(({ maintenanceReport, user, loading }) => ({
  maintenanceReport,
  user,
  loading: loading.models.maintenanceReport,
}))
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tab: '1',
      i: '0',
    };
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    // 获取详情
    dispatch({
      type: 'maintenanceReport/fetchCheckDetail',
      payload: {
        checkId: id,
      },
    });
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
      maintenanceReport: {
        detail: { list = [] },
      },
      user: {
        currentUser: { unitType },
      },
      match: {
        params: { id },
      },
      location: {
        query: {
          checkResultName,
          object_title,
          check_date,
          check_user_names,
          companyName,
          itemTypeName,
        },
      },
      loading,
    } = this.props;
    const { tab, i } = this.state;
    /* 当前账号是否是企业 */
    const isCompany = unitType === 4;

    const newList = [];
    list.forEach(element => {
      element.list.forEach((detail, index) => {
        const item = { ...detail, ...element, rowSpan: index === 0 ? element.list.length : 0 };
        newList.push(item);
      });
    });

    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };
      obj.props.rowSpan = row.rowSpan;
      return obj;
    };

    const columns = [
      {
        title: '检查项',
        dataIndex: 'object_title',
        key: 'object_title',
        render: renderContent,
      },
      {
        title: '业务分类',
        dataIndex: 'businessTypeName',
        key: 'businessTypeName',
        render: renderContent,
      },
      {
        title: '检查内容',
        dataIndex: 'flow_name',
        key: 'flow_name',
        width: 280,
        render: val => {
          return (
            <div>
              <Ellipsis tooltip length={14} style={{ overflow: 'visible' }}>
                {val}
              </Ellipsis>
            </div>
          );
        },
      },
      {
        title: '检查结果',
        dataIndex: 'conclusion_name',
        key: 'conclusion_name',
      },
      {
        title: '相关隐患',
        dataIndex: 'statusName',
        render: (text, val) => {
          return (
            <div>
              <Link
                to={`/data-analysis/goverment-report/govermentCheckDetail/${
                  val._id
                }?checkId=${id}&&companyGovName=${companyName}&&object_title=${object_title}&&itemTypeName=${itemTypeName}&&check_user_names=${check_user_names}&&check_date=${check_date}&&checkResultName=${checkResultName}`}
              >
                <span style={{ color: '#40a9ff' }}> {val.statusName} </span>
              </Link>
            </div>
          );
        },
      },
    ];
    return (
      <PageHeaderLayout
        title={
          <Fragment>
            {itemTypeName}：{object_title}
            {!isCompany && <div className={styles.content}>{`单位名称：${companyName}`}</div>}
            <div className={styles.content}>{`检查人：${check_user_names}`}</div>
            <div className={styles.content}>{`检查时间：${moment(+check_date).format(
              'YYYY-MM-DD HH:mm'
            )}`}</div>
          </Fragment>
        }
        logo={<img alt="" src={hiddenIcon} />}
        action={
          <div>
            <div className={styles.textSecondary}>状态</div>
            <div className={styles.heading}>{checkResultName}</div>
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
                dataSource={newList}
                columns={columns}
                rowKey={'detail_id'}
                scroll={{
                  x: true,
                }}
                pagination={false}
              />
            </Card>
          )}
          {/* {tab === '2'} */}
        </Spin>
      </PageHeaderLayout>
    );
  }
}