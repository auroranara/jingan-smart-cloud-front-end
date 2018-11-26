import React, { PureComponent } from 'react';
import { connect } from 'dva';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';

@connect(({ unitSafety, loading }) => ({
  unitSafety,
  monitorDataLoading: loading.effects['bigPlatform/fetchMonitorData'],
}))
export default class App extends PureComponent {

  render() {
    // const { unitSafety: {  } } = this.props;

    return (
      <BigPlatformLayout extra={123}>
      </BigPlatformLayout>
    );
  }
}
