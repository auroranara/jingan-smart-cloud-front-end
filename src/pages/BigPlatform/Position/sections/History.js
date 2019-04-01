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
const defaultRange = [moment().startOf('minute').subtract(24, 'hours'), moment().startOf('minute')];
const renderThumbHorizontal = ({ style }) => <div style={{ ...style, display: 'none' }} />;
const thumbStyle = { backgroundColor: 'rgb(0, 87, 169)', right: -2 };
// 限制1天
const RANGE_LIMIT = 24 * 60 * 60 * 1000;
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
      // 区域搜索框当前选中的区域id
      selectedAreaId: undefined,
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

  componentDidMount() {
    const {
      position: { originalTree },
      // idType, // 搜索类型，1是卡片，0是人员
      // userIds,
      // cardIds,
      // setUserIds,
    } = this.props;
    // 默认选中最顶层的第一个区域
    this.setState({ selectedAreaId: originalTree[0].id }, () => {
      const { range } = this.state;
      this.getData(range);
    });
    // 如果是从目标跟踪过来的，则根据跟踪的人员初始化数据
    // if (userIds.length || cardIds.length) {
    //   const params = +idType ? { cardId: cardIds[0] } : { userId: userIds[0] };
    //   // 获取最新一条数据的进入时间作为结束时间，往前推5分钟作为开始时间
    //   this.fetchLatest(params, response => {
    //     if (response && response.code === 200 && response.data) {
    //       const { intime } = response.data;
    //       const minute = 60 * 1000;
    //       const queryEndTime = Math.ceil((intime) / minute) * minute;
    //       const queryStartTime = queryEndTime - minute * 5;
    //       const range = [moment(queryStartTime), moment(queryEndTime)];
    //       this.setState({ range });
    //       this.lastRange = range;
    //       // 获取列表
    //       this.getData(range);
    //     }
    //   });
    // }
  }

  componentWillUnmount() {
    // 组件销毁前清空model中的数据
    this.save({
      areaDataList: [],
      historyIdMap: {},
      timeRange: [moment().startOf('minute').subtract(24, 'hours'), moment().startOf('minute')],
      selectedIds: [],
      selectedTableRow: ALL,
      selectedIdType: 0,
    });
  }

  setTopScrollReference = (topScroll) => {
    this.topScroll = topScroll && topScroll.dom;
  }

  /**
   * 获取列表
   */
  getData = (range) => {
    const { idType, userIds, cardIds } = this.props;
    const { selectedAreaId } = this.state;
    const [queryStartTime, queryEndTime] = range;
    this.fetchData({
      cardId: cardIds.join(',') || undefined, // 搜索的卡片id
      userId: userIds.join(',') || undefined, // 搜索的人员id
      queryStartTime: queryStartTime && +queryStartTime, // 开始时间
      queryEndTime: queryEndTime && +queryEndTime, // 结束时间
      areaId: selectedAreaId, // 区域id
      searchType: +idType ? 2 : 1, // 搜索类型，人员或卡片
      idType,
    }, (response) => {
      if (response && response.code === 200) {
        this.topScroll && this.topScroll.scrollTop();
      }
      else {
        message.error('获取数据失败，请稍后重试！');
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
  handleClickTableRow = id => {
    const { position: { selectedTableRow, historyIdMap } } = this.props;
    // 如果点击的是同一行，则不做任何操作
    if (id === selectedTableRow) {
      return;
    }
    this.save({ selectedIds: id === ALL ? Object.keys(historyIdMap) : [id], selectedTableRow: id });
  }

  /**
   * 修改搜索id
   */
  handleIdsChange = ids => {
    const { idType, setUserIds, setCardIds } = this.props;
    +idType ? setCardIds(ids) : setUserIds(ids);
  };

  /**
   * 修改选中区域
   */
  handleAreaChange = selectedAreaId => {
    this.setState({ selectedAreaId });
  };

  /**
   * 修改搜索类型
   */
  handleIdTypeChange = idType => {
    const { setIdType, setUserIds, setCardIds } = this.props;
    setIdType(idType);
    setUserIds([]);
    setCardIds([]);
  };

  /**
   * 搜索按钮点击事件
   */
  handleSearch = e => {
    const { range } = this.state;
    const [start, end] = range.map(m => +m);
    if (end - start > RANGE_LIMIT) {
      message.warn('选择的时间范围请限制在24小时以内');
    }
    else {
      this.getData(range);
    }
  };

  /**
   * 切换tab
   */
  onTabClick = i => {
    const { handleLabelClick, setSelectedCard } = this.props;
    // 标签页切换时，将目标追踪中的选中的卡片设为undefined
    setSelectedCard();
    handleLabelClick(i);
  };

  genHandleTrack = (cardId, userId) => e => {
    e.stopPropagation();
    const { dispatch, companyId, handleLabelClick, setSelectedCard, position: { selectedIdType } } = this.props;
    const isCardId = +selectedIdType;
    const prop = isCardId ? 'cardId' : 'userId';
    const id = isCardId ? cardId : userId;
    // 先查看跟踪的目标是否可以跟踪
    dispatch({
      type: 'personPosition/fetchInitialPositions',
      payload: { companyId },
      callback: list => {
        const person = list.find(({ [prop]: pId }) => pId === id);
        // console.log(selectedIdType, isCardId, id, person);
        if (!person || !person.areaId) {
          message.warn('目标不在厂区内，无法追踪！');
          return;
        }
        const { cardId, userId } = person;
        const cId = isCardId ? cardId : undefined;
        const uId = isCardId ? undefined : userId;
        setSelectedCard(cId, uId);
        handleLabelClick(1);
      },
    });
  };

  // 筛选出areaDataList中在指定区域指定时间戳的人员
  filterTableList = (currentDataList) => {
    // console.log(currentDataList);
    // console.log(areaDataList);
    // areaDataList数组中的areaId为根节点的id
    this.setState({ tableList: currentDataList });
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
        tree={},
        originalTree=[],
        sectionTree,
        people,
        cards,
        timeRange,
        selectedIds,
        selectedTableRow,
        selectedIdType,
      },
      // handleLabelClick,
    } = this.props;
    const { range, selectedAreaId, tableList } = this.state;
    const [ startTimeStamp, endTimeStamp ] = timeRange;

    const historyTree = originalTree.find(({ id }) => id === selectedAreaId);
    const sectionTreeList = sectionTree.map(sec => ({ ...sec, children: [] }));
    const isCard = +idType; // 0 人   1 卡
    const options = isCard
      ? cards.map(({ id, code }) => <Option key={id} value={id}>{code}</Option>)
      : people.map(({ user_id, user_name }) => <Option key={user_id} value={user_id}>{user_name}</Option>);

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <Tabs value={labelIndex} handleLabelClick={this.onTabClick} />
          <div className={styles.wrapper}>
            <div className={styles.inner}>
              <div className={styles.leftTop}>
                <div className={styles.selects}>
                  <Select
                    defaultValue="0"
                    value={idType}
                    className={styles.select1}
                    dropdownClassName={styles.dropdown}
                    onChange={this.handleIdTypeChange}
                  >
                    <Option key="0" value="0">人员</Option>
                    <Option key="1" value="1">卡号</Option>
                  </Select>
                  <div className={styles.treeContainer}>
                    <TreeSelect
                      // allowClear
                      treeDefaultExpandAll
                      value={selectedAreaId}
                      className={styles.tree}
                      treeData={sectionTreeList}
                      onChange={this.handleAreaChange}
                      dropdownClassName={styles.treeDropdown}
                    />
                  </div>
                </div>
                <Select
                  allowClear
                  showSearch
                  mode="multiple"
                  className={styles.cardSelect}
                  dropdownClassName={styles.dropdown}
                  value={isCard ? cardIds : userIds}
                  placeholder="请选择或搜索人员/卡号"
                  onChange={this.handleIdsChange}
                  optionFilterProp="children"
                >
                  {options}
                </Select>
                {/* <div className={styles.selects}>
                  <Select
                    // disabled={loading}
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
                    optionFilterProp="children"
                  >
                    {options}
                  </Select>
                </div> */}
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
                      {/* tableList && tableList.length > 0 && */ (
                        <div className={styles[`tr${selectedTableRow === ALL ? 1 : ''}`]} key={ALL} onClick={(e) => {this.handleClickTableRow(ALL, e)}}>
                          <div className={styles.td}>所有人</div>
                          <div className={styles.td}>-</div>
                          <div className={styles.td}>-</div>
                          <div className={styles.td}>-</div>
                          <div className={styles.td}>-</div>
                        </div>
                      )}
                      {tableList && tableList.length > 0 && tableList.map(area => {
                        const { cardId, cardType, userId, cardCode, phoneNumber, visitorPhone, departmentName } = area;
                        const id = +selectedIdType ? cardId : userId;
                        const phone = +cardType ? visitorPhone : phoneNumber;
                        return (
                          <div className={styles[`tr${selectedTableRow === id ? 1 : ''}`]} key={id} onClick={(e) => {this.handleClickTableRow(id, e)}}>
                            <div className={styles.td}>{getUserName(area)}</div>
                            <div className={styles.td}>{cardCode}</div>
                            <div className={styles.td}>{phone || '-'}</div>
                            <div className={styles.td}>{departmentName || '-'}</div>
                            <div className={styles.td2} onClick={this.genHandleTrack(cardId, userId)}>追踪</div>
                          </div>
                        );
                      })/*  : <div className={styles.emptyTr}><div className={styles.td}>暂无数据</div></div> */}
                    </Scroll>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <MultipleHistoryPlay
            tree={tree}
            top={historyTree}
            idMap={historyIdMap}
            ids={selectedIds}
            startTime={startTimeStamp && +startTimeStamp}
            endTime={endTimeStamp && +endTimeStamp}
            onChange={this.filterTableList}
            selectedTableRow={selectedTableRow}
          />
        </div>
      </div>
    );
  }
}
