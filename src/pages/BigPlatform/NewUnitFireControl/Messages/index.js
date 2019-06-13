import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import NewSection from '@/components/NewSection';
import moment from 'moment';
import { vaguePhone } from '../utils';
// import DescriptionList from 'components/DescriptionList';
import styles from './index.less';

const TYPES = [1, 2, 3, 4, 7, 9, 11, 13, 14, 15, 16, 17, 18, 36, 37, 38, 39, 40, 41];
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

const isVague = false;
function nameToVague(str) {
  let newStr = '';
  if (str && str.length === 1) return str;
  else if (str && str.length === 2) {
    newStr = str.substr(0, 1) + '*';
  } else if (str && str.length > 2) {
    newStr = str.substr(0, 1) + '*' + str.substr(-1);
  } else return str;
  return newStr;
}

function phoneToVague(str) {
  if (!str) return str;
  const newStr = str.substr(0, 3) + '****' + str.substr(-4);
  return newStr;
}

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
      // 是否展开告警信息
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
      handleParentChange,
      fetchData,
      handleViewDangerDetail,
      handleClickMessage,
      handleFaultClick,
      handleFireMessage,
      handleWorkOrderCardClickMsg,
      handleViewWater,
      handleClickMsgFlow,
      phoneVisible,
    } = this.props;
    const {
      type,
      title,
      messageFlag,
      proceCompany,
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
      resultFeedBack,
      proceUser,
      proceContent,
      checkResult,
      checkUser,
      score,
      maintenanceCompany,
      maintenanceUser,
      // addTimeStr,
      deviceType,
      area,
      location,
      paramName,
      condition,
      virtualName,
      messageContent,
      count,
      newTime,
      realTimeData,
      component,
      unitTypeName,
      createBy,
      createByPhone,
      systemTypeValue,
      workOrder,
      realtimeVal,
      num,
      lastTime,
      isOver,
      cameraMessage,
      faultName,
      firstTime,
    } = msg;
    const repeatCount = +isOver === 0 ? count : num;
    const lastReportTime = moment(addTime).format('YYYY-MM-DD HH:mm');
    const repeat = {
      times: repeatCount,
      lastreportTime: addTime,
    };
    const occurData = [
      {
        create_time: firstTime,
        create_date: firstTime,
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
      },
    ];
    const restParams = [repeat, cameraMessage, occurData];
    const msgFlag = messageFlag[0] === '[' ? JSON.parse(messageFlag)[0] : messageFlag;
    let msgSettings = {};
    if (TYPES.indexOf(+type) < 0) return null;
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
          { name: '检查点', value: installAddress },
          { name: '检查人', value: checkUser },
          { name: '巡查结果', value: checkResult },
        ],
      },
      '14': {
        // 上报隐患
        onClick: () => {
          handleViewDangerDetail({ id: messageFlag });
        },
        items: [
          { name: '检查点', value: installAddress },
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
          { name: '检查点', value: installAddress },
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
            value: Array.isArray(maintenanceUser) ? maintenanceUser.join('，') : maintenanceUser,
          },
          { name: '消防设施评分', value: score },
        ],
      },
      '36': {
        // 水系统报警
        onClick: () => {
          handleViewWater([101, 102, 103].indexOf(+deviceType), deviceType);
        },
        items: [
          {
            value:
              +deviceType === 101 ? '消火栓系统' : +deviceType === 102 ? '喷淋系统' : '水池/水箱',
          },
          {
            value:
              virtualName + '-' + paramName + (condition === '>=' ? '高于' : '低于') + '报警值',
          },
        ],
      },
      '37': {
        // 水系统恢复
        onClick: () => {
          handleViewWater([101, 102, 103].indexOf(+deviceType), deviceType);
        },
        items: [
          {
            value:
              +deviceType === 101 ? '消火栓系统' : +deviceType === 102 ? '喷淋系统' : '水池/水箱',
          },
          { value: virtualName + '恢复正常' },
        ],
      },
      '39': {
        // 可燃气体报警
        onClick: () => {
          handleClickMsgFlow({ id: msgFlag }, 2, 0, ...restParams);
        },
        items: [
          { name: '报警值', value: `${paramName}(${realtimeVal}%)` },
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
          return null;
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
    };
    [7, 9].forEach(item => {
      // 主机报警, 报障
      msgSettings = {
        ...msgSettings,
        [item.toString()]: {
          onClick: () => {
            if (+item === 7) handleClickMsgFlow({ id: msgFlag }, 0, 0, ...restParams);
            else if (+item === 9) handleClickMsgFlow({ id: msgFlag }, 0, 1, ...restParams);
            // if (+item === 7) handleClickMessage(messageFlag, { ...msg });
            // else if (+item === 9) handleFaultClick({ ...msg });
          },
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
            { name: '检查点', value: installAddress },
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
            if (+item === 38) handleClickMsgFlow({ id: msgFlag }, 1, 0, ...restParams);
            else if (+item === 40) handleClickMsgFlow({ id: msgFlag }, 1, 1, ...restParams);
          },
          items: [{ name: '所在区域', value: area }, { name: '所在位置', value: location }],
          showMsg: true,
          isRepeat: true,
        },
      };
    });

    const { onClick, items, isRepeat, showMsg } = msgSettings[type.toString()] || { items: [] };
    return (
      <div className={styles.msgItem} key={index}>
        {onClick && (
          <a className={styles.detailBtn} onClick={onClick}>
            详情
            <Icon type="double-right" />
          </a>
        )}
        <div className={styles.msgTime}>{formatTime(addTime)}</div>
        <div className={styles.msgType}>
          {title}
          {showMsg && (
            <span>
              ——
              {messageContent}
            </span>
          )}
        </div>
        {items.map((item, i) => {
          const { name, value } = item;
          return (
            <div className={styles.msgBody} key={i}>
              {name ? `${name}：` : ''}
              {value || getEmptyData()}
            </div>
          );
        })}
        {isRepeat &&
          repeatCount &&
          +repeatCount > 1 && (
            <div className={styles.msgType}>
              重复上报
              {repeatCount}
              次，最近一次更新时间：
              {lastReportTime}
            </div>
          )}
      </div>
    );
    // if (type === 1 || type === 2 || type === 3 || type === 4) {
    //   // 发生监管\联动\反馈\屏蔽
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         位置：
    //         {installAddress || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         回路故障号：
    //         {loopNumber || loopNumber === 0 ? `${loopNumber}回路${partNumber}号` : '暂无数据'}
    //       </div>
    //       <div className={styles.msgBody}>
    //         部件类型：
    //         {componentType || getEmptyData()}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 5 || type === 6) {
    //   // 发生火警, 发生故障
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <a
    //         className={styles.detailBtn}
    //         onClick={() => {
    //           if (type === 5) handleClickMessage(messageFlag, { ...msg });
    //           else handleFaultClick({ ...msg });
    //         }}
    //       >
    //         详情
    //         <Icon type="double-right" />
    //       </a>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         位置：
    //         {installAddress || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         回路故障号：
    //         {loopNumber || loopNumber === 0 ? `${loopNumber}回路${partNumber}号` : '暂无数据'}
    //       </div>
    //       <div className={styles.msgBody}>
    //         部件类型：
    //         {componentType || getEmptyData()}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 7) {
    //   // 火警确认
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <a
    //         className={styles.detailBtn}
    //         onClick={() => {
    //           handleFireMessage(JSON.parse(messageFlag));
    //         }}
    //       >
    //         详情
    //         <Icon type="double-right" />
    //       </a>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         位置：
    //         {address || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         处理人：
    //         {isVague ? nameToVague(proceUser) : proceUser || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         确认结果：
    //         {resultFeedBack || getEmptyData()}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 8 || type === 19) {
    //   // 真实火警处理，误报火警处理
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <a
    //         className={styles.detailBtn}
    //         onClick={() => {
    //           handleFireMessage(JSON.parse(messageFlag));
    //         }}
    //       >
    //         详情
    //         <Icon type="double-right" />
    //       </a>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         位置：
    //         {address || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         处理人：
    //         {isVague ? nameToVague(proceUser) : proceUser || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         处理内容：
    //         {proceContent || getEmptyData()}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 9) {
    //   // 开始故障维修
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <a
    //         className={styles.detailBtn}
    //         onClick={() => {
    //           handleParentChange({ maintenanceTitle: '故障处理动态' });
    //           handleWorkOrderCardClickMsg(JSON.parse(messageFlag));
    //         }}
    //       >
    //         详情
    //         <Icon type="double-right" />
    //       </a>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         位置：
    //         {address || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         维修人：
    //         {isVague ? nameToVague(proceUser) : proceUser || getEmptyData()}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 10 || type === 11) {
    //   // 故障指派维修, 维保开始维修
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <a
    //         className={styles.detailBtn}
    //         onClick={() => {
    //           if (type === 10) handleParentChange({ maintenanceTitle: '故障处理动态' });
    //           handleWorkOrderCardClickMsg(JSON.parse(messageFlag));
    //         }}
    //       >
    //         详情
    //         <Icon type="double-right" />
    //       </a>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         位置：
    //         {address || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         {type === 10 ? '上报' : '维修'}
    //         单位：
    //         {proceCompany}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 12) {
    //   // 完成故障维修
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <a
    //         className={styles.detailBtn}
    //         onClick={() => {
    //           handleParentChange({ maintenanceTitle: '故障处理动态' });
    //           handleWorkOrderCardClickMsg(JSON.parse(messageFlag));
    //         }}
    //       >
    //         详情
    //         <Icon type="double-right" />
    //       </a>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         位置：
    //         {address || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         维修单位：
    //         {proceCompany || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         维修人：
    //         {isVague ? nameToVague(proceUser) : proceUser}
    //       </div>
    //       <div className={styles.msgBody}>
    //         结果反馈：
    //         {resultFeedBack}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 13) {
    //   // 安全巡查
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         检查点：
    //         {pointName}
    //       </div>
    //       <div className={styles.msgBody}>
    //         巡查人：
    //         {isVague ? nameToVague(checkUser) : checkUser || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         巡查结果：
    //         {checkResult}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 14) {
    //   // 上报隐患
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <a
    //         className={styles.detailBtn}
    //         onClick={() => {
    //           handleViewDangerDetail({ id: messageFlag });
    //         }}
    //       >
    //         详情
    //         <Icon type="double-right" />
    //       </a>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         检查点：
    //         {pointName}
    //       </div>
    //       <div className={styles.msgBody}>
    //         隐患描述：
    //         {dangerDesc || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         上报人：
    //         {isVague ? nameToVague(reportUser) : reportUser}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 15 || type === 16) {
    //   // 整改隐患, 重新整改隐患
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <a
    //         className={styles.detailBtn}
    //         onClick={() => {
    //           handleViewDangerDetail({ id: messageFlag });
    //         }}
    //       >
    //         详情
    //         <Icon type="double-right" />
    //       </a>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         检查点：
    //         {pointName}
    //       </div>
    //       <div className={styles.msgBody}>
    //         隐患描述：
    //         {dangerDesc || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         整改人：
    //         {isVague ? nameToVague(rectifyUser) : rectifyUser}
    //       </div>
    //       <div className={styles.msgBody}>
    //         整改措施：
    //         {rectifyMeasures}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 17) {
    //   // 复查隐患
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <a
    //         className={styles.detailBtn}
    //         onClick={() => {
    //           handleViewDangerDetail({ id: messageFlag });
    //         }}
    //       >
    //         详情
    //         <Icon type="double-right" />
    //       </a>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         检查点：
    //         {pointName}
    //       </div>
    //       <div className={styles.msgBody}>
    //         隐患描述：
    //         {dangerDesc || getEmptyData()}
    //       </div>
    //       <div className={styles.msgBody}>
    //         复查人：
    //         {isVague ? nameToVague(reviewUser) : reviewUser}
    //       </div>
    //       <div className={styles.msgBody}>
    //         复查结果：
    //         {reviewResult}
    //       </div>
    //       <div className={styles.msgBody}>
    //         备注：
    //         {remark}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 18) {
    //   // 维保巡检
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <a
    //         className={styles.detailBtn}
    //         onClick={() => {
    //           handleParentChange({ maintenanceCheckDrawerVisible: true });
    //           fetchData(messageFlag);
    //         }}
    //       >
    //         详情
    //         <Icon type="double-right" />
    //       </a>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         维保单位：
    //         {maintenanceCompany}
    //       </div>
    //       <div className={styles.msgBody}>
    //         维保人：
    //         {Array.isArray(maintenanceUser)
    //           ? maintenanceUser
    //               .map(item => {
    //                 return isVague ? nameToVague(item) : item;
    //               })
    //               .join('，')
    //           : isVague
    //             ? nameToVague(maintenanceUser)
    //             : maintenanceUser}
    //       </div>
    //       <div className={styles.msgBody}>
    //         消防设施评分：
    //         {score}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 36) {
    //   // 动态监测报警
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <a
    //         className={styles.detailBtn}
    //         onClick={() => {
    //           handleViewWater([101, 102, 103].indexOf(+deviceType), deviceType);
    //         }}
    //       >
    //         详情
    //         <Icon type="double-right" />
    //       </a>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         {+deviceType === 101 ? '消火栓系统' : +deviceType === 102 ? '喷淋系统' : '水池/水箱'}
    //       </div>
    //       <div className={styles.msgBody}>
    //         {virtualName + '-' + paramName + (condition === '>=' ? '高于' : '低于') + '报警值'}
    //       </div>
    //     </div>
    //   );
    // } else if (type === 37) {
    //   // 动态监测恢复
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <a
    //         className={styles.detailBtn}
    //         onClick={() => {
    //           handleViewWater([101, 102, 103].indexOf(+deviceType), deviceType);
    //         }}
    //       >
    //         详情
    //         <Icon type="double-right" />
    //       </a>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //       <div className={styles.msgBody}>
    //         {+deviceType === 101 ? '消火栓系统' : +deviceType === 102 ? '喷淋系统' : '水池/水箱'}
    //       </div>
    //       <div className={styles.msgBody}>{virtualName + '恢复正常'}</div>
    //     </div>
    //   );
    // } else {
    //   msgItem = (
    //     <div className={styles.msgItem} key={index}>
    //       <div className={styles.msgTime}>{formatTime(addTime)}</div>
    //       <div className={styles.msgType}>{title}</div>
    //     </div>
    //   );
    // }
    // return msgItem;
  };

  render() {
    const {
      model: { screenMessage },
      className,
    } = this.props;
    const { isExpanded } = this.state;
    // 收缩显示3个，展开最大显示100个
    const list = isExpanded ? screenMessage.slice(0, 100) : screenMessage.slice(0, 3);

    return (
      <NewSection
        title="实时消息"
        className={className}
        style={{ display: 'flex', flexDirection: 'column', height: 'auto' }}
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
          screenMessage.length > 3 && (
            <Icon
              type={isExpanded ? 'double-left' : 'double-right'}
              className={styles.expandButton}
              onClick={this.handleClickExpandButton}
            />
          )
        }
        planB
      >
        {list.length > 0 ? (
          list.map((item, index) => {
            return this.renderMsg(item, index);
          })
        ) : (
          <div className={styles.emptyData}>暂无消息</div>
        )}
      </NewSection>
    );
  }
}
