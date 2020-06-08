import React, { Component, Fragment } from 'react';
import { Row, Col, Radio, Card, Table, Badge, Select, Button, Spin } from 'antd';
import ReactEcharts from 'echarts-for-react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomEmpty from '@/jingan-components/CustomEmpty';
import Ellipsis from '@/components/Ellipsis';
import { Range } from '@/pages/IoT/MajorHazard/components';
import moment from 'moment';
import { connect } from 'dva';
import { toFixed, isNumber, getPageSize, setPageSize } from '@/utils/utils';
import { TYPES } from '@/pages/IoT/MajorHazard/const';
import { DEFAULT_FORMAT, STATUSES, STATUS_MAPPER, GET_STATUS_NAME } from '@/pages/IoT/AlarmMessage';
import { getTransformedTime } from '@/pages/IoT/AlarmWorkOrder/Detail';
import iconDevice from '@/pages/IoT/MajorHazard/imgs/icon-device.png';
import styles from './index.less';
const { Option } = Select;

const GET_HISTORY_DETAIL = 'gasMonitor/getHistoryDetail';
const GET_HISTORY_LIST = 'gasMonitor/getHistoryList';
const GET_MONITOR_OBJECT_TYPE_LIST = 'gasMonitor/getMonitorObjectTypeList';
const GET_MONITOR_OBJECT_LIST = 'gasMonitor/getMonitorObjectList';
const GET_MONITOR_POINT_LIST = 'gasMonitor/getMonitorPointList';
const GET_DURATION = 'gasMonitor/getDuration';
const GET_COUNT_TREND = 'gasMonitor/getCountTrend';
const GET_ALARM_TREND = 'gasMonitor/getAlarmTrend';
const GET_RANK = 'gasMonitor/getRank';
const GET_EQUIPMENT_TYPE_DETAIL = 'iotStatistics/getEquipmentTypeDetail';
const EXPORT_DATA = 'gasMonitor/exportData';

@connect(
  ({ user, gasMonitor, iotStatistics: { equipmentTypeDetail }, loading }) => ({
    user,
    gasMonitor,
    equipmentTypeDetail,
    loading: loading.effects[GET_HISTORY_DETAIL] || loading.effects[GET_HISTORY_LIST] || false,
  }),
  dispatch => ({
    getHistoryDetail (payload, callback) {
      dispatch({
        type: GET_HISTORY_DETAIL,
        payload,
        callback,
      });
    },
    getHistoryList (payload, callback) {
      dispatch({
        type: GET_HISTORY_LIST,
        payload,
        callback,
      });
    },
    getDuration (payload, callback) {
      dispatch({
        type: GET_DURATION,
        payload,
        callback,
      });
    },
    getCountTrend (payload, callback) {
      dispatch({
        type: GET_COUNT_TREND,
        payload,
        callback,
      });
    },
    getAlarmTrend (payload, callback) {
      dispatch({
        type: GET_ALARM_TREND,
        payload,
        callback,
      });
    },
    getRank (payload, callback) {
      dispatch({
        type: GET_RANK,
        payload,
        callback,
      });
    },
    getMonitorObjectTypeList (payload, callback) {
      dispatch({
        type: GET_MONITOR_OBJECT_TYPE_LIST,
        payload,
        callback,
      });
    },
    getMonitorObjectList (payload, callback) {
      dispatch({
        type: GET_MONITOR_OBJECT_LIST,
        payload,
        callback,
      });
    },
    getMonitorPointList (payload, callback) {
      dispatch({
        type: GET_MONITOR_POINT_LIST,
        payload,
        callback,
      });
    },
    exportData (payload, callback, fileName) {
      dispatch({
        type: EXPORT_DATA,
        payload,
        callback,
        fileName,
      });
    },
    getEquipmentTypeDetail (payload, callback) {
      dispatch({
        type: GET_EQUIPMENT_TYPE_DETAIL,
        payload,
        callback,
      });
    },
  })
)
export default class GasHistory extends Component {
  state = {
    range: undefined, // 时间范围
    type: TYPES[0].key, // 类型，['图表', '列表']
    status: undefined, // 安全状态
    monitorObjectTypeId: undefined, // 监测对象类型
    monitorObjectId: undefined, // 监测对象
    monitorPointId: undefined, // 监测点位
    selectedRowKeys: [], // 选中的
    rankTableSort: 1, // 1是报警排序，3是误报排序
  };

  componentDidMount () {
    const {
      match: {
        params: { equipmentTypes },
      },
      getMonitorObjectTypeList,
      getEquipmentTypeDetail,
    } = this.props;
    getMonitorObjectTypeList({
      monitorEquipmentTypes: equipmentTypes,
    });
    getEquipmentTypeDetail({ id: equipmentTypes });
  }

  getHistoryDetail = () => {
    const {
      match: { params },
      getHistoryDetail,
    } = this.props;
    const { range: [startTime, endTime] = [] } = this.state;
    getHistoryDetail({
      startTime: startTime && startTime.format(DEFAULT_FORMAT),
      endTime: endTime && endTime.format(DEFAULT_FORMAT),
      ...params,
    });
  };

  getDuration = () => {
    const {
      match: { params },
      getDuration,
    } = this.props;
    const { range: [startTime, endTime] = [] } = this.state;
    getDuration({
      startTime: startTime && startTime.format(DEFAULT_FORMAT),
      endTime: endTime && endTime.format(DEFAULT_FORMAT),
      ...params,
    });
  };

  getCountTrend = () => {
    const {
      match: { params },
      getCountTrend,
    } = this.props;
    const { range: [startTime, endTime] = [] } = this.state;
    getCountTrend({
      startTime: startTime && startTime.format(DEFAULT_FORMAT),
      endTime: endTime && endTime.format(DEFAULT_FORMAT),
      ...params,
    });
  };

  getAlarmTrend = () => {
    const {
      match: { params },
      getAlarmTrend,
    } = this.props;
    const { range: [startTime, endTime] = [] } = this.state;
    getAlarmTrend({
      startTime: startTime && startTime.format(DEFAULT_FORMAT),
      endTime: endTime && endTime.format(DEFAULT_FORMAT),
      ...params,
    });
  };

  getRank = () => {
    const {
      match: { params },
      getRank,
    } = this.props;
    const { range: [startTime, endTime] = [], rankTableSort } = this.state;
    getRank({
      startTime: startTime && startTime.format(DEFAULT_FORMAT),
      endTime: endTime && endTime.format(DEFAULT_FORMAT),
      sortType: rankTableSort,
      ...params,
    });
  };

  getHistoryList = ({ pageNum = 1, pageSize = getPageSize() } = {}) => {
    const {
      match: {
        params: { companyId, equipmentTypes },
      },
      getHistoryList,
    } = this.props;
    const {
      range: [startTime, endTime] = [],
      status,
      monitorObjectTypeId,
      monitorObjectId,
      monitorPointId,
    } = this.state;
    getHistoryList({
      pageNum,
      pageSize,
      companyId,
      startTime: startTime && startTime.format(DEFAULT_FORMAT),
      endTime: endTime && endTime.format(DEFAULT_FORMAT),
      monitorEquipmentTypes: equipmentTypes,
      beMonitorTargetType: monitorObjectTypeId,
      beMonitorTargetId: monitorObjectId,
      monitorEquipmentId: monitorPointId,
      statusType: -1,
      ...STATUS_MAPPER[status],
    });
  };

  handleRangeChange = range => {
    this.setState(
      {
        range,
      },
      () => {
        const { type } = this.state;
        if (type === TYPES[0].key) {
          this.getHistoryDetail();
          this.getDuration();
          this.getCountTrend();
          this.getAlarmTrend();
          this.getRank();
        } else {
          this.getHistoryList();
        }
      }
    );
  };

  handleTypeChange = ({ target: { value: type } }) => {
    this.setState({
      type,
      ...(type === TYPES[0].key
        ? {
          status: undefined,
          monitorObjectTypeId: undefined,
          monitorObjectId: undefined,
          monitorPointId: undefined,
          selectedRowKeys: [],
        }
        : {
          rankTableSort: 1,
        }),
    });
    if (type === TYPES[0].key) {
      this.getHistoryDetail();
      this.getDuration();
      this.getCountTrend();
      this.getAlarmTrend();
      this.getRank();
    } else {
      this.getHistoryList();
    }
  };

  handleStatusChange = status => {
    this.setState(
      {
        status,
      },
      this.getHistoryList
    );
  };

  handleMonitorObjectTypeIdChange = monitorObjectTypeId => {
    if (monitorObjectTypeId) {
      const {
        match: {
          params: { companyId },
        },
        getMonitorObjectList,
      } = this.props;
      getMonitorObjectList({
        type: monitorObjectTypeId,
        companyId,
      });
    }
    this.setState(
      {
        monitorObjectTypeId,
        monitorObjectId: undefined,
        monitorPointId: undefined,
      },
      this.getHistoryList
    );
  };

  handleMonitorObjectIdChange = monitorObjectId => {
    if (monitorObjectId) {
      const { getMonitorPointList } = this.props;
      getMonitorPointList({
        targetId: monitorObjectId,
      });
    }
    this.setState(
      {
        monitorObjectId,
        monitorPointId: undefined,
      },
      this.getHistoryList
    );
  };

  handleMonitorPointIdChange = monitorPointId => {
    this.setState(
      {
        monitorPointId,
      },
      this.getHistoryList
    );
  };

  handleExportButtonClick = () => {
    const {
      match: {
        params: { companyId, equipmentTypes },
      },
      exportData,
      equipmentTypeDetail: { name = '' } = {},
    } = this.props;
    const {
      range: [startTime, endTime] = [],
      status,
      monitorObjectTypeId,
      monitorObjectId,
      monitorPointId,
    } = this.state;
    exportData(
      {
        companyId,
        startTime: startTime && startTime.format(DEFAULT_FORMAT),
        endTime: endTime && endTime.format(DEFAULT_FORMAT),
        monitorEquipmentTypes: equipmentTypes,
        beMonitorTargetType: monitorObjectTypeId,
        beMonitorTargetId: monitorObjectId,
        monitorEquipmentId: monitorPointId,
        statusType: -1,
        ...STATUS_MAPPER[status],
      },
      undefined,
      `${name}监测明细`
    );
  };

  handleSelectedRowKeysChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  handleTableChange = ({ current, pageSize }) => {
    const {
      gasMonitor: {
        historyList: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {},
      },
    } = this.props;
    this.getHistoryList({
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    });
    prevPageSize !== pageSize && setPageSize(pageSize);
  };

  // 排名表格change
  handleRankTableChange = (a, b, { field, order }) => {
    if (order) {
      if (field === 'warningCount') {
        this.setState(
          {
            rankTableSort: { descend: 1, ascend: 2 }[order],
          },
          this.getRank
        );
      } else if (field === 'falseWarningCount') {
        this.setState(
          {
            rankTableSort: { descend: 3, ascend: 4 }[order],
          },
          this.getRank
        );
      }
    } else {
      const { rankTableSort } = this.state;
      if (field === 'warningCount') {
        this.setState(
          {
            rankTableSort: { 2: 1, 1: 2 }[rankTableSort],
          },
          this.getRank
        );
      } else if (field === 'falseWarningCount') {
        this.setState(
          {
            rankTableSort: { 4: 3, 3: 4 }[rankTableSort],
          },
          this.getRank
        );
      }
    }
  };

  /**
   * 筛选栏
   */
  renderToobar () {
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
                <Radio.Button key={key} value={key}>
                  {value}
                </Radio.Button>
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
  renderCount () {
    const {
      gasMonitor: {
        historyDetail: {
          equipmentCount,
          warningCount,
          trueWarningCount,
          falseWarningCount,
          endProcessPercent,
          waitProcessCount,
          ingProcessCount,
          endProcessCount,
          suspectedWarningCount,
        } = {},
      },
    } = this.props;
    const total = (waitProcessCount || 0) + (ingProcessCount || 0) + (endProcessCount || 0);

    return (
      <Card className={styles.card}>
        <div className={styles.countContainer}>
          <div>
            <div className={styles.countItem} style={{ backgroundImage: `url(${iconDevice})` }}>
              <div className={styles.countLabel}>监测设备（个）</div>
              <div className={styles.countValue}>{equipmentCount || 0}</div>
            </div>
          </div>
          <div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>报警（次）</div>
              <div className={styles.countValue}>{warningCount || 0}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>真实警情（次）</div>
              <div className={styles.countValue}>{trueWarningCount || 0}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>误报警情（次）</div>
              <div className={styles.countValue}>{falseWarningCount || 0}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>疑似警情（次）</div>
              <div className={styles.countValue}>{suspectedWarningCount || 0}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>工单总数（张）</div>
              <div className={styles.countValue}>{total}</div>
            </div>
            <div className={styles.countItem}>
              <div className={styles.countLabel}>工单完成率</div>
              <div className={styles.countValue}>{`${toFixed(endProcessPercent || 0)}%`}</div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  /**
   * 报警工单处理时效
   */
  renderDurationChart () {
    const {
      gasMonitor: {
        duration: {
          '≤6min': d1,
          '6~12min': d2,
          '12~18min': d3,
          '18~1d': d4,
          '>1d': d5,
          avgTime,
        } = {},
        historyDetail: { endProcessCount } = {},
      },
    } = this.props;
    const t = getTransformedTime((avgTime || 0) * 1000).replace(/(\d+)|([a-z]+)/g, '{a|$1}{b|$2}');
    const option = {
      title: {
        text: `${t}   {c|工单平均处理时长}    {a|${endProcessCount || 0}}{b|张}   {c|已处理工单}`,
        textStyle: {
          fontSize: 12,
          lineHeight: 20,
          color: 'rgba(0, 0, 0, 0.65)',
          fontWeight: 'normal',
          rich: {
            a: {
              fontSize: 20,
            },
            b: {
              // verticalAlign: 'bottom',
            },
            c: {
              color: 'rgba(0, 0, 0, 0.45)',
            },
          },
        },
        left: 'right',
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
        data: ['≤6min', '6~12min', '12~18min', '18~1d', '>1d'],
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
          data: [d1 || 0, d2 || 0, d3 || 0, d4 || 0, d5 || 0],
        },
      ],
    };

    return (
      <Card className={styles.card}>
        <div className={styles.cardTitle}>报警工单处理时效</div>
        <div className={styles.cardContent}>
          {option ? <ReactEcharts style={{ height: '100%' }} option={option} /> : <CustomEmpty />}
        </div>
      </Card>
    );
  }

  /**
   * 监测设备报警趋势
   */
  renderTrendChart () {
    const {
      gasMonitor: { alarmTrend = [] },
    } = this.props;

    const option = alarmTrend &&
      alarmTrend.length > 0 && {
      color: ['#f5222d'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        formatter: params => {
          const date = params[0].name;
          return `${date}<br />${params
            .map(
              ({ marker, seriesName, value: [date, value] }) => `${marker}${seriesName}：${value}`
            )
            .join('<br />')}`;
        },
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
        type: 'time',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
          formatter: time => moment(time).format('MM-DD'),
        },
        splitLine: {
          show: false,
        },
        minInterval: 24 * 60 * 60 * 1000,
        splitNumber: 7,
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
        minInterval: 1,
      },
      series: [
        {
          name: '监测设备数量',
          type: 'line',
          data: alarmTrend.map(({ happenTime, equipmentCount }) => ({
            name: happenTime,
            value: [happenTime, equipmentCount],
          })),
          smooth: true,
          areaStyle: {
            opacity: 0.5,
          },
        },
      ],
    };

    return (
      <Card className={styles.card}>
        <div className={styles.cardTitle}>监测设备报警趋势</div>
        <div className={styles.cardContent}>
          {option ? <ReactEcharts style={{ height: '100%' }} option={option} /> : <CustomEmpty />}
        </div>
      </Card>
    );
  }

  /**
   * 预警/告警次数趋势
   */
  renderTrend2Chart () {
    const {
      match: {
        params: { equipmentTypes },
      },
      gasMonitor: { countTrend = [] },
    } = this.props;
    const isSmoke = equipmentTypes === '413';
    const { warning, alarm, fire } = (countTrend || []).reduce(
      (result, { happenTime, redCount, yellowCount }) => {
        result.warning.push({
          name: happenTime,
          value: [happenTime, yellowCount],
        });
        result.alarm.push({
          name: happenTime,
          value: [happenTime, redCount],
        });
        result.fire.push({
          name: happenTime,
          value: [happenTime, yellowCount + redCount],
        });
        return result;
      },
      {
        warning: [],
        alarm: [],
        fire: [],
      }
    );

    const option = {
      color: isSmoke ? ['#f5222d'] : ['#faad14', '#f5222d'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        formatter: params => {
          const date = params[0].name;
          return `${date}<br />${params
            .map(
              ({ marker, seriesName, value: [date, value] }) => `${marker}${seriesName}：${value}`
            )
            .join('<br />')}`;
        },
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
        type: 'time',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.45)',
          },
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.65)',
          formatter: time => moment(time).format('MM-DD'),
        },
        splitLine: {
          show: false,
        },
        minInterval: 24 * 60 * 60 * 1000,
        splitNumber: 7,
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
        minInterval: 1,
      },
      series: isSmoke
        ? [
          {
            name: '火警次数',
            type: 'line',
            data: fire,
          },
        ]
        : [
          {
            name: '预警次数',
            type: 'line',
            data: warning,
          },
          {
            name: '告警次数',
            type: 'line',
            data: alarm,
          },
        ],
    };

    return (
      <Card className={styles.card}>
        <div className={styles.cardTitle}>{isSmoke ? '火警次数趋势' : '预警/告警次数趋势'}</div>
        <div className={styles.cardContent}>
          {countTrend && countTrend.length ? (
            <ReactEcharts style={{ height: '100%' }} option={option} />
          ) : (
              <CustomEmpty />
            )}
        </div>
      </Card>
    );
  }

  /**
   * 监测设备报警/误报排名
   */
  renderRankingTable () {
    const {
      gasMonitor: { rank },
    } = this.props;
    const { rankTableSort } = this.state;
    const list = (rank || []).slice(0, 6);

    const columns = [
      {
        title: '',
        dataIndex: 'index',
        width: 26,
        render: (value, data, index) => (
          <Badge count={index + 1} style={{ backgroundColor: index < 3 ? '#faad14' : '#d9d9d9' }} />
        ),
      },
      {
        title: '监测设备名称',
        dataIndex: 'equipmentName',
        render: value =>
          value && (
            <Ellipsis length={6} tooltip>
              {value}
            </Ellipsis>
          ),
      },
      {
        title: '监测设备位置',
        dataIndex: 'areaLocation',
        render: value =>
          value && (
            <Ellipsis length={5} tooltip>
              {value}
            </Ellipsis>
          ),
      },
      {
        title: '报警次数',
        dataIndex: 'warningCount',
        render: value => value >= 0 && <Ellipsis length={8} tooltip>{`${value}`}</Ellipsis>,
        sorter: true,
        sortOrder: { 1: 'descend', 2: 'ascend' }[rankTableSort] || false,
        sortDirections: ['ascend', 'descend'],
      },
      {
        title: '误报次数',
        dataIndex: 'falseWarningCount',
        render: value => value >= 0 && <Ellipsis length={8} tooltip>{`${value}`}</Ellipsis>,
        sorter: true,
        sortOrder: { 3: 'descend', 4: 'ascend' }[rankTableSort] || false,
        sortDirections: ['ascend', 'descend'],
      },
    ];

    return (
      <Card className={styles.card}>
        <div className={styles.cardTitle}>监测设备报警/误报排名</div>
        <div className={styles.cardContent}>
          {list.length ? (
            <Table
              className={styles.table}
              columns={columns}
              dataSource={list}
              rowKey="id"
              pagination={false}
              onChange={this.handleRankTableChange}
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
  renderTable () {
    const {
      match: {
        params: { equipmentTypes },
      },
      gasMonitor: {
        historyList: { list = [], pagination: { total, pageNum, pageSize } = {} } = {},
        monitorObjectTypeList = [],
        monitorObjectList = [],
        monitorPointList = [],
      },
    } = this.props;
    const {
      status,
      monitorObjectTypeId,
      monitorObjectId,
      monitorPointId,
      selectedRowKeys,
    } = this.state;
    const columns = [
      {
        title: '监测对象类型',
        dataIndex: 'beMonitorTargetTypeName',
        align: 'center',
      },
      {
        title: '监测对象名称',
        dataIndex: 'beMonitorTargetName',
        align: 'center',
      },
      {
        title: '监测设备名称',
        dataIndex: 'monitorEquipmentName',
        align: 'center',
      },
      {
        title: '监测设备位置',
        dataIndex: 'monitorEquipmentAreaLocation',
        align: 'center',
      },
      {
        title: '监测参数',
        dataIndex: 'paramDesc',
        align: 'center',
      },
      {
        title: '监测数值',
        dataIndex: 'monitorValue',
        align: 'center',
        render: (value, { fixType, paramUnit, statusType }) =>
          isNumber(value) && (
            <Badge
              status={+statusType === -1 ? 'error' : 'success'}
              text={
                fixType !== 5 ? `${value}${paramUnit || ''}` : +statusType === -1 ? '火警' : '正常'
              }
            />
          ),
      },
      {
        title: '报警原因',
        dataIndex: 'alarm',
        align: 'center',
        render: (
          _,
          { fixType, paramUnit, condition, warnLevel, limitValue, monitorValue, statusType }
        ) =>
          +statusType === -1 &&
          (+fixType !== 5
            ? `${condition === '>=' ? '超过' : '低于'}${
            +warnLevel === 1 ? '预警' : '告警'
            }值${toFixed(Math.abs(limitValue - monitorValue))}${paramUnit}（${
            +warnLevel === 1 ? '预警' : '告警'
            }${condition === '>=' ? '上限' : '下限'}为${limitValue}${paramUnit}）`
            : '——'),
      },
      {
        title: '发生时间',
        dataIndex: 'happenTime',
        align: 'center',
        render: time => time && moment(time).format('YYYY-MM-DD HH:mm:ss'),
      },
    ];

    return (
      <Card className={styles.card}>
        <Row className={styles.controlRow} gutter={24}>
          {equipmentTypes !== '413' && (
            <Col xs={24} sm={12} md={8}>
              <Select
                className={styles.select}
                placeholder="请选择安全状态"
                value={status}
                onChange={this.handleStatusChange}
                allowClear
              >
                {STATUSES.slice(0, 2).map(({ key, value }) => (
                  <Option key={key}>{value}</Option>
                ))}
              </Select>
            </Col>
          )}
          <Col xs={24} sm={12} md={8}>
            <Select
              className={styles.select}
              placeholder="请选择监测对象类型"
              value={monitorObjectTypeId}
              onChange={this.handleMonitorObjectTypeIdChange}
              allowClear
            >
              {monitorObjectTypeList.map(({ id, name }) => (
                <Option key={id}>{name}</Option>
              ))}
            </Select>
          </Col>
          {monitorObjectTypeId && (
            <Col xs={24} sm={12} md={8}>
              <Select
                className={styles.select}
                placeholder="请选择监测对象"
                value={monitorObjectId}
                onChange={this.handleMonitorObjectIdChange}
                allowClear
              >
                {monitorObjectList.map(({ id, name }) => (
                  <Option key={id}>{name}</Option>
                ))}
              </Select>
            </Col>
          )}
          {monitorObjectId && (
            <Col xs={24} sm={12} md={8}>
              <Select
                className={styles.select}
                placeholder="请选择监测设备"
                value={monitorPointId}
                onChange={this.handleMonitorPointIdChange}
                allowClear
              >
                {monitorPointList.map(({ id, name }) => (
                  <Option key={id}>{name}</Option>
                ))}
              </Select>
            </Col>
          )}
          <Col xs={24} sm={12} md={8}>
            <Button
              type="primary"
              onClick={this.handleExportButtonClick}
              disabled={/* !selectedRowKeys.length */ !list.length}
            >
              导出明细
            </Button>
          </Col>
          <Col span={24}>
            {list.length ? (
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
                  // pageSizeOptions: ['5', '10', '15', '20'],
                  showTotal: total => `共计 ${total} 条数据`,
                  showQuickJumper: true,
                  showSizeChanger: true,
                }}
              // rowSelection={{
              //   selectedRowKeys,
              //   onChange: this.handleSelectedRowKeysChange,
              // }}
              />
            ) : (
                <div className={styles.cardContent}>
                  <CustomEmpty />
                </div>
              )}
          </Col>
        </Row>
      </Card>
    );
  }

  render () {
    const { equipmentTypeDetail: { name } = {}, loading } = this.props;
    const { type } = this.state;

    const title = name;
    const breadcrumbList = [
      { title: '首页', name: '首页', href: '/' },
      { title: '物联网监测', name: '物联网监测' },
      {
        title: 'IOT监测及趋势统计',
        name: 'IOT监测及趋势统计',
        href: '/company-iot/IOT-abnormal-data/list',
      },
      { title, name },
    ];

    return name ? (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Spin spinning={loading}>
          <Row className={styles.row} gutter={24}>
            <Col span={24}>{this.renderToobar()}</Col>
            {type === TYPES[0].key ? (
              <Fragment>
                <Col span={24}>{this.renderCount()}</Col>
                <Col xxl={10} lg={12} sm={24} xs={24}>
                  {this.renderDurationChart()}
                </Col>
                <Col xxl={14} lg={12} sm={24} xs={24}>
                  {this.renderTrendChart()}
                </Col>
                <Col xxl={14} lg={12} sm={24} xs={24}>
                  {this.renderTrend2Chart()}
                </Col>
                <Col xxl={10} lg={12} sm={24} xs={24}>
                  {this.renderRankingTable()}
                </Col>
              </Fragment>
            ) : (
                <Col span={24}>{this.renderTable()}</Col>
              )}
          </Row>
        </Spin>
      </PageHeaderLayout>
    ) : null;
  }
}
