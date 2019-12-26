import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Row, Col, Table, Card, Divider, message, Input } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import CompanyModal from '@/pages/BaseInfo/Company/CompanyModal';
import { AuthA, AuthPopConfirm } from '@/utils/customAuth';
import codes from '@/utils/codes';
import { hasAuthority } from '@/utils/customAuth';

import styles from './TableList.less';
import Map from './Map';

const title = '风险四色图管理';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '风险分级管控',
    name: '风险分级管控',
  },
  {
    title,
    name: '风险四色图管理',
  },
];

// 权限
const {
  riskControl: {
    fourColorImage: { add: addCode, edit: editCode, delete: deleteCode },
  },
} = codes;

const getRiskLevel = {
  1: '红',
  2: '橙',
  3: '黄',
  4: '蓝',
};

const getRiskColor = {
  1: 'rgb(252, 31, 2)',
  2: 'rgb(237, 126, 17)',
  3: 'rgb(251, 247, 24)',
  4: 'rgb(30, 96, 255)',
};
@Form.create()
@connect(({ resourceManagement, fourColorImage, user, loading }) => ({
  fourColorImage,
  resourceManagement,
  user,
  loading: loading.models.fourColorImage,
  companyLoading: loading.effects['resourceManagement/fetchCompanyList'],
}))
export default class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      isReset: false,
      company: undefined, // 左上角选择的单位信息
      visible: false, // 控制选择单位弹窗显示
    };
  }

  componentDidMount() {
    const {
      user: {
        currentUser: { companyId },
      },
      resourceManagement: { searchInfo = {} },
    } = this.props;
    const company = { id: searchInfo.id, name: searchInfo.name };
    const payload = {
      pageNum: 1,
      pageSize: 24,
    };
    this.fetchList({ ...payload, companyId: companyId || searchInfo.id }, res => {
      setTimeout(() => {
        this.childMap.getPointList(res.list);
      }, 1000);
    });
    this.setState({ company });
  }

  onRef = ref => {
    this.childMap = ref;
  };

  // 获取列表
  fetchList = (params, callback) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fourColorImage/fetchList',
      payload: {
        ...params,
        pageNum: 1,
        pageSize: 24,
      },
      callback,
    });
  };

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fourColorImage/fetchDelete',
      payload: { ids: id },
      success: () => {
        this.fetchList({}, res => {
          this.childMap.getPointList(res.list);
          this.childMap.setRestMap();
        });
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };

  // 获取单位列表
  fetchCompanyList = action => {
    const { dispatch } = this.props;
    dispatch({ type: 'resourceManagement/fetchCompanyList', ...action });
  };

  handleComapnyModal = () => {
    this.fetchCompanyList({
      payload: { pageNum: 1, pageSize: 10 },
      callback: () => {
        this.setState({ visible: true });
      },
    });
  };

  handleSelectCompany = company => {
    const { dispatch } = this.props;
    this.setState({ company, visible: false });
    // 获取列表
    this.fetchList({ companyId: company.id });
    // 保存企业信息，方便返回该页面显示
    dispatch({
      type: 'resourceManagement/saveSearchInfo',
      payload: company,
    });
  };

  render() {
    const {
      loading,
      companyLoading,
      resourceManagement: { companyList },
      fourColorImage: {
        data: {
          list = [],
          // pagination: { pageNum, pageSize, total },
        },
      },
      user: {
        currentUser: { permissionCodes, unitType, companyId },
      },
    } = this.props;
    console.log('list', list);

    const { isDrawing, company = {}, visible } = this.state;

    const addAuth = hasAuthority(addCode, permissionCodes);

    const columns = [
      {
        title: '区域名称',
        dataIndex: 'zoneName',
        key: 'zoneName',
        align: 'center',
        // render: text => <a>{text}</a>,
      },
      {
        title: '负责人',
        dataIndex: 'zoneChargerName',
        key: 'zoneChargerName',
        align: 'center',
      },
      {
        title: '风险分级',
        dataIndex: 'zoneLevel',
        key: 'zoneLevel',
        align: 'center',
        render: val => {
          return <span style={{ color: getRiskColor[val] }}>{getRiskLevel[val]}</span>;
        },
      },
      {
        title: '复评周期',
        key: 'checkCircle',
        dataIndex: 'checkCircle',
        align: 'center',
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (val, record) => (
          <span>
            <AuthA
              code={editCode}
              href={`#/risk-control/four-color-image/edit/${record.id}?companyId=${company.id ||
                companyId}`}
            >
              编辑
            </AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              title="确认要删除数据吗？"
              code={deleteCode}
              onConfirm={() => this.handleDelete(record.id)}
            >
              删除
            </AuthPopConfirm>
          </span>
        ),
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          unitType !== 4 && (
            <Fragment>
              <Input
                disabled
                style={{ width: '300px' }}
                placeholder={'请选择单位'}
                value={company.name}
              />
              <Button
                type="primary"
                style={{ marginLeft: '5px' }}
                onClick={this.handleComapnyModal}
              >
                选择单位
              </Button>
            </Fragment>
          )
        }
      >
        {company.id || companyId ? (
          <Row>
            <Col span={12}>
              <Card title="地图" bordered={false}>
                {/* {this.renderDrawButton()} */}
                <Map isDrawing={isDrawing} onRef={this.onRef} pointList={list} />
              </Card>
            </Col>
            <Col span={12}>
              <Card
                title="区域列表"
                bordered={false}
                className={styles.cardList}
                extra={
                  <Button
                    type="primary"
                    disabled={!addAuth}
                    href={`#/risk-control/four-color-image/add?companyId=${company.id ||
                      companyId}`}
                  >
                    新增
                  </Button>
                }
              >
                <Table
                  rowKey="id"
                  loading={loading}
                  columns={columns}
                  dataSource={list}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        ) : (
          <div style={{ textAlign: 'center' }}>请先选择单位</div>
        )}

        <CompanyModal
          title="选择单位"
          loading={companyLoading}
          visible={visible}
          modal={companyList}
          fetch={this.fetchCompanyList}
          onSelect={this.handleSelectCompany}
          onClose={this.handleModalCLose}
        />
      </PageHeaderLayout>
    );
  }
}
