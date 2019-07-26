import React, { Fragment, PureComponent } from 'react';

import styles from './MaintenanceDrawer.less';
import Slider from '../components/Slider';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
// import FireDynamicCard from '../components/FireDynamicCard';
import DynamicDrawerTop from '@/pages/BigPlatform/Operation/components/DynamicDrawerTop';
import { vaguePhone } from '../../NewUnitFireControl/utils';
import NewTimelineCard from '../../NewUnitFireControl/components/NewTimelineCard';

const ID = 'maintenance-drawer';
const TITLES = ['火警', '故障'];
const LABELS = [['发生', '确认', '完成'], ['发生', '开始处理', '处理完毕']];

export default class MaintenanceDrawer extends PureComponent {
  state = { index: 0, dataList: {} };

  handleLeftClick = () => {
    const { fetchMessageInformList, fetchCameraMessage, dataId, data } = this.props;
    const { index } = this.state;
    const id = dataId[index - 1];
    const dataList = data[index - 1];
    fetchMessageInformList({ dataId: id });
    fetchCameraMessage({ id, reportType: 4 });
    this.setState(({ index }) => ({ index: index - 1, dataList: dataList }));
  };

  handleRightClick = () => {
    const { fetchMessageInformList, fetchCameraMessage, dataId, data } = this.props;
    const { index } = this.state;
    const id = dataId[index + 1];
    const dataList = data[index + 1];
    fetchMessageInformList({ dataId: id });
    fetchCameraMessage({ id, reportType: 4 });
    this.setState(({ index }) => ({ index: index + 1, dataList: dataList }));
  };

  render() {
    const {
      title,
      // type,
      data,
      companyName,
      onClose,
      msgFlow,
      head = false,
      phoneVisible,
      headProps = {},
      messageInformList = [],
      messageInformListLoading = false,
      // videoList,
      ...restProps
    } = this.props;

    const { index, dataList } = this.state;

    const list = Array.isArray(data) ? data : [];

    const length = list.length;
    // const dataItem = list[0] || {};
    const read = messageInformList.filter(item => +item.status === 1).map(item => {
      return { ...item, id: item.user_id, name: item.add_user_name };
    });
    const unread = messageInformList.filter(item => +item.status === 0).map(item => {
      return { ...item, id: item.user_id, name: item.add_user_name };
    });

    const newHeadProps = Object.keys(dataList).length === 0 ? headProps : dataList;
    console.log('headProps', headProps);

    const {
      company_id,
      company_name,
      device_name,
      area,
      location,
      num,
      firstTime,
      lastTime,
    } = newHeadProps;
    const headContent = head && (
      <DynamicDrawerTop
        {...headProps}
        companyId={company_id}
        companyName={company_name}
        sdeviceName={device_name}
        area={area}
        num={num}
        firstTime={firstTime}
        lastTime={lastTime}
        location={location}
        read={read}
        unread={unread}
        msgType={msgFlow}
        msgSendLoading={messageInformListLoading}
      />
    );

    // 维保只有一个，故障可能是一个或多个
    let left = null;
    if (length > 0) {
      const cards = list.map((item, i) => {
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
          realtime,
        } = item;

        const timelineList = [
          {
            label: LABELS[msgFlow][0],
            time: firstTime,
            cardItems: [{ title: `${TITLES[msgFlow]}发生` }],
            repeat: { repeatCount: +num || 0, realtime: realtime },
          },
          {
            label: LABELS[1][1],
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
            // flowImg={msgFlow === 0 ? flowImg : flowFaultImg}
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
            <SwitchHead
              index={index}
              title={TITLES[msgFlow]}
              lastIndex={length - 1}
              handleLeftClick={this.handleLeftClick}
              handleRightClick={this.handleRightClick}
            />
            {headContent}
            <div className={styles.sliderContainer}>
              <Slider index={index} length={length} size={1}>
                {cards}
              </Slider>
            </div>
          </Fragment>
        );
    }
    if (length === 0)
      left = <div style={{ color: '#fff', textAlign: 'center' }}> 暂无处理流程 </div>;

    return (
      <DrawerContainer
        id={ID}
        title={title}
        zIndex={2000}
        destroyOnClose
        width={535}
        left={left}
        onClose={() => {
          this.setState({ index: 0, dataList: {} });
          onClose();
        }}
        {...restProps}
      />
    );
  }
}
