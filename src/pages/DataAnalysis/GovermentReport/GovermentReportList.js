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
  AutoComplete,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import debounce from 'lodash/debounce';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import Ellipsis from '@/components/Ellipsis';

import styles from './GovermentReport.less';
const { Option } = Select;
const { RangePicker } = DatePicker;
const title = '政府监督报表';

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
    name: '政府监督报表',
  },
];

/* 筛选表单label */
const fieldLabels = {
  grid_id: '所属网格',
  company_name: '单位名称',
  check_time: '检查时间',
  reporting_channels: '上报途径',
  item_name: '点位名称',
  check_user: '检查人',
  check_result: '检查结果',
};

/* 获取root下的div */
const getRootChild = () => document.querySelector('#root>div');

/* session前缀 */
const sessionPrefix = 'goverment_report_list_';

/**
 * 政府监督报表
 */
@connect(({ hiddenDangerReport, maintenanceReport, user, loading }) => ({
  hiddenDangerReport,
  maintenanceReport,
  user,
  loading: loading.models.maintenanceReport,
}))
@Form.create()
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.handleUnitIdChange = debounce(this.handleUnitIdChange, 800);
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
        render: val => (
          <Ellipsis tooltip length={14} style={{ overflow: 'visible' }}>
            {val}
          </Ellipsis>
        ),
      },
      {
        title: '检查人',
        dataIndex: 'check_user_names',
        render: val => (
          <Ellipsis tooltip length={6} style={{ overflow: 'visible' }}>
            {val}
          </Ellipsis>
        ),
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
          const { over_rectify, rectify, review, closed, total, checkResultName } = text;
          const resultStatus = ['已超期', '待整改', '待复查', '已关闭'];
          const nums = [over_rectify, rectify, review, closed];
          return (
            checkResultName === '异常' && (
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
            )
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
            check_user_names,
            check_date,
            checkResultName,
            object_title,
            _id,
          } = text;
          return itemTypeName !== '随手拍' ? (
            <Link
              to={`/data-analysis/goverment-report/detail/${check_id}?companyName=${company_name}&&object_title=${object_title}&&itemTypeName=${itemTypeName}&&check_user_names=${check_user_names}&&check_date=${check_date}&&checkResultName=${checkResultName}`}
            >
              查看
            </Link>
          ) : (
            <Link
              to={`/data-analysis/goverment-report/govermentCheckDetail/${_id}?newGovId=${_id}`}
            >
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
        render: val => (
          <Ellipsis tooltip length={14} style={{ overflow: 'visible' }}>
            {val}
          </Ellipsis>
        ),
      });
    }
    this.state = {
      // 当前显示的表格字段
      columns: defaultColumns,
      i: 0,
    };
    // 是否是企业
    this.isCompany = isCompany;
    // 是否是运维
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
      type: 'maintenanceReport/fetchMaintenancList',
      payload: {
        ...payload,
        reportSource: 2,
      },
    });

    // 获取网格列表
    dispatch({
      type: 'hiddenDangerReport/fetchGridList',
    });

    dispatch({
      type: 'hiddenDangerReport/fetchUnitListFuzzy',
    });

    // 根据用户类型获取单位
    payload.company_id &&
      dispatch({
        type: 'hiddenDangerReport/fetchUnitListFuzzy',
        payload: {
          unitName: payload.companyName,
          pageNum: 1,
          pageSize: 10,
        },
      });
  }

  /**
   * 查询
   */
  handleSearch = () => {
    const {
      dispatch,
      form: { getFieldsValue },
      maintenanceReport: {
        data: {
          pagination: { pageSize },
        },
      },
      hiddenDangerReport: { unitIdes },
      user: {
        currentUser: { id },
      },
    } = this.props;
    const { createTime, company_id, ...rest } = getFieldsValue();
    const [startTime, endTime] = createTime || [];
    const payload = {
      ...rest,
      pageNum: 1,
      pageSize,
      company_id,
      companyName:
        unitIdes.find(item => item.id === company_id) &&
        unitIdes.find(item => item.id === company_id).name,
      startTime: startTime && `${startTime.format('YYYY/MM/DD')} 00:00:00`,
      endTime: endTime && `${endTime.format('YYYY/MM/DD')} 23:59:59`,
    };
    // 获取列表
    dispatch({
      type: 'maintenanceReport/fetchMaintenancList',
      payload: {
        ...payload,
        reportSource: 2,
      },
    });
    // 保存筛选条件
    sessionStorage.setItem(`${sessionPrefix}${id}`, JSON.stringify(payload));
  };

  /**
   * 重置
   */
  handleReset = () => {
    const {
      dispatch,
      form: { setFieldsValue },
    } = this.props;
    // 重置控件
    setFieldsValue({
      gridId: undefined,
      company_id: undefined,
      createTime: undefined,
      itemType: undefined,
      objectTitle: undefined,
      checkUserName: undefined,
      checkResult: undefined,
    });
    this.handleSearch();
    dispatch({
      type: 'hiddenDangerReport/fetchUnitListFuzzy',
      payload: {
        // unitName: value && value.trim(),
        pageNum: 1,
        pageSize: 10,
      },
    });
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
      type: 'maintenanceReport/exportGovData',
      payload: {
        ...payload,
        reportSource: 2,
      },
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
    const { pageNum, pageSize, startTime, endTime, company_id, ...rest } = fieldsValue;
    // 重置控件
    setFieldsValue({
      gridId: undefined,
      company_id: undefined,
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
      type: 'maintenanceReport/fetchMaintenancList',
      payload: {
        ...fieldsValue,
        pageNum: num,
        pageSize: size,
        reportSource: 2,
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

  // 单位下拉框输入
  handleUnitIdChange = value => {
    const { dispatch } = this.props;
    // 根据输入值获取列表
    dispatch({
      type: 'hiddenDangerReport/fetchUnitListFuzzy',
      payload: {
        unitName: value && value.trim(),
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  /**
   * 筛选表单
   **/
  renderFilterForm() {
    const {
      maintenanceReport: { reportingChannelsList, checkResultList },
      form: { getFieldDecorator },
      hiddenDangerReport: { gridList, unitIdes },
      loading,
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
                        zIndex: 50,
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
                {getFieldDecorator('company_id')(
                  <AutoComplete
                    allowClear
                    mode="combobox"
                    optionLabelProp="children"
                    placeholder="请选择"
                    dropdownStyle={{ zIndex: 50 }}
                    notFoundContent={loading ? <Spin size="small" /> : '暂无数据'}
                    onSearch={this.handleUnitIdChange}
                    filterOption={false}
                  >
                    {unitIdes.map(({ id, name }) => (
                      <Option value={id} key={id}>
                        {name}
                      </Option>
                    ))}
                  </AutoComplete>
                )}
              </Form.Item>
            </Col>
          )}
          {/* 检查日期 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.check_time}>
              {getFieldDecorator('createTime', {})(
                <RangePicker
                  style={{ width: '100%' }}
                  popupStyle={{ zIndex: 50 }}
                  getCalendarContainer={getRootChild}
                  allowClear
                />
              )}
            </Form.Item>
          </Col>
          {/* 上报途径 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.reporting_channels}>
              {getFieldDecorator('itemType')(
                <Select
                  placeholder="请选择"
                  getPopupContainer={getRootChild}
                  dropdownStyle={{ zIndex: 50 }}
                  allowClear
                >
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
            <Form.Item label={fieldLabels.check_user}>
              {getFieldDecorator('checkUserName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          {/* 检查结果 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.check_result}>
              {getFieldDecorator('checkResult')(
                <Select
                  placeholder="请选择"
                  getPopupContainer={getRootChild}
                  dropdownStyle={{ zIndex: 50 }}
                  allowClear
                >
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
      maintenanceReport: {
        data: {
          list,
          pagination: { pageSize, pageNum, total },
        },
      },
    } = this.props;
    const { columns } = this.state;
    return list.length > 0 ? (
      <Table
        className={styles.table}
        rowKey="check_id"
        dataSource={list}
        columns={columns}
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
      maintenanceReport: {
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
