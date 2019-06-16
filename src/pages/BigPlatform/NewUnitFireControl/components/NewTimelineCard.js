import React from 'react';
import moment from 'moment';
import { Timeline, Icon } from 'antd';

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
  const { dataList, style, flowImg,showHead = true, ...restProps } = props;

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
      {showHead&&(
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
        <Timeline>
          {dataList.map((item, index) => {
            const { label, time, cardItems, msgInfo, repeat } = item;
            // const { read, unread } = msgInfo;
            return (
              <TimelineItem
                spans={SPANS}
                label={label}
                day={getTime(time)}
                hour={getTime(time, 1)}
                key={index}
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
                            {name ? `${name}：` : ''}
                            <span style={style || {}}>{value || NO_DATA}</span>
                            {extra && (
                              <span className={styles.extra} style={extraStyle || {}}>
                                {extra}
                              </span>
                            )}
                          </p>
                        );
                      })}
                    {repeat &&
                      repeat.repeatCount > 1 && (
                        <div className={styles.repeat} style={{ cursor: 'default' }}>
                          {/* <Icon type="right" className={styles.arrow} /> */}
                          该点位设备重复上报
                          {repeat.repeatCount}
                          次，
                          <br />
                          最近一次更新：
                          {moment(repeat.lastTime).format('YYYY-MM-DD HH:mm:ss')}
                        </div>
                      )}
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
      </div>
    </div>
  );
}
