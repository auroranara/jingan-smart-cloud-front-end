import React, { PureComponent } from 'react';
import { connect } from 'dva';

import BigPlatformLayout from '@/layouts/BigPlatformLayout';
// import styles from './index.less';
import { AlarmList, CountBoard, History, RealTime, SettingModal } from './sections/Components';

const AUTOSPACE = window.innerWidth > 1366;
const DEFAULT_TITLE = '晶安人员定位监控系统';

@connect(({ personPosition, position, user }) => ({ personPosition, position, user }))
export default class PositionIndex extends PureComponent {
  state = {
    title: DEFAULT_TITLE,
    labelIndex: 0,
    selectedCardId: undefined,
    selectedUserId: undefined,
    // 历史记录，为对象，id可能为cardId，也可能为userId，isCardId是否为卡片id
    // historyRecord: undefined,
    historyIdType: '0', // 0 userId   1 cardId
    historyUserIds: [],
    historyCardIds: [],
    areaInfoCache: {}, // 缓存RealTime组件中的areaInfo对象，以防切换tab时，areaInfo为空对象的问题
    boardVisible: false,
    fullScreen: false,
    showBeacon: true,
    setttingModalVisible: false,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    dispatch({ type: 'position/fetchTree', payload: { companyId } });
    dispatch({ type: 'position/fetchPeople', payload: { companyId } });
    dispatch({ type: 'position/fetchCards', payload: { companyId, pageNum: 1, pageSize: 0 } });
  }

  setAreaInfoCache = areaInfo => {
    this.setState({ areaInfoCache: areaInfo });
  };

  handleLabelClick = i => {
    this.setState({ labelIndex: i });
  };

  setSelectedCard = (cardId, userId) => {
    this.setState({ selectedCardId: cardId, selectedUserId: userId });
  };

  setHistoryRecord = (cardId, userId) => {
    // this.setState({ historyRecord });
    let state;
    if (userId) state = { historyIdType: '0', historyUserIds: [userId] };
    else state = { historyIdType: '1', historyCardIds: [cardId] };
    this.setState(state);
  };

  setHistoryIdType = type => {
    this.setState({ historyIdType: type });
  };

  setHistoryUserIds = userIds => {
    this.setState({ historyUserIds: userIds });
  };

  setHistoryCardIds = cardIds => {
    this.setState({ historyCardIds: cardIds });
  };

  showBoard = () => {
    this.setState({ boardVisible: true });
  };

  hideBoard = () => {
    this.setState({ boardVisible: false });
  };

  showFullScreen = () => {
    this.setState({ fullScreen: true });
  };

  hideFullScreen = () => {
    this.setState({ fullScreen: false });
  };

  handleClickSetButton = () => {
    this.setState({ setttingModalVisible: true });
  };

  handleSettingOk = values => {
    const { beacon, title } = values;
    this.setState({ title, setttingModalVisible: false, showBeacon: !!+beacon });
  };

  handleSettingCancel = e => {
    this.setState({ setttingModalVisible: false });
  };

  render() {
    // 注意这里额外引了一个model
    const {
      dispatch,
      match: {
        params: { companyId },
      },
      position,
      personPosition,
      user,
    } = this.props;
    const {
      title,
      labelIndex,
      selectedCardId,
      selectedUserId,
      historyIdType,
      historyUserIds,
      historyCardIds,
      areaInfoCache,
      boardVisible,
      fullScreen,
      showBeacon,
      setttingModalVisible,
    } = this.state;

    const { sectionTree } = personPosition;
    const {
      currentUser: { companyName },
    } = user;

    return (
      <BigPlatformLayout
        settable
        title="人员定位监控系统"
        autoSpace={AUTOSPACE}
        extra={companyName}
        headerStyle={ fullScreen ? { display: 'none' } : { fontSize: 16 }}
        contentStyle={ fullScreen ? { height: '100%' } : null}
        titleStyle={{ fontSize: 46 }}
        onSet={this.handleClickSetButton}
      >
        {(!labelIndex || labelIndex === 1) && (
          <RealTime
            dispatch={dispatch}
            showBeacon={showBeacon}
            fullScreen={fullScreen}
            labelIndex={labelIndex}
            companyId={companyId}
            areaInfoCache={areaInfoCache}
            setAreaInfoCache={this.setAreaInfoCache}
            selectedCardId={selectedCardId}
            selectedUserId={selectedUserId}
            personPosition={personPosition}
            showBoard={this.showBoard}
            showFullScreen={this.showFullScreen}
            hideFullScreen={this.hideFullScreen}
            handleLabelClick={this.handleLabelClick}
            setSelectedCard={this.setSelectedCard}
            setHistoryRecord={this.setHistoryRecord}
          />
        )}
        {labelIndex === 2 && (
          <History
            idType={historyIdType}
            userIds={historyUserIds}
            cardIds={historyCardIds}
            companyId={companyId}
            labelIndex={labelIndex}
            setSelectedCard={this.setSelectedCard}
            setIdType={this.setHistoryIdType}
            setUserIds={this.setHistoryUserIds}
            setCardIds={this.setHistoryCardIds}
            handleLabelClick={this.handleLabelClick}
          />
        )}
        {labelIndex === 3 && (
          <AlarmList
            dispatch={dispatch}
            labelIndex={labelIndex}
            companyId={companyId}
            areaInfo={areaInfoCache}
            position={position}
            personPosition={personPosition}
            handleLabelClick={this.handleLabelClick}
          />
        )}
        {boardVisible ? <CountBoard sectionTree={sectionTree} hideBoard={this.hideBoard} /> : null}
        <SettingModal
          visible={setttingModalVisible}
          handleOk={this.handleSettingOk}
          handleCancel={this.handleSettingCancel}
        />
      </BigPlatformLayout>
    );
  }
}
