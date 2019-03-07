import React, { Fragment, PureComponent } from 'react';

import styles from './LowPowerDrawer.less';
import { DrawerContainer } from '../components/Components';
import { getUserName } from '../utils';

function PowerCard(props) {
  const { data, ...restProps } = props;
  const { cardType, cardCode, phoneNumber, visitorPhone, battery } = data;
  const name = getUserName(data);
  const isVisitor = !!+cardType;
  const phone = isVisitor ? visitorPhone : phoneNumber;

  return (
    <div className={styles.cardContainer} {...restProps}>
      <div className={styles[isVisitor ? 'visitor' : 'head']} />
      <p className={styles.info}>
        <span className={styles.name}>{name}</span>{phone || '暂无电话'}</p>
      <p className={styles.id}><span>标签卡号：</span>{cardCode}</p>
      <span className={styles.power}>电量：{battery}%</span>
    </div>
  );
}

export default class PowerDrawer extends PureComponent {
  handleCloseDrawer = () => {
    const { handleClose } = this.props;
    handleClose('lowPowerDrawer');
  };

  genCardClick = id => e => {
    const { handleShowPersonInfo } = this.props;
    handleShowPersonInfo(id);
    this.handleCloseDrawer();
  };

  render() {
    const { visible, positionList } = this.props;
    const list = positionList.filter(({ lowPower }) => lowPower);
    list.sort((p1, p2) => p1.battery - p2.battery);
    // const list = [...Array(3).keys()].map(i => ({ cardId: i.toString(), cardType: 1, cardCode: 276, phoneNumber: 13222228888, userName: '张三' }));
    let left = null;
    if (list.length)
      left = (
        <div className={styles.cards}>
          {list.map(item => <PowerCard key={item.cardId} data={item} onClick={this.genCardClick(item.cardId)} />)}
        </div>
      );

    return (
      <DrawerContainer
        width={500}
        title="低电量报警"
        visible={visible}
        left={left}
        placement="right"
        onClose={this.handleCloseDrawer}
      />
    );
  }
}
