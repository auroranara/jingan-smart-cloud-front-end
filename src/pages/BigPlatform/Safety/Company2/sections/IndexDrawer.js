import React, { Fragment, PureComponent } from 'react';

import styles from './IndexDrawer.less';
import { DrawerContainer, DrawerSection, Rect } from '../components/Components';

const TYPE = 'index';

export default class IndexDrawer extends PureComponent {
  handleClose = () => {
    const { handleDrawerVisibleChange } = this.props;
    handleDrawerVisibleChange(TYPE);
  };

  render() {
    const { visible } = this.props;

    const titleIcon = <Rect color='#0967d3' />;

    const left = (
      <Fragment>
        <DrawerSection title="构成">
          index
        </DrawerSection>
        <DrawerSection title="分值">
          bar
        </DrawerSection>
      </Fragment>
    );

    const right = "cards";

    return (
      <DrawerContainer
        title="安全指数"
        titleIcon={titleIcon}
        visible={visible}
        left={left}
        right={right}
        onClose={this.handleClose}
      />
    );
  }
}
