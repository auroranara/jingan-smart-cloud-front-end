import React, { Component, Fragment } from 'react';
import { Spin, message, Card, DatePicker, Row, Col, Radio, Table, Select, Button, Badge } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import ReactEcharts from 'echarts-for-react';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import classNames from 'classnames';
import { isNumber } from '@/utils/utils';
import {
  TITLE as SUPER_TITLE,
  URL as SUPER_URL,
  TANK_AREA_REAL_TIME_URL,
  getRange,
  NUMBER_TYPES,
  PERIODS,
  COLUMNS,
  DURATION_LABELS,
} from '../../index';
import iconRealTime from '../../imgs/icon-real-time.png';
import iconMajorHazard from '../../imgs/icon-major-hazard.png';
import styles from './index.less';

const { Option } = Select;

const TITLE = '储罐区历史统计';
const BREADCRUMB_LIST = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '物联网监测',
    name: '物联网监测',
  },
  {
    title: SUPER_TITLE,
    name: SUPER_TITLE,
    href: SUPER_URL,
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const TABS = [
  {
    key: '0',
    tab: '图表',
  },
  {
    key: '1',
    tab: '列表',
  },
];
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const GET_TANK_AREA_HISTORY_COUNT = 'majorHazardMonitor/getTankAreaHistoryCount';
const GET_TANK_AREA_HISTORY_LIST = 'majorHazardMonitor/getTankAreaHistoryList';
const COUNT_TYPES = [
  {
    key: '0',
    value: '罐区数',
  },
  {
    key: '1',
    value: '监测点位数',
  },
  {
    key: '2',
    value: '次数',
  },
];
const STATUSES = [
  {
    key: '0',
    value: '安全',
  },
  {
    key: '1',
    value: '预警',
  },
  {
    key: '2',
    value: '报警',
  },
];

@connect(({
  user,
  majorHazardMonitor,
  loading,
}) => ({
  user,
  majorHazardMonitor,
  loading: loading.effects[GET_TANK_AREA_HISTORY_COUNT] || loading.effects[GET_TANK_AREA_HISTORY_LIST] || false,
}), dispatch => ({
  getTankAreaHistoryCount(payload, callback) {
    dispatch({
      type: GET_TANK_AREA_HISTORY_COUNT,
      payload,
      callback,
    });
  },
  getTankAreaHistoryList(payload, callback) {
    dispatch({
      type: GET_TANK_AREA_HISTORY_LIST,
      payload: {
        pageNum: 1,
        pageSize: 10,
        ...payload,
      },
      callback,
    });
  },
}))
export default class TankAreaHistory extends Component {
  state = {
    tabActiveKey: TABS[0].key, // ['图表', '列表']
    period: PERIODS[0].key, // 周期，['最近一周', '最近一个月', '最近三个月', '最近一年']
    range: getRange(PERIODS[0].key), // 范围，受周期影响
    status: undefined, // 安全状态
    pointId: undefined, // 监测点位id
    numberType: NUMBER_TYPES[0].key, // 工单折线图数值类型，['绝对值', '百分比']
    countType: COUNT_TYPES[0].key, // 次数类型，['罐区数', '监测点位数', '次数']
    selectedRowKeys: [], // 选中的表格项
  }

  componentDidMount() {
    this.onTabChange(TABS[0].key); // 初始化
    // 理论上这里需要请求监测点位列表
  }

  getTankAreaHistory = (extra) => {
    const { getTankAreaHistoryCount, getTankAreaHistoryList } = this.props;
    const { tabActiveKey, range: [startDate, endDate]=[], status, pointId } = this.state;
    const payload = {
      startDate,
      endDate,
      status,
      pointId,
      ...extra,
    };
    const callback = (successful) => {
      if (!successful) {
        message.error('获取储罐区历史统计数据失败，请稍后重试或联系管理人员！');
      }
    };
    console.log(payload);
    (tabActiveKey === TABS[0].key ? getTankAreaHistoryCount : getTankAreaHistoryList)(payload, callback);
  }

  getPieToolTipFormatter = (index) => {
    const {
      majorHazardMonitor: {
        tankAreaHistoryCount: {
          safeDuration,
          warningDuration,
          alarmDuration,
        }={},
      },
    } = this.props;
    const total = safeDuration + alarmDuration + warningDuration;
    const value = [safeDuration, warningDuration, alarmDuration][index];
    const label = DURATION_LABELS[index];
    return `{a|${label}}{b|${value ? Math.round(value / total * 100) : 0}%}{c|${value}h}`;
  }

  getLineToolTipFormatter = (params) => {
    const [{ name }] = params;
    return `${name}<br/>${params.map(({ marker, seriesName, value }) => `${marker}${seriesName}：${value}%`).join('<br />')}`
  }

  onTabChange = (tabActiveKey) => {
    this.setState({
      tabActiveKey,
      ...(tabActiveKey === TABS[0].key ? {
        numberType: NUMBER_TYPES[0].key,
        countType: COUNT_TYPES[0].key,
      } : {
        status: undefined,
        pointId: undefined,
        selectedRowKeys: [],
      }),
    }, this.getTankAreaHistory);
  }

  onPeriodChange = ({ target: { dataset: { period } } }) => {
    this.setState({
      period,
      range: getRange(period),
    }, this.getTankAreaHistory);
  }

  onRangeChange = (range) => {
    this.setState({
      period: undefined,
      range,
    }, this.getTankAreaHistory);
  }

  onNumberTypeChange = ({ target: { value: numberType } }) => {
    this.setState({
      numberType,
    });
  }

  onCountTypeChange = ({ target: { value: countType } }) => {
    this.setState({
      countType,
    });
  }

  onStatusChange = (status) => {
    this.setState({
      status,
    }, this.getTankAreaHistory);
  }

  onPointIdChange = (pointId) => {
    this.setState({
      pointId,
    }, this.getTankAreaHistory);
  }

  onExportButtonClick = () => {
    const { selectedRowKeys } = this.state;
    console.log(selectedRowKeys);
  }

  onTableChange = ({ current, pageSize }, filter, { field, order }) => {
    const {
      majorHazardMonitor: {
        tankAreaHistoryList: {
          pagination: {
            pageSize: PrevPageSize,
          }={},
        }={},
      },
    } = this.props;
    this.getTankAreaHistory({
      pageNum: PrevPageSize !== pageSize ? 1 : current,
      pageSize,
      [`${field}sort`]: order,
    });
  }

  onRowSelectionChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }

  [`render${TABS[0].key}`] = () => {
    const {
      majorHazardMonitor: {
        tankAreaHistoryCount: {
          majorHazard,
          monitorHazard,
          alertRate,
          alerts,
          alarmTime,
          completeRate,
          rankList,
        }={},
      },
    } = this.props;
    const { numberType, countType } = this.state;

    return (
      <Fragment>
        <Card className={styles.card}>
          <div className={styles.countContainer}>
            <div>
              <div className={styles.countItem} style={{ backgroundImage: `url(${iconMajorHazard})` }}>
                <div className={styles.countLabel}>储罐区总数</div>
                <div className={styles.countValue}>{majorHazard}</div>
              </div>
            </div>
            <div>
              <div className={styles.countItem}>
                <div className={styles.countLabel}>报警储罐区（个）</div>
                <div className={styles.countValue}>{monitorHazard}</div>
              </div>
              <div className={styles.countItem}>
                <div className={styles.countLabel}>报警率</div>
                <div className={styles.countValue}>{`${Number.parseFloat(((alertRate || 0) * 100).toFixed(2))}%`}</div>
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
                <div className={styles.countValue}>{`${Number.parseFloat(((completeRate || 1) * 100).toFixed(2))}%`}</div>
              </div>
            </div>
          </div>
        </Card>
        <Row gutter={24}>
          <Col span={8}>
            <Card className={styles.card}>
              <div>安全状况时长占比</div>
              {this.renderPie()}
            </Card>
          </Col>
          <Col span={16}>
            <Card className={styles.card}>
              <div className={styles.lineChartTitle}>
                报警工单
                <div className={styles.lineChartSwitch}>
                  <Radio.Group value={numberType} size="small" onChange={this.onNumberTypeChange}>
                    {NUMBER_TYPES.map(({ key, value }) => <Radio.Button value={key} key={key}>{value}</Radio.Button>)}
                  </Radio.Group>
                </div>
              </div>
              {this.renderLine()}
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={15}>
            <Card className={styles.card}>
              <div className={styles.lineChartTitle}>
                预警/报警次数趋势
                <div className={styles.lineChartSwitch}>
                  <Radio.Group value={countType} size="small" onChange={this.onCountTypeChange}>
                    {COUNT_TYPES.map(({ key, value }) => <Radio.Button value={key} key={key}>{value}</Radio.Button>)}
                  </Radio.Group>
                </div>
              </div>
              {this.renderLine2()}
            </Card>
          </Col>
          <Col span={9}>
            <Card className={styles.card}>
              <div>监测点报警/预警排名</div>
              <div className={styles.tableWrapper}>
                <Table
                  className={styles.table}
                  columns={COLUMNS}
                  dataSource={rankList}
                  rowKey="id"
                  pagination={false}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }

  [`render${TABS[1].key}`] = () => {
    const {
      majorHazardMonitor: {
        pointList=[],
        tankAreaHistoryList: {
          list=[],
          pagination: {
            total,
            pageNum,
            pageSize,
          }={},
        }={},
      },
    } = this.props;
    const {
      status,
      pointId,
      selectedRowKeys,
    } = this.state;

    const fields = [
      {
        id: 'status',
        label: '安全状态',
        render: () => (
          <Select placeholder="请选择安全状态" onChange={this.onStatusChange} allowClear>
            {STATUSES.map(({ key, value }) => <Option key={key}>{value}</Option>)}
          </Select>
        ),
        options: {
          initialValue: status,
        },
      },
      {
        id: 'pointId',
        label: '监测点位',
        render: () => (
          <Select placeholder="请选择监测点位" onChange={this.onPointIdChange} allowClear>
            {pointList.map(({ key, value }) => <Option key={key}>{value}</Option>)}
          </Select>
        ),
        options: {
          initialValue: pointId,
        },
      },
    ];
    const COLUMNS2 = [
      {
        title: '罐区名称',
        dataIndex: 'name',
      },
      {
        title: '监测点位名称',
        dataIndex: 'pointName',
      },
      {
        title: '监测点位置',
        dataIndex: 'pointAddress',
      },
      {
        title: '监测参数',
        dataIndex: 'paramName',
      },
      {
        title: '监测数值',
        dataIndex: 'paramValue',
        render: (_, { paramValue, unit, status }) => <Badge status={status > 0 ? 'error' : "success"} text={`${paramValue}${unit}`} />,
        sorter: true,
      },
      {
        title: '预警阈值',
        dataIndex: 'normalUpper',
        render: (_, { normalUpper, unit }) => isNumber(normalUpper) && `≥${normalUpper}${unit}`,
      },
      {
        title: '报警阈值',
        dataIndex: 'largeUpper',
        render: (_, { largeUpper, unit }) => isNumber(largeUpper) && `≥${largeUpper}${unit}`,
      },
      {
        title: '数据更新时间',
        dataIndex: 'updateTime',
        render: (value) => value && moment(value).format(DEFAULT_FORMAT),
      },
    ];

    return (
      <Fragment>
        <Card className={styles.card}>
          <CustomForm
            fields={fields}
            searchable={false}
            resetable={false}
            action={(
              <Button type="primary" onClick={this.onExportButtonClick}>导出</Button>
            )}
          />
        </Card>
        <Card className={styles.card}>
          <Table
            className={styles.table2}
            dataSource={list}
            columns={COLUMNS2}
            rowKey="id"
            scroll={{
              x: true,
            }}
            onChange={this.onTableChange}
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
              onChange: this.onRowSelectionChange,
            }}
          />
        </Card>
      </Fragment>
    );
  }

  renderPie() {
    const {
      majorHazardMonitor: {
        tankAreaHistoryCount: {
          safeDuration,
          warningDuration,
          alarmDuration,
        }={},
      },
    } = this.props;

    const option = {
      tooltip: {
        show: false,
      },
      legend: {
        orient: 'vertical',
        right: 0,
        top: 'center',
        icon: 'circle',
        itemWidth: 8,
        itemHeight: 8,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.45)',
          rich: {
            a: {
              width: 24,
            },
            b: {
              width: 36,
              align: 'right',
            },
            c: {
              width: 36,
              align: 'right',
            },
          },
        },
        formatter: this.getPieToolTipFormatter,
      },
      color: ['#52c41a', '#faad14', '#f5222d'],
      series : [
        {
          name: '安全状况时长占比',
          type: 'pie',
          center: ['25%', '50%'],
          radius : ['40%', '55%'],
          data: [
            safeDuration,
            warningDuration,
            alarmDuration,
          ].map((value, index) => ({
            name: `${index}`,
            value,
            label: index === 0 ? {
              normal: {
                position: 'center',
                formatter: `{a|${safeDuration+warningDuration+alarmDuration}}\n{b|h}`,
                rich: {
                  a: {
                    fontSize: 16,
                    lineHeight: 24,
                    color: 'rgba(0, 0, 0, 0.65)',
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 18,
                    color: 'rgba(0, 0, 0, 0.45)',
                  },
                },
              },
            } : {
              normal: {
                show: false,
              },
            },
          })),
          labelLine: {
            show: false,
          },
        },
      ],
    };

    return (
      <ReactEcharts
        style={{ height: 200 }}
        option={option}
      />
    );
  }

  renderLine() {
    const {
      majorHazardMonitor: {
        tankAreaHistoryCount: {
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

    const option = {
      color: ['#faad14', '#f5222d', '#52c41a'],
      tooltip : {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        formatter: numberType === '1' ? this.getLineToolTipFormatter : undefined,
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
        left: 10,
        right: 20,
        bottom: 30,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dateList,
        boundaryGap: false,
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
          formatter: numberType === '1' ? '{value}%' : undefined,
        },
      },
      series: [
        {
          name: '待处理工单',
          type: 'line',
          areaStyle: {
            opacity: 1,
          },
          data: numberType === '0' ? pendingList : pendingPercentList,
        },
        {
          name: '处理中工单',
          type: 'line',
          areaStyle: {
            opacity: 1,
          },
          data: numberType === '0' ? processingList : processingPercentList,
        },
        {
          name: '已处理工单',
          type: 'line',
          areaStyle: {
            opacity: 1,
          },
          data: numberType === '0' ? processedList: processedPercentList,
        },
      ],
  };

    return (
      <ReactEcharts
        key={numberType}
        style={{ height: 200 }}
        option={option}
      />
    );
  }

  renderLine2() {
    const {
      majorHazardMonitor: {
        tankAreaHistoryCount: {
          dateList,
          warningList=[],
          alarmList=[],
        }={},
      },
    } = this.props;
    const { countType } = this.state;

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
        left: 10,
        right: 20,
        bottom: 30,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dateList,
        boundaryGap: false,
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
        },
      },
      series: [
        {
          name: `预警${COUNT_TYPES[countType].value}`,
          type: 'line',
          data: warningList,
        },
        {
          name: `报警${COUNT_TYPES[countType].value}`,
          type: 'line',
          data: alarmList,
        },
      ],
  };

    return (
      <ReactEcharts
        key={countType}
        style={{ height: 200 }}
        option={option}
      />
    );
  }

  renderDate() {
    const { period, range } = this.state;

    return (
      <Card className={styles.card}>
        <div className={styles.radioList} onClick={this.onPeriodChange}>
          {PERIODS.map(({ key, value }) => <div className={classNames(styles.radioItem, period === key && styles.active)} key={key} data-period={key}>{value}</div>)}
        </div>
        <DatePicker.RangePicker
          value={range}
          onChange={this.onRangeChange}
          allowClear={false}
        />
      </Card>
    );
  }

  render() {
    const {
      loading,
    } = this.props;
    const { tabActiveKey } = this.state;

    return (
      <PageHeaderLayout
        className={styles.container}
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        action={(
          <div className={styles.jumper} style={{ backgroundImage: `url(${iconRealTime})` }} onClick={() => router.push(TANK_AREA_REAL_TIME_URL)} title="储罐区实时监测" />
        )}
        tabList={TABS}
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
      >
        <Spin spinning={!!loading}>
          {this.renderDate()}
          {this[`render${tabActiveKey}`] && this[`render${tabActiveKey}`]()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
