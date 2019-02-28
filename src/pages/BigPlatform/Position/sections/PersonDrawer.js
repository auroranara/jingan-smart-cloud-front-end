import React, { Fragment, PureComponent } from 'react';

import styles from './PersonDrawer.less';
import { DrawerContainer } from '../components/Components';
import { getUserName } from '../utils';
import { avatarIcon } from '../imgs/urls';

function PersonCard(props) {
  const { data, ...restProps } = props;
  const { cardType, cardCode, phoneNumber, visitorPhone } = data;
  const name = getUserName(data);
  const isVisitor = !!+cardType;
  const phone = isVisitor ? visitorPhone : phoneNumber;

  return (
    <div className={styles.cardContainer} {...restProps}>
      <div
        className={styles.head}
        style={{ backgroundImage: `url(${avatarIcon})`}}
      />
      <span>{`${name}(${cardCode})`}</span>
      <span>{phone || '暂无电话信息'}</span>
    </div>
  );
}

export default class PersonDrawer extends PureComponent {
  handleCloseDrawer = () => {
    const { handleClose } = this.props;
    handleClose('personDrawer');
  };

  render() {
    const { visible, aggregation, beaconId, handleShowPersonInfo } = this.props;
    const list = aggregation.find(ps => ps[0].beaconId === beaconId) || [];
    let left = null;
    if (beaconId)
      left = (
        <Fragment>
          {list.map(item => <PersonCard key={item.cardId} data={item} onClick={e => handleShowPersonInfo(item.cardId)} />)}
        </Fragment>
      );

    return (
      <DrawerContainer
        width={500}
        title="人员列表"
        visible={visible}
        left={left}
        placement="right"
        onClose={this.handleCloseDrawer}
      />
    );
  }
}
