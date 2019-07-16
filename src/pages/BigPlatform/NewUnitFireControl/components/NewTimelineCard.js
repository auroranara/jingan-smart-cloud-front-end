import React from 'react';
import moment from 'moment';
import { Timeline, Spin } from 'antd';

import styles from './NewTimelineCard.less';
import TimelineItem from './TimelineItem';
import ImgSlider from './ImgSlider';
import MsgRead from './MsgRead';

// type 0 -> 日期 1 -> 时间
function getTime(time, type = 0) {
  if (!time) return;

  const m = moment(time);
  return type ? m.format('HH:mm:ss') : m.format('YYYY-MM-DD');
}

const SPANS = [5, 19];
const NO_DATA = '暂无信息';

export default function NewTimelineCard(props) {
  const { dataList, style, flowImg, showHead = true, loading = false, ...restProps } = props;
  const dataLength = dataList.filter(item => item.cardItems).length;

  const users = new Array(17).fill({
    id: '1',
    name: '张三丰',
  });

  const users2 = new Array(11).fill({
    id: '2',
    name: '张丰',
  });

  return (
    <div
      className={styles.container}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', ...style }}
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
              const { label, time, cardItems, msgInfo, repeat } = item;
              // const { read, unread } = msgInfo;
              const isLast = dataLength - 1 === index;
              const labelClassName = isLast ? styles.last : styles.line;
              const labelStyle =
                index < dataLength - 1
                  ? { color: '#0296B2', borderColor: '#0296B2' }
                  : dataLength - 1 === index
                    ? { color: '#0ff', borderColor: '#0ff' }
                    : { color: '#4f6793', borderColor: '#4f6793' };
              const timeStyle = isLast ? { color: '#fff' } : { color: '#8198B4' };
              return (
                <TimelineItem
                  spans={SPANS}
                  label={label}
                  day={getTime(time)}
                  hour={getTime(time, 1)}
                  key={index}
                  containerStyle={{ minHeight: '75px' }}
                  labelStyle={labelStyle}
                  timeStyle={timeStyle}
                >
                  {(cardItems || msgInfo) && (
                    <div className={styles.card}>
                      {cardItems &&
                        cardItems.length > 0 &&
                        cardItems.map((cardItem, i) => {
                          if (!cardItem) return null;
                          const { title, name, value, imgs, style, extra, extraStyle } = cardItem;
                          return title ? (
                            <p className={styles.title} key={i}>
                              {title}
                            </p>
                          ) : imgs && imgs.length > 0 && imgs[0] ? (
                            <ImgSlider picture={imgs} key={i} />
                          ) : (
                            <p key={i}>
                              <span className={labelClassName}>{name ? `${name}：` : ''}</span>
                              <span style={style || {}}>{value || NO_DATA}</span>
                              {extra && (
                                <span className={styles.extra} style={extraStyle || {}}>
                                  {extra}
                                </span>
                              )}
                            </p>
                          );
                        })}
                      {/* {repeat &&
                        repeat.repeatCount > 1 && (
                          <div className={styles.repeat} style={{ cursor: 'default' }}>
                            <Icon type="right" className={styles.arrow} />
                            该点位设备重复上报
                            {repeat.repeatCount}
                            次，
                            <br />
                            最近一次更新：
                            {moment(repeat.lastTime).format('YYYY-MM-DD HH:mm:ss')}
                          </div>
                        )} */}
                      {msgInfo && (
                        <div>
                          <p className={styles.title}>报警消息已发送成功</p>
                          <MsgRead read={users} unread={users2} />
                        </div>
                      )}
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
