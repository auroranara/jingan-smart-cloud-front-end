import React, { Fragment } from 'react';
import moment from 'moment';

import { NewTimelineCard } from '@/pages/BigPlatform/NewUnitFireControl/components/Components';
import { vaguePhone } from '@/pages/BigPlatform/NewUnitFireControl/utils';
import { DynamicDrawerTop } from './Components';

// const TITLES = ['报警', '故障'];
const LABELS = [['发生', '确认', '完成'], ['发生', '开始处理', '处理完毕']];
export default function GasFlow(props) {
  const {
    data: {
      order,
      msgFlow=1,
      phoneVisible,
      headProps = {},
      messageInformList = [],
      messageInformListLoading = false,
    },
  } = props;

  const list = (Array.isArray(order) ? order : []).slice(0, 1);
  const length = list.length;
  const dataItem = list[0] || {};
  const read = messageInformList.filter(item => +item.status === 1).map(item => {
    return { ...item, id: item.user_id, name: item.add_user_name };
  });
  const unread = messageInformList.filter(item => +item.status === 0).map(item => {
    return { ...item, id: item.user_id, name: item.add_user_name };
  });

  const headContent = (
    <DynamicDrawerTop
      {...headProps}
      {...dataItem}
      hideInfo
      read={read}
      unread={unread}
      msgType={msgFlow}
      msgSendLoading={messageInformListLoading}
    />
  );

  let cards = null;
  if (length) {
    cards = list.map((item, i) => {
      const {
        nstatus, // undefined, '2' 发生 '0' 处理中 '1' 完成
        start_date,
        startByName,
        startByPhone,
        startCompanyName,
        end_date,
        type,
        finishByName,
        finishByPhone,
        finishCompanyName,
        sitePhotos,
        disaster_desc,
        firstTime,
        num,
        lastTime,
        limit_value,
        realtime_data,
      } = item;
      const timelineList = [
        {
          label: LABELS[msgFlow][0],
          time: firstTime,
          cardItems: [
            { title: '发生报警' },
            { name: '浓度最新报警值', style: { color: 'rgb(248,51,41)' }, value: `${realtime_data}%`, extra: `(≥${limit_value}%)` },
            { name: '最近报警时间', value: moment(lastTime).format('YYYY-MM-DD HH:mm:ss') },
          ],
        },
        {
          label: LABELS[msgFlow][1],
          time: start_date,
          cardItems:[
            { title: '处理报警' },
            { name: '处理人员', value: `${startByName} ${vaguePhone(startByPhone, phoneVisible)}` },
          ],
        },
        {
          label: LABELS[msgFlow][2],
          time: end_date,
          cardItems:[
            { title: '报警已处理完毕' },
            {
              name: '处理人员',
              value: `${finishByName} ${vaguePhone(finishByPhone, phoneVisible)}`,
            },
            { name: '问题描述', value: disaster_desc },
            { imgs: sitePhotos || [] },
          ],
        },
      ];
      const sts = nstatus ? +nstatus : 2;
      if (sts === 2) // 删除第二步的cardItems(进展到第一步时)
        delete timelineList[1].cardItems;
      if (sts === 2 || sts === 0) // 删除第三步的cardItems(进展到第一或第二步时)
        delete timelineList[2].cardItems;

      return (
        <NewTimelineCard
          key={i}
          dataList={timelineList}
          showHead={false}
          showFirstAlarmDesc
          style={{ width: `calc(100% / ${length})` }}
        />
      );
    });
  }
  return (
    <Fragment>
      {headContent}
      {cards}
    </Fragment>
  );
}
