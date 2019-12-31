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
const ID = 'fire-monitor-flow-drawer';
const TITLES = ['报警', '故障'];
const LABELS = [['发生', '确认', '完成'], ['发生', '开始处理', '处理完毕']];
export default class FireMonitorFlowDrawer extends PureComponent {
  state = { index: 0 };

  handleLeftClick = () => {
    const {
      hanldeClickSwitch,
    } = this.props;
    const { index } = this.state;
    hanldeClickSwitch(index - 1);
    this.setState(({ index }) => ({ index: index - 1 }));
    this.drawerTop.resetMsgRead();
  };

  handleRightClick = () => {
    const {
      hanldeClickSwitch,
    } = this.props;
    const { index } = this.state;
    hanldeClickSwitch(index + 1);
    this.setState(({ index }) => ({ index: index + 1 }));
    this.drawerTop.resetMsgRead();
  };

  onRef = ref => {
    this.drawerTop = ref;
  };

  render() {
    const {
      title,
      PrincipalPhone,
      PrincipalName,
      visible,
      msgFlow,
      flowRepeat,
      phoneVisible,
      fireId,
      faultId,
      warnDetail: { list: warnDetailList },
      faultDetail: { list: faultDetailList },
      faultDetail,
      warnDetailLoading,
      faultDetailLoading,
      onClose,
      handleShowFlowVideo,
      handleParentChange,
      messageInformList = [],
      messageInformListLoading = false,
      phoneCount,
      ...restProps
    } = this.props;
    const { index } = this.state;
    const list = msgFlow === 0 ? warnDetailList : faultDetailList;
    const ids = msgFlow === 0 ? fireId : faultId;
    const length = ids.length;

    const dataItem = list[0] || {};

    const head = true;
    const headProps = {
      ...dataItem,
      dynamicType: 0,
      showCompanyName: false,
      videoList: dataItem.cameraMessage || [],
      onCameraClick: () => {
        handleParentChange({ videoList: dataItem.cameraMessage || [] });
        handleShowFlowVideo();
      },
    };
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
        onRef={this.onRef}
        phoneCount={phoneCount}
      />
    );
    let left = null;
    if (length) {
      const cards = ids.map((item, i) => {
        const {
          proceStatus, // undefined, '2' 发生 '0' 处理中 '1' 完成
          createTime,
          installAddress,
          deviceAddress,
          startDate,
          componentName,
          startByName,
          startByPhone,
          startCompanyName,
          endDate,
          type,
          proceType,
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
            time: createTime,
            cardItems: [
              // { title: installAddress || deviceAddress },
              // { value: `${componentName} 发生${TITLES[msgFlow]}` },
              // {
              //   name: '安全管理员',
              //   value: PrincipalName
              //     ? [PrincipalName, vaguePhone(PrincipalPhone, phoneVisible)].join(' ')
              //     : null,
              // },
              { title: `${TITLES[msgFlow]}发生` },
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
                          value: +proceType === 1 ? '误报火警' : '真实火警',
                          style: { color: +proceType === 1 ? '#fff' : '#ff4848' },
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
            time: endDate,
            cardItems:
              proceStatus === '1'
                ? [
                    { title: `${msgFlow === 1 ? '故障' : '现场'}已处理完毕` },
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
            {headContent}
            {cards}
          </Fragment>
        ) : (
          <Fragment>
            <SwitchHead
              index={index}
              title={TITLES[msgFlow]}
              lastIndex={length - 1}
              handleLeftClick={this.handleLeftClick}
              handleRightClick={this.handleRightClick}
            />
            {headContent}
            <div className={styles.sliderContainer} style={{ height: 'auto' }}>
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
        leftParStyle={{ overflow: 'auto' }}
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
