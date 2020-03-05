import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';

// import router from 'umi/router';
import moment from 'moment';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Select, Col, Radio, Row, DatePicker } from 'antd';
import {
  BREADCRUMBLIST,
  DepartNumIcon,
  MonthIcon,
  QuarterIcon,
  YearIcon,
  DepartPie,
  DepartLine,
  IndexChartsLine,
} from './utils';
import styles from './index.less';

const monthFormat = 'YYYY/MM';
const { MonthPicker } = DatePicker;

const quarterList = [
  {
    key: '1',
    value: '一季度',
  },
  {
    key: '2',
    value: '二季度',
  },
  {
    key: '3',
    value: '三季度',
  },
  {
    key: '4',
    value: '四季度',
  },
];

const getQuarter = {
  1: '一季度',
  2: '二季度',
  3: '三季度',
  4: '四季度',
};

@connect(({ targetResponsibility, department, user, loading }) => ({
  targetResponsibility,
  user,
  department,
  loading: loading.models.targetResponsibility,
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: '1',
      typeIndex: '1',
      targetId: '', // 所选指标id
      dutyMajorId: '', // 所选部门id
      isOpen: false, // 控制日期(年份)面板是否打开
      yearDateVal: undefined,
      monthDateVal: undefined,
      quarterDateVal: undefined,
      departIndex: '',
      chartLineList: [],
      indexSelect: undefined,
      departSelect: undefined,
      depatIndexSelect: undefined,
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const { typeIndex } = this.state;
    this.fetchMonQuarterYear(id);
    this.fetchPartGoal(id);
    this.fetchYearGoal(id);
    this.fetchIndexList(typeIndex);
    this.fetchSettingList(id);
  }

  // 月，季度，年目标达成率
  fetchMonQuarterYear = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchMonQuarterYear',
      payload: {
        companyId: id,
      },
    });
  };

  // 部门目标达成率
  fetchPartGoal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchPartGoal',
      payload: {
        companyId: id,
      },
    });
  };

  // 各单位部门指标达成情况
  fetchUnitPartGoal = (date, id) => {
    const { type } = this.state;
    const {
      match: {
        params: { id: companyId },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchUnitPartGoal',
      payload: {
        companyId,
        targetId: id,
        examtime: date,
        checkFrequency: type,
      },
    });
  };

  // 各指标变化趋势
  fetchGoalChange = (id, departId, callback) => {
    const { typeIndex } = this.state;
    const {
      dispatch,
      match: {
        params: { id: companyId },
      },
    } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchGoalChange',
      payload: {
        companyId,
        targetId: id,
        dutyMajorId: departId,
        checkFrequency: typeIndex,
      },
      callback: callback,
    });
  };

  // 年度目标达成率排名
  fetchYearGoal = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchYearGoal',
      payload: {
        companyId: id,
      },
    });
  };

  // 根据月份、季度、年获取指标
  fetchIndexList = typeIndex => {
    const {
      dispatch,
      match: {
        params: { id: companyId },
      },
    } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchIndexManagementList',
      payload: {
        companyId,
        checkFrequency: typeIndex,
        pageSize: 24,
        pageNum: 1,
      },
    });
  };

  // 获取目标责任实施列表
  fetchSettingList = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchSettingList',
      payload: {
        companyId: id,
        pageSize: 24,
        pageNum: 1,
        goalYear: moment().format('YYYY'),
      },
    });
  };

  renderFirstContent() {
    const {
      targetResponsibility: { mQYData = {} },
    } = this.props;
    const {
      examDepartNumber,
      nowMonthGoal,
      previousMonthFlag,
      previousYearFlag,
      nowYearGoal,
      previousQuarterFlag,
      nowQuarterGoal,
      previousYearGoal,
      previousQuarterGoal,
      previousMonthGoal,
    } = mQYData;
    return (
      <div className={styles.firstSection}>
        <div className={styles.itemLeft}>
          <div className={styles.imgLeft} style={{ backgroundImage: `url(${DepartNumIcon})` }} />
          <div className={styles.valueRight}>
            <div className={styles.name}>考核部门数</div>
            <div className={styles.value}>{examDepartNumber}</div>
          </div>
        </div>
        <div className={styles.itemRight}>
          <div className={styles.section}>
            <div className={styles.imgLeft} style={{ backgroundImage: `url(${MonthIcon})` }} />
            <div className={styles.valueRight}>
              <div className={styles.name}>本月目标达成率</div>
              <div className={styles.value}>{nowMonthGoal}</div>
              <div className={styles.label}>
                <span className={styles.icon}>
                  {previousMonthFlag === '0' ? (
                    <LegacyIcon type="caret-up" style={{ color: 'rgb(46,186,7)' }} />
                  ) : (
                    <LegacyIcon type="caret-down" style={{ color: 'rgb(254,80,0)' }} />
                  )}
                </span>
                <span className={previousMonthFlag === '0' ? styles.number : styles.numbers}>
                  {previousMonthGoal}
                </span>
                <span className={styles.write}>同比上月</span>
              </div>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.imgLeft} style={{ backgroundImage: `url(${QuarterIcon})` }} />
            <div className={styles.valueRight}>
              <div className={styles.name}>本季度目标达成率</div>
              <div className={styles.value}>{nowQuarterGoal}</div>
              <div className={styles.label}>
                <span className={styles.icon}>
                  {previousQuarterFlag === '0' ? (
                    <LegacyIcon type="caret-up" style={{ color: 'rgb(46,186,7)' }} />
                  ) : (
                    <LegacyIcon type="caret-down" style={{ color: 'rgb(254,80,0)' }} />
                  )}
                </span>
                <span className={previousQuarterFlag === '0' ? styles.number : styles.numbers}>
                  {previousQuarterGoal}
                </span>
                <span className={styles.write}>同比上季度</span>
              </div>
            </div>
          </div>
          <div className={styles.section}>
            <div className={styles.imgLeft} style={{ backgroundImage: `url(${YearIcon})` }} />
            <div className={styles.valueRight}>
              <div className={styles.name}>本年目标达成率</div>
              <div className={styles.value}>{nowYearGoal}</div>
              <div className={styles.label}>
                <span className={styles.icon}>
                  {previousYearFlag === '0' ? (
                    <LegacyIcon type="caret-up" style={{ color: 'rgb(46,186,7)' }} />
                  ) : (
                    <LegacyIcon type="caret-down" style={{ color: 'rgb(254,80,0)' }} />
                  )}
                </span>
                <span className={previousQuarterFlag === '0' ? styles.number : styles.numbers}>
                  {previousYearGoal}
                </span>
                <span className={styles.write}>同比去年</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 部门指标时间选择
  handleRadioChange = e => {
    const mode = e.target.value;
    this.setState({
      type: mode,
      depatIndexSelect: undefined,
      departIndex: '',
      yearDateVal: undefined,
      monthDateVal: undefined,
      quarterDateVal: undefined,
    });
    this.fetchIndexList(mode);
  };

  handleOpenChange = s => {
    if (s) {
      this.setState({ isOpen: true });
    } else {
      this.setState({ isOpen: false });
    }
  };

  handleMonthChange = m => {
    const { departIndex } = this.state;
    const mDate = moment(m).format('YYYY-MM');
    departIndex && m && this.fetchUnitPartGoal(mDate, departIndex);
    this.setState({ monthDateVal: m });
  };

  handleQuarterChange = q => {
    const { departIndex } = this.state;
    departIndex && q && this.fetchUnitPartGoal(q, departIndex);
    this.setState({ quarterDateVal: q });
  };

  handlePanelChange = v => {
    const { departIndex } = this.state;
    const yDate = moment(v).format('YYYY');
    departIndex && v && this.fetchUnitPartGoal(yDate, departIndex);
    this.setState({ yearDateVal: v, isOpen: false });
  };

  // 清空日期选择框
  clearDateValue = d => {
    this.setState({ yearDateVal: null });
  };

  handleDepatIndexChange = id => {
    const { type, monthDateVal, quarterDateVal, yearDateVal } = this.state;
    const mDate = moment(monthDateVal).format('YYYY-MM');
    const yDate = moment(yearDateVal).format('YYYY');
    const date = type === '1' ? mDate : type === '2' ? quarterDateVal : yDate;
    id && date && this.fetchUnitPartGoal(date, id);
    this.setState({ departIndex: id, depatIndexSelect: id });
  };

  renderSecondContent() {
    const {
      targetResponsibility: {
        indexData: { list: iList = [] },
        partGoalData = {},
        unitPartData: { list = [] },
      },
    } = this.props;
    const {
      type,
      isOpen,
      monthDateVal,
      quarterDateVal,
      yearDateVal,
      depatIndexSelect,
    } = this.state;

    const dateVale =
      monthDateVal !== undefined || quarterDateVal !== undefined || yearDateVal !== undefined;
    const departSelect = dateVale && depatIndexSelect !== undefined;

    const { passPart = 0, vetoPart = 0, partPassRate } = partGoalData;
    const avgValue = departSelect ? list.map(item => item.actualValue) : [];
    const goalValue = departSelect ? list.map(item => item.goalValue) : [];
    const departName = departSelect ? list.map(item => item.name) : [];

    return (
      <div className={styles.secondSection}>
        <div className={styles.itemLeft}>
          <div className={styles.top}>部门目标达成率</div>
          <div className={styles.bottom}>
            <div className={styles.echarts}>
              <DepartPie data={[passPart, vetoPart]} partPassRate={partPassRate} />
            </div>
            <div className={styles.label}>
              <div className={styles.labelFirst}>
                <div className={styles.number}>{passPart}</div>
                <div className={styles.title}>达成目标的部门</div>
              </div>
              <div className={styles.labelSecond}>
                <div className={styles.number}>{vetoPart}</div>
                <div className={styles.title}>未达成目标的部门</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.itemRight}>
          <div className={styles.top}>
            <span className={styles.label}>各单位部门指标达成情况</span>
            <span className={styles.select}>
              {type === '1' && (
                <MonthPicker
                  style={{ width: 150, marginRight: 10 }}
                  value={monthDateVal}
                  format={monthFormat}
                  onChange={this.handleMonthChange}
                />
              )}
              {type === '2' && (
                <Select
                  placeholder="请选择"
                  value={quarterDateVal}
                  style={{ width: 150, marginRight: 10, fontWeight: 'normal' }}
                  onChange={this.handleQuarterChange}
                >
                  {quarterList.map(({ key, value }) => (
                    <Select.Option key={key} value={key}>
                      {value}
                    </Select.Option>
                  ))}
                </Select>
              )}
              {type === '3' && (
                <DatePicker
                  placeholder="请选择"
                  style={{ width: 150, marginRight: 10 }}
                  open={isOpen}
                  value={yearDateVal}
                  onOpenChange={s => this.handleOpenChange(s)}
                  onChange={this.clearDateValue}
                  onPanelChange={v => this.handlePanelChange(v)}
                  format="YYYY"
                  mode="year"
                />
              )}
              <Select
                placeholder="请选择"
                value={depatIndexSelect}
                style={{ width: 150, fontWeight: 'normal' }}
                onChange={this.handleDepatIndexChange}
              >
                {iList.map(({ id, targetName }) => (
                  <Select.Option key={id} value={id}>
                    {targetName}
                  </Select.Option>
                ))}
              </Select>
            </span>
          </div>
          <div className={styles.middle}>
            <Radio.Group onChange={this.handleRadioChange} value={type} style={{ marginBottom: 8 }}>
              <Radio.Button value="1">月度</Radio.Button>
              <Radio.Button value="2">季度</Radio.Button>
              <Radio.Button value="3">年度</Radio.Button>
            </Radio.Group>
          </div>
          <div className={styles.bottom}>
            <DepartLine dataGoal={goalValue} dataReal={avgValue} xData={departName} />
          </div>
        </div>
      </div>
    );
  }

  // 指标月、季度、年切换
  handleIndexChange = e => {
    const mode = e.target.value;
    this.fetchGoalChange('', '', res => {
      this.setState({ chartLineList: [] });
    });
    this.setState({ typeIndex: mode, indexSelect: undefined, departSelect: undefined });
    this.fetchIndexList(mode);
  };

  // 指标切换
  handleSelectChange = id => {
    const { dutyMajorId } = this.state;
    dutyMajorId &&
      id &&
      this.fetchGoalChange(id, dutyMajorId, res => {
        const {
          data: { list },
        } = res;
        this.setState({ chartLineList: list });
      });
    this.setState({ targetId: id, indexSelect: id });
  };

  // 部门切换
  handleDepartChange = id => {
    const { targetId } = this.state;
    id &&
      targetId &&
      this.fetchGoalChange(targetId, id, res => {
        const {
          data: { list },
        } = res;
        this.setState({ chartLineList: list });
      });
    this.setState({ dutyMajorId: id, departSelect: id });
  };

  renderThirdContent() {
    const { typeIndex } = this.state;
    const {
      targetResponsibility: {
        // goalChangeData: { list: lineList = [] },
        yearGoalData: { list: indexList = [] },
        indexData: { list: iList = [] },
        settingData: { list: settingList = [] },
      },
    } = this.props;

    const { chartLineList, departSelect, indexSelect } = this.state;
    const isSelectVal = departSelect !== undefined && indexSelect !== undefined;

    const departList = settingList.filter(item => item.dutyMajor.substr(0, 1) === '2');

    const lineXData = [];
    chartLineList.forEach(element => {
      element.actualValueList.forEach(detail => {
        const item = { ...detail };
        lineXData.push(item);
      });
    });

    const yData = isSelectVal ? lineXData.map(item => item.actualValue) : [];
    const xData = isSelectVal
      ? (typeIndex === '1' && lineXData.map(item => moment(item.examtime).format('M月'))) ||
        (typeIndex === '2' && lineXData.map(item => getQuarter[item.examtime.substr(5, 6)])) ||
        (typeIndex === '3' && lineXData.map(item => item.examtime.substr(0, 4) + '年'))
      : [];

    return (
      <div className={styles.thirdSection}>
        <div className={styles.itemLeft}>
          <div className={styles.top}>各指标变化趋势</div>
          <div className={styles.selectArea}>
            <Radio.Group
              onChange={this.handleIndexChange}
              value={typeIndex}
              style={{ marginBottom: 8 }}
            >
              <Radio.Button value="1">月度</Radio.Button>
              <Radio.Button value="2">季度</Radio.Button>
              <Radio.Button value="3">年度</Radio.Button>
            </Radio.Group>
            <span className={styles.select}>
              <Select
                placeholder="请选择"
                value={indexSelect}
                style={{ width: 150, marginRight: 10 }}
                onChange={this.handleSelectChange}
              >
                {iList.map(({ id, targetName }) => (
                  <Select.Option key={id} value={id}>
                    {targetName}
                  </Select.Option>
                ))}
              </Select>
              <Select
                placeholder="请选择"
                value={departSelect}
                style={{ width: 150 }}
                onChange={this.handleDepartChange}
              >
                {departList.map(({ id, dutyMajor, name }) => {
                  const dutyId = dutyMajor.split(',');
                  return (
                    <Select.Option key={dutyId[1]} value={dutyId[1]}>
                      {name}
                    </Select.Option>
                  );
                })}
              </Select>
            </span>
          </div>
          <div className={styles.middle}>
            <span>
              目标值：
              <span style={{ fontWeight: 'bold' }}>
                {isSelectVal ? chartLineList.map(item => item.goalValue).join(',') || 0 : 0}
              </span>
            </span>
            <span style={{ marginLeft: 15 }}>
              平均值：
              <span style={{ fontWeight: 'bold' }}>
                {isSelectVal ? chartLineList.map(item => item.avgValue).join(',') || 0 : 0}
              </span>
            </span>
          </div>
          <div className={styles.echarts}>
            <IndexChartsLine data={yData} xData={xData} />
          </div>
        </div>
        <div className={styles.itemRight}>
          <div className={styles.top}>年度目标达成率排名</div>
          <div className={styles.table}>
            <div className={styles.title}>
              <Col span={7}>
                <p className={styles.tableTitle}>排名</p>
              </Col>
              <Col span={10}>
                <p className={styles.tableTitle}>部门</p>
              </Col>
              <Col span={7}>
                <p className={styles.tableTitle}>目标达成率</p>
              </Col>
            </div>
            <div className={styles.dataCard}>
              {indexList.map(({ partName, goalValue }, index) => {
                return (
                  <Row key={index} className={styles.row}>
                    <Col span={7}>
                      <p className={styles.tableTitle}>{index + 1}</p>
                    </Col>
                    <Col span={10}>
                      <p className={styles.tableTitle}>{partName}</p>
                    </Col>
                    <Col span={7}>
                      <p className={styles.tableTitle}>{goalValue}</p>
                    </Col>
                  </Row>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={BREADCRUMBLIST}
      >
        <div className={styles.container}>
          <div className={styles.firstContent}>{this.renderFirstContent()}</div>
          <div className={styles.secondContent}>{this.renderSecondContent()}</div>
          <div className={styles.thirdContent}>{this.renderThirdContent()}</div>
        </div>
      </PageHeaderLayout>
    );
  }
}
