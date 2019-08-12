import React from 'react';
import moment from 'moment';
import { Timeline, Spin } from 'antd';

import styles from './NewTimelineCard.less';
import TimelineItem from './TimelineItem';
import ImgSlider from './ImgSlider';
import { getMaxNameLength } from '../utils';

// type 0 -> 日期 1 -> 时间
function getTime(time, type = 0) {
  if (!time) return;

  const m = moment(time);
  return type ? m.format('HH:mm:ss') : m.format('YYYY-MM-DD');
}

const SPANS = [5, 19];
const NO_DATA = '暂无信息';

export default function NewTimelineCard(props) {
  const { dataList, style, flowImg, showFirstAlarmDesc, showHead = true, loading = false, ...restProps } = props;
  const dataLength = dataList.filter(item => item.cardItems).length;

  return (
    <div
      className={styles.container}
      style={{ height: 'auto', display: 'flex', flexDirection: 'column', ...style }}
      {...restProps}
    >
      {showHead && (
        <div className={styles.head}>
          <div
            style={{
              background: `url(${flowImg}) no-repeat center center`,
              backgroundSize: '99% auto',
            }}
            className={styles.flow}
          />
        </div>
      )}
      <div className={styles.timeline}>
        <Spin spinning={loading} wrapperClassName={styles.spin}>
          <Timeline>
            {dataList.map((item, index) => {
              const { label, time, cardItems, msgInfo } = item;
              const isLast = dataLength - 1 === index;
              const labelClassName = isLast ? styles.last : styles.line;
              const labelStyle =
                index < dataLength - 1
                  ? { color: '#0296B2', borderColor: '#0296B2' }
                  : dataLength - 1 === index
                    ? { color: '#0ff', borderColor: '#0ff' }
                    : { color: '#4f6793', borderColor: '#4f6793' };
              const timeStyle = { color: isLast ? '#fff' : '#8198B4' };
              const containerStyle = { borderColor: isLast ? '#0ff' : '#0296B2' };
              // const maxNameLength = getMaxNameLength(cardItems);
              return (
                <TimelineItem
                  spans={SPANS}
                  label={label}
                  day={getTime(time)}
                  hour={getTime(time, 1)}
                  showFirstAlarmDesc={showFirstAlarmDesc && !index}
                  key={index}
                  containerStyle={{ minHeight: '75px', ...containerStyle }}
                  labelStyle={labelStyle}
                  timeStyle={timeStyle}
                >
                  {cardItems && (
                    <div className={styles.card}>
                      {cardItems &&
                        cardItems.length > 0 &&
                        cardItems.map((cardItem, i) => {
                          if (!cardItem) return null;
                          const { title, name, value, imgs, style, extra, extraStyle } = cardItem;
                          if (title)
                            return (
                              <p className={styles.title} key={i}>
                                {title}
                              </p>
                            );
                          const imgList = imgs ? imgs.filter(img => img) : [];
                          if (imgList.length)
                              return <ImgSlider key={i} picture={imgs} />;
                          if (name)
                              return (
                                <p key={i}>
                                  <span
                                    className={labelClassName}
                                    // style={{ marginRight: `${maxNameLength - name.length}em` }}
                                  >
                                    {name}：
                                  </span>
                                  <span style={style || {}}>{value || NO_DATA}</span>
                                  {extra && (
                                    <span className={styles.extra} style={extraStyle || {}}>
                                      {extra}
                                    </span>
                                  )}
                                </p>
                              );
                          return null;
                        })}
                      {/* {msgInfo && (
                        <div>
                          <p className={styles.title}>报警消息已发送成功</p>
                          <MsgRead read={users} unread={users2} />
                        </div>
                      )} */}
                    </div>
                  )}
                </TimelineItem>
              );
            })}
          </Timeline>
        </Spin>
      </div>
    </div>
  );
}
