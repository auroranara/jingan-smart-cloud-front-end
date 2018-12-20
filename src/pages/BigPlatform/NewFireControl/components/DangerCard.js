import React, { Fragment } from 'react';
import moment from 'moment';
import { Col, Row } from 'antd';

import { getUrl } from '../utils';
import styles from './DangerCard.less';
import infoIcon from '../img/dangerInfo.png';

function getTime(stamp) {
  return moment(stamp).format('YYYY-MM-DD');
}

const OVER_DUE = '7';

export default function DangerCard(props) {
  const {
    data: {
      status, // 1 新建 2 待整改 3 待复查 4 已关闭 7 已超期
      desc,
      hiddenDangerRecordDto, // 图片
      report_time, // 上报时间
      report_user_name, // 上报人
      plan_rectify_time, // 计划整改时间
      real_rectify_time, // 实际整改时间
      rectify_user_name, // 整改人
      review_user_name, // 复查人
    },
      ...restProps
    } = props;

  const url = getUrl(hiddenDangerRecordDto);
  const isOverDue = status === OVER_DUE;

  return (
    <div className={styles.container} {...restProps}>
      <p className={isOverDue ? styles.descOverDue : styles.desc}>
        <span className={styles.icon} style={{ backgroundImage: `url(${infoIcon})` }} />
        {desc}
      </p>
      <Row>
        <Col span={6}>
          <div className={styles.img} style={{ backgroundImage: `url(${url})` }} />
        </Col>
        <Col span={18}>
          <p>上<span className={styles.space} />报：<span className={styles.info}>{`${report_user_name} ${getTime(report_time)}`}</span></p>
          {status === '1' || status === '2' || status === '7' ? (
            <p>计划整改：
              <span className={styles.info}>
                {rectify_user_name} <span className={isOverDue ? styles.overdue : null}>{getTime(plan_rectify_time)}</span>
              </span>
            </p>
          ) : (
            <Fragment>
              <p>实际整改：<span className={styles.info}>{`${rectify_user_name} ${getTime(real_rectify_time)}`}</span></p>
              <p>复<span className={styles.space} />查：<span className={styles.info}>{review_user_name}</span></p>
            </Fragment>
          )}
        </Col>
      </Row>
    </div>
  );
}
