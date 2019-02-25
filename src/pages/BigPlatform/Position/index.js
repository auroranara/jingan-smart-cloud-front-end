import React, { PureComponent } from 'react';
import { connect } from 'dva';

import BigPlatformLayout from '@/layouts/BigPlatformLayout';
// import styles from './index.less';
import { History, RealTime } from './sections/Components';

@connect(({ personPosition, position, user }) => ({ personPosition, position, user }))
export default class PositionIndex extends PureComponent {
  state = {
    labelIndex: 0,
  };

  handleLabelClick = i => {
    this.setState({ labelIndex: i });
  };

  render() {
    // 注意这里额外引了一个model
    const {
      dispatch,
      match: { params: { companyId } },
      personPosition,
      position,
      user,
    } = this.props;
    const {
      labelIndex,
    } = this.state;

    const { currentUser: { companyName } } = user;

    return (
      <BigPlatformLayout
        title="晶安人员定位监控系统"
        extra={companyName}
        headerStyle={{ fontSize: 16 }}
        titleStyle={{ fontSize: 46 }}
      >
        {!labelIndex && (
          <RealTime
            dispatch={dispatch}
            labelIndex={labelIndex}
            companyId={companyId}
            personPosition={personPosition}
            handleLabelClick={this.handleLabelClick}
          />
        )}
        {labelIndex === 2 && (
          <History
            dispatch={dispatch}
            cardId={1}
            companyId={companyId}
            labelIndex={labelIndex}
            position={position}
            handleLabelClick={this.handleLabelClick}
          />
        )}
      </BigPlatformLayout>
    );
  }
}
