import React, { Fragment, PureComponent } from 'react';
import { Button, DatePicker, Input, message, Modal, Select, TreeSelect } from 'antd';
import moment from 'moment';

import styles from './History.less';
import { AlarmCard, Tabs } from '../components/Components';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Group: ButtonGroup } = Button;
const { TextArea } = Input;

const rect = <span className={styles.rect} />;
const timeFormat = 'YYYY-MM-DD HH:mm';
const defaultRange = [moment().startOf('minute').subtract(5, 'minutes'), moment().startOf('minute')];
// const RANGE_LIMIT = 24 * 3600 * 1000;
const TYPES = ['SOS', '越界', '长时间逗留', '超员', '缺员'];
const TYPE_OPTIONS = TYPES.map((t, i) => <Option key={i} value={i + 1}>{t}</Option>);
const STATUS = ['待处理', '忽略', '已处理'];
const STATUS_OPTIONS = STATUS.map((s, i) => <Option key={i} value={i}>{s}</Option>);

export default class AlarmList extends PureComponent {
  state = {
    batch: false,
    searchValue: '',
    range: defaultRange,
    selectedArea: undefined,
    alarmType: undefined,
    alarmStatus: undefined,
    selectedCards: [],
    handleDesc: '',
    modalVisible: false,
  };

  componentDidMount() {
    const {position: { sectionTree } } = this.props;

    this.setState({ selectedArea: sectionTree[0].value });
    this.getAlarms();
  }

  submitId;

  getAlarms = () => {
    const { dispatch, companyId } = this.props;
    const { searchValue, range, selectedArea, alarmType, alarmStatus } = this.state;

    // const [startTime, endTime] = range.map(r => +r);
    const [startTime, endTime] = range.map(r => r.format('YYYY-MM-DD HH:mm:ss'));
    const payload = { startTime, endTime, type: alarmType, executeStatus: alarmStatus, rootAreaId: selectedArea, pageSize: 0, pageNum: 1, companyId };
    if (searchValue)
      payload.userName = searchValue;
    dispatch({
      type: 'personPosition/fetchInitAlarms',
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

  handleRangeChange = (range) => {
    this.setState({ range });
  }

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

  handleShowSubmit = (ids) => {
    this.submitId = Array.isArray(ids) ? ids.join(',') : ids;
    this.setState({ modalVisible: true });
  };

  handleShowMultiSubmit = e => {
    const { personPosition: { alarms } } = this.props;
    const { selectedCards } = this.state;
    // 将选中的并且是未处理的报警筛选处理
    const ids = alarms.filter((a, i) => selectedCards[i] && !+a.executeStatus);
    this.handleShowSubmit(ids);
  };

  handleHideSubmit = () => {
    this.setState({ modalVisible: false });
  };

  hanldeSubmit = (status) => {
    const { dispatch } = this.props;
    const { handleDesc } = this.state;
    dispatch({
      type: 'personPosition/handleAlarm',
      payload: { ids: this.submitId, executeDesc: handleDesc, executeStatus: status },
      callback: (code, msg) => {
        if (code === 200) {
          this.handleHideSubmit();
          this.setState({ handleDesc: '' });
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
      personPosition: { alarms },
      handleLabelClick,
    } = this.props;
    const { batch, searchValue, range, selectedArea, alarmType, alarmStatus, selectedCards, handleDesc, modalVisible } = this.state;

    let cards = '暂无信息';
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
        <Button ghost className={styles.footerBtn} onClick={e => this.hanldeSubmit(1)}>忽略</Button>
        <Button ghost className={styles.footerBtn} onClick={e => this.hanldeSubmit(2)}>提交</Button>
      </div>
    );

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <Tabs value={labelIndex} handleLabelClick={handleLabelClick} />
          <div className={styles.wrapper1}>
            <div className={styles.leftTop1}>
              <div className={styles.redCircle}>
                <div className={styles.circleNum}>5</div>
                <p className={styles.circleLabel}>待处理</p>
              </div>
              <div className={styles.blueCircle}>
                <div className={styles.circleNum}>1000</div>
                <p className={styles.circleLabel}>已处理</p>
              </div>
            </div>
            <div className={styles.leftMiddle1}>
              <h3 className={styles.chartTitle}>
                {rect}
                报警趋势图
              </h3>
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
                <Select
                  allowClear
                  mode="multiple"
                  className={styles.cardSelect1}
                  dropdownClassName={styles.dropdown}
                  value={alarmType}
                  placeholder="报警类型"
                  onChange={this.handleAlarmTypeChange}
                >
                  {TYPE_OPTIONS}
                </Select>
                <Select
                  allowClear
                  mode="multiple"
                  className={styles.cardSelect1}
                  dropdownClassName={styles.dropdown}
                  value={alarmStatus}
                  placeholder="报警状态"
                  onChange={this.handleAlarmStatusChange}
                >
                  {STATUS_OPTIONS}
                </Select>
              </div>
              <div className={styles.selectRow}>
                <TreeSelect
                  treeDefaultExpandAll
                  value={selectedArea}
                  className={styles.tree1}
                  treeData={sectionTree}
                  onChange={this.handleAreaChange}
                  dropdownClassName={styles.treeDropdown}
                />
                <RangePicker
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
                />
                <ButtonGroup className={styles.btns}>
                  <Button ghost className={styles.searchBtn1} onClick={this.getAlarms}>搜索</Button>
                  {batch
                    ? (
                    <Fragment>
                      <Button ghost className={styles.searchBtn1} onClick={this.handleShowMultiSubmit}>确定</Button>
                      <Button ghost className={styles.searchBtn1} onClick={this.hideBatch}>取消</Button>
                    </Fragment>
                    ) : <Button ghost className={styles.searchBtn1} onClick={this.handleBatch}>批量处理</Button>
                  }
                </ButtonGroup>
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
