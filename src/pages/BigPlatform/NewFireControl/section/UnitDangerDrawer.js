import React, { Fragment } from 'react';

import styles from './UnitDangerDrawer.less';
import {
  DangerCard,
  DrawerContainer,
} from '../components/Components';

// const LIST = [...Array(10).keys()].map(i => ({
//   id: i,
//   desc: '皮带松弛，部件老化',
//   report: '李大山 2018-7-18',
//   reform: '周建国 2017-7-24',
//   review: '刘琪 2019-1-1',
// }));

const TYPE = 'unitDanger';
const TITLES = ['隐患数量', '已超期', '待整改', '待复查'];
const STATUS = ['-1', ['7'], ['1', '2'], ['3']];
const COLORS = ['255,255,255', '232,103,103', '246,181,78', '42,139,213'];
const NO_DATA = '暂无信息';

export default function UnitDangerDrawer(props) {
  const {
    loading,
    labelIndex=0,
    visible,
    companyId,
    data: {
      dangerList=[],
      dangerRecords=[],
    },
    handleLabelClick,
    handleDrawerVisibleChange,
    ...restProps
  } = props;

  const selected = dangerList.find(item => item.companyId === companyId) || {};
  const { companyName, total=0, hasExtended: overdue=0, afterRectification: rectify=0, toReview: review=0 } = selected;
  const filteredRecords = labelIndex ? dangerRecords.filter(({ status }) => STATUS[labelIndex].includes(status)) : dangerRecords;

  const left = (
    <Fragment>
      <p className={styles.name}>{companyName || NO_DATA}</p>
      <div className={styles.spans}>
        {[total, overdue, rectify, review].map((n,i) => (
          <span className={labelIndex === i ? styles.selected : styles.item} key={i} onClick={e => handleLabelClick(i)}>
            {`${TITLES[i]}：`}
            <span style={{ color: `rgb(${COLORS[i]})` }} >
              {n}
            </span>
          </span>
          ))}
      </div>
      <div className={styles.cardContainer}>
        {loading ? 'loading...' : filteredRecords.map((item, i) => (
          <DangerCard
            key={item.id}
            data={item}
            style={{ marginTop: i ? 14 : 0 }}
          />
        ))}
      </div>
    </Fragment>
  )

  return (
    <DrawerContainer
      title="隐患列表"
      width={540}
      visible={visible}
      left={left}
      onClose={() => handleDrawerVisibleChange(TYPE)}
      {...restProps}
    />
  );
}
