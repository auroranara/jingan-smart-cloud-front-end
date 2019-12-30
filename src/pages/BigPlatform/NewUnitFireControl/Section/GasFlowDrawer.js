import React, { Fragment, PureComponent } from 'react';

import styles from './MaintenanceDrawer.less';
import Slider from '../components/Slider';
import DrawerContainer from '../components/DrawerContainer';
import SwitchHead from '../components/SwitchHead';
import NewTimelineCard from '../components/NewTimelineCard';
import { vaguePhone } from '../utils';
// import flowImg from '../../Gas/imgs/flow_alarm.png';
import DynamicDrawerTop from '@/pages/BigPlatform/Operation/components/DynamicDrawerTop';

const ID = 'gas-flow-drawer';
const flowImg = 'http://data.jingan-china.cn/v2/chem/screen/flow_alarm.png';
export default class GasFlowDrawer extends PureComponent {
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
      flowRepeat,
      head = false,
      headProps = {},
      ...restProps
    } = this.props;
    const { index } = this.state;
    const list = (Array.isArray(data) ? data : []).slice(0, 1);
    const length = list.length;

    // 判断是否是维保处理，维保处理动态时，显示流程图，故障处理动态时不显示流程图
    // const isMaintenance = title.includes('维保');

    // 维保只有一个，故障可能是一个或多个
    let left = null;
    if (length) {
      const cards = list.map((item, i) => {
        const {
          nstatus, // undefined, '2' 发生 '0' 处理中 '1' 完成
          area,
          location,
          realtime,
          start_date,
          startByName,
          startByPhone,
          startCompanyName,
          end_date,
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
            label: '报警发生',
            time: firstTime,
            cardItems: [
              { title: [area, location].join('') || '暂无位置信息' },
              { value: `${`可燃气体探测器`} 发生报警` },
              {
                name: '安全管理员',
                value: PrincipalName
                  ? [PrincipalName, vaguePhone(PrincipalPhone, phoneVisible)].join(' ')
                  : null,
              },
            ],
            repeat: { repeatCount: +num || 0, lastTime: lastTime },
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
            showHead={!head}
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
        title={'报警处理动态'}
        zIndex={1388}
        width={535}
        left={left}
        visible={visible}
        {...restProps}
      />
    );
  }
}
