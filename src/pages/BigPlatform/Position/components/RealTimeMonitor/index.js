import React, { PureComponent } from 'react';
import { Input, Row, Col, Select, Table, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Section from '@/pages/BigPlatform/NewUnitFireControl/Section';
// 引入样式文件
import styles from './index.less';

// const { Search } = Input;
const { Option } = Select;

// 状态字典
const statuses = [
  {
    id: 1,
    label: '安全',
  },
  {
    id: 2,
    label: '报警',
  },
];

// 根据status获取label
const statusLabel = {
  '1': '安全',
  '2': '报警',
};

// 表格列
const columns = [
  {
    title: '区域名称',
    dataIndex: 'areaName',
    width: '50%',
  },
  {
    title: '当前人数',
    dataIndex: 'count',
    width: '30%',
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: (status) => <span style={+status === 2 ? { color: '#ff4848' } : undefined}>{statusLabel[status] || '安全'}</span>,
    width: '20%',
  },
];

const DATA = [{
  id: 1,
  areaName: '东厂区',
  count: 12,
  status: 1,
  indentLevel: 0,
  children: [
    {
      id: 3,
      areaName: '楼层1',
      count: 10,
      status: 1,
      indentLevel: 1,
      children: [
        {
          id: 5,
          areaName: '楼层5',
          count: 10,
          status: 1,
          indentLevel: 2,
        },
      ],
    },
    {
      id: 4,
      areaName: '更长的楼层',
      count: 10,
      status: 1,
      indentLevel: 1,
    },
  ],
}, {
  id: 2,
  areaName: '西厂区',
  count: 12,
  status: 2,
  indentLevel: 0,
}];

// 根据areaName和status筛选
const filterDataByAreaNameAndStatus = function(data, filterAreaName, filterStatus) {
  if (!filterAreaName && !filterStatus) {
    return data;
  }
  const list = [];
  data.forEach((item) => {
    const { areaName, status, children } = item;
    if (areaName.includes(filterAreaName) && (!filterStatus || status === filterStatus)) {
      list.push(item);
    }
    else if (children) {
      const newChildren = filterDataByAreaNameAndStatus(children, filterAreaName, filterStatus);
      if (newChildren.length > 0) {
        list.push({
          ...item,
          children: newChildren,
        });
      }
    }
  });
  return list;
}

/**
 * description: 实时监控
 * author: sunkai
 * date: 2018年12月26日
 */
export default class RealTimeMonitor extends PureComponent {
  // 组件内仓库
  state = {
    areaName: '',
    status: undefined,
  }

  /**
   * 挂载后
   */
  componentDidMount() {

  }

  /**
   * 更新后
   */
  componentDidUpdate() {

  }

  /**
   * 销毁前
   */
  componentWillUnmount() {

  }

  /**
   * change区域名称
   * 说明：
   * 1.修改输入框
   * 2.根据值筛选
   */
  handleChangeAreaName = (e) => {
    const areaName = e.target.value;
    /* 第一步 */
    this.setState({ areaName });
    /* 第二步 */
  }

  // /**
  //  * 根据区域名称搜索
  //  */
  // handleSearchByAreaName = (areaName) => {
  //   alert(areaName);
  // }

  /**
   * change状态
   * 说明：
   * 1.修改下拉框
   * 2.根据值筛选
   */
  handleChangeStatus = (status) => {
    /* 第一步 */
    this.setState({ status });
    /* 第二步 */
  }

  /**
   * 修改滚动条颜色
   */
  renderThumb({ style, ...props }) {
    const thumbStyle = {
      backgroundColor: `rgba(9, 103, 211, 0.5)`,
      borderRadius: '10px',
    };
    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props}
      />
    );
  }

  /**
   * 扩展图标
   */
  renderExpandIcon = (args) => {
    const { expandable, expanded, onExpand, record } = args;
    return expandable ? (expanded ?
      <Icon type="caret-down" style={{ marginLeft: record.indentLevel*8, marginRight: 6, cursor: 'pointer' }} onClick={(e) => {onExpand(record, e);}} /> :
      <Icon type="caret-right" style={{ marginLeft: record.indentLevel*8, marginRight: 6, cursor: 'pointer' }} onClick={(e) => {onExpand(record, e);}} />
    ) : <span style={{ marginLeft: 20+record.indentLevel*8 }} />;
  }

  /**
   * 渲染
   */
  render() {
    const {
      // 容器类名
      className,
      // 容器样式
      style,
      // 表格源数据
      data=DATA,
    } = this.props;
    const { areaName, status } = this.state;
    // 筛选数据
    const list = filterDataByAreaNameAndStatus(data, areaName, status);

    return (
      <Section
        className={className?`${styles.container} ${className}`:styles.container}
        style={style}
        title="实时监控"
        contentStyle={{ padding: '16px 0' }}
      >
        <Scrollbars style={{ width: '100%', height: '100%' }} renderThumbHorizontal={this.renderThumb} renderThumbVertical={this.renderThumb}>
          <div style={{ padding: '0 20px' }}>
            <Row gutter={16}>
              <Col span={14} style={{ marginBottom: 12 }}>
                {/* 搜索区域名称 */}
                {/* <Search
                  className={styles.search}
                  placeholder="搜索区域名称"
                  enterButton="搜索"
                  value={areaName}
                  onChange={this.handleChangeAreaName}
                  onSearch={this.handleSearchByAreaName}
                /> */}
                <Input
                  className={styles.search}
                  placeholder="搜索区域名称"
                  value={areaName}
                  onChange={this.handleChangeAreaName}
                />
              </Col>
              <Col span={10} style={{ marginBottom: 12 }}>
                {/* 状态下拉框 */}
                <Select suffixIcon={<Icon type="caret-down" style={{ color: '#b5b7ba' }} />} className={styles.select} dropdownClassName={styles.dropdown} placeholder="请选择状态" value={status} style={{ width: '100%' }} onChange={this.handleChangeStatus} allowClear>
                  {statuses.map(({ id, label }) => (
                    <Option value={id} key={id}>{label}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Table
              className={styles.table}
              size="small"
              columns={columns}
              dataSource={list}
              pagination={false}
              bordered={false}
              rowKey={'id'}
              defaultExpandAllRows
              rowClassName={styles.tableRow}
              expandIcon={this.renderExpandIcon}
              indentSize={20}
            />
          </div>
        </Scrollbars>
      </Section>
    );
  }
}