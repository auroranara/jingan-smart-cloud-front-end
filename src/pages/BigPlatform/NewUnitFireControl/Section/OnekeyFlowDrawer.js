import React, { Fragment, PureComponent } from 'react';

import styles from './MaintenanceDrawer.less';
import Slider from '../components/Slider';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
import NewTimelineCard from '../components/NewTimelineCard';
import { vaguePhone } from '../utils';
import flowImg from '../imgs/flow_m.png';
import DynamicDrawerTop from '@/pages/BigPlatform/Operation/components/DynamicDrawerTop';

const ID = 'onekey-flow-drawer';

export default class OnekeyFlowDrawer extends PureComponent {
  state = { index: 0 };

  handleLeftClick = () => {
    const { handleParentChange, data } = this.props;
    const { index } = this.state;
    const list = Array.isArray(data) ? data : [];
    const videoList = list[index - 1].cameraMessage || [];
    this.setState(({ index }) => ({ index: index - 1 }));
    handleParentChange({ videoList });
  };

  handleRightClick = () => {
    const { handleParentChange, data } = this.props;
    const { index } = this.state;
    const list = Array.isArray(data) ? data : [];
    const videoList = list[index + 1].cameraMessage || [];
    this.setState(({ index }) => ({ index: index + 1 }));
    handleParentChange({ videoList });
  };

  render() {
    const {
      title,
      data,
      PrincipalPhone,
      PrincipalName,
      visible,
      phoneVisible,
      head = false,
      headProps = {},
      messageInformList = [],
      messageInformListLoading = false,
      ...restProps
    } = this.props;
    const { index } = this.state;
    const list = (Array.isArray(data) ? data : []).slice(0, 1);
    const length = list.length;
    const dataItem = list[0] || {};
    const read = messageInformList.filter(item => +item.status === 1).map(item => {
      return { ...item, id: item.user_id, name: item.add_user_name };
    });
    const unread = messageInformList.filter(item => +item.status === 0).map(item => {
      return { ...item, id: item.user_id, name: item.add_user_name };
    });
    const headContent = head && (
      <DynamicDrawerTop
        {...headProps}
        {...dataItem}
        read={read}
        unread={unread}
        msgSendLoading={messageInformListLoading}
      />
    );
    // 维保只有一个，故障可能是一个或多个
    let left = null;
    if (length) {
      const cards = list.map((item, i) => {
        const {
          nstatus, // undefined, '2' 发生 '0' 处理中 '1' 完成
          systemTypeValue,
          create_date,
          start_date,
          startByName,
          startByPhone,
          startCompanyName,
          end_date,
          work_order,
          finishByName,
          finishByPhone,
          finishCompanyName,
          sitePhotos,
          disaster_desc,
          createByName,
          createByPhone,
        } = item;
        const timelineList = [
          {
            label: '报修',
            time: create_date,
            cardItems: [
              // { title: systemTypeValue },
              // { name: '工单编号', value: work_order },
              // {
              //   name: '报修人员',
              //   value: `${createByName} ${vaguePhone(createByPhone, phoneVisible)}`,
              // },
              { title: `已报修成功` },
            ],
          },
          // { label: '消息发送', time: 1569548522158, msgInfo: true },
          {
            label: '开始处理',
            time: start_date,
            cardItems:
              nstatus === '0' || nstatus === '1'
                ? [
                    { title: `该工单已开始处理` },
                    { name: '处理单位', value: startCompanyName },
                    {
                      name: '处理人员',
                      value: `${startByName} ${vaguePhone(startByPhone, phoneVisible)}`,
                    },
                  ]
                : undefined,
          },
          {
            label: '处理完毕',
            time: end_date,
            cardItems:
              nstatus === '1'
                ? [
                    { title: `该工单已处理完毕` },
                    { name: '处理单位', value: finishCompanyName },
                    {
                      name: '处理人员',
                      value: `${finishByName} ${vaguePhone(finishByPhone, phoneVisible)}`,
                    },
                    { name: '结果反馈', value: disaster_desc },
                    { imgs: sitePhotos || [] },
                  ]
                : undefined,
          },
        ];
        return (
          <NewTimelineCard
            key={i}
            flowImg={flowImg}
            dataList={timelineList}
            style={{ width: `calc(100% / ${length})` }}
            showHead={!head}
          />
        );
      });
      left =
        length === 1 ? (
          <Fragment>
            {headContent}
            {cards}
          </Fragment>
        ) : (
          <Fragment>
            {headContent}
            <SwitchHead
              index={index}
              title="故障"
              lastIndex={length - 1}
              handleLeftClick={this.handleLeftClick}
              handleRightClick={this.handleRightClick}
            />
            <div className={styles.sliderContainer}>
              <Slider index={index} length={length} size={1}>
                {cards}
              </Slider>
            </div>
          </Fragment>
        );
    }
    return (
      <DrawerContainer
        id={ID}
        title={'报修处理动态'}
        zIndex={1388}
        destroyOnClose
        width={535}
        left={left}
        visible={visible}
        leftParStyle={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}
        {...restProps}
      />
    );
  }
}
