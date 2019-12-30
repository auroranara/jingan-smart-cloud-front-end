import React from 'react';

import HiddenDanger from '../HiddenDanger';
import styles from './DangerCard.less';

const CARD_STYLE = {
  marginBottom: 0,
  backgroundColor: 'rgb(4, 64, 125)',
  boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.2)',
};

export default function DangerCard(props) {
  return (
    <div className={styles.container}>
      <HiddenDanger style={CARD_STYLE} {...props} isSourceShow />
    </div>
  )
}
