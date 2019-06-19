import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import RealTimeMessage from '@/jingan-components/RealTimeMessage';
// 引入样式文件
import styles from './index.less';

function formatTime(time) {
  const diff = moment().diff(moment(time));
  if (diff >= 2 * 24 * 60 * 60 * 1000) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
  } else if (diff >= 24 * 60 * 60 * 1000) {
    return moment(time).format('昨日 HH:mm:ss');
  } else if (diff >= 60 * 60 * 1000) {
    return moment(time).format('今日 HH:mm:ss');
  } else if (diff >= 60 * 1000) {
    return `${moment.duration(diff).minutes()}分钟前`;
  } else {
    return '刚刚';
  }
}

@connect(({ operation }) => ({
  messages: operation.messages,
}))
export default class Message extends PureComponent {
  updateTimer = null;

  componentDidMount() {
    this.setUpdateTimer();
  }

  componentWillUnmount() {
    clearTimeout(this.updateTimer);
  }

  setUpdateTimer = () => {
    this.updateTimer = setTimeout(() => {
      this.forceUpdate();
      this.setUpdateTimer();
    }, 60 * 1000)
  }

  handleClick = (params) => {
    const { onClick } = this.props;
    onClick && onClick(params);
  }

  renderItem = (item, index) => {
    const {
      type,
      title,
      messageFlag,
      addTime,
      lastTime,
      installAddress,
      componentType,
      area,
      location,
      messageContent,
      count,
      component,
      unitTypeName,
      createBy,
      createByPhone,
      systemTypeValue,
      workOrder,
      isOver,
      cameraMessage,
      faultName,
      firstTime,
      companyName,
      companyId,
      enterSign,
    } = item;

    // 重复次数
    const repeatCount = count;
    // 最近一次更新时间
    const lastReportTime = moment(+isOver === 0 ? addTime : lastTime).format('YYYY-MM-DD HH:mm:ss');
    // 重复相关属性
    const repeat = {
      times: repeatCount,
      lastreportTime: addTime,
    };
    // 源数据
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
    const msgFlag = messageFlag&&(messageFlag[0] === '[' ? JSON.parse(messageFlag)[0] : messageFlag);
    const param = {
      dataId: +isOver === 0 ? msgFlag : undefined,
      id: +isOver !== 0 ? msgFlag : undefined,
      companyName: companyName || undefined,
      component: component || undefined,
      unitTypeName: unitTypeName || undefined,
      companyId: companyId||undefined,
    };

    let fields;
    let t;
    let s;
    switch (+type) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 7:
        s = 0;
      case 9:
        s = +(s !== 0);
        t = 0;
        fields =  [
          { label: '单位', value: companyName },
          { label: '部件', value: unitTypeName },
        ];
        break;
      case 38:
        s = 0;
      case 40:
        s = +(s !== 0);
      case 46:
      case 47:
      case 50:
      case 51:
        t = 1;
        fields =  [
          { label: '单位', value: companyName },
          { label: '位置', value: `${area || ''}${location || ''}` },
        ];
        break;
      case 11:
        t = 3;
        fields =  [
          { value: systemTypeValue },
          { label: '工单编号', value: workOrder },
          {
            label: '报修人员',
            value: `${createBy || ''} ${createByPhone ? `${createByPhone}`.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : ''}`,
          },
        ];
        break;
      default:
        break;
    }

    return fields && (
      <div className={styles.item} key={index}>
        <div className={styles.timerWrapper}>
          <div className={styles.time}>{formatTime(addTime)}</div>
          {([7,9].includes(+type) && enterSign === '1' ||  [38,40].includes(+type)) && (
            <div className={styles.detail}>
              <span onClick={() => this.handleClick({
                cameraMessage,
                occurData,
                repeat,
                param,
                type: t,
                status: s,
              })}>详情>></span>
            </div>
          )}
        </div>
        <div className={styles.titleWrapper}>
          {`${title.startsWith('【') ? title : `【${title}】`}${messageContent && [7,9,11,38,40].includes(+type) ? `——${messageContent}` : ''}`}
        </div>
        {fields.map(({ label, value }, i) => (
          <div className={styles.field} key={i}>
            {label && <div className={styles.fieldLabel}><span>{label}</span>：</div>}
            <div className={styles.fieldValue}>{value || '暂无数据'}</div>
          </div>
        ))}
        {[7,9,38,40].includes(+type) && repeatCount > 1 && (
          <div className={styles.mark}>
            重复上报
            <span className={styles.repeatCount}>{repeatCount}</span>
            <span className={styles.lastTimerPre}>次，最近一次更新时间：</span>
            <span className={styles.lastTime}>{lastReportTime}</span>
          </div>
        )}
      </div>
    );
  };

  render() {
    const {
      className,
      style,
      messages=[],
    } = this.props;

    return (
      <RealTimeMessage
        className={className}
        style={style}
        data={messages}
        render={(...args) => this.renderItem(...args)}
      />
    );
  }
}
