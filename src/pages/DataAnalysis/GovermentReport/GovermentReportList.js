import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
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
  Modal,
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
// 默认每页显示数量
const defaultPageSize = 10;

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
      // {
      //   title: '上报途径',
      //   dataIndex: 'itemTypeName',
      // },
      // {
      //   title: '点位名称',
      //   dataIndex: 'object_title',
      //   render: val => (
      //     <Ellipsis tooltip length={14} style={{ overflow: 'visible' }}>
      //       {val}
      //     </Ellipsis>
      //   ),
      // },
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
            check_user_names,
            check_date,
            checkResultName,
            object_title,
            end_time,
          } = text;
          const startDate = moment(check_date).format('YYYY-MM-DD')
          const endDate = moment(end_time).format('YYYY-MM-DD')
          const date = check_date === end_time ? moment(check_date).format('YYYY-MM-DD HH:mm') : startDate === endDate ? `${moment(check_date).format('YYYY-MM-DD HH:mm')}~${moment(end_time).format('HH:mm')}` : `${startDate}~${endDate}`
          return (
            <Link
              to={`/data-analysis/goverment-report/detail/${check_id}?companyName=${company_name}&&object_title=${encodeURIComponent(
                object_title
              )}&&check_user_names=${check_user_names}&&check_date=${date}&&checkResultName=${checkResultName}`}
            >
              查看
            </Link>
          )
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
      selectedRowKeys: [],
      visible: false,
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
    const { pageNum = 1, pageSize = defaultPageSize, startTime, endTime, companyName, ...rest } = payload;

    // 筛选栏填入值
    setFieldsValue({
      createTime:
        startTime && endTime
          ? [moment(startTime, 'YYYY/MM/DD HH:mm:ss'), moment(endTime, 'YYYY/MM/DD HH:mm:ss')]
          : [],
      ...rest,
    });

    // 获取网格列表
    dispatch({
      type: 'hiddenDangerReport/fetchGridList',
    });

    // 筛选栏模糊查询企业列表
    dispatch({
      type: 'hiddenDangerReport/fetchUnitListFuzzy',
      payload: companyName ? {
        unitName: companyName,
        pageNum: 1,
        pageSize: 10,
      } : null,
      success: (arr) => {
        this.handleSearch(pageNum, pageSize, arr)
      },
    });

    // 根据用户类型获取单位
    // payload.companyId &&
    //   dispatch({
    //     type: 'hiddenDangerReport/fetchUnitListFuzzy',
    //     payload: {
    //       unitName: payload.companyName,
    //       pageNum: 1,
    //       pageSize: 10,
    //     },
    //   });
  }

  componentDidUpdate({ maintenanceReport: { data: { list: prevList } } }) {
    const { maintenanceReport: { data: { list } } } = this.props;
    if (prevList !== list) {
      this.handleTableSelectClear();
    }
  }

  /**
   * 查询
   */
  handleSearch = (pageNum = 1, pageSize = defaultPageSize, arr) => {
    const {
      dispatch,
      form: { getFieldsValue },
      hiddenDangerReport: { unitIdes },
      user: {
        currentUser: { id, companyId: cId, unitType },
      },
    } = this.props;

    const { createTime, companyId: serCId, ...rest } = getFieldsValue();
    const [startTime, endTime] = createTime || [];
    // 企业用户登录传currentUser中的企业id
    const companyId = unitType === 4 ? cId : serCId
    const units = arr || unitIdes
    const targetCom = units && units.find(item => item.id === companyId)

    const payload = {
      ...rest,
      pageNum,
      pageSize,
      companyId,
      companyName: targetCom && targetCom.name,
      startTime: startTime && `${startTime.format('YYYY/MM/DD')} 00:00:00`,
      endTime: endTime && `${endTime.format('YYYY/MM/DD')} 23:59:59`,
    };
    const searchInfo = unitType === 4 ? { ...payload, companyId: null } : payload
    // 获取列表
    dispatch({
      type: 'maintenanceReport/fetchMaintenanceCheckForGov',
      payload: {
        ...payload,
        // reportSource: 2,
      },
    });
    // 保存筛选条件
    sessionStorage.setItem(`${sessionPrefix}${id}`, JSON.stringify(searchInfo));
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
      companyId: undefined,
      createTime: undefined,
      // itemType: undefined,
      // objectTitle: undefined,
      checkUserName: undefined,
      checkResult: undefined,
    });
    this.handleSearch();
  };

  /**
   * 导出
   */
  handleExport = () => {
    this.setState({ visible: true });
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

  // 表格选中
  handleTableSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 清空表格选中
  handleTableSelectClear = () => {
    this.setState({ selectedRowKeys: [] });
  }

  /* 导出需要详情 */
  handleOk = () => {
    const {
      dispatch,
    } = this.props;
    const { selectedRowKeys } = this.state;
    dispatch({
      type: 'maintenanceReport/exportGovData',
      payload: {
        type: 3,
        detail: 1,
        ids: selectedRowKeys.join(','),
      },
    });
    this.setState({ visible: false });
  }

  /* 导出不需要详情 */
  handleCancel = (e) => {
    if (e.target.tagName === 'BUTTON') {
      const {
        dispatch,
      } = this.props;
      const { selectedRowKeys } = this.state;
      dispatch({
        type: 'maintenanceReport/exportGovData',
        payload: {
          type: 3,
          detail: 0,
          ids: selectedRowKeys.join(','),
        },
      });
    }
    this.setState({ visible: false });
  }

  /* 确认框 */
  renderConfirm() {
    const { visible } = this.state;

    return (
      <Modal
        title="信息"
        visible={visible}
        okText="需要"
        cancelText="不需要"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        zIndex={9999}
      >
        需要导出检查详情吗？
      </Modal>
    );
  }

  /**
   * 筛选表单
   **/
  renderFilterForm() {
    const {
      maintenanceReport: {
        // reportingChannelsList,
        checkResultList,
      },
      form: { getFieldDecorator },
      hiddenDangerReport: { gridList, unitIdes },
      loading,
    } = this.props;
    const { selectedRowKeys } = this.state;
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
                {getFieldDecorator('companyId')(
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
          {/* <Col xl={8} md={12} sm={24} xs={24}>
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
          </Col> */}
          {/* 点位名称 */}
          {/* <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.item_name}>
              {getFieldDecorator('objectTitle')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col> */}
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
              <Button type="primary" onClick={() => this.handleSearch()} style={{ marginRight: 16 }}>
                查询
              </Button>
              <Button onClick={this.handleReset} style={{ marginRight: 16 }}>
                重置
              </Button>
              <Button type="primary" onClick={this.handleExport} disabled={selectedRowKeys.length === 0}>
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
    const { columns, selectedRowKeys } = this.state;
    return list.length > 0 ? (
      <Table
        className={styles.table}
        rowKey="check_id"
        dataSource={list}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: this.handleTableSelectChange,
        }}
        scroll={{
          x: true,
        }}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          // pageSizeOptions: ['5', '10', '15', '20'],
          // showTotal: (total) => `共 ${total} 条`,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: this.handleSearch,
          onShowSizeChange: (num, size) => {
            this.handleSearch(1, size);
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
            {this.renderConfirm()}
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
