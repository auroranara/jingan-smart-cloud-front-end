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
  };

  handleLabelClick = i => {
    this.setState({ labelIndex: i });
  };

  setSelectedCard = cardId => {
    this.setState({ selectedCardId: cardId });
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
            selectedCardId={selectedCardId}
            personPosition={personPosition}
            handleLabelClick={this.handleLabelClick}
            setSelectedCard={this.setSelectedCard}
          />
        )}
        {labelIndex === 2 && (
          <History
            cardId={1}
            companyId={companyId}
            labelIndex={labelIndex}
            handleLabelClick={this.handleLabelClick}
          />
        )}
      </BigPlatformLayout>
    );
  }
}
