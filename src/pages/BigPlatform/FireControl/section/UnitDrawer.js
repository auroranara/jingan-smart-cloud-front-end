import React, { PureComponent } from 'react';

import DrawerContainer from '../components/DrawerContainer';

export default class UnitDrawer extends PureComponent {
  render() {
    const { visible } = this.props;

    return (
      <DrawerContainer
        title="管辖单位"
        visible={visible}
      />
    );
  }
}
