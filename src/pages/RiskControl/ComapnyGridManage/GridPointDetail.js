import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Badge, Row, Col, Table } from 'antd';
import { routerRedux } from 'dva/router';

import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import codesMap from '@/utils/codes';
import { AuthButton } from '@/utils/customAuth';

const { Description } = DescriptionList;
// 标题
const title = '查看网格点详情';

// 依据
function LawCard(props) {
  const { lawTypeName, article } = props;
  return (
    <Row>
      <Col span={5}>
        <p>{lawTypeName ? lawTypeName : getEmptyData()}</p>
      </Col>
      <Col span={19}>
        <p>{article ? article : getEmptyData()}</p>
      </Col>
    </Row>
  );
}

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
let flow_id = [];

const getCycleType = i => {
  switch (i) {
    case 'every_day':
      return '每日一次';
    case 'every_week':
      return '每周一次';
    case 'every_month':
      return '每月一次';
    case 'every_quarter':
      return '每季度一次';
    case 'every_half_year':
      return '每半年一次';
    case 'every_year':
      return '每年一次';
    default:
      break;
  }
};

@connect(({ riskPointManage, user, loading }) => ({
  riskPointManage,
  user,
  loading: loading.models.riskPointManage,
}))
@Form.create()
export default class GridPointDetail extends PureComponent {
  state = {
    flowList: [],
  };

  /* 生命周期函数 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
      location: {
        query: { companyId },
      },
    } = this.props;

    // 清空
    flow_id = [];

    // 获取详情
    dispatch({
      type: 'riskPointManage/fetchGridPointDetail',
      payload: {
        id,
      },
      callback: response => {
        const { itemFlowList } = response;
        this.setState({ flowList: itemFlowList });
      },
    });

    // 获取推荐检查周期
    dispatch({
      type: 'riskPointManage/fetchCheckCycle',
      payload: {
        companyId,
        type: 2,
      },
    });
  }

  // 返回到编辑页面
  goToEdit = id => {
    const {
      dispatch,
      location: {
        query: { companyId, companyName },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/risk-control/grid-point-manage/grid-point-edit/${id}?companyId=${companyId}&companyName=${companyName}`
      )
    );
  };

  /* 渲染详情 */
  renderDetail = () => {
    const {
      match: {
        params: { id },
      },
      riskPointManage: {
        gridDetail: { data },
        checkCycleData,
      },
    } = this.props;

    const { objectTitle, dangerLevel, locationCode, qrCode, nfcCode, checkCycle, cycleType } =
      data || {};
    const { flowList: checkList } = this.state;

    const COLUMNS = [
      {
        title: '检查项名称',
        dataIndex: 'object_title',
        key: 'object_title',
        align: 'center',
        width: 80,
      },
      {
        title: '所属行业',
        dataIndex: 'industry',
        key: 'industry',
        align: 'center',
        width: 70,
      },
      {
        title: '业务分类',
        dataIndex: 'business_type',
        key: 'business_type',
        align: 'center',
        width: 65,
      },
      {
        title: '检查内容',
        dataIndex: 'flow_name',
        key: 'flow_name',
        align: 'center',
        width: 80,
      },
      {
        title: '隐患等级',
        dataIndex: 'danger_level',
        key: 'danger_level',
        align: 'center',
        width: 65,
      },
    ];

    return (
      <Card title="网格点详情" bordered={false}>
        <DescriptionList col={2} style={{ marginBottom: 16 }}>
          <Description term="点位名称">{objectTitle || getEmptyData()}</Description>
          <Description term="点位级别">
            {+dangerLevel === 1 ? '1级' : +dangerLevel === 2 ? '2级' : getEmptyData()}
          </Description>
          <Description term="推荐检查周期">
            {getCycleType(checkCycleData) || getEmptyData()}
          </Description>
          <Description term="自定义检查周期">
            {getCycleType(checkCycle) || getEmptyData()}
          </Description>
          <Description term="检查周期方案">
            {+cycleType === 1 ? '使用推荐' : '使用自定义' || getEmptyData()}
          </Description>
          <Description term="点位位置">{locationCode || getEmptyData()}</Description>
          <Description term="二维码">{qrCode || getEmptyData()}</Description>
          <Description term="NFC">{nfcCode || getEmptyData()}</Description>
        </DescriptionList>

        <DescriptionList col={1} style={{ marginTop: 16 }}>
          <Description term="检查内容">
            <Card style={{ border: 'none' }}>
              {checkList && checkList.length ? (
                <Table
                  style={{ marginTop: '-10px' }}
                  rowKey="id"
                  columns={COLUMNS}
                  dataSource={checkList}
                  pagination={false}
                  bordered={true}
                />
              ) : (
                <div style={{ marginTop: '-15px', marginLeft: '-30px' }}>暂无数据</div>
              )}
            </Card>
          </Description>
        </DescriptionList>
        <div style={{ textAlign: 'center' }}>
          <AuthButton
            type="primary"
            size="large"
            code={codesMap.riskControl.gridPointManage.edit}
            onClick={() => {
              this.goToEdit(id);
            }}
          >
            编辑
          </AuthButton>
        </div>
      </Card>
    );
  };

  render() {
    const {
      location: {
        query: { companyId, companyName },
      },
    } = this.props;

    // 面包屑
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '风险管控', name: '风险管控' },
      {
        title: '企业网格点管理',
        name: '企业网格点管理',
        href: '/risk-control/grid-point-manage/index',
      },
      {
        title: '单位网格点',
        name: '单位网格点',
        href: `/risk-control/grid-point-manage/grid-point-List/${companyId}?companyId=${companyId}&&companyName=${companyName}`,
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>{companyName}</span>
          </div>
        }
      >
        {this.renderDetail()}
      </PageHeaderLayout>
    );
  }
}
