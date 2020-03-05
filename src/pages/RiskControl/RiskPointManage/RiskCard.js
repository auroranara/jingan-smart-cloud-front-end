import React, { PureComponent } from 'react';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Card,
  Table,
  Tooltip,
  Spin,
  Divider,
  Popconfirm,
  Modal,
  Col,
  Button,
  message,
  Pagination,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import styles from './index.less';

const title = '风险告知卡';
const { confirm } = Modal;

/**
 * 风险告知卡
 */
@connect(({ riskPointManage, user, loading }) => ({
  riskPointManage,
  user,
  loading: loading.models.riskPointManage,
}))
@Form.create()
export default class RiskCard extends PureComponent {
  state = {
    isShowEwm: true,
    showEwm: false,
  };
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

    // 获取列表
    dispatch({
      type: 'riskPointManage/fetchRiskCardList',
      payload: {
        itemId: id,
        pageSize: 10,
        pageNum: 1,
      },
    });
  }

  goBack = () => {
    const {
      location: {
        query: { companyName, companyId },
      },
      dispatch,
    } = this.props;
    dispatch(
      routerRedux.push(
        `/risk-control/risk-point-manage/risk-point-List/${companyId}?companyId=${companyId}&&companyName=${companyName}`
      )
    );
  };

  goRiskCardEdit = id => {
    const {
      location: {
        query: { companyName, companyId },
      },
      dispatch,
      match: {
        params: { id: itemId },
      },
    } = this.props;
    dispatch(
      routerRedux.push(
        `/risk-control/risk-point-manage/risk-card-edit/${id}?itemId=${itemId}&&companyId=${companyId}&&companyName=${companyName}`
      )
    );
  };

  handlePrint = id => {
    const {
      dispatch,
      match: {
        params: { id: itemId },
      },
      location: {
        query: { companyName, companyId },
      },
    } = this.props;
    const { isShowEwm, showEwm } = this.state;
    confirm({
      title: '信息',
      content: '需要展示二维码吗？',
      okText: '需要',
      cancelText: '不需要',
      onOk() {
        dispatch(
          routerRedux.push(
            `/risk-control/risk-point-manage/risk-card-printer/${id}?itemId=${itemId}&&companyId=${companyId}&&companyName=${companyName}&&isShowEwm=${isShowEwm}`
          )
        );
      },
      onCancel() {
        dispatch(
          routerRedux.push(
            `/risk-control/risk-point-manage/risk-card-printer/${id}?itemId=${itemId}&&companyId=${companyId}&&companyName=${companyName}&&isShowEwm=${showEwm}`
          )
        );
      },
    });
  };

  /**
   * 加载更多
   */
  onPageChange = (num, size) => {
    const {
      dispatch,
      form: { getFieldsValue },
      match: {
        params: { id },
      },
    } = this.props;
    const data = getFieldsValue();
    // 获取列表
    dispatch({
      type: 'riskPointManage/fetchRiskCardList',
      payload: {
        itemId: id,
        pageSize: size,
        pageNum: num,
        ...data,
      },
    });
  };

  // 删除风险告知卡
  handleDelete = id => {
    const {
      dispatch,
      match: {
        params: { id: itemId },
      },
    } = this.props;
    dispatch({
      type: 'riskPointManage/deleteHdLetter',
      payload: { ids: id },
      callback: ({ error }) => {
        if (error && error.code === 200) {
          dispatch({
            type: 'riskPointManage/fetchRiskCardList',
            payload: {
              itemId,
              pageSize: 10,
              pageNum: 1,
            },
          });
          message.success('删除成功！');
        } else message.warning('删除失败');
      },
    });
  };
  /**
   * 表格
   */
  renderTable() {
    const {
      riskPointManage: {
        riskCardData: {
          list,
          pagination: { pageSize, pageNum, total },
        },
      },
    } = this.props;

    const defaultColumns = [
      {
        title: '告知卡名称',
        key: 'letterName',
        dataIndex: 'letterName',
        align: 'center',
        width: 140,
      },
      {
        title: '场所/环节/部位名称',
        dataIndex: 'areaName',
        key: 'areaName',
        align: 'center',
        width: 230,
      },
      {
        title: '风险分类',
        dataIndex: 'riskTypeName',
        key: 'riskTypeName',
        align: 'center',
        width: 140,
      },
      {
        title: '易导致的事故类型',
        dataIndex: 'accidentTypeName',
        key: 'accidentTypeName',
        align: 'center',
        width: 200,
      },
      {
        title: '主要危险因素',
        dataIndex: 'dangerFactor',
        align: 'center',
        width: 300,
        render: val => (
          <Ellipsis tooltip length={25} style={{ overflow: 'visible' }}>
            {val}
          </Ellipsis>
        ),
      },
      {
        title: '风险管控因素',
        dataIndex: 'preventMeasures',
        align: 'center',
        width: 300,
        render: val => (
          <Ellipsis tooltip length={25} style={{ overflow: 'visible' }}>
            {val}
          </Ellipsis>
        ),
      },
      {
        title: '应急处置措施',
        dataIndex: 'emergencyMeasures',
        align: 'center',
        width: 450,
        render: val => (
          <Ellipsis tooltip length={25} style={{ overflow: 'visible' }}>
            {val}
          </Ellipsis>
        ),
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        fixed: 'right',
        align: 'center',
        width: 180,
        render: (text, rows) => (
          <span>
            <a onClick={() => this.goRiskCardEdit(rows.id)}>
              <Tooltip title="编辑" placement="bottom" overlayStyle={{ fontSize: '12px' }}>
                <LegacyIcon type="edit" style={{ fontSize: '18px' }} />
              </Tooltip>
            </a>
            <Divider type="vertical" />
            <a onClick={() => this.handlePrint(rows.id)}>
              <Tooltip title="打印预览" placement="bottom" overlayStyle={{ fontSize: '12px' }}>
                <LegacyIcon type="printer" style={{ fontSize: '18px' }} />
              </Tooltip>
            </a>
            <Divider type="vertical" />
            <Popconfirm title="确认要删除该信息吗？" onConfirm={() => this.handleDelete(rows.id)}>
              <a>
                <Tooltip title="删除" placement="bottom" overlayStyle={{ fontSize: '12px' }}>
                  <LegacyIcon type="delete" style={{ fontSize: '18px' }} />
                </Tooltip>
              </a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    return list.length > 0 ? (
      <div>
        <Table
          bordered={true}
          className={styles.table}
          rowKey="check_id"
          dataSource={list}
          columns={defaultColumns}
          scroll={{
            x: 1800,
          }}
          pagination={false}
        />
        <Pagination
          style={{ marginTop: '20px', float: 'right' }}
          showQuickJumper
          showSizeChanger
          current={pageNum}
          pageSize={pageSize}
          pageSizeOptions={['5', '10', '15', '20']}
          total={total}
          onChange={this.onPageChange}
          onShowSizeChange={(num, size) => {
            this.onPageChange(1, size);
          }}
        />
      </div>
    ) : (
      <div style={{ textAlign: 'center', paddingTop: 50 }}>
        <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>
      </div>
    );
  }

  /**
   * 渲染函数
   */
  render() {
    const {
      riskPointManage: {
        riskCardData: {
          pagination: { total },
        },
      },
      location: {
        query: { companyName, companyId },
      },
      match: {
        params: { id },
      },
      loading,
    } = this.props;

    /* 面包屑 */
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '风险点管理',
        name: '风险点管理',
      },
      {
        title: '单位风险点',
        name: '单位风险点',
        href: `/risk-control/risk-point-manage/risk-point-List/${companyId}?companyId=${companyId}&&companyName=${companyName}`,
      },
      {
        title,
        name: '风险告知卡',
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>{companyName}</span>
            <span style={{ paddingLeft: 15 }}>
              列表总数：
              {total}
            </span>
            <Form layout="inline">
              <Col>
                <Form.Item style={{ float: 'right' }}>
                  <Button onClick={this.goBack}>返回</Button>
                </Form.Item>
                <Form.Item style={{ float: 'right' }}>
                  <Button
                    type="primary"
                    href={`#/risk-control/risk-point-manage/risk-card-add?itemId=${id}&companyId=${companyId}&&companyName=${companyName}`}
                  >
                    添加
                  </Button>
                </Form.Item>
              </Col>
            </Form>
          </div>
        }
      >
        <Spin spinning={!!loading}>
          <Card bordered={false}>{this.renderTable()}</Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
