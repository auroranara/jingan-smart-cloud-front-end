import React, { PureComponent } from 'react';
import { Button, DatePicker, Icon, Select, TreeSelect, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { mapMutations } from 'utils/utils';
import { Scroll } from 'react-transform-components';

import styles from './History.less';
import { Tabs, MultipleHistoryPlay } from '../components/Components';
import { getUserName } from '../utils';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 时间格式
const timeFormat = 'YYYY-MM-DD HH:mm';
// 默认范围
const defaultRange = [moment().startOf('minute').subtract(5, 'minutes'), moment().startOf('minute')];
const renderThumbHorizontal = ({ style }) => <div style={{ ...style, display: 'none' }} />;
const thumbStyle = { backgroundColor: 'rgb(0, 87, 169)', right: -2 };
const RANGE_LIMIT = 24 * 3600 * 1000;
const ALL = 'all';

/**
 * description: 历史轨迹
 */
@connect(({ position, loading }) => ({ position, loading: loading.effects['position/fetchData'] }))
export default class History extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      range: defaultRange,
      timeRange: defaultRange,
      selectedArea: undefined,
      selectedIds: [],
      highlighted: undefined,
      tableList: [],
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
        // 获取人员列表
        'fetchPeople',
        'fetchCards',
        // 保存
        'save',
      ],
    });
  }

  // 上次选择的范围
  lastRange = defaultRange;
  areaDataIds = [];
  lastSectionId = null;
  currentTime = 0;

  componentDidMount() {
    const {
      companyId,
      position: { originalTree },
    } = this.props;
    // 获取人员列表
    this.fetchPeople({ companyId });
    this.fetchCards({ companyId, pageNum: 1, pageSize: 0 });
    this.setState({ selectedArea: originalTree[0].id });
    // 获取区域树
    // this.fetchTree({ companyId }, response => {
    //   if (response && response.data && Array.isArray(response.data.list) && response.data.list.length)
    //     this.setState({ selectedArea: response.data.list[0].id });
    // });

    this.init();
  }

  init = () => {
    const { idType, userIds, cardIds } = this.props;
    if (!userIds.length && !cardIds.length)
      return;

    const params = +idType ? { cardId: cardIds.join(',') } : { userId: userIds.join(',') };
    // 获取最新一条数据
    this.fetchLatest(params, response => {
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
      else {
        this.save({
          data: {},
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
    // const { historyRecord: { id, isCardId }={} } = this.props;
    const { idType, userIds, cardIds } = this.props;
    const { selectedArea } = this.state;

    const ids = +idType ? { cardId: cardIds.length ? cardIds.join(',') : undefined } : { userId: userIds.length ? userIds.join(',') : undefined };
    const [queryStartTime, queryEndTime] = range;
    this.fetchData({
      ...ids,
      queryStartTime: queryStartTime && +queryStartTime,
      queryEndTime: queryEndTime && +queryEndTime,
      areaId: selectedArea,
      searchType: +idType ? 2 : 1,
      idType,
    }, (response, areaDataList) => {
      if (response && response.code === 200 && Array.isArray(areaDataList)) {
        const timeRange = areaDataList.reduce((prev, next) => {
          const [start, end] = prev;
          const { startTime, endTime } = next;
          prev[0] = Math.min(start, startTime);
          prev[1] = Math.max(end, endTime);
          return prev;
        }, [0, 0]);
        const areaDataIds = this.areaDataIds = areaDataList.map(({ cardId, userId }) => +idType ? cardId : userId);
        this.setState({
          selectedIds: areaDataIds,
          highlighted: areaDataIds.length > 1 ? ALL : areaDataIds[0],
          timeRange,
          tableList: this.getDataHistory(areaDataList),
        });
      }
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
    // this.getData(range);
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
  genClickTableRow = id => e => {
    this.setState({ selectedIds: id === ALL ? this.areaDataIds : [id], highlighted: id });
    // this.historyPlay.handleLocate({ currentTimeStamp: +e.currentTarget.getAttribute('intime') });
  }

  handleIdsChange = value => {
    // console.log(value);
    const { idType, setUserIds, setCardIds } = this.props;
    +idType ? setCardIds(value) : setUserIds(value);
  };

  handleAreaChange = value => {
    this.setState({ selectedArea: value });
  };

  clear = () => {
    const { setUserIds, setCardIds } = this.props;
    this.setState({
      selectedIds: [],
    });
    this.save({
      areaDataList: [],
    });
    setUserIds([]);
    setCardIds([]);
  };

  handleIdTypeChange = value => {
    const { setIdType } = this.props;
    setIdType(value);
    this.clear();
  };

  handleSearch = e => {
    const { range } = this.state;
    const [start, end] = range.map(m => +m);
    if (end - start > RANGE_LIMIT) {
      message.warn('选择的时间范围请限制在24小时以内');
      return;
    }
    this.getData(range);
  };

  getDataHistory = areaDataList => {
    // const { position: { areaDataList } } = this.props;
    const history = Array.from(areaDataList);
    if (areaDataList.length > 1)
      history.unshift({
        id: ALL,
        userName: '所有人',
        cardCode: '-',
      });
    return history;
  };

  getFullAreaName = areaId => {
    const { position: { tree } } = this.props;
    return tree[areaId] ? tree[areaId].fullName : '厂外';
  };

  onTabClick = i => {
    const { handleLabelClick } = this.props;
    handleLabelClick(i);
    this.save({
      areaDataList: [],
    });
  };

  setSectionAndTime = (sectionId, timestamp) => {
    this.lastSectionId = sectionId;
    this.lastTimeStamp = timestamp;
    this.setState({ tableList: this.filterTableList(sectionId, timestamp) });
  };

  // 筛选出areaDataList中在指定区域指定时间戳的人员
  filterTableList = (sectionId, timestamp) => {
    const { position: { tree, areaDataList } } = this.props;
    // areaDataList数组中的areaId为根节点的id
    return areaDataList.filter(({ areaId, startTime, endTime, children }) => {
      // 所选区域为根节点时
      if (sectionId === areaId && startTime <= timestamp && timestamp <= endTime)
          return true;
      // 所选区域为非根节点时，查看其children
      else if(Array.isArray(children)) {
        const childIds = tree[sectionId].descendant;
        for (const { areaId, startTime, endTime } of children) {
          if (childIds.includes(areaId) && startTime <= timestamp && timestamp <= endTime)
            return true;
        }
      }
      return false;
    });
  };

  render() {
    const {
      loading,
      labelIndex,
      idType,
      userIds,
      cardIds,
      position: {
        // areaDataMap,
        // areaDataList,
        historyIdMap,
        data: {
          // areaDataHistories=[],
          locationDataHistories=[],
        }={},
        tree={},
        originalTree=[],
        sectionTree,
        people,
        cards,
      },
      // handleLabelClick,
    } = this.props;
    const { range, timeRange, selectedArea, selectedIds, highlighted, tableList } = this.state;
    const [ startTimeStamp, endTimeStamp ] = timeRange;

    // const areaDataHistories = this.getDataHistory();
    const historyTree = originalTree.find(({ id }) => id === selectedArea);
    const sectionTreeList = sectionTree.map(sec => ({ ...sec, children: [] }));
    const areaDataHistories = tableList;
    const isCard = +idType; // 0 人   1 卡
    const options = isCard
      ? cards.map(({ id, code }) => <Option key={id} value={id}>{code}</Option>)
      : people.map(({ user_id, user_name }) => <Option key={user_id} value={user_id}>{user_name}</Option>);
    // console.log(areaDataHistories);

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <Tabs value={labelIndex} handleLabelClick={this.onTabClick} />
          <div className={styles.wrapper}>
            <div className={styles.inner}>
              <div className={styles.leftTop}>
                <div className={styles.treeContainer}>
                  <TreeSelect
                    // allowClear
                    treeDefaultExpandAll
                    value={selectedArea}
                    className={styles.tree}
                    treeData={sectionTreeList}
                    onChange={this.handleAreaChange}
                    dropdownClassName={styles.treeDropdown}
                  />
                </div>
                <div className={styles.selects}>
                  <Select
                    disabled={loading}
                    defaultValue="0"
                    value={idType}
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
                    value={isCard ? cardIds : userIds}
                    placeholder="请选择或搜索人员/卡号"
                    onChange={this.handleIdsChange}
                  >
                    {options}
                  </Select>
                </div>
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
                <Button className={styles.searchBtn} onClick={this.handleSearch}>搜索</Button>
              </div>
              <div className={styles.leftMiddle}>
                <div className={styles.table}>
                  <div className={styles.th}>
                    <div className={styles.td}>名字</div>
                    <div className={styles.td}>卡号</div>
                    <div className={styles.td}>电话</div>
                    <div className={styles.td}>部门</div>
                    <div className={styles.td}>操作</div>
                  </div>
                  <div className={styles.tbody}>
                    <Scroll
                      ref={this.setTopScrollReference}
                      className={styles.scroll}
                      thumbStyle={thumbStyle}
                      renderThumbHorizontal={renderThumbHorizontal}
                    >
                      {areaDataHistories && areaDataHistories.length > 0 ? areaDataHistories.map(area => {
                        const { id, cardCode, department } = area;
                        const onClick = this.genClickTableRow(id);
                        return (
                          <div className={styles[`tr${id === highlighted ? 1 : ''}`]} key={id} onClick={onClick}>
                            <div className={styles.td}>{getUserName(area)}</div>
                            <div className={styles.td}>{cardCode}</div>
                            <div className={styles.td}>{'phone'}</div>
                            <div className={styles.td}>{department || '-'}</div>
                            <div className={styles.td}>{id === 'all' ? '-' : '跟踪'}</div>
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
          <MultipleHistoryPlay
            ref={this.setHistoryPlayReference}
            tree={tree}
            originalTree={historyTree}
            idMap={historyIdMap}
            ids={selectedIds}
            startTime={startTimeStamp && +startTimeStamp}
            endTime={endTimeStamp && +endTimeStamp}
            onChange={this.setSectionAndTime}
          />
        </div>
      </div>
    );
  }
}
