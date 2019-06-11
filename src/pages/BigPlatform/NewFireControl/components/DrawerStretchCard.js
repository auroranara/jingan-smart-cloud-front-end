import React, { PureComponent } from 'react';
import { Icon } from 'antd';

// import DangerCard from './DangerCard';
import DangerCard from '@/jingan-components/HiddenDangerCard';
import styles from './DrawerStretchCard.less';

const TITLES = ['隐患数量', '已超期', '待整改', '待复查'];
const COLORS = ['255,255,255', '232,103,103', '246,181,78', '42,139,213'];
const FIELD_NAMES = {
  type: 'business_type', // 隐患类型
  description: 'desc', // 隐患描述
  images({ hiddenDangerRecordDto }) {
    return hiddenDangerRecordDto && hiddenDangerRecordDto[0] && hiddenDangerRecordDto[0].files && hiddenDangerRecordDto[0].files.map(({ web_url }) => web_url);
  }, // 图片地址
  name: 'item_name', // 点位名称
  source: 'report_source', // 来源
  reportPerson: 'report_user_name', // 上报人
  reportTime: 'report_time', // 上报时间
  planRectificationPerson: 'rectify_user_name', // 计划整改人
  planRectificationTime: 'plan_rectify_time', // 计划整改时间
  actualRectificationPerson: 'rectify_user_name', // 实际整改人
  actualRectificationTime: 'real_rectify_time', // 实际整改时间
  designatedReviewPerson: 'review_user_name', // 指定复查人
  reviewTime: 'reviewTime', // 复查时间
};

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
      handleImageSliderShow,
      ...restProps
    } = this.props;
    // console.log(name, selected, labelIndex);

    // const list = [];
    // const hasMore = true;
    // const loading = true;
    let cards = null;
    if (list.length) {
      // cards = list.map((item, i) => <DangerCard key={item.id} data={item} style={{ marginTop: i ? 14 : 0 }} />);
      cards = list.map((item, i) => (
        <DangerCard
          key={item.id}
          data={item}
          fieldNames={FIELD_NAMES}
          style={{ fontSize: 14, marginTop: i ? 14 : 0 }}
          onClickImage={handleImageSliderShow}
        />
      ));
    }

    return (
      <div className={styles.outer} data-id={companyId}>
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
