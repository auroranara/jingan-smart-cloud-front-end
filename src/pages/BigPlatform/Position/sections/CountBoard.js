import React from 'react';
import { Icon } from 'antd';
import DescriptionList from '@/components/DescriptionList';

import styles from './CountBoard.less';
import { getSectionCount } from '../utils';

// const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

const { Description } = DescriptionList;

function genDesc(tree) {
  if (!tree)
    return [];
  const arr = getSectionCount(tree);
  const comps = [];
  for (let i = 0; i < arr.length; i += 3) {
    const list = arr.slice(i, i + 3);
    comps.push((
      <DescriptionList key={i}>
        {list.map(({ name, count }, i) => <Description key={name + i} term={name} className={styles.descp}>{count}</Description>)}
      </DescriptionList>
    ));
  }
  return comps;
}

export default function CountBoard(props) {
  const { sectionTree, hideBoard } = props;
  const west = sectionTree[0];
  const east = sectionTree[1];
  const westQuantity = west && west.count ? west.count : 0;
  const eastQuantity = east && east.count ? east.count : 0;
  return (
    <div className={styles.container} style={{ height: HEIGHT }}>
      <Icon type="shrink" className={styles.shrink} onClick={hideBoard} />
      <div className={styles.inner}>
        <div className={styles.head}>全厂人数: {westQuantity + eastQuantity}</div>
        <div className={styles.section}>
          <h3 className={styles.title}>西厂区人数: {westQuantity}</h3>
          <div className={styles.desc}>{genDesc(west)}</div>
        </div>
        <div className={styles.section}>
          <h3 className={styles.title}>东厂区人数: {eastQuantity}</h3>
          <div className={styles.desc}>{genDesc(east)}</div>
        </div>
      </div>
    </div>
  )
};
