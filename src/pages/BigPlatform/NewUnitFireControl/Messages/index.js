import React, { PureComponent } from 'react';
import { Divider, Icon } from 'antd';
import Ellipsis from 'components/Ellipsis';
import NewSection from '@/components/NewSection';
import moment from 'moment';

import { getMsgIcon, vaguePhone, CYAN_STYLE } from '../utils';
// import DescriptionList from 'components/DescriptionList';
import styles from './index.less';
import {
  alarmIcon,
  dangerIcon,
  inspectIcon,
  outdateIcon,
} from '@/pages/BigPlatform/GasStation/imgs/links';

const DEFAULT_SHOW_TYPES = [
  1,
  2,
  3,
  4,
  7,
  9,
  11,
  13,
  14,
  15,
  16,
  17,
  18,
  32,
  36,
  37,
  38,
  40,
  42,
  43,
  44,
  46,
  47,
  48,
  49,
  50,
  51,
];
const MAX_NAME_LENGTH = 4;
const TYPES = [
  1, // 发生监管
  2, // 联动
  3, // 反馈
  4, // 屏蔽
  7, // 主机报警
  9, // 主机报障
  11, // 一键报修
  13, // 安全巡查
  14, // 上报隐患
  15, // 整改隐患
  16, // 重新整改隐患
  17, // 复查隐患
  18, // 维保巡检
  32, // 电气火灾报警
  36, // 水系统报警
  37, // 水系统恢复
  38, // 独立烟感报警
  39, // 可燃气体报警
  40, // 独立烟感故障
  42, // 电气火灾失联
  43, // 电气火灾失联恢复
  44, // 电气火灾报警恢复
  45, // 燃气报警恢复
  46, // 独立烟感失联
  47, // 独立烟感失联恢复
  48, // 水系统失联
  49, // 水系统失联恢复
  50, // 独立烟感报警恢复
  51, // 独立烟感故障恢复
  54, // 可燃气体失联
  55, // 可燃气体失联恢复
];

const WATER_LABELS = {
  101: '消火栓系统',
  102: '喷淋系统',
  103: '水池/水箱',
};

const ICON_LIST = [
  { icon: inspectIcon, types: [13, 18] },
  { icon: dangerIcon, types: [14, 15, 16, 17] },
  { icon: alarmIcon, types: [1, 2, 3, 4, 7, 9, 11, 32, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55] },
];

const WATER_TITLES = {
  36: '报警',
  37: '报警恢复',
  48: '失联',
  49: '失联恢复',
};

const formatTime = time => {
  const diff = moment().diff(moment(time));
  if (diff > 2 * 24 * 60 * 60 * 1000) {
    return moment(time).format('YYYY-MM-DD HH:mm');
  } else if (diff > 24 * 60 * 60 * 1000) {
    return `昨日 ${moment(time).format('HH:mm')}`;
  } else if (diff > 60 * 60 * 1000) {
    return `今日 ${moment(time).format('HH:mm')}`;
  } else if (diff > 60 * 1000) {
    return `${moment.duration(diff).minutes() + 1}分钟前`;
  } else {
    return `刚刚`;
  }
};

const getEmptyData = () => {
  return '暂无数据';
};
/**
 * description: 大屏消息
 * author: zkg
 * date: 2018年12月04日
 */
// const { Description } = DescriptionList;
export default class Messages extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      thisMin: '',
      // 是否展开报警信息
      isExpanded: false,
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ thisMin: moment().format('YYYY-MM-DD HH:mm') });
    }, 120000);
  }

  handleClickExpandButton = () => {
    this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }));
  };

  renderMsg = (msg, index) => {
    const {
      cssType,
      showCompanyInMsg,
      handleParentChange,
      fetchData,
      typeClickList,
      // showTypes=DEFAULT_SHOW_TYPES,
      handleViewDangerDetail,
      // handleClickMessage,
      // handleFaultClick,
      // handleFireMessage,
      // handleWorkOrderCardClickMsg,
      // handleViewWater,
      handleClickMsgFlow,
      phoneVisible,
      handleClickElecMsg,
      handleClickSmoke,
      handleClickWater,
    } = this.props;
    const {
      type,
      title,
      messageFlag,
      // proceCompany,
      addTime,
      address,
      reportUser,
      pointName,
      dangerDesc,
      installAddress,
      reviewUser,
      remark,
      reviewResult,
      loopNumber,
      partNumber,
      componentType,
      rectifyMeasures,
      rectifyUser,
      // resultFeedBack,
      // proceUser,
      // proceContent,
      checkResult,
      checkUser,
      score,
      maintenanceCompany,
      // maintenanceUser,
      // addTimeStr,
      deviceType,
      area,
      location,
      paramName,
      condition,
      virtualName,
      messageContent,
      count,
      // newTime,
      component,
      unitTypeName,
      createBy,
      createByPhone,
      systemTypeValue,
      workOrder,
      realtimeData,
      // num,
      lastTime,
      isOver,
      cameraMessage,
      faultName,
      firstTime,
      desc,
      realtimeVal,
      enterSign,
      unit,
      limitVal,
      deviceId,
      userMessage = [],
      checkUserPhone,
      accompany = [],
      companyName,
      companyId,
    } = msg;

    const repeatCount = count;
    const lastReportTime = moment(+isOver === 0 ? addTime : lastTime).format('YYYY-MM-DD HH:mm');
    const occurData = [
      {
        create_time: firstTime,
        create_date: addTime,
        firstTime,
        lastTime: addTime,
        area,
        location,
        install_address: installAddress,
        label: componentType,
        work_order: workOrder,
        systemTypeValue,
        createByName: createBy,
        createByPhone,
        faultName,
        realtime: firstTime,
        component_region: loopNumber,
        component_no: partNumber,
      },
    ];
    const restParams = [cameraMessage, occurData, companyId];
    const msgFlag =
      messageFlag && (messageFlag[0] === '[' ? JSON.parse(messageFlag)[0] : messageFlag);
    const param = {
      deviceId,
      dataId: +isOver === 0 ? msgFlag : undefined,
      id: +isOver !== 0 ? msgFlag : undefined,
      companyId: companyId || undefined,
      companyName: companyName || undefined,
      component: component || undefined,
      unitTypeName: unitTypeName || undefined,
    };
    let msgSettings = {};

    const elecMsg = {
      32: {
        elecTitle: '电气火灾-报警',
        elecContent: `${paramName}报警${realtimeVal + unit}（参考值≤${limitVal + unit}）`,
      },
      44: { elecTitle: '电气火灾-报警恢复', elecContent: `${paramName}报警现已恢复正常` },
      42: { elecTitle: '电气火灾-失联', elecContent: '设备状态失联' },
      43: { elecTitle: '电气火灾-失联恢复', elecContent: '设备状态已恢复正常' },
    };
    const smokeTitle = {
      46: '独立烟感-失联',
      47: '独立烟感-失联恢复',
      50: '独立烟感-报警恢复',
    };
    const gasTitle = {
      45: '可燃气体-报警恢复',
      54: '可燃气体-失联',
      55: '可燃气体-失联恢复',
    };
    const gasContent = {
      45: `已恢复正常，当前值${desc || paramName}${realtimeData || realtimeVal}${unit}`,
      54: '设备状态失联',
      55: '设备失联状态恢复正常',
    };

    [1, 2, 3, 4].forEach(item => {
      // 发生监管\联动\反馈\屏蔽
      msgSettings = {
        ...msgSettings,
        [item.toString()]: {
          items: [
            { name: '位置', value: installAddress },
            {
              name: '回路号',
              value:
                loopNumber || loopNumber === 0 ? `${loopNumber}回路${partNumber}号` : undefined,
            },
            { name: '部件类型', value: componentType },
          ],
          isRepeat: false,
        },
      };
    });
    msgSettings = {
      // 安全巡查
      ...msgSettings,
      '13': {
        // 安全巡查
        items: [
          { name: '检查点', value: pointName },
          {
            name: '检查人',
            value: () => {
              return (
                <Ellipsis lines={1} tooltip>
                  {[{ createByName: checkUser, createByPhone: checkUserPhone }, ...accompany]
                    .map(
                      item =>
                        `${item.createByName} ${vaguePhone(item.createByPhone, phoneVisible) || ''}`
                    )
                    .join('、')}
                </Ellipsis>
              );
            },
          },
          { name: '巡查结果', value: checkResult },
        ],
      },
      '14': {
        // 上报隐患
        onClick: () => {
          handleViewDangerDetail({ id: messageFlag });
        },
        items: [
          { name: '检查点', value: pointName },
          { name: '隐患描述', value: dangerDesc },
          { name: '上报人', value: reportUser },
        ],
      },
      '17': {
        // 复查隐患
        onClick: () => {
          handleViewDangerDetail({ id: messageFlag });
        },
        items: [
          { name: '检查点', value: pointName },
          { name: '隐患描述', value: dangerDesc },
          { name: '复查人', value: reviewUser },
          { name: '复查结果', value: reviewResult },
          { name: '备注', value: remark },
        ],
      },
      '18': {
        // 维保巡检
        onClick: () => {
          handleParentChange({ maintenanceCheckDrawerVisible: true });
          fetchData(messageFlag);
        },
        items: [
          { name: '维保单位', value: maintenanceCompany },
          {
            name: '维保人',
            // value: Array.isArray(maintenanceUser) ? maintenanceUser.join('，') : maintenanceUser,
            value: () => {
              return (
                <Ellipsis lines={1} tooltip>
                  {userMessage
                    .map(
                      item =>
                        `${item.createByName} ${vaguePhone(item.createByPhone, phoneVisible) || ''}`
                    )
                    .join('、')}
                </Ellipsis>
              );
            },
          },
          { name: '消防设施评分', value: score },
        ],
      },
      '39': { // 可燃气体报警
        onClick: () => {
          handleClickMsgFlow(param, 2, 0, ...restParams);
        },
        items: [
          // { name: '报警值', value: `${desc || paramName}(${realtimeData || realtimeVal}%)` },
          { value: `当前值${desc || paramName}${realtimeData || realtimeVal}${unit}（参考值≤${limitVal}${unit}）`, style: CYAN_STYLE },
          { name: '所在区域', value: area },
          { name: '所在位置', value: location },
        ],
        showMsg: true,
        isRepeat: true,
      },
      '11': {
        // 一键报修
        onClick: () => {
          handleClickMsgFlow({ id: msgFlag }, 3, 1, ...restParams);
        },
        items: [
          { value: systemTypeValue },
          { name: '工单编号', value: workOrder },
          {
            name: '报修人员',
            value: createBy + ' ' + (vaguePhone(createByPhone, phoneVisible) || ''),
          },
        ],
        showMsg: true,
      },
      '51': {
        // 独立烟感故障恢复
        onClick: () => {
          handleClickSmoke(3);
        },
        items: [{ name: '所在区域', value: area }, { name: '所在位置', value: location }],
      },
    };
    [7, 9].forEach(item => {
      // 主机报警, 报障
      msgSettings = {
        ...msgSettings,
        [item.toString()]: {
          onClick:
            enterSign === '1'
              ? () => {
                  handleClickMsgFlow(param, 0, +item === 7 ? 0 : 1, ...restParams);
                }
              : undefined,
          items: [
            { name: '位置', value: address },
            { name: '回路号', value: component },
            { name: '部件类型', value: unitTypeName },
          ],
          showMsg: true,
          isRepeat: true,
        },
      };
    });
    [15, 16].forEach(item => {
      // 整改隐患, 重新整改隐患
      msgSettings = {
        ...msgSettings,
        [item.toString()]: {
          onClick: () => {
            handleViewDangerDetail({ id: messageFlag });
          },
          items: [
            { name: '检查点', value: pointName },
            { name: '隐患描述', value: dangerDesc },
            { name: '整改人', value: rectifyUser },
            { name: '整改措施', value: rectifyMeasures },
          ],
        },
      };
    });
    [38, 40].forEach(item => {
      // 独立烟感报警, 故障
      msgSettings = {
        ...msgSettings,
        [item.toString()]: {
          onClick: () => {
            // if (+item === 38) handleClickMsgFlow(param, 1, 0, ...restParams);
            // else if (+item === 40)
            handleClickMsgFlow(param, 1, +item === 38 ? 0 : 1, ...restParams);
          },
          items: [{ name: '所在区域', value: area }, { name: '所在位置', value: location }],
          showMsg: true,
          isRepeat: true,
        },
      };
    });
    [32, 42, 43, 44].forEach(item => {
      // 电气火灾报警, 电气火灾失联, 电气火灾失联恢复, 电气火灾报警恢复
      msgSettings = {
        ...msgSettings,
        [item.toString()]: {
          onClick: () => {
            handleClickElecMsg(deviceId, paramName, companyId, cameraMessage);
          },
          otherTitle: `【${elecMsg[item].elecTitle}】`,
          items: [
            { value: elecMsg[item].elecContent, style: { color: '#0ff' } },
            { name: '所在区域', value: area },
            { name: '所在位置', value: location },
          ],
        },
      };
    });
    [46, 47, 50].forEach(item => {
      // 独立烟感失联, 独立烟感失联恢复, 独立烟感报警恢复
      msgSettings = {
        ...msgSettings,
        [item.toString()]: {
          onClick: () => {
            handleClickSmoke(item === 46 ? 2 : 3);
          },
          otherTitle: `【${smokeTitle[item]}】`,
          items: [{ name: '所在区域', value: area }, { name: '所在位置', value: location }],
        },
      };
    });
    [36, 37, 48, 49].forEach(item => { // 水系统报警，报警恢复，失联, 失联恢复
      msgSettings = {
        ...msgSettings,
        [item.toString()]: {
          onClick: () => {
            handleClickWater(
              item === 48 ? 1 : item === 36 ? 0 : 2,
              [101, 102, 103].indexOf(+deviceType),
              deviceId,
              companyId,
              cameraMessage
            );
          },
          otherTitle: `【${WATER_LABELS[deviceType]}-${WATER_TITLES[item]}】`,
          items: [
            { name: '所在区域', value: area },
            { name: '所在位置', value: location },
          ],
        },
      };
    });
    [45, 54, 55].forEach(item => { // 可燃气体
      msgSettings = {
        ...msgSettings,
        [item]: {
          onClick: () => { handleClickMsgFlow(param, 2, 0, ...restParams); },
          otherTitle: `【${gasTitle[type]}】`,
          items: [
            { value: gasContent[item], style: CYAN_STYLE },
            { name: '所在区域', value: area },
            { name: '所在位置', value: location },
          ],
        },
      };
    });

    const msgClassName = `msgItem${cssType ? cssType : ''}`;
    const innerClassName = cssType ? styles.msgInner : undefined;
    const typeIcon = cssType ? (
      <span
        className={styles.typeIcon}
        style={{ backgroundImage: `url(${getMsgIcon(type, ICON_LIST)})` }}
      />
    ) : null;
    const msgTime = formatTime(addTime);
    const firstComponent = cssType ? (
      <Divider>
        <span className={index ? styles.greyTime : undefined}>{msgTime}</span>
      </Divider>
    ) : (
      <div className={styles.msgTime}>{msgTime}</div>
    );

    const { onClick, items, isRepeat, showMsg, otherTitle } = msgSettings[type] || {
      items: [],
    };

    let nameIndex = items.findIndex(({ name }) => name);
    if (nameIndex === -1) nameIndex = items.length;
    if (showCompanyInMsg)
      items.splice(nameIndex, 0, { name: '单位', value: companyName || '无名单位' });
    const handleClick = !typeClickList || typeClickList.includes(+type) ? onClick : undefined;
    const detailBtn = cssType ? (
      <Icon type="right" className={styles.detailArrow} />
    ) : (
      <a className={styles.detailBtn} onClick={handleClick}>
        详情
        <Icon type="double-right" />
      </a>
    );

    return (
      <div className={styles[msgClassName]} key={index}>
        {firstComponent}
        {handleClick && detailBtn}
        {/* <div className={styles.msgTime}>{formatTime(addTime)}</div> */}
        <div
          className={innerClassName}
          style={{ cursor: cssType && handleClick ? 'pointer' : 'auto' }}
          onClick={cssType ? handleClick : null}
        >
          {typeIcon}
          <div className={styles.msgType}>
            {otherTitle || title}
            {showMsg && (
              <span>
                ——
                {messageContent}
              </span>
            )}
          </div>
          {items.map((item, i) => {
            const { name, value, style } = item;
            return (
              <div className={styles.msgBody} key={i}>
                {name ? (
                  cssType ? (
                    <span
                      className={styles.msgName}
                      style={{ marginRight: `${MAX_NAME_LENGTH - name.length}em` }}
                    >
                      {name}：
                    </span>
                  ) : (
                    `${name}：`
                  )
                ) : (
                  ''
                )}
                <div style={{ flex: 1, ...style }}>
                  {typeof value === 'function' ? value() : value || getEmptyData()}
                </div>
              </div>
            );
          })}
          {isRepeat &&
            // repeatCount &&
            +repeatCount > 1 && (
              <div className={styles.msgRepeatType}>
                重复上报
                {repeatCount}
                次，最近一次更新时间：
                {lastReportTime}
              </div>
            )}
        </div>
      </div>
    );
  };

  render() {
    const {
      showTypes=DEFAULT_SHOW_TYPES,
      model: { screenMessage = [] },
      className,
    } = this.props;
    const { isExpanded } = this.state;
    // 过滤掉有其他type的
    const list = screenMessage.filter(item => showTypes.includes(+item.type));
    // 收缩显示3个，展开最大显示100个
    const newList = isExpanded ? list.slice(0, 100) : list.slice(0, 3);

    return (
      <NewSection
        title="实时消息"
        className={className}
        style={{ display: 'flex', flexDirection: 'column', height: 'auto', position: 'absolute' }}
        titleStyle={{ flex: 'none' }}
        contentStyle={{
          flex: '1',
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          backgroundColor: 'rgba(17, 58, 112, 0.9)' /* padding: '16px 0' */,
        }}
        scroll={{
          className: styles.scroll,
        }}
        other={
          list.length > 3 && (
            <Icon
              type={isExpanded ? 'double-left' : 'double-right'}
              className={styles.expandButton}
              onClick={this.handleClickExpandButton}
            />
          )
        }
        planB
      >
        {newList.length > 0 ? (
          newList.map((item, index) => {
            return this.renderMsg(item, index);
          })
        ) : (
          <div className={styles.emptyData}>暂无消息</div>
        )}
      </NewSection>
    );
  }
}
