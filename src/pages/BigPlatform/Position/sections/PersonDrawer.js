import React, { Fragment, PureComponent } from 'react';

import styles from './PersonDrawer.less';
import { DrawerContainer } from '../components/Components';
import { getUserName } from '../utils';

function PersonCard(props) {
  const { data, ...restProps } = props;
  const { cardType, cardCode, phoneNumber, visitorPhone, sos, lowPower, tlong, overstep, onlineStatus } = data;
  const name = getUserName(data);
  const isVisitor = !!+cardType;
  const isOnline = !!+onlineStatus;
  const phone = isVisitor ? visitorPhone : phoneNumber;
  const isAlarm = sos || lowPower || tlong || overstep;
  const avatarClass = `${isVisitor ? 'visitorAvatar' : 'avatar'}${isOnline ? '' : 'Off'}`;

  return (
    <div className={styles[isAlarm ? 'cardRedContainer' : 'cardContainer']} {...restProps}>
      {sos && <div className={styles.sos} />}
      <div className={styles[avatarClass]} />
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

  genCardClick = id => e => {
    const { handleShowPersonInfo } = this.props;
    handleShowPersonInfo(id);
    this.handleCloseDrawer();
  };

  render() {
    const { visible, aggregation, beaconId, handleShowPersonInfo } = this.props;
    let list = aggregation.find(ps => ps[0].beaconId === beaconId) || [];
    list = Array.from(list);
    list.sort((p1, p2) => p1.cardCode - p2.cardCode); // cardCode为纯数字，按cardCode排序
    let left = null;
    if (beaconId)
      left = (
        <div className={styles.cards}>
          {list.map(item => <PersonCard key={item.cardId} data={item} onClick={this.genCardClick(item.cardId)} />)}
        </div>
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
