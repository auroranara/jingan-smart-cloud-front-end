import React, { PureComponent } from 'react';
import { Icon } from 'antd';

import DangerCard from './DangerCard';
import styles from './DrawerStretchCard.less';

const TITLES = ['隐患数量', '已超期', '待整改', '待复查'];
const COLORS = ['255,255,255', '232,103,103', '246,181,78', '42,139,213'];

export default class DrawerStretchCard extends PureComponent {
  loadMore = e => {
    const {
      labelIndex,
      fetchDangerRecords,
      data: { companyId },
    } = this.props;
    fetchDangerRecords(companyId, labelIndex);
  };

  render() {
    const {
      loading,
      hasMore,
      labelIndex,
      selected,
      data: { companyId, companyName: name, total=0, afterRectification: rectify=0, toReview: review=0, hasExtended: overdue=0 },
      list=[],
      fetchDangerRecords,
      handleLabelClick,
      ...restProps
    } = this.props;
    // console.log(name, selected, labelIndex);

    // const list = [];
    // const hasMore = true;
    // const loading = true;
    let cards = null;
    if (list.length)
      cards = list.map((item, i) => <DangerCard key={item.id} data={item} style={{ marginTop: i ? 14 : 0 }} />);

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
              {list.length ? cards : loading ? null : <p className={styles.none}>暂无隐患信息</p>}
              {/* {loading ? '加载中...' : cards} */}
              {hasMore && (
                <p
                  className={!list.length && loading ? styles.none : loading ? styles.more : styles.more1}
                  onClick={loading ? null : this.loadMore}
                >
                  {loading ? <Icon type="sync" spin /> : <Icon type="double-right" className={styles.doubleRight}/>}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
