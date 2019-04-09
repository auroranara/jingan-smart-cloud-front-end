import React, { PureComponent } from 'react';
import {
  Form,
  Card,
  Table,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Button,
  Spin,
  Badge,
  TreeSelect,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Ellipsis from '@/components/Ellipsis';

import styles from './CompanyReport.less';
const { Option } = Select;
const { RangePicker } = DatePicker;
const title = '企业自查报表';

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
    title,
    name: '企业自查报表',
  },
];

/* 根据检查结果获取对应文字 */
const getLabelByStatus = function(status) {
  switch (+status) {
    case 1:
      return <Badge status="success" text="正常" />;
    case 2:
      return <Badge status="error" text="异常" />;
    default:
      return '---';
  }
};

/* 筛选表单label */
const fieldLabels = {
  grid_id: '所属网格',
  company_name: '单位名称',
  checkTime: '检查时间',
  reportingChannels: '上报途径',
  item_name: '点位名称',
  checkUser: '检查人',
  checkResult: '检查结果',
};

/* 获取root下的div */
const getRootChild = () => document.querySelector('#root>div');

/* session前缀 */
const sessionPrefix = 'hidden_danger_report_list_';

/**
 * 企业自查报表
 */
@connect(({ hiddenDangerReport, companyReport, user, loading }) => ({
  hiddenDangerReport,
  companyReport,
  user,
  loading: loading.models.companyReport,
}))
@Form.create()
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    const {
      user: {
        currentUser: { unitType },
      },
    } = props;
    /* 当前账号是否是企业 */
    const isCompany = unitType === 4;

    /* 默认除操作列以外的表格列 */
    const defaultColumns = [
      {
        title: '上报途径',
        dataIndex: 'reporting_channels',
      },
      {
        title: '点位名称',
        dataIndex: 'name',
      },
      {
        title: '检查人',
        dataIndex: 'allCheckPersonNames',
        render: val => (
          <Ellipsis tooltip length={7} style={{ overflow: 'visible' }}>
            {val}
          </Ellipsis>
        ),
      },
      {
        title: '检查日期',
        dataIndex: 'report_time',
        render: value => moment(+value).format('YYYY-MM-DD'),
      },
      {
        title: '检查结果',
        align: 'center',
        dataIndex: 'check_result',
        render: value => getLabelByStatus(value),
      },
      {
        title: '隐患情况',
        dataIndex: 'status',
        render: val => (
          <div>
            <p style={{ marginBottom: 0 }}>
              总数：
              {val}
            </p>
            <p style={{ marginBottom: 0 }}>待整改 1 / 待复查 1</p>
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        fixed: 'right',
        width: 64,
        render: (text, { id }) => <Link to={'/data-analysis/company-report/detail'}>查看</Link>,
      },
    ];
    if (!isCompany) {
      defaultColumns.splice(0, 0, {
        title: '单位名称',
        dataIndex: 'company_name',
      });
    }
    this.state = {
      // 当前显示的表格字段
      columns: defaultColumns,
    };
    // 是否是企业
    this.isCompany = isCompany;
    // 默认表格字段
    this.defaultColumns = defaultColumns;
  }

  /**
   * 挂载后
   */
  componentDidMount() {
    const {
      dispatch,
      form: { setFieldsValue },
      user: {
        currentUser: { id },
      },
    } = this.props;
    // 从sessionStorage中获取存储的控件值
    const payload = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      pageNum: 1,
      pageSize: 10,
      // query_start_time: `${moment().subtract(1, 'months').format('YYYY/MM/DD')} 00:00:00`,
      // query_end_time: `${moment().format('YYYY/MM/DD')} 23:59:59`,
    };
    const { pageNum, pageSize, query_start_time, query_end_time, ...rest } = payload;
    // 重置控件
    setFieldsValue({
      createTime:
        query_start_time && query_end_time
          ? [
              moment(query_start_time, 'YYYY/MM/DD HH:mm:ss'),
              moment(query_end_time, 'YYYY/MM/DD HH:mm:ss'),
            ]
          : [],
      ...rest,
    });

    // 获取列表
    dispatch({
      type: 'hiddenDangerReport/fetchList',
      payload,
    });

    // 获取网格列表
    dispatch({
      type: 'companyReport/fetchGridList',
    });
  }

  /**
   * 查询
   */
  handleSearch = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      companyReport: {
        list: {
          pagination: { pageSize },
        },
      },
      user: {
        currentUser: { id },
      },
    } = this.props;
    const { createTime, ...rest } = getFieldsValue();
    const [query_start_time, query_end_time] = createTime || [];
    const payload = {
      ...rest,
      pageNum: 1,
      pageSize,
      query_start_time: query_start_time && `${query_start_time.format('YYYY/MM/DD')} 00:00:00`,
      query_end_time: query_end_time && `${query_end_time.format('YYYY/MM/DD')} 23:59:59`,
    };
    // 获取隐患列表
    dispatch({
      type: 'companyReport/fetchList',
      payload,
    });
    // 保存筛选条件
    sessionStorage.setItem(`${sessionPrefix}${id}`, JSON.stringify(payload));
  };

  /**
   * 重置
   */
  handleReset = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    // 重置控件
    setFieldsValue({
      grid_id: undefined,
      company_name: undefined,
      code: undefined,
      createTime: undefined,
      status: undefined,
      business_type: undefined,
      item_name: undefined,
      level: undefined,
    });
    this.handleSearch();
  };

  /**
   * 导出
   */
  handleExport = () => {
    const {
      dispatch,
      user: {
        currentUser: { id },
      },
    } = this.props;
    // 从sessionStorage中获取存储的控件值
    const payload = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`));
    dispatch({
      type: 'companyReport/exportData',
      payload,
    });
  };

  /**
   * 加载更多
   */
  handleLoadMore = (num, size) => {
    const {
      dispatch,
      form: { setFieldsValue },
      user: {
        currentUser: { id },
      },
    } = this.props;
    // 从sessionStorage中获取存储的控件值
    const fieldsValue = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`));
    const { pageNum, pageSize, query_start_time, query_end_time, ...rest } = fieldsValue;
    // 重置控件
    setFieldsValue({
      grid_id: undefined,
      company_name: undefined,
      code: undefined,
      status: undefined,
      business_type: undefined,
      item_name: undefined,
      level: undefined,
      createTime:
        query_start_time && query_end_time
          ? [
              moment(query_start_time, 'YYYY/MM/DD HH:mm:ss'),
              moment(query_end_time, 'YYYY/MM/DD HH:mm:ss'),
            ]
          : [],
      ...rest,
    });
    // console.log(pageNum);
    // 获取隐患列表
    dispatch({
      type: 'companyReport/fetchList',
      payload: {
        ...fieldsValue,
        pageNum: num,
        pageSize: size,
      },
    });
    // 保存筛选条件
    sessionStorage.setItem(
      `${sessionPrefix}${id}`,
      JSON.stringify({
        ...fieldsValue,
        pageNum: 1,
        pageSize: size,
      })
    );
  };

  /**
   * 筛选表单
   **/
  renderFilterForm() {
    const {
      companyReport: { gridList, reportingChannelsList, checkResultList },
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form className={styles.form}>
        <Row gutter={{ md: 24 }}>
          {/* 所属网格 */}
          {!this.isCompany && (
            <Col xl={8} md={12} sm={24} xs={24}>
              <Form.Item label={fieldLabels.grid_id}>
                {getFieldDecorator('grid_id')(
                  <TreeSelect
                    treeData={gridList}
                    placeholder="请选择"
                    getPopupContainer={getRootChild}
                    allowClear
                    dropdownStyle={{
                      maxHeight: '50vh',
                    }}
                  />
                )}
              </Form.Item>
            </Col>
          )}
          {/* 单位名称 */}
          {!this.isCompany && (
            <Col xl={8} md={12} sm={24} xs={24}>
              <Form.Item label={fieldLabels.company_name}>
                {getFieldDecorator('company_name')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          )}
          {/* 检查日期 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.checkTime}>
              {getFieldDecorator('createTime', {})(
                <RangePicker
                  style={{ width: '100%' }}
                  getCalendarContainer={getRootChild}
                  allowClear
                />
              )}
            </Form.Item>
          </Col>
          {/* 上报途径 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.reportingChannels}>
              {getFieldDecorator('source_type')(
                <Select placeholder="请选择" getPopupContainer={getRootChild} allowClear>
                  {reportingChannelsList.map(({ key, value }) => (
                    <Option value={key} key={key}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          {/* 点位名称 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.item_name}>
              {getFieldDecorator('item_name')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          {/* 检查人 */}
          {!this.isCompany && (
            <Col xl={8} md={12} sm={24} xs={24}>
              <Form.Item label={fieldLabels.checkUser}>
                {getFieldDecorator('company_name')(<Input placeholder="请输入" />)}
              </Form.Item>
            </Col>
          )}
          {/* 检查结果 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.checkResult}>
              {getFieldDecorator('source_type')(
                <Select placeholder="请选择" getPopupContainer={getRootChild} allowClear>
                  {checkResultList.map(({ key, value }) => (
                    <Option value={key} key={key}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          {/* 按钮 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item>
              <Button type="primary" onClick={this.handleSearch} style={{ marginRight: 16 }}>
                查询
              </Button>
              <Button onClick={this.handleReset} style={{ marginRight: 16 }}>
                重置
              </Button>
              <Button type="primary" onClick={this.handleExport}>
                导出
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }

  /**
   * 表格
   */
  renderTable() {
    const {
      hiddenDangerReport: {
        list: {
          list,
          pagination: { pageSize = 10, pageNum = 1, total = 0 },
        },
      },
    } = this.props;
    const { columns } = this.state;
    return list.length > 0 ? (
      <Table
        className={styles.table}
        dataSource={list}
        columns={columns}
        rowKey="id"
        scroll={{
          x: true,
        }}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          pageSizeOptions: ['5', '10', '15', '20'],
          // showTotal: (total) => `共 ${total} 条`,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: this.handleLoadMore,
          onShowSizeChange: (num, size) => {
            this.handleLoadMore(1, size);
          },
        }}
      />
    ) : (
      <div style={{ textAlign: 'center' }}>
        <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>
      </div>
    );
  }

  /**
   * 渲染函数
   */
  render() {
    const {
      companyReport: {
        list: {
          pagination: { total },
        },
      },
      loading,
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            检查记录总数：
            {total}
          </div>
        }
      >
        <Spin spinning={!!loading}>
          <Card bordered={false}>
            {this.renderFilterForm()}
            {this.renderTable()}
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
