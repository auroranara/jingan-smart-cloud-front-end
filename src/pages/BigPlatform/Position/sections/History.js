import React, { PureComponent } from 'react';
import { DatePicker, Select } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { mapMutations } from 'utils/utils';
import { Scroll } from 'react-transform-components';
import Ellipsis from '@/components/Ellipsis';
// 引入样式文件
import styles from './History.less';
import { Tabs, HistoryPlay } from '../components/Components';
import { getUserName } from '../utils';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 时间格式
const timeFormat = 'YYYY-MM-DD HH:mm';
// 默认范围
const defaultRange = [moment().startOf('minute').subtract(5, 'minutes'), moment().startOf('minute')];
const renderThumbHorizontal = ({ style }) => <div style={{ ...style, display: 'none' }} />;
const thumbStyle = { backgroundColor: 'rgb(0, 87, 169)', right: -2 };

/**
 * description: 历史轨迹
 */
@connect(({ position }) => ({ position }))
export default class History extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      range: defaultRange,
    };
    mapMutations(this, {
      namespace: 'position',
      types: [
        // 获取最新一条数据
        'fetchLatest',
        // 获取选中时间段数据
        'fetchData',
        // 获取区域树
        'fetchTree',
      ],
    });
  }

  // 上次选择的范围
  lastRange = defaultRange;

  componentDidMount() {
    const { dispatch, cardId, companyId } = this.props;
    dispatch({
      type: 'position/fetchAllCards',
      payload: { companyId },
    });

    // 获取区域树
    this.fetchTree({ companyId });

    if (cardId)
      this.init(cardId);
  }

  init = cardId => {
    // 获取最新一条数据
    this.fetchLatest({ cardId }, (response) => {
      if (response && response.code === 200 && response.data) {
        const { intime } = response.data;
        const minute = 60 * 1000;
        const queryEndTime = Math.ceil((intime) / minute) * minute;
        const queryStartTime = queryEndTime - minute * 5;
        const range = [moment(queryStartTime), moment(queryEndTime)];
        this.setState({ range });
        this.lastRange = range;
        // 获取列表
        this.getData(range, (response) => {
          if (response && response.code === 200) {
            this.topScroll && this.topScroll.scrollTop();
            this.bottomScroll && this.bottomScroll.scrollTop();
          }
        });
      }
    });
  };

  setHistoryPlayReference = (historyPlay) => {
    this.historyPlay = historyPlay;
  }

  setTopScrollReference = (topScroll) => {
    this.topScroll = topScroll && topScroll.dom;
  }


  setBottomScrollReference = (bottomScroll) => {
    this.bottomScroll = bottomScroll && bottomScroll.dom;
  }


  /**
   * 获取列表
   */
  getData = (range) => {
    const { cardId } = this.props;
    if (!cardId)
      return;
    const [queryStartTime, queryEndTime] = range;
    this.fetchData({
      cardId,
      queryStartTime: queryStartTime && +queryStartTime,
      queryEndTime: queryEndTime && +queryEndTime,
    });
  }

  /**
   * 时间选择change事件
   */
  handleChange = (range) => {
    this.setState({ range });
  }

  /**
   * 时间选择Ok事件
   */
  handleOk = (range) => {
    this.isOk = true;
    this.lastRange = range;
    this.getData(range);
    this.setState({ range });
  }

  /**
   * 时间选择OpenChange
   */
  handleOpenChange = (status) => {
    if (!status) {
      if (this.isOk) {
        this.isOk = false;
      }
      else {
        this.setState({ range: this.lastRange });
      }
    }
  }

  /**
   * 点击表格行
   */
  handleClickTableRow = (e) => {
    this.historyPlay.handleLocate({ currentTimeStamp: +e.currentTarget.getAttribute('intime') });
  }

  handleCardChange = value => {
    const { setCardId } = this.props;
    setCardId(value);
    this.init(value);
  };

  cardFilter = (inputValue, option) => {
    // console.log(inputValue, option);
    return option.props.children.includes(inputValue);
  };

  render() {
    const {
      labelIndex,
      cardId,
      position: { data: { areaDataHistories=[], locationDataHistories=[] }={}, tree={}, originalTree=[], cards },
      handleLabelClick,
    } = this.props;
    const { range } = this.state;
    const [ startTime, endTime ] = range;

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <Tabs value={labelIndex} handleLabelClick={handleLabelClick} />
          <div className={styles.wrapper}>
            <div className={styles.inner}>
              <div className={styles.leftTop}>
                <Select
                  showSearch
                  className={styles.cardSelect}
                  dropdownClassName={styles.dropdown}
                  value={cardId}
                  placeholder="请选择或搜索人员"
                  filterOption={this.cardFilter}
                  onChange={this.handleCardChange}
                >
                  {cards.map(card => <Option key={card.cardId} value={card.cardId}>{`${getUserName(card, true)}(${card.cardCode})`}</Option>)}
                </Select>
                <RangePicker
                  dropdownClassName={styles.rangePickerDropDown}
                  className={styles.rangePicker}
                  style={{ width: '100%' }}
                  showTime={{ format: 'HH:mm' }}
                  format={timeFormat}
                  placeholder={['开始时间', '结束时间']}
                  value={range}
                  onChange={this.handleChange}
                  onOk={this.handleOk}
                  onOpenChange={this.handleOpenChange}
                  allowClear={false}
                />
              </div>
              <div className={styles.leftMiddle}>
                <div className={styles.table}>
                  <div className={styles.th}>
                    <div className={styles.td}>开始时间</div>
                    <div className={styles.td}>结束时间</div>
                    <div className={styles.td}>区域楼层</div>
                  </div>
                  <div className={styles.tbody}>
                    <Scroll
                      ref={this.setTopScrollReference}
                      className={styles.scroll}
                      thumbStyle={thumbStyle}
                      renderThumbHorizontal={renderThumbHorizontal}
                    >
                      {areaDataHistories && areaDataHistories.length > 0 ? areaDataHistories.map(area => {
                        const { startTime: startTimeStamp, endTime: endTimeStamp, areaId, id } = area;
                        const changedStartTime = Math.max(startTimeStamp, startTime);
                        return (
                          <div className={styles.tr} key={id} intime={changedStartTime} onClick={this.handleClickTableRow}>
                            <div className={styles.td}>{moment(changedStartTime).format('HH:mm:ss')}</div>
                            <div className={styles.td}>{moment(Math.min(endTimeStamp, endTime)).format('HH:mm:ss')}</div>
                            <div className={styles.td}><Ellipsis lines={1} tooltip className={styles.ellipsis}>{tree[areaId] ? tree[areaId].fullName : '厂外'}</Ellipsis></div>
                          </div>
                        );
                      }) : <div className={styles.emptyTr}><div className={styles.td}>暂无数据</div></div>}
                    </Scroll>
                  </div>
                </div>
              </div>
              <div className={styles.leftBottom}>
                <div className={styles.table}>
                  <div className={styles.th}>
                    <div className={styles.td}>时间</div>
                    <div className={styles.td}>X坐标</div>
                    <div className={styles.td}>Y坐标</div>
                    <div className={styles.td}>Z坐标</div>
                  </div>
                  <div className={styles.tbody}>
                    <Scroll
                      ref={this.setBottomScrollReference}
                      className={styles.scroll}
                      thumbStyle={thumbStyle}
                      renderThumbHorizontal={renderThumbHorizontal}
                    >
                      {locationDataHistories && locationDataHistories.length > 0 ? locationDataHistories.map(location => {
                        const { xarea, yarea, zarea, intime, id } = location;
                        const changedInTime = Math.max(intime, startTime);
                        return (
                          <div className={styles.tr} key={id} intime={changedInTime} onClick={this.handleClickTableRow}>
                            <div className={styles.td}>{moment(changedInTime).format('HH:mm:ss')}</div>
                            <div className={styles.td}>{xarea}</div>
                            <div className={styles.td}>{yarea}</div>
                            <div className={styles.td}>{zarea}</div>
                          </div>
                        );
                      }) : <div className={styles.emptyTr}><div className={styles.td}>暂无数据</div></div>}
                    </Scroll>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <HistoryPlay
            ref={this.setHistoryPlayReference}
            tree={tree}
            originalTree={originalTree}
            data={locationDataHistories}
            startTime={startTime && +startTime}
            endTime={endTime && +endTime}
          />
        </div>
      </div>
    );
  }
}