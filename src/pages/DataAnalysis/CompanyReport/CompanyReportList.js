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
const sessionPrefix = 'company_report_list_';

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
    const isWbCompany = unitType === 1;

    /* 默认除操作列以外的表格列 */
    const defaultColumns = [
      {
        title: '上报途径',
        dataIndex: 'itemTypeName',
      },
      {
        title: '点位名称',
        dataIndex: 'object_title',
      },
      {
        title: '检查人',
        dataIndex: 'check_user_name',
        render: (text, val) => {
          return (
            <div>
              <span>
                {text},{val.check_user_names}
              </span>
            </div>
          );
        },
      },
      {
        title: '检查日期',
        dataIndex: 'check_date',
        render: value => moment(+value).format('YYYY-MM-DD'),
      },
      {
        title: '检查结果',
        align: 'center',
        dataIndex: 'checkResultName',
        render: value =>
          value === '异常' ? (
            <Badge status="error" text={value} />
          ) : (
            <Badge status="success" text={value} />
          ),
      },
      {
        title: '隐患情况',
        dataIndex: 'dangerStatus',
        render: (val, text) => {
          const { over_rectify, rectify, review, closed, total } = text;
          const resultStatus = ['已超期', '待整改', '待复查', '已关闭'];
          const nums = [over_rectify, rectify, review, closed];
          return (
            <div>
              <p style={{ marginBottom: 0 }}>
                总数：
                {total}
              </p>
              {resultStatus
                .map((data, index) => {
                  return nums[index] ? `${data} ${nums[index]}` : '';
                })
                .filter(data => data)
                .join('/')}
            </div>
          );
        },
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        fixed: 'right',
        width: 64,
        render: text => {
          const {
            check_id,
            company_name,
            itemTypeName,
            check_user_name,
            check_date,
            checkResultName,
            object_title,
            _id,
          } = text;
          return itemTypeName !== '随手拍' ? (
            <Link
              to={`/data-analysis/company-report/detail/${check_id}?companyName=${company_name}&&object_title=${object_title}&&itemTypeName=${itemTypeName}&&check_user_name=${check_user_name}&&check_date=${check_date}&&checkResultName=${checkResultName}`}
            >
              查看
            </Link>
          ) : (
            <Link to={`/data-analysis/company-report/convenientlyDetail/${_id}?newId=${_id}`}>
              查看
            </Link>
          );
        },
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
      i: 0,
    };
    // 是否是企业
    this.isCompany = isCompany;
    // 是否是维保
    this.isWbCompany = isWbCompany;
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
    };

    const { pageNum, pageSize, startTime, endTime, ...rest } = payload;
    // 重置控件
    setFieldsValue({
      createTime:
        startTime && endTime
          ? [moment(startTime, 'YYYY/MM/DD HH:mm:ss'), moment(endTime, 'YYYY/MM/DD HH:mm:ss')]
          : [],
      ...rest,
    });

    // 获取列表
    dispatch({
      type: 'companyReport/fetchList',
      payload,
    });

    // 获取网格列表
    dispatch({
      type: 'hiddenDangerReport/fetchGridList',
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
        data: {
          pagination: { pageSize },
        },
      },
      user: {
        currentUser: { id },
      },
    } = this.props;
    const { createTime, ...rest } = getFieldsValue();
    const [startTime, endTime] = createTime || [];
    const payload = {
      ...rest,
      pageNum: 1,
      pageSize,
      startTime: startTime && `${startTime.format('YYYY/MM/DD')} 00:00:00`,
      endTime: endTime && `${endTime.format('YYYY/MM/DD')} 23:59:59`,
    };
    // 获取列表
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
      gridId: undefined,
      companyName: undefined,
      createTime: undefined,
      itemType: undefined,
      objectTitle: undefined,
      checkUserName: undefined,
      checkResult: undefined,
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
    const fieldsValue = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      pageNum: 1,
      pageSize: 10,
    };
    const { pageNum, pageSize, startTime, endTime, ...rest } = fieldsValue;
    // 重置控件
    setFieldsValue({
      gridId: undefined,
      companyName: undefined,
      itemType: undefined,
      objectTitle: undefined,
      checkUserName: undefined,
      checkResult: undefined,
      createTime:
        startTime && endTime
          ? [moment(startTime, 'YYYY/MM/DD HH:mm:ss'), moment(endTime, 'YYYY/MM/DD HH:mm:ss')]
          : [],
      ...rest,
    });
    // 获取列表
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
      companyReport: { reportingChannelsList, checkResultList },
      form: { getFieldDecorator },
      hiddenDangerReport: { gridList },
    } = this.props;
    return (
      <Form className={styles.form}>
        <Row gutter={{ md: 24 }}>
          {/* 所属网格 */}
          {!this.isCompany &&
            !this.isWbCompany && (
              <Col xl={8} md={12} sm={24} xs={24}>
                <Form.Item label={fieldLabels.grid_id}>
                  {getFieldDecorator('gridId')(
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
                {getFieldDecorator('companyName')(<Input placeholder="请输入" />)}
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
              {getFieldDecorator('itemType')(
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
              {getFieldDecorator('objectTitle')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          {/* 检查人 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.checkUser}>
              {getFieldDecorator('checkUserName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          {/* 检查结果 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.checkResult}>
              {getFieldDecorator('checkResult')(
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
      companyReport: {
        data: {
          list,
          pagination: { pageSize, pageNum, total },
        },
      },
    } = this.props;
    const { columns, i } = this.state;
    return list.length > 0 ? (
      <Table
        className={styles.table}
        dataSource={list}
        columns={columns}
        key={i + 1}
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
        data: {
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
