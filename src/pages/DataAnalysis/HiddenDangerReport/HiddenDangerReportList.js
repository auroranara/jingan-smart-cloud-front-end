import React, { PureComponent } from 'react';
import { Form, Card, Table, Row, Col, Input, Select, DatePicker, Button, Spin, Badge, TreeSelect } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Lightbox from 'react-images';
import Link from 'umi/link';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import TagSelect from '@/components/TagSelect';
import urls from '@/utils/urls';
import titles from '@/utils/titles';
import Ellipsis from '@/components/Ellipsis';

import styles from './HiddenDangerReportList.less';
const { Option: TagSelectOption } = TagSelect;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { home: homeUrl, hiddenDangerReport: { detail: detailUrl } } = urls;
const { home: homeTitle, hiddenDangerReport: { list: title, menu: menuTitle } } = titles;

/* 根据隐患状态获取对应文字 */
const getLabelByStatus = function (status) {
  switch (+status) {
    case 1:
    case 2:
      return <Badge status="success" text="待整改" />;
    case 3:
      return <Badge status="processing" text="待复查" />;
    case 4:
      return <Badge status="default" text="已关闭" />;
    case 7:
      return <Badge status="error" text="已超期" />;
    default:
      return '';
  }
};
/* 面包屑 */
const breadcrumbList = [
  { title: homeTitle, name: homeTitle, href: homeUrl },
  { title: menuTitle, name: menuTitle },
  { title, name: title },
];
/* 固定操作列 */
const fixedOperationColumn = {
  title: '操作',
  dataIndex: '',
  key: 'operation',
  fixed: 'right',
  width: 64,
  render: (text, { id }) => <Link to={`${detailUrl}${id}`}>查看</Link>,
};
/* 非固定操作列 */
const operationColumn = {
  title: '操作',
  dataIndex: '',
  key: 'operation',
  width: 64,
  render: (text, { id }) => <Link to={`${detailUrl}${id}`}>查看</Link>,
};
/* 筛选表单label */
const fieldLabels = {
  grid_id: '所属网格',
  company_name: '单位名称',
  code: '隐患编号',
  createTime: '创建时间',
  report_source: '隐患来源',
  status: '隐患状态',
  business_type: '业务分类',
  item_name: '点位名称',
  level: '隐患等级',
  documentTypeIds: '相关文书',
};
/* 获取root下的div */
const getRootChild = () => document.querySelector('#root>div');
/* session前缀 */
const sessionPrefix = 'hidden_danger_report_list_';


/**
 * 隐患排查报表
 */
@connect(({ hiddenDangerReport, user, loading }) => ({
  hiddenDangerReport,
  user,
  loading: loading.models.hiddenDangerReport,
}))
@Form.create()
export default class App extends PureComponent {
  constructor(props) {
    super(props);
    const { user: { currentUser: { unitType } } } = props;
    /* 当前账号是否是企业 */
    const isCompany = unitType === 4;
    /* 图片字段render方法 */
    const renderImage = (value) => {
      const src = value.filter(image => /(.jpg|.png)$/.test(image))[0];
      return src ? <img style={{ width: 30, height: 40, cursor: 'pointer' }} src={src} alt="" onClick={() => { this.setState({ images: value, currentImage: 0 }); }} /> : <span style={{ display: 'inline-block', width: 30, height: 40 }} />;
    };
    /* 默认除操作列以外的表格列 */
    const defaultColumns = [
      {
        title: '隐患编号',
        dataIndex: 'code',
      },
      {
        title: '隐患来源',
        dataIndex: 'report_source_name',
      },
      {
        title: '点位名称',
        dataIndex: 'name',
      },
      {
        title: '业务分类',
        dataIndex: 'business_type',
      },
      {
        title: '检查内容',
        dataIndex: 'flow_name',
      },
      {
        title: '隐患等级',
        dataIndex: 'level_name',
      },
      {
        title: '隐患状态',
        dataIndex: 'status',
        render: (value) => getLabelByStatus(value),
      },
      {
        title: '创建人',
        dataIndex: 'report_user_name',
        // render: (val) => (<Ellipsis tooltip length={7}>{val}</Ellipsis>),
      },
      {
        title: '检查人',
        dataIndex: 'allCheckPersonNames',
        render: (val) => <Ellipsis tooltip length={7} style={{ overflow: 'visible' }}>{val}</Ellipsis>,
      },
      {
        title: '创建日期',
        dataIndex: 'report_time',
        render: (value) => moment(+value).format('YYYY-MM-DD'),
      },
      {
        title: '计划整改日期',
        dataIndex: 'plan_rectify_time',
        render: (value) => moment(+value).format('YYYY-MM-DD'),
      },
      {
        title: '隐患描述',
        dataIndex: 'desc',
      },
      {
        title: '隐患图片',
        dataIndex: 'createImgs',
        render: renderImage,
      },
      {
        title: '整改措施',
        dataIndex: 'rectify_desc',
      },
      {
        title: '整改金额',
        dataIndex: 'real_rectify_money',
        render: (value) => value,
      },
      {
        title: '整改后图片',
        dataIndex: 'rectifyImgs',
        render: renderImage,
      },
    ];
    if (!isCompany) {
      defaultColumns.splice(1, 0, {
        title: '单位名称',
        dataIndex: 'company_name',
      });
    }
    this.state = {
      // 当前显示的表格字段
      columns: defaultColumns,
      // 当前显示的图片集的源数据
      images: null,
      // 当前显示的图片的索引
      currentImage: 0,
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
    const { dispatch, form: { setFieldsValue }, user: { currentUser: { id } } } = this.props;
    // 从sessionStorage中获取存储的控件值
    const payload = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      pageNum: 1,
      pageSize: 10,
      // query_start_time: `${moment().subtract(1, 'months').format('YYYY/MM/DD')} 00:00:00`,
      // query_end_time: `${moment().format('YYYY/MM/DD')} 23:59:59`,
    };
    const { pageNum, pageSize, documentTypeIds, query_start_time, query_end_time, ...rest } = payload;
    // 重置控件
    setFieldsValue({
      createTime: query_start_time && query_end_time ? [moment(query_start_time, 'YYYY/MM/DD HH:mm:ss'), moment(query_end_time, 'YYYY/MM/DD HH:mm:ss')] : [],
      documentTypeIds: documentTypeIds && documentTypeIds.split(','),
      ...rest,
    });

    // 获取隐患列表
    dispatch({
      type: 'hiddenDangerReport/fetchList',
      payload,
    });

    // 获取网格列表
    dispatch({
      type: 'hiddenDangerReport/fetchGridList',
    });
  }

  /**
   * 修改表格列
   */
  handleChangeColumns = (columns) => {
    // // 保证至少有一个字段显示
    // if (columns.length === 0) {
    //   return;
    // }
    this.setState({
      columns: columns.sort((a, b) => {
        return this.defaultColumns.indexOf(a) - this.defaultColumns.indexOf(b);
      }),
    });
  }

  /**
   * 查询
   */
  handleSearch = () => {
    const { dispatch, form: { getFieldsValue }, hiddenDangerReport: { list: { pagination: { pageSize } } }, user: { currentUser: { id } } } = this.props;
    const { createTime, documentTypeIds,report_source, ...rest } = getFieldsValue();
    const [query_start_time, query_end_time] = createTime || [];
    const payload = {
      ...rest,
      pageNum: 1,
      pageSize,
      query_start_time: query_start_time && `${query_start_time.format('YYYY/MM/DD')} 00:00:00`,
      query_end_time: query_end_time && `${query_end_time.format('YYYY/MM/DD')} 23:59:59`,
      documentTypeIds: documentTypeIds && documentTypeIds.length > 0 ? documentTypeIds.join(',') : undefined,
      report_source:report_source,
    };
    // 获取隐患列表
    dispatch({
      type: 'hiddenDangerReport/fetchList',
      payload,
    });
    // 保存筛选条件
    sessionStorage.setItem(`${sessionPrefix}${id}`, JSON.stringify(payload));
  }

  /**
   * 重置
   */
  handleReset = () => {
    const { form: { setFieldsValue } } = this.props;
    // const createTime = [moment().subtract(1, 'months'), moment()];
    // 重置控件
    setFieldsValue({
      grid_id: undefined,
      company_name: undefined,
      code: undefined,
      createTime: undefined,
      report_source: undefined,
      status: undefined,
      business_type: undefined,
      item_name: undefined,
      level: undefined,
      documentTypeIds: undefined,
    });
    this.handleSearch();
  }

  /**
   * 导出
   */
  handleExport = () => {
    const { dispatch, user: { currentUser: { id } } } = this.props;
    // 从sessionStorage中获取存储的控件值
    const payload = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      // query_start_time: `${moment().subtract(1, 'months').format('YYYY/MM/DD')} 00:00:00`,
      // query_end_time: `${moment().format('YYYY/MM/DD')} 23:59:59`,
    };
    dispatch({
      type: 'hiddenDangerReport/exportData',
      payload,
    });
  }

  /**
   * 切换图片
   */
  handleSwitchImage = (currentImage) => {
    this.setState({
      currentImage,
    });
  }

  /**
   * 切换上一张图片
   */
  handlePrevImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage - 1,
    }));
  }

  /**
   * 切换下一张图片
   */
  handleNextImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage + 1,
    }));
  }

  /**
   * 关闭图片详情
   */
  handleClose = () => {
    this.setState({
      images: null,
    });
  }

  /**
   * 加载更多
   */
  handleLoadMore = (num, size) => {
    const { dispatch, form: { setFieldsValue }, user: { currentUser: { id } } } = this.props;
    // 从sessionStorage中获取存储的控件值
    const fieldsValue = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      // query_start_time: `${moment().subtract(1, 'months').format('YYYY/MM/DD')} 00:00:00`,
      // query_end_time: `${moment().format('YYYY/MM/DD')} 23:59:59`,
    };
    const { pageNum, pageSize, documentTypeIds, query_start_time, query_end_time, ...rest } = fieldsValue;
    // 重置控件
    setFieldsValue({
      grid_id: undefined,
      company_name: undefined,
      code: undefined,
      report_source: undefined,
      status: undefined,
      business_type: undefined,
      item_name: undefined,
      level: undefined,
      createTime: query_start_time && query_end_time ? [moment(query_start_time, 'YYYY/MM/DD HH:mm:ss'), moment(query_end_time, 'YYYY/MM/DD HH:mm:ss')] : [],
      documentTypeIds: documentTypeIds && documentTypeIds.split(','),
      ...rest,
    });
    // console.log(pageNum);
    // 获取隐患列表
    dispatch({
      type: 'hiddenDangerReport/fetchList',
      payload: {
        ...fieldsValue,
        pageNum: num,
        pageSize: size,
      },
    });
    // 保存筛选条件
    sessionStorage.setItem(`${sessionPrefix}${id}`, JSON.stringify({
      ...fieldsValue,
      pageNum: 1,
      pageSize: size,
    }));
  }

  /**
   * 表格显示列
   **/
  renderColumnTagSelect() {
    const { columns } = this.state;
    return (
      <Form className={styles.form}>
        <Form.Item label="表格所显示的字段">
          <TagSelect style={{ marginLeft: 0 }} value={columns} onChange={this.handleChangeColumns} expandable /* hideCheckAll */>
            {this.defaultColumns.map((column) => {
              return (
                <TagSelectOption value={column} key={column.title}>{column.title}</TagSelectOption>
              );
            })}
          </TagSelect>
        </Form.Item>
      </Form>
    );
  }

  /**
   * 筛选表单
   **/
  renderFilterForm() {
    const {
      hiddenDangerReport: {
        gridList,
        sourceList,
        statusList,
        businessTypeList,
        levelList,
        documentTypeList,
      },
      form: {
        getFieldDecorator,
      },
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
          {/* 隐患编号 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.code}>
              {getFieldDecorator('code')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          {/* 创建时间 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.createTime}>
              {getFieldDecorator('createTime', {
              })(<RangePicker style={{ width: '100%' }} getCalendarContainer={getRootChild} allowClear />)}
            </Form.Item>
          </Col>
          {/* 隐患来源 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.report_source}>
              {getFieldDecorator('report_source')(
                <Select
                  placeholder="请选择"
                  getPopupContainer={getRootChild}
                  allowClear
                >
                  {sourceList.map(({ key, value }) => (
                    <Option value={key} key={key}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          {/* 隐患状态 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.status}>
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择"
                  getPopupContainer={getRootChild}
                  allowClear
                >
                  {statusList.map(({ key, value }) => (
                    <Option value={key} key={key}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          {/* 业务分类 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.business_type}>
              {getFieldDecorator('business_type')(
                <Select
                  placeholder="请选择"
                  getPopupContainer={getRootChild}
                  allowClear
                >
                  {businessTypeList.map(({ key, value }) => (
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
          {/* 隐患等级 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.level}>
              {getFieldDecorator('level')(
                <Select
                  placeholder="请选择"
                  getPopupContainer={getRootChild}
                  allowClear
                >
                  {levelList.map(({ key, value }) => (
                    <Option value={key} key={key}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          {/* 相关文书 */}
          <Col xl={8} md={12} sm={24} xs={24}>
            <Form.Item label={fieldLabels.documentTypeIds}>
              {getFieldDecorator('documentTypeIds')(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择"
                  allowClear
                >
                  {documentTypeList.map(({ key, value }) => (
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
              <Button type="primary" onClick={this.handleSearch} style={{ marginRight: 16 }}>查询</Button>
              <Button onClick={this.handleReset} style={{ marginRight: 16 }}>重置</Button>
              <Button type="primary" onClick={this.handleExport}>导出</Button>
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
          pagination: {
            pageSize = 10,
            pageNum = 1,
            total = 0,
          },
        },
      },
    } = this.props;
    const { columns } = this.state;
    return list.length > 0 ? (
      <Table
        className={styles.table}
        dataSource={list}
        columns={columns.length > 0 ? columns.concat(fixedOperationColumn) : columns.concat(operationColumn)}
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
          onShowSizeChange: (num, size) => { this.handleLoadMore(1, size); },
        }}
      />
    ) : (
        <div style={{ textAlign: 'center' }}><span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span></div>
      );
  }

  /**
   * 图片详情
   */
  renderImageDetail() {
    const { images, currentImage } = this.state;
    if (images) {
      const list = images.filter(image => /(.jpg|.png)$/.test(image)).map(src => ({ src }));
      if (list.length > 0) {
        return (
          <Lightbox
            images={list}
            isOpen={true}
            currentImage={currentImage}
            onClickPrev={this.handlePrevImage}
            onClickNext={this.handleNextImage}
            onClose={this.handleClose}
            onClickThumbnail={this.handleSwitchImage}
            showThumbnails
          />
        );
      }
    }
    return null;
  }

  /**
   * 渲染函数
   */
  render() {
    const { hiddenDangerReport: { list: { pagination: { total } } }, loading } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<div>隐患总数：{total}</div>}
      >
        <Spin spinning={!!loading}>
          <Card bordered={false}>
            {this.renderColumnTagSelect()}
            {this.renderFilterForm()}
            {this.renderTable()}
            {this.renderImageDetail()}
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
