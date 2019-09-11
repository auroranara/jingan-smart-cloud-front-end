import React, { PureComponent } from 'react';
import { connect } from 'dva';

import PointEdit from './PointEdit';
import EquipmentEdit from './EquipmentEdit';
import ScreenEdit from './ScreenEdit';

const TAB_COMS = [PointEdit, EquipmentEdit, ScreenEdit];

@connect(({ checkPoint, loading }) => ({ checkPoint, loading: loading.models.checkPoint }))
export default class CheckEdit extends PureComponent {
  render() {
    const { match: { params: { tabIndex } } } = this.props;
    const Component = TAB_COMS[tabIndex];
    return <Component {...this.props} />;
  }
}
