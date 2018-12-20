import React, { PureComponent } from 'react';

import DangerCard from './DangerCard';

import styles from './DrawerStretchCard.less';

// const LIST = [...Array(10).keys()].map(i => ({
//   id: i,
//   desc: '皮带松弛，部件老化',
//   report: '李大山 2018-7-18',
//   reform: '周建国 2017-7-24',
//   review: '刘琪 2019-1-1',
// }));

const TITLES = ['隐患数量', '已超期', '待整改', '待复查'];
const COLORS = ['255,255,255', '232,103,103', '246,181,78', '42,139,213'];

export default class DrawerStretchCard extends PureComponent {
  render() {
    const {
      loading,
      labelIndex,
      selected,
      data: { companyId, companyName: name, total=0, afterRectification: rectify=0, toReview: review=0, hasExtended: overdue=0 },
      list=[],
      handleLabelClick,
      ...restProps
    } = this.props;
    // console.log(name, selected, labelIndex);

    return (
      <div className={styles.outer}>
        <div className={styles.container} {...restProps}>
          <p className={styles.company}>
            {name}
          </p>
          <div className={styles.spans} style={{ borderBottom: selected && labelIndex !== -1 ? '1px solid rgb(4, 253, 255)' : 'none' }}>
            {[total, overdue, rectify, review].map((n,i) => (
              <span
                key={i}
                className={selected && labelIndex === i ? styles.selected : styles.item}
                onClick={e => handleLabelClick(i, companyId)}
              >
                {`${TITLES[i]}：`}
                <span key={i} style={{ color: `rgb(${COLORS[i]})` }}>{n}</span>
              </span>
            ))}
          </div>
          {selected && labelIndex !== -1 && (
            <div className={styles.cardContainer}>
              {loading ? 'loading...' : list.map((item, i) => <DangerCard key={item.id} data={item} style={{ marginTop: i ? 14 : 0 }} />)}
            </div>
          )}
        </div>
      </div>
    );
  }
}
