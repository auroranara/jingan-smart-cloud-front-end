import React, { PureComponent } from 'react';
import { Form, Card, Table, Row, Col, Input, Select, DatePicker, Button, Spin, Badge, message, Modal } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import Lightbox from 'react-images';
import Link from 'umi/link';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import TagSelect from '@/components/TagSelect';
import urls from '@/utils/urls';
import titles from '@/utils/titles';

import styles from './HiddenDangerReportList.less';
const { Option: TagSelectOption } = TagSelect;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { home: homeUrl, hiddenDangerReport: { detail: detailUrl } } = urls;
const { home: homeTitle, hiddenDangerReport: { list: title, menu: menuTitle } } = titles;

/* 根据隐患状态获取对应文字 */
const getLabelByStatus = function(status) {
  switch(+status) {
    case 1:
    case 2:
      return <Badge status="success" text="未超期" />;
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
/* 操作列 */
const operationColumn = {
  title: '操作',
  dataIndex: '',
  key: 'operation',
  fixed: 'right',
  width: 64,
  render: (text, { id }) => <Link to={`${detailUrl}${id}`}>查看</Link>,
};
/* 筛选表单label */
const fieldLabels = {
  grid: '所属网格',
  unitName: '单位名称',
  number: '隐患编号',
  createTime: '创建时间',
  source: '隐患来源',
  status: '隐患状态',
  businessType: '业务分类',
  pointName: '点位名称',
  level: '隐患等级',
};
/* 获取root下的div */
const getRootChild = () => document.querySelector('#root>div');
/* 默认日期范围 */
const defaultDateRange = [moment().subtract(1, 'months'), moment()];

/**
 * 隐患排查报表
 */
@connect(({hiddenDangerReport, user, loading}) => ({
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
      const { src } = value[0] || {};
      return src && <img style={{ width: 30, height: 40, cursor: 'pointer' }} src={src} alt="" onClick={() => {this.setState({ images: value, currentImage: 0 });}} />;
    };
    /* 默认除操作列以外的表格列 */
    const defaultColumns = [
      {
        title: '隐患编号',
        dataIndex: 'id',
      },
      {
        title: '单位名称',
        dataIndex: 'unitName',
      },
      {
        title: '点位名称',
        dataIndex: 'pointName',
      },
      {
        title: '业务分类',
        dataIndex: 'businessType',
      },
      {
        title: '检查内容',
        dataIndex: 'checkContent',
      },
      {
        title: '隐患等级',
        dataIndex: 'level',
      },
      {
        title: '隐患状态',
        dataIndex: 'status',
        render: (value) => getLabelByStatus(value),
      },
      {
        title: '检查人',
        dataIndex: 'checkPerson',
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
      },
      {
        title: '计划整改日期',
        dataIndex: 'planRectifyTime',
      },
      {
        title: '隐患描述',
        dataIndex: 'description',
      },
      {
        title: '隐患图片',
        dataIndex: 'image',
        render: renderImage,
      },
      {
        title: '整改措施',
        dataIndex: 'rectifyMeasure',
      },
      {
        title: '整改金额',
        dataIndex: 'rectifyMoney',
      },
      {
        title: '整改图片',
        dataIndex: 'rectifyImage',
        render: renderImage,
      },
    ];
    if (!isCompany) {
      defaultColumns.splice(2, 0, {
        title: '隐患来源',
        dataIndex: 'source',
      });
    }
    this.state = {
      // 当前显示的表格字段
      columns: defaultColumns,
      // 当前选中的表格数据行key
      selectedRowKeys: [],
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
    const { dispatch } = this.props;

    // // 获取隐患列表
    // dispatch({
    //   type: 'hiddenDangerReport/fetchList',
    //   payload: {

    //   },
    // });
  }

  /**
   * 修改表格列
   */
  handleChangeColumns = (columns) => {
    // 保证至少有一个字段显示
    if (columns.length === 0) {
      return;
    }
    this.setState({
      columns,
    });
  }

  /**
   * 查询
   */
  handleSearch = () => {
    const { dispatch, form: { getFieldsValue } } = this.props;
    const values = getFieldsValue();
    console.log(values);
  }

  /**
   * 重置
   */
  handleReset = () => {
    const { form: { resetFields } } = this.props;
    // 重置
    resetFields();
    // 查询
    this.handleSearch();
  }

  /**
   * 导出
   */
  handleExport = () => {
    const { selectedRowKeys } = this.state;
    console.log(selectedRowKeys);
    // 确保有数据被选中
    if (selectedRowKeys.length === 0) {
      message.warning('请选中需要导出的数据！');
      return;
    }
  }

  /**
   * 表格选中
   */
  handleCheck = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
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
      currentImage: currentImage-1,
    }));
  }

  /**
   * 切换下一张图片
   */
  handleNextImage = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage+1,
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
   * 表格显示列
   **/
  renderColumnTagSelect() {
    const { columns } = this.state;
    return (
      <Form className={styles.form}>
        <Form.Item label="表格所显示的字段">
          <TagSelect style={{ marginLeft: 0 }} value={columns} onChange={this.handleChangeColumns} expandable hideCheckAll>
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
        unitNameList,
        sourceList,
        statusList,
        businessTypeList,
        levelList,
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
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.grid}>
                {getFieldDecorator('grid')(
                  <Select
                    placeholder="请选择"
                    getPopupContainer={getRootChild}
                    allowClear
                  >
                    {gridList.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          )}
          {/* 单位名称 */}
          {!this.isCompany && (
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.unitName}>
                {getFieldDecorator('unitName')(
                  <Select
                    placeholder="请选择"
                    getPopupContainer={getRootChild}
                    allowClear
                  >
                    {unitNameList.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          )}
          {/* 隐患编号 */}
          <Col lg={8} md={12} sm={24}>
            <Form.Item label={fieldLabels.number}>
              {getFieldDecorator('number')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          {/* 创建时间 */}
          <Col lg={8} md={12} sm={24}>
            <Form.Item label={fieldLabels.createTime}>
              {getFieldDecorator('createTime', {
                initialValue: defaultDateRange,
              })(<RangePicker style={{ width: '100%' }} getCalendarContainer={getRootChild} allowClear />)}
            </Form.Item>
          </Col>
          {/* 隐患来源 */}
          <Col lg={8} md={12} sm={24}>
            <Form.Item label={fieldLabels.source}>
              {getFieldDecorator('source')(
                <Select
                  placeholder="请选择"
                  getPopupContainer={getRootChild}
                  allowClear
                >
                  {sourceList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          {/* 隐患状态 */}
          <Col lg={8} md={12} sm={24}>
            <Form.Item label={fieldLabels.status}>
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择"
                  getPopupContainer={getRootChild}
                  allowClear
                >
                  {statusList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          {/* 业务分类 */}
          <Col lg={8} md={12} sm={24}>
            <Form.Item label={fieldLabels.businessType}>
              {getFieldDecorator('businessType')(
                <Select
                  placeholder="请选择"
                  getPopupContainer={getRootChild}
                  allowClear
                >
                  {businessTypeList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          {/* 点位名称 */}
          <Col lg={8} md={12} sm={24}>
            <Form.Item label={fieldLabels.pointName}>
              {getFieldDecorator('pointName')(<Input placeholder="请输入" />)}
            </Form.Item>
          </Col>
          {/* 隐患等级 */}
          <Col lg={8} md={12} sm={24}>
            <Form.Item label={fieldLabels.level}>
              {getFieldDecorator('level')(
                <Select
                  placeholder="请选择"
                  getPopupContainer={getRootChild}
                  allowClear
                >
                  {levelList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.label}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          {/* 按钮 */}
          <Col md={12} sm={24}>
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
        },
      },
    } = this.props;
    const { columns, selectedRowKeys } = this.state;
    return (
      <Table
        className={styles.table}
        dataSource={list}
        columns={columns.concat(operationColumn)}
        pagination={false}
        rowKey="id"
        rowSelection={{
          fixed: true,
          selectedRowKeys,
          onChange: this.handleCheck,
        }}
        scroll={{
          x: true,
        }}
      />
    );
  }

  /**
   * 图片详情
   */
  renderImageDetail() {
    const { images, currentImage } = this.state;
    return images && images.length > 0 && (
      <Lightbox
        images={images}
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

  /**
   * 渲染函数
   */
  render() {
    const { hiddenDangerReport: { list: { list } }, loading } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={<div>隐患总数：{list.length}</div>}
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
