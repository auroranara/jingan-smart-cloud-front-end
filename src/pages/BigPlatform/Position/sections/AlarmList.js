import React, { Fragment, PureComponent } from 'react';
import { Button, DatePicker, Input, message, Modal, Select, TimePicker, TreeSelect } from 'antd';
import moment from 'moment';

import styles from './History.less';
import { AlarmCard, EmptyMsg, Tabs } from '../components/Components';
import { ChartBar, ChartLine, GraphSwitch } from '@/pages/BigPlatform/NewFireControl/components/Components';

// const { RangePicker } = DatePicker;
const { Option } = Select;
const { Group: ButtonGroup } = Button;
const { TextArea } = Input;

const rect = <span className={styles.rect} />;
const TIME_FORMAT = 'HH:mm';
// const TYPES = ['SOS', '越界', '长时间逗留', '超员', '缺员'];
// const TYPE_OPTIONS = TYPES.map((t, i) => <Option key={i} value={i + 1}>{t}</Option>);
const STATUS = { 0:'待处理', 2:'已处理' };
const STATUS_OPTIONS = Object.entries(STATUS).map(([n, s]) => <Option key={n} value={n}>{s}</Option>);
const GRAPH_STYLE = { position: 'absolute', top: 15, right: 15 };
const CHART_STYLE = { height: 320 };

function Circle(props) {
  const { num, desc, onClick, ...restProps } = props;
  return (
    <div className={styles.blueCircle} onClick={onClick} {...restProps}>
      <div className={styles.circleNum}>{num}</div>
      <p className={styles.circleLabel}>{desc}</p>
    </div>
  );
}

export default class AlarmList extends PureComponent {
  state = {
    graph: 0,
    batch: false,
    searchValue: '',
    date: moment(),
    startTime: moment().startOf('day'),
    endTime: moment().endOf('day'),
    selectedArea: undefined,
    alarmType: undefined,
    alarmStatus: undefined,
    selectedCards: [],
    handleDesc: '',
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch, companyId, position: { sectionTree } } = this.props;
    // this.setState({ selectedArea: sectionTree[0].value });

    this.getAlarms();
    // dispatch({ type: 'personPosition/fetchStatusCount', payload: { companyId } });
    dispatch({ type: 'personPosition/fetchStatusCountList', payload: { companyId, startTime: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss') } });
    dispatch({ type: 'personPosition/fetchMonthCount', payload: { companyId } });
  }

  submitId;

  handleSwitch = i => {
    this.setState({ graph: i });
  };

  getAlarms = type => {
    const { dispatch, companyId } = this.props;
    const { searchValue, date, startTime, endTime, selectedArea, alarmType, alarmStatus } = this.state;
    const typeList = !alarmType || !alarmType.length ? undefined : alarmType.join(',');

    const day = date.format('YYYY-MM-DD');
    const start = `${day} ${startTime.format('HH:mm:ss')}`;
    const end = `${day} ${endTime.format('HH:mm:ss')}`;
    const payload = { startTime: start, endTime: end, typeList, executeStatus: alarmStatus, pageSize: 0, pageNum: 1, companyId, type };
    if (searchValue)
      payload.userName = searchValue;
    if (selectedArea)
      payload.rootAreaId = selectedArea;
    dispatch({
      type: 'personPosition/fetchInitAlarms',
      alarmType: 1,
      payload,
      callback: list => {
        this.setState({ selectedCards: Array(list.length).fill(false) });
      },
    });
  };

  handleInputChange = e => {
    this.setState({ searchValue: e.target.value });
  };

  handleAlarmTypeChange = value => {
    this.setState({ alarmType: value });
  };

  handleAlarmStatusChange = value => {
    this.setState({ alarmStatus: value });
  };

  handleAreaChange = value => {
    this.setState({ selectedArea: value });
  };

  handleDateChange = date => {
    this.setState({ date });
  };

  handleStartChange = time => {
    this.setState({ startTime: time });
  };

  handleEndChange = time => {
    this.setState({ endTime: time });
  };

  genHandleBlueCardClick = type => e => {
    this.setState({ date: moment(), startTime: moment().startOf('day'), endTime: moment().endOf('day') }, () => {
      this.getAlarms(type);
    });
  };

  genHandleSelectCard = index => e => {
    this.setState(({ selectedCards }) => ({ selectedCards: selectedCards.map((b, i) => i === index ? !b : b) }));
  };

  handleBatch = () => {
    this.setState({ batch: true });
  };

  hideBatch = () => {
    this.setState({ batch: false });
  }

  handleTextChange = e => {
    this.setState({ handleDesc: e.target.value });
  };

  handleShowSubmit = ids => {
    if (!ids.length) {
      message.warn('请先选择一个警报');
      return;
    }
    // console.log(ids);
    this.submitId = Array.isArray(ids) ? ids.join(',') : ids;
    this.setState({ modalVisible: true });
  };

  handleShowMultiSubmit = e => {
    const { personPosition: { alarms1: alarms } } = this.props;
    const { selectedCards } = this.state;
    // 将选中的并且是未处理的报警筛选处理
    const ids = alarms.filter((a, i) => selectedCards[i] && !+a.executeStatus).map(({ id }) => id);
    this.handleShowSubmit(ids);
  };

  handleHideSubmit = () => {
    this.setState({ modalVisible: false });
  };

  handleSubmit = (status) => {
    const { dispatch } = this.props;
    const { handleDesc } = this.state;
    dispatch({
      type: 'personPosition/handleAlarm',
      payload: { ids: this.submitId, executeStatus: status, executeDesc: status === 1 ? '忽略' : handleDesc },
      callback: (code, msg) => {
        if (code === 200) {
          this.handleHideSubmit();
          this.setState({ batch: false, handleDesc: '' });
          message.success(msg);
          this.getAlarms();
        }
        else
          message.error(msg);
      },
    });
  };

  render() {
    const {
      labelIndex,
      areaInfo,
      position: { sectionTree },
      personPosition: { alarms1: alarms, statusCountList, monthCount },
      handleLabelClick,
    } = this.props;
    const {
      graph,
      batch,
      searchValue,
      date,
      startTime,
      endTime,
      selectedArea,
      // alarmType,
      alarmStatus,
      selectedCards,
      handleDesc,
      modalVisible,
    } = this.state;

    const list = Array.isArray(monthCount) ? monthCount.map(({ warningMonth, warningNum }) => ({ name: warningMonth, value: warningNum })) : [];
    // const { waitExecuteNum=0, executeNum=0 } = statusCount || {};
    const personAlert = statusCountList.slice(0, 2);
    const sectionAlert = statusCountList.slice(2, 5);
    let cards = <EmptyMsg />;
    if (alarms.length)
      cards = alarms.map((item, i) => (
        <AlarmCard
          key={item.id}
          batch={batch}
          areaInfo={areaInfo}
          checked={selectedCards[i]}
          data={item}
          onClick={batch ? this.genHandleSelectCard(i) : null}
          handleShowSubmit={this.handleShowSubmit}
        />
      ));

    const footer = (
      <div className={styles.footerBtns}>
        <Button ghost className={styles.footerBtn} onClick={e => this.handleSubmit(1)}>忽略</Button>
        <Button ghost className={styles.footerBtn} onClick={e => this.handleSubmit(2)}>提交</Button>
      </div>
    );

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <Tabs value={labelIndex} handleLabelClick={handleLabelClick} />
          <div className={styles.wrapper1}>
            <h3 className={styles.chartTitle}>
              {rect}
              今日报警统计
            </h3>
            <div className={styles.leftTop1}>
              <div className={styles.leftTop1Inner}>
                <div className={styles.leftTopRow}>
                  {personAlert.map(({ type, typeName, typeCount }) => (
                    <Circle
                      key={typeName}
                      num={typeCount}
                      desc={typeName}
                      style={{ cursor: 1 ? 'pointer' : 'auto' }}
                      onClick={1 ? this.genHandleBlueCardClick(type) : null}
                    />
                  ))}
                </div>
                <div className={styles.leftTopRow}>
                  {sectionAlert.map(({ type, typeName, typeCount }) => (
                    <Circle
                      key={typeName}
                      num={typeCount}
                      desc={typeName}
                      style={{ cursor: typeCount ? 'pointer' : 'auto' }}
                      onClick={type ? this.genHandleBlueCardClick(type) : null}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.leftMiddle1}>
              <h3 className={styles.chartTitle}>
                {rect}
                报警趋势图
                <span className={styles.twelve}>(近12个月)</span>
                <GraphSwitch handleSwitch={this.handleSwitch} style={GRAPH_STYLE} />
              </h3>
              <div className={styles.graph}>
                <div className={styles.graphContainer}>
                  {graph ? <ChartBar data={list} chartStyle={CHART_STYLE} /> : <ChartLine data={list} chartStyle={CHART_STYLE} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rightContainer}>
            <div className={styles.rightTop}>
              <div className={styles.selectRow}>
                <div className={styles.selects1}>
                  {/* <Select
                    defaultValue="0"
                    value="0"
                    className={styles.select1}
                    dropdownClassName={styles.dropdown}
                    onChange={this.handleIdTypeChange}
                  >
                    <Option key="0" value="0">人员</Option>
                    <Option key="1" value="1">卡号</Option>
                  </Select>
                  <Select
                    allowClear
                    showSearch
                    mode="multiple"
                    className={styles.cardSelect}
                    dropdownClassName={styles.dropdown}
                    // value={0}
                    placeholder="请选择或搜索人员/卡号"
                    onChange={this.handleIdsChange}
                  ></Select> */}
                  <Input
                    value={searchValue}
                    className={styles.searchInput}
                    placeholder="请输入人员或卡号"
                    onChange={this.handleInputChange}
                  />
                </div>
                {/* <Select
                  allowClear
                  mode="multiple"
                  className={styles.cardSelect1}
                  dropdownClassName={styles.dropdown}
                  value={alarmType}
                  optionFilterProp="children"
                  placeholder="请选择报警类型"
                  onChange={this.handleAlarmTypeChange}
                >
                  {TYPE_OPTIONS}
                </Select> */}
                <Select
                  allowClear
                  className={styles.cardSelect1}
                  dropdownClassName={styles.dropdown}
                  value={alarmStatus}
                  optionFilterProp="children"
                  placeholder="请选择报警状态"
                  onChange={this.handleAlarmStatusChange}
                >
                  {STATUS_OPTIONS}
                </Select>
                <TreeSelect
                  allowClear
                  treeDefaultExpandAll
                  value={selectedArea}
                  className={styles.tree1}
                  treeData={sectionTree}
                  placeholder="请选择区域"
                  onChange={this.handleAreaChange}
                  dropdownClassName={styles.treeDropdown}
                />
              </div>
              <div className={styles.selectRow}>
                {/* <TreeSelect
                  allowClear
                  treeDefaultExpandAll
                  value={selectedArea}
                  className={styles.tree1}
                  treeData={sectionTree}
                  placeholder="请选择区域"
                  onChange={this.handleAreaChange}
                  dropdownClassName={styles.treeDropdown}
                /> */}
                {/* <RangePicker
                  style={{ width: '30%' }}
                  dropdownClassName={styles.rangePickerDropDown}
                  className={styles.rangePicker1}
                  showTime={{ format: 'HH:mm' }}
                  format={timeFormat}
                  placeholder={['开始时间', '结束时间']}
                  value={range}
                  onChange={this.handleRangeChange}
                  onOk={this.handleOk}
                  onOpenChange={this.handleOpenChange}
                  allowClear={false}
                /> */}
                <div className={styles.rowRight}>
                  <div className={styles.times}>
                    <DatePicker
                      style={{ width: '38%' }}
                      className={styles.datePicker}
                      dropdownClassName={styles.datePickerDropdown}
                      // format="YYYY-MM-DD"
                      value={date}
                      allowClear={false}
                      onChange={this.handleDateChange}
                    />
                    <TimePicker
                      className={styles.timePicker}
                      popupClassName={styles.timeDropdown}
                      format={TIME_FORMAT}
                      value={startTime}
                      placeholder="开始时间"
                      allowClear={false}
                      onChange={this.handleStartChange}
                    />
                    ~
                    <TimePicker
                      className={styles.timePicker}
                      popupClassName={styles.timeDropdown}
                      format={TIME_FORMAT}
                      value={endTime}
                      placeholder="结束时间"
                      allowClear={false}
                      onChange={this.handleEndChange}
                    />
                  </div>
                  <ButtonGroup className={styles.btns}>
                    <Button ghost className={styles.searchBtn1} onClick={e => this.getAlarms()}>搜索</Button>
                    {/* {batch
                      ? (
                      <Fragment>
                        <Button ghost className={styles.searchBtn1} onClick={this.handleShowMultiSubmit}>确定</Button>
                        <Button ghost className={styles.searchBtn1} onClick={this.hideBatch}>取消</Button>
                      </Fragment>
                      ) : <Button ghost className={styles.searchBtn1} onClick={this.handleBatch}>批量处理</Button>
                    } */}
                  </ButtonGroup>
                </div>
              </div>
            </div>
            <div className={styles.rightBottom}>
              {cards}
            </div>
          </div>
        </div>
        <Modal
          title="报警处理"
          centered
          visible={modalVisible}
          onCancel={this.handleHideSubmit}
          footer={footer}
          wrapClassName={styles.modal}
        >
          <TextArea
            rows={8}
            value={handleDesc}
            onChange={this.handleTextChange}
          />
        </Modal>
      </div>
    );
  }
}
