import React, { PureComponent } from 'react';
import { connect } from 'dva';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import router from 'umi/router';
import moment from 'moment';
import { Select, Radio, Col, Icon, Row, Table, DatePicker, Empty, Tooltip } from 'antd';
import { BREADCRUMBLIST, DepartPie, ReachList, COLOUMNS } from './utils';
import styles from './index.less';

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
      isOpen: false, // 控制日期(年份)面板是否打开
      yearDateVal: moment().subtract(1, 'year'), // 初始化当前年份
      radioType: '1', // 默认为 图标
      indexVal: undefined, // 初始化指标
      indexReachVal: undefined, // 初始化指标达成情况
      currentPage: 1,
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount() {
    const { yearDateVal } = this.state;
    // this.fetchPartGoal(yearDateVal);
    // this.fetchPartUnitGoal(yearDateVal);
    // this.fetchIndexList();
  }

  // 获取图表数据
  fetchPartGoal = time => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchPartGoal',
      payload: {
        companyId: id,
        goalYear: moment(time).format('YYYY'),
      },
    });
  };

  // 获取列表数据
  fetchPartUnitGoal = (time, targetId, flag) => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'targetResponsibility/fetchPartUnitGoal',
      payload: {
        companyId: id,
        goalYear: moment(time).format('YYYY'),
        targetId: targetId ? targetId : 0,
        flag: flag ? flag : 0,
      },
    });
  };

  // 获取全部指标
  fetchIndexList = () => {
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
        pageSize: 24,
        pageNum: 1,
      },
    });
  };

  // 弹出日历和关闭日历的回调
  handleOpenChange = s => {
    if (s) {
      this.setState({ isOpen: true });
    } else {
      this.setState({ isOpen: false });
    }
  };

  // 日历面板切换的回调
  handlePanelChange = v => {
    this.setState({ yearDateVal: v, isOpen: false });
    // this.fetchPartGoal(v);
    // this.fetchPartUnitGoal(v);
  };

  // 清空日期选择框
  clearDateValue = () => {
    this.setState({ yearDateVal: undefined });
  };

  handleDisabledDate = time => {};

  // radio切换
  handleRadioBtn = e => {
    this.setState({ radioType: e.target.value });
  };

  // 跳转到目标责任制定实施
  hanldeLink = () => {
    router.push('/target-responsibility/target-setting/index');
  };

  // 指标选择
  handleIndexChange = val => {
    const { yearDateVal, indexReachVal } = this.state;
    this.setState({ indexVal: val });
    this.fetchPartUnitGoal(yearDateVal, val, indexReachVal);
  };

  // 达成情况选择
  handleIndexReachChange = val => {
    const { yearDateVal, indexVal } = this.state;
    this.setState({ indexReachVal: val });
    this.fetchPartUnitGoal(yearDateVal, indexVal, val);
  };

  // 重置
  handleRest = () => {
    const { yearDateVal } = this.state;
    this.fetchPartUnitGoal(yearDateVal);
    this.setState({ indexVal: undefined, indexReachVal: undefined });
  };

  handleTableData = (list = [], indexBase) => {
    return list.map((item, index) => {
      return {
        ...item,
        index: indexBase + index + 1,
      };
    });
  };

  // 渲染图表
  renderPicContent() {
    const {
      targetResponsibility: {
        partGoalData: {
          passUnit = 0,
          unitNumber = 0,
          passPart = 0,
          vetoPart = 0,
          unitGoal = '0%',
          rankList = [],
        },
      },
    } = this.props;

    return (
      <div className={styles.sectionChart}>
        <div className={styles.left}>
          <div className={styles.itemTop}>
            <div className={styles.headline}>单位目标达成情况</div>
            <div className={styles.echarts}>
              <DepartPie data={[passUnit, unitNumber - passUnit]} partPassRate={unitGoal} />
            </div>
          </div>

          <div className={styles.itemBottom}>
            <div className={styles.headline}>部门目标达成情况</div>
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

        <div className={styles.right}>
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
              {rankList.map(({ partName, goalValue }, index) => {
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

  // 渲染列表
  renderTableContent() {
    const {
      targetResponsibility: {
        indexData: { list: iList = [] },
        unitGoalData: { list: tableList = [] },
      },
    } = this.props;

    const { indexVal, indexReachVal, currentPage } = this.state;
    const indexBase = (currentPage - 1) * 10;

    return (
      <div className={styles.sectionTable}>
        <div className={styles.selectArea}>
          <Select
            placeholder="全部指标"
            value={indexVal}
            style={{ width: 240, marginRight: 10 }}
            onChange={this.handleIndexChange}
          >
            {iList.map(({ id, targetName }) => (
              <Select.Option key={id} value={id}>
                {targetName}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="请选择指标达成情况"
            value={indexReachVal}
            style={{ width: 250 }}
            onChange={this.handleIndexReachChange}
          >
            {ReachList.map(({ key, value }) => (
              <Select.Option key={key} value={key}>
                {value}
              </Select.Option>
            ))}
          </Select>
          <div>
            <Tooltip placement="top" title={'重置'}>
              <Icon
                style={{ fontSize: '16px', margin: '8px', cursor: 'pointer' }}
                type="redo"
                onClick={this.handleRest}
              />
            </Tooltip>
          </div>
        </div>
        <div className={styles.table}>
          {tableList.length > 0 ? (
            <Table
              rowKey="index"
              columns={COLOUMNS}
              dataSource={this.handleTableData(tableList, indexBase)}
              bordered
              pagination={false}
            />
          ) : (
            <Empty />
          )}
        </div>
      </div>
    );
  }

  render() {
    const {
      targetResponsibility: { partGoalData = {} },
    } = this.props;
    const { isOpen, yearDateVal, radioType } = this.state;

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={BREADCRUMBLIST}
      >
        <div className={styles.container}>
          <div className={styles.selectArea}>
            <span>
              <DatePicker
                placeholder="请选择"
                disabledDate={this.handleDisabledDate}
                style={{ width: 300, marginBottom: 10 }}
                open={isOpen}
                value={yearDateVal}
                onOpenChange={s => this.handleOpenChange(s)}
                onChange={this.clearDateValue}
                onPanelChange={v => this.handlePanelChange(v)}
                format="YYYY年"
                mode="year"
              />
            </span>
            <span className={styles.radioBtn}>
              <Radio.Group
                defaultValue={radioType}
                buttonStyle="solid"
                onChange={this.handleRadioBtn}
              >
                <Radio.Button value="1">图表</Radio.Button>
                <Radio.Button value="2">列表</Radio.Button>
              </Radio.Group>
            </span>
            <div className={styles.reminder}>
              如果指标的考核结果未填写，则算未达标，请查看列表中指标未达标原因，到
              <span className={styles.extrude} onClick={this.hanldeLink}>
                目标责任制定实施
              </span>
              下完善考核结果
            </div>
          </div>

          {+radioType === 1 && partGoalData === null ? (
            <div className={styles.emptyArea}>
              当前尚未形成年度目标责任分析报表，本报表可查看上一年度目标分析结果
            </div>
          ) : (
            +radioType === 1 && <div className={styles.content}>{this.renderPicContent()}</div>
          )}
          {+radioType === 2 && partGoalData === null ? (
            <div className={styles.emptyArea}>
              当前尚未形成年度目标责任分析报表，本报表可查看上一年度目标分析结果
            </div>
          ) : (
            +radioType === 2 && <div className={styles.content}>{this.renderTableContent()}</div>
          )}
        </div>
      </PageHeaderLayout>
    );
  }
}
