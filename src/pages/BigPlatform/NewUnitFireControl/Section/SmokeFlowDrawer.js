import React, { Fragment, PureComponent } from 'react';

import styles from './MaintenanceDrawer.less';
import Slider from '../components/Slider';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
import NewTimelineCard from '../components/NewTimelineCard';
import { vaguePhone } from '../utils';
import flowImg from '../imgs/flow.png';
import flowFaultImg from '../imgs/flow_m.png';
import DynamicDrawerTop from '@/pages/BigPlatform/Operation/components/DynamicDrawerTop';

const ID = 'smoke-flow-drawer';
const TITLES = ['报警', '故障'];
const LABELS = [['发生', '确认', '完成'], ['故障发生', '开始处理', '处理完毕']];
export default class SmokeFlowDrawer extends PureComponent {
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
      ...restProps
    } = this.props;
    const { index } = this.state;
    const list = (Array.isArray(data) ? data : []).slice(0, 1);
    const length = list.length;

    // 判断是否是运维处理，运维处理动态时，显示流程图，故障处理动态时不显示流程图
    // const isMaintenance = title.includes('运维');

    // 运维只有一个，故障可能是一个或多个
    let left = null;
    if (length) {
      const cards = list.map((item, i) => {
        const {
          nstatus, // undefined, '2' 发生 '0' 处理中 '1' 完成
          area,
          location,
          realtime,
          start_date,
          faultName,
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
        } = item;
        // const { times, lastreportTime } = flowRepeat;
        const timelineList = [
          {
            label: LABELS[msgFlow][0],
            time: firstTime,
            cardItems: [
              { title: [area, location].join('') || '暂无位置信息' },
              msgFlow === 0
                ? { value: `${`独立烟感探测器`} 发生${TITLES[msgFlow]}` }
                : {
                    value: `${`独立烟感探测器`} 发生${TITLES[msgFlow]}`,
                    extra: faultName || undefined,
                    extraStyle: { color: '#ffb400' },
                  },
              {
                name: '安全管理员',
                value: `${PrincipalName} ${vaguePhone(PrincipalPhone, phoneVisible)}`,
              },
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
            style={{ width: `calc(100% / ${length})` }}
            showHead={!head}
          />
        );
      });
      left =
        length === 1 ? (
          <Fragment>
            {head && <DynamicDrawerTop headProps={headProps} />}
            {cards}
          </Fragment>
        ) : (
          <Fragment>
            {head && <DynamicDrawerTop headProps={headProps} />}
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
        zIndex={1388}
        width={535}
        left={left}
        visible={visible}
        {...restProps}
      />
    );
  }
}
