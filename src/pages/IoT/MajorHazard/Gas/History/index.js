import React, { Component, Fragment } from 'react';
import { Row, Col, Radio, Card, Table, Badge, Select, Button, Spin } from 'antd';
import ReactEcharts from 'echarts-for-react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomEmpty from '@/jingan-components/CustomEmpty';
import Ellipsis from '@/components/Ellipsis';
import { Range } from '../../components';
import moment from 'moment';
import { connect } from 'dva';
import { toFixed, isNumber, getPageSize, setPageSize } from '@/utils/utils';
import {
  TYPES,
  NUMBER_TYPES,
  STATUSES,
} from '../../const';
import iconMajorHazard from '../../imgs/icon-major-hazard.png';
import styles from './index.less';
const { Option } = Select;

export const COLUMNS = [
  {
    title: '',
    dataIndex: 'index',
    width: 26,
    render: (value, data, index) => <Badge count={index+1} style={{ backgroundColor: index < 3 ? '#faad14' : '#d9d9d9' }} />,
  },
  {
    title: '监测对象名称',
    dataIndex: 'name',
    render: (value) => value && <Ellipsis length={6} tooltip>{value}</Ellipsis>,
  },
  {
    title: '监测点位置',
    dataIndex: 'address',
    render: (value) => value && <Ellipsis length={5} tooltip>{value}</Ellipsis>,
  },
  {
    title: '预警次数',
    dataIndex: 'warningCount',
    render: (value) => value >= 0 && <Ellipsis length={8} tooltip>{`${value}`}</Ellipsis>,
    sorter: (a, b) => a.warningCount - b.warningCount,
    sortDirections: ['descend'],
  },
  {
    title: '报警次数',
    dataIndex: 'alarmCount',
    render: (value) => value >= 0 && <Ellipsis length={8} tooltip>{`${value}`}</Ellipsis>,
    sorter: (a, b) => a.alarmCount - b.alarmCount,
    sortDirections: ['descend'],
  },
];
const GET_HISTORY = 'gasMonitor/getHistory';
const GET_LIST = 'gasMonitor/getList';
const GET_MONITOR_OBJECT_TYPE_LIST = 'gasMonitor/getMonitorObjectTypeList';
const GET_MONITOR_OBJECT_LIST = 'gasMonitor/getMonitorObjectList';
const GET_MONITOR_POINT_LIST = 'gasMonitor/getMonitorPointList';
const EXPORT_DATA = 'gasMonitor/exportData';
const TITLE = '可燃有毒气体监测报表';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '气体监测报警', name: '气体监测报警' },
  { title: TITLE, name: TITLE },
];

@connect(({
  user,
  gasMonitor,
  loading,
}) => ({
  user,
  gasMonitor,
  loading: loading.effects[GET_HISTORY] || loading.effects[GET_LIST] || false,
}), dispatch => ({
  getHistory(payload, callback) {
    dispatch({
      type: GET_HISTORY,
      payload,
      callback,
    });
  },
  getList(payload, callback) {
    dispatch({
      type: GET_LIST,
      payload,
      callback,
    });
  },
  getMonitorObjectTypeList(payload, callback) {
    dispatch({
      type: GET_MONITOR_OBJECT_TYPE_LIST,
      payload,
      callback,
    });
  },
  getMonitorObjectList(payload, callback) {
    dispatch({
      type: GET_MONITOR_OBJECT_LIST,
      payload,
      callback,
    });
  },
  getMonitorPointList(payload, callback) {
    dispatch({
      type: GET_MONITOR_POINT_LIST,
      payload,
      callback,
    });
  },
  exportData(payload, callback) {
    dispatch({
      type: EXPORT_DATA,
      payload,
      callback,
    });
  },
}))
export default class GasHistory extends Component {
  state = {
    range: undefined, // 时间范围
    type: TYPES[0].key, // 类型，['图表', '列表']
    numberType: NUMBER_TYPES[0].key, // 数值类型，['绝对值', '百分比']
    status: undefined, // 安全状态
    monitorObjectTypeId: undefined, // 监测对象类型
    monitorObjectId: undefined, // 监测对象
    monitorPointId: undefined, // 监测点位
    selectedRowKeys: [], // 选中的
  }

  componentDidMount() {
    const { getMonitorObjectTypeList } = this.props;
    getMonitorObjectTypeList();
  }

  getHistory = () => {
    const { getHistory } = this.props;
    const { range: [startDate, endDate]=[] } = this.state;
    getHistory({
      startDate,
      endDate,
    });
  }

  getList = ({ pageNum=1, pageSize=getPageSize() }={}) => {
    const { getList } = this.props;
    const {
      range: [startDate, endDate]=[],
      status,
      monitorObjectTypeId,
      monitorObjectId,
      monitorPointId,
    } = this.state;
    getList({
      pageNum,
      pageSize,
      startDate,
      endDate,
      status,
      monitorObjectTypeId,
      monitorObjectId,
      monitorPointId,
    });
  }

  handleRangeChange = (range) => {
    this.setState({
      range,
    }, () => {
      const { type } = this.state;
      if (type === TYPES[0].key) {
        this.getHistory();
      } else {
        this.getList();
      }
    });
  }

  handleTypeChange = ({ target: { value: type } }) => {
    this.setState({
      type,
      ...(type === TYPES[0].key ? {
        status: undefined,
        monitorObjectTypeId: undefined,
        monitorObjectId: undefined,
        monitorPointId: undefined,
        selectedRowKeys: [],
      } : {
        numberType: NUMBER_TYPES[0].key,
      }),
    });
    if (type === TYPES[0].key) {
      this.getHistory();
    } else {
      this.getList();
    }
  }

  handleNumberTypeChange = ({ target: { value: numberType } }) => {
    this.setState({
      numberType,
    });
  }

  handleStatusChange = (status) => {
    this.setState({
      status,
    }, this.getList);
  }

  handleMonitorObjectTypeIdChange = (monitorObjectTypeId) => {
    if (monitorObjectTypeId) {
      const { getMonitorObjectList } = this.props;
      getMonitorObjectList();
    }
    this.setState({
      monitorObjectTypeId,
      monitorObjectId: undefined,
      monitorPointId: undefined,
    }, this.getList);
  }

  handleMonitorObjectIdChange = (monitorObjectId) => {
    if (monitorObjectId) {
      const { getMonitorPointList } = this.props;
      getMonitorPointList();
    }
    this.setState({
      monitorObjectId,
      monitorPointId: undefined,
    }, this.getList);
  }

  handleMonitorPointIdChange = (monitorPointId) => {
    this.setState({
      monitorPointId,
    }, this.getList);
  }

  handleExportButtonClick = () => {
    const { exportData } = this.props;
    const { selectedRowKeys } = this.state;
    // exportData({
    //   ids: selectedRowKeys.join(','),
    // });
    console.log(selectedRowKeys);
  }

  handleSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }

  handleTableChange = ({ current, pageSize }, _, { field }) => {
    const {
      gasMonitor: {
        list: {
          pagination: {
            pageSize: prevPageSize=pageSize,
            field: prevField,
          }={},
        }={},
      },
    } = this.props;
    let pageNum;
    if (prevPageSize !== pageSize) {
      pageNum = 1;
      setPageSize(pageSize);
    } else if (prevField !== field) {
      pageNum = 1;
    } else {
      pageNum = current;
    }
    this.getList({
      pageNum,
      pageSize,
      field,
    });
  }

  /**
   * 筛选栏
   */
  renderToobar() {
    const { range, type } = this.state;

    return (
      <Card className={styles.card}>
        <div className={styles.toolbar}>
          <div>
            <Range value={range} onChange={this.handleRangeChange} allowClear={false} />
          </div>
          <div>
            <Radio.Group value={type} buttonStyle="solid" onChange={this.handleTypeChange}>
              {TYPES.map(({ key, value }) => (
                <Radio.Button key={key} value={key}>{value}</Radio.Button>
              ))}
            </Radio.Group>
          </div>
        </div>
      </Card>
    );
  }

  /**
   * 统计栏
   */
  renderCount() {
    const {
      gasMonitor: {
        history: {
          majorHazard=0,
          monitorHazard=0,
          alertRate=0,
          alerts=0,
          alarmTime=0,
          completeRate=1,
        }={},
      },
    } = this.props;

    return (
      <Card className={styles.card}>
        <div className={styles.countContainer}>
          <div>
            <div className={styles.countItem} style={{ backgroundImage: `url(${iconMajorHazard})` }}>
              <div className={styles.countLabel}>重大危险源</div>
              <div className={styles.countValue}>{majorHazard}</div>
            </div>
          </div>
          <div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>监测危险源（个）</div>
              <div className={styles.countValue}>{monitorHazard}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>报警率</div>
              <div className={styles.countValue}>{`${toFixed(alertRate * 100)}%`}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>报警次数（次）</div>
              <div className={styles.countValue}>{alerts}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>报警时长（h）</div>
              <div className={styles.countValue}>{alarmTime}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>工单完成率</div>
              <div className={styles.countValue}>{`${toFixed(completeRate * 100)}%`}</div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  /**
   * 报警工单处理时效
   */
  renderDurationChart() {
    const {
      gasMonitor: {
        history: {
          durations=[],
        }={},
      },
    } = this.props;

    const option = {
      title: {
        text: `{c|工单平均处理时长：}{a|${20}}{b|min}`,
        textStyle: {
          fontSize: 12,
          lineHeight: 20,
          color: 'rgba(0, 0, 0, 0.65)',
          fontWeight: 'normal',
          rich: {
            a: {
              fontSize: 24,
            },
            b: {
              verticalAlign: 'bottom',
            },
            c: {
              color: 'rgba(0, 0, 0, 0.45)',
            },
          },
        },
        left: 'right',
        padding: 0,
        itemGap: 0,
      },
      grid: {
        top: 30,
        right: 0,
        bottom: 0,
        left: 0,
        containLabel: true,
      },
      color: ['#1890ff'],
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
      },
      xAxis: {
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          interval: 0,
          color: 'rgba(0, 0, 0, 0.65)',
        },
        splitLine: {
          show: false,
        },
        data: durations.map(({ name }) => name),
      },
      yAxis: {
        minInterval: 1,
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: '报警工单处理数量',
          type: 'bar',
          barWidth: '50%',
          data: durations.map(({ value }) => value),
        },
      ],
    };

    return (
      <Card className={styles.card}>
        <div className={styles.cardTitle}>报警工单处理时效</div>
        <div className={styles.cardContent}>
          {durations && durations.length ? (
            <ReactEcharts
              style={{ height: '100%' }}
              option={option}
            />
          ) : (
            <CustomEmpty />
          )}
        </div>
      </Card>
    );
  }

  /**
   * 报警工单处理趋势
   */
  renderTrendChart() {
    const {
      gasMonitor: {
        history: {
          dateList,
          pendingList=[],
          processingList=[],
          processedList=[],
          pendingPercentList=[],
          processingPercentList=[],
          processedPercentList=[],
        }={},
      },
    } = this.props;
    const { numberType } = this.state;
    const isPercent = numberType === NUMBER_TYPES[1].key;

    const option = {
      color: ['#FFB650', '#60B3FF', '#8BD068'],
      tooltip : {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        formatter: isPercent ? (params) => `${params[0].name}<br/>${params.map(({ marker, seriesName, value }) => `${marker}${seriesName}：${value}%`).join('<br />')}` : undefined,
      },
      legend: {
        itemWidth: 8,
        itemHeight: 8,
        bottom: 0,
        left: 'center',
        icon: 'circle',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.45)',
        },
      },
      grid: {
        top: 16,
        left: 0,
        right: 20,
        bottom: 24,
        containLabel: true,
      },
      xAxis: {
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
        splitLine: {
          show: false,
        },
        data: dateList,
      },
      yAxis: {
        minInterval: 1,
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
          formatter: isPercent ? '{value}%' : undefined,
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: '待处理工单',
          type: 'line',
          stack: isPercent ? '工单' : undefined,
          areaStyle: {
            opacity: 0.5,
          },
          data: isPercent ? pendingPercentList : pendingList,
        },
        {
          name: '处理中工单',
          type: 'line',
          stack: isPercent ? '工单' : undefined,
          areaStyle: {
            opacity: 0.5,
          },
          data: isPercent ? processingPercentList : processingList,
        },
        {
          name: '已处理工单',
          type: 'line',
          stack: isPercent ? '工单' : undefined,
          areaStyle: {
            opacity: 0.5,
          },
          data: isPercent ? processedPercentList : processedList,
        },
      ],
    };

    return (
      <Card className={styles.card}>
        <div className={styles.cardTitle}>
          报警工单处理趋势
          <Radio.Group
            className={styles.numberType}
            value={numberType}
            onChange={this.handleNumberTypeChange}
            buttonStyle="solid"
          >
            {NUMBER_TYPES.map(({ key, value }) => <Radio.Button value={key} key={key}>{value}</Radio.Button>)}
          </Radio.Group>
        </div>
        <div className={styles.cardContent}>
          {dateList && dateList.length ? (
            <ReactEcharts
              style={{ height: '100%' }}
              option={option}
            />
          ) : (
            <CustomEmpty />
          )}
        </div>
      </Card>
    );
  }

  /**
   * 预警/报警次数趋势
   */
  renderTrend2Chart() {
    const {
      gasMonitor: {
        history: {
          dateList,
          warningList=[],
          alarmList=[],
        }={},
      },
    } = this.props;

    const option = {
      color: ['#faad14', '#f5222d'],
      tooltip : {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
      },
      legend: {
        itemWidth: 8,
        itemHeight: 8,
        bottom: 0,
        left: 'center',
        icon: 'circle',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.45)',
        },
      },
      grid: {
        top: 10,
        left: 0,
        right: 20,
        bottom: 24,
        containLabel: true,
      },
      xAxis: {
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
        splitLine: {
          show: false,
        },
        data: dateList,
      },
      yAxis: {
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: '预警次数',
          type: 'line',
          data: warningList,
        },
        {
          name: '报警次数',
          type: 'line',
          data: alarmList,
        },
      ],
    };

    return (
      <Card className={styles.card}>
        <div className={styles.cardTitle}>预警/报警次数趋势</div>
        <div className={styles.cardContent}>
          {dateList && dateList.length ? (
            <ReactEcharts
              style={{ height: '100%' }}
              option={option}
            />
          ) : (
            <CustomEmpty />
          )}
        </div>
      </Card>
    );
  }

  /**
   * 监测点报警/预警排名
   */
  renderRankingTable() {
    const {
      gasMonitor: {
        history: {
          rankList=[],
        }={},
      },
    } = this.props;

    return (
      <Card className={styles.card}>
        <div className={styles.cardTitle}>监测点报警/预警排名</div>
        <div className={styles.cardContent}>
          {rankList && rankList.length ? (
            <Table
              className={styles.table}
              columns={COLUMNS}
              dataSource={rankList}
              rowKey="id"
              pagination={false}
            />
          ) : (
            <CustomEmpty />
          )}
        </div>
      </Card>
    );
  }

  /**
   * 列表
   */
  renderTable() {
    const {
      gasMonitor: {
        list: {
          list=[],
          pagination: {
            total,
            pageNum,
            pageSize,
          }={},
        }={},
        monitorObjectTypeList=[],
        monitorObjectList=[],
        monitorPointList=[],
      },
    } = this.props;
    const { status, monitorObjectTypeId, monitorObjectId, monitorPointId, selectedRowKeys } = this.state;
    const columns = [
      {
        title: '监测对象类型',
        dataIndex: 'monitorObjectType',
        align: 'center',
      },
      {
        title: '监测对象名称',
        dataIndex: 'monitorObjectName',
        align: 'center',
      },
      {
        title: '监测点位名称',
        dataIndex: 'monitorPointName',
        align: 'center',
      },
      {
        title: '监测点位置',
        dataIndex: 'address',
        align: 'center',
      },
      {
        title: '监测参数',
        dataIndex: 'paramName',
        align: 'center',
      },
      {
        title: '监测数值',
        dataIndex: 'value',
        align: 'center',
        render: (value, { unit, status }) => isNumber(value) && <Badge status={status > 0 ? 'error' : 'success'} text={`${value}${unit}`} />,
      },
      {
        title: '预警阈值',
        dataIndex: 'warning',
        align: 'center',
        sorter: true,
        render: (_, { normalUpper, largeUpper, normalLower, smallLower, unit }) => [isNumber(normalUpper) && (isNumber(largeUpper) ? `${normalUpper}${unit}~${largeUpper}${unit}` : `≥${normalUpper}${unit}`), isNumber(normalLower) && (isNumber(smallLower) ? `${normalLower}${unit}~${smallLower}${unit}` : `≤${normalLower}${unit}`)].filter(v => v).join('，'),
      },
      {
        title: '报警阈值',
        dataIndex: 'alarm',
        align: 'center',
        sorter: true,
        render: (_, { largeUpper, smallLower, unit }) => [isNumber(largeUpper) && `≥${largeUpper}${unit}`, isNumber(smallLower) && `≤${smallLower}${unit}`].filter(v => v).join('，'),
      },
      {
        title: '数据更新时间',
        dataIndex: 'updateTime',
        align: 'center',
        render: (time) => time && moment(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ];

    return (
      <Card className={styles.card}>
        <Row className={styles.controlRow} gutter={24}>
          <Col xs={24} sm={12} md={8}>
            <Select className={styles.select} placeholder="请选择安全状态" value={status} onChange={this.handleStatusChange} allowClear>
              {STATUSES.map(({ key, value }) => (
                <Option key={key}>{value}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select className={styles.select} placeholder="请选择监测对象类型" value={monitorObjectTypeId} onChange={this.handleMonitorObjectTypeIdChange} allowClear>
              {monitorObjectTypeList.map(({ id, name }) => (
                <Option key={id}>{name}</Option>
              ))}
            </Select>
          </Col>
          {monitorObjectTypeId && (
            <Col xs={24} sm={12} md={8}>
              <Select className={styles.select} placeholder="请选择监测对象" value={monitorObjectId} onChange={this.handleMonitorObjectIdChange} allowClear>
                {monitorObjectList.map(({ id, name }) => (
                  <Option key={id}>{name}</Option>
                ))}
              </Select>
            </Col>
          )}
          {monitorObjectId && (
            <Col xs={24} sm={12} md={8}>
              <Select className={styles.select} placeholder="请选择监测点位" value={monitorPointId} onChange={this.handleMonitorPointIdChange} allowClear>
                {monitorPointList.map(({ id, name }) => (
                  <Option key={id}>{name}</Option>
                ))}
              </Select>
            </Col>
          )}
          <Col xs={24} sm={12} md={8}>
            <Button type="primary" onClick={this.handleExportButtonClick} disabled={!selectedRowKeys.length}>导出明细</Button>
          </Col>
          <Col span={24}>
            <Table
              className={styles.table2}
              dataSource={list}
              columns={columns}
              rowKey="id"
              scroll={{
                x: true,
              }}
              onChange={this.handleTableChange}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                pageSizeOptions: ['5', '10', '15', '20'],
                showTotal: total => `共计 ${total} 条数据`,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
              rowSelection={{
                selectedRowKeys,
                onChange: this.handleSelectedRowKeysChange,
              }}
            />
          </Col>
        </Row>
      </Card>
    );
  }

  render() {
    const { loading } = this.props;
    const { type } = this.state;

    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
      >
        <Spin spinning={loading}>
          <Row className={styles.row} gutter={24}>
            <Col span={24}>
              {this.renderToobar()}
            </Col>
            {type === TYPES[0].key ? (
              <Fragment>
                <Col span={24}>
                  {this.renderCount()}
                </Col>
                <Col xxl={8} lg={12} sm={24} xs={24}>
                  {this.renderDurationChart()}
                </Col>
                <Col xxl={16} lg={12} sm={24} xs={24}>
                  {this.renderTrendChart()}
                </Col>
                <Col xxl={16} lg={12} sm={24} xs={24}>
                  {this.renderTrend2Chart()}
                </Col>
                <Col xxl={8} lg={12} sm={24} xs={24}>
                  {this.renderRankingTable()}
                </Col>
              </Fragment>
            ) : (
              <Col span={24}>
                {this.renderTable()}
              </Col>
            )}
          </Row>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
