import React, { PureComponent } from 'react';
import { connect } from 'dva';

import BigPlatformLayout from '@/layouts/BigPlatformLayout';
// import styles from './index.less';
import { History, RealTime } from './sections/Components';

@connect(({ personPosition, user }) => ({ personPosition, user }))
export default class PositionIndex extends PureComponent {
  state = {
    labelIndex: 0,
    selectedCardId: undefined,
    selectedUserId: undefined,
    // historyCardId: undefined,
    // 历史记录，为对象，id可能为cardId，也可能为userId，isCardId是否为卡片id
    historyRecord: undefined,
    areaInfoCache: {}, // 缓存RealTime组件中的areaInfo对象，以防切换tab时，areaInfo为空对象的问题
  };

  setAreaInfoCache = areaInfo => {
    this.setState({ areaInfoCache: areaInfo });
  };

  handleLabelClick = i => {
    this.setState({ labelIndex: i });
  };

  setSelectedCard = (cardId, userId) => {
    this.setState({ selectedCardId: cardId, selectedUserId: userId });
  };

  setHistoryRecord = historyRecord => {
    this.setState({ historyRecord });
  };

  render() {
    // 注意这里额外引了一个model
    const {
      dispatch,
      match: { params: { companyId } },
      personPosition,
      user,
    } = this.props;
    const {
      labelIndex,
      selectedCardId,
      selectedUserId,
      // historyCardId,
      historyRecord,
      areaInfoCache,
    } = this.state;

    const { currentUser: { companyName } } = user;

    return (
      <BigPlatformLayout
        title="晶安人员定位监控系统"
        extra={companyName}
        headerStyle={{ fontSize: 16 }}
        titleStyle={{ fontSize: 46 }}
      >
        {(!labelIndex || labelIndex === 1) && (
          <RealTime
            dispatch={dispatch}
            labelIndex={labelIndex}
            companyId={companyId}
            areaInfoCache={areaInfoCache}
            setAreaInfoCache={this.setAreaInfoCache}
            selectedCardId={selectedCardId}
            selectedUserId={selectedUserId}
            personPosition={personPosition}
            handleLabelClick={this.handleLabelClick}
            setSelectedCard={this.setSelectedCard}
            setHistoryRecord={this.setHistoryRecord}
          />
        )}
        {labelIndex === 2 && (
          <History
            historyRecord={historyRecord}
            companyId={companyId}
            labelIndex={labelIndex}
            setHistoryRecord={this.setHistoryRecord}
            handleLabelClick={this.handleLabelClick}
          />
        )}
      </BigPlatformLayout>
    );
  }
}
