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
    historyCardId: undefined,
    areaInfoCache: {}, // 缓存RealTime组件中的areaInfo对象，以防切换tab时，areaInfo为空对象的问题
  };

  setAreaInfoCache = areaInfo => {
    this.setState({ areaInfoCache: areaInfo });
  };

  handleLabelClick = i => {
    this.setState({ labelIndex: i });
  };

  setSelectedCard = cardId => {
    this.setState({ selectedCardId: cardId });
  };

  setHistoryCard = cardId => {
    this.setState({ historyCardId: cardId });
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
      historyCardId,
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
            personPosition={personPosition}
            handleLabelClick={this.handleLabelClick}
            setSelectedCard={this.setSelectedCard}
            setHistoryCard={this.setHistoryCard}
          />
        )}
        {labelIndex === 2 && (
          <History
            cardId={historyCardId}
            companyId={companyId}
            labelIndex={labelIndex}
            setCardId={this.setHistoryCard}
            handleLabelClick={this.handleLabelClick}
          />
        )}
      </BigPlatformLayout>
    );
  }
}
