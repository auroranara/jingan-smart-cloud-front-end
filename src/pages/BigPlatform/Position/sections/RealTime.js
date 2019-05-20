import React, { PureComponent } from 'react';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import { stringify } from 'qs';
import moment from 'moment';
import { message, notification } from 'antd';
import styles from './RealTime.less';
import { AlarmHandle, AlarmMsg, MapInfo, PersonInfo, Tabs, VideoPlay } from '../components/Components';
import { AlarmDrawer, CardList, CardSelected, LeafletMap, LowPowerDrawer, PersonDrawer, SectionList } from './Components';
import { genTreeList, getAreaChangeMap, getAreaInfo, getPersonInfoItem, getAlarmItem, getAlarmDesc, handleOriginMovingCards } from '../utils';

const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

const SOS_TYPE = 1;
// const DELAY = 6000;

const LOCATION_MESSAGE_TYPE = "1";
const AREA_CHANGE_TYPE = "2";
const WARNING_TYPE = "3";
const AREA_STATUS_TYPE = "4";
const RE_WARNING_TYPE = "5";

export default class RealTime extends PureComponent {
  state = {
    alarmId: undefined, // 警报id
    areaId: undefined, // 地图显示的areaId，即当前真实areaId为多层建筑时，areaId设置为其父节点
    highlightedAreaId: undefined, // 高亮的区域
    beaconId: undefined, // 信标id
    cardId: undefined, // 选中的人员id
    mapBackgroundUrl:undefined,
    alarmMsgVisible: false, // 报警信息小弹框
    alarmHandleVisible: false, // 报警处理弹框
    personInfoVisible: false, // 人员信息小弹框
    videoVisible: false, // 视频弹框
    videoKeyId: '',
    videoKeyList: [],
    showSOSAlarm: false, // 报警列表中显示sos的报警
    alarmDrawerVisible: false, // 报警列表抽屉
    lowPowerDrawerVisible: false, // 低电量报警抽屉
    personDrawerVisible: false, // 人员列表抽屉
    // useCardIdHandleAlarm: undefined, // 当sos存在时，又在报警列表找不到时，标记为sos对应的cardId，使用另外一个接口
    expandedRowKeys: [], // SectionList组件中的展开的树节点
    movingCards: [], // 带有不断变化的x，y的卡片
    sectionListClearAreaId: undefined, // 清除列表的列表树
  };

  originMovingCards = []; // 缓存所有卡片的初始位置，并实时更新状态

  componentDidMount() {
    const { dispatch, companyId, setAreaInfoCache } = this.props;

    this.connectWebSocket();
    this.fetchSectionTree(list => {
      const { areaId } = this.state;
      const areaInfo = this.areaInfo = getAreaInfo(list);
      setAreaInfoCache(areaInfo);
      this.setTableExpandedRowKeys(Object.keys(areaInfo).filter(prop => prop !== 'null' && prop !== 'undefined'));
      // console.log(this.areaInfo);
      if (list.length) {
        const root = list[0];
        const { id } = root;
        const state = { areaId: id, mapBackgroundUrl: root.mapPhoto.url, sectionListClearAreaId: id };
        // 如果从历史轨迹里点追踪进入当前组件，则areaId可能已存在，若存在，则用，不存在则使用根节点
        if (areaId)
          state.areaId = areaId;
        this.setState(state);
      }
    });
    dispatch({
      type: 'personPosition/fetchInitialPositions',
      payload: { companyId },
      callback: list => {
        // 初始化时，selectedCardId或selectedUserId某一个已经存在则为从历史轨迹中点击跟踪时进入
        const { selectedCardId, selectedUserId, setSelectedCard } = this.props;
        if (!selectedCardId && !selectedUserId)
          return;
        // 从历史轨迹中进入时，只会传一个值，哪个有，就根据哪个判断
        const isUserId = !!selectedUserId;
        const person = list.find(({ cardId, userId }) => isUserId ? userId === selectedUserId : cardId === selectedCardId);
        if (!person)
          return;
        const { cardId, userId, areaId } = person;
        // console.log(person);
        this.setAreaId(areaId);
        setSelectedCard(cardId, userId);
      },
    });
    dispatch({
      type: 'personPosition/fetchInitAlarms',
      payload: { companyId, showStatus: 1, pageSize: 0, pageNum: 1, executeStatus: 0 },
    });
    dispatch({ type: 'personPosition/fetchBeacons', payload: { companyId, pageSize: 0, pageNum: 1 } });
    // 获取企业信息
    dispatch({
      type: 'user/fetchCurrent',
    });

    // this.treeTimer = setInterval(() => {
    //   this.fetchSectionTree();
    // }, DELAY);
    // setTimeout(() => this.showNotification({}), 3000);

    this.getServerTime();
  }

  componentWillUnmount() {
    const { personPosition: { alarms } } = this.props;
    const ws = this.ws;
    ws && ws.close();
    clearInterval(this.treeTimer);
    alarms.forEach(({ id }) => notification.close(id)); // 当从实时监控或目标跟踪标签页切换到历史轨迹或报警查看标签页时，关闭所有通知
  }

  ws = null;
  areaInfo = {};
  treeTimer = null;
  zeroTimestamp = 0; // 开始计时时的零点时间戳

  handleSectionListClearTreeChange = value => {
    this.setState({ sectionListClearAreaId: value });
  };

  // 获取服务器时间，计算当前时间到00:00的时间，挂一个定时器，由于计时器不一定准，所以到时候再获取一次服务器时间，若此时已经过了零点
  // 则重新获取一遍sectionTree，若此时还未过零点，重复上述操作
  getServerTime = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personPosition/fetchServerTime',
      callback: (code, time) => {
        if (code !== 200) {
          setTimeout(this.getServerTime, 2000);
          return;
        }
        // 初始化zeroTimestamp，只在第一次调用时执行
        if (!this.zeroTimestamp)
          this.zeroTimestamp = +moment(time).endOf('day');
        // 服务器时间离第一次获取服务器时间的当天时间的时间差
        let delay = this.zeroTimestamp - time;
        // 时间差小于零，则已经过了那天，更新零点时间戳，并重新获取区域树来刷新出入人次
        if (delay <= 0) {
          this.zeroTimestamp = +moment(time).endOf('day');
          this.fetchSectionTree();
          delay = this.zeroTimestamp - time;
        }
        setTimeout(this.getServerTime, delay);
      },
    });
  };

  // 判定当前页面是否是目标追踪
  isTargetTrack = () => {
    // labelIndex 0 实时监控 1 目标追踪
    const { labelIndex } = this.props;
    return !!labelIndex;
  };

  fetchSectionTree = callback => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'personPosition/fetchSectionTree',
      payload: { companyId },
      callback,
    });
  }

  connectWebSocket = () => {
    const { companyId } = this.props;
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const params = {
      companyId,
       env,
      //env: 'dev',
      type: 2,
    };
    const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;

    // 链接webscoket
    const ws = this.ws = new WebsocketHeartbeatJs({ url, ...options });

    ws.onopen = () => {
      console.log('connect success');
      ws.send('heartbeat');
    };

    ws.onmessage = e => {
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;
      try {
        const data = JSON.parse(e.data);
        // console.log(data);
        this.handleWbData(data);
      } catch (error) {
        console.log('error', error);
      }
    };
    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  };

  setHighlightedAreaId = (areaId) => {
    this.setState({ highlightedAreaId: areaId });
  };

  setAreaId = areaId => {
    this.setState({ areaId });
  };

  handleWbData = wbData => {
    const { selectedCardId } = this.props;
    const { messageType, data } = wbData;
    const isTrack = this.isTargetTrack();
    // console.log(isTrack, selectedCardId);
    switch(messageType) {
      case LOCATION_MESSAGE_TYPE:
        this.handlePositions(data);
        // 当处于目标跟踪标签且选定目标时
        if (isTrack && selectedCardId)
          this.handleAreaAutoChange(data);
        break;
      case AREA_CHANGE_TYPE:
        this.handleAreaChange(data);
        break;
      case WARNING_TYPE:
        this.handleAlarms(data);
        this.showNotifications(data);
        this.handleAutoShowVideo(data);
        break;
      case AREA_STATUS_TYPE:
        this.handleAreaStatusChange(data);
        break;
      case RE_WARNING_TYPE:
        this.removeAlarms(data);
        this.autoCloseNotification(data);
        break;
      default:
        console.log('no msg type');
    }
  };

  handlePositions = data => {
    const { dispatch, personPosition: { positionList } } = this.props;
    const cardIds = data.map(({ cardId }) => cardId);
    // 将禁用的卡从人员列表中剔除
    const filteredData = data.filter(({ cardStatus }) => +cardStatus !== 2);
    handleOriginMovingCards(filteredData, positionList, this.originMovingCards, this.moveCard, this.removeMovingCard);
    const newPositionList = positionList.filter(({ cardId }) => !cardIds.includes(cardId)).concat(filteredData);
    dispatch({ type: 'personPosition/savePositions', payload: newPositionList });
  };

  moveCard = (id, x, y) => {
    // console.log(x, y);
    const originMovingCards = this.originMovingCards;
    this.setState(({ movingCards }) => {
      const newMovingCards = Array.from(movingCards);
      const index = newMovingCards.findIndex(({ cardId }) => cardId === id);
      const card = originMovingCards.find(({ cardId }) => cardId === id);
      const newCard = { ...card, xarea: x, yarea: y };
      if (index === -1)
        newMovingCards.push(newCard);
      else
        newMovingCards[index] = newCard;
      return { movingCards: newMovingCards };
    });
  };

  removeMovingCard = cardId => {
    // console.log(cardId);
    const originMovingCards = this.originMovingCards;
    const index = originMovingCards.findIndex(({ cardId: id }) => id === cardId);
    this.originMovingCards.splice(index, 1);
    // console.log(this.originMovingCards, this.state.movingCards.filter(({ cardId: id }) => id !== cardId));
    this.setState(({ movingCards }) => ({ movingCards: movingCards.filter(({ cardId: id }) => id !== cardId) }));
  };

  handleAreaAutoChange = data => {
    const { selectedCardId } = this.props;
    const changed = data.find(({ cardId }) => cardId === selectedCardId);
    // console.log(changed.areaId);
    if (changed)
      this.setAreaId(changed.areaId);
  };

  // 根据websocket的推送改变model中的alarms
  handleAlarms = data => {
    const { dispatch, personPosition: { alarms } } = this.props;
    const newAlarms = alarms.concat(data);
    dispatch({ type: 'personPosition/saveAlarms', payload: newAlarms });
  };

  removeAlarms = data => {
    const { dispatch, personPosition: { alarms } } = this.props;
    const warningIds = data.map(({ warningId }) => warningId);
    const newAlarms = alarms.filter(({ id }) => !warningIds.includes(id));
    dispatch({ type: 'personPosition/saveAlarms', payload: newAlarms });
  };

  handleAreaChange = data => {
    const { dispatch, personPosition: { sectionTree } } = this.props;
    const areaChangeMap = getAreaChangeMap(data);
    // console.log(areaChangeMap);
    const newSectionTree = genTreeList(sectionTree, item => {
      const { id, count, inCardCount, outCardCount } = item;
      const  delta= areaChangeMap[id];
      if (delta) {
        const { enterDelta, exitDelta } = delta;
        const newCount = count + enterDelta - exitDelta;
        return {
          ...item,
          count: newCount < 0 ? 0 : newCount,
          inCardCount: inCardCount + enterDelta,
          outCardCount: outCardCount + exitDelta,
        };
      }
      return item;
    });
    // console.log(newSectionTree);
    dispatch({ type: 'personPosition/saveSectionTree', payload: newSectionTree });
  };

  handleAreaStatusChange = data => {
    const { dispatch, personPosition: { sectionTree } } = this.props;
    const newSectionTree = genTreeList(sectionTree, item => {
      const { id } = item;
      const target = data.find(({ id: areaId }) => areaId === id);
      if (target) {
        const { lackStatus, outstripStatus, overstepStatus, tlongStatus } = target;
        return { ...item, status: lackStatus || outstripStatus || overstepStatus || tlongStatus ? 2 : 1 };
      }
      return item;
    });
    dispatch({ type: 'personPosition/saveSectionTree', payload: newSectionTree });
  };

  // 处理报警
  handleAlarm = (ids, executeStatus, executeDesc)=> {
    const { dispatch, personPosition: { alarms } } = this.props;
    dispatch({
      type: 'personPosition/handleAlarm',
      payload: { ids, executeStatus, executeDesc },
      callback: (code, msg) => {
        if (code === 200) {
          message.success(msg);
          const alarmIds = ids.split(',');
          const newAlarms = alarms.filter(({ id }) => !alarmIds.includes(id));
          dispatch({ type: 'personPosition/saveAlarms', payload: newAlarms });
          this.setState({ alarmHandleVisible: false });
          alarmIds.forEach(id => notification.close(id));
        }
        else
          message.warn(msg);
      },
    });
  };

  // 警报列表中没有sos时，调用当前函数处理
  handleSOS = cardId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personPosition/handleSOS',
      payload: cardId,
      callback(code, msg) {
        message[code === 200 ? 'success' : 'warn'](msg);
      },
    });
  };

  showNotifications = data => {
    data.forEach((alarm, i) => {
      setTimeout(() => {
        this.showNotification(alarm);
      }, i * 100);
    });
  };

  showNotification = alarm => {
    const { id, cardId, type } = alarm;

    const [title, desc] = getAlarmDesc(alarm, this.areaInfo);
    notification.warning({
      key: id,
      className: styles.note,
      placement: 'bottomLeft',
      message: `报警提示 ${title}`,
      description: (
        <span
          className={styles.desc}
          // onClick={e => {
          //   // console.log(alarm);
          //   this.showPersonInfoOrAlarmMsg(type, id, cardId);
          //   this.handleAutoShowVideo(alarm);
          //   notification.close(id);
          // }}
        >
          {desc}
        </span>
      ),
      duration: null,
      onClick: e => {
        this.showPersonInfoOrAlarmMsg(type, id, cardId);
        this.handleAutoShowVideo(alarm);
        notification.close(id);
      },
    });
  };

  autoCloseNotification = data => {
    const { alarmId } = this.state;
    data.forEach(({ warningId }) => {
      notification.close(warningId);
      // 如果当前在显示和处理的alarm与关闭的alarm相同，则自动关闭当前alarmMsg及alarmHandle弹框
      if (alarmId === warningId)
        this.setState({ alarmMsgVisible: false, alarmHandleVisible: false });
    });
  };

  // 点击警报详情时判断是显示人员sos，还是其他报警信息
  showPersonInfoOrAlarmMsg = (type, alarmId, cardId) => {
    const isSOS = +type === SOS_TYPE;
    if (isSOS)
      this.handleShowPersonInfo(cardId);
    else
      this.handleShowAlarmMsg(alarmId);
  };

  handleOpen = prop => {
    this.setState({ [`${prop}Visible`]: true });
  };

  handleClose = prop => {
    this.setState({ [`${prop}Visible`]: false });
  };

  handleShowPersonInfo = cardId => {
    this.setState({ cardId, personInfoVisible: true });
  };

  handleShowAlarmMsg = alarmId => {
    this.setState({ alarmMsgVisible: true, alarmId });
  };

  // handleShowAlarmMsgOrHandle = (alarmId, cardId, handleSOS) => {
  //   if (handleSOS)
  //     this.handleShowAlarmHandle(alarmId, cardId);
  //   else
  //     this.handleShowAlarmMsg(alarmId);
  // };

  handleShowAlarmHandle = (alarmId, cardId) => {
    // alarmId不存在时，使用cardId处理，针对的是sos存在于person，而报警列表中没有
    // if (!alarmId)
    //   this.setState({ alarmHandleVisible: true, useCardIdHandleAlarm: cardId });
    // else
    //   this.setState({ alarmHandleVisible: true, alarmId });
    this.setState({ alarmHandleVisible: true, alarmId });
  };

  handleHideAlarmHandle = () => {
    this.setState({
      alarmId: undefined,
      // useCardIdHandleAlarm: undefined,
      alarmMsgVisible: false,
      personInfoVisible: false,
      alarmHandleVisible: false,
    });
  };

  handleShowPersonDrawer = beaconId => {
    this.setState({ beaconId, personDrawerVisible: true });
  };

  handleShowAlarmDrawer = (showSOS) => {
    this.setState({ alarmDrawerVisible: true, showSOSAlarm: !!showSOS });
  };

  handleCloseAlarmDrawer = e => {
    this.setState({ alarmDrawerVisible: false });
  };

  handleShowLowPowerDrawer = e => {
    this.setState({ lowPowerDrawerVisible: true });
  };

  handleShowVideo = keyId => {
    if (!keyId) return;
    this.setState({ videoVisible: true, videoKeyId: keyId });
  };

  handleAutoShowVideo = data => {
    const { selectedCardId, personPosition: { positionList } } = this.props;

    // 当追踪时,有视频,不再显示视频
    if (this.isTargetTrack() && selectedCardId)
      return;

    // 如果data不是数组，则直接传入的就是alarm对象，如果不是数组，则传入的是alarm数组
    let alarm = data;
    if (Array.isArray(data))
      alarm = data.find(({ cardId }) => cardId);
    if (!alarm || !alarm.cardId)
      return;

    const card = positionList.find(({ cardId: id }) => id === alarm.cardId);
    if (card && card.videoList && card.videoList.length) {
      const { videoList } = card;
      this.setState({ videoKeyList: videoList });
      this.handleShowVideo(videoList[0].keyId);
    }
  };

  handleHideVideo = () => {
    this.setState({
      videoVisible: false,
      videoKeyId: '',
    });
  };

  handleTrack = (areaId, cardId, userId) => {
    const { setSelectedCard, handleLabelClick } = this.props;
    this.setAreaId(areaId);
    setSelectedCard(cardId, userId);
    handleLabelClick(1);
  };

  setTableExpandedRowKeys = expandedRowKeys => {
    this.setState({ expandedRowKeys });
  };

  render() {
    const {
      dispatch,
      fullScreen,
      labelIndex,
      companyId,
      selectedCardId,
      selectedUserId,
      areaInfoCache,
      personPosition: { sectionTree, positionList, positionAggregation, alarms, beaconList },
      showBoard,
      showFullScreen,
      hideFullScreen,
      handleLabelClick,
      setSelectedCard,
      setHistoryRecord,
    } = this.props;
    const {
      alarmId,
      areaId,
      highlightedAreaId,
      beaconId,
      cardId,
      mapBackgroundUrl,
      alarmMsgVisible,
      alarmHandleVisible,
      personInfoVisible,
      videoVisible,
      videoKeyId,
      videoKeyList,
      showSOSAlarm,
      alarmDrawerVisible,
      lowPowerDrawerVisible,
      personDrawerVisible,
      // useCardIdHandleAlarm,
      expandedRowKeys,
      movingCards,
      sectionListClearAreaId,
    } = this.state;

    // console.log(sectionTree);

    const isTrack = this.isTargetTrack();
    // const areaInfo = this.areaInfo;
    const areaInfo = areaInfoCache;

    return (
      <div className={styles.container}>
        <div className={fullScreen ? styles.left1 : styles.left}>
          <Tabs value={labelIndex} handleLabelClick={handleLabelClick} />
          <div className={styles.leftSection}>
            {!labelIndex && (
              <SectionList
                dispatch={dispatch}
                data={sectionTree}
                areaInfo={areaInfo}
                positions={positionList}
                areaId={areaId}
                clearAreaId={sectionListClearAreaId}
                setAreaId={this.setAreaId}
                expandedRowKeys={expandedRowKeys}
                setHighlightedAreaId={this.setHighlightedAreaId}
                setExpandedRowKeys={this.setTableExpandedRowKeys}
                handleClearTreeChange={this.handleSectionListClearTreeChange}
              />
            )}
            {!!labelIndex && !selectedCardId && (
              <CardList
                areaInfo={areaInfo}
                positions={positionList}
                handleTrack={this.handleTrack}
              />
            )}
            {!!labelIndex && selectedCardId && (
              <CardSelected
                dispatch={dispatch}
                cardId={selectedCardId}
                userId={selectedUserId}
                areaInfo={areaInfo}
                positions={positionList}
                setSelectedCard={setSelectedCard}
                setHistoryRecord={setHistoryRecord}
                handleLabelClick={handleLabelClick}
              />
            )}
          </div>
        </div>
        <div className={fullScreen ? styles.right1 : styles.right}>
          <div className={styles.rightSection}>
            <LeafletMap
              fullScreen={fullScreen}
              url={mapBackgroundUrl}
              isTrack={isTrack}
              selectedCardId={selectedCardId}
              areaId={areaId}
              highlightedAreaId={highlightedAreaId}
              areaInfo={areaInfo}
              sectionTree={sectionTree}
              beaconList={beaconList}
              positions={positionList}
              aggregation={positionAggregation}
              movingCards={movingCards}
              removeMovingCard={this.removeMovingCard}
              setAreaId={this.setAreaId}
              setHighlightedAreaId={this.setHighlightedAreaId}
              showBoard={showBoard}
              showFullScreen={showFullScreen}
              hideFullScreen={hideFullScreen}
              handleShowVideo={this.handleShowVideo}
              handleShowPersonInfo={this.handleShowPersonInfo}
              handleShowPersonDrawer={this.handleShowPersonDrawer}
            />
            <MapInfo
              areaInfo={areaInfo}
              alarms={alarms}
              sectionTree={sectionTree}
              positionList={positionList}
              showPersonInfoOrAlarmMsg={this.showPersonInfoOrAlarmMsg}
              handleShowAlarmDrawer={this.handleShowAlarmDrawer}
              handleShowLowPowerDrawer={this.handleShowLowPowerDrawer}
            />
            <PersonInfo
              visible={personInfoVisible}
              companyId={companyId}
              areaInfo={areaInfo}
              alarms={alarms}
              personItem={getPersonInfoItem(cardId, positionList)}
              handleTrack={this.handleTrack}
              // handleShowAlarmMsgOrHandle={this.handleShowAlarmMsgOrHandle}
              handleShowAlarmHandle={this.handleShowAlarmHandle}
              handleClose={this.handleClose}
            />
            <AlarmMsg
              visible={alarmMsgVisible}
              areaInfo={areaInfo}
              data={getAlarmItem(alarmId, alarms)}
              handleShowAlarmHandle={this.handleShowAlarmHandle}
              handleClose={this.handleClose}
            />
            <AlarmHandle
              // cardId={useCardIdHandleAlarm}
              alarmId={alarmId}
              alarms={alarms}
              visible={alarmHandleVisible}
              handleAlarm={this.handleAlarm}
              handleSOS={this.handleSOS}
              handleClose={this.handleHideAlarmHandle}
            />
          </div>
        </div>
        <AlarmDrawer
          areaInfo={areaInfo}
          visible={alarmDrawerVisible}
          showSOSAlarm={showSOSAlarm}
          data={alarms}
          showPersonInfoOrAlarmMsg={this.showPersonInfoOrAlarmMsg}
          handleClose={this.handleCloseAlarmDrawer}
        />
        <LowPowerDrawer
          visible={lowPowerDrawerVisible}
          positionList={positionList}
          handleShowPersonInfo={this.handleShowPersonInfo}
          handleClose={this.handleClose}
        />
        <PersonDrawer
          visible={personDrawerVisible}
          beaconId={beaconId}
          aggregation={positionAggregation}
          handleShowPersonInfo={this.handleShowPersonInfo}
          handleClose={this.handleClose}
        />
        <VideoPlay
          showList
          visible={videoVisible}
          keyId={videoKeyId}
          videoList={videoKeyList}
          handleVideoClose={this.handleHideVideo}
        />
      </div>
    );
  }
}
