import React, { Fragment, PureComponent } from 'react';

import styles from './LowPowerDrawer.less';
import { DrawerContainer } from '../components/Components';
import { getUserName } from '../utils';

function PowerCard(props) {
  const { data, ...restProps } = props;
  const { cardType, cardCode, phoneNumber, visitorPhone } = data;
  const name = getUserName(data);
  const isVisitor = !!+cardType;
  const phone = isVisitor ? visitorPhone : phoneNumber;

  return (
    <div className={styles.cardContainer} {...restProps}>
      <div className={styles.head} />
      <p className={styles.info}>
        <span>{name}</span>{phone || '暂无电话'}</p>
      <p className={styles.id}><span>标签卡号：</span>{cardCode}</p>
      <span className={styles.power}>电量：20%</span>
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
    // const list = positionList.filter(({ lowPower }) => lowPower);
    const list = [...Array(3).keys()].map(i => ({ cardId: i.toString(), cardType: 1, cardCode: 276, phoneNumber: 13222228888, userName: '张三' }));
    let left = null;
    if (list.length)
      left = (
        <Fragment>
          {list.map(item => <PowerCard key={item.cardId} data={item} onClick={this.genCardClick(item.cardId)} />)}
        </Fragment>
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
