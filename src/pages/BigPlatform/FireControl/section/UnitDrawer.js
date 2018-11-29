import React, { PureComponent, Fragment } from 'react';

import DrawerContainer from '../components/DrawerContainer';
import DrawerSection from '../components/DrawerSection';
import OvProgress from '../components/OvProgress';

export default class UnitDrawer extends PureComponent {
  render() {
    const { visible, handleDrawerVisibleChange } = this.props;

    const left = (
      <Fragment>
        <DrawerSection>
          <OvProgress title="报警单位" percent={50} />
        </DrawerSection>
        <DrawerSection title="隐患数量排名">
        content
      </DrawerSection>
      </Fragment>
    );

    const right = (
      <div>cards</div>
    );

    return (
      <DrawerContainer
        title="管辖单位"
        visible={visible}
        left={left}
        right={right}
        onClose={() => handleDrawerVisibleChange('unit')}
      />
    );
  }
}
