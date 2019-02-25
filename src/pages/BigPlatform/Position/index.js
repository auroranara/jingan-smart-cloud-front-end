import React, { PureComponent } from 'react';
import { connect } from 'dva';

import BigPlatformLayout from '@/layouts/BigPlatformLayout';
// import styles from './index.less';
import { History, RealTime } from './sections/Components';

@connect(({ personPosition, position, user }) => ({ personPosition, position, user }))
export default class PositionIndex extends PureComponent {
  state = {
    labelIndex: 0,
    areaId: undefined,
  };

  componentDidMount() {
    const { dispatch, match: { params: { companyId } } } = this.props;
    dispatch({
      type: 'personPosition/fetchSections',
      payload: { companyId },
      callback: list => {
        if (list.length)
          this.setState({ areaId: list[0].id });
      },
    });
  }

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
      areaId,
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
            data={{ companyId, areaId, personPosition }}
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
