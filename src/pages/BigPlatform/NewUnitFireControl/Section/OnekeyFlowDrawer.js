import React, { Fragment, PureComponent } from 'react';

import styles from './MaintenanceDrawer.less';
import Slider from '../components/Slider';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
import NewTimelineCard from '../components/NewTimelineCard';
import { vaguePhone } from '../utils';
import flowImg from '../imgs/flow_m.png';

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
              { title: systemTypeValue },
              { name: '工单编号', value: work_order },
              {
                name: '报修人员',
                value: `${createByName} ${vaguePhone(createByPhone, phoneVisible)}`,
              },
            ],
          },
          // { label: '消息发送', time: 1569548522158, msgInfo: true },
          {
            label: '开始处理',
            time: start_date,
            cardItems:
              nstatus === '0' || nstatus === '1'
                ? [
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
          />
        );
      });
      left =
        length === 1 ? (
          cards
        ) : (
          <Fragment>
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
        width={535}
        left={left}
        visible={visible}
        {...restProps}
      />
    );
  }
}
