import React, { Fragment, PureComponent } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';

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
  const { type } = data;
  const isSOS = +type === 1;

  return (
    <div className={styles.cardContainer} {...restProps}>
      <p className={styles.title}>{title}</p>
      <p>{desc}{isSOS ? '，请及时处理' : ''}。</p>
      <span className={styles.detail} onClick={onClick}>详情<LegacyIcon type="double-right" /></span>
    </div>
  );
}

export default class AlarmDrawer extends PureComponent {
  genClickCard = ({ id, type, cardId }) => e => {
    const { showPersonInfoOrAlarmMsg, handleClose } = this.props;
    showPersonInfoOrAlarmMsg(type, id, cardId);
    handleClose();
  };

  render() {
    const { visible, areaInfo, data, handleClose, showSOSAlarm } = this.props;
    const list = Array.from(data);
    list.sort((w1, w2) => w2.warningTime - w1.warningTime);
    let filtered = list;
    if (showSOSAlarm)
      filtered = list.filter(({ type }) => +type === 1);
    const left = (
      <div className={styles.cards}>
        {filtered.map(item => (
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
        onClose={handleClose}
      />
    );
  }
}
