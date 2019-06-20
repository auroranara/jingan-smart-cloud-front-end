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

const ID = 'fire-monitor-flow-drawer';
const TITLES = ['报警', '故障'];
const LABELS = [['发生', '确认', '完成'], ['故障发生', '开始处理', '处理完毕']];
export default class FireMonitorFlowDrawer extends PureComponent {
  state = { index: 0 };

  handleLeftClick = () => {
    const { fireId, faultId, msgFlow, getWarnDetail, getFaultDetail } = this.props;
    const { index } = this.state;
    const ids = msgFlow === 0 ? fireId : faultId;
    const { id, status } = ids[index - 1];
    const fetchFlow = msgFlow === 0 ? getWarnDetail : getFaultDetail;
    fetchFlow(status, 0, 1, { id, status });
    this.setState(({ index }) => ({ index: index - 1 }));
  };

  handleRightClick = () => {
    const { fireId, faultId, msgFlow, getWarnDetail, getFaultDetail } = this.props;
    const { index } = this.state;
    const ids = msgFlow === 0 ? fireId : faultId;
    const { id, status } = ids[index + 1];
    const fetchFlow = msgFlow === 0 ? getWarnDetail : getFaultDetail;
    fetchFlow(status, 0, 1, { id, status });
    this.setState(({ index }) => ({ index: index + 1 }));
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
      fireId,
      faultId,
      warnDetail: { list: warnDetailList },
      faultDetail: { list: faultDetailList },
      faultDetail,
      warnDetailLoading,
      faultDetailLoading,
      onClose,
      ...restProps
    } = this.props;
    const { index } = this.state;
    const list = msgFlow === 0 ? warnDetailList : faultDetailList;
    const ids = msgFlow === 0 ? fireId : faultId;
    const length = ids.length;

    let left = null;
    if (length) {
      const cards = ids.map((item, i) => {
        const {
          proceStatus, // undefined, '2' 发生 '0' 处理中 '1' 完成
          installAddress,
          deviceAddress,
          startDate,
          componentName,
          startByName,
          startByPhone,
          startCompanyName,
          endDate,
          type,
          executorName,
          phone,
          executorCompanyName,
          sitePhotos,
          disasterDesc,
          firstTime,
          fireChildren,
          lastTime,
        } = list[0] || {};
        const timelineList = [
          {
            label: LABELS[msgFlow][0],
            time: firstTime,
            cardItems: [
              { title: installAddress || deviceAddress },
              { value: `${componentName} 发生${TITLES[msgFlow]}` },
              {
                name: '安全管理员',
                value: PrincipalName
                  ? [PrincipalName, vaguePhone(PrincipalPhone, phoneVisible)].join(' ')
                  : null,
              },
            ],
            repeat: { repeatCount: fireChildren ? fireChildren.length : 0, lastTime },
          },
          // { label: '消息发送', time: 1569548522158, msgInfo: true },
          {
            label: LABELS[msgFlow][1],
            time: startDate,
            cardItems:
              proceStatus === '0' || proceStatus === '1'
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
            time: endDate,
            cardItems:
              proceStatus === '1'
                ? [
                    { name: '处理单位', value: executorCompanyName },
                    {
                      name: '处理人员',
                      value: `${executorName} ${vaguePhone(phone, phoneVisible)}`,
                    },
                    { name: '结果反馈', value: disasterDesc },
                    { imgs: sitePhotos || [] },
                  ]
                : undefined,
          },
        ];
        return (
          <NewTimelineCard
            key={i}
            loading={warnDetailLoading || faultDetailLoading}
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
            {head && <DynamicDrawerTop {...headProps} {...data[0]} />}
            {cards}
          </Fragment>
        ) : (
          <Fragment>
            {head && <DynamicDrawerTop {...headProps} {...data[0]} />}
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
        destroyOnClose
        leftParStyle={{ display: 'flex', flexDirection: 'column' }}
        onClose={() => {
          onClose();
          setTimeout(() => {
            this.setState({ index: 0 });
          }, 200);
        }}
        {...restProps}
      />
    );
  }
}
