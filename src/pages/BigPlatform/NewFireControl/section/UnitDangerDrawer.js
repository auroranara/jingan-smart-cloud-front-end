import React, { Fragment } from 'react';
import { Icon } from 'antd';

import styles from './UnitDangerDrawer.less';
import DangerCard from '@/jingan-components/HiddenDangerCard';
import {
  // DangerCard,
  DrawerContainer,
} from '../components/Components';
// import { sortDangerRecords } from '../utils';

// const LIST = [...Array(10).keys()].map(i => ({
//   id: i,
//   desc: '皮带松弛，部件老化',
//   report: '李大山 2018-7-18',
//   reform: '周建国 2017-7-24',
//   review: '刘琪 2019-1-1',
// }));

const TYPE = 'unitDanger';
const TITLES = ['隐患数量', '已超期', '待整改', '待复查'];
const STATUS = [['-1'], ['7'], ['1', '2'], ['3']];
STATUS['-1'] = ['-1'];
const COLORS = ['255,255,255', '232,103,103', '246,181,78', '42,139,213'];
const NO_DATA = '暂无信息';
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

export default function UnitDangerDrawer(props) {
  const {
    loading,
    hasMore,
    labelIndex=0,
    visible,
    companyId,
    data: {
      dangerList=[],
      dangerRecords=[],
    },
    fetchDangerRecords,
    handleLabelClick,
    handleImageSliderShow,
    handleDrawerVisibleChange,
    ...restProps
  } = props;

  const selected = dangerList.find(item => item.companyId === companyId) || {};
  const { companyName, total=0, hasExtended: overdue=0, afterRectification: rectify=0, toReview: review=0 } = selected;
  // const filteredRecords = labelIndex ? dangerRecords.filter(({ status }) => STATUS[labelIndex].includes(status)) : dangerRecords;
  // sortDangerRecords(filteredRecords, STATUS[labelIndex][0]);

  let cards;
  const list = dangerRecords;
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

  const left = (
    <Fragment>
      <p className={styles.name}>{companyName || NO_DATA}</p>
      <div className={styles.spans}>
        {[total, overdue, rectify, review].map((n,i) => (
          <span className={labelIndex === i ? styles.selected : styles.item} key={i} onClick={e => handleLabelClick(companyId, i)}>
            {`${TITLES[i]}：`}
            <span style={{ color: `rgb(${COLORS[i]})` }} >
              {n}
            </span>
          </span>
          ))}
      </div>
      <div className={styles.cardContainer}>
        {list.length ? cards : loading ? null : <p className={styles.none}>暂无隐患信息</p>}
          {/* {loading ? '加载中...' : cards} */}
          {hasMore && (
            <p
              className={!list.length && loading ? styles.none : loading ? styles.more : styles.more1}
              onClick={loading ? null : e => fetchDangerRecords(companyId, labelIndex)}
            >
              {loading ? <Icon type="sync" spin /> : <Icon type="double-right" className={styles.doubleRight} />}
            </p>
          )}
      </div>
    </Fragment>
  )

  return (
    <DrawerContainer
      isTop
      title="隐患列表"
      width={540}
      visible={visible}
      left={left}
      onClose={() => handleDrawerVisibleChange(TYPE)}
      {...restProps}
    />
  );
}
