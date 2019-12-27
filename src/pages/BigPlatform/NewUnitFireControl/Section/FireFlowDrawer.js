import React, { Fragment, PureComponent } from 'react';

import styles from './MaintenanceDrawer.less';
import Slider from '../components/Slider';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
import NewTimelineCard from '../components/NewTimelineCard';
import { vaguePhone } from '../utils';
// import flowImg from '../imgs/flow.png';
// import flowFaultImg from '../imgs/flow_m.png';
import DynamicDrawerTop from '@/pages/BigPlatform/Operation/components/DynamicDrawerTop';

const flowImg = 'http://data.jingan-china.cn/v2/chem/screen/flow.png';
const flowFaultImg = 'http://data.jingan-china.cn/v2/chem/screen/flow_m.png';
const ID = 'fire-flow-drawer';
const TITLES = ['报警', '故障'];
const LABELS = [['发生', '确认', '完成'], ['发生', '开始处理', '处理完毕']];
export default class FireFlowDrawer extends PureComponent {
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
      msgFlow,
      flowRepeat,
      phoneVisible,
      head = false,
      headProps = {},
      messageInformList = [],
      messageInformListLoading = false,
      phoneCount,
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
        msgType={msgFlow}
        msgSendLoading={messageInformListLoading}
        phoneCount={phoneCount}
      />
    );
    // 维保只有一个，故障可能是一个或多个
    let left = null;
    if (length) {
      const cards = list.map((item, i) => {
        const {
          nstatus, // undefined, '2' 发生 '0' 处理中 '1' 完成
          install_address,
          device_address,
          start_date,
          label,
          systemTypeValue,
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
          create_time,
          firstTime,
          num,
          lastTime,
        } = item;
        // const { times, lastreportTime } = flowRepeat;
        const timelineList = [
          {
            label: LABELS[msgFlow][0],
            time: firstTime,
            cardItems: [
              // { title: install_address || device_address },
              // { value: `${label || systemTypeValue} 发生${TITLES[msgFlow]}` },
              // {
              //   name: '安全管理员',
              //   value: PrincipalName
              //     ? [PrincipalName, vaguePhone(PrincipalPhone, phoneVisible)].join(' ')
              //     : null,
              // },
              { title: `${TITLES[msgFlow]}发生` },
            ],
            repeat: { repeatCount: +num || 0, lastTime: lastTime },
          },
          // { label: '消息发送', time: 1569548522158, msgInfo: true },
          {
            label: LABELS[msgFlow][1],
            time: start_date,
            cardItems:
              nstatus === '0' || nstatus === '1'
                ? [
                    msgFlow === 0
                      ? {
                          name: '确认该火警为',
                          value: +type === 1 ? '误报火警' : '真实火警',
                          style: { color: +type === 1 ? '#fff' : '#ff4848' },
                        }
                      : undefined,
                    msgFlow === 1 ? { title: `故障已开始处理` } : undefined,
                    { name: '处理单位', value: startCompanyName },
                    {
                      name: '处理人员',
                      value: `${startByName} ${vaguePhone(startByPhone, phoneVisible)}`,
                    },
                  ]
                : undefined,
          },
          {
            label: LABELS[msgFlow][2],
            time: end_date,
            cardItems:
              nstatus === '1'
                ? [
                    { title: `${msgFlow === 1 ? '故障' : '现场'}已处理完毕` },
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
            flowImg={msgFlow === 0 ? flowImg : flowFaultImg}
            dataList={timelineList}
            showHead={!head}
            style={{ width: `calc(100% / ${length})` }}
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
              title={TITLES[msgFlow]}
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
        title={`${TITLES[msgFlow]}处理动态`}
        destroyOnClose
        zIndex={1388}
        width={535}
        left={left}
        visible={visible}
        leftParStyle={{ display: 'flex', flexDirection: 'column', overflow: 'auto' }}
        {...restProps}
      />
    );
  }
}
