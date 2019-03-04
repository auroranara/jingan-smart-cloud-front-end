import React, { Fragment, PureComponent } from 'react';
import { Icon } from 'antd';

import styles from './AlarmDrawer.less';
import { DrawerContainer } from '../components/Components';
import { getAlarmDesc } from '../utils';

function AlarmCard(props) {
  const {
    areaInfo,
    data,
    onClick,
    ...restProps
  } = props;

  const [title, desc] = getAlarmDesc(data, areaInfo);


  return (
    <div className={styles.cardContainer} {...restProps}>
      <p className={styles.title}>{title}</p>
      <p>{desc}，请及时处理。</p>
      <span className={styles.detail} onClick={onClick}>详情<Icon type="double-right" /></span>
    </div>
  );
}

export default class AlarmDrawer extends PureComponent {
  handleCloseDrawer = () => {
    const { handleClose } = this.props;
    handleClose('alarmDrawer');
  };

  genClickCard = ({ id, type, cardId }) => e => {
    const { showPersonInfoOrAlarmMsg } = this.props;
    showPersonInfoOrAlarmMsg(type, id, cardId);
    this.handleCloseDrawer();
  };

  render() {
    const { visible, areaInfo, data } = this.props;
    const list = Array.from(data);
    list.reverse();
    const left = (
      <div className={styles.cards}>
        {list.map(item => (
          <AlarmCard
            key={item.id}
            areaInfo={areaInfo}
            data={item}
            onClick={this.genClickCard(item)}
          />
        ))}
      </div>
    );

    return (
      <DrawerContainer
        width={500}
        title="告警消息"
        visible={visible}
        left={left}
        placement="right"
        onClose={this.handleCloseDrawer}
      />
    );
  }
}
